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

import { Command } from "commander"
import { readConfig, updateConfig } from "../config"
import { logger } from "@/utils/logger"
import { ComponentItem } from "@/types"
import fs from "fs"
import path from "path"
import inquirer from "inquirer"

export const removeCommand = new Command("remove")
  .description("Remove an installed component")
  .argument("<component>", "Component name to remove")
  .option("--force", "Skip confirmation prompt")
  .action(async (componentName: string, options: { force?: boolean }) => {
    const config = readConfig()
    const components = config.components || []
    const features = config.features || []
    const adapters = config.installedAdapters || []

    let componentInfo = null
    let componentType = null
    let componentIndex = -1

    componentIndex = components.findIndex((comp: ComponentItem) => {
      if (typeof comp === "string") {
        return comp === componentName
      } else {
        return comp.name === componentName
      }
    })
    if (componentIndex !== -1) {
      componentInfo = components[componentIndex]
      componentType = "artifact"
    }

    if (componentIndex === -1) {
      componentIndex = features.findIndex((feat: ComponentItem) => {
        if (typeof feat === "string") {
          return feat === componentName
        } else {
          return feat.name === componentName
        }
      })
      if (componentIndex !== -1) {
        componentInfo = features[componentIndex]
        componentType = "composer"
      }
    }

    if (componentIndex === -1) {
      componentIndex = adapters.findIndex((adapt: ComponentItem) => {
        if (typeof adapt === "string") {
          return adapt === componentName
        } else {
          return adapt.name === componentName
        }
      })
      if (componentIndex !== -1) {
        componentInfo = adapters[componentIndex]
        componentType = "adapter"
      }
    }

    if (componentIndex === -1) {
      logger.error(`❌ Component "${componentName}" is not installed`)
      logger.info("Run 'hax list' to see installed components")
      return
    }

    const componentSource =
      typeof componentInfo === "string"
        ? "unknown"
        : componentInfo?.source || "unknown"

    // Show component info
    logger.info(`📦 Found component: ${componentName}`)
    logger.info(`   Type: ${componentType}`)
    logger.info(`   Source: ${componentSource}`)

    if (!options.force) {
      const answers = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `Are you sure you want to remove "${componentName}" ${componentType}?`,
          default: false,
        },
      ])

      if (!answers.confirm) {
        logger.info("❌ Remove cancelled")
        return
      }
    }

    // Remove from the appropriate array
    if (componentType === "artifact") {
      components.splice(componentIndex, 1)
      config.components = components
    } else if (componentType === "composer") {
      features.splice(componentIndex, 1)
      config.features = features
    } else if (componentType === "adapter") {
      adapters.splice(componentIndex, 1)
      config.installedAdapters = adapters
    }

    updateConfig(config)

    // Determine the correct path based on component type
    let componentPath: string
    if (componentType === "artifact") {
      const artifactsPath = config.artifacts?.path || "src/hax/artifacts"
      componentPath = path.join(process.cwd(), artifactsPath, componentName)
    } else if (componentType === "composer") {
      const composersPath = config.composers?.path || "src/hax/composers"
      componentPath = path.join(process.cwd(), composersPath, componentName)
    } else {
      const adaptersPath = config.adapters?.path || "src/hax/adapters"
      componentPath = path.join(process.cwd(), adaptersPath, componentName)
    }

    if (fs.existsSync(componentPath)) {
      try {
        fs.rmSync(componentPath, { recursive: true, force: true })
        logger.success(`🗑️  Removed component files: ${componentPath}`)
      } catch (error) {
        logger.warn(`⚠️  Failed to remove files at ${componentPath}: ${error}`)
        logger.info("   You may need to remove them manually")
      }
    } else {
      logger.info(`ℹ️  No component files found at ${componentPath}`)
    }

    logger.success(
      `✅ ${componentType!.charAt(0).toUpperCase() + componentType!.slice(1)} "${componentName}" removed successfully`,
    )

    const totalRemaining =
      (config.components || []).length +
      (config.features || []).length +
      (config.installedAdapters || []).length
    if (totalRemaining > 0) {
      logger.info(`\n📦 Remaining components: ${totalRemaining}`)
      logger.info("Run 'hax list' to see them")
    } else {
      logger.info("\n📦 No components remaining")
    }
  })
