import { Command } from "commander"
import { generateComponent } from "../generator"
import { readConfig, updateConfig } from "../config"
import { logger, highlighter, printPanelBox } from "../utils/logger"
import { generateComponentMessage } from "../utils/text"
import { getRegistryItem } from "@/registry/api"
import { RegistryItem } from "@/types"
import fs from "fs"

export const addCommand = new Command("add")
  .argument("[components...]", "Component name(s) to add")
  .description("Add an existing HAX component from the library to your project")
  .option("--repo <repository>", "Specific repository to pull from")
  .action(async (componentNames: string[], options) => {
    if (componentNames.length === 0) {
      logger.error(
        "No component name provided. Please specify a component to add.",
      )
      return
    }
    logger.break()
    logger.info(
      `🔮 Adding component${componentNames.length > 1 ? "s" : ""}: ${componentNames.map((name) => highlighter.primary(name)).join(", ")} from HAX library`,
    )
    logger.break()

    let config
    try {
      config = readConfig()
    } catch (err) {
      logger.error(`Error: ${(err as Error).message}`)
      return
    }

    let successCount = 0
    let errorCount = 0
    const validationErrors: string[] = []
    const validatedComponents: Map<string, RegistryItem> = new Map()

    // First validate all components exist before creating any directories
    for (const componentName of componentNames) {
      try {
        const component = await getRegistryItem(
          componentName,
          options.repo,
          config,
        )
        if (!component) {
          validationErrors.push(componentName)
          errorCount++
        } else {
          validatedComponents.set(componentName, component)
        }
      } catch {
        validationErrors.push(componentName)
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

    // Ensure artifacts path exists and create it if not (only after validation passes)
    if (!fs.existsSync(config.artifacts.path)) {
      logger.warn(
        `Artifacts path '${config.artifacts.path}' does not exist. It will be created.`,
      )
      fs.mkdirSync(config.artifacts.path, { recursive: true })
    }

    for (const componentName of componentNames) {
      try {
        logger.info(`Adding ${componentName}...`)
        const cachedComponent = validatedComponents.get(componentName)
        await generateComponent(
          componentName,
          config,
          options.repo,
          cachedComponent,
        )
        successCount++
      } catch (err) {
        logger.error(`Error adding ${componentName}: ${(err as Error).message}`)
        errorCount++
      }
    }

    try {
      updateConfig(config)
    } catch (err) {
      logger.error(`Error updating config: ${(err as Error).message}`)
    }

    logger.break()

    if (successCount > 0) {
      const successMsg = generateComponentMessage(successCount, "success")

      printPanelBox(successMsg)
    } else {
      const errorMsg = generateComponentMessage(0, "error")
      logger.error(errorMsg)
    }
  })
