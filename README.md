# X-Ray Dashboard

An **X-Ray library and dashboard** for debugging non-deterministic, multi-step algorithmic systems. Unlike traditional tracing which answers "what happened?", X-Ray answers **"why did the system make this decision?"**

![X-Ray Dashboard](public/screenshot.png)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
open http://localhost:3000
```

Click **"Run Demo"** to execute a sample competitor selection pipeline and explore the X-Ray visualization.

---

## 📐 Architecture

### X-Ray Library (`src/lib/xray/`)

A lightweight, general-purpose SDK for capturing decision context:

```typescript
import { createSession, runStep, setReasoning, addEvaluation, completeSession } from '@/lib/xray';

// Create a session
const session = createSession("my-pipeline", { metadata: "value" });

// Run a step with full context capture
const result = await runStep(session, "filter-step", "filter", inputData, async (step) => {
  // Your logic here
  setReasoning(step, "Explain why decisions were made");
  addEvaluation(step, { id: "item-1", label: "Item Name", passed: true, criteria: [...] });
  return output;
});

completeSession(session);
```

### Key Types

| Type | Purpose |
|------|---------|
| `XraySession` | Container for an execution trace with metadata and steps |
| `XrayStep` | Individual pipeline step with inputs, outputs, reasoning |
| `Evaluation` | Per-item evaluation with pass/fail status |
| `CriteriaResult` | Specific criteria with expected vs actual values |

### Step Types

The library supports these step types out of the box:
- `llm` - LLM/AI model calls
- `search` - Search/retrieval operations
- `filter` - Filtering/narrowing candidates
- `transform` - Data transformations
- `rank` - Ranking/scoring operations
- `custom` - Any other step type

---

## 🎯 Demo Pipeline

The included demo simulates a **Competitor Product Selection** system:

| Step | Type | Description |
|------|------|-------------|
| 1. Keyword Generation | `llm` | Extract search keywords from product title |
| 2. Candidate Search | `search` | Query API for matching products |
| 3. Apply Filters | `filter` | Price range, rating, review count filters |
| 4. LLM Relevance | `llm` | Remove false positives (accessories, parts) |
| 5. Rank & Select | `rank` | Score and select best competitor |

---

## 🖥️ Dashboard Features

- **Session List**: View all pipeline executions
- **Step Timeline**: Visual flow of pipeline steps with status indicators
- **Reasoning Panel**: Human-readable explanation of each decision
- **Evaluation Table**: Expandable pass/fail breakdown with criteria details
- **Input/Output Inspector**: Collapsible JSON views of step data

---



## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── demo/run/      # Run demo pipeline
│   │   └── sessions/      # Session CRUD
│   └── page.tsx           # Dashboard UI
├── components/
│   ├── ui/                # Radix UI primitives
│   └── xray/              # X-Ray specific components
│       ├── session-list.tsx
│       ├── step-timeline.tsx
│       ├── step-detail.tsx
│       └── evaluation-table.tsx
└── lib/
    ├── demo/              # Demo pipeline & mock data
    │   ├── pipeline.ts
    │   └── mock-data.ts
    └── xray/              # X-Ray library (SDK)
        ├── index.ts       # Public API
        ├── types.ts       # TypeScript interfaces
        ├── session.ts     # Session management
        └── store.ts       # In-memory storage
```

---



## 🔮 Future Improvements

- [ ] Persistent storage (PostgreSQL/MongoDB)
- [ ] Session search and filtering
- [ ] Diff view for comparing sessions
- [ ] Export to JSON/CSV
- [ ] Real-time WebSocket updates
- [ ] Step-level retry/replay
- [ ] Custom themes

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CRT theme
- **Components**: Radix UI primitives
- **Icons**: Lucide React


