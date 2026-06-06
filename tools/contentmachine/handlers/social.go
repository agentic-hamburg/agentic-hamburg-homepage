package handlers

import (
	"distribute/config"
	"distribute/models"
	"fmt"
	"regexp"
	"strings"
)

func HandleSocialMedia(cfg *config.Config, content *models.Content, dryRun bool, publish bool) error {
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

	if !publish {
		fmt.Println("Buffer publishing disabled. Add --publish-social to queue posts in Buffer.")
		return nil
	}

	if dryRun {
		fmt.Println("Dry run: would publish social posts to Buffer.")
		return nil
	}

	client, err := NewBufferClient(cfg.BufferAPIToken)
	if err != nil {
		return err
	}

	if len(cfg.BufferChannelIDs) == 0 {
		return fmt.Errorf("BUFFER_CHANNEL_IDS is required when --publish-social is used")
	}

	fmt.Println("\nBUFFER:")
	for _, channelID := range cfg.BufferChannelIDs {
		post, err := client.CreatePost(BufferPostInput{
			Text:      mainPost,
			ChannelID: channelID,
			Mode:      cfg.BufferMode,
			MediaURL:  cfg.BufferMediaURL,
		})
		if err != nil {
			return fmt.Errorf("failed to publish to channel %s: %w", channelID, err)
		}
		fmt.Printf("  Created post %s for channel %s", post.ID, channelID)
		if post.DueAt != "" {
			fmt.Printf(" due at %s", post.DueAt)
		}
		fmt.Println()
	}

	return nil
}

func PublishBufferText(cfg *config.Config, text string, dryRun bool) error {
	text = strings.TrimSpace(text)
	if text == "" {
		return fmt.Errorf("post text cannot be empty")
	}

	fmt.Println("BUFFER POST:")
	fmt.Println(strings.Repeat("-", 70))
	fmt.Println(text)
	fmt.Println(strings.Repeat("-", 70))
	fmt.Printf("Character count: %d\n", len(text))

	if dryRun {
		fmt.Println("Dry run: would publish text to Buffer.")
		return nil
	}

	client, err := NewBufferClient(cfg.BufferAPIToken)
	if err != nil {
		return err
	}

	if len(cfg.BufferChannelIDs) == 0 {
		return fmt.Errorf("BUFFER_CHANNEL_IDS is required when publishing text")
	}

	for _, channelID := range cfg.BufferChannelIDs {
		post, err := client.CreatePost(BufferPostInput{
			Text:      text,
			ChannelID: channelID,
			Mode:      cfg.BufferMode,
			MediaURL:  cfg.BufferMediaURL,
		})
		if err != nil {
			return fmt.Errorf("failed to publish to channel %s: %w", channelID, err)
		}
		fmt.Printf("Created Buffer post %s for channel %s", post.ID, channelID)
		if post.DueAt != "" {
			fmt.Printf(" due at %s", post.DueAt)
		}
		fmt.Println()
	}

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
