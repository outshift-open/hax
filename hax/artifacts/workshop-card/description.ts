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

export const WORKSHOP_CARD_DESCRIPTION =
  `Use this action to display an event or workshop card with rich details including title, description, date, time, location, attendees, and action buttons. Best for presenting scheduled events, workshops, webinars, meetings, and conferences in a visually appealing card format.

This component is ideal for:
- Displaying upcoming events or workshops
- Showing meeting invitations with RSVP options
- Presenting webinar or conference details
- Calendar event summaries with attendee information

Include a clear, descriptive title and relevant event details. Use appropriate status values ('confirmed', 'pending', 'cancelled') to indicate event status. Provide date and time in human-readable formats. Include attendee information when relevant to show social proof or team participation.

Event types should be descriptive: 'Online Event', 'Workshop', 'Webinar', 'Conference', 'Team Meeting', 'Training Session', etc. Location can be a physical address or virtual meeting platform name.

Don't create workshop cards for simple text information that doesn't involve scheduled events. Avoid using this for general content display - use it specifically for event-related information with dates, times, and actionable elements.` as const;
