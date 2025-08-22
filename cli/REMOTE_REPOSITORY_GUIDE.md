# Remote Repository & Admin Functionality Guide

This guide covers the remote repository management and administrative features of the HAX CLI, including setup, testing, and enterprise GitHub integration.

## Table of Contents

1. [Overview](#overview)
2. [Setup & Configuration](#setup--configuration)
3. [Admin Commands](#admin-commands)
4. [Repository Management](#repository-management)
5. [Testing Guide](#testing-guide)
6. [Enterprise GitHub Integration](#enterprise-github-integration)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)

## Overview

The HAX CLI supports multi-repository management, allowing organizations to:

- Manage multiple component registries with automatic fallback repository checking
- Support both public and private repositories
- Integrate with GitHub Enterprise instances
- Provide administrative tools for registry management
- Track component sources

## Setup & Configuration

### Environment Variables

Set up your environment with the necessary tokens:

```bash
export GITHUB_TOKEN=your_github_token_here
export HAX_GITHUB_TOKEN=your_hax_specific_token_here
```

**Authentication**: Use `--token` flag, OR environment variable with `GITHUB_TOKEN` or `HAX_GITHUB_TOKEN`

### Initialize HAX Project

```bash
# Initialize HAX in your project
agntcy-hax init

# List available commands
agntcy-hax --help

# View configured repositories
agntcy-hax repo list
```

## Admin Commands

The admin functionality provides comprehensive tools for managing HAX registries.

### 1. Repository Initialization

Initialize a new HAX component repository:

```bash
# Basic initialization (local only)
agntcy-hax admin init-repo --github owner/repo-name --path ./my-registry

# Full initialization with GitHub repository creation
agntcy-hax admin init-repo \
  --github owner/repo-name \
  --path ./my-registry \
  --create-remote \
  --private \
  --token $GITHUB_TOKEN
```

**Options:**

- `--github <repo>`: GitHub repository in format `owner/repo`
- `--path <path>`: Local path for initialization (default: `.`)
- `--create-remote`: Create GitHub repository and push files automatically
- `--private`: Create private repository (default: public)
- `--token <token>`: GitHub token for repository creation

**What it creates:**

- Directory structure: `cli/src/registry/github-registry/`, `hax/artifacts/`, etc.
- Registry JSON files: `artifacts.json`, `ui.json`, `composers.json`
- README and documentation files
- Git repository with initial commit

### 2. Registry Validation

Validate registry structure and configuration:

```bash
# Validate local registry
agntcy-hax admin validate-registry --path ./my-registry

# Validate remote registry
agntcy-hax admin validate-registry \
  --remote https://github.com/owner/repo \
  --token $GITHUB_TOKEN

# Validate both local and remote
agntcy-hax admin validate-registry \
  --path ./my-registry \
  --remote https://github.com/owner/repo \
  --token $GITHUB_TOKEN
```

**Validation checks:**

- Required directory structure
- Valid JSON format in registry files
- Component metadata completeness
- Remote repository accessibility

**Note**: When using `--path`, ensure you're specifying the correct directory:

- If you're already in the registry directory, use `--path .` or omit the flag entirely
- If you're outside the registry directory, use `--path ./path-to-registry`

### 3. Template Generation

Generate component and composer templates:

```bash
# Generate artifact template
agntcy-hax admin generate-template --type artifact --name data-processor

agntcy-hax admin generate-template --type composer --name chat-feature

# Generate with custom output path
agntcy-hax admin generate-template \
  --type artifact \
  --name analytics-dashboard \
  --output ./custom-templates

# Interactive mode (prompts for name)
agntcy-hax admin generate-template --type artifact
```

**Template types:**

- `artifact`: Complete component with action, description, types
- `composer`: Feature composer with context and hooks

### 4. Access Management

Manage repository access and permissions:

```bash
# List current access permissions
agntcy-hax admin manage-access --repo owner/repo-name

# Grant access to a user (example: add and revoke johndoe's access to sales internal-components repository)
agntcy-hax admin manage-access \
  --repo sales/internal-components \
  --user johndoe \
  --action grant

agntcy-hax admin manage-access \
  --repo sales/internal-components \
  --user johndoe \
  --action revoke
```

**Permission levels** (when granting access):

- **Read**: Can install components
- **Write**: Can add/modify components
- **Admin**: Full repository access

## Repository Management

### Adding Repositories

````bash
```bash
# Add repository
agntcy-hax repo add internal --github your-org/components --branch main

# Add repository with custom GitHub Enterprise URL
agntcy-hax repo add enterprise
  --github enterprise-org/components
  --branch main
  --github-url https://github.yourcompany.com
````

````

**Note**: The `--token` flag is not required when adding repositories. Tokens should only be provided when accessing private repositories.

### Repository Operations

```bash
# List all configured repositories
agntcy-hax repo list

# Switch default repository (for example, switch to internal as the default repository)
agntcy-hax repo switch sales
agntcy-hax add customer-success-dashboard  #pulls from sales


# Remove repository
agntcy-hax repo remove sales
````

### Using Components from Specific Repositories

```bash
agntcy-hax add artifact form
agntcy-hax add composer chat-commands
agntcy-hax add composer file-upload rules-context --repo intranet-repo

# Pull from specific repositories
agntcy-hax add artifact custom-timeline --repo internal
agntcy-hax add composer chat-feature --repo sales

# For enterprise or private repositories (enterprise repositories will fall back to SSH when API access is restricted,)
export GITHUB_TOKEN=your_enterprise_token
agntcy-hax add artifact custom-timeline --repo intranet

# Or pass token explicitly
agntcy-hax add composer analytics --repo intranet --token $GITHUB_TOKEN

# Automatic fallback repository checking
# If component not found in default repo, CLI automatically checks fallback repos:
agntcy-hax add artifact custom-timeline
# Output: "📦 Found custom-timeline in fallback repository: internal"
```

**Component Types:**

- **artifacts**: Individual components (forms, timelines, dashboards, etc.)
- **composers**: Feature composers (chat systems, file upload handlers, etc.)

**Fallback Mechanism:**
When a component isn't found in the default repository, the CLI automatically:

1. Checks the default repository first
2. If not found, tries each fallback repository in order
3. Reports which repository the component was found in
4. Tracks the source repository for future reference

**Source Tracking:**
Components track their source repository:

```bash
agntcy-hax list
# Shows:
# Component            │ Source
# custom-timeline      │ internal
# chat-commands        │ sales
# form                 │ main
```

## Troubleshooting

### Common Issues

#### Component Not Found Errors

```bash
# Error: Component "component-name" not found in registry
# This could be due to:

# 1. Component doesn't exist - check available components
agntcy-hax list

# 2. Authentication issue - verify token is set
echo $GITHUB_TOKEN

# 3. Wrong repository - check repository configuration
agntcy-hax repo list

# 4. Private repository access - ensure token has proper permissions
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo
```

#### Repository Not Found

```bash
# Check repository exists and is accessible
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo

# Verify token permissions
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user
```

#### Authentication Failures

```bash
# Verify token is set
echo $GITHUB_TOKEN
```

#### Excessive Logging for Enterprise GitHub

If you're seeing verbose logs like "Trying Contents API", "Trying raw URL", etc. for each file:

```bash
# Problem: Enterprise GitHub API restrictions causing fallback attempts
# Solution 1: Skip API attempts entirely (faster)
unset GITHUB_TOKEN  # or remove from environment
agntcy-hax add component-name --repo enterprise-repo

# Solution 2: Verify SSH access is working
ssh -T git@your-enterprise-github.com

# Solution 3: Check if your token has proper API permissions
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://your-enterprise-github.com/api/v3/user
```

**Expected behavior**: With the improved implementation, you should see:

1. **First file from enterprise GitHub**: One "Enterprise GitHub API access restricted (403), using SSH for all files" message
2. **Repository clone**: One "📡 Fetching from enterprise GitHub via SSH: owner/repo" message
3. **All subsequent files**: Instant access from cached clone with no additional messages

The CLI automatically detects and remembers when enterprise GitHub restricts API access, so subsequent files skip the API attempt entirely.

## Quick Reference

### Essential Commands

```bash
# Setup (use GITHUB_TOKEN for consistency)
export GITHUB_TOKEN=your_token
agntcy-hax init

# Admin workflow
agntcy-hax admin init-repo --github org/repo --create-remote --private --token $GITHUB_TOKEN
agntcy-hax admin validate-registry --remote https://github.com/org/repo --token $GITHUB_TOKEN
agntcy-hax admin generate-template --type artifact --name component-name
agntcy-hax admin manage-access --repo org/repo --user username --action grant

# Repository management
agntcy-hax repo add name --github org/repo --branch main
agntcy-hax repo list
agntcy-hax repo switch name
agntcy-hax add artifact component-name
agntcy-hax add composer feature-name --repo name
agntcy-hax list

# Configuration
agntcy-hax config set default-repo name
```

### Enterprise GitHub

```bash
# Set up enterprise token (required for private enterprise repos)
export GITHUB_TOKEN=your_enterprise_token

# Add enterprise repository (token not stored, used only for initial validation)
agntcy-hax repo add intranet \
  --github your-org/internal-components \
  --github-url https://github.yourcompany.com \
  --branch main

# List repositories to verify
agntcy-hax repo list

# Use components from enterprise repository
# Token will be read from GITHUB_TOKEN environment variable
agntcy-hax add artifact custom-timeline --repo intranet
agntcy-hax add composer dashboard-widget --repo intranet

# Alternative: Pass token explicitly (if needed)
agntcy-hax add artifact custom-timeline --repo intranet --token $GITHUB_TOKEN

# Switch to enterprise repo as default
agntcy-hax repo switch intranet
agntcy-hax add artifact analytics-component  # Now pulls from intranet by default
```

**Note**: Enterprise repositories require:

1. Valid `GITHUB_TOKEN` environment variable with access to the enterprise instance
2. Network access to the enterprise GitHub URL
3. Proper repository permissions for the user associated with the token
4. Git installed locally (for enterprises that restrict API access to repository contents)

**Enterprise GitHub Limitations & Performance**:

- Some enterprise GitHub instances restrict personal access tokens from accessing repository contents via API
- When API access is restricted (403 errors), the HAX CLI automatically falls back to SSH-based Git access
- **First time access**: The CLI will clone the repository via SSH and cache it locally for the session
- **Subsequent files**: All additional files from the same repository will be read from the cached clone (much faster)
- **Clean logging**: You'll see one "📡 Fetching from enterprise GitHub via SSH" message per repository, not per file

**Performance tip**: If you know your enterprise GitHub restricts API access, you can skip the API attempt entirely by not setting `GITHUB_TOKEN` - this will go straight to SSH and be faster.

This guide provides comprehensive coverage of the remote repository and admin functionality in HAX CLI.
