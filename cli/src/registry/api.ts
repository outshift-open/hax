import { uiComponents } from "@/registry/default/ui"
import { logger } from "@/utils/logger"
import { RegistryItem } from "@/types"
import { ENV_CONFIG } from "@/config/env"

export async function getRegistryItem(
  name: string,
  source?: string,
): Promise<RegistryItem | null> {
  try {
    const registrySource = source || ENV_CONFIG.registrySource

    if (registrySource === "local") {
      const uiComponent = await getUIComponent(name)
      if (uiComponent) {
        return uiComponent
      }

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
      logger.warn("GitHub registry source is temporarily disabled")
      return null
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

export async function getUIComponent(name: string) {
  return uiComponents.find((comp) => comp.name === name)
}

export async function resolveRegistryDependencies(
  names: string[],
  source = "local",
  visited: Set<string> = new Set(),
): Promise<RegistryItem[]> {
  const resolved: RegistryItem[] = []

  for (const name of names) {
    if (visited.has(name)) continue
    visited.add(name)

    const item = await getRegistryItem(name, source)
    if (!item) continue

    resolved.push(item)

    if (item.registryDependencies) {
      const deps = await resolveRegistryDependencies(
        item.registryDependencies,
        source,
        visited,
      )
      resolved.push(...deps)
    }
  }

  return resolved
}
