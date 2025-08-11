import { Command } from "commander"
import { readConfig, updateConfig } from "../config"
import { logger } from "@/utils/logger"
import fs from "fs"
import path from "path"
import inquirer from "inquirer"

export const removeCommand = new Command("remove")
  .description("Remove an installed component")
  .argument("<component>", "Component name to remove")
  .option("--force", "Skip confirmation prompt")
  .action(async (componentName: string, options: { force?: boolean }) => {
    const config = readConfig()
    const components = config.components || []

    // Find the component
    const componentIndex = components.findIndex((comp: any) => {
      if (typeof comp === "string") {
        return comp === componentName
      } else {
        return comp.name === componentName
      }
    })

    if (componentIndex === -1) {
      logger.error(`❌ Component "${componentName}" is not installed`)
      logger.info("Run 'agntcy-hax list' to see installed components")
      return
    }

    const component = components[componentIndex]
    const componentSource = typeof component === "string" 
      ? "unknown" 
      : component.source || "unknown"

    // Show component info
    logger.info(`📦 Found component: ${componentName}`)
    logger.info(`   Source: ${componentSource}`)
    logger.info(`   Type: ${typeof component === "string" ? "legacy" : "tracked"}`)

    // Confirmation (unless --force)
    if (!options.force) {
      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `Are you sure you want to remove "${componentName}"?`,
          default: false,
        },
      ])

      if (!answers.confirm) {
        logger.info("❌ Remove cancelled")
        return
      }
    }

    // Remove from config
    components.splice(componentIndex, 1)
    config.components = components
    updateConfig(config)

    // Remove component files
    const componentPath = path.join(process.cwd(), "src", "hax", "artifacts", componentName)
    
    if (fs.existsSync(componentPath)) {
      try {
        fs.rmSync(componentPath, { recursive: true, force: true })
        logger.success(`🗑️  Removed component files: ${componentPath}`)
      } catch (error) {
        logger.warn(`⚠️  Failed to remove files at ${componentPath}: ${error}`)
        logger.info("   You may need to remove them manually")
      }
    } else {
      logger.info(`ℹ️  No component files found at ${componentPath}`)
    }

    logger.success(`✅ Component "${componentName}" removed successfully`)
    
    // Show updated list
    const remainingComponents = config.components || []
    if (remainingComponents.length > 0) {
      logger.info(`\n📦 Remaining components: ${remainingComponents.length}`)
      logger.info("Run 'agntcy-hax list' to see them")
    } else {
      logger.info("\n📦 No components remaining")
    }
  })
