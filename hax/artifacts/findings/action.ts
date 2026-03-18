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

import { z } from "zod";
import { useCopilotAction } from "@copilotkit/react-core";
import { FindingsArtifact, FindingZod } from "./types";
import { FINDINGS_DESCRIPTION } from "./description";

interface UseFindingsActionProps {
  addOrUpdateArtifact: (type: "findings", data: FindingsArtifact["data"]) => void;
}

export const useFindingsAction = ({ addOrUpdateArtifact }: UseFindingsActionProps) => {
  useCopilotAction({
    name: "create_findings",
    description: FINDINGS_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Panel title for the findings",
        required: true,
      },
      {
        name: "findingsJson",
        type: "string",
        description: "JSON string of findings array: [{id, title, description, sources?: [{label, href?}]}]",
        required: true,
      },
    ],
    handler: async (args) => {
      const { title, findingsJson } = args;
      const parsed = JSON.parse(findingsJson);
      const findings = z.array(FindingZod).parse(parsed);

      addOrUpdateArtifact("findings", { title, findings });

      return `Created findings panel "${title}" with ${findings.length} findings`;
    },
  });
};
