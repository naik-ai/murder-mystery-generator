import {
  runAgentWithRetry,
  formatAgentInput,
  AgentResult,
  ProgressCallback,
  ValidationAgentType,
} from "./base";
import { StoryArchitectOutput } from "./story-architect";
import { CharacterDesignerOutput } from "./character-designer";
import { EvidenceCrafterOutput } from "./evidence-crafter";
import { ValidationAgentResult, ValidationIssue } from "@/lib/types";

// Combined validation input
export interface ValidationInput {
  storyFoundation: StoryArchitectOutput;
  characters: CharacterDesignerOutput;
  evidence: EvidenceCrafterOutput;
}

// Timeline Auditor Output
export interface TimelineAuditorOutput {
  status: "pass" | "warning" | "fail";
  score: number;
  summary: string;
  murderWindow: {
    start: string;
    end: string;
    isValid: boolean;
    killerOpportunity: {
      mastermind: { name: string; hasOpportunity: boolean; explanation: string };
      executor: { name: string; hasOpportunity: boolean; explanation: string };
    };
  };
  issues: ValidationIssue[];
  alibiAnalysis: Array<{
    suspectId: string;
    suspectName: string;
    claimedAlibi: string;
    verified: boolean;
    gaps: Array<{ start: string; end: string; explanation: string }>;
    inMurderWindow: boolean;
    couldBeKiller: boolean;
  }>;
}

// Evidence Validator Output
export interface EvidenceValidatorOutput {
  status: "pass" | "warning" | "fail";
  score: number;
  summary: string;
  idValidation: {
    allUnique: boolean;
    formatConsistent: boolean;
    duplicates: string[];
    malformedIds: string[];
  };
  forensicConsistency: {
    toxicologyMatch: boolean;
    fingerprintLogic: boolean;
    dnaConsistency: boolean;
    issues: string[];
  };
  centralMechanic: {
    name: string;
    isValid: boolean;
    phase1Setup: string;
    phase2Contradiction: string;
    phase3Resolution: string;
    issues: string[];
  };
  issues: ValidationIssue[];
}

// Motive Analyzer Output
export interface MotiveAnalyzerOutput {
  status: "pass" | "warning" | "fail";
  score: number;
  summary: string;
  killerAnalysis: Array<{
    suspectId: string;
    name: string;
    role: "mastermind" | "executor";
    motiveAnalysis: { isValid: boolean; strength: string; issues: string[] };
    opportunityAnalysis: { isValid: boolean; alibiGaps: string[]; issues: string[] };
    meansAnalysis: { isValid: boolean; accessToWeapon: boolean; issues: string[] };
    overallValidity: boolean;
  }>;
  redHerringAnalysis: Array<{
    suspectId: string;
    name: string;
    appearanceOfGuilt: { score: number; whyTheyLookGuilty: string };
    actualInnocence: { isProvable: boolean; proof: string };
  }>;
  issues: ValidationIssue[];
}

// Twist Fairness Output
export interface TwistFairnessOutput {
  status: "pass" | "warning" | "fail";
  score: number;
  summary: string;
  solvabilityAnalysis: {
    isSolvable: boolean;
    cluesAvailableBeforeReveal: number;
    cluesNeededToSolve: number;
    solvabilityPath: string[];
  };
  cluePlanting: {
    allCluesPlanted: boolean;
    plantedBeforePhase3: number;
    issues: string[];
  };
  redHerringBalance: {
    totalRedHerrings: number;
    blockingSolution: number;
    misleadingButFair: number;
  };
  detectiveDistribution: {
    isBalanced: boolean;
    collaborationRequired: boolean;
    collaborationPoints: string[];
  };
  ahaMoment: {
    centralMechanic: string;
    isDiscoverable: boolean;
    feelsFair: boolean;
  };
  issues: ValidationIssue[];
}

// Run Timeline Auditor
export async function runTimelineAuditor(
  input: ValidationInput,
  onProgress?: ProgressCallback
): Promise<AgentResult<TimelineAuditorOutput>> {
  const formattedInput = {
    instructions:
      "Analyze the timeline for chronological consistency, alibi conflicts, and murder window validity.",
    murderMethod: input.storyFoundation.murderMethod,
    solution: input.storyFoundation.solution,
    suspects: input.characters.suspects.map((s) => ({
      id: s.id,
      name: s.name,
      isKiller: s.isKiller,
      killerRole: s.killerRole,
      alibi: s.alibi,
      atParty: true,
    })),
    evidence: input.evidence.evidence.filter((e) =>
      ["timeline", "digital", "testimonial"].includes(e.type)
    ),
    phases: input.evidence.phases,
    checkList: [
      "CHRONOLOGICAL_ORDER: All events in correct sequence",
      "ALIBI_CONSISTENCY: No suspect in two places at once",
      "MURDER_WINDOW: Killers have opportunity during window",
      "WITNESS_VERIFICATION: Statements align with timeline",
      "DEPARTURE_SEQUENCE: Guest departures don't conflict",
    ],
  };

  return runAgentWithRetry<TimelineAuditorOutput>(
    "timeline-auditor",
    formatAgentInput(formattedInput),
    undefined,
    onProgress
  );
}

