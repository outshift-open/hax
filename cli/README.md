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
HAX_GITHUB_TOKEN=your_github_token_here
```

Get your GitHub token from: https://github.com/settings/tokens  
(Required because the agntcy-hax repository is private)

Initialize HAX in your project:

```bash
agntcy-hax init
```

Add components to your project:

```bash
agntcy-hax add form
agntcy-hax add code-editor data-visualizer
```

Add Composers (chat features) to your project

```bash
agntcy-hax add chat-commands file-upload rules-context
agntcy-hax add chat-commands

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

### Available Composers

- **chat-commands** - Interactive chat interface with command suggestions, file picker, and context management
- **file-upload** - Complete file upload flow with drag-and-drop, progress indicators, and error handling
- **rules-context** - Rule configuration and management interface with validation and persistence

## Configuration

The CLI creates a `hax.json` file in your project:

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

### Configuration Options

- **artifacts.path**: Where artifact components are installed (default: `src/hax/artifacts`)
- **components**: List of installed components (auto-managed)
- **composers**: List of installed composer components (stored in `src/hax/composers`)
- **style**: Component styling variant (default: "default")

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
HAX_REGISTRY_SOURCE=github:main agntcy-hax add form
```

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

1. **Registry**: Components are defined in registries with metadata (dependencies, files, types)
2. **Installation**: CLI downloads component files and installs npm dependencies
3. **Path Aliases**: Automatically configures TypeScript/JavaScript path mapping
4. **Dependencies**: Resolves both npm packages and HAX UI component dependencies

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
agntcy-hax add form timeline
```

### `list`

Show installed components:

```bash
agntcy-hax list
```

## Environment Variables

Configure via environment variables:

````bash
## Environment Variables

Configure via environment variables:

```bash
# Registry source - use environment variable
export HAX_REGISTRY_SOURCE=github:main

# GitHub configuration (for private repos)
export HAX_GITHUB_REPO=your-org/your-repo
export HAX_GITHUB_TOKEN=your_token_here
````

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
   HAX_GITHUB_TOKEN=your_actual_github_token
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
