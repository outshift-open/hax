import { FolderOpen, Upload } from "lucide-react";
import { CommandDefinition } from "../state/command-registry";

interface LocalContextItem {
  name: string;
  path: string;
  type: "file" | "browse";
  content?: string;
}

export const contextCommand: CommandDefinition = {
  trigger: "+",
  name: "Context",
  description: "Add files or folders as context",

  icon: (item?: LocalContextItem) => {
    if (item?.type === "browse") {
      return <Upload className="h-4 w-4 text-orange-500" />;
    }
    return <FolderOpen className="h-4 w-4 text-green-500" />;
  },

  getDisplayName: (item: LocalContextItem) => item.name || "Unknown",

  getDisplayDescription: (item: LocalContextItem) =>
    item.path || "No description",

  emptyMessage: "No files found",

  getSuggestions: (query: string, context) => {
    const localContext = context.localContext as LocalContextItem[];
    return localContext.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.path.toLowerCase().includes(query.toLowerCase())
    );
  },

  formatReplacement: (item: LocalContextItem) => `+${item.name} `,

  onSelect: (item: LocalContextItem, context) => {
    // Handle browse files option specially
    if (item.type === "browse" && context.triggerFileBrowser) {
      console.log("Browse files option selected");

      // Clear the + command from input
      const { inputValue, cursorPosition, setInputValue, clearCommand } =
        context;
      if (!inputValue || !setInputValue || !clearCommand) return;

      const beforeCursor = inputValue.substring(0, cursorPosition);
      const afterCursor = inputValue.substring(cursorPosition);
      const words = beforeCursor.split(/\s+/);
      const currentWord = words[words.length - 1];
      const newBeforeCursor = beforeCursor.substring(
        0,
        beforeCursor.length - currentWord.length
      );
      const newValue = newBeforeCursor + afterCursor;

      setInputValue(newValue);
      clearCommand();

      // Trigger file browser after state cleanup
      context.triggerFileBrowser();
    }
  },
};
