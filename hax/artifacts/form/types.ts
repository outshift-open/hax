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

export const FormFieldZod = z.object({
  type: z.enum(["text", "email", "number", "select", "checkbox", "textarea"]),
  label: z.string(),
  placeholder: z.string().optional(),
  options: z
    .union([
      z.array(z.string()),
      z.array(z.object({ value: z.string(), label: z.string() })),
    ])
    .optional(),
  required: z.boolean().optional(),
  name: z.string().optional(),
  rows: z.number().optional(),
});

export const FormArtifactZod = z.object({
  id: z.string(),
  type: z.literal("form"),
  data: z.object({
    title: z.string(),
    fields: z.array(FormFieldZod),
  }),
});

export type FormArtifact = z.infer<typeof FormArtifactZod>;
export type FormField = z.infer<typeof FormFieldZod>;

export const ArtifactTabZod = z.discriminatedUnion("type", [FormArtifactZod]);
export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
