<p align="center">
  <img src="assets/repo-img.png" alt="Agntcy HAX SDK" width="200">
</p>

<h1 align="center">HAX SDK</h1>

<p align="center">
A human-AI experience CLI tool for installing composable building blocks for rich, agentic user experiences.
</p>

## Installation

```bash
# From the cli directory
cd cli
npm install
npm run build
npm link
```

## Quick Start

**Important**: Create a `.env` file in your project directory with your GitHub token:

```bash
# .env file
HAX_REGISTRY_SOURCE=github:component-integration
GITHUB_TOKEN=your_github_token_here
```

Get your GitHub token from: https://github.com/settings/tokens  
(Required because the agntcy-hax repository is private)

Initialize HAX in your project:

```bash
agntcy-hax init
```

Add components to your project:

```bash
agntcy-hax add artifact form
agntcy-hax add artifact code-editor data-visualizer
```

Add Composers (chat features) to your project

```bash
agntcy-hax add composer chat-commands file-upload rules-context
agntcy-hax add composer chat-commands

```

List available components:

```bash
agntcy-hax list
```

## Available Components

- **form** - Dynamic form builder
- **timeline** - Activity timeline with status indicators
- **mindmap** - Interactive mindmap with auto-layout
- **code-editor** - Monaco-based code editor
- **details** - Statistics and data display component
- **data-visualizer** - Data visualization wrapper
- **source-attribution** - Source citation component with clickable reference badges
- **rationale** - Decision reasoning component with confidence indicators and criteria badges

### Available Composers

- **chat-commands** - Interactive chat interface with command suggestions, file picker, and context management
- **file-upload** - Complete file upload flow with drag-and-drop, progress indicators, and error handling
- **rules-context** - Rule configuration and management interface with validation and persistence

## Configuration

The CLI creates a `hax.json` file in your project:

**Basic configuration (after `agntcy-hax init`):**

```json
{
  "$schema": "./schema.json",
  "style": "default",
  "components": [
    "code-editor",
    "data-visualizer",
    "timeline",
    "form",
    "mindmap",
    "details"
  ],
  "features": ["rules-context", "chat-commands", "file-upload"],
  "artifacts": {
    "path": "src/hax/artifacts"
  },
  "composers": {
    "path": "src/hax/composers"
  }
}
```

**Example with multi-repository setup:**

```json
{
  "$schema": "./schema.json",
  "style": "default",
  "artifacts": {
    "path": "src/hax/artifacts"
  },
  "components": [],
  "registries": {
    "default": "official",
    "fallback": ["official", "internal", "partner"],
    "sources": {
      "official": {
        "type": "github",
        "repo": "cisco-eti/agntcy-hax",
        "branch": "main",
        "name": "official"
      },
      "internal": {
        "type": "github",
        "repo": "your-org/hax-components",
        "branch": "main",
        "name": "internal"
      },
      "partner": {
        "type": "github",
        "repo": "partner-org/components",
        "branch": "production",
        "name": "partner",

      }
    }
  }

```

**Note**: Repository names like `internal`, `partner` are example aliases - you can use any name that makes sense for your organization (e.g., `dev`, `staging`, `company-name`, `team-ui`, etc.)

### Configuration Options

- **artifacts.path**: Where artifact components are installed (default: `src/hax/artifacts`)
- **components**: List of installed components (auto-managed)
- **composers**: List of installed composer components (stored in `src/hax/composers`)
- **style**: Component styling variant (default: "default")
- **registries.default**: Default repository to check first
- **registries.fallback**: Repository search order for component resolution
- **registries.sources**: Repository definitions with GitHub details and optional tokens

### Component Types

- **Artifacts**: Individual UI components for specific visualizations and interactions
- **Composers**: Enhanced chat interface with chat commands (@, +, /), file upload, and rules for agent behavior.
- **UI Components**: Reusable base components (buttons, inputs, etc.) automatically installed as dependencies

## Registry Sources

The CLI supports multiple registry sources:

### GitHub Registry (Default)

```bash
# Uses GitHub registry from specified branch
HAX_REGISTRY_SOURCE=github:main
```

### Local Registry

```bash
# Uses local TypeScript registry files
HAX_REGISTRY_SOURCE=local
```

Set via environment variable:

```bash
# Set environment variable for current session
export HAX_REGISTRY_SOURCE=github:main

# Or run with environment variable
HAX_REGISTRY_SOURCE=github:main agntcy-hax add artifact form
```

## Multi-Repository Architecture

HAX CLI supports multiple component repositories for organizational flexibility:

### Use Cases

- **Enterprise Organizations**: Maintain internal component libraries alongside official HAX components
- **Partner Ecosystems**: Access partner organization components while maintaining fallback to official registry
- **Development Workflows**: Use development branches for testing while falling back to stable releases
- **Private Components**: Secure proprietary components with authentication tokens

### Repository Types

1. **Official Repository**: Core HAX components (always available)
2. **Custom Repositories**: Organization-specific components
3. **Partner Repositories**: External organization components
4. **Development Repositories**: Testing and development branches

### Fallback Chain

