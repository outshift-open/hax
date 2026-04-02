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

import { useCopilotAction } from "@copilotkit/react-core";
import { z } from "zod";
import type { MultiStepFormArtifact } from "./types";
import { StepZod, FormFieldZod } from "./types";
import { MULTI_STEP_FORM_DESCRIPTION } from "./description";

interface UseMultiStepFormActionProps {
  addOrUpdateArtifact: (
    type: "multi-step-form",
    data: MultiStepFormArtifact["data"]
  ) => void;
}

export const useMultiStepFormAction = ({
  addOrUpdateArtifact,
}: UseMultiStepFormActionProps) => {
  useCopilotAction({
    name: "create_multi_step_form",
    description: MULTI_STEP_FORM_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Title displayed at the top of the card",
        required: false,
      },
      {
        name: "badge",
        type: "string",
        description: "Badge text shown in the top-right corner",
        required: false,
      },
      {
        name: "stepsJson",
        type: "string",
        description:
          'JSON array of steps: [{"id":"account","label":"Account"},{"id":"profile","label":"Profile"},{"id":"complete","label":"Complete"}]',
        required: false,
      },
      {
        name: "currentStep",
        type: "number",
        description: "Current active step index (0-based)",
        required: false,
      },
      {
        name: "formTitle",
        type: "string",
        description: "Heading for the form section",
        required: false,
      },
      {
        name: "fieldsJson",
        type: "string",
        description:
          'JSON array of fields: [{"name":"email","label":"Email","type":"email","placeholder":"you@example.com","required":true}]',
        required: false,
      },
      {
        name: "backLabel",
        type: "string",
        description: "Label for the back/cancel button",
        required: false,
      },
      {
        name: "nextLabel",
        type: "string",
        description: "Label for the continue/next button",
        required: false,
      },
    ],
    handler: async (args) => {
      const {
        title,
        badge,
        stepsJson,
        currentStep,
        formTitle,
        fieldsJson,
        backLabel,
        nextLabel,
      } = args;

      const data: MultiStepFormArtifact["data"] = {};

      if (title) data.title = title;
      if (badge) data.badge = badge;
      if (stepsJson) {
        try {
          data.steps = z.array(StepZod).parse(JSON.parse(stepsJson));
        } catch {
          /* skip invalid steps JSON */
        }
      }
      if (currentStep !== undefined) data.currentStep = currentStep;
      if (formTitle) data.formTitle = formTitle;
      if (fieldsJson) {
        try {
          data.fields = z.array(FormFieldZod).parse(JSON.parse(fieldsJson));
        } catch {
          /* skip invalid fields JSON */
        }
      }
      if (backLabel) data.backLabel = backLabel;
      if (nextLabel) data.nextLabel = nextLabel;

      addOrUpdateArtifact("multi-step-form", data);

      return "Created multi-step form artifact";
    },
  });
};
