# Frontend Specification

## Overview

The Murder Mystery Generator frontend is a Next.js 14 application with App Router, providing an intuitive interface for generating and managing murder mystery games.

---

## Pages & Routes

### 1. Dashboard (`/`)
**Purpose**: Landing page with project overview

**Components**:
- `ProjectGrid`: Grid of project cards
- `QuickStats`: Total projects, recent activity
- `CreateButton`: New project shortcut

**Features**:
- List all projects with thumbnails
- Quick actions (open, duplicate, delete)
- Search and filter projects
- Sort by date, name, status

---

### 2. New Project Wizard (`/projects/new`)
**Purpose**: Multi-step wizard for generating new mystery

**Steps**:

#### Step 1: Theme & Setting
```typescript
interface ThemeSettings {
  genre: 'classic' | 'noir' | 'modern' | 'period';
  setting: {
    location: string;      // e.g., "Estate in Alibaug"
    country: string;       // e.g., "India"
    era: string;           // e.g., "Contemporary 2024"
  };
  occasion: string;        // e.g., "Engagement party"
  atmosphere: 'dark' | 'suspenseful' | 'dramatic' | 'comedic';
}
```

#### Step 2: Scale & Difficulty
```typescript
interface ScaleSettings {
  playerCount: 4 | 5 | 6 | 7 | 8;
  duration: 60 | 80 | 100 | 120;  // minutes
  difficulty: 'easy' | 'medium' | 'challenging';
  suspectCount: {
    tier1: number;  // Core suspects (5-8)
    tier2: number;  // Secondary (4-8)
    tier3: number;  // Background (8-12)
  };
}
```

#### Step 3: Murder Method
```typescript
interface MurderMethod {
  primaryCause: 'poison' | 'strangulation' | 'stabbing' | 'blunt_force' | 'shooting';
  stages: number;           // 1 or 2 stage murder
  centralMechanic: string;  // e.g., "Bottle swap", "Alibi manipulation"
  keyMystery: string;       // e.g., "Why no defensive wounds?"
}
```

#### Step 4: Character Types
```typescript
interface CharacterArchetypes {
  victim: {
    wealth: 'billionaire' | 'millionaire' | 'upper_middle' | 'middle';
    occupation: string;
    age: number;
    familyStructure: 'nuclear' | 'extended' | 'business_family';
  };
  killers: {
    count: 1 | 2 | 3;
    relationship: 'family' | 'business' | 'romantic' | 'staff';
  };
  redHerringStrength: 'obvious' | 'strong' | 'subtle';
}
```

#### Step 5: Generate
- Progress display with streaming updates
- Agent status indicators
- Cancel/retry options
- Preview generated content

---

### 3. Project Dashboard (`/projects/[id]`)
**Purpose**: Overview of generated project

**Sections**:
- **Header**: Project name, status badge, quick actions
- **Summary Cards**: Suspect count, evidence count, phase status
- **Validation Panel**: Agent results, issues, fix suggestions
- **Export Options**: Markdown, PDF, package download
- **Navigation**: Links to editors

---

### 4. Suspect Manager (`/projects/[id]/suspects`)
**Purpose**: Manage all 23 suspects across tiers

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ [Add Suspect]  [Filter: All ▼]  [Search...]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   TIER 1    │  │   TIER 2    │  │   TIER 3    │ │
│  │  (7 Core)   │  │ (6 Second.) │  │(10 Background)│
│  │             │  │             │  │             │ │
│  │ [Rohit    ] │  │ [Nisha    ] │  │ [Meenakshi]│ │
│  │ [Priya    ] │  │ [Sanjay   ] │  │ [Ramesh   ] │ │
│  │ [Kavya ★  ] │  │ [Karan    ] │  │ [Vikash ★ ] │ │
│  │ [Deepika  ] │  │ [Dr.Menon ] │  │ [...]      ] │ │
│  │ [...]      ] │  │ [...]      ] │  │             │ │
│  │             │  │             │  │             │ │
│  │ Drag here   │  │ Drag here   │  │ Drag here   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                     │
│  ★ = Killer                                        │
└─────────────────────────────────────────────────────┘
```

**Suspect Card** (expandable):
```typescript
interface SuspectCardProps {
  suspect: Suspect;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  isKiller: boolean;
  isRedHerring: boolean;
}
```

**Edit Modal Fields**:
- Basic info (name, age, role)
- Relationship to victim
- Motive (type, strength, description)
- Alibi (claimed, verified, holes)
- Party attendance (present, departure time)
- Killer designation (mastermind/executor)
- Red herring flag

---

### 5. Evidence Manager (`/projects/[id]/evidence`)
**Purpose**: Manage evidence items and phase assignment

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ [Add Evidence]  [Type: All ▼]  [Phase: All ▼]      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  EVIDENCE ITEMS                    PHASE ASSIGNMENT │
│  ┌──────────────────┐             ┌───────────────┐│
│  │ EV-001           │             │  PHASE 1      ││
│  │ Whiskey Glass    │  ─────────▶ │  EV-001       ││
│  │ 🔍 Physical      │             │  EV-002       ││
│  │ Detective: 2     │             │  EV-003       ││
│  └──────────────────┘             └───────────────┘│
│  ┌──────────────────┐             ┌───────────────┐│
│  │ EV-002           │             │  PHASE 2      ││
│  │ Champagne Flute  │  ─────────▶ │  EV-004       ││
│  │ 🔍 Physical      │             │  EV-005       ││
│  └──────────────────┘             └───────────────┘│
│  ┌──────────────────┐             ┌───────────────┐│
│  │ EV-003           │             │  PHASE 3      ││
│  │ Macallan Bottle  │  ─────────▶ │  EV-006       ││
│  │ BTL-7711 ⚠️      │             │  (reveal)     ││
│  │ 🔍 Physical      │             └───────────────┘│
│  └──────────────────┘                              │
│                                                     │
│  ⚠️ = Bottle ID mismatch detected                  │
└─────────────────────────────────────────────────────┘
```

