import { Command } from "commander"
import inquirer from "inquirer"
import { generateComponent } from "../generator"
import { readConfig, updateConfig } from "../config"
import { logger, highlighter, printPanelBox } from "../utils/logger"
import fs from "fs"

export const addCommand = new Command("add")
  .argument("<component>", "Component name to add")
  .description("Add an existing HAX component from the library to your project")
  .action(async (componentName: string) => {
    logger.break()
    logger.info(
      `🔮 Adding component: ${highlighter.primary(componentName)} from HAX library`,
    )
    logger.break()

    const { addBackend } = await inquirer.prompt([
      {
        type: "confirm",
        name: "addBackend",
        message:
          "🛠️  Do you want to include the backend tool for this component?",
        default: true,
      },
    ])

    let config
    try {
      config = readConfig()
    } catch (err) {
      logger.error(`Error: ${(err as Error).message}`)
      return
    }

    // Ensure artifacts path exists and create it if not
    if (!fs.existsSync(config.artifacts.path)) {
      logger.warn(
        `Artifacts path '${config.artifacts.path}' does not exist. It will be created.`,
      )
      fs.mkdirSync(config.artifacts.path, { recursive: true })
    }

    logger.info(`🚀 Copying ${componentName} component...`)
    logger.break()

    try {
      await generateComponent(componentName, addBackend, config)
      updateConfig(config)
    } catch (err) {
      logger.error(`Error: ${(err as Error).message}`)
      return
    }

    const successMsg = [
      `✨ Successfully added ${componentName} component!`,
      addBackend ? "🔧 Backend tool was added" : null,
      "📦 Component is ready to use",
    ]
      .filter(Boolean)
      .join("\n")

    printPanelBox(successMsg)
  })
