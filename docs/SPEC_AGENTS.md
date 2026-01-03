# Agent Architecture Specification

## Overview

The Murder Mystery Generator uses 7 specialized AI agents orchestrated by a central coordinator. Three agents handle generation, four handle validation.

---

## Agent Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     ORCHESTRATOR                             │
│                  (Central Coordinator)                       │
│                                                              │
│  Responsibilities:                                           │
│  - Manages agent lifecycle                                   │
│  - Handles inter-agent communication                         │
│  - Aggregates results                                        │
│  - Reports progress to UI                                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │   STORY    │  │ CHARACTER  │  │  EVIDENCE  │
    │ ARCHITECT  │  │  DESIGNER  │  │  CRAFTER   │
    └────────────┘  └────────────┘  └────────────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
                           ▼
    ┌─────────────────────────────────────────────────────────┐
    │                 VALIDATION PIPELINE                      │
    │                                                          │
    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
    │  │ TIMELINE │ │ EVIDENCE │ │  MOTIVE  │ │  TWIST   │   │
    │  │ AUDITOR  │ │ VALIDATOR│ │ ANALYZER │ │ FAIRNESS │   │
    │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
    └─────────────────────────────────────────────────────────┘
```

---

## Generation Agents

### 1. Story Architect Agent

**Purpose**: Creates the core narrative foundation

**Input**:
```typescript
interface StoryArchitectInput {
  theme: ThemeSettings;
  scale: ScaleSettings;
  murderMethod: MurderMethod;
  characterTypes: CharacterArchetypes;
}
```

**Output**:
```typescript
interface StoryArchitectOutput {
  victim: {
    name: string;
    age: number;
    occupation: string;
    netWorth: string;
    description: string;
    relationships: string[];
  };
  setting: {
    location: string;
    occasion: string;
    guestCount: number;
    dateTime: string;
  };
  murderMethod: {
    stages: MurderStage[];
    cause: string;
    keyMystery: string;
    centralMechanic: string;
  };
  solution: {
    killers: { name: string; role: 'mastermind' | 'executor' }[];
    motive: string;
    howItWasDone: string;
    howToSolve: string[];
  };
}
```

**System Prompt** (`prompts/story-architect.md`):
```markdown
# Story Architect Agent

You are a master mystery story architect. Your role is to create the
foundational narrative for a murder mystery game.

## Your Task
Create a compelling murder mystery foundation that:
1. Has a clear victim with interesting backstory
2. Uses a clever murder mechanism with multiple stages
3. Includes a central mystery mechanic (like a bottle ID mismatch)
4. Has 2 killers: a mastermind and an executor
5. Is solvable with planted clues

## Output Format
Provide structured JSON matching the StoryArchitectOutput interface.

## Constraints
- The murder must be solvable by deduction
- There must be a "aha moment" when players realize the twist
- The solution must require collaboration between detectives
- Red herrings should mislead but not block the solution
```

---

### 2. Character Designer Agent

**Purpose**: Creates all suspects with profiles, motives, and alibis

**Input**:
```typescript
interface CharacterDesignerInput {
  storyFoundation: StoryArchitectOutput;
  suspectCount: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
}
```

**Output**:
```typescript
interface CharacterDesignerOutput {
  suspects: Suspect[];
  relationships: Relationship[];
  redHerringSuspects: string[];  // IDs of strongest red herrings
}
```

**System Prompt** (`prompts/character-designer.md`):
```markdown
# Character Designer Agent

You create the full cast of suspects for a murder mystery game.

## Your Task
Create 23 suspects organized into tiers:
- Tier 1 (7): Core suspects with full profiles and evidence
- Tier 2 (6): Secondary suspects with medium profiles
- Tier 3 (10): Background characters with minimal profiles

## For Each Suspect
- Name, age, role, relationship to victim
- Motive (strength: extreme/high/moderate/low)
- Alibi (claimed time, can it be verified?)
- At party? Departure time?
- Is this person a killer? (mastermind/executor)
- Is this person a red herring?

