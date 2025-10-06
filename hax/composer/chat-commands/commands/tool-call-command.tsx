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

import { Wrench } from "lucide-react";
import { CommandDefinition } from "../state/command-registry";

interface ToolItem {
  name: string;
  description: string;
}

export const toolCallCommand: CommandDefinition = {
  trigger: "/",
  name: "Tool call",
  description: "Force tool execution",

  icon: () => <Wrench className="h-4 w-4 text-purple-500" />,

  getDisplayName: (item: ToolItem) => item.name || "Unknown",

  getDisplayDescription: (item: ToolItem) =>
    item.description || "No description",

  emptyMessage: "No tools found",

  getSuggestions: (query: string, context) => {
    const tools = context.tools as ToolItem[];
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
    );
  },

  formatReplacement: (item: ToolItem) => `/${item.name} `,

  processMessage: (message: string) => {
    // Use a precise regex that excludes URLs
    const toolCommands = message.match(/(?:^|\s)\/(\w+)(?=\s|$)/g);
    if (toolCommands) {
      const cleanCommands = toolCommands.map((cmd) => cmd.trim());
      return `${message}\n\n[Tool call execution requested: ${cleanCommands.join(", ")}]`;
    }
    return message;
  },

  detectCommand: (word: string) => {
    // Helper function to check if a word is a URL
    const isUrl = (word: string) => {
      return (
        /^https?:\/\//.test(word) || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(word)
      );
    };

    // Must start with "/" and be followed by word characters (not a URL)
    // Allow just "/" by itself to trigger suggestions
    return word.startsWith("/") && !isUrl(word) && /^\/\w*$/.test(word);
  },
};
