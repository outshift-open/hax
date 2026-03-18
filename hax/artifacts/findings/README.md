# Findings Artifact

A HAX SDK component for displaying key insights, recommendations, or discoveries with their supporting sources.

## Installation

### Via HAX CLI (Recommended)

First, ensure your project is initialized with HAX:

```bash
hax init
```

Then add the findings artifact:

```bash
hax add artifact findings
```

This will automatically:
- Install the component files to your configured artifacts path
- Install required dependencies
- Update your `hax.config.json`

### Dependencies

The following dependencies will be installed automatically:

```bash
npm install react clsx tailwind-merge zod @copilotkit/react-core
```

## Usage

### Basic Component Usage

```tsx
import { FindingsPanel, Finding } from "@/artifacts/findings";

const findings: Finding[] = [
  {
    id: "1",
    title: "Security Vulnerability Detected",
    description: "SQL injection vulnerability found in user input handling",
    sources: [
      { label: "OWASP", href: "https://owasp.org" },
      { label: "CVE-2024-1234" },
    ],
  },
  {
    id: "2",
    title: "Performance Optimization",
    description: "Database queries can be optimized with proper indexing",
    sources: [{ label: "Analysis Report" }],
  },
];

function App() {
  return (
    <FindingsPanel
      title="Security Audit Results"
      findings={findings}
      sourcesLabel="References:"
      maxVisibleSources={3}
    />
  );
}
```

### With CopilotKit Action

```tsx
import { useFindingsAction } from "@/artifacts/findings";

function MyComponent() {
  const addOrUpdateArtifact = (type, data) => {
    // Handle artifact creation/update
    console.log("Artifact:", type, data);
  };

  // Register the action with CopilotKit
  useFindingsAction({ addOrUpdateArtifact });

  return <div>Your component</div>;
}
```

### HAX Wrapper Component

```tsx
import { HAXFindings, Finding } from "@/artifacts/findings";

const findings: Finding[] = [
  {
    id: "1",
    title: "Finding Title",
    description: "Finding description",
    sources: [{ label: "Source 1" }],
  },
];

function App() {
  return (
    <HAXFindings
      title="Panel Title"
      findings={findings}
    />
  );
}
```

## Components

### FindingsPanel

Main container component for displaying multiple findings.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Header title for the panel |
| `findings` | `Finding[]` | Yes | - | Array of findings to display |
| `sourcesLabel` | `string` | No | `"Sources:"` | Custom label for sources section |
| `maxVisibleSources` | `number` | No | `2` | Max source chips before showing "+N" |
| `className` | `string` | No | - | Additional CSS classes |

### FindingsCard

Individual finding card component.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Title text displayed in bold |
| `description` | `string` | Yes | - | Description text below the title |
| `sources` | `string[]` | No | `[]` | Array of source labels |
| `showSources` | `boolean` | No | `true` | Whether to show sources section |
| `sourcesLabel` | `string` | No | `"Sources:"` | Custom sources label |
| `maxVisibleSources` | `number` | No | - | Max chips before overflow |

### SourceChips

Displays a row of source chips with overflow handling.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `sources` | `string[]` | Yes | - | Array of source labels |
| `label` | `string` | No | `"Sources:"` | Label shown before chips |
| `maxVisible` | `number` | No | - | Max chips before "+N" |
| `maxChipWidth` | `number \| string` | No | - | Max width for individual chips |

### SourceChip

Individual source chip component.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Text label to display |
| `maxWidth` | `number \| string` | No | - | Max width (truncates with ellipsis) |
| `isCountChip` | `boolean` | No | `false` | Whether this is a "+N" count chip |
| `truncate` | `boolean` | No | `false` | Allow chip to shrink and truncate |

## Schema

### Finding Type

```typescript
interface Finding {
  id: string;           // Unique identifier
  title: string;        // Title of the finding
  description: string;  // Description/recommendation
  sources?: Array<{     // Optional source references
    label: string;      // Display label
    href?: string;      // Optional link URL
  }>;
}
```

### Zod Schema

```typescript
import { FindingsArtifactZod } from "@/artifacts/findings";

// Schema structure:
const FindingsArtifactZod = z.object({
  id: z.string(),
  type: z.literal("findings"),
  data: z.object({
    title: z.string(),
    findings: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      sources: z.array(z.object({
        label: z.string(),
        href: z.string().optional(),
      })).optional(),
    })),
    sourcesLabel: z.string().optional(),
    maxVisibleSources: z.number().optional(),
  }),
});
```

## CopilotKit Action

The `useFindingsAction` hook registers a `create_findings` action with CopilotKit.

### Action Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | `string` | Yes | Header title for the findings panel |
| `findingsJson` | `string` | Yes | JSON string of findings array |
| `sourcesLabel` | `string` | No | Custom label for sources (default: "Sources:") |
| `maxVisibleSources` | `number` | No | Max source chips before "+N" (default: 2) |

### findingsJson Format

```json
[
  {
    "id": "unique-id-1",
    "title": "Finding Title",
    "description": "Detailed description of the finding",
    "sources": [
      { "label": "Source Name", "href": "https://example.com" },
      { "label": "Another Source" }
    ]
  }
]
```

## Best Practices

- Keep finding titles concise and actionable (under 10 words)
- Provide clear, specific descriptions that explain the finding's significance
- Include relevant sources to build credibility and enable follow-up
- Limit to 3-7 findings per panel to maintain readability
- Use consistent source labeling conventions

## When to Use

Use findings artifacts for:
- Research summaries
- Analysis results
- Audit findings
- Security assessments
- Any situation where users need to see multiple findings with source attribution

Avoid using findings for:
- Simple lists without context
- Single-item displays
- Overly long descriptions (break into separate findings instead)

## Exports

```typescript
// Components
export { HAXFindings, FindingsPanel, FindingsCard, SourceChips, SourceChip }

// Types
export type { Finding, FindingsPanelProps, FindingsCardProps, SourceChipsProps, SourceChipProps }

// Action Hook
export { useFindingsAction }

// Schema
export { FindingsArtifactZod }
export type { FindingsArtifact }
```

## License

Apache License 2.0 - Copyright 2025 Cisco Systems, Inc. and its affiliates