## Relationships
Create a web of relationships:
- Family ties
- Business connections
- Romantic history
- Secrets and conflicts

## Red Herrings
The strongest red herring should:
- Have the most obvious motive
- Have suspicious behavior
- But have a valid (hidden) alibi
```

---

### 3. Evidence Crafter Agent

**Purpose**: Creates evidence items, distributes across phases, designs red herrings

**Input**:
```typescript
interface EvidenceCrafterInput {
  storyFoundation: StoryArchitectOutput;
  suspects: Suspect[];
  relationships: Relationship[];
}
```

**Output**:
```typescript
interface EvidenceCrafterOutput {
  evidence: Evidence[];
  phases: Phase[];
  redHerrings: RedHerring[];
  trueClues: {
    evidenceId: string;
    pointsTo: string;  // Killer name
    howItReveals: string;
  }[];
}
```

**System Prompt** (`prompts/evidence-crafter.md`):
```markdown
# Evidence Crafter Agent

You design the evidence chain for a murder mystery game.

## Your Task
Create 8+ evidence items that form a solvable puzzle.

## Evidence Distribution
Assign each piece to:
- A phase (1, 2, or 3)
- A detective role (1-5)

## Phase Structure
- Phase 1 (20 min): Establish facts, plant early clues
- Phase 2 (30 min): Deepen investigation, create contradictions
- Phase 3 (15 min): The twist revelation
- Phase 4 (15 min): Final reconstruction

## True Clues (5 minimum)
Each true clue must:
- Point unambiguously to a killer
- Be discoverable before Phase 3
- Require cross-detective collaboration

## Red Herrings (12 minimum)
Each red herring must:
- Appear to implicate an innocent person
- Have a plausible explanation
- Not completely block the solution

## The Central Mechanic
Design evidence around the central mechanic (e.g., bottle ID mismatch):
- Phase 1: Show evidence item A (BTL-7711)
- Phase 2: Show delivery record B (BTL-7794)
- Phase 3: Reconciliation reveals the swap
```

---

## Validation Agents

### 4. Timeline Auditor Agent

**Purpose**: Validates temporal consistency

**Input**:
```typescript
interface TimelineAuditorInput {
  timeline: TimelineEvent[];
  suspects: Suspect[];
  murderWindow: { start: string; end: string };
}
```

**Output**:
```typescript
interface TimelineAuditorOutput {
  status: 'pass' | 'warning' | 'fail';
  score: number;  // 0-100
  issues: {
    severity: 'error' | 'warning' | 'info';
    code: string;
    message: string;
    events: string[];  // Event IDs involved
    suggestion: string;
  }[];
  validatedTimeline: TimelineEvent[];  // With corrections
}
```

**Validation Checks**:
```markdown
## Timeline Auditor Checks

1. CHRONOLOGICAL_ORDER
   - All events in correct time sequence
   - No impossible time jumps

2. ALIBI_CONSISTENCY
   - Suspect locations don't conflict
   - Can't be in two places at once

3. MURDER_WINDOW
   - Time of death aligns with evidence
   - Killer(s) have opportunity in window

4. CAMERA_CORRELATION
   - Camera logs match timeline
   - Gaps explained or exploited

5. WITNESS_VERIFICATION
   - Witness statements match timeline
   - Inconsistencies flagged

6. DEPARTURE_SEQUENCE
   - Guest departures don't conflict
   - Murder happens after last guest leaves (if applicable)
```

---

### 5. Evidence Consistency Agent

**Purpose**: Validates evidence chain integrity

**Input**:
```typescript
interface EvidenceValidatorInput {
  evidence: Evidence[];
  phases: Phase[];
  forensicReports: any[];
}
```

**Output**:
```typescript
interface EvidenceValidatorOutput {
  status: 'pass' | 'warning' | 'fail';
  score: number;
  issues: {
    severity: 'error' | 'warning' | 'info';
    code: string;
    message: string;
    evidenceId: string;
    suggestion: string;
  }[];
}
```

**Validation Checks**:
```markdown
## Evidence Consistency Checks

