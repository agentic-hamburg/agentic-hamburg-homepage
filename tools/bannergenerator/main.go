package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	"google.golang.org/genai"
)

var (
	post   string
	prompt string
	count  int32
	dryRun bool
	images []string
)

func main() {
	var rootCmd = &cobra.Command{
		Use:   "bannergenerator",
		Short: "Generate banner images for blog posts",
		Long: `A CLI tool that generates banner images for blog posts.

Two modes:
  1. Text-only (Imagen): Generate from a text prompt using Imagen 4.0
  2. Compose (Gemini): Supply input images (photos, logos) and a prompt
     to compose a banner using Gemini 2.5 Flash Image

Both modes combine BANNER_GUIDELINES.md with your prompt.`,
		RunE: run,
	}

	rootCmd.Flags().StringVarP(&post, "post", "p", "", "Post folder name (required)")
	rootCmd.MarkFlagRequired("post")
	rootCmd.Flags().StringVarP(&prompt, "prompt", "m", "", "Image prompt (required)")
	rootCmd.MarkFlagRequired("prompt")
	rootCmd.Flags().Int32VarP(&count, "count", "c", 4, "Number of images to generate (1-4, Imagen mode only)")
	rootCmd.Flags().BoolVarP(&dryRun, "dry-run", "d", false, "Print combined prompt without calling the API")
	rootCmd.Flags().StringSliceVarP(&images, "images", "i", nil, "Input image paths for composition mode (uses Gemini instead of Imagen)")

	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func run(cmd *cobra.Command, args []string) error {
	if count < 1 || count > 4 {
		return fmt.Errorf("count must be between 1 and 4, got %d", count)
	}

	// Find repo root by looking for BANNER_GUIDELINES.md
	repoRoot, err := findRepoRoot()
	if err != nil {
		return fmt.Errorf("finding repo root: %w", err)
	}

	// Read BANNER_GUIDELINES.md
	guidelinesPath := filepath.Join(repoRoot, "BANNER_GUIDELINES.md")
	guidelinesBytes, err := os.ReadFile(guidelinesPath)
	if err != nil {
		return fmt.Errorf("reading BANNER_GUIDELINES.md: %w", err)
	}
	guidelines := string(guidelinesBytes)

	// Combine prompts
	combined := fmt.Sprintf("%s\n\n## Specific prompt for this image\n%s", guidelines, prompt)

	if dryRun {
		fmt.Println(combined)
		if len(images) > 0 {
			fmt.Println("\n## Input images:")
			for _, img := range images {
				fmt.Printf("  - %s\n", img)
			}
			fmt.Println("\nMode: Gemini 2.5 Flash Image (composition)")
		} else {
			fmt.Println("\nMode: Imagen 4.0 (text-to-image)")
		}
		return nil
	}

	// Load .env file from repo root
	_ = godotenv.Load(filepath.Join(repoRoot, ".env"))

	apiKey := os.Getenv("GOOGLE_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("GOOGLE_API_KEY environment variable is not set")
	}

	// Ensure output directory exists
	outputDir := filepath.Join(repoRoot, "content", post)
	if _, err := os.Stat(outputDir); os.IsNotExist(err) {
		return fmt.Errorf("post directory does not exist: %s", outputDir)
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
		HTTPOptions: genai.HTTPOptions{
			Timeout: ptr(120 * time.Second),
		},
	})
	if err != nil {
		return fmt.Errorf("creating genai client: %w", err)
	}

	if len(images) > 0 {
		return runGeminiCompose(ctx, client, combined, guidelines, outputDir, repoRoot)
	}
	return runImagen(ctx, client, combined, guidelines, outputDir)
}

// runImagen generates images from text using Imagen 4.0
func runImagen(ctx context.Context, client *genai.Client, combined, guidelines, outputDir string) error {
	config := &genai.GenerateImagesConfig{
		NumberOfImages: count,
		AspectRatio:    ParseAspectRatio(guidelines),
	}

	response, err := client.Models.GenerateImages(ctx, "imagen-4.0-generate-001", combined, config)
	if err != nil {
		return fmt.Errorf("generating images: %w", err)
	}

	if len(response.GeneratedImages) == 0 {
		return fmt.Errorf("no images were generated")
	}

	for n, image := range response.GeneratedImages {
		var filename string
		if count == 1 {
			filename = "banner.png"
		} else {
			filename = fmt.Sprintf("banner-%d.png", n+1)
		}
		outputPath := filepath.Join(outputDir, filename)

		if err := os.WriteFile(outputPath, image.Image.ImageBytes, 0644); err != nil {
			return fmt.Errorf("writing image %s: %w", outputPath, err)
		}
		fmt.Println(outputPath)
	}

	return nil
}

