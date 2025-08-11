import { Command } from "commander"
import fs from "fs"
import path from "path"
import inquirer from "inquirer"
import { logger, printPanelBox, highlighter } from "@/utils/logger"

export const admin = new Command()
  .name("admin")
  .description("Administrative commands for HAX registries")

admin
  .command("init-repo")
  .description("Initialize a new HAX component repository")
  .option("--github <repo>", "GitHub repository to initialize")
  .option("--path <path>", "Local path to initialize", ".")
  .option("--create-remote", "Create GitHub repository and push files")
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
    )
  })

admin
  .command("generate-template")
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

admin
  .command("validate-registry")
  .description("Validate registry configuration and structure")
  .option("--path <path>", "Path to registry", ".")
  .option("--remote <url>", "Remote registry URL to validate")
  .action(async (options) => {
    await validateRegistry(options.path, options.remote)
  })

admin
  .command("manage-access")
  .description("Manage access control and permissions")
  .option("--repo <repo>", "GitHub repository")
  .option("--user <user>", "Username to manage")
  .option("--action <action>", "Action: grant, revoke, list", "list")
  .action(async (options) => {
    await manageAccess(options.repo, options.user, options.action)
  })

async function initializeRepository(
  githubRepo: string,
  outputPath: string,
  createRemote?: boolean,
  token?: string,
) {
  logger.info(
    `🚀 Initializing HAX registry for: ${highlighter.primary(githubRepo)}`,
  )

  const repoPath = path.resolve(outputPath)

  const dirs = [
    "cli/src/registry/github-registry",
    "hax/artifacts",
    "hax/components/ui",
    "hax/composers",
    "templates",
    "docs",
  ]

  logger.info("📁 Creating directory structure...")
  dirs.forEach((dir) => {
    const fullPath = path.join(repoPath, dir)
    fs.mkdirSync(fullPath, { recursive: true })
    logger.debug(`Created: ${dir}`)
  })

  const artifactsJson = {
    "example-component": {
      type: "registry:artifacts",
      dependencies: ["react", "clsx"],
      registryDependencies: ["button", "input"],
      files: [
        { name: "component.tsx", type: "registry:component" },
        { name: "action.ts", type: "registry:hook" },
        { name: "types.ts", type: "registry:types" },
        { name: "index.ts", type: "registry:index" },
        { name: "description.ts", type: "registry:description" },
      ],
    },
  }

  const uiJson = {
    button: {
      type: "registry:ui",
      dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
      registryDependencies: [],
      files: [{ name: "button.tsx", type: "registry:component" }],
    },
  }

  const composersJson = {
    "example-feature": {
      type: "registry:composer",
      dependencies: ["react", "lucide-react"],
      registryDependencies: ["button", "input"],
      files: [
        { name: "feature-context.tsx", type: "registry:component" },
        { name: "feature-ui.tsx", type: "registry:component" },
        { name: "hooks.ts", type: "registry:hook" },
        { name: "types.ts", type: "registry:types" },
        { name: "index.ts", type: "registry:index" },
      ],
    },
  }

  fs.writeFileSync(
    path.join(repoPath, "cli/src/registry/github-registry/artifacts.json"),
    JSON.stringify(artifactsJson, null, 2),
  )
  fs.writeFileSync(
    path.join(repoPath, "cli/src/registry/github-registry/ui.json"),
    JSON.stringify(uiJson, null, 2),
  )
  fs.writeFileSync(
    path.join(repoPath, "cli/src/registry/github-registry/composers.json"),
    JSON.stringify(composersJson, null, 2),
  )

  // Generate README
  const readme = `# ${githubRepo} - HAX Component Registry

This repository contains HAX components that can be installed using the HAX CLI.

## Installation

Users can add this registry to their HAX projects:

\`\`\`bash
export HAX_REGISTRY_SOURCE="github:${githubRepo}:main"
agntcy-hax add <component-name>
\`\`\`

## Structure

- \`cli/src/registry/github-registry/\` - Registry metadata files
- \`hax/artifacts/\` - Component artifacts
- \`hax/components/ui/\` - UI components  
- \`hax/composers/\` - Feature composers
- \`templates/\` - Component templates

## Contributing

1. Add your component files to the appropriate directory
2. Update the corresponding registry JSON file
3. Test with \`agntcy-hax admin validate-registry\`
`

  fs.writeFileSync(path.join(repoPath, "README.md"), readme)

  logger.success("✅ Repository structure created successfully!")

  // GitHub repository creation and push
  if (createRemote) {
    await createAndPushToGitHub(githubRepo, repoPath, token)
  } else {
    printPanelBox(
      `${highlighter.success("🎉 HAX Registry Initialized!")}\n` +
        `${highlighter.debug("Repository:")} ${highlighter.accent(githubRepo)}\n` +
        `${highlighter.debug("Path:")} ${highlighter.info(repoPath)}\n\n` +
        `${highlighter.warn("Next Steps:")}\n` +
        `1. Add your components to the appropriate directories\n` +
        `2. Update registry JSON files\n` +
        `3. Run: ${highlighter.primary("agntcy-hax admin validate-registry")}\n` +
        `4. Commit and push to GitHub`,
    )
  }
}

