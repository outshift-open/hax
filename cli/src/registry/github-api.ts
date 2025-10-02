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

import { logger } from "@/utils/logger"
import {
  RegistryItem,
  REGISTRY_SOURCES,
  GitHubRegistryMetadata,
  RegistrySource,
} from "@/types"
import { ENV_CONFIG } from "@/config/env"
import { spawn } from "child_process"
import fs from "fs"
import path from "path"
import os from "os"

// Cache for SSH-cloned repositories to avoid re-cloning
// Track enterprise domains that have API restrictions to skip future API attempts

const sshCloneCache = new Map<string, string>()

const enterpriseApiRestricted = new Set<string>()

export function cleanupSshCache() {
  for (const [, tempDir] of sshCloneCache.entries()) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } catch {}
  }
  sshCloneCache.clear()
}

process.on("exit", cleanupSshCache)
process.on("SIGINT", cleanupSshCache)
process.on("SIGTERM", cleanupSshCache)

// Fetch a registry item from GitHub artifacts
export async function getGitHubRegistryArtifact(
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
    repo,
    token,
    githubUrl,
  )
}

export async function getGitHubRegistryDependency(
  name: string,
  branch: string,
  customRepo?: string,
  token?: string,
  githubUrl?: string,
): Promise<RegistryItem | null> {
  const metadata = await fetchGitHubRegistryMetadata(
    "ui",
    branch,
    customRepo,
    token,
    githubUrl,
  )
  if (!metadata || !metadata[name]) {
    return null
  }

  const componentMeta = metadata[name]

  return await fetchGitHubComponentFromMetadata(
    name,
    "ui",
    componentMeta,
    branch,
    customRepo,
    token,
    githubUrl,
  )
}

// Fetch a registry composer from GitHub
export async function getGitHubRegistryComposer(
  name: string,
  branch: string,
  customRepo?: string,
  token?: string,
  githubUrl?: string,
): Promise<RegistryItem | null> {
  const repo = customRepo || ENV_CONFIG.github.repo
  const metadata = await fetchGitHubRegistryMetadata(
    "composer",
    branch,
    repo,
    token,
    githubUrl,
  )
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
    repo,
    token,
    githubUrl,
  )
}

export async function getGitHubRegistryAdapter(
  name: string,
  branch: string,
  customRepo?: string,
  token?: string,
  githubUrl?: string,
): Promise<RegistryItem | null> {
  const repo = customRepo || ENV_CONFIG.github.repo
  const metadata = await fetchGitHubRegistryMetadata(
    "adapter",
    branch,
    repo,
    token,
    githubUrl,
  )
  if (!metadata || !metadata[name]) {
    logger.debug(`Adapter "${name}" not found in GitHub adapter metadata`)
    return null
  }

  const componentMeta = metadata[name]

  return await fetchGitHubComponentFromMetadata(
    name,
    "adapter",
    componentMeta,
    branch,
    repo,
    token,
    githubUrl,
  )
}

