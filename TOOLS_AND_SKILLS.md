# HAX Tools and Skills Guide

This document outlines the technologies, tools, and skills required to work on the HAX (Human-Agent Experience) Interface project.

## Table of Contents

- [Core Technologies](#core-technologies)
- [Frontend Development](#frontend-development)
- [CLI Development](#cli-development)
- [Backend Development](#backend-development)
- [Build Tools and Development](#build-tools-and-development)
- [Testing and Quality](#testing-and-quality)
- [Deployment and Infrastructure](#deployment-and-infrastructure)
- [AI and Agent Integration](#ai-and-agent-integration)
- [Getting Started](#getting-started)

---

## Core Technologies

### Programming Languages

- **TypeScript** (v5.0+)
  - Primary language for CLI and frontend components
  - Strong typing for better code quality and developer experience
  - Used across all React components and CLI tools

- **JavaScript (ES2020+)**
  - Module system (ESNext)
  - Modern JavaScript features and async/await patterns

- **Python** (v3.11+)
  - Backend API services
  - Flask-based server implementation
  - Used in the `app/` directory for backend services

- **Bash**
  - Shell scripting for automation and setup
  - Build scripts and tooling (see `scripts/`, `runme.sh`)

---

## Frontend Development

### UI Frameworks and Libraries

- **React** (v18.0+/v19.1+)
  - Component-based UI development
  - React 18 hooks and modern patterns
  - JSX syntax with TypeScript

- **React DOM** (v18.0+)
  - DOM rendering and manipulation

### UI Component Libraries

- **Radix UI**
  - `@radix-ui/react-avatar` - Avatar components
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-label` - Form labels
  - `@radix-ui/react-progress` - Progress indicators
  - `@radix-ui/react-select` - Select dropdowns
  - `@radix-ui/react-slot` - Composition utilities
  - `@radix-ui/react-tabs` - Tab navigation
  - Accessible, unstyled components for building high-quality design systems

### Styling

- **Tailwind CSS** (implicit via dependencies)
  - Utility-first CSS framework
  - `tailwind-merge` (v2.0+/v3.3+) - For merging Tailwind classes
  - `class-variance-authority` (v0.7+) - For variant-based styling
  - `clsx` (v2.0+) - For conditional className composition

### Code Editing

- **Monaco Editor** (`@monaco-editor/react` v4.7+)
  - VSCode-style code editor component
  - Syntax highlighting and code editing features
  - Used in the code-editor artifact

### Data Visualization

- **Chart.js** (v4.5+)
  - Canvas-based charting library
  - `react-chartjs-2` (v5.3+) - React wrapper for Chart.js

### Flow Diagrams

- **XYFlow** (`@xyflow/react` v12.8+)
  - Interactive node-based diagrams and flowcharts
  - Auto-layout with `elkjs` (v0.10+)
  - Used in mindmap components

### UI Utilities

- **Lucide React** (v0.400+/v0.534+)
  - Icon library with React components
  - Clean, consistent icon set

- **Vaul** (v1.1+)
  - Drawer/modal components

---

## CLI Development

### CLI Framework

- **Commander.js** (v14.0+)
  - Command-line interface framework
  - Command parsing and option handling
  - Used for `hax init`, `hax add`, `hax list`, etc.

### CLI Utilities

- **Inquirer.js** (v12.6+)
  - Interactive command-line prompts
  - User input collection and validation

- **Boxen** (v8.0+)
  - Terminal box styling
  - Pretty console output

- **Chalk** (v5.4+)
  - Terminal string styling
  - Colored console output

- **cli-table3** (v0.6+)
  - ASCII table generation
  - Formatted data display in terminal

### Build Tools

- **tsup** (v8.5+)
  - TypeScript bundler powered by esbuild
  - Fast builds for the CLI
  - Configuration for npm package distribution

- **tsx** (v4.20+)
  - TypeScript execution engine
  - Development mode execution (`npm run dev`)

---

## Backend Development

### Web Framework

- **Flask** (v2.0.2+)
  - Python web framework
  - RESTful API development
  - Used in `app/src/server.py`

### Monitoring and Metrics

- **Prometheus Flask Exporter** (v0.18.3+)
  - Metrics collection and export
  - Application monitoring integration

### HTTP Client

- **Requests**
  - Python HTTP library
  - API calls and external service integration

### Security

- **Werkzeug** (v2.2.2+)
  - WSGI utility library
  - Security utilities for Flask applications

---

## Build Tools and Development

### Package Management

- **npm**
  - Node.js package manager
  - Workspace management (monorepo support)
  - See `package.json` for workspace configuration

- **pip**
  - Python package manager
  - Used for Python dependencies in `app/requirements.txt`

### Code Parsing

- **Acorn** (v8.15+)
  - JavaScript parser
  - `acorn-typescript` (v1.4+) - TypeScript parsing support

### Configuration

- **dotenv** (v17.2+)
  - Environment variable management
  - `.env` file support for configuration

### Data Formats

- **YAML** (v2.8+)
  - YAML parsing and generation
  - Configuration file support

- **Zod** (v3.22+/v4.0+)
  - TypeScript-first schema validation
  - Runtime type checking
  - Used for configuration validation

### Date Handling

- **date-fns** (v4.1+)
  - Modern JavaScript date utility library
  - Date formatting and manipulation

---

## Testing and Quality

### Testing Framework

- **Jest** (v29.7+)
  - JavaScript testing framework
  - Unit and integration testing
  - Run with `npm run test` in CLI workspace

### Code Quality

- **ESLint** (v9.0+)
  - JavaScript/TypeScript linting
  - `@typescript-eslint/eslint-plugin` (v8.0+)
  - `@typescript-eslint/parser` (v8.0+)
  - `eslint-config-prettier` (v9.1+) - Prettier integration
  - `eslint-plugin-prettier` (v5.2+) - Prettier as ESLint rules
  - Run with `npm run lint` and `npm run lint:fix`

- **Prettier** (v3.3+)
  - Code formatting
  - Consistent code style across the project
  - Run with `npm run format` and `npm run format:check`

### Type Checking

- **TypeScript Compiler**
  - Type checking without emitting files
  - Run with `npm run typecheck`

### Build Validation

- **GitHub Actions**
  - Automated CI/CD pipelines
  - See `.github/workflows/test-and-build.yml`
  - Project structure validation

---

## Deployment and Infrastructure

### Container Technology

- **Docker**
  - Containerization
  - See `Dockerfile` for Python backend container setup
  - Base image: `ghcr.io/cisco-eti/sre-python-docker:v3.11.9-hardened-debian-12`

### Container Best Practices

- Non-root user execution (user `app`, UID 1001)
- Hardened base images
- Minimal attack surface

### CI/CD

- **GitHub Actions**
  - Automated workflows
  - Node.js 20 for builds
  - Ubuntu latest for runners

---

## AI and Agent Integration

### CopilotKit

- **@copilotkit/react-core** (v1.9.3+)
  - React integration for AI agents
  - Agent action hooks and components

- **@copilotkit/runtime** (v1.10.1+)
  - Runtime for agent execution
  - Backend integration for AI agents

- **@copilotkit/shared** (v1.0.0+)
  - Shared utilities and types
  - Common functionality across CopilotKit packages

### Agent Integration Patterns

- Action hooks (`action.ts` files)
- Type definitions for agent interactions (`types.ts` files)
- Agent descriptions and instructions (`description.ts` files)
- Component rendering from agent data

---

## Getting Started

### Prerequisites

To contribute to HAX, you should have:

1. **Node.js** (v20+)
   - JavaScript runtime
   - Required for CLI and component development

2. **npm** (comes with Node.js)
   - Package management
   - Workspace commands

3. **Python** (v3.11+) - for backend development
   - Backend API services
   - Flask applications

4. **Git**
   - Version control
   - GitHub integration

5. **Docker** (optional)
   - For containerized deployments
   - Backend service development

### Development Setup

**For CLI Development:**

```bash
cd hax/cli
npm install
npm run build    # Build the CLI
npm link         # Link globally for testing
```

**For Component Development:**

```bash
npm install      # Install root dependencies
npm run cli:dev  # Run CLI in development mode
```

**For Backend Development:**

```bash
cd app
pip3 install -r requirements.txt
python3 src/server.py
```

### Key Development Commands

```bash
# CLI commands
npm run cli:build     # Build the CLI
npm run cli:dev       # Run CLI in development mode
npm run cli:lint      # Lint CLI code
npm run cli:typecheck # Type check CLI code
npm run cli:test      # Run CLI tests

# Code quality
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run typecheck     # TypeScript type checking
```

### Skills Required by Area

**Frontend Development:**
- TypeScript/JavaScript
- React (hooks, components, state management)
- Modern CSS (Tailwind, responsive design)
- Accessibility (ARIA, semantic HTML)

**CLI Development:**
- Node.js and npm
- TypeScript
- Command-line interface design
- File system operations
- GitHub API integration

**Backend Development:**
- Python
- Flask web framework
- REST API design
- Docker containerization

**AI Agent Integration:**
- Understanding of AI agent patterns
- CopilotKit framework
- Action definition and handling
- Type-safe agent communication

---

## Learning Resources

### For TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### For React
- [React Documentation](https://react.dev/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### For CLI Development
- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Node.js CLI Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices)

### For CopilotKit
- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [CopilotKit GitHub](https://github.com/CopilotKit/CopilotKit)

---

## Contributing

Before contributing, make sure you:
1. Understand the relevant technologies listed above
2. Have the development environment set up
3. Read the [CONTRIBUTING.md](CONTRIBUTING.md) guide
4. Follow the code style and quality standards

For questions or guidance, please see our [GitHub Discussions](https://github.com/outshift-open/hax/discussions) or open an issue.
