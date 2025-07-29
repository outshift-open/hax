import { Command } from "commander"
import inquirer from "inquirer"
import { generateComponent } from "../generator"
import { readConfig, updateConfig } from "../config"
import { logger, highlighter, printPanelBox } from "../utils/logger"
import fs from "fs"

export const addCommand = new Command("add")
  .argument("[components...]", "Component name(s) to add")
  .description("Add an existing HAX component from the library to your project")
  .action(async (componentNames: string[]) => {
    if (componentNames.length === 0) {
      logger.error(
        "No component name provided. Please specify a component to add.",
      )
      return
    }
    logger.break()
    logger.info(
      `🔮 Adding component ${componentNames.length > 1 ? "s" : ""}: ${componentNames.map((name) => highlighter.primary(name)).join(", ")} from HAX library`,
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

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (const componentName of componentNames) {
      try {
        const { getRegistryItem } = await import("@/api/registry")
        const component = await getRegistryItem(componentName, "local")
        if (!component) {
          errors.push(componentName)
          errorCount++
        }
      } catch {
        errors.push(componentName)
        errorCount++
      }
    }

    if (errorCount > 0) {
      logger.break()
      const componentText =
        componentNames.length === 1 ? "component" : "components"
      const doesText = componentNames.length === 1 ? "does" : "do"
      const errorMsg = `Error adding ${componentText}. Component${componentNames.length === 1 ? "" : "s"} ${doesText} not exist in registry. Please confirm that ${componentText} ${componentNames.length === 1 ? "is" : "are"} valid.`

      logger.error(errorMsg)
      return
    }

    for (const componentName of componentNames) {
      try {
        logger.info(`Adding ${componentName}...`)
        await generateComponent(componentName, addBackend, config)
        successCount++
      } catch (err) {
        logger.error(`Error adding ${componentName}: ${(err as Error).message}`)
        errorCount++
        errors.push(componentName)
      }
    }

    try {
      updateConfig(config)
    } catch (err) {
      logger.error(`Error updating config: ${(err as Error).message}`)
    }

    logger.break()

    const successMsg = [
      `✨ Successfully added ${successCount} component${successCount !== 1 ? "s" : ""}!`,
      addBackend ? "🔧 Backend tools were added" : null,
      "📦 Components are ready to use",
    ]
      .filter(Boolean)
      .join("\n")

    printPanelBox(successMsg)
  })
