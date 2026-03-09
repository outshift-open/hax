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

export const DataTableColumnZod = z.object({
  id: z.string(),
  header: z.string(),
  sortable: z.boolean().optional(),
  align: z.enum(["left", "right", "center"]).optional(),
});

export const LabelItemZod = z.object({
  text: z.string(),
  color: z.enum(["red", "green", "blue", "orange", "gray"]).optional(),
});

export const CellValueZod = z.union([
  z.string(),
  z.number(),
  z.object({ type: z.literal("avatar"), initials: z.string(), name: z.string() }),
  z.object({ type: z.literal("progress"), value: z.number() }),
  z.object({ type: z.literal("labels"), items: z.array(LabelItemZod) }),
]);

export const DataTableRowZod = z.object({
  id: z.string(),
  cells: z.record(z.string(), CellValueZod),
});

export const DataTableArtifactZod = z.object({
  id: z.string(),
  type: z.literal("data-table"),
  data: z.object({
    columns: z.array(DataTableColumnZod),
    rows: z.array(DataTableRowZod),
    selectable: z.boolean().optional(),
    showActions: z.boolean().optional(),
  }),
});

export type DataTableArtifact = z.infer<typeof DataTableArtifactZod>;
export type DataTableData = DataTableArtifact["data"];
