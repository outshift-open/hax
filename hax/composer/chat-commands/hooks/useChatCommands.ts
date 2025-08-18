import { useState } from "react";
import {
  useCommandRegistry,
  type CommandTrigger,
} from "../state/command-registry";

export type CommandType = CommandTrigger | null;

export function useChatCommands() {
  const [commandType, setCommandType] = useState<CommandType>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const registry = useCommandRegistry();

  const detectCommand = (value: string, position: number) => {
    const beforeCursor = value.substring(0, position);
    const words = beforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];

    const detectedCommand = registry.detectCommand(currentWord);

    if (detectedCommand) {
      setCommandType(detectedCommand);
      setShowSuggestions(true);
    } else {
      setCommandType(null);
      setShowSuggestions(false);
    }
  };

  const clearCommand = () => {
    setCommandType(null);
    setShowSuggestions(false);
  };

  return {
    commandType,
    showSuggestions,
    detectCommand,
    clearCommand,
    setShowSuggestions,
    setCommandType,
  };
}
