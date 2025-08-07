import { uiComponents } from "@/registry/default/ui"
import { logger } from "@/utils/logger"
import { HaxConfig, RegistryItem } from "@/types"
import { ENV_CONFIG } from "@/config/env"
import {
  getGitHubRegistryItem,
  getGitHubRegistryDependency,
} from "./github-api"
import { readConfig } from "@/config"

export async function getRegistryItem(
  name: string,
  source?: string,
  config?: HaxConfig,
): Promise<RegistryItem | null> {
  try {
    if (source) {
      return await getRegistryItemFromSource(name, source, config)
    }

    const haxConfig = config || readConfig()

    if (haxConfig.registries) {
      for (const repoName of haxConfig.registries.fallback) {
        const item = await getRegistryItemFromSource(name, repoName, haxConfig)
        if (item) {
          item.source = repoName
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
): Promise<RegistryItem | null> {
  const haxConfig = config || readConfig()

  if (haxConfig.registries?.sources[sourceName]) {
    const source = haxConfig.registries.sources[sourceName]

    if (source.type === "github") {
      return await getGitHubRegistryItem(
        name,
        source.branch || "main",
        source.repo!,
      )
    }
  }

  if (sourceName === "local") {
    const { artifacts } = await import("@/registry/default/artifacts")
    return (
      artifacts.find((item: { name: string }) => item.name === name) || null
    )
  } else if (sourceName.startsWith("github:")) {
    const branch = sourceName.replace("github:", "")
    return await getGitHubRegistryItem(name, branch)
  }
  logger.debug(
    `Component "${name}" not found in registry source "${sourceName}"`,
  )
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
      return await getGitHubRegistryDependency(name, source.branch || "main")
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
