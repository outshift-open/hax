import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { generateComponent } from "../generator";
import { readConfig, updateConfig } from "../config";
import { printPanelBox } from "../utils/logger";
import fs from "fs";

export const addCommand = new Command("add")
  .argument("<component>", "Component name to add")
  .description("Add an existing HAX component from the library to your project")
  .action(async (componentName: string) => {
    console.log(`\n🔮 Adding component: ${chalk.blue(componentName)} from HAX library\n`);

    const { addBackend } = await inquirer.prompt([
      {
        type: "confirm",
        name: "addBackend",
        message: "🛠️  Do you want to include the backend tool for this component?",
        default: true,
      },
    ]);

    let config;
    try {
      config = readConfig();
    } catch (err) {
      console.error(chalk.redBright(`\nError: ${(err as Error).message}`));
      return;
    }

    // Ensure frontend path exists and create it if not
    if (!fs.existsSync(config.frontend_path)) {
      console.log(chalk.yellow(`\n⚠️  Frontend path '${config.frontend_path}' does not exist. It will be created.`));
      
    }

    console.log(`\n🚀 Adding ${componentName} component...\n`);

    await generateComponent(componentName, addBackend, config);
    updateConfig(config);

    const successMsg = [
      `✨ Successfully added ${componentName} component!`,
      addBackend ? "🔧 Backend tool was added" : null,
      "📦 Component is ready to use",
    ]
      .filter(Boolean)
      .join("\n");

    printPanelBox(successMsg);
  });
