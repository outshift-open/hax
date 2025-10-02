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
import inquirer from "inquirer"
import { logger, highlighter } from "@/utils/logger"

interface GitHubInvitation {
  id: number
  invitee?: {
    login: string
  }
}

export const manageAccessCommand = new Command()
  .name("manage-access")
  .description("Manage access control and permissions")
  .option("--repo <repo>", "GitHub repository")
  .option("--user <user>", "Username to manage")
  .option("--action <action>", "Action: grant, revoke, list", "list")
  .action(async (options) => {
    await manageAccess(options.repo, options.user, options.action)
  })

export async function manageAccess(
  repo?: string,
  user?: string,
  action = "list",
) {
  logger.info(`🔐 Managing access for repository: ${repo || "current"}`)

  switch (action) {
    case "grant":
      if (!user) {
        logger.error("--user required for grant action")
        return
      }
      if (!repo) {
        logger.error("--repo required for grant action")
        return
      }

      logger.info(
        `🔐 Granting access to ${highlighter.accent(user)} on ${highlighter.primary(repo)}`,
      )

      try {
        const answers = await inquirer.prompt([
          {
            type: "list",
            name: "permission",
            message: "What permission level should be granted?",
            choices: [
              { name: "Read - Can install components", value: "pull" },
              { name: "Write - Can add/modify components", value: "push" },
              { name: "Admin - Full repository access", value: "admin" },
            ],
          },
        ])

        const githubToken = process.env.GITHUB_TOKEN
        if (!githubToken) {
          logger.error(
            "❌ GITHUB_TOKEN environment variable required for access management",
          )
          return
        }

        // Add user as collaborator using GitHub API
        const [owner, repoName] = repo.split("/")
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repoName}/collaborators/${user}`,
          {
            method: "PUT",
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              permission: answers.permission,
            }),
          },
        )

        if (response.ok) {
          logger.success(
            `✅ Access granted to ${user} with ${answers.permission} permissions`,
          )
        } else {
          const error = await response.text()
          logger.error(`❌ Failed to grant access: ${error}`)
        }
      } catch (error) {
        logger.error(`Failed to grant access: ${error}`)
      }
      break

    case "revoke":
      if (!user) {
        logger.error("--user required for revoke action")
        return
      }
      if (!repo) {
        logger.error("--repo required for revoke action")
        return
      }

      logger.info(
        `🔐 Revoking access from ${highlighter.accent(user)} on ${highlighter.primary(repo)}`,
      )

      try {
        const answers = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: `Are you sure you want to revoke access for ${user}?`,
            default: false,
          },
        ])

        if (answers.confirm) {
          const githubToken = process.env.GITHUB_TOKEN
          if (!githubToken) {
            logger.error(
              "❌ GITHUB_TOKEN environment variable required for access management",
            )
            return
          }

          const [owner, repoName] = repo.split("/")

          const collaboratorResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}/collaborators/${user}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `token ${githubToken}`,
                Accept: "application/vnd.github.v3+json",
              },
            },
          )

          if (collaboratorResponse.ok) {
            logger.success(`✅ Access revoked for ${user}`)
            return
          }

          try {
            const invitationsResponse = await fetch(
              `https://api.github.com/repos/${owner}/${repoName}/invitations`,
              {
                headers: {
                  Authorization: `token ${githubToken}`,
                  Accept: "application/vnd.github.v3+json",
                },
              },
            )

            if (invitationsResponse.ok) {
              const invitations = await invitationsResponse.json()
              const userInvitation = invitations.find(
                (inv: GitHubInvitation) => inv.invitee?.login === user,
              )

              if (userInvitation) {
                const cancelResponse = await fetch(
                  `https://api.github.com/repos/${owner}/${repoName}/invitations/${userInvitation.id}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `token ${githubToken}`,
                      Accept: "application/vnd.github.v3+json",
                    },
                  },
                )

                if (cancelResponse.ok) {
                  logger.success(`✅ Pending invitation cancelled for ${user}`)
                } else {
                  const error = await cancelResponse.text()
                  logger.error(`❌ Failed to cancel invitation: ${error}`)
                }
              } else {
                logger.error(
                  `❌ No collaborator or pending invitation found for ${user}`,
                )
              }
            } else {
              const error = await invitationsResponse.text()
              logger.error(`❌ Failed to check invitations: ${error}`)
            }
          } catch (inviteError) {
            logger.error(`❌ Failed to cancel invitation: ${inviteError}`)
          }
        } else {
          logger.info("Access revocation cancelled")
        }
      } catch (error) {
        logger.error(`Failed to revoke access: ${error}`)
      }
      break

    case "list":
      logger.info("Current access permissions:")
      logger.info("• Admin: Full repository access")
      logger.info("• Contributor: Can add/modify components")
      logger.info("• Reader: Can install components")
      break

    default:
      logger.error(`Unknown action: ${action}`)
  }
}
