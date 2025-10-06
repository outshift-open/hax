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
