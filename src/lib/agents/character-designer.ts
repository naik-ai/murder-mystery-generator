import {
  runAgentWithRetry,
  formatAgentInput,
  AgentResult,
  ProgressCallback,
} from "./base";
import { StoryArchitectOutput } from "./story-architect";
import { Suspect, Relationship } from "@/lib/types";

// Character Designer Output Types
export interface CharacterDesignerOutput {
  suspects: Suspect[];
  relationships: Relationship[];
  redHerringStrategy: {
    primaryRedHerring: string;
    reason: string;
    innocenceProof: string;
  };
}

export interface CharacterDesignerInput {
  storyFoundation: StoryArchitectOutput;
  suspectCount: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
}

export async function runCharacterDesigner(
  input: CharacterDesignerInput,
  onProgress?: ProgressCallback
): Promise<AgentResult<CharacterDesignerOutput>> {
  const formattedInput = {
    instructions:
      "Create the full cast of suspects for this murder mystery based on the story foundation.",
    storyFoundation: {
      title: input.storyFoundation.title,
      victim: input.storyFoundation.victim,
      setting: input.storyFoundation.setting,
      murderMethod: input.storyFoundation.murderMethod,
      solution: input.storyFoundation.solution,
      themes: input.storyFoundation.themes,
    },
    requirements: {
      suspectCount: input.suspectCount,
      totalSuspects:
        input.suspectCount.tier1 +
        input.suspectCount.tier2 +
        input.suspectCount.tier3,
      tier1Description:
        "Core suspects with full profiles, strong motives, detailed evidence connections",
      tier2Description:
        "Secondary suspects with medium profiles, moderate involvement",
      tier3Description:
        "Background characters for alibis and atmosphere",
    },
    killerIdentities: {
      mastermind: input.storyFoundation.solution.mastermind.name,
      executor: input.storyFoundation.solution.executor.name,
    },
    guidelines: [
      "Include the identified killers in Tier 1",
      "Create 2-3 strong red herrings in Tier 1",
      "Ensure complex relationship web between suspects",
      "Each Tier 1 suspect needs: full backstory, strong motive, alibi with holes, secrets",
      "Red herring should appear MORE guilty than actual killers",
      "All suspects need unique IDs in format: suspect-001, suspect-002, etc.",
    ],
  };

  return runAgentWithRetry<CharacterDesignerOutput>(
    "character-designer",
    formatAgentInput(formattedInput),
    { maxTokens: 12000 }, // Characters need more tokens
    onProgress
  );
}
