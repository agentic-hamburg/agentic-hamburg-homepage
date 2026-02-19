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

# Default values if not set
BLOG_CONTENT_PATH="${BLOG_CONTENT_PATH:-src/data/news/blog}"
BLOG_BASE_URL="${BLOG_BASE_URL:-https://agentic.hamburg}"

# Check for --dry-run flag
DRY_RUN=""
if [[ "$*" == *"--dry-run"* ]]; then
    DRY_RUN="--dry-run"
fi

# Get post folder name from first argument
POST_FOLDER="$1"
shift || true

if [ -z "$POST_FOLDER" ]; then
    echo "Usage: ./distribute-post.sh <post-folder> [--dry-run]"
    echo "Example: ./distribute-post.sh meetup-5-recap --dry-run"
    exit 1
fi

CONTENT_PATH="content/${POST_FOLDER}/post.md"

if [ ! -f "$SCRIPT_DIR/$CONTENT_PATH" ]; then
    echo "Error: $SCRIPT_DIR/$CONTENT_PATH not found"
    exit 1
fi

echo "Distributing post: ${POST_FOLDER}..."

# Run the content machine with absolute path
cd "$SCRIPT_DIR/tools/contentmachine"
go run main.go --file "$SCRIPT_DIR/${CONTENT_PATH}" $DRY_RUN