**Evidence Card**:
```typescript
interface EvidenceCardProps {
  evidence: Evidence;
  onEdit: () => void;
  onAssignPhase: (phase: 1 | 2 | 3) => void;
  onAssignDetective: (detective: 1 | 2 | 3 | 4 | 5) => void;
  conflicts?: string[];  // Validation issues
}
```

---

### 6. Timeline Editor (`/projects/[id]/timeline`)
**Purpose**: Visual timeline with event management

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ [Add Event]  [Zoom: ──●──]  [Filter: All ▼]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Dec 10    Dec 11    Dec 12    Dec 13    Dec 14    │
│  ────┼────────┼────────┼────────┼────────┼─────    │
│            ●                                        │
│         Purchase                                    │
│         BTL-7711                                    │
│                      ●                              │
│                   Delivery                          │
│                   BTL-7794                          │
│                      ●───●                          │
│                   Rohit visit                       │
│                            ●                        │
│                         Party                       │
│                         starts                      │
│                              ●●●●●●●●              │
│                              Guest                  │
│                              departures             │
│                                    ●                │
│                                 MURDER              │
│                                 02:15-02:30        │
│                                                     │
│  ⚠️ CONFLICTS: None detected                       │
└─────────────────────────────────────────────────────┘
```

**Timeline Event**:
```typescript
interface TimelineEventProps {
  event: TimelineEvent;
  position: { x: number; y: number };
  onEdit: () => void;
  onDelete: () => void;
  conflicts: TimelineConflict[];
}
```

---

### 7. Export Hub (`/projects/[id]/export`)
**Purpose**: Generate and download final materials

**Options**:
- Generate all Markdown files
- Generate all PDFs
- Download as ZIP package
- Preview individual files
- Validation status check before export

---

## Component Library

### Using shadcn/ui

| Component | Usage |
|-----------|-------|
| `Card` | Project cards, suspect cards, evidence cards |
| `Dialog` | Edit modals, confirmation dialogs |
| `Button` | Actions, navigation |
| `Input` | Form fields |
| `Select` | Dropdowns, filters |
| `Tabs` | Section navigation |
| `Badge` | Status indicators, tags |
| `Progress` | Generation progress |
| `Alert` | Validation warnings |
| `Toast` | Notifications |

### Custom Components

```typescript
// Drag-drop container
interface DragDropContainerProps {
  items: Draggable[];
  onReorder: (items: Draggable[]) => void;
  accepts: string[];  // Item types
}

// Agent progress display
interface AgentProgressProps {
  agents: AgentStatus[];
  currentAgent: string;
  overallProgress: number;
}

// Validation panel
interface ValidationPanelProps {
  results: ValidationResult[];
  onFix: (issue: ValidationIssue) => void;
  onRevalidate: () => void;
}
```

---

## State Management

### Project State (Zustand)

```typescript
interface ProjectStore {
  // Current project
  project: MysteryProject | null;
  isLoading: boolean;
  isDirty: boolean;

  // Actions
  loadProject: (id: string) => Promise<void>;
  saveProject: () => Promise<void>;
  updateProject: (partial: Partial<MysteryProject>) => void;

  // Suspects
  addSuspect: (suspect: Suspect) => void;
  updateSuspect: (id: string, updates: Partial<Suspect>) => void;
  deleteSuspect: (id: string) => void;
  moveSuspectToTier: (id: string, tier: 1 | 2 | 3) => void;

  // Evidence
  addEvidence: (evidence: Evidence) => void;
  updateEvidence: (id: string, updates: Partial<Evidence>) => void;
  deleteEvidence: (id: string) => void;
  assignEvidenceToPhase: (id: string, phase: 1 | 2 | 3) => void;

  // Timeline
  addEvent: (event: TimelineEvent) => void;
  updateEvent: (id: string, updates: Partial<TimelineEvent>) => void;
  deleteEvent: (id: string) => void;

  // Validation
  validationResults: ValidationState | null;
  isValidating: boolean;
  runValidation: () => Promise<void>;
}
```

### Generation State

```typescript
interface GenerationStore {
  isGenerating: boolean;
  currentStep: number;
  totalSteps: number;
  currentAgent: string;
  progress: number;
  messages: GenerationMessage[];
  error: string | null;

  startGeneration: (settings: GenerationSettings) => Promise<void>;
  cancelGeneration: () => void;
  retryGeneration: () => Promise<void>;
}
```

---

## Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Mobile (<640px) | Single column, stacked cards |
| Tablet (640-1024px) | Two columns, collapsible sidebar |
| Desktop (>1024px) | Full layout, fixed sidebar |

---

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation for drag-drop
- Focus management in modals
- Screen reader announcements for async operations
- High contrast mode support
- Reduced motion option

---

## Performance

- Lazy loading for project list
- Virtual scrolling for large suspect lists
- Debounced saves (500ms)
- Optimistic UI updates
- Image optimization for diagrams
- Code splitting by route
