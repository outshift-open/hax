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

import { z } from "zod";

export const AttendeeZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  avatarUrl: z.string().optional(),
});

export const WorkshopCardArgsZod = z.object({
  title: z.string().describe("The title of the workshop/event"),
  description: z.string().optional().describe("A brief description of the workshop/event"),
  eventType: z.string().optional().describe("Type of event (e.g., 'Online Event', 'Workshop', 'Webinar')"),
  status: z.enum(["confirmed", "pending", "cancelled"]).optional().describe("Current status of the event"),
  date: z.string().optional().describe("The date of the event (e.g., 'Tuesday, January 15, 2025')"),
  time: z.string().optional().describe("The time of the event (e.g., '10:00 AM - 11:30 AM PST')"),
  duration: z.string().optional().describe("Duration of the event (e.g., '1.5 hours')"),
  location: z.string().optional().describe("Location or platform (e.g., 'Zoom Meeting', 'Google Meet')"),
  attendeeCount: z.number().optional().describe("Total number of attendees"),
  attendees: z.array(AttendeeZod).optional().describe("List of attendees to display in avatar stack"),
  maxDisplayedAttendees: z.number().optional().describe("Maximum number of avatars to display"),
  showJoinButton: z.boolean().optional().describe("Whether to show the Join Event button"),
  showDeclineButton: z.boolean().optional().describe("Whether to show the Decline button"),
  showMaybeButton: z.boolean().optional().describe("Whether to show the Maybe button"),
});

export const WorkshopCardArtifactZod = z.object({
  id: z.string(),
  type: z.literal("workshopCard"),
  data: WorkshopCardArgsZod,
});

export type Attendee = z.infer<typeof AttendeeZod>;
export type WorkshopCardData = z.infer<typeof WorkshopCardArgsZod>;
export type WorkshopCardArtifact = z.infer<typeof WorkshopCardArtifactZod>;

export const ArtifactTabZod = z.discriminatedUnion("type", [
  WorkshopCardArtifactZod,
]);

export type ArtifactTab = z.infer<typeof ArtifactTabZod>;
