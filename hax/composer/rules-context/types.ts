export interface Rule {
  id: string;
  name: string;
  description?: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RulesState {
  rules: Rule[];
  activeRuleIds: string[];
}
