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

const ProcessStepStatusZod = z.enum([
  "completed",
  "in-progress",
  "pending",
  "error",
])

const ReasoningStepZod = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: ProcessStepStatusZod,
})

const StepMetricZod = z.object({
  label: z.string(),
  value: z.string(),
})

export const ThinkingProcessArtifactZod = z.object({
  id: z.string(),
  type: z.literal("thinking-process"),
  data: z.object({
    title: z.string().optional(),
    badge: z.string().optional(),
    steps: z.array(ReasoningStepZod),
    metrics: z.array(StepMetricZod).optional(),
    showToggle: z.boolean().optional(),
    reasoningCollapsible: z.boolean().optional(),
  }),
})

export type ThinkingProcessArtifact = z.infer<typeof ThinkingProcessArtifactZod>

export const ArtifactTabZod = z.discriminatedUnion("type", [
  ThinkingProcessArtifactZod,
])
export type ArtifactTab = z.infer<typeof ArtifactTabZod>
