export const TIMELINE_DESCRIPTION =
  `Use timelines to show chronological sequences of events, processes, or project milestones. Best for project tracking, historical overviews, process workflows, and status updates. Supports different status types (completed, pending, error, warning, in_progress, input_required) with visual indicators.

Order items chronologically with most recent first unless showing a planned sequence. Use descriptive titles and brief descriptions for each item. Choose appropriate status types: 'completed' for finished tasks, 'pending' for upcoming items, 'in_progress' for active work, 'error' for failures, 'warning' for issues, 'input_required' for blocked items.

Keep item titles concise (3-8 words) but descriptive. Use timeAgo format for relative times ("2 hours ago", "yesterday") or specific timestamps for precision. Limit to 8-12 items for optimal visual clarity. Group related activities under logical phases or categories.

Don't mix different time scales without clear indication (don't show minutes and years in same timeline). Avoid overly technical titles that users won't understand. Don't use error status for minor issues - reserve for actual failures. Avoid extremely long descriptions that overwhelm the timeline view. Don't show future items with past tense descriptions.` as const;
