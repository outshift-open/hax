import { useCopilotAction } from "@copilotkit/react-core";
import { ArtifactTab } from "./types";

interface UseFormActionProps {
  addOrUpdateArtifact: (
    type: "form",
    data: Extract<ArtifactTab, { type: "form" }>["data"]
  ) => void;
}
export const useFormAction = ({ addOrUpdateArtifact }: UseFormActionProps) => {
  useCopilotAction({
    name: "create_form",
    description: "Create a dynamic form for data collection",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Form title",
        required: true,
      },
      {
        name: "fieldsJson",
        type: "string",
        description: "JSON string of form fields array",
        required: true,
      },
    ],
    handler: async (args) => {
      const { title, fieldsJson } = args;
      const fields = JSON.parse(fieldsJson);

      addOrUpdateArtifact("form", { title, fields });

      return `Created form "${title}" with ${fields.length} fields`;
    },
  });
};
