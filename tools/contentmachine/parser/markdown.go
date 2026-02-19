package parser

import (
	"distribute/models"
	"fmt"
	"os"
	"strings"

	"gopkg.in/yaml.v3"
)

func ParseMarkdownFile(filePath string) (*models.Content, error) {
	fileContent, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	content := &models.Content{
		OriginalPath: filePath,
	}

	// Split frontmatter and body
	parts := strings.SplitN(string(fileContent), "---", 3)
	if len(parts) < 3 {
		return nil, fmt.Errorf("invalid markdown format: frontmatter not found")
	}

	// Parse frontmatter
	if err := yaml.Unmarshal([]byte(parts[1]), &content.Metadata); err != nil {
		return nil, fmt.Errorf("failed to parse frontmatter: %w", err)
	}

	// Body is everything after frontmatter
	content.Body = strings.TrimSpace(parts[2])

	return content, nil
}
