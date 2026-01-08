# Workshop Card Artifact

A rich event/workshop card component for displaying scheduled events, meetings, webinars, and workshops with attendee information and action buttons.

## Installation

Install the workshop card artifact using the HAX CLI:

```bash
npx hax add artifact workshop-card
```

Or if you have HAX SDK installed globally:

```bash
hax add artifact workshop-card
```

## Dependencies

This artifact requires the following peer dependencies:

- `@copilotkit/react-core` - For the action hook
- `lucide-react` - For icons
- `zod` - For schema validation
- `class-variance-authority` - For button variants

All required UI components (Button, Badge, Avatar) are included locally and will be installed automatically with the artifact.

## Usage

### 1. Import the components

```tsx
import {
  HAXWorkshopCard,
  useWorkshopCardAction,
  WorkshopCardArtifactZod,
} from "@hax/artifacts/workshop-card";
```

### 2. Register the action hook

In your main app or artifact provider component:

```tsx
import { useWorkshopCardAction } from "@hax/artifacts/workshop-card";

function ArtifactProvider({ children }) {
  const [artifacts, setArtifacts] = useState([]);

  const addOrUpdateArtifact = (type, data) => {
    const newArtifact = {
      id: `${type}-${Date.now()}`,
      type,
      data,
    };
    setArtifacts((prev) => [...prev, newArtifact]);
  };

  // Register the workshop card action
  useWorkshopCardAction({ addOrUpdateArtifact });

  return <>{children}</>;
}
```

### 3. Render the component

```tsx
import { HAXWorkshopCard } from "@hax/artifacts/workshop-card";

function WorkshopCardArtifact({ data }) {
  return (
    <HAXWorkshopCard
      {...data}
      onJoin={() => console.log("Joined!")}
      onDecline={() => console.log("Declined")}
      onMaybe={() => console.log("Maybe")}
      onAddToCalendar={() => console.log("Added to calendar")}
    />
  );
}
```

## Schema

The workshop card uses the following Zod schema for validation:

```typescript
import { z } from "zod";

const AttendeeZod = z.object({
  id: z.string().optional(),
  name: z.string(),
  avatarUrl: z.string().optional(),
});

const WorkshopCardArgsZod = z.object({
  title: z.string(),
  description: z.string().optional(),
  eventType: z.string().optional().default("Online Event"),
  status: z.enum(["confirmed", "pending", "cancelled"]).optional().default("confirmed"),
  date: z.string().optional(),
  time: z.string().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  attendeeCount: z.number().optional().default(0),
  attendees: z.array(AttendeeZod).optional().default([]),
  maxDisplayedAttendees: z.number().optional().default(3),
  showJoinButton: z.boolean().optional().default(true),
  showDeclineButton: z.boolean().optional().default(true),
  showMaybeButton: z.boolean().optional().default(true),
});
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **required** | The title of the workshop/event |
| `description` | `string` | `undefined` | A brief description of the event |
| `eventType` | `string` | `"Online Event"` | Type of event (e.g., 'Workshop', 'Webinar') |
| `status` | `"confirmed" \| "pending" \| "cancelled"` | `"confirmed"` | Current status of the event |
| `date` | `string` | `undefined` | The date of the event |
| `time` | `string` | `undefined` | The time of the event |
| `duration` | `string` | `undefined` | Duration of the event |
| `location` | `string` | `undefined` | Location or platform name |
| `attendeeCount` | `number` | `0` | Total number of attendees |
| `attendees` | `Attendee[]` | `[]` | List of attendees for avatar stack |
| `maxDisplayedAttendees` | `number` | `3` | Max avatars to display |
| `showJoinButton` | `boolean` | `true` | Show the Join Event button |
| `showDeclineButton` | `boolean` | `true` | Show the Decline button |
| `showMaybeButton` | `boolean` | `true` | Show the Maybe button |
| `onJoin` | `() => void` | `undefined` | Callback when Join is clicked |
| `onDecline` | `() => void` | `undefined` | Callback when Decline is clicked |
| `onMaybe` | `() => void` | `undefined` | Callback when Maybe is clicked |
| `onAddToCalendar` | `() => void` | `undefined` | Callback for add to calendar |

## Action

The `useWorkshopCardAction` hook registers a CopilotKit action named `show_workshop_card` that allows the AI to display workshop cards.

### Action Name

`show_workshop_card`

### Action Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | `string` | Yes | Event title |
| `description` | `string` | No | Event description |
| `eventType` | `string` | No | Type of event |
| `status` | `string` | No | Event status |
| `date` | `string` | No | Event date |
| `time` | `string` | No | Event time |
| `duration` | `string` | No | Event duration |
| `location` | `string` | No | Event location/platform |
| `attendeeCount` | `number` | No | Number of attendees |
| `attendees` | `object[]` | No | Attendee list |
| `showJoinButton` | `boolean` | No | Show join button |
| `showDeclineButton` | `boolean` | No | Show decline button |
| `showMaybeButton` | `boolean` | No | Show maybe button |

## Example

```tsx
<HAXWorkshopCard
  title="Introduction to React Hooks"
  description="Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks."
  eventType="Workshop"
  status="confirmed"
  date="Tuesday, January 21, 2025"
  time="10:00 AM - 12:00 PM PST"
  duration="2 hours"
  location="Zoom Meeting"
  attendeeCount={24}
  attendees={[
    { id: "1", name: "John Doe", avatarUrl: "https://example.com/avatar1.jpg" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
  ]}
  onJoin={() => window.open("https://zoom.us/j/123456789")}
  onDecline={() => alert("You declined the invitation")}
  onAddToCalendar={() => {
    // Add to calendar logic
  }}
/>
```

## Exported Components

- `HAXWorkshopCard` - Main workshop card component
- `EventDetailItem` - Individual detail row component
- `AvatarStack` - Attendee avatar stack component
- `StatusBadge` - Status badge component
- `ActionButton` - Action button component
- `defaultStatusConfigs` - Default status configurations

