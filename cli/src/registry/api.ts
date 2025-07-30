import { uiComponents } from "@/registry/default/ui"
import { logger } from "@/utils/logger"
import { RegistryItem, REGISTRY_SOURCES } from "@/types"
import { ENV_CONFIG } from "@/config/env"

export async function getRegistryItem(
  name: string,
  source?: string,
): Promise<RegistryItem | null> {
  try {
    const registrySource = source || ENV_CONFIG.registrySource

    if (registrySource === "local") {
      try {
        const { artifacts } = await import("@/registry/default/artifacts")
        const artifact = artifacts.find(
          (item: { name: string }) => item.name === name,
        )
        return artifact || null
      } catch {
        return null
      }
    } else if (registrySource.startsWith("github:")) {
      const branch = registrySource.replace("github:", "")
      return await getGitHubRegistryItem(name, branch)
    } else {
      logger.error(`Unsupported registry source: ${registrySource}`)
      return null
    }
  } catch (error) {
    logger.error(
      `Failed to fetch component "${name}": ${error instanceof Error ? error.message : String(error)}`,
    )
    return null
  }
}

export async function getRegistryDependency(
  name: string,
  source?: string,
): Promise<RegistryItem | null> {
  try {
    const registrySource = source || ENV_CONFIG.registrySource

    if (registrySource === "local") {
      // Look for UI components (registry dependencies)
      const uiComponent = await getUIComponent(name)
      return uiComponent || null
    } else if (registrySource.startsWith("github:")) {
      const branch = registrySource.replace("github:", "")
      return await getGitHubRegistryDependency(name, branch)
    } else {
      logger.error(`Unsupported registry source: ${registrySource}`)
      return null
    }
  } catch (error) {
    logger.error(
      `Failed to fetch registry dependency "${name}": ${error instanceof Error ? error.message : String(error)}`,
    )
    return null
  }
}

export async function getUIComponent(name: string) {
  return uiComponents.find((comp) => comp.name === name)
}

export async function resolveRegistryDependencies(
  names: string[],
  source?: string,
  visited: Set<string> = new Set(),
): Promise<RegistryItem[]> {
  const registrySource = source || ENV_CONFIG.registrySource
  const resolved: RegistryItem[] = []

  for (const name of names) {
    if (visited.has(name)) continue
    visited.add(name)

    let item = await getRegistryDependency(name, registrySource)
    if (!item) {
      // If not found in UI components, check artifacts (for cases where artifacts depend on other artifacts)
      item = await getRegistryItem(name, registrySource)
    }

    if (!item) {
      logger.warn(`Registry dependency "${name}" not found`)
      continue
    }

    resolved.push(item)

    if (item.registryDependencies) {
      const deps = await resolveRegistryDependencies(
        item.registryDependencies,
        registrySource,
        visited,
      )
      resolved.push(...deps)
    }
  }

  return resolved
}

async function getGitHubRegistryItem(
  name: string,
  branch: string,
): Promise<RegistryItem | null> {
  const baseUrl = REGISTRY_SOURCES.GITHUB(ENV_CONFIG.github.repo, branch)

  const artifactComponent = await fetchGitHubComponent(
    name,
    "artifacts",
    `${baseUrl}hax/artifacts/${name}/${name}.tsx`,
    branch,
  )
  return artifactComponent
}

async function getGitHubRegistryDependency(
  name: string,
  branch: string,
): Promise<RegistryItem | null> {
  const baseUrl = REGISTRY_SOURCES.GITHUB(ENV_CONFIG.github.repo, branch)

  const uiComponent = await fetchGitHubComponent(
    name,
    "ui",
    `${baseUrl}hax/components/ui/${name}.tsx`,
    branch,
  )
  return uiComponent
}

async function fetchGitHubComponent(
  name: string,
  type: "ui" | "artifacts",
  mainFileUrl: string,
  branch: string,
): Promise<RegistryItem | null> {
  try {
    const content = await fetchGitHubFile(mainFileUrl)
    if (!content) return null

    const registryItem: RegistryItem = {
      name,
      type: type === "ui" ? "registry:ui" : "registry:artifacts",
      files: [
        {
          path:
            type === "ui"
              ? `hax/components/ui/${name}.tsx`
              : `hax/artifacts/${name}/${name}.tsx`,
          type: "registry:component",
          content,
        },
      ],
    }

    if (type === "artifacts") {
      const baseUrl = REGISTRY_SOURCES.GITHUB(ENV_CONFIG.github.repo, branch)
      const additionalFiles = [
        { name: "action.ts", type: "registry:hook" },
        { name: "types.ts", type: "registry:types" },
        { name: "index.ts", type: "registry:index" },
      ]

      for (const file of additionalFiles) {
        const fileUrl = `${baseUrl}hax/artifacts/${name}/${file.name}`
        const fileContent = await fetchGitHubFile(fileUrl)
        if (fileContent) {
          registryItem.files.push({
            path: `hax/artifacts/${name}/${file.name}`,
            type: file.type,
            content: fileContent,
          })
        }
      }
    }

    // Try to extract dependencies from the content (basic regex parsing)
    const dependencies = extractDependencies(content)
    if (dependencies.length > 0) {
      registryItem.dependencies = dependencies
    }

    // Extract registry dependencies (UI components used)
    const registryDependencies = extractRegistryDependencies(content)
    if (registryDependencies.length > 0) {
      registryItem.registryDependencies = registryDependencies
    }

    return registryItem
  } catch (error) {
    logger.error(`Failed to fetch GitHub component "${name}": ${error}`)
    return null
  }
}

async function fetchGitHubFile(url: string): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      "User-Agent": "agntcy-hax-cli",
    }

    // Add GitHub token if available (for private repositories)
    if (ENV_CONFIG.github.token) {
      headers["Authorization"] = `token ${ENV_CONFIG.github.token}`
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
      if (response.status === 404) {
        logger.debug(`File not found: ${url}`)
      } else if (response.status === 401 || response.status === 403) {
        logger.warn(
          `Authentication failed (${response.status}). Check your GitHub token permissions.`,
        )
      }
      return null
    }

    return await response.text()
  } catch (error) {
    logger.debug(`Failed to fetch file from ${url}: ${error}`)
    return null
  }
}

function extractDependencies(content: string): string[] {
  const dependencies: string[] = []

  // Extract npm package imports (basic detection)
  const npmImportMatches = content.match(/from\s+["']([^@\/][^"']+)["']/g)
  if (npmImportMatches) {
    for (const match of npmImportMatches) {
      const packageName = match.match(/["']([^"']+)["']/)?.[1]
      if (
        packageName &&
        !packageName.startsWith("./") &&
        !packageName.startsWith("../")
      ) {
        // Basic npm package detection - you might want to refine this
        if (!dependencies.includes(packageName)) {
          dependencies.push(packageName)
        }
      }
    }
  }

  return dependencies
}

function extractRegistryDependencies(content: string): string[] {
  const registryDependencies: string[] = []

  // Extract UI component imports
  const uiImportMatches = content.match(
    /from\s+["']@\/components\/ui\/(\w+)["']/g,
  )
  if (uiImportMatches) {
    for (const match of uiImportMatches) {
      const componentName = match.match(/\/(\w+)["']/)?.[1]
      if (componentName && !registryDependencies.includes(componentName)) {
        registryDependencies.push(componentName)
      }
    }
  }

  return registryDependencies
}
