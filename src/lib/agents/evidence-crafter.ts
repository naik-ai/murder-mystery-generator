import {
  runAgentWithRetry,
  formatAgentInput,
  AgentResult,
  ProgressCallback,
} from "./base";
import { StoryArchitectOutput } from "./story-architect";
import { CharacterDesignerOutput } from "./character-designer";
import { Evidence, PhaseData, RedHerring } from "@/lib/types";

// Evidence Crafter Output Types
export interface EvidenceCrafterOutput {
  evidence: Evidence[];
  phases: PhaseData[];
  redHerrings: RedHerring[];
  trueClues: Array<{
    evidenceId: string;
    pointsTo: string;
    killerRole: "mastermind" | "executor";
    howItReveals: string;
    requiredCollaboration: string[];
    difficultyToSpot: "easy" | "medium" | "hard";
  }>;
  centralMechanic: {
    name: string;
    phase1Evidence: string[];
    phase1Observation: string;
    phase2Evidence: string[];
    phase2Observation: string;
    phase3Revelation: string;
    ahaConnection: string;
  };
  solutionPath: {
    minimumCluesNeeded: number;
    optimalPath: string[];
    collaborationRequired: string;
  };
}

export interface EvidenceCrafterInput {
  storyFoundation: StoryArchitectOutput;
  characters: CharacterDesignerOutput;
  playerCount: number;
  duration: number;
  difficulty: string;
}

export async function runEvidenceCrafter(
  input: EvidenceCrafterInput,
  onProgress?: ProgressCallback
): Promise<AgentResult<EvidenceCrafterOutput>> {
  const formattedInput = {
    instructions:
      "Create the complete evidence chain for this murder mystery, distributed across phases and detectives.",
    storyFoundation: {
      title: input.storyFoundation.title,
      victim: input.storyFoundation.victim,
      murderMethod: input.storyFoundation.murderMethod,
      solution: input.storyFoundation.solution,
      centralMechanic: input.storyFoundation.murderMethod.centralMechanic,
    },
    suspects: input.characters.suspects.map((s) => ({
      id: s.id,
      name: s.name,
      tier: s.tier,
      isKiller: s.isKiller,
      killerRole: s.killerRole,
      isRedHerring: s.isRedHerring,
      motive: s.motive,
      alibi: s.alibi,
    })),
    relationships: input.characters.relationships,
    redHerringStrategy: input.characters.redHerringStrategy,
    gameParameters: {
      playerCount: input.playerCount,
      detectiveCount: Math.min(input.playerCount, 5),
      duration: input.duration,
      difficulty: input.difficulty,
    },
    requirements: {
      evidenceCount: "15-25 items",
      phaseStructure: [
        { phase: 1, duration: 20, purpose: "Establish facts, plant early clues" },
        {
          phase: 2,
          duration: 30,
          purpose: "Deepen investigation, create contradictions",
        },
        { phase: 3, duration: 15, purpose: "Twist revelation, key connections" },
      ],
      trueCluesMinimum: 5,
      redHerringsMinimum: 12,
    },
    guidelines: [
      "Each detective gets 3-5 unique evidence items per phase",
      "No single detective can solve the mystery alone",
      "True clues require cross-detective collaboration",
      "Red herrings must be eliminable through investigation",
      "Central mechanic evidence must be distributed across phases",
      "Evidence IDs in format: EV-001, EV-002, etc.",
    ],
  };

  return runAgentWithRetry<EvidenceCrafterOutput>(
    "evidence-crafter",
    formatAgentInput(formattedInput),
    { maxTokens: 12000 },
    onProgress
  );
}
