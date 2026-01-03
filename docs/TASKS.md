# Implementation Task List

Detailed task breakdown for implementing the Murder Mystery Generator.

---

## Phase 1: Foundation (3-4 days)

### 1.1 Project Setup
- [ ] Initialize Next.js 14 with TypeScript ✓ (done)
- [ ] Install and configure shadcn/ui
- [ ] Set up Tailwind CSS theming
- [ ] Configure ESLint and Prettier
- [ ] Set up path aliases (@/components, @/lib, etc.)
- [ ] Create .env.example with required variables

### 1.2 Type Definitions (`lib/types/index.ts`)
- [ ] Define `MysteryProject` interface
- [ ] Define `Suspect` interface with all properties
- [ ] Define `Evidence` interface with all properties
- [ ] Define `TimelineEvent` interface
- [ ] Define `Phase` interface with detective packets
- [ ] Define `RedHerring` interface
- [ ] Define `Relationship` interface
- [ ] Define `ValidationResult` interfaces
- [ ] Define `GenerationSettings` interface
- [ ] Define agent input/output types
- [ ] Export all types properly

### 1.3 File Manager (`lib/storage/file-manager.ts`)
- [ ] Create `FileManager` class
- [ ] Implement `createProject(settings)` method
- [ ] Implement `loadProject(id)` method
- [ ] Implement `saveProject(project)` method
- [ ] Implement `deleteProject(id)` method
- [ ] Implement `listProjects()` method
- [ ] Implement `getProjectPath(id)` method
- [ ] Add file watching for external changes
- [ ] Handle JSON serialization/deserialization
- [ ] Create project directory structure

