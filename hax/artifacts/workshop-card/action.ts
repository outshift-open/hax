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

import { useCopilotAction } from "@copilotkit/react-core";
import { ArtifactTab } from "./types";
import { WORKSHOP_CARD_DESCRIPTION } from "./description";

interface UseWorkshopCardActionProps {
  addOrUpdateArtifact: (
    type: "workshopCard",
    data: Extract<ArtifactTab, { type: "workshopCard" }>["data"]
  ) => void;
}

export const useWorkshopCardAction = ({
  addOrUpdateArtifact,
}: UseWorkshopCardActionProps) => {
  useCopilotAction({
    name: "show_workshop_card",
    description: WORKSHOP_CARD_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the workshop or event",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "A brief description of the workshop or event",
        required: false,
      },
      {
        name: "eventType",
        type: "string",
        description: "Type of event (e.g., 'Online Event', 'Workshop', 'Webinar', 'Conference')",
        required: false,
        default: "Online Event",
      },
      {
        name: "status",
        type: "string",
        description: "Current status: 'confirmed', 'pending', or 'cancelled'",
        required: false,
        default: "confirmed",
      },
      {
        name: "date",
        type: "string",
        description: "The date of the event (e.g., 'Tuesday, January 15, 2025')",
        required: false,
      },
      {
        name: "time",
        type: "string",
        description: "The time of the event (e.g., '10:00 AM - 11:30 AM PST')",
        required: false,
      },
      {
        name: "duration",
        type: "string",
        description: "Duration of the event (e.g., '1.5 hours', '2 hours')",
        required: false,
      },
      {
        name: "location",
        type: "string",
        description: "Location or platform (e.g., 'Zoom Meeting', 'Google Meet', 'Microsoft Teams')",
        required: false,
      },
      {
        name: "attendeeCount",
        type: "number",
        description: "Total number of attendees",
        required: false,
        default: 0,
      },
      {
        name: "attendees",
        type: "object[]",
        description: "Array of attendees with id, name, and optional avatarUrl",
        required: false,
      },
      {
        name: "maxDisplayedAttendees",
        type: "number",
        description: "Maximum number of attendee avatars to display",
        required: false,
        default: 3,
      },
      {
        name: "showJoinButton",
        type: "boolean",
        description: "Whether to show the Join Event button",
        required: false,
        default: true,
      },
      {
        name: "showDeclineButton",
        type: "boolean",
        description: "Whether to show the Decline button",
        required: false,
        default: true,
      },
      {
        name: "showMaybeButton",
        type: "boolean",
        description: "Whether to show the Maybe button",
        required: false,
        default: true,
      },
    ],
    handler: async (args) => {
      const {
        title,
        description,
        eventType,
        status,
        date,
        time,
        duration,
        location,
        attendeeCount,
        attendees,
        maxDisplayedAttendees,
        showJoinButton,
        showDeclineButton,
        showMaybeButton,
      } = args;

      addOrUpdateArtifact("workshopCard", {
        title: title ?? "Untitled Event",
        description: description,
        eventType: eventType ?? "Online Event",
        status: (status as "confirmed" | "pending" | "cancelled") ?? "confirmed",
        date: date,
        time: time,
        duration: duration,
        location: location,
        attendeeCount: attendeeCount ?? 0,
        attendees: attendees ?? [],
        maxDisplayedAttendees: maxDisplayedAttendees ?? 3,
        showJoinButton: showJoinButton ?? true,
        showDeclineButton: showDeclineButton ?? true,
        showMaybeButton: showMaybeButton ?? true,
      });

      return `Displayed workshop card for "${title}"${date ? ` on ${date}` : ""}${location ? ` at ${location}` : ""}.`;
    },
  });
};