1. ID_UNIQUENESS
   - All evidence IDs unique (EV-001, EV-002, etc.)
   - No duplicates

2. BOTTLE_ID_MATCH
   - If bottle swap mechanic: BTL-XXXX consistent
   - Delivered ID ≠ Evidence ID (intentional mismatch)

3. FORENSIC_CONSISTENCY
   - Blood levels match across reports
   - Diazepam: 850 ng/mL everywhere

4. FINGERPRINT_LOGIC
   - Fingerprints on evidence make sense
   - Killer's prints not obvious

5. CHAIN_OF_CUSTODY
   - Evidence locations documented
   - Timeline of evidence movement

6. PHASE_ASSIGNMENT
   - Evidence appears in correct phase
   - No premature reveals
```

---

### 6. Motive & Opportunity Agent

**Purpose**: Validates killer paths are feasible

**Input**:
```typescript
interface MotiveAnalyzerInput {
  solution: SolutionNarrative;
  suspects: Suspect[];
  timeline: TimelineEvent[];
  locations: Location[];
}
```

**Output**:
```typescript
interface MotiveAnalyzerOutput {
  status: 'pass' | 'warning' | 'fail';
  score: number;
  killerAnalysis: {
    name: string;
    role: 'mastermind' | 'executor';
    motiveValid: boolean;
    opportunityValid: boolean;
    accessValid: boolean;
    issues: string[];
  }[];
  redHerringAnalysis: {
    name: string;
    appearanceOfGuilt: number;  // 0-100
    actualInnocenceProof: string;
  }[];
}
```

**Validation Checks**:
```markdown
## Motive & Opportunity Checks

1. KILLER_ACCESS
   - Killers can reach murder location
   - Unsupervised route exists

2. MOTIVE_STRENGTH
   - Killer motives are compelling
   - Established before murder date

3. OPPORTUNITY_WINDOW
   - Killers present during murder window
   - Not provably elsewhere

4. MEANS_AVAILABILITY
   - Killers have access to murder weapon/method
   - Evidence of preparation

5. RED_HERRING_STRENGTH
   - Strongest red herring appears MORE guilty
   - But has verifiable innocence

6. ALIBI_HOLES
   - Killers' alibis have exploitable gaps
   - Innocent suspects have tighter alibis
```

---

### 7. Twist Fairness Agent

**Purpose**: Ensures mystery is solvable without hindsight

**Input**:
```typescript
interface TwistFairnessInput {
  phases: Phase[];
  solution: SolutionNarrative;
  trueClues: Evidence[];
  redHerrings: RedHerring[];
}
```

**Output**:
```typescript
interface TwistFairnessOutput {
  status: 'pass' | 'warning' | 'fail';
  score: number;
  solvabilityAnalysis: {
    cluesAvailableBeforeReveal: number;
    cluesNeededToSolve: number;
    isSolvable: boolean;
  };
  clueDistribution: {
    detective: number;
    clueCount: number;
    hasKillerClue: boolean;
  }[];
  issues: {
    severity: 'error' | 'warning' | 'info';
    code: string;
    message: string;
    suggestion: string;
  }[];
}
```

**Validation Checks**:
```markdown
## Twist Fairness Checks

1. CLUE_PLANTING
   - All solution clues present before Phase 3
   - No "out of nowhere" reveals

2. RED_HERRING_BALANCE
   - Red herrings mislead but don't block
   - Players can eliminate false leads

3. DETECTIVE_DISTRIBUTION
   - No single detective gets killer identity
   - Collaboration required

4. SOLVABILITY
   - Mystery can be solved with available clues
   - Solution doesn't require luck

