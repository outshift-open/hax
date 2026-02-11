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

import z from "zod"

export const ExplanationDetailZod = z.object({
  label: z.string().describe("Label for the detail row"),
  value: z.string().describe("Value/description for the detail row"),
  additionalInfo: z.string().optional().describe("Optional additional info (e.g., timestamp)"),
  isSubItem: z.boolean().optional().describe("Whether this is a sub-item (indented)"),
  isBoldLabel: z.boolean().optional().describe("Whether the label should be bold"),
})
export type ExplanationDetail = z.infer<typeof ExplanationDetailZod>

export const ContextualExplanationArtifactZod = z.object({
  id: z.string(),
  type: z.literal("contextual-explanation"),
  data: z.object({
    title: z.string().optional().describe("Title displayed in the card header"),
    alertTitle: z.string().optional().describe("Alert title explaining why the change happened"),
    alertDescription: z.string().optional().describe("Alert description with more details"),
    details: z.array(ExplanationDetailZod).describe("Array of detail rows to display"),
    secondaryButtonLabel: z.string().optional().describe("Text for the secondary button"),
    primaryButtonLabel: z.string().optional().describe("Text for the primary button"),
  }),
})

export type ContextualExplanationArtifact = z.infer<
  typeof ContextualExplanationArtifactZod
>
