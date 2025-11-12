/*
 * Copyright 2025 Cisco Systems, Inc. and its affiliates
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// Lazy import - moved to getRegistryItemFromSource function
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
  repo?: string,
  config?: any,
  token?: string,
  haxType?: "artifact" | "composer" | "adapter",
): Promise<any> {
  try {
    // If specific repo is provided via CLI, use it directly
    if (repo) {
      const source = `https://github.com/${repo}`
      return await getRegistryItemFromSource(
        name,
        source,
        config,
        token,
        haxType,
      )
    }

    const haxConfig = config || readConfig()

    // Priority 1: Check .env configuration first
    if (ENV_CONFIG.registrySource && ENV_CONFIG.registrySource !== "local") {
      logger.info(`Using .env registry source: ${ENV_CONFIG.registrySource}`)
      const result = await getRegistryItemFromSource(
        name,
        ENV_CONFIG.registrySource,
        haxConfig,
        token,
        haxType,
      )
      if (result) {
        return result
      }
    }

    // Priority 2: If .env is "local" or not set, check local registry first
    if (!ENV_CONFIG.registrySource || ENV_CONFIG.registrySource === "local") {
      const localResult = await getRegistryItemFromSource(
        name,
        "local",
        haxConfig,
        token,
        haxType,
      )
      if (localResult) {
        logger.info(`Component "${name}" found in local registry`)
        return localResult
      }
    }

    // Priority 3: Fallback to hax.json registries configuration if component not found locally
    if (haxConfig.registries) {
      const defaultRepo =
        haxConfig.registries.default || haxConfig.registries.fallback[0]

      const fallbackOrder = haxConfig.registries.fallback.filter(
        (repo: string) => repo !== defaultRepo,
      )
      const actualSearchOrder = [defaultRepo, ...fallbackOrder]

      for (const repoName of actualSearchOrder) {
        if (
          repoName === "local" &&
          (!ENV_CONFIG.registrySource || ENV_CONFIG.registrySource === "local")
        ) {
          continue
        }

        const item = await getRegistryItemFromSource(
          name,
          repoName,
          haxConfig,
          token,
          haxType,
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

    if (ENV_CONFIG.registrySource && ENV_CONFIG.registrySource !== "local") {
      return await getRegistryItemFromSource(
        name,
        ENV_CONFIG.registrySource,
        undefined,
        undefined,
        haxType,
      )
    }

    return null
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
  haxType?: "artifact" | "composer" | "adapter",
): Promise<RegistryItem | null> {
  const haxConfig = config || readConfig()

  if (haxConfig.registries?.sources[sourceName]) {
    const source = haxConfig.registries.sources[sourceName]

    if (source.type === "github") {
      // Only check the specific component type if provided
      if (haxType === "artifact" || !haxType) {
        const artifact = await getGitHubRegistryArtifact(
          name,
          source.branch || "main",
          source.repo!,
          token,
          source.githubUrl,
        )
        if (artifact) return artifact
        if (haxType === "artifact") return null // If specifically looking for artifact and not found, stop here
      }

      if (haxType === "adapter" || !haxType) {
        const adapter = await getGitHubRegistryAdapter(
          name,
          source.branch || "main",
          source.repo!,
          token,
          source.githubUrl,
        )
        if (adapter) return adapter
        if (haxType === "adapter") return null // If specifically looking for adapter and not found, stop here
      }

      if (haxType === "composer" || !haxType) {
        return await getGitHubRegistryComposer(
          name,
          source.branch || "main",
          source.repo!,
          token,
          source.githubUrl,
        )
      }

      return null
    }
  }

  if (sourceName === "local") {
    try {
      // Only check the specific component type if provided
      if (haxType === "artifact" || !haxType) {
        const { artifacts } = await import("@/registry/default/artifacts")
        const artifact = artifacts.find(
          (item: { name: string }) => item.name === name,
        )
        if (artifact) {
          artifact.source = "local"
          return artifact
        }
        if (haxType === "artifact") return null // If specifically looking for artifact and not found, stop here
      }

      if (haxType === "adapter" || !haxType) {
        try {
          const { adapter } = await import("@/registry/default/adapter")
          const adapterItem = adapter.find(
            (item: { name: string }) => item.name === name,
          )
          if (adapterItem) {
            adapterItem.source = "local"
            return adapterItem
          }
          if (haxType === "adapter") return null // If specifically looking for adapter and not found, stop here
        } catch {
          if (haxType === "adapter") return null
        }
      }

      if (haxType === "composer" || !haxType) {
        try {
          const { composer } = await import("@/registry/default/composer")
          const composerItem = composer.find(
            (item: { name: string }) => item.name === name,
          )
          if (composerItem) {
            composerItem.source = "local"
            return composerItem
          }
          return null
        } catch {
          return null
        }
      }

      return null
    } catch {
      return null
    }
  } else if (sourceName.startsWith("github:")) {
    const branch = sourceName.replace("github:", "")

    // Only check the specific component type if provided
    if (haxType === "artifact" || !haxType) {
      const artifact = await getGitHubRegistryArtifact(name, branch)
      if (artifact) return artifact
      if (haxType === "artifact") return null
    }

    if (haxType === "adapter" || !haxType) {
      const adapter = await getGitHubRegistryAdapter(name, branch)
      if (adapter) return adapter
      if (haxType === "adapter") return null
    }

    if (haxType === "composer" || !haxType) {
      return await getGitHubRegistryComposer(name, branch)
    }

    return null
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
  const { uiComponents } = await import("@/registry/default/ui")
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
