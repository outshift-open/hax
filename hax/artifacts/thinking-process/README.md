# Thinking Process Artifact

A HAX SDK component for visualizing AI reasoning, decision-making steps, and workflow progress.

## Installation

### Via HAX CLI (Recommended)

First, ensure your project is initialized with HAX:

```bash
hax init
```

Then add the thinking-process artifact:

```bash
hax add artifact thinking-process
```

This will automatically:
- Install the component files to your configured artifacts path
- Install required dependencies
- Update your `hax.config.json`

### Dependencies

The following dependencies will be installed automatically:

```bash
npm install react clsx tailwind-merge zod @copilotkit/react-core lucide-react
```

## Usage

### Basic Component Usage

```tsx
import { ThinkingProcess, ReasoningStep } from "@/artifacts/thinking-process";

const steps: ReasoningStep[] = [
  {
    id: "1",
    title: "Analyzing input data",
    description: "Processing user query and context",
    status: "completed",
  },
  {
    id: "2",
    title: "Searching knowledge base",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Generating response",
    status: "pending",
  },
];

function App() {
  return (
    <ThinkingProcess
      title="AI Reasoning"
      badge="HAX 04"
      steps={steps}
      metrics={[
        { label: "Steps Completed", value: "1/3" },
        { label: "Confidence", value: "85%" },
      ]}
    />
  );
}
```

### With CopilotKit Action

```tsx
import { useThinkingProcessAction } from "@/artifacts/thinking-process";

function MyComponent() {
  const addOrUpdateArtifact = (type, data) => {
    // Handle artifact creation/update
    console.log("Artifact:", type, data);
  };

  // Register the action with CopilotKit
  useThinkingProcessAction({ addOrUpdateArtifact });

  return <div>Your component</div>;
}
```

### HAX Wrapper Component

```tsx
import { HAXThinkingProcess, ReasoningStep } from "@/artifacts/thinking-process";

const steps: ReasoningStep[] = [
  { id: "1", title: "Step 1", status: "completed" },
  { id: "2", title: "Step 2", status: "in-progress" },
];

function App() {
  return (
    <HAXThinkingProcess
      title="Processing"
      steps={steps}
    />
  );
}
```

## Components

### ThinkingProcess

Main card component displaying the complete thinking process.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | No | `"Thinking Process"` | Title for the card |
| `badge` | `string` | No | - | Badge text shown next to title |
| `steps` | `ReasoningStep[]` | Yes | - | Array of reasoning steps |
| `metrics` | `StepMetric[]` | No | `[]` | Step metrics to display |
| `showToggle` | `boolean` | No | `false` | Show reasoning process toggle |
| `toggleLabel` | `string` | No | `"Show reasoning process"` | Label for toggle |
| `showReasoning` | `boolean` | No | `true` | Whether reasoning is visible |
| `onToggleReasoning` | `(show: boolean) => void` | No | - | Toggle callback |
| `reasoningCollapsible` | `boolean` | No | `true` | Make reasoning section collapsible |
| `className` | `string` | No | - | Additional CSS classes |

### AgentReasoning

Collapsible section showing reasoning steps with purple theme.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | No | `"Agent Reasoning"` | Section title |
| `steps` | `ReasoningStep[]` | Yes | - | Array of reasoning steps |
| `expanded` | `boolean` | No | `true` | Whether section is expanded |
| `onExpandedChange` | `(expanded: boolean) => void` | No | - | Expand callback |
| `collapsible` | `boolean` | No | `true` | Show expand/collapse control |
| `className` | `string` | No | - | Additional CSS classes |

### ProcessStep

Individual step in the reasoning process.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Step title |
| `description` | `string` | No | - | Step description |
| `status` | `ProcessStepStatus` | No | `"pending"` | Step status |
| `showIcon` | `boolean` | No | `true` | Whether to show status icon |
| `flipIcon` | `boolean` | No | `false` | Position icon on right |
| `className` | `string` | No | - | Additional CSS classes |

