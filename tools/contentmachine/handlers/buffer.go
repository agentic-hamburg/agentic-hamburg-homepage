package handlers

import (
	"bytes"
	"distribute/config"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const bufferGraphQLEndpoint = "https://api.buffer.com"

type BufferClient struct {
	apiToken   string
	httpClient *http.Client
}

type BufferPostInput struct {
	Text      string
	ChannelID string
	Mode      string
	MediaURL  string
}

type BufferPost struct {
	ID    string
	Text  string
	DueAt string
}

type bufferGraphQLRequest struct {
	Query string `json:"query"`
}

type bufferGraphQLResponse struct {
	Data   json.RawMessage  `json:"data"`
	Errors []bufferAPIError `json:"errors"`
}

type bufferAPIError struct {
	Message string `json:"message"`
}

func NewBufferClient(apiToken string) (*BufferClient, error) {
	apiToken = strings.TrimSpace(apiToken)
	if apiToken == "" {
		return nil, fmt.Errorf("BUFFER_API_TOKEN is required")
	}

	return &BufferClient{
		apiToken: apiToken,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}, nil
}

func HandleListBufferChannels(cfg *config.Config) error {
	client, err := NewBufferClient(cfg.BufferAPIToken)
	if err != nil {
		return err
	}

	if cfg.BufferOrganizationID == "" {
		organizations, err := client.GetOrganizations()
		if err != nil {
			return err
		}

		fmt.Println("BUFFER ORGANIZATIONS:")
		for _, org := range organizations {
			fmt.Printf("  %s\t%s\n", org.ID, org.Name)
		}
		fmt.Println("\nSet BUFFER_ORGANIZATION_ID to one of these IDs, then run --list-buffer-channels again.")
		return nil
	}

	channels, err := client.GetChannels(cfg.BufferOrganizationID)
	if err != nil {
		return err
	}

	fmt.Println("BUFFER CHANNELS:")
	for _, channel := range channels {
		fmt.Printf("  %s\t%s\t%s\t%s\n", channel.ID, channel.Service, channel.DisplayName, pausedLabel(channel.IsQueuePaused))
	}
	return nil
}

type BufferOrganization struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type BufferChannel struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	DisplayName   string `json:"displayName"`
	Service       string `json:"service"`
	IsQueuePaused bool   `json:"isQueuePaused"`
}

func (c *BufferClient) GetOrganizations() ([]BufferOrganization, error) {
	const query = `
query GetOrganizations {
  account {
    organizations {
      id
      name
    }
  }
}`

	var payload struct {
		Account struct {
			Organizations []BufferOrganization `json:"organizations"`
		} `json:"account"`
	}
	if err := c.do(query, &payload); err != nil {
		return nil, err
	}
	return payload.Account.Organizations, nil
}

func (c *BufferClient) GetChannels(organizationID string) ([]BufferChannel, error) {
	query := fmt.Sprintf(`
query GetChannels {
  channels(input: {
    organizationId: %s
  }) {
    id
    name
    displayName
    service
    isQueuePaused
  }
}`, strconv.Quote(organizationID))

	var payload struct {
		Channels []BufferChannel `json:"channels"`
	}
	if err := c.do(query, &payload); err != nil {
		return nil, err
	}
	return payload.Channels, nil
}

func (c *BufferClient) CreatePost(input BufferPostInput) (*BufferPost, error) {
	mode := strings.TrimSpace(input.Mode)
	if mode == "" {
		mode = "addToQueue"
	}
	if !isAllowedBufferMode(mode) {
		return nil, fmt.Errorf("unsupported Buffer mode %q", mode)
	}

	assets := ""
	if strings.TrimSpace(input.MediaURL) != "" {
		assets = fmt.Sprintf(`
    assets: [
      {
        image: {
          url: %s
        }
      }
    ]`, strconv.Quote(strings.TrimSpace(input.MediaURL)))
	}

	query := fmt.Sprintf(`
mutation CreatePost {
  createPost(input: {
    text: %s
    channelId: %s
    schedulingType: automatic
    mode: %s%s
  }) {
    ... on PostActionSuccess {
      post {
        id
        text
        dueAt
      }
    }
    ... on MutationError {
      message
    }
  }
}`, strconv.Quote(input.Text), strconv.Quote(input.ChannelID), mode, assets)

	var payload struct {
		CreatePost struct {
			Post    BufferPost `json:"post"`
			Message string     `json:"message"`
		} `json:"createPost"`
	}
	if err := c.do(query, &payload); err != nil {
		return nil, err
	}
	if payload.CreatePost.Message != "" {
		return nil, fmt.Errorf("buffer mutation error: %s", payload.CreatePost.Message)
	}
	if payload.CreatePost.Post.ID == "" {
		return nil, fmt.Errorf("buffer mutation did not return a post ID")
	}
	return &payload.CreatePost.Post, nil
}

func (c *BufferClient) do(query string, target any) error {
	requestBody, err := json.Marshal(bufferGraphQLRequest{Query: query})
	if err != nil {
		return fmt.Errorf("failed to encode Buffer request: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, bufferGraphQLEndpoint, bytes.NewReader(requestBody))
	if err != nil {
		return fmt.Errorf("failed to build Buffer request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+c.apiToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to call Buffer API: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read Buffer response: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("buffer API returned HTTP %d: %s", resp.StatusCode, strings.TrimSpace(string(body)))
	}

	var gqlResp bufferGraphQLResponse
	if err := json.Unmarshal(body, &gqlResp); err != nil {
		return fmt.Errorf("failed to decode Buffer response: %w", err)
	}

	if len(gqlResp.Errors) > 0 {
		var messages []string
		for _, gqlErr := range gqlResp.Errors {
			messages = append(messages, gqlErr.Message)
		}
		return fmt.Errorf("buffer GraphQL error: %s", strings.Join(messages, "; "))
	}

	if err := json.Unmarshal(gqlResp.Data, target); err != nil {
		return fmt.Errorf("failed to decode Buffer data: %w", err)
	}

	return nil
}

func pausedLabel(paused bool) string {
	if paused {
		return "queue paused"
	}
	return "queue active"
}

func isAllowedBufferMode(mode string) bool {
	switch mode {
	case "addToQueue":
		return true
	default:
		return false
	}
}
