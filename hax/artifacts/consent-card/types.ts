import { z } from "zod";

export const ConsentCardArtifactZod = z.object({
  id: z.string(),
  type: z.literal("consent-card"),
  data: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    bulletPoints: z.array(z.string()).optional(),
    acceptLabel: z.string().optional(),
    declineLabel: z.string().optional(),
  }),
});

export type ConsentCardArtifact = z.infer<typeof ConsentCardArtifactZod>;
