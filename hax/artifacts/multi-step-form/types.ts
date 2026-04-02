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

export const StepZod = z.object({
  id: z.string(),
  label: z.string(),
});

export const FormFieldZod = z.object({
  name: z.string(),
  label: z.string(),
  type: z
    .enum(["text", "email", "password", "number", "tel", "url"])
    .optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
});

export const MultiStepFormArtifactZod = z.object({
  id: z.string(),
  type: z.literal("multi-step-form"),
  data: z.object({
    title: z.string().optional(),
    badge: z.string().optional(),
    steps: z.array(StepZod).optional(),
    currentStep: z.number().optional(),
    formTitle: z.string().optional(),
    fields: z.array(FormFieldZod).optional(),
    backLabel: z.string().optional(),
    nextLabel: z.string().optional(),
  }),
});

export type MultiStepFormArtifact = z.infer<typeof MultiStepFormArtifactZod>;
export type StepData = z.infer<typeof StepZod>;
export type FormFieldData = z.infer<typeof FormFieldZod>;
