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
import { ArtifactTab, TIMELINE_STATUSES, TimelineItem } from "./types";
import { TIMELINE_DESCRIPTION } from "./description";

interface UseTimelineActionProps {
  addOrUpdateArtifact: (
    type: "timeline",
    data: Extract<ArtifactTab, { type: "timeline" }>["data"]
  ) => void;
  artifacts: ArtifactTab[];
}

export const useTimelineAction = ({
  addOrUpdateArtifact,
  artifacts,
}: UseTimelineActionProps) => {
  useCopilotAction({
    name: "create_timeline",
    description: TIMELINE_DESCRIPTION,
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Timeline title",
        required: true,
      },
      {
        name: "itemsJson",
        type: "string",
        description:
          "JSON array of timeline items with {id?, title, description?, status?, timeAgo?}. Use timeAgo like '5 minutes ago', '1 hour ago', 'just now', etc.",
        required: true,
      },
    ],
    handler: async (args) => {
      try {
        const { title, itemsJson } = args;

        if (!itemsJson.trim()) {
          throw new Error("itemsJson is empty");
        }

        let items;
        try {
          items = JSON.parse(itemsJson);
        } catch (error) {
          throw new Error(
            `Invalid items JSON format: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }

        if (!Array.isArray(items)) {
          throw new Error("Items must be an array");
        }

        const validStatuses = TIMELINE_STATUSES;

        const processedItems = items.map((item: Partial<TimelineItem>) => {
          const status =
            item.status && validStatuses.includes(item.status)
              ? item.status
              : "completed";

          return {
            id: item.id || crypto.randomUUID(),
            title: item.title || "Untitled Activity",
            description: item.description,
            timestamp: Date.now(),
            timeAgo: item.timeAgo || "just now",
            status: status,
          };
        });

        addOrUpdateArtifact("timeline", { title, items: processedItems });

        return `Updated timeline "${title}" with ${processedItems.length} activities`;
      } catch (error) {
        console.error("Error in create_timeline handler:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return `Failed to create timeline: ${errorMessage}`;
      }
    },
  });

  useCopilotAction({
    name: "update_timeline",
    description:
      "Add new activity to existing timeline (use this to track ALL ongoing actions regardless of success or failure). Ensure every action taken is logged in the activity timeline, including successful, failed, attempted, or input-required actions, to maintain a comprehensive record of all operations.",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Timeline title (only used when creating a new timeline)",
        required: true,
      },
      {
        name: "activity",
        type: "string",
        description:
          "JSON object with {title, description?, status?, timeAgo?}",
        required: true,
      },
    ],
    handler: async (args) => {
      try {
        const { title, activity } = args;

        if (!activity.trim()) {
          throw new Error("activity is empty");
        }

        let newActivity;
        try {
          newActivity = JSON.parse(activity);
        } catch (error) {
          throw new Error(
            `Invalid activity JSON format: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }

        const validStatuses = TIMELINE_STATUSES;

        const processedActivity = {
          id: crypto.randomUUID(),
          title: newActivity.title || "Untitled Activity",
          description: newActivity.description,
          timestamp: Date.now(),
          timeAgo: newActivity.timeAgo || "just now",
          status: validStatuses.includes(newActivity.status)
            ? newActivity.status
            : "completed",
        };

        const existingTimeline = artifacts.find((a) => a.type === "timeline");

        if (existingTimeline) {
          const updatedItems = [
            ...existingTimeline.data.items,
            processedActivity,
          ];
          addOrUpdateArtifact("timeline", {
            title: existingTimeline.data.title,
            items: updatedItems,
          });
          return `Added "${processedActivity.title}" to timeline`;
        } else {
          addOrUpdateArtifact("timeline", {
            title,
            items: [processedActivity],
          });
          return `Created new timeline "${title}" with "${processedActivity.title}"`;
        }
      } catch (error) {
        console.error("Error in update_timeline handler:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return `Failed to update timeline: ${errorMessage}`;
      }
    },
  });
};

export default useTimelineAction;
