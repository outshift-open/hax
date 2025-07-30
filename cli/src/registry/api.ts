import { uiComponents } from "@/registry/default/ui"
import { logger } from "@/utils/logger"
import { RegistryItem } from "@/types"
import { ENV_CONFIG } from "@/config/env"
import {
  getGitHubRegistryItem,
  getGitHubRegistryDependency,
} from "./github-api"

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
      // If not found in UI components, check artifacts
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
