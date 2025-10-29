# Repository Sync Configuration

This file documents the configuration for syncing content from kyuri-code/test to kyuri-code/test2.

## Target Repository
- Repository: kyuri-code/test2
- Branch: main

## Sync Methods

### 1. Automatic Sync (GitHub Actions)
- Triggered on: push to main branch
- Triggered on: manual workflow dispatch
- File: `.github/workflows/sync-to-test2.yml`

### 2. Manual Sync (Shell Script)
- File: `sync-to-test2.sh`
- Usage: `./sync-to-test2.sh [GITHUB_TOKEN]`

## Required Secrets (for GitHub Actions)
- `SYNC_TOKEN`: GitHub Personal Access Token with repository access to kyuri-code/test2

## Files Excluded from Sync
- `.git/` directory (preserved in target)
- `sync-to-test2.sh` (sync script itself)

## How it Works
1. Clones the target repository (test2)
2. Removes all existing content (except .git)
3. Copies all content from source repository (test)
4. Commits and pushes changes to target repository

## Setup Instructions
1. Create a GitHub Personal Access Token with repository access
2. Add the token as a secret named `SYNC_TOKEN` in the repository settings
3. The sync will run automatically on pushes to main, or can be triggered manually

## Manual Testing
To test the sync locally:
```bash
export GITHUB_TOKEN=your_token_here
./sync-to-test2.sh
```