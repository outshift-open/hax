import { logger } from "@/utils/logger"
import { RegistryItem, REGISTRY_SOURCES, GitHubRegistryMetadata } from "@/types"
import { ENV_CONFIG } from "@/config/env"

// Fetch a registry item from GitHub artifacts
export async function getGitHubRegistryItem(
  name: string,
  branch: string,
): Promise<RegistryItem | null> {
  const metadata = await fetchGitHubRegistryMetadata("artifacts", branch)
  if (!metadata || !metadata[name]) {
    logger.debug(`Component "${name}" not found in GitHub artifacts metadata`)
    return null
  }

  const componentMeta = metadata[name]

  return await fetchGitHubComponentFromMetadata(
    name,
    "artifacts",
    componentMeta,
    branch,
  )
}

export async function getGitHubRegistryDependency(
  name: string,
  branch: string,
): Promise<RegistryItem | null> {
  // Fetch metadata and then fetch the component based on metadata
  const metadata = await fetchGitHubRegistryMetadata("ui", branch)
  if (!metadata || !metadata[name]) {
    logger.debug(`UI component "${name}" not found in GitHub UI metadata`)
    return null
  }

  const componentMeta = metadata[name]

  return await fetchGitHubComponentFromMetadata(
    name,
    "ui",
    componentMeta,
    branch,
  )
}

// Fetch a registry composer from GitHub
export async function getGitHubRegistryComposer(
  name: string,
  branch: string,
): Promise<RegistryItem | null> {
  const metadata = await fetchGitHubRegistryMetadata("composer", branch)
  if (!metadata || !metadata[name]) {
    logger.debug(`Composer "${name}" not found in GitHub composer metadata`)
    return null
  }

  const componentMeta = metadata[name]

  return await fetchGitHubComponentFromMetadata(
    name,
    "composer",
    componentMeta,
    branch,
  )
}

// Fetch metadata for GitHub registry components
async function fetchGitHubRegistryMetadata(
  type: "artifacts" | "ui" | "composer",
  branch: string,
): Promise<GitHubRegistryMetadata | null> {
  try {
    const baseUrl = REGISTRY_SOURCES.GITHUB(ENV_CONFIG.github.repo, branch)
    const metadataUrl = `${baseUrl}cli/src/registry/github-registry/${type}.json`

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
  type: "artifacts" | "ui" | "composer",
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
      // Use explicit path if provided, otherwise infer from registry type
      const filePath =
        (fileInfo as any).path ||
        (type === "artifacts"
          ? `hax/artifacts/${name}/${fileInfo.name}`
          : type === "composer"
            ? `hax/composers/${name}/${fileInfo.name}`
            : `hax/components/ui/${fileInfo.name}`)

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
