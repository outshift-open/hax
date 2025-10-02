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

import React, { useEffect, useRef, useState } from "react";
import { GeneratedUiWrapper } from "@/components/generated-ui-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Editor, { EditorProps } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const languages: string[] = [
  "html",
  "markdown",
  "css",
  "javascript",
  "typescript",
  "json",
  "python",
  "java",
];

export const HAXCodeEditor = ({
  value,
  language = languages[3],
}: {
  value: EditorProps["defaultValue"];
  language: EditorProps["language"];
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  return (
    <GeneratedUiWrapper title="Code Editor">
      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
        <SelectTrigger className="m-2 h-[34px] rounded-md border-2 border-[#889099] bg-white focus:border-[#1D69CC]">
          <SelectValue placeholder={`Selected: ${selectedLanguage}`} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Editor
        className="flex-1"
        language={selectedLanguage}
        theme="vs-dark"
        value={value}
        onMount={(editor) => (editorRef.current = editor)}
      />
    </GeneratedUiWrapper>
  );
};