### 1.4 API Routes - Project CRUD
- [ ] Create `/api/projects/route.ts` (GET, POST)
- [ ] Create `/api/projects/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Add request validation
- [ ] Add error handling
- [ ] Add response typing

### 1.5 Basic UI Pages
- [ ] Create root layout with providers
- [ ] Create dashboard page (`/`)
- [ ] Create project list component
- [ ] Create project card component
- [ ] Create empty state component
- [ ] Add loading states
- [ ] Add error boundaries

---

## Phase 2: UI Components (3-4 days)

### 2.1 shadcn/ui Setup
- [ ] Install shadcn/ui CLI
- [ ] Add Button component
- [ ] Add Card component
- [ ] Add Dialog component
- [ ] Add Input component
- [ ] Add Select component
- [ ] Add Tabs component
- [ ] Add Badge component
- [ ] Add Progress component
- [ ] Add Alert component
- [ ] Add Toast component
- [ ] Add Dropdown menu

### 2.2 Drag-Drop Setup (@dnd-kit)
- [ ] Install @dnd-kit/core
- [ ] Install @dnd-kit/sortable
- [ ] Create DragDropContext wrapper
- [ ] Create Draggable component
- [ ] Create Droppable component
- [ ] Add keyboard accessibility

### 2.3 Suspect Editor
- [ ] Create `SuspectEditor` component
- [ ] Create `SuspectCard` component
- [ ] Create tier columns (1, 2, 3)
- [ ] Implement drag between tiers
- [ ] Create `SuspectEditModal` component
- [ ] Add form for all suspect fields
- [ ] Add killer designation toggle
- [ ] Add red herring toggle
- [ ] Add motive strength selector
- [ ] Add alibi editor

### 2.4 Evidence Editor
- [ ] Create `EvidenceEditor` component
- [ ] Create `EvidenceCard` component
- [ ] Create phase columns (1, 2, 3)
- [ ] Implement drag to assign phase
- [ ] Create `EvidenceEditModal` component
- [ ] Add evidence type selector
- [ ] Add detective assignment
- [ ] Add clue/red herring toggle
- [ ] Add bottle ID field (for bottle evidence)
- [ ] Add forensic results editor

### 2.5 Timeline Editor
- [ ] Create `TimelineEditor` component
- [ ] Create `TimelineEvent` component
- [ ] Create horizontal timeline view
- [ ] Add zoom controls
- [ ] Add event filtering
- [ ] Create `EventEditModal` component
- [ ] Add conflict detection UI
- [ ] Add event grouping by date
- [ ] Add draggable event repositioning

### 2.6 Generation Wizard
- [ ] Create `GenerationWizard` component
- [ ] Create Step 1: Theme & Setting
- [ ] Create Step 2: Scale & Difficulty
- [ ] Create Step 3: Murder Method
- [ ] Create Step 4: Character Types
- [ ] Create Step 5: Generate (progress view)
- [ ] Add step navigation
- [ ] Add form validation per step
- [ ] Add settings preview
- [ ] Store wizard state

### 2.7 Validation Panel
- [ ] Create `ValidationPanel` component
- [ ] Create `ValidationAgentCard` component
- [ ] Create `ValidationIssue` component
- [ ] Add issue severity icons
- [ ] Add fix suggestion display
- [ ] Add "Apply Fix" button
- [ ] Add "Revalidate" button
- [ ] Add overall status indicator

---

## Phase 3: Generation Agents (4-5 days)

### 3.1 Agent Base Setup
- [ ] Create `lib/agents/base.ts`
- [ ] Define `Agent` abstract class
- [ ] Implement Claude API integration
- [ ] Add streaming support
- [ ] Add error handling
- [ ] Add retry logic
- [ ] Add token counting
- [ ] Add cost tracking

### 3.2 Story Architect Agent
- [ ] Create `lib/agents/story-architect.ts`
- [ ] Create `prompts/story-architect.md`
- [ ] Define input/output types
- [ ] Implement generation logic
- [ ] Add output validation
- [ ] Add streaming progress

### 3.3 Character Designer Agent
- [ ] Create `lib/agents/character-designer.ts`
- [ ] Create `prompts/character-designer.md`
- [ ] Define input/output types
- [ ] Implement generation logic
- [ ] Generate all 23 suspects
- [ ] Create relationship web
- [ ] Identify red herrings

### 3.4 Evidence Crafter Agent
- [ ] Create `lib/agents/evidence-crafter.ts`
- [ ] Create `prompts/evidence-crafter.md`
- [ ] Define input/output types
- [ ] Implement generation logic
- [ ] Generate 8+ evidence items
- [ ] Assign to phases
- [ ] Create true clues
- [ ] Create red herrings

### 3.5 Orchestrator
- [ ] Create `lib/agents/orchestrator.ts`
- [ ] Implement agent coordination
- [ ] Add sequential generation flow
- [ ] Add parallel validation flow
- [ ] Implement SSE streaming
- [ ] Add cancellation support
- [ ] Add retry on failure
- [ ] Aggregate results

### 3.6 Generation API Route
- [ ] Create `/api/generate/route.ts`
- [ ] Create `/api/generate/stream/route.ts` (SSE)
- [ ] Add request validation
- [ ] Add progress streaming
- [ ] Add error handling
- [ ] Add cancellation endpoint

### 3.7 Generation UI Integration
- [ ] Connect wizard to API
- [ ] Display streaming progress
- [ ] Show agent status
- [ ] Handle completion
- [ ] Handle errors
- [ ] Navigate to project on success

---

## Phase 4: Validation Agents (3-4 days)

### 4.1 Timeline Auditor Agent
- [ ] Create `lib/agents/timeline-auditor.ts`
- [ ] Create `prompts/validators/timeline-auditor.md`
- [ ] Implement chronological check
- [ ] Implement alibi consistency check
- [ ] Implement murder window check
- [ ] Implement camera correlation check
- [ ] Generate fix suggestions

### 4.2 Evidence Validator Agent
- [ ] Create `lib/agents/evidence-validator.ts`
- [ ] Create `prompts/validators/evidence-validator.md`
- [ ] Implement ID uniqueness check
- [ ] Implement bottle ID check
- [ ] Implement forensic consistency check
- [ ] Implement chain of custody check
- [ ] Generate fix suggestions

### 4.3 Motive Analyzer Agent
- [ ] Create `lib/agents/motive-analyzer.ts`
- [ ] Create `prompts/validators/motive-analyzer.md`
- [ ] Implement killer access check
- [ ] Implement motive strength check
- [ ] Implement opportunity window check
- [ ] Implement red herring strength check
- [ ] Generate fix suggestions

### 4.4 Twist Fairness Agent
- [ ] Create `lib/agents/twist-fairness.ts`
- [ ] Create `prompts/validators/twist-fairness.md`
- [ ] Implement clue planting check
- [ ] Implement red herring balance check
- [ ] Implement detective distribution check
- [ ] Implement solvability check
- [ ] Generate fix suggestions

### 4.5 Validation API Route
- [ ] Create `/api/validate/route.ts`
- [ ] Create `/api/validate/[agent]/route.ts`
- [ ] Add parallel validation execution
- [ ] Add result aggregation
- [ ] Add fix application endpoint

### 4.6 Validation UI Integration
- [ ] Connect validation panel to API
- [ ] Display real-time validation
- [ ] Show per-agent results
- [ ] Enable issue navigation
- [ ] Enable fix application
- [ ] Add revalidation trigger

---

## Phase 5: Export & Integration (2-3 days)

### 5.1 Markdown Export
- [ ] Create `lib/storage/export-generator.ts`
- [ ] Implement `generateBlueprint()` function
- [ ] Implement `generateCaseBrief()` function
- [ ] Implement `generatePhase1()` function
- [ ] Implement `generatePhase2()` function
- [ ] Implement `generatePhase3()` function
- [ ] Implement `generateHostMaterials()` function
- [ ] Implement `generateAppendix()` function
- [ ] Match existing file format exactly

### 5.2 PDF Export
- [ ] Configure md-to-pdf
- [ ] Create PDF generation function
- [ ] Add custom CSS for PDFs
- [ ] Add page breaks
- [ ] Generate all 7 PDFs

### 5.3 Package Export
- [ ] Create ZIP package generator
- [ ] Include all markdown files
- [ ] Include all PDFs
- [ ] Include project.json
- [ ] Add download endpoint

### 5.4 Export API Routes
- [ ] Create `/api/export/markdown/route.ts`
- [ ] Create `/api/export/pdf/route.ts`
- [ ] Create `/api/export/package/route.ts`
- [ ] Add progress tracking
- [ ] Add file serving

### 5.5 Export UI
- [ ] Create Export Hub page
- [ ] Add format selection
- [ ] Add file preview
- [ ] Add download buttons
- [ ] Add progress indicators

### 5.6 Claude Code Integration
- [ ] Create `lib/claude-code/auth.ts`
- [ ] Create `lib/claude-code/trigger.ts`
- [ ] Implement API key sharing
- [ ] Implement CLI trigger
- [ ] Create `/api/claude-code/trigger/route.ts`
- [ ] Create `/api/claude-code/status/route.ts`
- [ ] Add ClaudeCodeButton component
- [ ] Generate .claude-instructions.md

---

## Phase 6: Polish (2 days)

### 6.1 Error Handling
- [ ] Add global error boundary
- [ ] Add API error handling
- [ ] Add user-friendly error messages
- [ ] Add retry mechanisms
- [ ] Add offline detection

### 6.2 Loading States
- [ ] Add skeleton loaders
- [ ] Add progress indicators
- [ ] Add optimistic updates
- [ ] Add debounced saves

### 6.3 Testing
- [ ] Set up Jest
- [ ] Add unit tests for types
- [ ] Add unit tests for file manager
- [ ] Add unit tests for agents
- [ ] Add integration tests
- [ ] Add E2E tests with Playwright

### 6.4 Documentation
- [ ] Complete README.md
- [ ] Add API documentation
- [ ] Add component documentation
- [ ] Create user guide
- [ ] Add troubleshooting guide

### 6.5 Sample Templates
- [ ] Create "Classic Estate Murder" template
- [ ] Create "Corporate Conspiracy" template
- [ ] Create "Wedding Gone Wrong" template
- [ ] Add template selection UI

### 6.6 Performance
- [ ] Add React Query for caching
- [ ] Add virtual scrolling for lists
- [ ] Optimize bundle size
- [ ] Add lazy loading
- [ ] Profile and optimize

---

## Agent-Specific Implementation Details

### Story Architect Agent

**Input Processing**:
```typescript
interface StoryArchitectProcessor {
  validateInput(settings: GenerationSettings): ValidationResult;
  buildPrompt(settings: GenerationSettings): string;
  parseResponse(response: string): StoryArchitectOutput;
  validateOutput(output: StoryArchitectOutput): ValidationResult;
}
```

**Key Decisions**:
1. Victim profile generation
2. Murder method selection (1 or 2 stage)
3. Central mechanic design (e.g., bottle swap)
4. Solution structure

### Character Designer Agent

**Input Processing**:
```typescript
interface CharacterDesignerProcessor {
  validateInput(story: StoryArchitectOutput): ValidationResult;
  buildPrompt(story: StoryArchitectOutput, count: SuspectCount): string;
  parseResponse(response: string): CharacterDesignerOutput;
  validateOutput(output: CharacterDesignerOutput): ValidationResult;
}
```

**Key Decisions**:
1. Tier assignment (1/2/3)
2. Killer designation
3. Red herring selection
4. Relationship web

### Evidence Crafter Agent

**Input Processing**:
```typescript
interface EvidenceCrafterProcessor {
  validateInput(story: StoryArchitectOutput, chars: CharacterDesignerOutput): ValidationResult;
  buildPrompt(story: StoryArchitectOutput, chars: CharacterDesignerOutput): string;
  parseResponse(response: string): EvidenceCrafterOutput;
  validateOutput(output: EvidenceCrafterOutput): ValidationResult;
}
```

**Key Decisions**:
1. Evidence item selection
2. Phase assignment
3. Detective distribution
4. True clue design
5. Red herring placement

### Validation Agents (Common Pattern)

```typescript
interface ValidationAgent<TInput> {
  name: string;
  validateInput(input: TInput): ValidationResult;
  buildPrompt(input: TInput): string;
  parseResponse(response: string): AgentValidationResult;
  generateFixes(issues: ValidationIssue[]): FixSuggestion[];
}
```

---

## Estimated Hours

| Phase | Tasks | Hours |
|-------|-------|-------|
| 1. Foundation | 15 tasks | 16-24h |
| 2. UI Components | 35 tasks | 24-32h |
| 3. Generation Agents | 20 tasks | 32-40h |
| 4. Validation Agents | 15 tasks | 24-32h |
| 5. Export & Integration | 20 tasks | 16-24h |
| 6. Polish | 20 tasks | 16-24h |
| **Total** | **125 tasks** | **128-176h** |

**Calendar Time**: 3-4 weeks (working full-time)

---

## Priority Order

### Must Have (MVP)
1. Project CRUD
2. Generation wizard
3. Story Architect agent
4. Character Designer agent
5. Evidence Crafter agent
6. Basic validation
7. Markdown export

### Should Have
1. Full validation agents
2. PDF export
3. Drag-drop editors
4. Claude Code integration
5. Timeline editor

### Nice to Have
1. Sample templates
2. Advanced timeline visualization
3. Real-time collaboration
4. Cloud storage option
5. Mobile responsive design
