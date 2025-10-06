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
import { FormArtifact } from "./types";
import { FORM_DESCRIPTION } from "./description";

interface UseFormActionProps {
  addOrUpdateArtifact: (type: "form", data: FormArtifact["data"]) => void;
}
export const useFormAction = ({ addOrUpdateArtifact }: UseFormActionProps) => {
  useCopilotAction({
    name: "create_form",
    description: FORM_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Form title",
        required: true,
      },
      {
        name: "fieldsJson",
        type: "string",
        description: "JSON string of form fields array",
        required: true,
      },
    ],
    handler: async (args) => {
      const { title, fieldsJson } = args;
      const fields = JSON.parse(fieldsJson);

      addOrUpdateArtifact("form", { title, fields });

      return `Created form "${title}" with ${fields.length} fields`;
    },
  });
};
