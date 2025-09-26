import { User } from "lucide-react";
import { CommandDefinition } from "../state/command-registry";
interface Agent {
  id: string;
  name: string;
  description: string;
}

export const agentDelegationCommand: CommandDefinition = {
  trigger: "@",
  name: "Agent Delegation",
  description: "Tag agents for delegation",

  icon: () => <User className="h-4 w-4 text-blue-500" />,

  getDisplayName: (item: Agent) => item.name || "Unknown",

  getDisplayDescription: (item: Agent) => item.description || "No description",

  emptyMessage: "No agents found",

  getSuggestions: (query: string, context) => {
    const agents = context.agents as Agent[];
    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query.toLowerCase()) ||
        agent.description.toLowerCase().includes(query.toLowerCase())
    );
  },

  formatReplacement: (item: Agent) => `@${item.id} `,

  processMessage: (message: string) => {
    if (!message.includes("@")) return message;

    const agentMentions = message.match(/@(\w+)/g);
    if (agentMentions) {
      return `${message}\n\n[Agent delegation requested: ${agentMentions.join(", ")}]`;
    }
    return message;
  },
};
