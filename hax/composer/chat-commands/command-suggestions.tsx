/*
 * Copyright 2025 Cisco Systems, Inc. and its affiliates
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandType } from "./hooks/useChatCommands";
import {
  useCommandRegistry,
  type SuggestionItem,
} from "./state/command-registry";

interface CommandSuggestionsProps {
  showSuggestions: boolean;
  commandType: CommandType;
  suggestions: SuggestionItem[];
  selectedIndex: number;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onSuggestionSelect: (item: SuggestionItem) => void;
  onOpenChange: (open: boolean) => void;
  onMouseEnter: (index: number) => void;
}

export function CommandSuggestions({
  showSuggestions,
  commandType,
  suggestions,
  selectedIndex,
  textareaRef,
  onSuggestionSelect,
  onOpenChange,
  onMouseEnter,
}: CommandSuggestionsProps) {
  const registry = useCommandRegistry();
  const command = commandType ? registry.get(commandType) : null;

  const getIcon = (item: SuggestionItem) => {
    return command?.icon(item) || null;
  };

  const getDisplayName = (item: SuggestionItem) => {
    return command?.getDisplayName(item) || "Unknown";
  };

  const getDisplayDescription = (item: SuggestionItem) => {
    return command?.getDisplayDescription(item) || "No description";
  };

  return (
    <DropdownMenu
      open={showSuggestions && !!commandType}
      onOpenChange={onOpenChange}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <div className="pointer-events-none absolute inset-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-h-48 w-full max-w-[1336px] min-w-3xs overflow-y-auto"
        side="top"
        align="start"
        sideOffset={8}
        onCloseAutoFocus={(e: Event) => {
          e.preventDefault();
        }}
        onFocusOutside={(e: Event) => {
          e.preventDefault();
        }}
        onInteractOutside={(e: Event) => {
          if (e.target === textareaRef.current) {
            e.preventDefault();
          }
        }}
      >
        {suggestions.map((item, index) => (
          <DropdownMenuItem
            key={index}
            className={`flex cursor-pointer items-center gap-3 ${
              index === selectedIndex ? "bg-accent text-accent-foreground" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSuggestionSelect(item);
            }}
            onSelect={(e) => {
              e.preventDefault();
            }}
            onMouseEnter={() => onMouseEnter(index)}
          >
            <div className="flex-shrink-0">{getIcon(item)}</div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="truncate text-sm font-medium">
                {getDisplayName(item)}
              </div>
              <div className="max-w-full truncate text-xs text-gray-500">
                {getDisplayDescription(item)}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        {suggestions.length === 0 && (
          <DropdownMenuItem disabled className="text-sm text-gray-500">
            {command?.emptyMessage || "No suggestions found"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
