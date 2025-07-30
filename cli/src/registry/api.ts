import { uiComponents } from "@/registry/default/ui"
import { logger } from "@/utils/logger"
import { RegistryItem, REGISTRY_SOURCES, GitHubRegistryMetadata } from "@/types"
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
      // Look for UI components
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
  // Fetch metadata first
  const metadata = await fetchGitHubRegistryMetadata("artifacts", branch)
  if (!metadata || !metadata[name]) {
    logger.debug(`Component "${name}" not found in GitHub artifacts metadata`)
    return null
  }

  const componentMeta = metadata[name]

  // Fetch the actual component files based on metadata
  return await fetchGitHubComponentFromMetadata(
    name,
    "artifacts",
    componentMeta,
    branch,
  )
}

async function getGitHubRegistryDependency(
  name: string,
  branch: string,
): Promise<RegistryItem | null> {
  // Fetch metadata first
  const metadata = await fetchGitHubRegistryMetadata("ui", branch)
  if (!metadata || !metadata[name]) {
    logger.debug(`UI component "${name}" not found in GitHub UI metadata`)
    return null
  }

  const componentMeta = metadata[name]

  // Fetch the actual component files based on metadata
  return await fetchGitHubComponentFromMetadata(
    name,
    "ui",
    componentMeta,
    branch,
  )
}

async function fetchGitHubRegistryMetadata(
  type: "artifacts" | "ui",
  branch: string,
): Promise<GitHubRegistryMetadata | null> {
  try {
    const baseUrl = REGISTRY_SOURCES.GITHUB(ENV_CONFIG.github.repo, branch)
    const metadataUrl = `${baseUrl}cli/src/registry/github/${type}.json`

    const response = await fetchGitHubFile(metadataUrl)
    if (!response) {
      logger.debug(`No GitHub registry metadata found at ${metadataUrl}`)
      return null
    }

    return JSON.parse(response) as GitHubRegistryMetadata
  } catch (error) {
    logger.error(
      `Failed to parse GitHub registry metadata for ${type}: ${error}`,
    )
    return null
  }
}

async function fetchGitHubComponentFromMetadata(
  name: string,
  type: "artifacts" | "ui",
  metadata: GitHubRegistryMetadata[string],
  branch: string,
): Promise<RegistryItem | null> {
  try {
    const baseUrl = REGISTRY_SOURCES.GITHUB(ENV_CONFIG.github.repo, branch)
    const registryItem: RegistryItem = {
      name,
      type: metadata.type,
      dependencies:
        metadata.dependencies.length > 0 ? metadata.dependencies : undefined,
      registryDependencies:
        metadata.registryDependencies.length > 0
          ? metadata.registryDependencies
          : undefined,
      files: [],
    }

    // Fetch all files specified in metadata
    for (const fileInfo of metadata.files) {
      const filePath =
        type === "artifacts"
          ? `hax/artifacts/${name}/${fileInfo.name}`
          : `hax/components/ui/${fileInfo.name}`

      const fileUrl = `${baseUrl}${filePath}`
      const fileContent = await fetchGitHubFile(fileUrl)

      if (fileContent) {
        registryItem.files.push({
          path: filePath,
          type: fileInfo.type,
          content: fileContent,
        })
      } else {
        logger.debug(`Could not fetch file: ${fileUrl}`)
      }
    }

    return registryItem.files.length > 0 ? registryItem : null
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
