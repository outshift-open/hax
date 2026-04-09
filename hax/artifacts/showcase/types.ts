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

export const ShowcaseItemZod = z.object({
  id: z.string().describe("Unique identifier for the item"),
  title: z.string().describe("Item title/heading"),
  description: z.string().describe("Brief description of the item"),
  badge: z.string().optional().describe("Category badge label (e.g. 'Template', 'Report')"),
  imageUrl: z.string().optional().describe("Preview image URL"),
  author: z.string().optional().describe("Author name (used in table view)"),
  category: z.string().optional().describe("Category label (used in table view with purple badge)"),
});

export const ShowcaseCategoryZod = z.object({
  title: z.string().describe("Section heading (e.g. 'Trending', 'Most Popular')"),
  subhead: z.string().optional().describe("Optional section subheading"),
  icon: z
    .enum(["trending", "star", "clock"])
    .optional()
    .describe("Section icon type: trending (TrendingUp), star (Star), clock (Clock)"),
  items: z
    .array(ShowcaseItemZod)
    .describe("Items in this category section"),
});

export const ShowcaseVariantZod = z
  .enum(["grid", "list", "dense-grid", "table", "categorized", "featured"])
  .describe("Layout variant: grid (3x2 cards), list (horizontal cards with actions), dense-grid (4x3 compact), table (rows with columns), categorized (sections with headers), featured (hero + masonry)");

export const ShowcaseArtifactZod = z.object({
  id: z.string(),
  type: z.literal("showcase"),
  data: z.object({
    variant: ShowcaseVariantZod.optional().describe("Layout variant, defaults to grid"),
    items: z
      .array(ShowcaseItemZod)
      .optional()
      .describe("Items to display (used by all variants except categorized)"),
    categories: z
      .array(ShowcaseCategoryZod)
      .optional()
      .describe("Category sections (used only by categorized variant)"),
  }),
});

export type ShowcaseItemData = z.infer<typeof ShowcaseItemZod>;
export type ShowcaseCategoryData = z.infer<typeof ShowcaseCategoryZod>;
export type ShowcaseVariant = z.infer<typeof ShowcaseVariantZod>;
export type ShowcaseArtifact = z.infer<typeof ShowcaseArtifactZod>;