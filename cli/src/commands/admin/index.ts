import { Command } from "commander"
import { initRepoCommand } from "./init-repo"
import { generateTemplateCommand } from "./template-generator"
import { validateRegistryCommand } from "./registry-validator"
import { manageAccessCommand } from "./access-manager"

export const admin = new Command()
  .name("admin")
  .description("Administrative commands for HAX registries")

admin.addCommand(initRepoCommand)
admin.addCommand(generateTemplateCommand)
admin.addCommand(validateRegistryCommand)
admin.addCommand(manageAccessCommand)