// Fetch metadata for GitHub registry components
async function fetchGitHubRegistryMetadata(
  type: "artifacts" | "ui" | "composer" | "adapter",
  branch: string,
  repo?: string,
  token?: string,
  githubUrl?: string,
): Promise<GitHubRegistryMetadata | null> {
  try {
    const targetRepo = repo || ENV_CONFIG.github.repo
    let baseUrl: string

    if (githubUrl) {
      // For enterprise GitHub, construct the raw content URL
      const cleanUrl = githubUrl.replace(/\/$/, "") // Remove trailing slash
      baseUrl = `${cleanUrl}/${targetRepo}/${branch}/`
    } else {
      baseUrl = REGISTRY_SOURCES.GITHUB(targetRepo, branch)
    }

    const fileName =
      type === "composer"
        ? "composers.json"
        : type === "adapter"
          ? "adapters.json"
          : `${type}.json`
    const metadataUrl = `${baseUrl}cli/src/registry/github-registry/${fileName}`

    const source: RegistrySource | undefined = githubUrl
      ? {
          type: "github" as const,
          repo: targetRepo,
          branch,
          token,
          githubUrl,
        }
      : undefined

    const response = await fetchGitHubFile(metadataUrl, token, source)
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
  type: "artifacts" | "ui" | "composer" | "adapter",
  metadata: GitHubRegistryMetadata[string],
  branch: string,
  repo?: string,
  token?: string,
  githubUrl?: string,
): Promise<RegistryItem | null> {
  try {
    const targetRepo = repo || ENV_CONFIG.github.repo
    let baseUrl: string

    if (githubUrl) {
      const cleanUrl = githubUrl.replace(/\/$/, "")
      baseUrl = `${cleanUrl}/${targetRepo}/${branch}/`
    } else {
      baseUrl = REGISTRY_SOURCES.GITHUB(targetRepo, branch)
    }

    let sourceAttribution: string
    if (githubUrl) {
      sourceAttribution = `${githubUrl}/${targetRepo}@${branch}`
    } else {
      sourceAttribution = `${targetRepo}@${branch}`
    }

    const registryItem: RegistryItem = {
      name,
      type: metadata.type,
      dependencies: metadata.dependencies,
      registryDependencies: metadata.registryDependencies,
      files: [],
      source: sourceAttribution,
    }

    const source: RegistrySource | undefined = githubUrl
      ? {
          type: "github" as const,
          repo: targetRepo,
          branch,
          token,
          githubUrl,
        }
      : undefined

    // Fetch all files specified in metadata and use explicit path if provided, otherwise infer from registry type

    for (const fileInfo of metadata.files) {
      const filePath =
        (fileInfo as any).path ||
        (type === "artifacts"
          ? `hax/artifacts/${name}/${fileInfo.name}`
          : type === "composer"
            ? `hax/composer/${name}/${fileInfo.name}`
            : type === "adapter"
              ? `hax/adapter/${fileInfo.name}`
              : `hax/components/ui/${fileInfo.name}`)

      const fileUrl = `${baseUrl}${filePath}`
      const fileContent = await fetchGitHubFile(fileUrl, token, source)

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
  source?: RegistrySource,
): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      "User-Agent": "hax-cli",
    }

    const authToken = token || source?.token || ENV_CONFIG.github.token
    if (authToken) {
      headers["Authorization"] = `token ${authToken}`
    }

    const isEnterpriseGitHub =
      url.includes("wwwin-github.cisco.com") ||
      (source?.githubUrl && !source.githubUrl.includes("github.com"))

    if (isEnterpriseGitHub) {
      const match = url.match(
        /https:\/\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/,
      )

      if (!match) {
        logger.error(`Could not parse enterprise GitHub URL: ${url}`)
        return null
      }

      const [, domain, owner, repo, branch, filePath] = match

      if (enterpriseApiRestricted.has(domain)) {
        return await fetchViaSshGit(domain, owner, repo, branch, filePath)
      }

      // If token is provided, try Contents API once, then fall back to SSH
      if (authToken) {
        const contentsUrl = `https://${domain}/api/v3/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`

        try {
          const response = await fetch(contentsUrl, { headers })
          if (response.ok) {
            const data = await response.json()
            if (data.content && data.encoding === "base64") {
              return Buffer.from(data.content, "base64").toString("utf-8")
            }
          }

          // API failed (likely 403), fall back to SSH
          if (response.status === 403) {
            enterpriseApiRestricted.add(domain)
            logger.info(
              `Enterprise GitHub API access restricted (403), using SSH for all files`,
            )
            return await fetchViaSshGit(domain, owner, repo, branch, filePath)
          }
        } catch (error) {
          logger.debug(
            `Enterprise GitHub API failed, falling back to SSH: ${error}`,
          )
        }
      }

      // No token or API failed - use SSH directly
      return await fetchViaSshGit(domain, owner, repo, branch, filePath)
    }

    // Fallback to direct file fetch (for public GitHub raw URLs)
    const response = await fetch(url, { headers })
    if (!response.ok) {
      // Only log 404 errors for UI registry files at debug level, others as debug with status
      if (response.status === 404 && url.includes("/ui.json")) {
        return null
      } else {
        logger.debug(`Failed to fetch from ${url}: ${response.status}`)
      }
      return null
    }

    return await response.text()
  } catch (error) {
    logger.debug(`Error fetching GitHub file: ${error}`)
    return null
  }
}

async function fetchViaSshGit(
  domain: string,
  owner: string,
  repo: string,
  branch: string,
  filePath: string,
): Promise<string | null> {
  return new Promise((resolve) => {
    const cacheKey = `${domain}/${owner}/${repo}/${branch}`

    // Check if we already have this repository cloned
    if (sshCloneCache.has(cacheKey)) {
      const tempDir = sshCloneCache.get(cacheKey)!
      const fullFilePath = path.join(tempDir, filePath)

      try {
        if (fs.existsSync(fullFilePath)) {
          const content = fs.readFileSync(fullFilePath, "utf-8")
          resolve(content)
          return
        } else {
          logger.debug(`File not found in cached repo: ${fullFilePath}`)
          resolve(null)
          return
        }
      } catch (error) {
        logger.debug(`Error reading cached file: ${error}`)
        sshCloneCache.delete(cacheKey)
      }
    }

    // Create temporary directory for new clone and only show SSH message once per repository

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hax-ssh-"))
    const sshUrl = `git@${domain}:${owner}/${repo}.git`

    if (!sshCloneCache.has(cacheKey)) {
      logger.info(
        `📡 Fetching from enterprise GitHub via SSH: ${owner}/${repo}`,
      )
    }

    // Clone the entire repository and cache it for subsequent file requests
    const gitClone = spawn(
      "git",
      ["clone", "--branch", branch, "--depth", "1", sshUrl, tempDir],
      { stdio: "pipe" },
    )

    let errorOutput = ""
    gitClone.stderr?.on("data", (data) => {
      errorOutput += data.toString()
    })

    gitClone.on("close", (code) => {
      if (code !== 0) {
        logger.error(
          `SSH Git clone failed for ${owner}/${repo}. Ensure you have SSH access to the repository.`,
        )
        logger.debug(`Git clone error details: ${errorOutput}`)
        // Clean up temp directory
        try {
          fs.rmSync(tempDir, { recursive: true, force: true })
        } catch (cleanupError) {
          logger.debug(`Failed to cleanup temp directory: ${cleanupError}`)
        }
        resolve(null)
        return
      }

      sshCloneCache.set(cacheKey, tempDir)

      // Read the requested file
      const fullFilePath = path.join(tempDir, filePath)
      try {
        if (fs.existsSync(fullFilePath)) {
          const content = fs.readFileSync(fullFilePath, "utf-8")
          resolve(content)
        } else {
          logger.debug(`File not found: ${fullFilePath}`)
          resolve(null)
        }
      } catch (error) {
        logger.debug(`Error reading file: ${error}`)
        resolve(null)
      }
    })

    gitClone.on("error", (error) => {
      logger.error(`SSH Git clone error for ${owner}/${repo}: ${error}`)
      resolve(null)
    })
  })
}
