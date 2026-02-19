package main

import (
	"distribute/config"
	"distribute/handlers"
	"distribute/parser"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
)

var (
	filePath string
	dryRun   bool
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
	rootCmd.MarkFlagRequired("file")
	rootCmd.Flags().BoolVarP(&dryRun, "dry-run", "d", false, "Show what would be done without making changes")

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run(cmd *cobra.Command, args []string) {
	// Load .env file
	if err := godotenv.Load(); err != nil {
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
	if err := handlers.HandleSocialMedia(cfg, content, dryRun); err != nil {
		log.Fatalf("Error generating social media text: %v", err)
	}

	if dryRun {
		log.Println("INFO: Dry run completed successfully")
	} else {
		log.Println("INFO: Content distribution completed successfully")
	}
}
