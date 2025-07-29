import { existsSync, readFileSync } from "fs"
import path from "path"
import { uiComponents } from "@/registry/default/ui"
// Use native fetch (available in Node 18+)
import { fileURLToPath } from "url"
import { logger } from "@/utils/logger"
import {
  RegistryItem,
  RegistryItemSchema as registryItemSchema,
  REGISTRY_SOURCES,
} from "@/types"

// Get workspace root for file operations
function getWorkspaceRoot(): string {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  let workspaceRoot = __dirname
  while (workspaceRoot !== path.dirname(workspaceRoot)) {
    const packageJsonPath = path.join(workspaceRoot, "package.json")
    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))
        if (packageJson.name === "agntcy-hax") {
          return workspaceRoot
        }
      } catch {}
    }
    workspaceRoot = path.dirname(workspaceRoot)
  }

  return workspaceRoot
}

export const WORKSPACE_ROOT = getWorkspaceRoot()

export async function getRegistryItem(name: string, source = "local") {
  try {
    let registryUrl: string

    if (source === "local") {
      // First try UI components
      const uiComponent = await getUIComponent(name)
      if (uiComponent) {
        return uiComponent
      }

      // Then try artifacts
      const localPath = path.join(
        WORKSPACE_ROOT,
        "registry/default/artifacts.ts",
      )
      return await getLocalRegistryItem(name, localPath)
    } else if (source.startsWith("github:")) {
      // GitHub branch: github:main, github:develop
      const branch = source.replace("github:", "")
      registryUrl = `${REGISTRY_SOURCES.GITHUB(branch)}default/${name}.json`
    } else {
      // Published registry
      registryUrl = `${REGISTRY_SOURCES.CDN}${name}.json`
    }

    const response = await fetch(registryUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${name} from ${registryUrl}`)
    }

    const data = await response.json()
    return registryItemSchema.parse(data)
  } catch (error) {
    logger.error(
      `Failed to fetch component "${name}": ${error instanceof Error ? error.message : String(error)}`,
    )
    return null
  }
}

async function getLocalRegistryItem(name: string, registryPath: string) {
  try {
    // For local development, import from artifacts.ts
    const { artifacts } = await import(registryPath)
    return artifacts.find((item: { name: string }) => item.name === name)
  } catch {
    // Fallback: try importing from the default location using absolute import
    try {
      const { artifacts } = await import("@/registry/default/artifacts")
      return artifacts.find((item: { name: string }) => item.name === name)
    } catch {
      return null
    }
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
