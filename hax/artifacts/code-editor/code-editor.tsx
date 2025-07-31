import React, { useEffect, useRef, useState } from "react";
import { GeneratedUiWrapper } from "@/components/ui/generated-ui-wrapper";
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
