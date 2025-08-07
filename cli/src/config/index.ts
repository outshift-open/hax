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

    const config: HaxConfig = {
      $schema: parsed.$schema ?? "https://hax.dev/schema.json",
      style: parsed.style ?? "default",
      artifacts: parsed.artifacts ?? { path: "src/hax/artifacts" },
      components: Array.isArray(parsed.components) ? parsed.components : [],
    }

    // Only include optional fields if they exist in the parsed config
    if (parsed.zones) config.zones = parsed.zones
    if (parsed.messages) config.messages = parsed.messages
    if (parsed.prompts) config.prompts = parsed.prompts
    if (parsed.registries) config.registries = parsed.registries
    if (parsed.backend_framework)
      config.backend_framework = parsed.backend_framework
    if (parsed.frontend_framework)
      config.frontend_framework = parsed.frontend_framework

    return config
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

  if (!fs.existsSync("package.json")) {
    logger.error(
      "\n" +
        "Error: No package.json found in current directory.\n" +
        "Please run 'agntcy-hax init' in a Node.js project directory.",
    )
    process.exit(1)
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
    components: [],
  }

  console.log("")

  printPanelBox(
    `${highlighter.warn("📝 Configuration Summary:")}\n` +
      `${highlighter.debug("Base Path:")} ${highlighter.info(basePath)}\n` +
      `${highlighter.debug("Artifacts Path:")} ${highlighter.accent(config.artifacts.path)}\n`,
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
