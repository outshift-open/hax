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
import { DataTableArtifact } from "./types";
import { DATA_TABLE_DESCRIPTION } from "./description";

interface UseDataTableActionProps {
  addOrUpdateArtifact: (type: "data-table", data: DataTableArtifact["data"]) => void;
}

export const useDataTableAction = ({ addOrUpdateArtifact }: UseDataTableActionProps) => {
  useCopilotAction({
    name: "create_data_table",
    description: DATA_TABLE_DESCRIPTION,
    parameters: [
      {
        name: "columnsJson",
        type: "string",
        description: 'JSON array of columns: [{"id": "col1", "header": "Name", "sortable": true}]',
        required: true,
      },
      {
        name: "rowsJson",
        type: "string",
        description: 'JSON array of rows: [{"id": "1", "cells": {"col1": "value"}}]. Cell values can be strings, numbers, or objects like {"type": "progress", "value": 75} or {"type": "labels", "items": [{"text": "Tag", "color": "green"}]} or {"type": "avatar", "initials": "AB", "name": "Alice"}',
        required: true,
      },
      {
        name: "selectable",
        type: "boolean",
        description: "Whether rows have checkboxes for selection (default: true)",
        required: false,
      },
      {
        name: "showActions",
        type: "boolean",
        description: "Whether to show Edit/Delete action buttons per row (default: true)",
        required: false,
      },
    ],
    handler: async (args) => {
      const { columnsJson, rowsJson, selectable, showActions } = args;

      try {
        const columns = JSON.parse(columnsJson);
        const rows = JSON.parse(rowsJson);

        const data: DataTableArtifact["data"] = { columns, rows };
        if (selectable !== undefined) data.selectable = selectable;
        if (showActions !== undefined) data.showActions = showActions;

        addOrUpdateArtifact("data-table", data);

        return `Created data table with ${columns.length} columns and ${rows.length} rows`;
      } catch (e) {
        return `Error creating data table: invalid JSON`;
      }
    },
  });
};
