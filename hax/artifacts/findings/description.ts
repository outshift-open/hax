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

export const FINDINGS_DESCRIPTION =
  `Use findings panels for answering factual questions, research queries, and displaying analysis results with source attribution. This is the PRIMARY artifact for questions like "Is X safe?", "What is Y?", "How does Z work?".

PREFER findings over thinking-process for simple research/factual questions. Use thinking-process only when user explicitly asks to see reasoning steps.

Best for:
- Factual questions and research queries
- AI research results and analysis summaries
- Security findings and audit results
- Recommendations with supporting evidence

Include a panel title and one or more findings. Each finding should have:
- Clear title summarizing the key insight
- Detailed description with the answer/information
- Relevant sources for credibility and verification

Write clear, actionable finding descriptions. Include all relevant sources for each finding. Group related findings together. Keep findings focused and specific. Ensure each finding has a unique ID.

Don't use for: Complex multi-step debugging workflows (use thinking-process), code examples (use code-editor), or simple status updates.` as const;
