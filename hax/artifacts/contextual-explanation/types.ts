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

const ExplanationDetailZod = z.object({
  label: z.string(),
  value: z.string(),
  additionalInfo: z.string().optional(),
  isSubItem: z.boolean().optional(),
  isBoldLabel: z.boolean().optional(),
})

export const ContextualExplanationArtifactZod = z.object({
  id: z.string(),
  type: z.literal("contextual-explanation"),
  data: z.object({
    title: z.string().optional(),
    alertTitle: z.string().optional(),
    alertDescription: z.string().optional(),
    details: z.array(ExplanationDetailZod),
    secondaryButtonLabel: z.string().optional(),
    primaryButtonLabel: z.string().optional(),
  }),
})

export type ContextualExplanationArtifact = z.infer<
  typeof ContextualExplanationArtifactZod
>

export const ArtifactTabZod = z.discriminatedUnion("type", [
  ContextualExplanationArtifactZod,
])
export type ArtifactTab = z.infer<typeof ArtifactTabZod>
