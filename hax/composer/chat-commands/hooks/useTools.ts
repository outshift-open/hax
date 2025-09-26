import { useState, useEffect } from "react";
import { useCopilotContext } from "@copilotkit/react-core";

export interface ToolItem {
  name: string;
  description: string;
}

export function useTools() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const { actions } = useCopilotContext();

  // Load available tools from copilot actions
  useEffect(() => {
    try {
      const toolItems = Object.values(actions).map((action) => ({
        name: action.name || "Unknown Tool",
        description: action.description || "No description available",
      }));
      setTools(toolItems);
    } catch (error) {
      console.warn("Failed to load tools from actions:", error);
    }
  }, [actions]);

  return { tools };
}
