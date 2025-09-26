"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { Rule, RulesState } from "./types";
import { createStorage } from "./localStorage";

const rulesStorage = createStorage<RulesState>("hax-coworker-rules");

interface RulesContextType {
  rules: Rule[];
  activeRuleIds: string[];
  createRule: (name: string, content: string, description?: string) => Rule;
  updateRule: (
    id: string,
    updates: Partial<Omit<Rule, "id" | "createdAt">>
  ) => void;
  deleteRule: (id: string) => void;
  toggleRuleActive: (id: string) => void;
  setActiveRules: (ruleIds: string[]) => void;
  getActiveRules: () => Rule[];
  getActiveRulesContent: () => string;
}

export const RulesContext = createContext<RulesContextType | undefined>(
  undefined
);

interface RulesProviderProps {
  children: ReactNode;
}

export function RulesProvider({ children }: RulesProviderProps) {
  const [rulesState, setRulesState] = useState<RulesState>({
    rules: [],
    activeRuleIds: [],
  });

  // Load rules from localStorage on mount
  useEffect(() => {
    const stored = rulesStorage.load();
    if (stored) {
      setRulesState(stored);
    }
  }, []);

  // Save to localStorage. Call this whenever state changes
  const saveToStorage = useCallback((state: RulesState) => {
    rulesStorage.save(state);
  }, []);

  const createRule = useCallback(
    (name: string, content: string, description?: string) => {
      const newRule: Rule = {
        id: crypto.randomUUID(),
        name,
        description,
        content,
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newState = {
        ...rulesState,
        rules: [...rulesState.rules, newRule],
      };
      setRulesState(newState);
      saveToStorage(newState);
      return newRule;
    },
    [rulesState, saveToStorage]
  );

  const updateRule = useCallback(
    (id: string, updates: Partial<Omit<Rule, "id" | "createdAt">>) => {
      const newState = {
        ...rulesState,
        rules: rulesState.rules.map((rule) =>
          rule.id === id
            ? { ...rule, ...updates, updatedAt: new Date().toISOString() }
            : rule
        ),
      };
      setRulesState(newState);
      saveToStorage(newState);
    },
    [rulesState, saveToStorage]
  );

  const deleteRule = useCallback(
    (id: string) => {
      const newState = {
        rules: rulesState.rules.filter((rule) => rule.id !== id),
        activeRuleIds: rulesState.activeRuleIds.filter(
          (ruleId) => ruleId !== id
        ),
      };
      setRulesState(newState);
      saveToStorage(newState);
    },
    [rulesState, saveToStorage]
  );

  const toggleRuleActive = useCallback(
    (id: string) => {
      const rule = rulesState.rules.find((r) => r.id === id);
      if (!rule) return;

      const isCurrentlyActive = rulesState.activeRuleIds.includes(id);
      const newActiveRuleIds = isCurrentlyActive
        ? rulesState.activeRuleIds.filter((ruleId) => ruleId !== id)
        : [...rulesState.activeRuleIds, id];

      const newState = {
        ...rulesState,
        activeRuleIds: newActiveRuleIds,
        rules: rulesState.rules.map((r) =>
          r.id === id ? { ...r, isActive: !isCurrentlyActive } : r
        ),
      };
      setRulesState(newState);
      saveToStorage(newState);
    },
    [rulesState, saveToStorage]
  );

  const setActiveRules = useCallback(
    (ruleIds: string[]) => {
      const newState = {
        ...rulesState,
        activeRuleIds: ruleIds,
        rules: rulesState.rules.map((rule) => ({
          ...rule,
          isActive: ruleIds.includes(rule.id),
        })),
      };
      setRulesState(newState);
      saveToStorage(newState);
    },
    [rulesState, saveToStorage]
  );

  const getActiveRules = useCallback(() => {
    return rulesState.rules.filter((rule) =>
      rulesState.activeRuleIds.includes(rule.id)
    );
  }, [rulesState]);

  const getActiveRulesContent = useCallback(() => {
    const activeRules = getActiveRules();
    if (activeRules.length === 0) return "";

    const rulesContent = activeRules
      .map((rule) => `${rule.name}: ${rule.content}`)
      .join("\n\n");

    return rulesContent;
  }, [getActiveRules]);

  const contextValue: RulesContextType = {
    rules: rulesState.rules,
    activeRuleIds: rulesState.activeRuleIds,
    createRule,
    updateRule,
    deleteRule,
    toggleRuleActive,
    setActiveRules,
    getActiveRules,
    getActiveRulesContent,
  };

  return (
    <RulesContext.Provider value={contextValue}>
      {children}
    </RulesContext.Provider>
  );
}

export function useRules() {
  const context = useContext(RulesContext);
  if (context === undefined) {
    throw new Error("useRules must be used within a RulesProvider");
  }
  return context;
}
