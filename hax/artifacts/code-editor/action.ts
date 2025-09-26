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
