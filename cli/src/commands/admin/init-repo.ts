import { Command } from "commander"
import { logger } from "@/utils/logger"
import { initializeRepository } from "./github-utils"

export const initRepoCommand = new Command()
  .name("init-repo")
  .description("Initialize a new HAX component repository")
  .option("--github <repo>", "GitHub repository to initialize")
  .option("--path <path>", "Local path to initialize", ".")
  .option("--create-remote", "Create GitHub repository and push files")
  .option("--private", "Create private repository (default: public)")
  .option("--token <token>", "GitHub token for repository creation")
  .action(async (options) => {
    if (!options.github) {
      logger.error("--github option is required")
      return
    }

    await initializeRepository(
      options.github,
      options.path,
      options.createRemote,
      options.token,
      options.private,
    )
  })
