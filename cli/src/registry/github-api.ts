import { logger } from "@/utils/logger"
import { RegistryItem, REGISTRY_SOURCES, GitHubRegistryMetadata } from "@/types"
import { ENV_CONFIG } from "@/config/env"

// Fetch a registry item from GitHub artifacts
export async function getGitHubRegistryItem(
  name: string,
  branch: string,
  customRepo?: string,
  token?: string,
  githubUrl?: string,
): Promise<RegistryItem | null> {
  const repo = customRepo || ENV_CONFIG.github.repo
  const metadata = await fetchGitHubRegistryMetadata(
    "artifacts",
    branch,
    repo,
    token,
    githubUrl,
  )
  if (!metadata || !metadata[name]) {
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
  const metadata = await fetchGitHubRegistryMetadata("ui", branch)
  if (!metadata || !metadata[name]) {
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
  repo?: string,
  token?: string,
  githubUrl?: string,
): Promise<GitHubRegistryMetadata | null> {
  try {
    const targetRepo = repo || ENV_CONFIG.github.repo
    const baseUrl = githubUrl || REGISTRY_SOURCES.GITHUB(targetRepo, branch)
    const fileName = type === "composer" ? "composers.json" : `${type}.json`
    const metadataUrl = `${baseUrl}cli/src/registry/github-registry/${fileName}`

    const response = await fetchGitHubFile(metadataUrl, token)
    if (!response) {
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
  repo?: string,
  token?: string,
  githubUrl?: string,
): Promise<RegistryItem | null> {
  try {
    const targetRepo = repo || ENV_CONFIG.github.repo
    const baseUrl = githubUrl || REGISTRY_SOURCES.GITHUB(targetRepo, branch)

    const registryItem: RegistryItem = {
      name,
      type: metadata.type,
      dependencies: metadata.dependencies,
      registryDependencies: metadata.registryDependencies,
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
            ? `hax/composer/${name}/${fileInfo.name}`
            : `hax/components/ui/${fileInfo.name}`)

      const fileUrl = `${baseUrl}${filePath}`
      const fileContent = await fetchGitHubFile(fileUrl, token)

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

async function fetchGitHubFile(
  url: string,
  token?: string,
): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      "User-Agent": "agntcy-hax-cli",
    }

    // Use provided token or fallback to environment token
    const authToken = token || ENV_CONFIG.github.token
    if (authToken) {
      headers["Authorization"] = `token ${authToken}`
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
      return null
    }

    return await response.text()
  } catch (error) {
    return null
  }
}
