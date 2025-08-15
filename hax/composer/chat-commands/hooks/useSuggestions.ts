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
