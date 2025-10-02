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

export const CODE_EDITOR_DESCRIPTION =
  `Use code editors for displaying, editing, and sharing code snippets with syntax highlighting and formatting. Best for documentation, tutorials, code reviews, examples, and interactive coding experiences. Supports multiple programming languages with appropriate syntax highlighting.

Whenever new code is set or refreshed in the codeEditor, choose the correct programming language for the code editor. Use that language identifier for proper syntax highlighting: 'javascript', 'typescript', 'python', 'html', 'css', 'json', 'markdown', 'sql', etc. Format code with proper indentation and line breaks for readability. Include complete, runnable examples when possible rather than fragments.

Keep code examples focused and purposeful - show complete functions or logical code blocks. Use meaningful variable names and include comments for complex logic. Ensure proper indentation (2-4 spaces consistently). Limit line length to 80-100 characters for readability across devices.

Don't include incomplete code fragments without context. Avoid extremely long code blocks (>50 lines) that require excessive scrolling - break into smaller, logical sections. Don't use generic variable names like 'a', 'b', 'data' without context. Avoid mixing coding styles or indentation within the same block. Don't show code with syntax errors unless demonstrating debugging.` as const;
