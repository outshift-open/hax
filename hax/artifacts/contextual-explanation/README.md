# Contextual Explanation Component

A card component for displaying contextual explanations about system changes, agent decisions, or automated actions with supporting details and action buttons.

## Installation

Install the component using the HAX SDK CLI:

```bash
hax init
hax add artifact contextual-explanation
```

This will install the component along with its required dependencies:
- `@copilotkit/react-core`
- `zod`

## Usage

### Basic Usage

```tsx
import {
  HAXContextualExplanation,
  ExplanationDetail,
} from "@/artifacts/contextual-explanation"

const details: ExplanationDetail[] = [
  {
    label: "Previous Configuration",
    value: "Load Balancer A",
    isBoldLabel: true,
  },
  {
    label: "New Configuration",
    value: "Load Balancer B",
    isBoldLabel: true,
  },
  {
    label: "Region",
    value: "us-west-2",
  },
  {
    label: "Timestamp",
    value: "2024-01-15",
    additionalInfo: "10:30 AM UTC",
  },
]

function App() {
  const handleApprove = () => {
    console.log("Change approved")
  }

  const handleDismiss = () => {
    console.log("Change dismissed")
  }

  return (
    <HAXContextualExplanation
      title="Routing Changes"
      alertTitle="Why this happened"
      alertDescription="Agent detected high latency and automatically rerouted traffic to optimize performance"
      details={details}
      primaryButtonLabel="Approve"
      secondaryButtonLabel="Dismiss"
      onPrimaryClick={handleApprove}
      onSecondaryClick={handleDismiss}
    />
  )
}
```

### Using the Card Component Directly

```tsx
import { ContextualExplanationCard } from "@/artifacts/contextual-explanation"

<ContextualExplanationCard
  title="System Update"
  alertTitle="Automated maintenance"
  alertDescription="Scheduled maintenance completed successfully"
  details={[
    { label: "Duration", value: "15 minutes" },
    { label: "Services affected", value: "API Gateway" },
    { label: "Status", value: "Completed", isBoldLabel: true },
  ]}
  primaryButtonLabel="Acknowledge"
  onPrimaryClick={() => console.log("Acknowledged")}
/>
```

### CopilotKit Integration

Use the `useContextualExplanationAction` hook to enable AI agents to create contextual explanations:

```tsx
import { useContextualExplanationAction } from "@/artifacts/contextual-explanation"

function MyComponent() {
  const addOrUpdateArtifact = (type, data) => {
    // Handle the artifact creation/update
    console.log("Artifact:", type, data)
  }

  useContextualExplanationAction({ addOrUpdateArtifact })

  return <div>...</div>
}
```

## Schema

### ExplanationDetail

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | Yes | Label for the detail row |
| `value` | `string` | Yes | Value/description for the detail row |
| `additionalInfo` | `string` | No | Optional additional info (e.g., timestamp) |
| `isSubItem` | `boolean` | No | Whether this is a sub-item (indented) |
| `isBoldLabel` | `boolean` | No | Whether the label should be bold |

### ContextualExplanationArtifact

```typescript
{
  id: string
  type: "contextual-explanation"
  data: {
    title?: string
    alertTitle?: string
    alertDescription?: string
    details: ExplanationDetail[]
    secondaryButtonLabel?: string
    primaryButtonLabel?: string
  }
}
```

## Actions

### create_contextual_explanation

CopilotKit action for AI agents to create contextual explanations.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | `string` | No | Title for the contextual explanation card |
| `alertTitle` | `string` | No | Title for the alert section |
| `alertDescription` | `string` | No | Detailed description of why the change occurred |
| `detailsJson` | `string` | Yes | JSON string of detail items array |
| `secondaryButtonLabel` | `string` | No | Label for the secondary action button |
| `primaryButtonLabel` | `string` | No | Label for the primary action button |

**Example Action Call:**

```json
{
  "name": "create_contextual_explanation",
  "parameters": {
    "title": "Configuration Change",
    "alertTitle": "Automatic optimization",
    "alertDescription": "System detected suboptimal settings and applied corrections",
    "detailsJson": "[{\"label\":\"Setting\",\"value\":\"Cache TTL\"},{\"label\":\"Previous\",\"value\":\"300s\"},{\"label\":\"New\",\"value\":\"600s\",\"isBoldLabel\":true}]",
    "primaryButtonLabel": "Approve",
    "secondaryButtonLabel": "Revert"
  }
}
```

## Component Props

### HAXContextualExplanation / ContextualExplanationCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Contextual Explanation"` | Card header title |
| `alertTitle` | `string` | `"Why this happened"` | Alert section title |
| `alertDescription` | `string` | - | Alert section description |
| `details` | `ExplanationDetail[]` | - | Array of detail items |
| `secondaryButtonLabel` | `string` | `"Dismiss"` | Secondary button text |
| `primaryButtonLabel` | `string` | `"Approve"` | Primary button text |
| `onSecondaryClick` | `() => void` | - | Secondary button callback |
| `onPrimaryClick` | `() => void` | - | Primary button callback |
| `className` | `string` | - | Additional CSS classes |

## Exports

```typescript
// Components
export { HAXContextualExplanation }
export { ContextualExplanationCard }

// Hook
export { useContextualExplanationAction }

// Types
export type { ContextualExplanationCardProps }
export type { ExplanationDetail }
export type { ContextualExplanationArtifact }

// Zod Schema
export { ContextualExplanationArtifactZod }
```

## Best Practices

- **Clear alert titles**: Summarize why something happened in the alert title
- **Detailed descriptions**: Use the alert description for additional context
- **Consistent labels**: Keep detail labels descriptive and consistent
- **Hierarchical info**: Use `isSubItem` for nested or related information
- **Emphasis**: Use `isBoldLabel` to highlight important details
- **Limit details**: Keep to 5-8 detail items for readability
- **Action-oriented buttons**: Make button labels clear and actionable

## When to Use

- Explaining automated system changes
- Displaying agent decision rationale
- Configuration change notifications
- Routing or traffic modifications
- Any situation requiring user acknowledgment with context

## When NOT to Use

- Simple notifications without details
- Single-line status messages
- Information that doesn't require user action
- Vague explanations without supporting details
