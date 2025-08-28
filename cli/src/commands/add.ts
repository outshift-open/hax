import { Command } from "commander"
import { generateComponent } from "../generator"
import { readConfig, updateConfig } from "../config"
import { logger, printPanelBox } from "../utils/logger"

import { getRegistryItem } from "@/registry/api"
import fs from "fs"

export const addCommand = new Command("add").description(
  "Add HAX components from the library to your project",
)

addCommand
  .command("artifact")
  .argument("<components...>", "Artifact component name(s) to add")
  .description("Add artifact components from the registry")
  .option("--repo <repository>", "Specific repository to pull from")
  .option("--token <token>", "GitHub token for private repository access")
  .action(async (componentNames: string[], options) => {
    await handleAdd(componentNames, options, "artifact")
  })

addCommand
  .command("composer")
  .argument("<components...>", "Composer component name(s) to add")
  .description("Add composer components from the registry")
  .option("--repo <repository>", "Specific repository to pull from")
  .option("--token <token>", "GitHub token for private repository access")
  .action(async (componentNames: string[], options) => {
    await handleAdd(componentNames, options, "composer")
  })

addCommand
  .command("adapter")
  .argument("<components...>", "Adapter component name(s) to add")
  .description("Add adapter components from the registry")
  .option("--repo <repository>", "Specific repository to pull from")
  .option("--token <token>", "GitHub token for private repository access")
  .action(async (componentNames: string[], options) => {
    await handleAdd(componentNames, options, "adapter")
  })

async function handleAdd(
  componentNames: string[],
  options: any,
  type: "artifact" | "composer" | "adapter",
) {
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

  const token: string | undefined = options.token

  let successCount = 0
  let errorCount = 0

  const typeLabel =
    type === "artifact"
      ? "component"
      : type === "composer"
        ? "composer"
        : "adapter"
  const typeLabelPlural =
    type === "artifact"
      ? "components"
      : type === "composer"
        ? "composers"
        : "adapters"

  if (componentNames.length === 1) {
    logger.info(`🔮 Adding ${typeLabel}: ${componentNames[0]} from HAX library`)
  } else {
    logger.info(
      `🔮 Adding ${typeLabelPlural}: ${componentNames.join(", ")} from HAX library`,
    )
  }
  logger.break()

  // Ensure directory exists
  if (type === "artifact") {
    const artifactsPath = config.artifacts?.path ?? "src/hax/artifacts"
    if (!fs.existsSync(artifactsPath)) {
      logger.info(
        `Artifacts path '${artifactsPath}' does not exist. It will be created.`,
      )
    }
  } else if (type === "composer") {
    const composersPath = config.composers?.path ?? "src/hax/composers"
    if (!fs.existsSync(composersPath)) {
      logger.info(
        `Composers path '${composersPath}' does not exist. It will be created.`,
      )
    }
  } else {
    const adaptersPath = config.adapters?.path ?? "src/hax/adapters"
    if (!fs.existsSync(adaptersPath)) {
      logger.info(
        `Adapters path '${adaptersPath}' does not exist. It will be created.`,
      )
    }
  }

  for (const componentName of componentNames) {
    try {
      // Use unified registry API that handles local/GitHub fallback automatically
      const component = await getRegistryItem(
        componentName,
        options.repo, // specific repo if provided
        config,
        token,
        type, // Pass the component type to avoid checking other types
      )

      if (!component) {
        logger.error(
          `${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} "${componentName}" not found in registry`,
        )
        errorCount++
        continue
      }

      await generateComponent(componentName, config, component)

      // Store components with source information and set up config structure
      if (type === "artifact") {
        // Set up artifacts config if first artifact
        if (!config.artifacts) {
          config.artifacts = { path: "src/hax/artifacts" }
        }
        if (!config.components) config.components = []
        const existingComponent = config.components.find((comp: any) =>
          typeof comp === "string"
            ? comp === componentName
            : comp.name === componentName,
        )
        if (!existingComponent) {
          config.components.push({
            name: componentName,
            source: component.source || "local",
          })
        }
      } else if (type === "composer") {
        // Set up composers config if first composer
        if (!config.composers) {
          config.composers = { path: "src/hax/composers" }
        }
        if (!config.features) config.features = []
        const existingFeature = config.features.find((feat: any) =>
          typeof feat === "string"
            ? feat === componentName
            : feat.name === componentName,
        )
        if (!existingFeature) {
          config.features.push({
            name: componentName,
            source: component.source || "local",
          })
        }
      } else {
        // Set up adapters config if first adapter
        if (!config.adapters) {
          config.adapters = { path: "src/hax/adapters" }
        }
        if (!config.installedAdapters) config.installedAdapters = []
        const existingAdapter = config.installedAdapters.find((adapt: any) =>
          typeof adapt === "string"
            ? adapt === componentName
            : adapt.name === componentName,
        )
        if (!existingAdapter) {
          config.installedAdapters.push({
            name: componentName,
            source: component.source || "local",
          })
        }
      }

      successCount++
      logger.success(`Added ${componentName} ${typeLabel}`)
    } catch (error) {
      logger.error(`Error adding ${typeLabel} "${componentName}": ${error}`)
      errorCount++
    }
  }

  if (successCount > 0) {
    try {
      updateConfig(config)
    } catch (error) {
      logger.warn(`Warning: Could not update config file: ${error}`)
    }
  }

  logger.break()

  if (successCount > 0 && errorCount === 0) {
    const message =
      successCount === 1
        ? `✨ Successfully added 1 ${typeLabel}!`
        : `✨ Successfully added ${successCount} ${typeLabelPlural}!`

    printPanelBox(`${message}\n📦 Components are ready to use`)
  } else if (successCount > 0 && errorCount > 0) {
    logger.info(`✅ Successfully added ${successCount} ${typeLabelPlural}`)
    logger.error(`❌ Failed to add ${errorCount} ${typeLabelPlural}`)
  } else {
    logger.error(`❌ Failed to add any ${typeLabelPlural}`)

    if (errorCount > 0) {
      logger.break()
      logger.error(
        `Error adding ${typeLabel}. Component does not exist in registry. Please confirm that component is valid. If using a private repository, ensure GITHUB_TOKEN is set or use --token flag.`,
      )
    }
  }
}
