package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Config struct {
	BlogContentPath string // Path to blog content directory (e.g., src/data/news/blog)
	BlogBaseURL     string // Base URL of the blog (e.g., https://agentic.hamburg)
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
		return nil, fmt.Errorf("BLOG_CONTENT_PATH environment variable is required")
	}

	cfg.BlogBaseURL = os.Getenv("BLOG_BASE_URL")
	cfg.BlogBaseURL = normalizeBaseURL(cfg.BlogBaseURL)
	if cfg.BlogBaseURL == "" {
		return nil, fmt.Errorf("BLOG_BASE_URL environment variable is required")
	}

	return cfg, nil
}
