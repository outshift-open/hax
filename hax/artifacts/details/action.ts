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
import { ArtifactTab } from "./types";
import { DETAILS_DESCRIPTION } from "./description";

interface UseDetailsActionProps {
  addOrUpdateArtifact: (
    type: "details",
    data: Extract<ArtifactTab, { type: "details" }>["data"]
  ) => void;
}

export const useDetailsAction = ({
  addOrUpdateArtifact,
}: UseDetailsActionProps) => {
  useCopilotAction({
    name: "create_details",
    description: DETAILS_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Main title of the dashboard",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "Optional description text below the title",
        required: false,
      },
      {
        name: "statsJson",
        type: "string",
        description:
          "JSON string of stats array with {label, value} objects for top stats grid",
        required: false,
      },
      {
        name: "subtitle",
        type: "string",
        description: "Optional subtitle for the section below main stats",
        required: false,
      },
      {
        name: "substatsJson",
        type: "string",
        description:
          "JSON string of substats array with {label, value, sublabel?, highlight?} objects for prominent cards",
        required: false,
      },
      {
        name: "tableJson",
        type: "string",
        description:
          "JSON string of table object with {columns: [{label}], data: string[][]} structure",
        required: false,
      },
    ],
    handler: async (args) => {
      try {
        const {
          title,
          description,
          statsJson,
          subtitle,
          substatsJson,
          tableJson,
        } = args;

        let stats, substats, table;

        if (statsJson) {
          stats = JSON.parse(statsJson);
        }

        if (substatsJson) {
          substats = JSON.parse(substatsJson);
        }

        if (tableJson) {
          table = JSON.parse(tableJson);
        }

        addOrUpdateArtifact("details", {
          title,
          description,
          stats,
          subtitle,
          substats,
          table,
        });

        return `Created details dashboard "${title}"`;
      } catch (error) {
        console.error("Error in create_details handler:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return `Failed to create details dashboard: ${errorMessage}`;
      }
    },
  });
};
