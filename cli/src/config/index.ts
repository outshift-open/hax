import fs from "fs"
import inquirer from "inquirer"
import path from "path"
import { logger, printPanelBox, highlighter } from "@/utils/logger"
import { HaxConfig, CONFIG_FILE } from "@/types"

export function readConfig(): HaxConfig {
  if (!fs.existsSync(CONFIG_FILE)) {
    logger.error(
      "\n" + "Error: Config file not found. Have you run 'agntcy-hax init'?",
    )
    process.exit(1)
  }
  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8")
    const parsed = JSON.parse(raw)

    if (!parsed.style || !parsed.artifacts?.path) {
      logger.error("Missing required configuration fields")
    }

    return {
      $schema: parsed.$schema ?? "https://hax.dev/schema.json",
      style: parsed.style ?? "default",
      artifacts: parsed.artifacts ?? { path: "src/hax/artifacts" },
      zones: parsed.zones ?? { path: "src/hax/zones" },
      messages: parsed.messages ?? { path: "src/hax/messages" },
      prompts: parsed.prompts ?? { path: "src/hax/prompts" },
      components: Array.isArray(parsed.components) ? parsed.components : [],
      backend_framework: parsed.backend_framework,
      frontend_framework: parsed.frontend_framework,
    }
  } catch (error) {
    const configPath = path.resolve(CONFIG_FILE)
    logger.error("\n" + `Invalid configuration found in ${configPath}.`)
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`)
    } else {
      logger.error(`Error: ${String(error)}`)
    }
    process.exit(1)
  }
}

export function updateConfig(config: HaxConfig): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
}

export async function createConfig(): Promise<void> {
  if (fs.existsSync(CONFIG_FILE)) {
    logger.info(`✅ Config file already exists, skipping initialization.`)
    return
  }

  logger.info("\n🧙 Welcome to the HAX SDK initialization wizard!\n")
  logger.debug(
    "This wizard will help you set up your HAX SDK configuration.\nYou can always change these settings later in the config file.\n",
  )

  logger.break()

  const pathAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "hax_base_path",
      message: "Where would you like to store your HAX components?",
      default: "src/hax",
      validate: (input: string) => {
        if (!input.trim()) {
          return "Please enter a valid path"
        }
        return true
      },
    },
  ])

  const basePath = pathAnswers.hax_base_path.replace(/\/$/, "")

  const config: HaxConfig = {
    $schema: "./schema.json",
    style: "default",
    artifacts: {
      path: `${basePath}/artifacts`,
    },
    zones: {
      path: `${basePath}/zones`,
    },
    messages: {
      path: `${basePath}/messages`,
    },
    prompts: {
      path: `${basePath}/prompts`,
    },
    components: [],
  }

  console.log("")

  printPanelBox(
    `${highlighter.warn("📝 Configuration Summary:")}\n` +
      `${highlighter.debug("Base Path:")} ${highlighter.info(basePath)}\n` +
      `${highlighter.debug("Artifacts Path:")} ${highlighter.accent(config.artifacts.path)}\n` +
      `${highlighter.debug("")}\n` +
      `${highlighter.debug("Note:")} ${highlighter.debug("Additional paths (zones, messages, prompts) will be created as needed when adding components.")}\n`,
  )
  const confirm = await inquirer.prompt([
    {
      type: "confirm",
      name: "save",
      message: "Do you want to save this configuration to hax.json?",
      default: true,
    },
  ])

  if (!confirm.save) {
    logger.error("❌ Initialization cancelled. No changes made.")
    process.exit(1)
  }

  updateConfig(config)

  console.log("")
  printPanelBox(
    `${highlighter.success("✨ Successfully initialized HAX SDK!")}\n` +
      `${highlighter.debug("🎯 You can now start adding components with:")}\n` +
      `${highlighter.primary("🚀 agntcy-hax add <component-name>")}`,
  )
}
