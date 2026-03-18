# Diagnostic Report Component

A structured diagnostic report component for presenting troubleshooting findings with confidence levels and actionable recommendations.

## Installation

Install the component using the HAX SDK CLI:

```bash
hax init
hax add artifact diagnostic-report
```

This will install the component along with its required dependencies:
- `@copilotkit/react-core`
- `zod`

## Usage

### Basic Usage

```tsx
import {
  HAXDiagnosticReport,
  DiagnosticItem,
} from "@/artifacts/diagnostic-report"

const items: DiagnosticItem[] = [
  {
    id: "1",
    suspectedCause: "Memory leak in worker process",
    confidence: 85,
    confidenceLevel: "high",
    rationale: "Memory usage increases linearly over time without recovery",
    recommendedAction: "Restart worker process",
  },
  {
    id: "2",
    suspectedCause: "Database connection pool exhausted",
    confidence: 45,
    confidenceLevel: "medium",
    rationale: "Connection wait times have increased significantly",
    recommendedAction: "Increase pool size",
  },
]

function App() {
  const handleAction = (itemId: string) => {
    console.log(`Action clicked for item: ${itemId}`)
  }

  return (
    <HAXDiagnosticReport
      title="System Health Analysis"
      items={items}
      onActionClick={handleAction}
    />
  )
}
```

### Using Individual Components

```tsx
import {
  DiagnosticReportCard,
  DiagnosticValueCard,
  DiagnosticTableHeader,
  ConfidenceValue,
} from "@/artifacts/diagnostic-report"

// Use DiagnosticReportCard for the full report
<DiagnosticReportCard
  title="API Performance Issues"
  items={items}
  onActionClick={handleAction}
/>

// Use individual components for custom layouts
<DiagnosticTableHeader
  showSuspectedCause={true}
  showConfidence={true}
  showRationale={true}
  showRecommendedAction={true}
/>

<DiagnosticValueCard
  suspectedCause="High CPU usage"
  confidence={72}
  confidenceLevel="high"
  rationale="CPU consistently above 90%"
  recommendedAction="Scale horizontally"
  onActionClick={() => console.log("Action clicked")}
/>

<ConfidenceValue value={72} level="high" />
```

### CopilotKit Integration

Use the `useDiagnosticReportAction` hook to enable AI agents to create diagnostic reports:

```tsx
import { useDiagnosticReportAction } from "@/artifacts/diagnostic-report"

function MyComponent() {
  const addOrUpdateArtifact = (type, data) => {
    // Handle the artifact creation/update
    console.log("Artifact:", type, data)
  }

  useDiagnosticReportAction({ addOrUpdateArtifact })

  return <div>...</div>
}
```

## Schema

### DiagnosticItem

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the diagnostic item |
| `suspectedCause` | `string` | Description of the potential cause |
| `confidence` | `number` | Confidence percentage (0-100) |
| `confidenceLevel` | `"high" \| "medium" \| "low"` | Categorical confidence level |
| `rationale` | `string` | Explanation supporting the assessment |
| `recommendedAction` | `string` | Actionable next step |

### DiagnosticReportArtifact

```typescript
{
  id: string
  type: "diagnostic-report"
  data: {
    title?: string
    items: DiagnosticItem[]
  }
}
```

### Confidence Level Mapping

| Level | Color | Range | Description |
|-------|-------|-------|-------------|
| `high` | Green (#2ca02c) | 70-100% | Strong evidence supports this cause |
| `medium` | Orange (#ff7f0e) | 40-69% | Moderate evidence, needs investigation |
| `low` | Yellow (#facc15) | 0-39% | Possible but requires validation |

## Actions

### create_diagnostic_report

CopilotKit action for AI agents to create diagnostic reports.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | `string` | No | Title for the diagnostic report card |
| `itemsJson` | `string` | Yes | JSON string of diagnostic items array |

**Example Action Call:**

```json
{
  "name": "create_diagnostic_report",
  "parameters": {
    "title": "Network Connectivity Analysis",
    "itemsJson": "[{\"id\":\"1\",\"suspectedCause\":\"DNS resolution failure\",\"confidence\":90,\"confidenceLevel\":\"high\",\"rationale\":\"DNS queries timing out consistently\",\"recommendedAction\":\"Check DNS server\"}]"
  }
}
```

## Component Props

### HAXDiagnosticReport / DiagnosticReportCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Diagnostic Report With Actionables"` | Report title |
| `items` | `DiagnosticItem[]` | - | Array of diagnostic items |
| `onActionClick` | `(itemId: string) => void` | - | Callback when action button is clicked |
| `className` | `string` | - | Additional CSS classes |

### DiagnosticValueCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `suspectedCause` | `string` | - | The suspected cause text |
| `confidence` | `number` | - | Confidence percentage (0-100) |
| `confidenceLevel` | `ConfidenceLevel` | - | Level: "high", "medium", or "low" |
| `rationale` | `string` | - | Explanation text |
| `recommendedAction` | `string` | - | Action button text |
| `onActionClick` | `() => void` | - | Action button callback |

### DiagnosticTableHeader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showSuspectedCause` | `boolean` | `true` | Show suspected cause column |
| `showConfidence` | `boolean` | `true` | Show confidence column |
| `showRationale` | `boolean` | `true` | Show rationale column |
| `showRecommendedAction` | `boolean` | `true` | Show recommended action column |

### ConfidenceValue

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Confidence percentage (0-100) |
| `level` | `ConfidenceLevel` | - | Level: "high", "medium", or "low" |

## Exports

```typescript
// Components
export { HAXDiagnosticReport }
export { DiagnosticReportCard }
export { DiagnosticValueCard }
export { DiagnosticTableHeader }
export { ConfidenceValue }

// Hook
export { useDiagnosticReportAction }

// Types
export type { DiagnosticItem }
export type { DiagnosticReportCardProps }
export type { DiagnosticValueCardProps }
export type { DiagnosticTableHeaderProps }
export type { ConfidenceValueProps }
export type { ConfidenceLevel }
export type { DiagnosticReportArtifact }

// Zod Schema
export { DiagnosticReportArtifactZod }
```

## Best Practices

- **Order by confidence**: Display items with highest confidence first to prioritize investigation
- **Be specific**: Keep suspected cause text concise and specific
- **Provide rationale**: Always include clear rationale connecting evidence to the suspected cause
- **Actionable recommendations**: Make recommended actions specific and actionable
- **Limit items**: Keep to 3-5 diagnostic items to avoid overwhelming users

## When to Use

- Troubleshooting results
- Root cause analysis
- System health assessments
- Any situation requiring potential causes ranked by confidence with actions

## When NOT to Use

- Simple status updates
- Single-cause issues
- Vague or generic suspected causes
- Items without supporting rationale