### ConfidenceChip

Displays metrics with label and value badge.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | No | `"Steps Completed"` | Label text |
| `value` | `string` | Yes | - | Badge/value text |
| `variant` | `"default" \| "badge"` | No | `"badge"` | Variant style |
| `className` | `string` | No | - | Additional CSS classes |

## Schema

### ReasoningStep Type

```typescript
interface ReasoningStep {
  id: string;                    // Unique identifier
  title: string;                 // Step title
  description?: string;          // Optional description
  status: ProcessStepStatus;     // "completed" | "in-progress" | "pending" | "error"
}
```

### StepMetric Type

```typescript
interface StepMetric {
  label: string;  // Metric label (e.g., "Steps Completed")
  value: string;  // Metric value (e.g., "3/5")
}
```

### ProcessStepStatus

```typescript
type ProcessStepStatus = "completed" | "in-progress" | "pending" | "error";
```

Status visual indicators:
- `completed`: Green checkmark
- `in-progress`: Spinning loader
- `pending`: Gray circle
- `error`: Red X

### Zod Schema

```typescript
import { ThinkingProcessArtifactZod } from "@/artifacts/thinking-process";

// Schema structure:
const ThinkingProcessArtifactZod = z.object({
  id: z.string(),
  type: z.literal("thinking-process"),
  data: z.object({
    title: z.string().optional(),
    badge: z.string().optional(),
    steps: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      status: z.enum(["completed", "in-progress", "pending", "error"]),
    })),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
    showToggle: z.boolean().optional(),
    reasoningCollapsible: z.boolean().optional(),
  }),
});
```

## CopilotKit Action

The `useThinkingProcessAction` hook registers a `create_thinking_process` action with CopilotKit.

### Action Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | `string` | No | Title for the card (default: "Thinking Process") |
| `badge` | `string` | No | Badge text shown next to title |
| `stepsJson` | `string` | Yes | JSON string of reasoning steps array |
| `metricsJson` | `string` | No | JSON string of metrics array |
| `showToggle` | `boolean` | No | Show reasoning toggle (default: false) |
| `reasoningCollapsible` | `boolean` | No | Make reasoning collapsible (default: true) |

### stepsJson Format

```json
[
  {
    "id": "step-1",
    "title": "Analyzing data",
    "description": "Processing input parameters",
    "status": "completed"
  },
  {
    "id": "step-2",
    "title": "Running analysis",
    "status": "in-progress"
  }
]
```

### metricsJson Format

```json
[
  { "label": "Steps Completed", "value": "2/5" },
  { "label": "Confidence", "value": "85%" }
]
```

## Best Practices

- Use clear, action-oriented step titles (e.g., "Analyzing input data", "Validating results")
- Mark current step as "in-progress" to show active processing
- Include descriptions for complex steps that need explanation
- Use metrics to show overall progress (e.g., "Steps Completed: 3/5")
- Limit to 3-7 steps per process for readability

## When to Use

Use thinking process artifacts for:
- Multi-step AI analysis visualization
- Debugging and troubleshooting workflows
- Agent reasoning chains
- Decision-making process transparency
- Any situation where users need to understand how conclusions were reached

Avoid using thinking process for:
- Simple status updates
- Single-step operations
- When reasoning process isn't relevant to user understanding

## Exports

```typescript
// Components
export { HAXThinkingProcess, ThinkingProcess, AgentReasoning, ProcessStep, ConfidenceChip }

// Types
export type {
  ThinkingProcessProps,
  AgentReasoningProps,
  ProcessStepProps,
  ProcessStepStatus,
  ConfidenceChipProps,
  ConfidenceChipVariant,
  ReasoningStep,
  StepMetric,
}

// Action Hook
export { useThinkingProcessAction }

// Schema
export { ThinkingProcessArtifactZod }
export type { ThinkingProcessArtifact }
```

## License

Apache License 2.0 - Copyright 2025 Cisco Systems, Inc. and its affiliates
