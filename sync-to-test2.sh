#!/bin/bash

# Sync script to copy contents from kyuri-code/test to kyuri-code/test2
# Usage: ./sync-to-test2.sh [GITHUB_TOKEN]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR"
TARGET_REPO="kyuri-code/test2"
TEMP_DIR="/tmp/test2-sync"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting sync from kyuri-code/test to $TARGET_REPO${NC}"

# Check if GITHUB_TOKEN is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Warning: No GitHub token provided. Using default authentication.${NC}"
    GITHUB_TOKEN="${GITHUB_TOKEN:-}"
else
    GITHUB_TOKEN="$1"
fi

# Clean up any existing temp directory
if [ -d "$TEMP_DIR" ]; then
    echo "Cleaning up existing temp directory..."
    rm -rf "$TEMP_DIR"
fi

# Clone the target repository
echo "Cloning target repository..."
if [ -n "$GITHUB_TOKEN" ]; then
    git clone "https://$GITHUB_TOKEN@github.com/$TARGET_REPO.git" "$TEMP_DIR"
else
    git clone "https://github.com/$TARGET_REPO.git" "$TEMP_DIR"
fi

# Configure git in the target repository
cd "$TEMP_DIR"

# Verify we're in the right directory
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Not in a git repository directory. Aborting.${NC}"
    exit 1
fi

git config user.name "Repository Sync"
git config user.email "noreply@github.com"

# Remove all files except .git
echo "Clearing target repository contents..."
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Not in a git repository directory. Aborting.${NC}"
    exit 1
fi

# Safely remove files, excluding .git and being explicit about what we're removing
find . -maxdepth 1 -type f -not -name '.gitignore' -delete 2>/dev/null || true
find . -maxdepth 1 -type d -not -name '.git' -not -name '.' -not -name '..' -exec rm -rf {} + 2>/dev/null || true

# Copy all files from source to target (using rsync for safety)
echo "Copying files from source repository..."
cd "$SOURCE_DIR"

# Use rsync for safer copying with explicit exclusions
if command -v rsync >/dev/null 2>&1; then
    rsync -av --exclude='.git' --exclude='sync-to-test2.sh' --exclude='.' --exclude='..' . "$TEMP_DIR/"
else
    # Fallback to cp with explicit file type checks
    find . -maxdepth 1 -type f -not -name 'sync-to-test2.sh' -exec cp {} "$TEMP_DIR/" \;
    find . -maxdepth 1 -type d -not -name '.git' -not -name '.' -not -name '..' -exec cp -r {} "$TEMP_DIR/" \;
fi

# Commit and push changes
cd "$TEMP_DIR"
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}No changes detected. Repository is already up to date.${NC}"
else
    echo "Committing changes..."
    git commit -m "Sync from kyuri-code/test - $(date)"
    
    echo "Pushing changes to remote repository..."
    git push origin main
    
    echo -e "${GREEN}Sync completed successfully!${NC}"
fi

# Clean up
echo "Cleaning up temp directory..."
rm -rf "$TEMP_DIR"

echo -e "${GREEN}Sync process finished.${NC}"