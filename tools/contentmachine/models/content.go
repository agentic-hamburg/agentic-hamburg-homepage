package models

type PostMetadata struct {
	Title               string   `yaml:"title"`
	Description         string   `yaml:"description"`
	Author              string   `yaml:"author"`
	PublishDate         string   `yaml:"pubDatetime"`
	Tags                []string `yaml:"tags"`
	Featured            bool     `yaml:"featured"`
	Draft               bool     `yaml:"draft"`
	SocialMediaHashtags string   `yaml:"socialMediaHashtags"`
}

type Content struct {
	Metadata     PostMetadata
	Body         string
	OriginalPath string
}

const (
	TwitterLimit  = 280
	LinkedInLimit = 3000
	BlueskyLimit  = 300
)

type Platform string

const (
	PlatformTwitter  Platform = "twitter"
	PlatformLinkedIn Platform = "linkedin"
	PlatformBluesky  Platform = "bluesky"
)

func GetCharLimit(platform Platform) int {
	switch platform {
	case PlatformTwitter:
		return TwitterLimit
	case PlatformLinkedIn:
		return LinkedInLimit
	case PlatformBluesky:
		return BlueskyLimit
	default:
		return TwitterLimit
	}
}