async function generateTemplate(
  type: string,
  name: string,
  outputPath: string,
) {
  logger.info(`🎨 Generating ${type} template: ${highlighter.primary(name)}`)

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

async function generateComponentTemplate(name: string, outputDir: string) {
  const componentContent = `import React from "react"
import { cn } from "@/lib/utils"

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
      // Implementation here
    },
  })
}
`

  const typesContent = `export interface ${toPascalCase(name)}Data {
  id: string
  // Add your data structure here
}

export interface ${toPascalCase(name)}Config {
  // Add your configuration here
}
`

  const indexContent = `export { ${toPascalCase(name)} } from "./${name}"
export { use${toPascalCase(name)}Action } from "./action"
export type { ${toPascalCase(name)}Props, ${toPascalCase(name)}Data, ${toPascalCase(name)}Config } from "./types"
`

  const descriptionContent = `export const ${name}Description = {
  name: "${name}",
  description: "A brief description of the ${name} component",
  usage: "Used for...",
  examples: [
    {
      title: "Basic usage",
      code: \`<${toPascalCase(name)} />\`
    }
  ]
}
`

  fs.writeFileSync(path.join(outputDir, `${name}.tsx`), componentContent)
  fs.writeFileSync(path.join(outputDir, "action.ts"), actionContent)
  fs.writeFileSync(path.join(outputDir, "types.ts"), typesContent)
  fs.writeFileSync(path.join(outputDir, "index.ts"), indexContent)
  fs.writeFileSync(path.join(outputDir, "description.ts"), descriptionContent)
}

async function generateComposerTemplate(name: string, outputDir: string) {
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

async function validateRegistry(registryPath: string, remoteUrl?: string) {
  logger.info(`🔍 Validating registry at: ${highlighter.info(registryPath)}`)

  const errors: string[] = []
  const warnings: string[] = []

  // Check directory structure
  const requiredDirs = ["cli/src/registry/github-registry", "hax"]

  requiredDirs.forEach((dir) => {
    const fullPath = path.join(registryPath, dir)
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing directory: ${dir}`)
    }
  })

  // Check registry files
  const registryFiles = ["artifacts.json", "ui.json", "composers.json"]
  const registryDir = path.join(
    registryPath,
    "cli/src/registry/github-registry",
  )

  registryFiles.forEach((file) => {
    const filePath = path.join(registryDir, file)
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        logger.debug(`✅ ${file} is valid JSON`)

        Object.entries(content).forEach(([key, value]: [string, any]) => {
          if (!value.type || !value.files) {
            errors.push(`${file}: Component "${key}" missing required fields`)
          }
        })
      } catch (e) {
        errors.push(`${file}: Invalid JSON format`)
      }
    } else {
      warnings.push(`Optional file missing: ${file}`)
    }
  })

  if (remoteUrl) {
    logger.info(`🌐 Validating remote registry: ${remoteUrl}`)
    try {
      // Parse GitHub URL format
      const githubMatch = remoteUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (githubMatch) {
        const [, owner, repo] = githubMatch
        const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/`

        // Check if registry files exist remotely
        const remoteFiles = ["artifacts.json", "ui.json", "composers.json"]
        for (const file of remoteFiles) {
          const fileUrl = `${baseUrl}cli/src/registry/github-registry/${file}`
          try {
            const response = await fetch(fileUrl)
            if (response.ok) {
              const content = await response.text()
              JSON.parse(content) // Validate JSON
              logger.debug(`✅ Remote ${file} is valid`)
            } else if (response.status === 404) {
              warnings.push(`Remote file not found: ${file}`)
            } else {
              errors.push(`Failed to fetch remote ${file}: ${response.status}`)
            }
          } catch (e) {
            errors.push(`Invalid JSON in remote ${file}`)
          }
        }
      } else {
        warnings.push(
          "URL format not recognized. Expected GitHub repository URL",
        )
      }
    } catch (e) {
      errors.push(`Failed to validate remote registry: ${e}`)
    }
  }

  // Report results
  if (errors.length > 0) {
    logger.error("❌ Registry validation failed:")
    errors.forEach((error) => logger.error(`  • ${error}`))
  } else {
    logger.success("✅ Registry validation passed!")
  }

  if (warnings.length > 0) {
    logger.warn("⚠️  Warnings:")
    warnings.forEach((warning) => logger.warn(`  • ${warning}`))
  }

  return errors.length === 0
}

async function manageAccess(
  repo?: string,
  user?: string,
  action: string = "list",
) {
  logger.info(`🔐 Managing access for repository: ${repo || "current"}`)

  switch (action) {
    case "grant":
      if (!user) {
        logger.error("--user required for grant action")
        return
      }
      if (!repo) {
        logger.error("--repo required for grant action")
        return
      }

      logger.info(
        `🔐 Granting access to ${highlighter.accent(user)} on ${highlighter.primary(repo)}`,
      )

      try {
        // For GitHub repositories, this would typically involve:
        // 1. Adding user as collaborator
        // 2. Setting appropriate permissions

        const answers = await inquirer.prompt([
          {
            type: "list",
            name: "permission",
            message: "What permission level should be granted?",
            choices: [
              { name: "Read - Can install components", value: "pull" },
              { name: "Write - Can add/modify components", value: "push" },
              { name: "Admin - Full repository access", value: "admin" },
            ],
          },
        ])

        const githubToken = process.env.GITHUB_TOKEN
        if (!githubToken) {
          logger.error(
            "❌ GITHUB_TOKEN environment variable required for access management",
          )
          return
        }

        // Add user as collaborator using GitHub API
        const [owner, repoName] = repo.split("/")
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repoName}/collaborators/${user}`,
          {
            method: "PUT",
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              permission: answers.permission,
            }),
          },
        )

        if (response.ok) {
          logger.success(
            `✅ Access granted to ${user} with ${answers.permission} permissions`,
          )
        } else {
          const error = await response.text()
          logger.error(`❌ Failed to grant access: ${error}`)
        }
      } catch (error) {
        logger.error(`Failed to grant access: ${error}`)
      }
      break

    case "revoke":
      if (!user) {
        logger.error("--user required for revoke action")
        return
      }
      if (!repo) {
        logger.error("--repo required for revoke action")
        return
      }

      logger.info(
        `🔐 Revoking access from ${highlighter.accent(user)} on ${highlighter.primary(repo)}`,
      )

      try {
        const answers = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: `Are you sure you want to revoke access for ${user}?`,
            default: false,
          },
        ])

        if (answers.confirm) {
          const githubToken = process.env.GITHUB_TOKEN
          if (!githubToken) {
            logger.error(
              "❌ GITHUB_TOKEN environment variable required for access management",
            )
            return
          }

          // Remove collaborator using GitHub API
          const [owner, repoName] = repo.split("/")
          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}/collaborators/${user}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `token ${githubToken}`,
                Accept: "application/vnd.github.v3+json",
              },
            },
          )

          if (response.ok) {
            logger.success(`✅ Access revoked for ${user}`)
          } else {
            const error = await response.text()
            logger.error(`❌ Failed to revoke access: ${error}`)
          }
        } else {
          logger.info("Access revocation cancelled")
        }
      } catch (error) {
        logger.error(`Failed to revoke access: ${error}`)
      }
      break

    case "list":
      logger.info("Current access permissions:")
      logger.info("• Admin: Full repository access")
      logger.info("• Contributor: Can add/modify components")
      logger.info("• Reader: Can install components")
      break

    default:
      logger.error(`Unknown action: ${action}`)
  }
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}

async function createAndPushToGitHub(
  githubRepo: string,
  repoPath: string,
  token?: string,
) {
  const [owner, repo] = githubRepo.split("/")
  const githubToken = token || process.env.GITHUB_TOKEN

  if (!githubToken) {
    logger.error(
      "❌ GitHub token required. Use --token or set GITHUB_TOKEN environment variable",
    )
    return
  }

  try {
    logger.info("🌐 Creating GitHub repository...")

    // Create GitHub repository
    const createRepoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (createRepoResponse.status === 404) {
      // Repository doesn't exist, create it
      const createResponse = await fetch(`https://api.github.com/user/repos`, {
        method: "POST",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: repo,
          description: `HAX Component Registry - ${githubRepo}`,
          private: false,
          auto_init: false,
        }),
      })

      if (!createResponse.ok) {
        const error = await createResponse.text()
        logger.error(`❌ Failed to create repository: ${error}`)
        return
      }

      logger.info("✅ GitHub repository created successfully!")
    } else if (createRepoResponse.ok) {
      logger.info("ℹ️  Repository already exists on GitHub")
    } else {
      logger.error("❌ Failed to check repository status")
      return
    }

    logger.info("📦 Initializing git repository and pushing...")

    const { execSync } = await import("child_process")

    execSync("git init", { cwd: repoPath, stdio: "pipe" })
    execSync("git add .", { cwd: repoPath, stdio: "pipe" })
    execSync('git commit -m "Initial HAX registry setup"', {
      cwd: repoPath,
      stdio: "pipe",
    })
    execSync("git branch -M main", { cwd: repoPath, stdio: "pipe" })
    execSync(`git remote add origin https://github.com/${githubRepo}.git`, {
      cwd: repoPath,
      stdio: "pipe",
    })
    execSync(`git push -u origin main`, { cwd: repoPath, stdio: "pipe" })

    logger.success("🎉 Repository successfully created and pushed to GitHub!")

    printPanelBox(
      `${highlighter.success("🎉 HAX Registry Created & Published!")}\n` +
        `${highlighter.debug("Repository:")} ${highlighter.accent(`https://github.com/${githubRepo}`)}\n` +
        `${highlighter.debug("Path:")} ${highlighter.info(repoPath)}\n\n` +
        `${highlighter.success("✅ Your repository is now live!")}\n` +
        `Users can now add your registry:\n` +
        `${highlighter.primary(`agntcy-hax repo add myrepo --github=${githubRepo}`)}\n` +
        `${highlighter.primary(`agntcy-hax add <component-name> --repo=myrepo`)}\n\n` +
        `${highlighter.warn("Next Steps:")}\n` +
        `1. Add your custom components to the appropriate directories\n` +
        `2. Update the registry JSON files\n` +
        `3. Test with: ${highlighter.primary("agntcy-hax admin validate-registry --remote https://github.com/" + githubRepo)}`,
    )
  } catch (error) {
    logger.error(`❌ Failed to create/push repository: ${error}`)
    logger.info("\nFalling back to manual setup...")
    printPanelBox(
      `${highlighter.success("🎉 HAX Registry Initialized!")}\n` +
        `${highlighter.debug("Repository:")} ${highlighter.accent(githubRepo)}\n` +
        `${highlighter.debug("Path:")} ${highlighter.info(repoPath)}\n\n` +
        `${highlighter.warn("Manual Setup Required:")}\n` +
        `1. Create repository at: ${highlighter.accent(`https://github.com/new`)}\n` +
        `2. Run these commands:\n` +
        `   ${highlighter.primary(`cd ${repoPath}`)}\n` +
        `   ${highlighter.primary("git init && git add . && git commit -m 'Initial setup'")}\n` +
        `   ${highlighter.primary(`git remote add origin https://github.com/${githubRepo}.git`)}\n` +
        `   ${highlighter.primary("git push -u origin main")}`,
    )
  }
}
