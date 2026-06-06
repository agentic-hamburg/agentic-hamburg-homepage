#!/bin/bash
set -e

# Get the directory where this script lives (absolute path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load environment variables from .env in project root
if [ -f ".env" ]; then
    set -a
    source .env
    set +a
fi

# Default values if not set, resolve to absolute paths
BLOG_CONTENT_PATH="${BLOG_CONTENT_PATH:-src/data/news/blog}"
# Make BLOG_CONTENT_PATH absolute (relative to repo root)
if [[ "$BLOG_CONTENT_PATH" != /* ]]; then
    BLOG_CONTENT_PATH="$SCRIPT_DIR/$BLOG_CONTENT_PATH"
fi
export BLOG_CONTENT_PATH
BLOG_BASE_URL="${BLOG_BASE_URL:-https://agentic.hamburg}"
export BLOG_BASE_URL

# Get post folder name from first argument
POST_FOLDER="$1"
shift || true

if [ -z "$POST_FOLDER" ]; then
    echo "Usage: ./distribute-post.sh <post-folder> [--dry-run] [--publish-social]"
    echo "       ./distribute-post.sh --list-buffer-channels"
    echo "       ./distribute-post.sh --publish-text \"Post copy\""
    echo "Example: ./distribute-post.sh meetup-5-recap --dry-run"
    exit 1
fi

if [ "$POST_FOLDER" = "--list-buffer-channels" ]; then
    cd "$SCRIPT_DIR/tools/contentmachine"
    go run main.go --list-buffer-channels
    exit 0
fi

if [ "$POST_FOLDER" = "--publish-text" ]; then
    cd "$SCRIPT_DIR/tools/contentmachine"
    go run main.go --publish-text "$@"
    exit 0
fi

CONTENT_PATH="content/${POST_FOLDER}/post.md"

if [ ! -f "$SCRIPT_DIR/$CONTENT_PATH" ]; then
    echo "Error: $SCRIPT_DIR/$CONTENT_PATH not found"
    exit 1
fi

echo "Distributing post: ${POST_FOLDER}..."

# Run the content machine with absolute path
cd "$SCRIPT_DIR/tools/contentmachine"
go run main.go --file "$SCRIPT_DIR/${CONTENT_PATH}" "$@"