Components are resolved using intelligent fallback:

```
Default Repository → Fallback Repository 1 → Fallback Repository 2 → Official
```

This ensures:

- ✅ Custom components override official ones when available
- ✅ Graceful degradation when custom repositories are unavailable
- ✅ Consistent experience across different environments
- ✅ Explicit control over component sources with `--repo` flag

### Security & Authentication

- **Public Repositories**: No authentication required
- **Private Repositories**: Secure with GitHub tokens
- **Per-Repository Tokens**: Different authentication for different repositories
- **Environment Variables**: Global GitHub token fallback

## Project Structure

- `cli/`: CLI source code and tooling
  - `src/`: Main CLI source code
    - `commands/`: CLI commands (add, init, list)
    - `config/`: Configuration management
    - `generator/`: Component installation engine
    - `registry/`: Component registries
      - `default/`: Local TypeScript registry
      - `github-registry/`: GitHub JSON registry
    - `types/`: TypeScript type definitions
    - `utils/`: Utility functions
- `hax/`: HAX component library
  - `artifacts/`: Available HAX components (form, timeline, etc.)
  - `components/ui/`: Shared UI components
  - `lib/`: Utility libraries

## How It Works

1. **Multi-Repository Registry**: Components are defined across multiple repositories with metadata (dependencies, files, types)
2. **Intelligent Resolution**: CLI searches repositories in priority order with automatic fallback
3. **Installation**: Downloads component files from resolved repository and installs npm dependencies
4. **Path Aliases**: Automatically configures TypeScript/JavaScript path mapping
5. **Dependencies**: Resolves both npm packages and HAX UI component dependencies across repositories

## Component Structure

Each HAX component includes:

```
component-name/
├── component-name.tsx    # Main React component
├── action.ts            # CopilotKit action hook
├── types.ts             # TypeScript definitions
├── index.ts             # Exports
└── description.ts       # Detailed instructions for agents
```

## Commands

### `init`

Initialize HAX in your project:

```bash
agntcy-hax init
```

### `add [components...]`

Install one or more components:

```bash
agntcy-hax add artifact form timeline

# Install from specific repository
agntcy-hax add artifact custom-dashboard --repo=testing
agntcy-hax add artifact salesCustom-timeline --repo=sales
```

### `list`

Show installed components:

```bash
agntcy-hax list
```

## `repo` Remote Repository Management & Admin Features

For enterprise setups, multi-repository management, and administrative features, see the [Remote Repository Guide](REMOTE_REPOSITORY_GUIDE.md).

````

## Development

### For Contributors

**Working on the CLI code itself:**

1. **Set up environment in the CLI directory**:
   ```bash
   cd cli
   cp .env.example .env
   ```

2. **Update `.env` with your GitHub token**:
   ```bash
   # Edit .env file
   HAX_REGISTRY_SOURCE=github:component-integration
   GITHUB_TOKEN=your_actual_github_token
   ```

**Testing the CLI in other projects:**

Create a `.env` file in your test project with the same configuration.

**Note**: A GitHub token is required because the `agntcy-hax` repository is private.
Get your GitHub token from: https://github.com/settings/tokens

### Build CLI

```bash
npm run build
```

### Testing

```bash
# Link globally for testing
npm link

# Test commands
agntcy-hax --help
agntcy-hax add form
```

### Testing Multi-Repository Functionality

**Setup test repositories:**
```bash
# Initialize project
agntcy-hax init

# Add test repositories
agntcy-hax repo add testing --github cisco-eti/agntcy-hax --branch test-remote-repo
agntcy-hax repo add sales --github cisco-eti/agntcy-hax --branch sales-remote-hax
```

**Test component resolution:**
```bash
# Test automatic fallback
agntcy-hax add custom-timeline    # Should find in testing
agntcy-hax add salesCustom-dashboard  # Should find in sales
agntcy-hax add form              # Should find in official

# Test specific repository targeting
agntcy-hax add custom-dashboard --repo=testing
agntcy-hax add mindmap --repo=official
```

**Test repository switching:**
```bash
# Test priority changes
agntcy-hax repo switch testing
agntcy-hax add salesCustom-timeline  # Should show "not found in testing, found in sales"

agntcy-hax repo switch sales
agntcy-hax add custom-timeline       # Should show "not found in sales, found in testing"

# View current configuration
agntcy-hax repo list
```

## Troubleshooting

### Common Issues

**"Component not found in registry"**

- Check component name spelling
- Verify registry source is accessible
- Check network connection for GitHub registry

**"npm install failed"**

- Check npm configuration
- Verify package names in registry
- Check for conflicting dependencies

**"Path aliases not working"**

- Ensure tsconfig.json/jsconfig.json exists
- Check baseUrl and paths configuration
- Restart TypeScript language server

### File Type System

Components use typed file system:

- `registry:component` - React components (.tsx)
- `registry:hook` - Action hooks (.ts/.tsx)
- `registry:types` - Type definitions (.ts)
- `registry:index` - Export files (.ts)
- `registry:description` - Metadata (.ts)

## License

MIT License - see the [LICENSE](../LICENSE) file for details.
````
