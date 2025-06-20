<p align="center">
  <img src="assets/repo-img.png" alt="Agntcy HAX SDK" width="200">
</p>

<h1 align="center">HAX CLI</h1>

<p align="center">
A human-AI experience repository focused on providing composable building blocks for rich, agentic user experiences.
</p>

## Installation

```bash
# From the cli directory
cd cli
npm install
npm run build
npm link
```

## Usage

Initialize HAX SDK in your project:

```bash
agntcy-hax init
```

Add a new component:

```bash
agntcy-hax add <ComponentName>
```
This creates:
A frontend component in `frontend/src/components/agntcy/ComponentName`
An optional backend tool in `backend/tools/ComponentName`


## Project Structure

- `src/`: Main package directory
  - `index.ts`: Main CLI entry point
  - `commands/`: Command implementations (add, init, list)
  - `config/`: Configuration management (agntcy-hax.yaml handler)
  - `generator/`: Component generation logic (creates frontend/backend files)
  - `utils.py`: Utility functions (e.g., box logger for CLI output)

## Development

1. Live dev (optional)

```bash
npm run dev
```

2. Build CLI output

```bash
npm run build
```

3. Link to system globally

```bash
npm link
```

4. Run commands:

```bash
agntcy-hax --help
```

## Configuration

The tool creates a `agntcy-hax.yaml` file in your project root with the following structure:

```yaml
version: "0.1.0"
components: []
backend_path: "./backend"
frontend_path: "./frontend"
frontend_path: "./frontend"
backend_framework: "LangGraph"      
frontend_framework: "React" 
```

You can modify these paths to match your project structure.

## Component Generation

When adding a component:

- Frontend component is created in `{frontend_path}/src/components/agntcy/`
- Backend tool (optional) is created in `{backend_path}/tools/`
- Component is registered in the configuration file

## Commands

### init

Initialize HAX SDK in the current project:

```bash
agntcy-hax init
```

### add

Add a new HAX component:

```bash
agntcy-hax add ComponentName
```

### list

List existing components 

```bash
agntcy-hax list
```

The tool will prompt you to decide if you want to generate a backend tool for the component.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