5. AHA_MOMENT
   - Central mechanic creates satisfying reveal
   - Bottle ID mismatch discoverable

6. SCORING_FAIRNESS
   - Points achievable with reasonable deduction
   - No trick questions
```

---

## Orchestrator Implementation

### TypeScript Interface

```typescript
interface Orchestrator {
  // Generation
  generate(settings: GenerationSettings): AsyncGenerator<GenerationEvent>;

  // Validation
  validate(project: MysteryProject): Promise<ValidationResult>;

  // Individual agents
  runAgent<T>(agent: AgentType, input: any): Promise<T>;

  // Status
  getStatus(): OrchestratorStatus;
  cancel(): void;
}

type AgentType =
  | 'story-architect'
  | 'character-designer'
  | 'evidence-crafter'
  | 'timeline-auditor'
  | 'evidence-validator'
  | 'motive-analyzer'
  | 'twist-fairness';

interface GenerationEvent {
  type: 'agent_start' | 'agent_progress' | 'agent_complete' | 'error';
  agent: AgentType;
  message?: string;
  progress?: number;
  data?: any;
}
```

### Workflow

```typescript
async function* generateMystery(settings: GenerationSettings) {
  // Phase 1: Story Foundation
  yield { type: 'agent_start', agent: 'story-architect' };
  const story = await runAgent('story-architect', settings);
  yield { type: 'agent_complete', agent: 'story-architect', data: story };

  // Phase 2: Characters
  yield { type: 'agent_start', agent: 'character-designer' };
  const characters = await runAgent('character-designer', { story });
  yield { type: 'agent_complete', agent: 'character-designer', data: characters };

  // Phase 3: Evidence
  yield { type: 'agent_start', agent: 'evidence-crafter' };
  const evidence = await runAgent('evidence-crafter', { story, characters });
  yield { type: 'agent_complete', agent: 'evidence-crafter', data: evidence };

  // Phase 4: Validation (parallel)
  const validationAgents = [
    'timeline-auditor',
    'evidence-validator',
    'motive-analyzer',
    'twist-fairness'
  ];

  const validationResults = await Promise.all(
    validationAgents.map(agent => runAgent(agent, { story, characters, evidence }))
  );

  // Aggregate results
  const project = assembleProject(story, characters, evidence, validationResults);
  yield { type: 'complete', data: project };
}
```

---

## Agent Communication Protocol

### Message Format

```typescript
interface AgentMessage {
  id: string;
  timestamp: string;
  from: AgentType | 'orchestrator';
  to: AgentType | 'orchestrator';
  type: 'request' | 'response' | 'error' | 'progress';
  payload: any;
}
```

### Error Handling

```typescript
interface AgentError {
  code: string;
  message: string;
  recoverable: boolean;
  retryCount: number;
  lastRetry: string;
}

// Retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function runAgentWithRetry<T>(agent: AgentType, input: any): Promise<T> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await runAgent(agent, input);
    } catch (error) {
      if (i === MAX_RETRIES - 1) throw error;
      await delay(RETRY_DELAY * (i + 1));
    }
  }
}
```

---

## Token Usage Optimization

### Per-Agent Estimates

| Agent | Input Tokens | Output Tokens |
|-------|--------------|---------------|
| Story Architect | ~2K | ~5K |
| Character Designer | ~5K | ~15K |
| Evidence Crafter | ~10K | ~20K |
| Timeline Auditor | ~15K | ~3K |
| Evidence Validator | ~10K | ~2K |
| Motive Analyzer | ~10K | ~3K |
| Twist Fairness | ~10K | ~2K |
| **Total per generation** | **~62K** | **~50K** |

### Optimization Strategies

1. **Caching**: Cache common prompts and responses
2. **Incremental**: Only regenerate changed sections
3. **Model Selection**: Use Haiku for validation, Sonnet for generation
4. **Streaming**: Stream responses to reduce perceived latency
