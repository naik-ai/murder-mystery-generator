import {
  runAgentWithRetry,
  formatAgentInput,
  AgentResult,
  ProgressCallback,
} from "./base";
import { GenerationSettings } from "@/lib/types";

// Story Architect Output Types
export interface StoryArchitectOutput {
  title: string;
  tagline: string;
  victim: {
    name: string;
    age: number;
    occupation: string;
    netWorth: string;
    description: string;
    background: string;
    relationships: string[];
    secrets: string[];
  };
  setting: {
    location: string;
    locationType: string;
    country: string;
    city: string;
    era: string;
    occasion: string;
    atmosphere: string;
    guestCount: number;
  };
  murderMethod: {
    primaryCause: string;
    stages: Array<{
      stage: number;
      description: string;
      time: string;
      location: string;
      method: string;
      perpetrator: string;
    }>;
    causeOfDeath: string;
    keyMystery: string;
    centralMechanic: string;
  };
  solution: {
    mastermind: {
      name: string;
      relationship: string;
      motive: string;
    };
    executor: {
      name: string;
      relationship: string;
      role: string;
    };
    howItWasDone: string;
    howToSolve: string[];
  };
  themes: string[];
}

export async function runStoryArchitect(
  settings: GenerationSettings,
  onProgress?: ProgressCallback
): Promise<AgentResult<StoryArchitectOutput>> {
  const input = {
    instructions:
      "Create the foundational narrative for a murder mystery game based on these settings.",
    settings: {
      theme: settings.theme,
      location: settings.location,
      era: settings.era,
      occasion: settings.occasion,
      playerCount: settings.playerCount,
      duration: settings.duration,
      difficulty: settings.difficulty,
      murderMethod: settings.murderMethod,
      victimProfile: settings.victimProfile,
      killerCount: settings.killerCount,
      redHerringStrength: settings.redHerringStrength,
    },
    requirements: [
      `Create a mystery for ${settings.playerCount} players lasting ${settings.duration} minutes`,
      `Difficulty level: ${settings.difficulty}`,
      `Murder method: ${settings.murderMethod.cause} with ${settings.murderMethod.stages} stage(s)`,
      `Central mechanic: ${settings.murderMethod.centralMechanic}`,
      `Number of killers: ${settings.killerCount}`,
      `Red herring strength: ${settings.redHerringStrength}`,
    ],
  };

  return runAgentWithRetry<StoryArchitectOutput>(
    "story-architect",
    formatAgentInput(input),
    undefined,
    onProgress
  );
}
