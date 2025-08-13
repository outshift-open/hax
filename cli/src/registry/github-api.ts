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
    metadata,
    branch,
    repo,
    token,
    githubUrl,
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

  return await fetchGitHubComponentFromMetadata(name, "ui", metadata, branch)
}

// Fetch metadata for GitHub registry components
async function fetchGitHubRegistryMetadata(
  type: "artifacts" | "ui",
  branch: string,
  repo?: string,
  token?: string,
  githubUrl?: string,
): Promise<GitHubRegistryMetadata | null> {
  try {
    const targetRepo = repo || ENV_CONFIG.github.repo
    const baseUrl = REGISTRY_SOURCES.GITHUB(targetRepo, branch, githubUrl)
    const metadataUrl = `${baseUrl}cli/src/registry/github-registry/${type}.json`

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
  type: "artifacts" | "ui",
  metadata: GitHubRegistryMetadata,
  branch: string,
  repo?: string,
  token?: string,
  githubUrl?: string,
): Promise<any> {
  const component = metadata[name]
  if (!component) {
    throw new Error(`Component "${name}" not found in registry`)
  }

  const componentFiles: any = {}
  const targetRepo = repo || ENV_CONFIG.github.repo
  const baseUrl = REGISTRY_SOURCES.GITHUB(targetRepo, branch, githubUrl)

  for (const [fileName, filePath] of Object.entries(component.files)) {
    const fileUrl = `${baseUrl}${filePath}`
    const fileContent = await fetchGitHubFile(fileUrl, token)
    if (fileContent === null) {
      throw new Error(`Failed to fetch file: ${fileName}`)
    }
    componentFiles[fileName] = fileContent
  }

  return {
    name,
    ...component,
    files: componentFiles,
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
