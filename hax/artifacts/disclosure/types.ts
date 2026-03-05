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

export const DisclosureCollapsibleItemZod = z.object({
  title: z.string(),
  icon: z.enum(["check", "warning"]).optional(),
  items: z.array(z.string()),
  defaultOpen: z.boolean().optional(),
})

export const DisclosureArtifactZod = z.object({
  id: z.string(),
  type: z.literal("disclosure"),
  data: z.object({
    title: z.string().optional(),
    badge: z.string().optional(),
    headline: z.string().optional(),
    infoAlert: z.string().optional(),
    capabilities: DisclosureCollapsibleItemZod.optional(),
    limitations: DisclosureCollapsibleItemZod.optional(),
    privacyTitle: z.string().optional(),
    privacyText: z.string().optional(),
    actionButtonText: z.string().optional(),
    showCancelButton: z.boolean().optional(),
    cancelButtonText: z.string().optional(),
  }),
})

export type DisclosureCollapsibleItem = z.infer<typeof DisclosureCollapsibleItemZod>
export type DisclosureArtifact = z.infer<typeof DisclosureArtifactZod>
export type DisclosureData = DisclosureArtifact["data"]
