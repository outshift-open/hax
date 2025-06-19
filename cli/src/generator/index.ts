import fs from "fs";
import path from "path";
import { HaxConfig } from "@/config";

export async function generateComponent(
  name: string,
  addBackend: boolean,
  config: HaxConfig
) {

  if (!Array.isArray(config.components)) {
    config.components = [];
  }

  // Create frontend directory  if doesn't exist
  const frontendDir = path.join(config.frontend_path, "src", "components", "agntcy", name);
  fs.mkdirSync(frontendDir, { recursive: true });
  fs.writeFileSync(path.join(frontendDir, `${name}.tsx`), `// ${name} component`);

  // Optionally create backend tool
  if (addBackend) {
    const backendDir = path.join(config.backend_path, "tools", name);
    fs.mkdirSync(backendDir, { recursive: true });
    fs.writeFileSync(path.join(backendDir, `${name}.py`), `# ${name} backend tool`);
  }

  // Add to config.components if not already listed
  if (!config.components.includes(name)) {
    config.components.push(name);
  }
}

