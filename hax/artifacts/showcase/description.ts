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

export const SHOWCASE_DESCRIPTION =
  `Use the showcase artifact to present a browsable collection of items for the user to explore, preview, and act on. Best for displaying templates, search results, recommendations, generated options, or curated content.

Supports 6 layout variants:
- "grid": 3x2 vertical card grid with image, badge, heading, description. Best for visual-heavy content.
- "list": 2-column horizontal cards with image left, content right, Preview button + favorite. Best for items with rich metadata.
- "dense-grid": 4x3 compact grid with smaller cards. Best for large collections.
- "table": Row-based table with Preview thumbnail, Title, Author, Category badge, action icons. Best for data-dense scanning.
- "categorized": Sections with icon headers (Trending/Star/Clock), 3 overlay cards per section. Best for grouped/curated content.
- "featured": Full-width hero card + 3-column masonry grid below. Best for highlighting a primary item with supporting items.

Each item requires: id (unique), title, description.
Optional per item: badge (category label), imageUrl (preview), author, category.

For "categorized" variant, provide categories array instead of items. Each category has: title, icon (trending/star/clock), items array.

Choose the variant that best matches the user's intent:
- Browsing/exploring → grid or dense-grid
- Comparing with details → list or table
- Curated sections → categorized
- Highlighting one item → featured

Ensure each item has a unique id. Include badges for categorization. Keep descriptions concise (1-2 sentences).` as const;