package main

import (
	"distribute/config"
	"distribute/handlers"
	"distribute/parser"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
)

var (
	filePath           string
	dryRun             bool
	publishSocial      bool
	listBufferChannels bool
	bufferChannelIDs   string
	bufferMode         string
	bufferMediaURL     string
	publishText        string
)

func main() {
	var rootCmd = &cobra.Command{
		Use:   "distribute",
		Short: "Distribute content to blog and social media",
		Long: `A CLI tool that parses structured Markdown files and distributes
content to the Astro blog and generates social media text for copy-paste.`,
		Run: run,
	}

	rootCmd.Flags().StringVarP(&filePath, "file", "f", "", "Path to the markdown file (required)")
	rootCmd.Flags().BoolVarP(&dryRun, "dry-run", "d", false, "Show what would be done without making changes")
	rootCmd.Flags().BoolVar(&publishSocial, "publish-social", false, "Publish social posts to Buffer instead of only printing copy")
	rootCmd.Flags().BoolVar(&listBufferChannels, "list-buffer-channels", false, "List Buffer channels for BUFFER_ORGANIZATION_ID")
	rootCmd.Flags().StringVar(&bufferChannelIDs, "buffer-channel-ids", "", "Comma-separated Buffer channel IDs; overrides BUFFER_CHANNEL_IDS")
	rootCmd.Flags().StringVar(&bufferMode, "buffer-mode", "", "Buffer post mode; defaults to BUFFER_MODE or addToQueue")
	rootCmd.Flags().StringVar(&bufferMediaURL, "buffer-media-url", "", "Optional public image URL to attach to Buffer posts")
	rootCmd.Flags().StringVar(&publishText, "publish-text", "", "Publish this exact text to Buffer without reading a content file")

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run(cmd *cobra.Command, args []string) {
	// Load .env file from the repo root when running from tools/contentmachine.
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("Warning: .env file not found, using environment variables only")
	}

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		if dryRun {
			log.Println("WARNING: Running in dry-run mode with mock configuration")
			cfg = &config.Config{
				BlogContentPath: "src/data/news/blog",
				BlogBaseURL:     "https://agentic.hamburg",
			}
		} else {
			log.Fatalf("Error loading configuration: %v", err)
		}
	}

	if bufferChannelIDs != "" {
		cfg.BufferChannelIDs = splitCSV(bufferChannelIDs)
	}
	if bufferMode != "" {
		cfg.BufferMode = bufferMode
	}
	if bufferMediaURL != "" {
		cfg.BufferMediaURL = bufferMediaURL
	}

	if listBufferChannels {
		if err := handlers.HandleListBufferChannels(cfg); err != nil {
			log.Fatalf("Error listing Buffer channels: %v", err)
		}
		return
	}

	if publishText != "" {
		if err := handlers.PublishBufferText(cfg, publishText, dryRun); err != nil {
			log.Fatalf("Error publishing text to Buffer: %v", err)
		}
		return
	}

	if filePath == "" {
		log.Fatal("Error: required flag \"file\" not set")
	}

	// Parse the markdown file
	content, err := parser.ParseMarkdownFile(filePath)
	if err != nil {
		log.Fatalf("Error parsing markdown file: %v", err)
	}

	log.Printf("INFO: Successfully parsed file: %s", filePath)
	log.Printf("INFO: Title: %s", content.Metadata.Title)

	// 1. Handle Astro blog post
	if err := handlers.HandleAstroPost(cfg, content, dryRun); err != nil {
		log.Fatalf("Error handling Astro post: %v", err)
	}

	// 2. Generate social media text
	if err := handlers.HandleSocialMedia(cfg, content, dryRun, publishSocial); err != nil {
		log.Fatalf("Error generating social media text: %v", err)
	}

	if dryRun {
		log.Println("INFO: Dry run completed successfully")
	} else {
		log.Println("INFO: Content distribution completed successfully")
	}
}

func splitCSV(raw string) []string {
	var values []string
	for _, value := range strings.Split(raw, ",") {
		value = strings.TrimSpace(value)
		if value != "" {
			values = append(values, value)
		}
	}
	return values
}
