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

const RationaleCriterionZod = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
  sentiment: z.enum(["positive", "negative", "neutral"]).optional(),
})

export const RationaleArtifactZod = z.object({
  id: z.string(),
  type: z.literal("rationale"),
  data: z.object({
    decision: z.string(),
    criteria: z.array(RationaleCriterionZod).optional(),
    reasoning: z.string(),
    confidence: z.number().optional(),
    confidenceDescription: z.string().optional(),
    variant: z
      .enum(["priority", "severity", "impact", "decision", "default"])
      .optional(),
    expandable: z.boolean().optional(),
    defaultExpanded: z.boolean().optional(),
    showConfidence: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
})

export type RationaleArtifact = z.infer<typeof RationaleArtifactZod>

export const ArtifactTabZod = z.discriminatedUnion("type", [
  RationaleArtifactZod,
])
export type ArtifactTab = z.infer<typeof ArtifactTabZod>
