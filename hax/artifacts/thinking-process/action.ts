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
import { useCopilotAction } from "@copilotkit/react-core"
import { ThinkingProcessArtifact, ReasoningStepZod, StepMetricZod } from "./types"
import { THINKING_PROCESS_DESCRIPTION } from "./description"

interface UseThinkingProcessActionProps {
  addOrUpdateArtifact: (
    type: "thinking-process",
    data: ThinkingProcessArtifact["data"],
  ) => void
}

export const useThinkingProcessAction = ({
  addOrUpdateArtifact,
}: UseThinkingProcessActionProps) => {
  useCopilotAction({
    name: "create_thinking_process",
    description: THINKING_PROCESS_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description:
          "Title for the thinking process card (default: 'Thinking Process')",
        required: false,
      },
      {
        name: "badge",
        type: "string",
        description: "Badge text shown next to title (e.g., 'HAX 04')",
        required: false,
      },
      {
        name: "stepsJson",
        type: "string",
        description:
          "JSON string of reasoning steps array. Each step must have: id (unique string), title (string), status ('completed' | 'in-progress' | 'pending' | 'error'), and optionally description (string)",
        required: true,
      },
      {
        name: "metricsJson",
        type: "string",
        description:
          "JSON string of metrics array. Each metric must have: label (string), value (string). Example: [{\"label\": \"Steps Completed\", \"value\": \"3/5\"}]",
        required: false,
      },
      {
        name: "showToggle",
        type: "boolean",
        description:
          "Whether to show the reasoning process toggle (default: false)",
        required: false,
      },
      {
        name: "reasoningCollapsible",
        type: "boolean",
        description:
          "Whether the Agent Reasoning section is collapsible (default: true)",
        required: false,
      },
    ],
    handler: async (args) => {
      const {
        title,
        badge,
        stepsJson,
        metricsJson,
        showToggle,
        reasoningCollapsible,
      } = args

      const steps = z.array(ReasoningStepZod).parse(JSON.parse(stepsJson))
      const metrics = metricsJson
        ? z.array(StepMetricZod).parse(JSON.parse(metricsJson))
        : undefined

      addOrUpdateArtifact("thinking-process", {
        title,
        badge,
        steps,
        metrics,
        showToggle,
        reasoningCollapsible,
      })

      return `Created thinking process "${title || "Thinking Process"}" with ${steps.length} steps`
    },
  })
}
