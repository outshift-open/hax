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

import { useState } from "react";
import {
  useCommandRegistry,
  type CommandTrigger,
} from "../state/command-registry";

export type CommandType = CommandTrigger | null;

export function useChatCommands() {
  const [commandType, setCommandType] = useState<CommandType>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const registry = useCommandRegistry();

  const detectCommand = (value: string, position: number) => {
    const beforeCursor = value.substring(0, position);
    const words = beforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];

    const detectedCommand = registry.detectCommand(currentWord);

    if (detectedCommand) {
      setCommandType(detectedCommand);
      setShowSuggestions(true);
    } else {
      setCommandType(null);
      setShowSuggestions(false);
    }
  };

  const clearCommand = () => {
    setCommandType(null);
    setShowSuggestions(false);
  };

  return {
    commandType,
    showSuggestions,
    detectCommand,
    clearCommand,
    setShowSuggestions,
    setCommandType,
  };
}
