# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Next.js)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Architecture

This is a Next.js 16 app (App Router) that generates murder mystery games using AI agents. The UI uses a Film Noir theme with shadcn/ui components and Tailwind CSS.

### Agent Pipeline

The system uses 7 specialized AI agents orchestrated sequentially:

**Generation Agents** (run in order):
1. Story Architect → creates victim, setting, murder method, solution
2. Character Designer → creates 23 suspects across 3 tiers with motives/alibis
3. Evidence Crafter → creates evidence items, assigns to phases and detectives

**Validation Agents** (run in parallel after generation):
4. Timeline Auditor → validates temporal consistency
5. Evidence Validator → validates evidence chain integrity
6. Motive Analyzer → validates killer paths are feasible
7. Twist Fairness → ensures mystery is solvable without hindsight

### Key Types

Core types are in `src/lib/types/index.ts`:
- `MysteryProject` - main project container with suspects, evidence, timeline, phases
- `Suspect` - has tier (1-3), motive with strength, alibi, isKiller/isRedHerring flags
- `Evidence` - has phase (1-3), detective assignment (1-5), bottleId for swap mechanics
- `TimelineEvent` - events with participants, alibi tracking, related evidence

### State Management

- Zustand for project and generation state
- Local filesystem storage (JSON + Markdown in `data/projects/`)

### Generated Output

Each mystery produces 7 markdown files:
- `00_GAME_MASTER_BLUEPRINT.md` - complete solution (host only)
- `01_CASE_BRIEF.md` - introduction (all players)
- `02_PHASE_1_EVIDENCE.md` - initial clues
- `03_PHASE_2_EVIDENCE.md` - deeper investigation
- `04_PHASE_3_TWIST.md` - major revelation
- `05_HOST_MATERIALS.md` - scoring & answers
- `06_APPENDIX_PERSONS.md` - background info

### Routes

- `/` - Dashboard with project grid
- `/projects/new` - Multi-step wizard (theme → scale → murder method → characters → generate)
- `/projects/[id]` - Project overview with validation panel
- `/projects/[id]/suspects` - Drag-drop suspect manager with tier columns
- `/projects/[id]/evidence` - Evidence manager with phase assignment
- `/projects/[id]/timeline` - Visual timeline editor
- `/projects/[id]/export` - Generate markdown/PDF exports

## Agent Implementation

### How Agents Access Claude

The agents use the Anthropic SDK (`@anthropic-ai/sdk`) to call Claude's API:

```
src/lib/agents/
├── base.ts              # Core agent utilities, API client, retry logic
├── orchestrator.ts      # Coordinates all agents, SSE streaming
├── story-architect.ts   # Story generation agent
├── character-designer.ts # Character generation agent
├── evidence-crafter.ts  # Evidence generation agent
└── validators.ts        # 4 validation agents
```

**Flow:**
1. Frontend POSTs to `/api/projects/generate` with settings
2. API route creates SSE stream and calls `generateMystery()` orchestrator
3. Orchestrator runs agents sequentially, yielding progress events
4. Each agent calls Claude via `runAgentWithRetry()` in base.ts
5. Progress streams back to frontend in real-time
6. Completed project saved to `data/projects/[id]/`

### System Prompts

Agent prompts are in `prompts/` directory:
- `story-architect.md` - Creates narrative foundation
- `character-designer.md` - Creates 23 suspects
- `evidence-crafter.md` - Creates evidence chain
- `timeline-auditor.md` - Validates timeline
- `evidence-validator.md` - Validates evidence
- `motive-analyzer.md` - Validates motives
- `twist-fairness.md` - Validates solvability

### API Routes

```
/api/projects/generate  # POST - SSE stream for generation
/api/projects          # GET - List all projects
/api/projects/[id]     # GET/PATCH/DELETE - Project CRUD
/api/projects/validate # POST - Re-validate a project
```

### Environment

Requires `ANTHROPIC_API_KEY` in `.env.local`. Copy from `.env.example`.