// Run Evidence Validator
export async function runEvidenceValidator(
  input: ValidationInput,
  onProgress?: ProgressCallback
): Promise<AgentResult<EvidenceValidatorOutput>> {
  const formattedInput = {
    instructions:
      "Validate evidence chain integrity, ID uniqueness, forensic consistency, and central mechanic validity.",
    evidence: input.evidence.evidence,
    phases: input.evidence.phases,
    centralMechanic: input.evidence.centralMechanic,
    trueClues: input.evidence.trueClues,
    redHerrings: input.evidence.redHerrings,
    checkList: [
      "ID_UNIQUENESS: All evidence IDs unique and formatted correctly",
      "FORENSIC_CONSISTENCY: Lab results consistent across reports",
      "CENTRAL_MECHANIC: Phase evidence properly sets up revelation",
      "PHASE_ASSIGNMENT: Evidence appears in correct phases",
      "CHAIN_OF_CUSTODY: All evidence has location and discovery method",
    ],
  };

  return runAgentWithRetry<EvidenceValidatorOutput>(
    "evidence-validator",
    formatAgentInput(formattedInput),
    undefined,
    onProgress
  );
}

// Run Motive Analyzer
export async function runMotiveAnalyzer(
  input: ValidationInput,
  onProgress?: ProgressCallback
): Promise<AgentResult<MotiveAnalyzerOutput>> {
  const formattedInput = {
    instructions:
      "Validate that killers have valid motives and opportunity, while red herrings appear guilty but can be proven innocent.",
    solution: input.storyFoundation.solution,
    murderMethod: input.storyFoundation.murderMethod,
    suspects: input.characters.suspects,
    redHerringStrategy: input.characters.redHerringStrategy,
    evidence: input.evidence.evidence.filter(
      (e) => e.isClue || e.type === "testimonial"
    ),
    checkList: [
      "KILLER_ACCESS: Killers can reach murder location",
      "MOTIVE_STRENGTH: Killer motives are compelling",
      "OPPORTUNITY_WINDOW: Killers have alibi gaps during murder",
      "RED_HERRING_STRENGTH: Red herrings appear more guilty",
      "ALIBI_STRUCTURE: Killers have weak alibis, innocents have strong ones",
    ],
  };

  return runAgentWithRetry<MotiveAnalyzerOutput>(
    "motive-analyzer",
    formatAgentInput(formattedInput),
    undefined,
    onProgress
  );
}

// Run Twist Fairness
export async function runTwistFairness(
  input: ValidationInput,
  onProgress?: ProgressCallback
): Promise<AgentResult<TwistFairnessOutput>> {
  const formattedInput = {
    instructions:
      "Ensure the mystery is solvable through logical deduction without hindsight, luck, or unfair leaps.",
    solution: input.storyFoundation.solution,
    phases: input.evidence.phases,
    trueClues: input.evidence.trueClues,
    redHerrings: input.evidence.redHerrings,
    centralMechanic: input.evidence.centralMechanic,
    solutionPath: input.evidence.solutionPath,
    detectiveCount: input.evidence.phases[0]?.detectivePackets?.length || 5,
    checkList: [
      "CLUE_PLANTING: All solution clues present before Phase 3",
      "RED_HERRING_BALANCE: Red herrings mislead but don't block",
      "DETECTIVE_DISTRIBUTION: No single detective can solve alone",
      "SOLVABILITY: Mystery solvable with available clues",
      "AHA_MOMENT: Central mechanic creates fair reveal",
    ],
  };

  return runAgentWithRetry<TwistFairnessOutput>(
    "twist-fairness",
    formatAgentInput(formattedInput),
    undefined,
    onProgress
  );
}

// Run all validators in parallel
export async function runAllValidators(
  input: ValidationInput,
  onProgress?: ProgressCallback
): Promise<{
  timeline: AgentResult<TimelineAuditorOutput>;
  evidence: AgentResult<EvidenceValidatorOutput>;
  motive: AgentResult<MotiveAnalyzerOutput>;
  twist: AgentResult<TwistFairnessOutput>;
}> {
  const [timeline, evidence, motive, twist] = await Promise.all([
    runTimelineAuditor(input, (p) =>
      onProgress?.({ ...p, agent: "timeline-auditor" })
    ),
    runEvidenceValidator(input, (p) =>
      onProgress?.({ ...p, agent: "evidence-validator" })
    ),
    runMotiveAnalyzer(input, (p) =>
      onProgress?.({ ...p, agent: "motive-analyzer" })
    ),
    runTwistFairness(input, (p) =>
      onProgress?.({ ...p, agent: "twist-fairness" })
    ),
  ]);

  return { timeline, evidence, motive, twist };
}

// Convert validator output to ValidationAgentResult
export function toValidationResult(
  agent: ValidationAgentType,
  output:
    | TimelineAuditorOutput
    | EvidenceValidatorOutput
    | MotiveAnalyzerOutput
    | TwistFairnessOutput
): ValidationAgentResult {
  return {
    agent,
    status:
      output.status === "pass"
        ? "pass"
        : output.status === "warning"
          ? "warn"
          : "fail",
    issues: output.issues,
    runAt: new Date().toISOString(),
  };
}
