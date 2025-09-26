import { z } from "zod";

export const FormFieldZod = z.object({
  type: z.enum(["text", "email", "number", "select", "checkbox", "textarea"]),
  label: z.string(),
  placeholder: z.string().optional(),
  options: z
    .union([
      z.array(z.string()),
      z.array(z.object({ value: z.string(), label: z.string() })),
    ])
    .optional(),
  required: z.boolean().optional(),
  name: z.string().optional(),
  rows: z.number().optional(),
});

export const FormArtifactZod = z.object({
  id: z.string(),
  type: z.literal("form"),
  data: z.object({
    title: z.string(),
    fields: z.array(FormFieldZod),
  }),
});

export type FormArtifact = z.infer<typeof FormArtifactZod>;
export type FormField = z.infer<typeof FormFieldZod>;

export const ArtifactTabZod = z.discriminatedUnion("type", [FormArtifactZod]);
export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
