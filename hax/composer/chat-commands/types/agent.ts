interface AgentCategory {
  uid: number;
  name: string;
  description: string;
  caption: string;
  parentUid: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  categories: AgentCategory[];
}
