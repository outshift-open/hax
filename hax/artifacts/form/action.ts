import { useCopilotAction } from "@copilotkit/react-core";
import { ArtifactTab, FormArtifact } from "./types";
import { FORM_DESCRIPTION } from "./description";

interface UseFormActionProps {
  addOrUpdateArtifact: (type: "form", data: FormArtifact["data"]) => void;
}
export const useFormAction = ({ addOrUpdateArtifact }: UseFormActionProps) => {
  useCopilotAction({
    name: "create_form",
    description: FORM_DESCRIPTION,
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
