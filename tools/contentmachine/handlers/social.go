package handlers

import (
	"distribute/config"
	"distribute/models"
	"fmt"
	"regexp"
	"strings"
)

func HandleSocialMedia(cfg *config.Config, content *models.Content, dryRun bool) error {
	// Build blog post URL
	folderName := generateFilenameFromTitle(content.Metadata.Title)
	blogURL := fmt.Sprintf("%s/news/blog/%s/", strings.TrimSuffix(cfg.BlogBaseURL, "/"), folderName)

	// Strip markdown links from description for social media
	description := stripMarkdownLinks(content.Metadata.Description)

	// Generate the social media post text
	mainPost := fmt.Sprintf("%s\n\nRead more: %s\n\n%s",
		description,
		blogURL,
		content.Metadata.SocialMediaHashtags,
	)

	fmt.Println("\n" + strings.Repeat("=", 80))
	fmt.Println("SOCIAL MEDIA POSTS")
	fmt.Println(strings.Repeat("=", 80))

	fmt.Printf("\n[MAIN POST]:\n")
	fmt.Println(strings.Repeat("-", 70))
	fmt.Println(mainPost)
	fmt.Println(strings.Repeat("-", 70))

	// Show character counts per platform
	fmt.Printf("\nCharacter count: %d\n", len(mainPost))
	fmt.Printf("  Twitter limit:  %d (%s)\n", models.TwitterLimit, withinLimit(len(mainPost), models.TwitterLimit))
	fmt.Printf("  LinkedIn limit: %d (%s)\n", models.LinkedInLimit, withinLimit(len(mainPost), models.LinkedInLimit))
	fmt.Printf("  Bluesky limit:  %d (%s)\n", models.BlueskyLimit, withinLimit(len(mainPost), models.BlueskyLimit))

	fmt.Printf("\n%s\n", strings.Repeat("=", 80))
	fmt.Println("INSTRUCTIONS:")
	fmt.Println("1. Copy the post above and paste into your social media platforms")
	fmt.Println("2. Adjust length as needed for platforms with shorter limits")
	fmt.Println("3. Attach the banner image from the content/ folder")
	fmt.Printf("%s\n\n", strings.Repeat("=", 80))

	return nil
}

func withinLimit(length, limit int) string {
	if length <= limit {
		return "OK"
	}
	return fmt.Sprintf("OVER by %d", length-limit)
}

// stripMarkdownLinks removes markdown links from text, keeping only the link text
func stripMarkdownLinks(text string) string {
	re := regexp.MustCompile(`\[([^\]]+)\]\([^)]+\)`)
	return re.ReplaceAllString(text, "$1")
}
