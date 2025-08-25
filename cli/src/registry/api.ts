import { uiComponents } from "@/registry/default/ui"
import { logger } from "@/utils/logger"
import { HaxConfig, RegistryItem } from "@/types"
import { ENV_CONFIG } from "@/config/env"
import {
  getGitHubRegistryArtifact,
  getGitHubRegistryDependency,
  getGitHubRegistryComposer,
  getGitHubRegistryAdapter,
} from "./github-api"
import { readConfig } from "@/config"

export async function getRegistryItem(
  name: string,
  source?: string,
  config?: HaxConfig,
  token?: string,
): Promise<RegistryItem | null> {
  try {
    if (source) {
      return await getRegistryItemFromSource(name, source, config, token)
    }

    const haxConfig = config || readConfig()

    if (haxConfig.registries) {
      const defaultRepo =
        haxConfig.registries.default || haxConfig.registries.fallback[0]

      const fallbackOrder = haxConfig.registries.fallback.filter(
        (repo) => repo !== defaultRepo,
      )
      const actualSearchOrder = [defaultRepo, ...fallbackOrder]

      for (const repoName of actualSearchOrder) {
        const item = await getRegistryItemFromSource(
          name,
          repoName,
          haxConfig,
          token,
        )
        if (item) {
          if (repoName === defaultRepo) {
            logger.info(`Component "${name}" found in repository: ${repoName}`)
          } else {
            logger.info(
              `Component "${name}" not found in ${defaultRepo}, found in repository: ${repoName}`,
            )
          }

          if (!item.source) {
            item.source = repoName
          }
          return item
        }
      }
    }

    return await getRegistryItemFromSource(name, ENV_CONFIG.registrySource)
  } catch (error) {
    logger.error(`Failed to fetch component "${name}": ${error}`)
    return null
  }
}

async function getRegistryItemFromSource(
  name: string,
  sourceName: string,
  config?: HaxConfig,
  token?: string,
): Promise<RegistryItem | null> {
  const haxConfig = config || readConfig()

  if (haxConfig.registries?.sources[sourceName]) {
    const source = haxConfig.registries.sources[sourceName]

    if (source.type === "github") {
      // Try artifacts first
      const artifact = await getGitHubRegistryArtifact(
        name,
        source.branch || "main",
        source.repo!,
        token,
        source.githubUrl,
      )
      if (artifact) return artifact

      const adapter = await getGitHubRegistryAdapter(
        name,
        source.branch || "main",
        source.repo!,
        token,
        source.githubUrl,
      )
      if (adapter) return adapter

      return await getGitHubRegistryComposer(
        name,
        source.branch || "main",
        source.repo!,
        token,
        source.githubUrl,
      )
    }
  }

  if (sourceName === "local") {
    try {
      const { artifacts } = await import("@/registry/default/artifacts")
      const artifact = artifacts.find(
        (item: { name: string }) => item.name === name,
      )
      if (artifact) return artifact

      try {
        const { composer } = await import("@/registry/default/composer")
        const composerItem = composer.find(
          (item: { name: string }) => item.name === name,
        )
        return composerItem || null
      } catch {
        return null
      }
    } catch {
      return null
    }
  } else if (sourceName.startsWith("github:")) {
    const branch = sourceName.replace("github:", "")

    const artifact = await getGitHubRegistryArtifact(name, branch)
    if (artifact) return artifact

    const adapter = await getGitHubRegistryAdapter(name, branch)
    if (adapter) return adapter

    return await getGitHubRegistryComposer(name, branch)
  }
  return null
}

export async function getRegistryDependency(
  name: string,
  source?: string,
  config?: HaxConfig,
): Promise<RegistryItem | null> {
  try {
    if (source) {
      return await getRegistryDependencyFromSource(name, source, config)
    }

    const haxConfig = config || readConfig()

    if (haxConfig.registries) {
      for (const repoName of haxConfig.registries.fallback) {
        const item = await getRegistryDependencyFromSource(
          name,
          repoName,
          haxConfig,
        )
        if (item) {
          return item
        }
      }
    }
    return await getRegistryDependencyFromSource(
      name,
      ENV_CONFIG.registrySource,
    )
  } catch (error) {
    logger.error(`Failed to fetch registry dependency "${name}": ${error}`)
    return null
  }
}

async function getRegistryDependencyFromSource(
  name: string,
  sourceName: string,
  config?: HaxConfig,
): Promise<RegistryItem | null> {
  const haxConfig = config || readConfig()

  if (haxConfig.registries?.sources[sourceName]) {
    const source = haxConfig.registries.sources[sourceName]

    if (source.type === "github") {
      return await getGitHubRegistryDependency(
        name,
        source.branch || "main",
        source.repo,
        source.token,
        source.githubUrl,
      )
    }
  }

  if (sourceName === "local") {
    const uiComponent = await getUIComponent(name)
    return uiComponent || null
  } else if (sourceName.startsWith("github:")) {
    const branch = sourceName.replace("github:", "")
    return await getGitHubRegistryDependency(name, branch)
  }

  return null
}

export async function getUIComponent(name: string) {
  return uiComponents.find((comp) => comp.name === name)
}

export async function resolveRegistryDependencies(
  names: string[],
  source?: string,
  config?: HaxConfig,
  visited: Set<string> = new Set(),
): Promise<RegistryItem[]> {
  const resolved: RegistryItem[] = []
  const haxConfig = config || readConfig()

  for (const name of names) {
    if (visited.has(name)) continue
    visited.add(name)

    let item = await getRegistryDependency(name, source, haxConfig)
    if (!item) {
      // If not found in UI components, check artifacts
      item = await getRegistryItem(name, source, haxConfig)
    }

    if (!item) {
      logger.warn(`Registry dependency "${name}" not found`)
      continue
    }

    resolved.push(item)

    if (item.registryDependencies) {
      const deps = await resolveRegistryDependencies(
        item.registryDependencies,
        source,
        haxConfig,
        visited,
      )
      resolved.push(...deps)
    }
  }

  return resolved
}
