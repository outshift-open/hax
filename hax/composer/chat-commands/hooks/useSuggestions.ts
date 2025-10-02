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

import { useState, useEffect } from "react";
import { CommandType } from "./useChatCommands";
import { LocalContextItem } from "./useLocalContext";
import { ToolItem } from "./useTools";
import {
  useCommandRegistry,
  type CommandContext,
  type SuggestionItem,
} from "../state/command-registry";

interface Agent {
  id: string;
  name: string;
  description: string;
}

export function useSuggestions(
  inputValue: string,
  cursorPosition: number,
  commandType: CommandType,
  agents: Agent[],
  localContext: LocalContextItem[],
  tools: ToolItem[]
) {
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const registry = useCommandRegistry();

  const getCurrentSuggestions = (): SuggestionItem[] => {
    if (!commandType) return [];

    const command = registry.get(commandType);
    if (!command) return [];

    const beforeCursor = inputValue.substring(0, cursorPosition);
    const words = beforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];
    const query = currentWord.substring(command.trigger.length); // Remove the command trigger

    const context: CommandContext = {
      agents,
      localContext,
      tools,
      inputValue,
      cursorPosition,
    };

    return command.getSuggestions(query, context);
  };

  // Reset selected index when suggestions change
  useEffect(() => {
    const suggestions = getCurrentSuggestions();
    if (selectedSuggestionIndex >= suggestions.length) {
      setSelectedSuggestionIndex(Math.max(0, suggestions.length - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inputValue,
    cursorPosition,
    commandType,
    agents,
    localContext,
    tools,
    selectedSuggestionIndex,
  ]);

  const navigateUp = () => {
    const suggestions = getCurrentSuggestions();
    setSelectedSuggestionIndex((prev) =>
      prev > 0 ? prev - 1 : suggestions.length - 1
    );
  };

  const navigateDown = () => {
    const suggestions = getCurrentSuggestions();
    setSelectedSuggestionIndex((prev) =>
      prev < suggestions.length - 1 ? prev + 1 : 0
    );
  };

  const getSelectedSuggestion = (): SuggestionItem | null => {
    const suggestions = getCurrentSuggestions();
    return suggestions[selectedSuggestionIndex] || null;
  };

  return {
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
    getCurrentSuggestions,
    navigateUp,
    navigateDown,
    getSelectedSuggestion,
  };
}
