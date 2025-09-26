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
