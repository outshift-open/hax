/*
 * Copyright 2025 Cisco Systems, Inc. and its affiliates
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from "commander"
import fs from "fs"
import path from "path"
import inquirer from "inquirer"
import { logger, highlighter } from "@/utils/logger"

// Utility function for converting strings to PascalCase
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}

export const generateTemplateCommand = new Command()
  .name("generate-template")
  .description("Generate component or composer templates")
  .option(
    "--type <type>",
    "Template type: component, artifact, composer",
    "component",
  )
  .option("--name <name>", "Template name")
  .option("--output <path>", "Output directory", "./templates")
  .action(async (options) => {
    if (!options.name) {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "templateName",
          message: "What should the template be called?",
          validate: (input) =>
            input.trim() ? true : "Please enter a template name",
        },
      ])
      options.name = answers.templateName
    }

    await generateTemplate(options.type, options.name, options.output)
  })

export async function generateTemplate(
  type: string,
  name: string,
  outputPath: string,
) {
  logger.info(`Generating ${type} template: ${highlighter.primary(name)}`)

  const templateDir = path.join(outputPath, type, name)
  fs.mkdirSync(templateDir, { recursive: true })

  switch (type) {
    case "component":
    case "artifact":
      await generateComponentTemplate(name, templateDir)
      break
    case "composer":
      await generateComposerTemplate(name, templateDir)
      break
    default:
      logger.error(
        `Unknown template type: ${type}. Available types: component, artifact, composer`,
      )
      return
  }

  logger.success(`✅ Template generated at: ${templateDir}`)
}

export async function generateComponentTemplate(
  name: string,
  outputDir: string,
) {
  const componentContent = `import React from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export interface ${toPascalCase(name)}Props {
  className?: string
  children?: React.ReactNode
}

export function ${toPascalCase(name)}({ className, children, ...props }: ${toPascalCase(name)}Props) {
  return (
    <div className={cn("${name}", className)} {...props}>
      {children}
    </div>
  )
}
`

  const actionContent = `import { useCopilotAction } from "@copilotkit/react-core"

export function use${toPascalCase(name)}Action() {
  useCopilotAction({
    name: "${name}",
    description: "Manage ${name} functionality",
    parameters: [],
    handler: async () => {
      // Include implementation here
    },
  })
}
`

  const typesContent = `import { z } from "zod";

export interface ${toPascalCase(name)}Props {
  className?: string;
  children?: React.ReactNode;
}

export interface ${toPascalCase(name)}Data {
  id: string;
  // Add your data structure here
}

export interface ${toPascalCase(name)}Config {
  // Add your configuration here
}

export const ${toPascalCase(name)}ArgsZod = z.object({
  // Add your Zod schema here
});

export const ${toPascalCase(name)}ArtifactZod = z.object({
  id: z.string(),
  type: z.literal("${name}"),
  data: ${toPascalCase(name)}ArgsZod,
});

export type ${toPascalCase(name)}Artifact = z.infer<typeof ${toPascalCase(name)}ArtifactZod>;
`

  const indexContent = `export { ${toPascalCase(name)} } from "./${name}";
export { use${toPascalCase(name)}Action } from "./action";
export type { 
  ${toPascalCase(name)}Props, 
  ${toPascalCase(name)}Data, 
  ${toPascalCase(name)}Config,
  ${toPascalCase(name)}Artifact 
} from "./types";
export { ${toPascalCase(name)}ArtifactZod } from "./types";
`

  const descriptionContent = `export const ${name.toUpperCase().replace(/-/g, "_")}_DESCRIPTION =
  \`Use ${name} components for [describe the primary use case]. Best for [specific scenarios]. 

[Detailed usage guidelines and best practices]

[Do's and don'ts for optimal usage]

[Technical details about layout, positioning, or behavior]\` as const;
`

  fs.writeFileSync(path.join(outputDir, `${name}.tsx`), componentContent)
  fs.writeFileSync(path.join(outputDir, "action.ts"), actionContent)
  fs.writeFileSync(path.join(outputDir, "types.ts"), typesContent)
  fs.writeFileSync(path.join(outputDir, "index.ts"), indexContent)
  fs.writeFileSync(path.join(outputDir, "description.ts"), descriptionContent)
}

export async function generateComposerTemplate(
  name: string,
  outputDir: string,
) {
  const contextContent = `import React, { createContext, useContext, useState } from "react"

interface ${toPascalCase(name)}ContextType {
  // Define your context state here
}

const ${toPascalCase(name)}Context = createContext<${toPascalCase(name)}ContextType | undefined>(undefined)

export function ${toPascalCase(name)}Provider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({})

  return (
    <${toPascalCase(name)}Context.Provider value={{ state, setState }}>
      {children}
    </${toPascalCase(name)}Context.Provider>
  )
}

export function use${toPascalCase(name)}() {
  const context = useContext(${toPascalCase(name)}Context)
  if (!context) {
    throw new Error("use${toPascalCase(name)} must be used within ${toPascalCase(name)}Provider")
  }
  return context
}
`

  const uiContent = `import React from "react"
import { use${toPascalCase(name)} } from "./${name}-context"

export function ${toPascalCase(name)}UI() {
  const { state } = use${toPascalCase(name)}()

  return (
    <div className="${name}-ui">
      {/* Your UI implementation */}
    </div>
  )
}
`

  fs.writeFileSync(path.join(outputDir, `${name}-context.tsx`), contextContent)
  fs.writeFileSync(path.join(outputDir, `${name}-ui.tsx`), uiContent)
}
