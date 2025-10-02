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

import { useCopilotAction } from "@copilotkit/react-core";
import { ArtifactTab } from "./types";
import { CODE_EDITOR_DESCRIPTION } from "./description";

interface UseDataVisualizerActionProps {
  addOrUpdateArtifact: (
    type: "codeEditor",
    data: Extract<ArtifactTab, { type: "codeEditor" }>["data"]
  ) => void;
}

export const useCodeEditorAction = ({
  addOrUpdateArtifact,
}: UseDataVisualizerActionProps) => {
  useCopilotAction({
    name: "open_code_editor",
    description: CODE_EDITOR_DESCRIPTION,
    parameters: [
      {
        name: "language",
        type: "string",
        description:
          "The language of the code. Let's make the default value 'javascript'.",
        required: false,
        default: "javascript",
      },
      {
        name: "code",
        type: "string",
        description:
          "The code to be displayed in the code editor. It always must be a simple string.",
        required: false,
      },
    ],
    handler: async (args) => {
      const { language, code } = args;

      addOrUpdateArtifact("codeEditor", {
        language: language ?? "",
        code: code ?? "",
      });

      return `Opened the code editor for ${language} language. ${code?.length ? "Code provided." : "No code provided."}`;
    },
  });
};
