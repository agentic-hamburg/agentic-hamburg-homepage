package config

import (
	"os"
	"path/filepath"
	"strings"
)

type Config struct {
	BlogContentPath      string   // Path to blog content directory (e.g., src/data/news/blog)
	BlogBaseURL          string   // Base URL of the blog (e.g., https://agentic.hamburg)
	BufferAPIToken       string   // Buffer GraphQL API token
	BufferOrganizationID string   // Buffer organization ID used for channel listing
	BufferChannelIDs     []string // Buffer channel IDs to publish to
	BufferMode           string   // Buffer sharing mode, currently addToQueue
	BufferMediaURL       string   // Optional public media URL for image posts
}

func normalizeBaseURL(raw string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return ""
	}
	raw = strings.TrimRight(raw, "/")

	if strings.HasPrefix(raw, "http://") || strings.HasPrefix(raw, "https://") {
		return raw
	}

	return "https://" + raw
}

func expandHomeDir(path string) string {
	if path == "" {
		return ""
	}

	if path == "~" || strings.HasPrefix(path, "~/") {
		home, err := os.UserHomeDir()
		if err != nil || home == "" {
			return path
		}
		if path == "~" {
			return home
		}
		return filepath.Join(home, strings.TrimPrefix(path, "~/"))
	}

	return path
}

func Load() (*Config, error) {
	cfg := &Config{}

	cfg.BlogContentPath = os.Getenv("BLOG_CONTENT_PATH")
	cfg.BlogContentPath = expandHomeDir(cfg.BlogContentPath)
	if cfg.BlogContentPath == "" {
		cfg.BlogContentPath = "src/data/news/blog"
	}

	cfg.BlogBaseURL = os.Getenv("BLOG_BASE_URL")
	cfg.BlogBaseURL = normalizeBaseURL(cfg.BlogBaseURL)
	if cfg.BlogBaseURL == "" {
		cfg.BlogBaseURL = "https://agentic.hamburg"
	}

	cfg.BufferAPIToken = strings.TrimSpace(os.Getenv("BUFFER_API_TOKEN"))
	cfg.BufferOrganizationID = strings.TrimSpace(os.Getenv("BUFFER_ORGANIZATION_ID"))
	cfg.BufferChannelIDs = splitCSV(os.Getenv("BUFFER_CHANNEL_IDS"))
	cfg.BufferMode = strings.TrimSpace(os.Getenv("BUFFER_MODE"))
	if cfg.BufferMode == "" {
		cfg.BufferMode = "addToQueue"
	}
	cfg.BufferMediaURL = strings.TrimSpace(os.Getenv("BUFFER_MEDIA_URL"))

	return cfg, nil
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
