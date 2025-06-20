import fs from "fs";
import inquirer from "inquirer";

import chalk from "chalk";
import { printPanelBox } from "@/utils/logger";
import YAML from "yaml";

export interface HaxConfig {
  version: string;
  components: string[];
  backend_path: string;
  frontend_path: string;
  backend_framework?: string;
  frontend_framework?: string;
}

const CONFIG_FILE = "agntcy-hax.yaml";

export function readConfig(): HaxConfig {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error("\n" + chalk.red("Error: Config file not found. Have you run 'agntcy-hax init'?"));
    process.exit(1);
  }

  const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
  const parsed = parseYAML(raw);

  return {
    version: parsed.version ?? "0.1.0",
    components: Array.isArray(parsed.components) ? parsed.components : [],
    backend_path: parsed.backend_path ?? "./backend",
    frontend_path: parsed.frontend_path ?? "./frontend",
    backend_framework: parsed.backend_framework,
    frontend_framework: parsed.frontend_framework,
  };
}


export function updateConfig(config: HaxConfig): void {
  fs.writeFileSync(CONFIG_FILE, toYAML(config));
}

export async function createConfig(): Promise<void> {
  if (fs.existsSync(CONFIG_FILE)) {
    console.log(chalk.green(`✅ Config file already exists, skipping initialization.`));
    return;
  }

console.log("\n🧙 Welcome to the HAX SDK initialization wizard!\n");
  console.log(
    chalk.gray(
      "This wizard will help you set up your HAX SDK configuration.\nYou can always change these settings later in the config file.\n"
    )
  );

  console.log("");
  console.log(chalk.cyan("💻 Frontend Framework Configuration:"));
  console.log("");
  
  const frontendAnswers = await inquirer.prompt([
    

        {
      type: "list",
      name: "frontend_framework",
      message: "Choose your front-end framework",
      choices: [
        { name: "React", value: "React" },
        { name: "Vue", value: "Vue" },
        { name: "Custom", value: "Custom" },
      ],
      default: "React",
    },
       {
      type: "input",
      name: "frontend_path",
      message: "Where would you like the front-end components stored?",
      default: "./frontend",
    },

 
    {
      type: "input",
      name: "version",
      message: "Enter the initial version",
      default: "0.1.0",
    },
    ]);

    console.log("");
    console.log(chalk.cyan("🛠️ Backend Framework Configuration:"));
    console.log("");

    const backendAnswers = await inquirer.prompt([
        {
      type: "list",
      name: "backend_framework",
      message: "Choose your backend framework",
      choices: [
        { name: "LangGraph", value: "LangGraph" },
        { name: "Autogen", value: "Autogen" },
        { name: "AICanvas", value: "AICanvas" },
        { name: "Custom", value: "Custom" },
      ],
      default: "LangGraph",
    },
       {
      type: "input",
      name: "backend_path",
      message: "Where would you like the backend tools stored?",
      default: "./backend",
    },
  ]);

  console.log("");

 printPanelBox(
  `${chalk.yellow("📝 Configuration Summary:")}\n` +
    `${chalk.gray("Backend Framework:")} ${chalk.magenta(backendAnswers.backend_framework)}\n` +
    `${chalk.gray("Backend Path:")} ${chalk.magenta(backendAnswers.backend_path)}\n` +
    `${chalk.gray("Frontend Framework:")} ${chalk.cyan(frontendAnswers.frontend_framework)}\n` +
    `${chalk.gray("Frontend Path:")} ${chalk.cyan(frontendAnswers.frontend_path)}\n` +
    `${chalk.gray("Version:")} ${chalk.white(frontendAnswers.version)}\n`
);

  const confirm = await inquirer.prompt([
    {
      type: "confirm",
      name: "save",
      message: "Do you want to save this configuration?",
      default: true,
    },
  ]);

  if (!confirm.save) {
    console.log(chalk.red("❌ Initialization cancelled. No changes made."));
    process.exit(1);
  }

  const config: HaxConfig = {
    version: frontendAnswers.version,
    components: [],
    backend_path: backendAnswers.backend_path,
    frontend_path: frontendAnswers.frontend_path,
    backend_framework: backendAnswers.backend_framework,
    frontend_framework: frontendAnswers.frontend_framework,
  };

  updateConfig(config);

console.log("");
printPanelBox(
  `${chalk.greenBright("✨ Successfully initialized HAX SDK!")}\n` +
  `${chalk.white("🎯 You can now start adding components with:")}\n` +
  `${chalk.blueBright("🚀 agntcy-hax add <component-name>")}`
);

}


function parseYAML(raw: string): Record<string, any>{
  return YAML.parse(raw);
}

function toYAML(config: HaxConfig): string {
  return YAML.stringify(config);
}
