// Murder Mystery Generator - Core Types

// ============================================================================
// Project Types
// ============================================================================

export type ProjectStatus = 'draft' | 'generating' | 'validating' | 'complete' | 'error';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type SuspectTier = 1 | 2 | 3;
export type Phase = 1 | 2 | 3;
export type DetectiveNumber = 1 | 2 | 3 | 4 | 5;
export type MotiveStrength = 'extreme' | 'high' | 'moderate' | 'low';
export type EvidenceType = 'physical' | 'document' | 'digital' | 'forensic' | 'testimonial';

export interface MysteryProject {
  id: string;
  name: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  settings: GenerationSettings;
  narrative?: CoreNarrative;
  suspects: Suspect[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  phases: PhaseData[];
  redHerrings: RedHerring[];
  solution?: SolutionNarrative;
  validation?: ValidationState;
}

// ============================================================================
// Generation Settings
// ============================================================================

export interface GenerationSettings {
  // Theme & Setting
  theme: string;
  location: string;
  era: string;
  occasion: string;

  // Scale
  playerCount: number;
  duration: number; // in minutes
  difficulty: Difficulty;

  // Murder Method
  murderMethod: {
    cause: string;
    stages: 1 | 2;
    centralMechanic: string;
  };

  // Characters
  victimProfile: {
    name: string;
    role: string;
    personality: string;
  };
  killerCount: 1 | 2;
  redHerringStrength: 'subtle' | 'moderate' | 'strong';
  suspectCount: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
}

// ============================================================================
// Narrative Types
// ============================================================================

export interface CoreNarrative {
  title: string;
  tagline: string;
  setting: {
    location: string;
    time: string;
    atmosphere: string;
  };
  premise: string;
  murderMethod: {
    description: string;
    stages: MurderStage[];
    centralMechanic: string;
  };
  themes: string[];
}

export interface MurderStage {
  stage: number;
  description: string;
  time: string;
  location: string;
  method: string;
  perpetrator: string;
}

export interface SolutionNarrative {
  summary: string;
  killerIdentity: {
    suspectId: string;
    name: string;
    role: 'mastermind' | 'executor' | 'sole';
  }[];
  motive: string;
  opportunity: string;
  method: string;
  keyEvidence: string[];
  timeline: string;
}

// ============================================================================
// Suspect Types
// ============================================================================

export interface Suspect {
  id: string;
  tier: SuspectTier;
  name: string;
  role: string;
  age: number;
  description: string;
  personality: string[];
  background: string;

  motive: {
    summary: string;
    strength: MotiveStrength;
    details: string;
  };

  alibi: {
    claimed: string;
    actual: string;
    verified: boolean;
    witnesses: string[];
  };

  secrets: string[];
  relationships: Relationship[];

  isKiller: boolean;
  killerRole?: 'mastermind' | 'executor';
  isRedHerring: boolean;

  physicalDescription?: string;
  quirks?: string[];
}

export interface Relationship {
  targetId: string;
  targetName: string;
  type: 'family' | 'romantic' | 'professional' | 'friend' | 'rival' | 'secret';
  description: string;
  isPublic: boolean;
}

// ============================================================================
// Evidence Types
// ============================================================================

export interface Evidence {
  id: string; // Format: EV-001
  name: string;
  type: EvidenceType;
  description: string;

  revealedInPhase: Phase;
  assignedToDetective: DetectiveNumber;

  isClue: boolean; // True clue vs red herring
  pointsTo?: string; // Suspect ID if clue

  location: string;
  discoveryMethod: string;

  forensicDetails?: {
    analysis: string;
    results: string;
    significance: string;
  };

  bottleId?: string; // For bottle evidence: BTL-7711
  documentContent?: string; // For document evidence
  digitalMetadata?: {
    device: string;
    timestamp: string;
    data: string;
  };
}

// ============================================================================
// Timeline Types
// ============================================================================

export interface TimelineEvent {
  id: string;
  timestamp: string; // ISO format
  time: string; // Display format: "2:15 AM"
  date: string; // Display format: "March 15, 2024"

  title: string;
  description: string;

  location: string;
  participants: string[]; // Suspect IDs

  type: 'background' | 'setup' | 'murder' | 'discovery' | 'investigation';
  importance: 'critical' | 'major' | 'minor';

  relatedEvidence?: string[]; // Evidence IDs
  isAlibiEvent?: boolean;
  alibiFor?: string[]; // Suspect IDs
}

// ============================================================================
// Phase Types
// ============================================================================

export interface PhaseData {
  phase: Phase;
  title: string;
  description: string;
  duration: number; // in minutes

  detectivePackets: DetectivePacket[];
  groupClues: string[]; // Evidence IDs revealed to all

  objectives: string[];
  revelations: string[];
}

export interface DetectivePacket {
  detective: DetectiveNumber;
  name: string;
  assignedSuspects: string[]; // Suspect IDs
  assignedEvidence: string[]; // Evidence IDs
  specialInstructions: string;
}

// ============================================================================
// Red Herring Types
// ============================================================================

export interface RedHerring {
  id: string;
  type: 'false_alibi' | 'misleading_evidence' | 'suspicious_behavior' | 'false_motive' | 'planted_clue';
  description: string;

  targetSuspect: string; // Suspect ID who looks guilty
  actualExplanation: string;

  revealedInPhase: Phase;
  resolutionPhase: Phase;

  strength: 'subtle' | 'moderate' | 'strong';
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationState {
  lastValidated: string;
  overallStatus: 'valid' | 'warnings' | 'errors' | 'not_validated';
  agents: ValidationAgentResult[];
}

export interface ValidationAgentResult {
  agent: ValidationAgentType;
  status: 'pass' | 'warn' | 'fail';
  issues: ValidationIssue[];
  runAt: string;
}

export type ValidationAgentType =
  | 'timeline_auditor'
  | 'evidence_validator'
  | 'motive_analyzer'
  | 'twist_fairness';

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  details: string;

  location?: {
    type: 'suspect' | 'evidence' | 'timeline' | 'phase';
    id: string;
    field?: string;
  };

  suggestion?: FixSuggestion;
}

export interface FixSuggestion {
  description: string;
  action: 'update' | 'delete' | 'add';
  target: {
    type: 'suspect' | 'evidence' | 'timeline' | 'phase';
    id: string;
    field?: string;
  };
  suggestedValue?: unknown;
  autoApplicable: boolean;
}

// ============================================================================
// Agent Types
// ============================================================================

export interface AgentInput {
  projectId: string;
  settings: GenerationSettings;
  previousOutputs?: {
    narrative?: CoreNarrative;
    suspects?: Suspect[];
    evidence?: Evidence[];
  };
}

export interface AgentOutput<T> {
  success: boolean;
  data?: T;
  error?: string;
  tokensUsed: {
    input: number;
    output: number;
  };
}

export interface GenerationProgress {
  stage: 'story' | 'characters' | 'evidence' | 'validation' | 'complete';
  agentName: string;
  progress: number; // 0-100
  message: string;
  tokensUsed?: {
    input: number;
    output: number;
  };
}

// ============================================================================
// API Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProjectListItem {
  id: string;
  name: string;
  status: ProjectStatus;
  suspectCount: number;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface WizardState {
  currentStep: number;
  settings: Partial<GenerationSettings>;
  isValid: boolean;
  errors: Record<string, string>;
}

export interface EditorState {
  selectedSuspect: string | null;
  selectedEvidence: string | null;
  selectedEvent: string | null;
  isDirty: boolean;
}
