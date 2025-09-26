import { z } from "zod";

export const TIMELINE_STATUSES = [
  "completed",
  "pending",
  "error",
  "warning",
  "in_progress",
  "input_required",
] as const;

export const TimelineItemZod = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  timeAgo: z.string().optional(),
  timestamp: z.number().optional(),
  status: z.enum(TIMELINE_STATUSES).default("completed"),
});

export const TimelineDataZod = z.object({
  title: z.string(),
  items: z.array(TimelineItemZod),
});

export const TimelineArtifactZod = z.object({
  id: z.string(),
  type: z.literal("timeline"),
  data: TimelineDataZod,
});

export type TimelineItem = z.infer<typeof TimelineItemZod>;
export type TimelineData = z.infer<typeof TimelineDataZod>;
export type TimelineArtifact = z.infer<typeof TimelineArtifactZod>;

export const ArtifactTabZod = z.discriminatedUnion("type", [
  TimelineArtifactZod,
]);
export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
