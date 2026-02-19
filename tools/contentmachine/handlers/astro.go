package handlers

import (
	"distribute/config"
	"distribute/internal/assets"
	"distribute/models"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

func HandleAstroPost(cfg *config.Config, content *models.Content, dryRun bool) error {
	// Generate folder name from title
	folderName := generateFilenameFromTitle(content.Metadata.Title)

	// Extract year from publish date or use current year
	year := time.Now().Year()
	if content.Metadata.PublishDate != "" {
		if t, err := time.Parse(time.RFC3339, content.Metadata.PublishDate); err == nil {
			year = t.Year()
		} else if t, err := time.Parse("2006-01-02T15:04:05-07:00", content.Metadata.PublishDate); err == nil {
			year = t.Year()
		}
	}

	// Create the full path: content/blog/2025/post-folder/index.mdx
	postDir := filepath.Join(cfg.BlogContentPath, fmt.Sprintf("%d", year), folderName)
	destPath := filepath.Join(postDir, "index.mdx")

	// Check for banner image
	sourceDir := filepath.Dir(content.OriginalPath)
	bannerSourcePath, bannerFileName, err := assets.FindBannerFile(sourceDir)
	if err != nil {
		return fmt.Errorf("failed to find banner image: %w", err)
	}

	// Find all image files in the source directory (except banner which is handled separately)
	inlineImages := []string{}
	files, err := os.ReadDir(sourceDir)
	if err == nil {
		for _, file := range files {
			if file.IsDir() {
				continue
			}
			name := file.Name()
			ext := strings.ToLower(filepath.Ext(name))
			if (ext == ".png" || ext == ".jpg" || ext == ".jpeg" || ext == ".gif" || ext == ".webp") &&
				!strings.HasPrefix(name, "banner.") {
				inlineImages = append(inlineImages, name)
			}
		}
	}

	if dryRun {
		fmt.Println("📁 BLOG:")
		fmt.Printf("Would create directory: %s\n", postDir)
		fmt.Printf("Would create: %s\n", destPath)
		if bannerFileName != "" {
			fmt.Printf("Would copy banner: %s → %s\n", bannerSourcePath, filepath.Join(postDir, bannerFileName))
		}
		for _, img := range inlineImages {
			imgSource := filepath.Join(sourceDir, img)
			fmt.Printf("Would copy image: %s → %s\n", imgSource, filepath.Join(postDir, img))
		}
		return nil
	}

	// Create the post directory
	if err := os.MkdirAll(postDir, 0755); err != nil {
		return fmt.Errorf("failed to create post directory: %w", err)
	}

	// Copy banner image if it exists
	if bannerFileName != "" {
		bannerDestPath := filepath.Join(postDir, bannerFileName)
		if err := copyFile(bannerSourcePath, bannerDestPath); err != nil {
			log.Printf("WARNING: Failed to copy banner image: %v", err)
			bannerFileName = ""
		}
	}

	// Copy inline images
	for _, img := range inlineImages {
		imgSource := filepath.Join(sourceDir, img)
		imgDest := filepath.Join(postDir, img)
		if err := copyFile(imgSource, imgDest); err != nil {
			log.Printf("WARNING: Failed to copy image %s: %v", img, err)
		} else {
			log.Printf("INFO: Copied image %s", img)
		}
	}

	// Process body: remove banner image references to avoid duplication
	body := content.Body
	bannerImagePattern := regexp.MustCompile(`(?m)^!\[.*?\]\(.*?banner\.(png|jpg|jpeg)\)\s*\n*`)
	body = bannerImagePattern.ReplaceAllString(body, "")

	processedBody := processImagePathsForBlog(body)

	// Build the blog post content
	blogContent := buildBlogContent(content, processedBody, bannerFileName)

	// Write to destination file
	if err := os.WriteFile(destPath, []byte(blogContent), 0644); err != nil {
		return fmt.Errorf("failed to write blog file: %w", err)
	}

	log.Printf("INFO: Blog post created at %s", destPath)
	if bannerFileName != "" {
		log.Printf("INFO: Banner image copied as %s", bannerFileName)
	}

	return nil
}

// processImagePathsForBlog converts image paths to Astro Image components
func processImagePathsForBlog(content string) string {
	imageImports := make(map[string]string) // filename -> importName

	re := regexp.MustCompile(`!\[([^\]]*)\]\(([^)]+)\)`)

	// First pass: collect all images
	re.ReplaceAllStringFunc(content, func(match string) string {
		submatches := re.FindStringSubmatch(match)
		if len(submatches) < 3 {
			return match
		}

		imagePath := submatches[2]
		filename := filepath.Base(imagePath)

		ext := strings.ToLower(filepath.Ext(filename))
		imageExts := []string{".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}
		isImage := false
		for _, validExt := range imageExts {
			if ext == validExt {
				isImage = true
				break
			}
		}

		if isImage && imageImports[filename] == "" {
			baseName := strings.TrimSuffix(filename, filepath.Ext(filename))
			cleanName := regexp.MustCompile(`[^a-zA-Z0-9]+`).ReplaceAllString(baseName, "")
			importName := cleanName + "Img"
			imageImports[filename] = importName
		}

		return match
	})

	// Build imports section
	var importsBuilder strings.Builder
	if len(imageImports) > 0 {
		if !strings.Contains(content, "import { Image } from \"astro:assets\"") {
			importsBuilder.WriteString("import { Image } from \"astro:assets\";\n")
		}
		for filename, importName := range imageImports {
			importsBuilder.WriteString(fmt.Sprintf("import %s from \"./%s\";\n", importName, filename))
		}
		importsBuilder.WriteString("\n")
	}

	// Second pass: replace markdown images with Image components
	result := re.ReplaceAllStringFunc(content, func(match string) string {
		submatches := re.FindStringSubmatch(match)
		if len(submatches) < 3 {
			return match
		}

		altText := submatches[1]
		imagePath := submatches[2]
		filename := filepath.Base(imagePath)

		if importName, exists := imageImports[filename]; exists {
			return fmt.Sprintf("<Image src={%s} alt=\"%s\" widths={[400, 800, 1200]} sizes=\"(max-width: 800px) 100vw, 800px\" />", importName, altText)
		}

		return match
	})

	if len(imageImports) > 0 {
		result = importsBuilder.String() + result
	}

	return result
}

// buildBlogContent creates the blog post content with frontmatter
func buildBlogContent(content *models.Content, processedBody string, bannerFileName string) string {
	var builder strings.Builder

	// Add frontmatter
	builder.WriteString("---\n")

	author := content.Metadata.Author
	if author == "" {
		author = "Agentic Hamburg Team"
	}
	builder.WriteString(fmt.Sprintf("author: %s\n", author))

	// Use publish date from frontmatter, or current time in Berlin timezone
	if content.Metadata.PublishDate != "" {
		builder.WriteString(fmt.Sprintf("pubDatetime: %s\n", content.Metadata.PublishDate))
	} else {
		location, err := time.LoadLocation("Europe/Berlin")
		if err != nil {
			location = time.UTC
		}
		currentTime := time.Now().In(location)
		builder.WriteString(fmt.Sprintf("pubDatetime: %s\n", currentTime.Format(time.RFC3339)))
	}

	builder.WriteString(fmt.Sprintf("title: %q\n", content.Metadata.Title))

	builder.WriteString(fmt.Sprintf("featured: %t\n", content.Metadata.Featured))
	builder.WriteString(fmt.Sprintf("draft: %t\n", content.Metadata.Draft))

	builder.WriteString(fmt.Sprintf("description: %q\n", content.Metadata.Description))

	if len(content.Metadata.Tags) > 0 {
		builder.WriteString("tags:\n")
		for _, tag := range content.Metadata.Tags {
			builder.WriteString(fmt.Sprintf("  - %s\n", tag))
		}
	}

	builder.WriteString("---\n\n")

	// Strip the Image import from processed content if it exists (we'll add it once at the top)
	imageImportLine := "import { Image } from \"astro:assets\";\n"
	hasInlineImageImport := strings.Contains(processedBody, imageImportLine)
	cleanedBody := strings.Replace(processedBody, imageImportLine, "", 1)

	if bannerFileName != "" {
		// Always add the Image import first
		builder.WriteString("import { Image } from \"astro:assets\";\n")
		importName := strings.TrimSuffix(bannerFileName, filepath.Ext(bannerFileName)) + "Img"
		builder.WriteString(fmt.Sprintf("import %s from \"./%s\";\n", importName, bannerFileName))

		// Extract and add inline image imports
		lines := strings.Split(cleanedBody, "\n")
		var importLines []string
		var contentLines []string
		inImports := true
		for _, line := range lines {
			if inImports && strings.HasPrefix(line, "import ") {
				importLines = append(importLines, line)
			} else if inImports && strings.TrimSpace(line) == "" {
				continue
			} else {
				inImports = false
				contentLines = append(contentLines, line)
			}
		}

		for _, imp := range importLines {
			builder.WriteString(imp + "\n")
		}
		builder.WriteString("\n")

		builder.WriteString(fmt.Sprintf("<Image\n  src={%s}\n  alt=\"%s\"\n  widths={[400, 800, 1200]}\n  sizes=\"(max-width: 800px) 100vw, 800px\"\n/>\n\n", importName, content.Metadata.Title))

		builder.WriteString(strings.Join(contentLines, "\n"))
	} else if hasInlineImageImport {
		builder.WriteString(imageImportLine)
		builder.WriteString(cleanedBody)
	} else {
		builder.WriteString(processedBody)
	}

	return builder.String()
}

// generateFilenameFromTitle creates a clean folder name from the post title
func generateFilenameFromTitle(title string) string {
	filename := strings.ToLower(title)

	re := regexp.MustCompile(`[^a-z0-9\s]+`)
	filename = re.ReplaceAllString(filename, "")

	re = regexp.MustCompile(`\s+`)
	filename = re.ReplaceAllString(filename, " ")

	filename = strings.TrimSpace(filename)
	filename = strings.ReplaceAll(filename, " ", "-")

	return filename
}

// copyFile copies a file from source to destination
func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	return err
}
