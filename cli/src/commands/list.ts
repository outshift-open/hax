import { Command } from "commander";
import { readConfig } from "../config";
import chalk from "chalk";
import Table from "cli-table3";
import fs from "fs";
import path from "path";

export const listCommand = new Command("list")
  .description("List all components currently in the config")
  .action(() => {
    const config = readConfig();
    const components = config.components;

    if (!Array.isArray(components) || components.length === 0) {
      console.log(chalk.gray("No components found in config."));
      return;
    }

    console.log(chalk.green("\n📦 Registered Components:\n"));

    const table = new Table({
      head: [chalk.white("Component Name"), chalk.white("Backend Tool")],
      style: { head: ["cyan"] },
    });

    components.forEach((name: string) => {
      const hasBackend = checkBackendExists(name, config.backend_path);
      table.push([name, hasBackend ? chalk.green("Yes") : chalk.gray("No")]);
    });

    console.log(table.toString());
  });

function checkBackendExists(name: string, backendPath: string): boolean {
  const toolPath = path.join(backendPath, "tools", name, `${name}.py`);
  return fs.existsSync(toolPath);
}
