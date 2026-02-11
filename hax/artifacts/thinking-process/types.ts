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

import { z } from "zod"

export const ProcessStepStatusZod = z.enum([
  "completed",
  "in-progress",
  "pending",
  "error",
]).describe("Status of the reasoning step")

export const ReasoningStepZod = z.object({
  id: z.string().describe("Unique identifier for the step"),
  title: z.string().describe("Title of the reasoning step"),
  description: z.string().optional().describe("Optional description or details"),
  status: ProcessStepStatusZod,
})

export const StepMetricZod = z.object({
  label: z.string().describe("Metric label (e.g., 'Steps Completed')"),
  value: z.string().describe("Metric value (e.g., '3/5')"),
})

export const ThinkingProcessArtifactZod = z.object({
  id: z.string(),
  type: z.literal("thinking-process"),
  data: z.object({
    title: z.string().optional().describe("Title for the thinking process card"),
    badge: z.string().optional().describe("Badge text shown next to title"),
    steps: z.array(ReasoningStepZod).describe("Reasoning steps to display"),
    metrics: z.array(StepMetricZod).optional().describe("Step metrics for completion tracking"),
    showToggle: z.boolean().optional().describe("Whether to show the reasoning toggle"),
    reasoningCollapsible: z.boolean().optional().describe("Whether reasoning section is collapsible"),
  }),
})

export type ThinkingProcessArtifact = z.infer<typeof ThinkingProcessArtifactZod>
export type ReasoningStep = z.infer<typeof ReasoningStepZod>
export type StepMetric = z.infer<typeof StepMetricZod>
