import { useCopilotAction } from "@copilotkit/react-core";
import { ConsentCardArtifact } from "./types";
import { CONSENT_CARD_DESCRIPTION } from "./description";

interface UseConsentCardActionProps {
  addOrUpdateArtifact: (type: "consent-card", data: ConsentCardArtifact["data"]) => void;
}

export const useConsentCardAction = ({ addOrUpdateArtifact }: UseConsentCardActionProps) => {
  useCopilotAction({
    name: "create_consent_card",
    description: CONSENT_CARD_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Title for the consent card",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "Description explaining what the user is opting into",
        required: false,
      },
      {
        name: "bulletPointsJson",
        type: "string",
        description:
          'JSON array of strings: ["All data is fully anonymized.", "Strictly internal use only."]',
        required: false,
      },
      {
        name: "acceptLabel",
        type: "string",
        description: 'Label for the accept button (default: "Yes, Improve My Experience")',
        required: false,
      },
      {
        name: "declineLabel",
        type: "string",
        description: 'Label for the decline button (default: "Maybe Later")',
        required: false,
      },
    ],
    handler: async (args) => {
      const { title, description, bulletPointsJson, acceptLabel, declineLabel } = args;

      try {
        const data: ConsentCardArtifact["data"] = {};
        if (title) data.title = title;
        if (description) data.description = description;
        if (bulletPointsJson) data.bulletPoints = JSON.parse(bulletPointsJson);
        if (acceptLabel) data.acceptLabel = acceptLabel;
        if (declineLabel) data.declineLabel = declineLabel;

        addOrUpdateArtifact("consent-card", data);

        return "Created consent card";
      } catch (e) {
        return "Error creating consent card: invalid JSON";
      }
    },
  });
};
