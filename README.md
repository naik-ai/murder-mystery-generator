# Murder Mystery Generator

A Next.js web application that generates complete murder mystery games using AI agents. Creates professional game packets with suspects, evidence, timelines, and solutions.

## Overview

This application transforms the manual process of creating murder mystery games into an automated, AI-driven workflow. Using Claude's Agent SDK, it orchestrates multiple specialized agents to generate, validate, and export complete game materials.

### Key Features

- **Full Auto-Generation**: AI generates complete mystery from minimal input
- **7 Specialized Agents**: 3 for generation, 4 for validation
- **Drag-Drop UI**: Visual editors for suspects, evidence, and timelines
- **Local Storage**: Projects saved as JSON + Markdown files
- **Claude Code Integration**: Same auth token, can trigger Claude Code from UI
- **PDF Export**: Generate print-ready game materials

## Architecture

```
                    ┌─────────────────────────┐
                    │    ORCHESTRATOR         │
                    │    (Main Coordinator)   │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Story         │     │ Character     │     │ Evidence      │
│ Architect     │────▶│ Designer      │────▶│ Crafter       │
└───────────────┘     └───────────────┘     └───────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────────┐
        │              VALIDATION PIPELINE              │
        │  Timeline | Evidence | Motive | Twist         │
        │  Auditor  | Validator| Analyzer| Fairness     │
        └───────────────────────────────────────────────┘
```

## Generated Output

Each mystery generates 7 documents:

| File | Purpose | Distribution |
|------|---------|--------------|
| `00_GAME_MASTER_BLUEPRINT.md` | Complete solution | Host only |
| `01_CASE_BRIEF.md` | Introduction | All players |
| `02_PHASE_1_EVIDENCE.md` | Initial clues | Per detective |
| `03_PHASE_2_EVIDENCE.md` | Deeper investigation | Per detective |
| `04_PHASE_3_TWIST.md` | Major revelation | All players |
| `05_HOST_MATERIALS.md` | Scoring & answers | Host only |
| `06_APPENDIX_PERSONS.md` | Background info | On request |

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| Drag-Drop | @dnd-kit/core |
| State | React Context + Zustand |
| API | Route Handlers + SSE |
| Storage | Local filesystem (JSON + MD) |
| PDF | md-to-pdf |
| AI | Claude API (Anthropic) |

## Documentation

- [Frontend Specification](docs/SPEC_FRONTEND.md)
- [Agent Architecture](docs/SPEC_AGENTS.md)
- [Claude Code Integration](docs/SPEC_CLAUDE_CODE.md)
- [Task List](docs/TASKS.md)

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY

# Run development server
npm run dev
```

## Project Structure

```
murder-mystery-generator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── projects/          # Project pages
│   │   └── layout.tsx
│   ├── components/            # React components
│   │   ├── editors/           # Drag-drop editors
│   │   └── generators/        # Generation UI
│   └── lib/                   # Core logic
│       ├── agents/            # AI agents
│       ├── storage/           # File management
│       └── types/             # TypeScript types
├── data/                      # Local storage
│   └── projects/              # Generated projects
├── prompts/                   # Agent system prompts
└── docs/                      # Specifications
```

## Token Usage Estimate

Based on generating "The Last Toast" mystery:

| Phase | Input | Output |
|-------|-------|--------|
| Story design | ~15K | ~25K |
| File generation | ~20K | ~45K |
| Refinement | ~40K | ~43K |
| Validation (4 agents) | ~80K | ~20K |
| **Total** | **~155K** | **~133K** |

**Cost**: ~$3-5 (Sonnet) or ~$15-20 (Opus)

## License

MIT