// runGeminiCompose uses Gemini 2.5 Flash Image to compose a banner from input images + prompt
func runGeminiCompose(ctx context.Context, client *genai.Client, combined, guidelines, outputDir, repoRoot string) error {
	// Build parts: text prompt + input images
	parts := []*genai.Part{
		genai.NewPartFromText(combined),
	}

	for _, imgPath := range images {
		// Resolve relative paths against repo root
		if !filepath.IsAbs(imgPath) {
			imgPath = filepath.Join(repoRoot, imgPath)
		}

		imgData, err := os.ReadFile(imgPath)
		if err != nil {
			return fmt.Errorf("reading image %s: %w", imgPath, err)
		}

		mimeType := "image/png"
		ext := strings.ToLower(filepath.Ext(imgPath))
		switch ext {
		case ".jpg", ".jpeg":
			mimeType = "image/jpeg"
		case ".webp":
			mimeType = "image/webp"
		}

		parts = append(parts, &genai.Part{
			InlineData: &genai.Blob{
				MIMEType: mimeType,
				Data:     imgData,
			},
		})

		fmt.Printf("Loaded image: %s (%s, %d bytes)\n", filepath.Base(imgPath), mimeType, len(imgData))
	}

	// Generate with Gemini 2.5 Flash Image
	var n int32
	for n = 1; n <= count; n++ {
		result, err := client.Models.GenerateContent(ctx, "gemini-2.5-flash-image", []*genai.Content{
			{Parts: parts},
		}, &genai.GenerateContentConfig{
			ResponseModalities: []string{"IMAGE", "TEXT"},
		})
		if err != nil {
			return fmt.Errorf("generating composed image: %w", err)
		}

		// Extract image from response
		saved := false
		for _, candidate := range result.Candidates {
			if candidate.Content == nil {
				continue
			}
			for _, part := range candidate.Content.Parts {
				if part.InlineData != nil && strings.HasPrefix(part.InlineData.MIMEType, "image/") {
					var filename string
					if count == 1 {
						filename = "banner.png"
					} else {
						filename = fmt.Sprintf("banner-%d.png", n)
					}
					outputPath := filepath.Join(outputDir, filename)

					if err := os.WriteFile(outputPath, part.InlineData.Data, 0644); err != nil {
						return fmt.Errorf("writing image %s: %w", outputPath, err)
					}
					fmt.Println(outputPath)
					saved = true
				}
				if part.Text != "" {
					fmt.Printf("Model note: %s\n", part.Text)
				}
			}
		}

		if !saved {
			fmt.Printf("Warning: attempt %d produced no image\n", n)
		}
	}

	return nil
}

// findRepoRoot walks up from the current working directory to find the repo root,
// identified by the presence of BANNER_GUIDELINES.md.
func findRepoRoot() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}

	for {
		if _, err := os.Stat(filepath.Join(dir, "BANNER_GUIDELINES.md")); err == nil {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}

	execPath, err := os.Executable()
	if err == nil {
		candidate := filepath.Join(filepath.Dir(execPath), "..", "..")
		candidate, err = filepath.Abs(candidate)
		if err == nil {
			if _, err := os.Stat(filepath.Join(candidate, "BANNER_GUIDELINES.md")); err == nil {
				return candidate, nil
			}
		}
	}

	return "", fmt.Errorf("could not find repo root (BANNER_GUIDELINES.md not found in any parent directory)")
}

// ParseAspectRatio extracts the aspect ratio from guidelines content.
// Falls back to "16:9" if not found.
func ParseAspectRatio(guidelines string) string {
	for _, line := range strings.Split(guidelines, "\n") {
		lower := strings.ToLower(line)
		if strings.Contains(lower, "aspect ratio") {
			for _, word := range strings.Fields(line) {
				word = strings.TrimRight(word, ".,;:!?")
				parts := strings.Split(word, ":")
				if len(parts) == 2 {
					if isNumeric(parts[0]) && isNumeric(parts[1]) {
						return word
					}
				}
			}
		}
	}
	return "16:9"
}

func isNumeric(s string) bool {
	if s == "" {
		return false
	}
	for _, c := range s {
		if c < '0' || c > '9' {
			return false
		}
	}
	return true
}

func ptr(d time.Duration) *time.Duration { return &d }
