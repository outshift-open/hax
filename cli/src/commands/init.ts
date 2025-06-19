import { Command } from "commander";
import { createConfig } from "../config";

export const initCommand = new Command("init")
  .description("Initialize a new HAX SDK config file")
  .action(async () => {
    await createConfig();
  });
