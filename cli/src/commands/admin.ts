import { Command } from "commander"
import { logger } from "@/utils/logger"

export const admin = new Command()
  .name("admin")
  .description("Administrative commands for HAX registries")

admin
  .command("init-repo")
  .description("Initialize a new HAX component repository")
  .option("--github <repo>", "GitHub repository to initialize")
  .action((options) => {
    if (!options.github) {
      logger.error("--github option is required")
      return
    }

    logger.info(`🚀 Repository initialization guide for: ${options.github}`)
    logger.info("\n📋 Steps to set up your HAX registry:")
    logger.info("1. Create the following directory structure:")
    logger.info(`
├── README.md
├── cli/
│   └── src/
│       └── registry/
│           └── github-registry/
│               ├── artifacts.json
│               └── ui.json
└── hax/
    ├── artifacts/
    │   └── your-component/
    │       ├── component.tsx
    │       ├── action.ts
    │       ├── types.ts
    │       ├── index.ts
    │       └── description.ts
    └── components/
        └── ui/
    `)

    logger.info("2. Example artifacts.json:")
    logger.info(`{
  "your-component": {
    "type": "registry:artifacts",
    "dependencies": ["react", "clsx"],
    "registryDependencies": [],
    "files": [
      { "name": "component.tsx", "type": "registry:component" },
      { "name": "action.ts", "type": "registry:hook" },
      { "name": "types.ts", "type": "registry:types" },
      { "name": "index.ts", "type": "registry:index" },
      { "name": "description.ts", "type": "registry:description" }
    ]
  }
}`)

    logger.info("\n3. After setup, users can add your registry:")
    logger.info(`   hax repo add my-org --github=${options.github}`)
  })
