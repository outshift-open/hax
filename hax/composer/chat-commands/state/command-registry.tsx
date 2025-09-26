import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// Base types for flexibility
export type CommandTrigger = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SuggestionItem = any; // Flexible type to support different suggestion types

export interface CommandDefinition {
  // Core properties
  trigger: CommandTrigger;
  name: string;
  description: string;

  // UI configuration
  icon: (item?: SuggestionItem) => ReactNode;
  getDisplayName: (item: SuggestionItem) => string;
  getDisplayDescription: (item: SuggestionItem) => string;
  emptyMessage: string;

  // Behavior
  getSuggestions: (query: string, context: CommandContext) => SuggestionItem[];
  formatReplacement: (item: SuggestionItem) => string;
  processMessage?: (message: string) => string;
  onSelect?: (item: SuggestionItem, context: CommandContext) => void;

  // Optional detection logic (if different from simple prefix matching)
  detectCommand?: (word: string) => boolean;
}

export interface CommandContext {
  agents: SuggestionItem[];
  localContext: SuggestionItem[];
  tools: SuggestionItem[];
  inputValue: string;
  cursorPosition: number;
  triggerFileBrowser?: () => void;
  clearCommand?: () => void;
  setInputValue?: (value: string) => void;
}

interface CommandRegistryContextType {
  commands: Map<CommandTrigger, CommandDefinition>;
  register: (command: CommandDefinition) => void;
  unregister: (trigger: CommandTrigger) => void;
  get: (trigger: CommandTrigger) => CommandDefinition | undefined;
  getAll: () => CommandDefinition[];
  getTriggers: () => CommandTrigger[];
  detectCommand: (word: string) => CommandTrigger | null;
  processMessage: (message: string) => string;
  clear: () => void;
}

const CommandRegistryContext = createContext<CommandRegistryContextType | null>(
  null
);

export const useCommandRegistry = (): CommandRegistryContextType => {
  const context = useContext(CommandRegistryContext);
  if (!context) {
    throw new Error(
      "useCommandRegistry must be used within a CommandRegistryProvider"
    );
  }
  return context;
};

interface CommandRegistryProviderProps {
  children: ReactNode;
}

export const CommandRegistryProvider = ({
  children,
}: CommandRegistryProviderProps) => {
  const [commands, setCommands] = useState<
    Map<CommandTrigger, CommandDefinition>
  >(new Map());

  const register = useCallback((command: CommandDefinition) => {
    setCommands((prev) => new Map(prev).set(command.trigger, command));
  }, []);

  const unregister = useCallback((trigger: CommandTrigger) => {
    setCommands((prev) => {
      const newMap = new Map(prev);
      newMap.delete(trigger);
      return newMap;
    });
  }, []);

  const get = useCallback(
    (trigger: CommandTrigger) => {
      return commands.get(trigger);
    },
    [commands]
  );

  const getAll = useCallback(() => {
    return Array.from(commands.values());
  }, [commands]);

  const getTriggers = useCallback(() => {
    return Array.from(commands.keys());
  }, [commands]);

  const detectCommand = useCallback(
    (word: string): CommandTrigger | null => {
      for (const [trigger, command] of commands) {
        // Use custom detection logic if provided
        if (command.detectCommand) {
          if (command.detectCommand(word)) {
            return trigger;
          }
        } else {
          // Default: simple prefix matching
          if (word.startsWith(trigger)) {
            return trigger;
          }
        }
      }
      return null;
    },
    [commands]
  );

  const processMessage = useCallback(
    (message: string): string => {
      let processedMessage = message;

      for (const command of commands.values()) {
        if (command.processMessage) {
          processedMessage = command.processMessage(processedMessage);
        }
      }

      return processedMessage;
    },
    [commands]
  );

  const clear = useCallback(() => {
    setCommands(new Map());
  }, []);

  const value: CommandRegistryContextType = {
    commands,
    register,
    unregister,
    get,
    getAll,
    getTriggers,
    detectCommand,
    processMessage,
    clear,
  };

  return (
    <CommandRegistryContext.Provider value={value}>
      {children}
    </CommandRegistryContext.Provider>
  );
};
