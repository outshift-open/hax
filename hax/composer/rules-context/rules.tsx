"use client";

import React, { useState, useRef } from "react";
import { Plus, Edit, Trash2, Settings, Check, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRules } from "./rules-context";
import { Rule } from "./types";

interface RulesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RuleFormData {
  name: string;
  description: string;
  content: string;
}

export function RulesModal({ open, onOpenChange }: RulesModalProps) {
  const {
    rules,
    activeRuleIds,
    createRule,
    updateRule,
    deleteRule,
    toggleRuleActive,
  } = useRules();

  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [formData, setFormData] = useState<RuleFormData>({
    name: "",
    description: "",
    content: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({ name: "", description: "", content: "" });
    setIsCreating(false);
    setEditingRule(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) return;

    if (editingRule) {
      updateRule(editingRule.id, {
        name: formData.name,
        description: formData.description,
        content: formData.content,
      });
    } else {
      createRule(formData.name, formData.content, formData.description);
    }

    resetForm();
  };

  const handleEdit = (rule: Rule) => {
    setFormData({
      name: rule.name,
      description: rule.description || "",
      content: rule.content,
    });
    setEditingRule(rule);
    setIsCreating(true);
  };

  const handleDelete = (ruleId: string) => {
    deleteRule(ruleId);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) return;

      // Extract filename without extension for the rule name
      const fileName = file.name.replace(
        /\.(rules|cursorrules|windsurfrules|clinerules|md)$/,
        ""
      );

      // Create a new rule with the file content
      createRule(fileName, content.trim(), `Imported from ${file.name}`);
    };
    reader.readAsText(file);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[80vh] w-[80vw] !max-w-6xl flex-col sm:!max-w-6xl"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-gray-700" />
            Manage Rules
          </DialogTitle>
        </DialogHeader>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".rules, .cursorrules, .windsurfrules, .clinerules, *.md"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Rules List */}
          <div className="w-1/2">
            <div className="border bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Your Rules</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUploadClick}
                    title="Upload rules from file"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      resetForm();
                      setIsCreating(true);
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    New Rule
                  </Button>
                </div>
              </div>
            </div>
            <div className="max-h-[calc(90vh-200px)] space-y-3 overflow-y-auto border-r border-b border-l p-4">
              {rules.map((rule) => (
                <Card
                  key={rule.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => handleEdit(rule)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleEdit(rule);
                    }
                  }}
                  role="button"
                  aria-label={`Edit rule: ${rule.name}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="flex items-center gap-2">
                        {rule.name}
                        {activeRuleIds.includes(rule.id) && (
                          <Badge variant="secondary">Active</Badge>
                        )}
                      </CardTitle>
                    </div>
                    {rule.description && (
                      <CardDescription>{rule.description}</CardDescription>
                    )}
                    <CardAction>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRuleActive(rule.id);
                          }}
                          className={`${
                            activeRuleIds.includes(rule.id)
                              ? "border-green-200 bg-green-50 text-green-700"
                              : ""
                          }`}
                          aria-label={`${activeRuleIds.includes(rule.id) ? "Deactivate" : "Activate"} rule: ${rule.name}`}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(rule);
                          }}
                          aria-label={`Edit rule: ${rule.name}`}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(rule.id);
                          }}
                          className="text-red-600 hover:bg-red-50"
                          aria-label={`Delete rule: ${rule.name}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <p className="max-h-8 overflow-hidden text-xs text-gray-500">
                      {rule.content.length > 100
                        ? `${rule.content.substring(0, 100)}...`
                        : rule.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {rules.length === 0 && (
                <div className="py-15.5 text-center text-gray-500">
                  <Settings className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No rules created yet</p>
                  <p className="text-sm">
                    Create your first rule to get started
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="w-1/2">
            {isCreating ? (
              <form
                onSubmit={handleSubmit}
                className="flex h-full flex-col p-6"
              >
                <div className="mb-4 flex items-center">
                  <h3 className="font-semibold text-gray-900">
                    {editingRule ? "Edit Rule" : "Create New Rule"}
                  </h3>
                </div>

                <div className="flex flex-1 flex-col gap-4">
                  <div>
                    <Label htmlFor="rule-name" className="mb-1">
                      Rule Name *
                    </Label>
                    <Input
                      id="rule-name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Code Review Guidelines"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="rule-description" className="mb-1">
                      Description
                    </Label>
                    <Input
                      id="rule-description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of when to use this rule"
                    />
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col">
                    <Label htmlFor="rule-content" className="mb-1">
                      Rule Content *
                    </Label>
                    <textarea
                      id="rule-content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Enter the rule content that will be applied to your prompts..."
                      className="min-h-0 w-full flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRule ? "Update Rule" : "Create Rule"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                <div className="text-center">
                  <Plus className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p className="mb-2">Select a rule to edit</p>
                  <p className="text-sm">or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t bg-gray-50 p-4">
          <div className="flex w-full items-center justify-between text-sm text-gray-600">
            <div>
              {activeRuleIds.length > 0 && (
                <span>
                  {activeRuleIds.length} rule
                  {activeRuleIds.length !== 1 ? "s" : ""} active
                </span>
              )}
            </div>
            <div className="text-xs">
              Rules are stored locally in your browser
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
