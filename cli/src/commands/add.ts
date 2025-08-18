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

    const componentsByType: { [key: string]: string[] } = {
      "registry:artifacts": [],
      "registry:composer": [],
      "registry:ui": [],
    }

    // First validate all components exist and categorize by type
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

          componentsByType[component.type] =
            componentsByType[component.type] || []
          componentsByType[component.type].push(componentName)
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

    // Update the initial message based on what is being added
    const hasArtifacts = componentsByType["registry:artifacts"].length > 0
    const hasComposers = componentsByType["registry:composer"].length > 0
    const hasUI = componentsByType["registry:ui"].length > 0

    let typeDescription = "component"
    if (hasComposers && !hasArtifacts && !hasUI) {
      typeDescription = "feature"
    } else if (hasArtifacts && hasComposers) {
      typeDescription = "component/feature"
    }

    logger.info(
      `🔮 Adding ${typeDescription}${componentNames.length > 1 ? "s" : ""}: ${componentNames.map((name) => highlighter.primary(name)).join(", ")} from HAX library`,
    )
    logger.break()

    // Ensure artifacts path exists if we have artifacts
    if (hasArtifacts) {
      const artifactsPath = config.artifacts?.path ?? "src/hax/artifacts"
      if (!fs.existsSync(artifactsPath)) {
        logger.warn(
          `Artifacts path '${artifactsPath}' does not exist. It will be created.`,
        )
        fs.mkdirSync(artifactsPath, { recursive: true })
      }
    }

    if (hasComposers) {
      const composersPath = config.composers?.path ?? "src/hax/composers"
      if (!fs.existsSync(composersPath)) {
        logger.warn(
          `Composers path '${composersPath}' does not exist. It will be created.`,
        )
        fs.mkdirSync(composersPath, { recursive: true })
      }
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
