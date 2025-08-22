import { Command } from "commander"
import { readConfig, updateConfig } from "../config"

import Table from "cli-table3"
import { logger } from "@/utils/logger"
import chalk from "chalk"

// Migration function to convert string components to object format
function migrateComponentsFormat(config: any): boolean {
  let migrated = false

  if (config.components && Array.isArray(config.components)) {
    const hasStringComponents = config.components.some(
      (comp: any) => typeof comp === "string",
    )
    if (hasStringComponents) {
      config.components = config.components.map((comp: any) => {
        if (typeof comp === "string") {
          migrated = true
          return {
            name: comp,
            source: config.registries?.default || "main",
          }
        }
        return comp
      })
    }
  }

  if (config.features && Array.isArray(config.features)) {
    const hasStringFeatures = config.features.some(
      (feat: any) => typeof feat === "string",
    )
    if (hasStringFeatures) {
      config.features = config.features.map((feat: any) => {
        if (typeof feat === "string") {
          migrated = true
          return {
            name: feat,
            source: config.registries?.default || "main",
          }
        }
        return feat
      })
    }
  }

  return migrated
}

export const listCommand = new Command("list")
  .description("List all components currently in the config")
  .action(() => {
    const config = readConfig()

    // Auto-migrate legacy string format to new object format
    const wasMigrated = migrateComponentsFormat(config)
    if (wasMigrated) {
      updateConfig(config)
      logger.debug("Migrated component format to include source information")
    }

    const components = config.components

    if (!Array.isArray(components) || components.length === 0) {
      logger.debug("No components found in config.")
      return
    }

    logger.info("\n📦 Installed Components:\n")

    const table = new Table({
      head: [chalk.white("Component"), chalk.white("Source")],
      style: { head: ["cyan"] },
    })

    components.forEach((comp: any) => {
      if (typeof comp === "string") {
        table.push([comp, chalk.gray("—")])
      } else if (comp && typeof comp === "object" && comp.name) {
        table.push([comp.name, chalk.yellow(comp.source || "—")])
      }
    })

    logger.log(table.toString())
  })
