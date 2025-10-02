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

import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { logger, printPanelBox, highlighter } from "@/utils/logger"

export async function initializeRepository(
  githubRepo: string,
  outputPath: string,
  createRemote?: boolean,
  token?: string,
  isPrivate?: boolean,
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

  const readme = `# ${githubRepo} - HAX Component Registry

This repository contains HAX components that can be installed using the HAX CLI.

## Installation

Users can add this registry to their HAX projects:

\`\`\`bash
export HAX_REGISTRY_SOURCE="github:${githubRepo}:main"
hax add <component-name>
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
3. Test with \`hax admin validate-registry\`
`

  fs.writeFileSync(path.join(repoPath, "README.md"), readme)

  logger.success("✅ Repository structure created successfully!")

  if (createRemote) {
    await createAndPushToGitHub(githubRepo, repoPath, token, isPrivate)
  } else {
    printPanelBox(
      `${highlighter.success("🎉 HAX Registry Initialized!")}\n` +
        `${highlighter.debug("Repository:")} ${highlighter.accent(githubRepo)}\n` +
        `${highlighter.debug("Path:")} ${highlighter.info(repoPath)}\n\n` +
        `${highlighter.warn("Next Steps:")}\n` +
        `1. Add your components to the appropriate directories\n` +
        `2. Update registry JSON files\n` +
        `3. Run: ${highlighter.primary("hax admin validate-registry")}\n` +
        `4. Commit and push to GitHub`,
    )
  }
}

export async function createAndPushToGitHub(
  githubRepo: string,
  repoPath: string,
  token?: string,
  isPrivate?: boolean,
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
          private: !!isPrivate,
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
        `${highlighter.primary(`hax repo add myrepo --github=${githubRepo}`)}\n` +
        `${highlighter.primary(`hax add <component-name> --repo=myrepo`)}\n\n` +
        `${highlighter.warn("Next Steps:")}\n` +
        `1. Add your custom components to the appropriate directories\n` +
        `2. Update the registry JSON files\n` +
        `3. Test with: ${highlighter.primary(`hax admin validate-registry --remote https://github.com/${githubRepo}`)}`,
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
