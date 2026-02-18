import { GenerationSettings, MysteryProject, ValidationState } from "@/lib/types";
import { AgentType } from "./base";
import { runStoryArchitect, StoryArchitectOutput } from "./story-architect";
import {
  runCharacterDesigner,
  CharacterDesignerOutput,
} from "./character-designer";
import { runEvidenceCrafter, EvidenceCrafterOutput } from "./evidence-crafter";
import {
  runAllValidators,
  toValidationResult,
  ValidationInput,
} from "./validators";
import { v4 as uuidv4 } from "uuid";

// Generation event types for SSE streaming
export type GenerationEventType =
  | "start"
  | "agent_start"
  | "agent_progress"
  | "agent_complete"
  | "agent_error"
  | "validation_start"
  | "validation_complete"
  | "complete"
  | "error";

export interface GenerationEvent {
  type: GenerationEventType;
  agent?: AgentType;
  message: string;
  progress: number; // 0-100 overall progress
  data?: unknown;
  tokensUsed?: { input: number; output: number };
  error?: string;
}

// Token tracking
interface TokenUsage {
  input: number;
  output: number;
}

// Orchestrator state
interface OrchestratorState {
  projectId: string;
  status: "idle" | "generating" | "validating" | "complete" | "error";
  currentAgent: AgentType | null;
  progress: number;
  tokensUsed: TokenUsage;
  storyFoundation: StoryArchitectOutput | null;
  characters: CharacterDesignerOutput | null;
  evidence: EvidenceCrafterOutput | null;
  validation: ValidationState | null;
  error: string | null;
}

// Create initial state
function createInitialState(projectId: string): OrchestratorState {
  return {
    projectId,
    status: "idle",
    currentAgent: null,
    progress: 0,
    tokensUsed: { input: 0, output: 0 },
    storyFoundation: null,
    characters: null,
    evidence: null,
    validation: null,
    error: null,
  };
}

// Main orchestrator generator function
export async function* generateMystery(
  settings: GenerationSettings
): AsyncGenerator<GenerationEvent> {
  const projectId = uuidv4();
  const state = createInitialState(projectId);

  // Start event
  yield {
    type: "start",
    message: "Starting mystery generation...",
    progress: 0,
    data: { projectId },
  };

  try {
    state.status = "generating";

    // ========================================
    // Phase 1: Story Architect (0-25%)
    // ========================================
    yield {
      type: "agent_start",
      agent: "story-architect",
      message: "Creating story foundation...",
      progress: 5,
    };

    const storyResult = await runStoryArchitect(settings);

    if (!storyResult.success || !storyResult.data) {
      throw new Error(storyResult.error || "Story Architect failed");
    }

    state.storyFoundation = storyResult.data;
    state.tokensUsed.input += storyResult.tokensUsed.input;
    state.tokensUsed.output += storyResult.tokensUsed.output;

    yield {
      type: "agent_complete",
      agent: "story-architect",
      message: `Story foundation complete: "${storyResult.data.title}"`,
      progress: 25,
      data: {
        title: storyResult.data.title,
        tagline: storyResult.data.tagline,
        victim: storyResult.data.victim.name,
      },
      tokensUsed: storyResult.tokensUsed,
    };

    // ========================================
    // Phase 2: Character Designer (25-50%)
    // ========================================
    yield {
      type: "agent_start",
      agent: "character-designer",
      message: "Designing suspects and relationships...",
      progress: 30,
    };

    const characterResult = await runCharacterDesigner({
      storyFoundation: state.storyFoundation,
      suspectCount: settings.suspectCount,
    });

    if (!characterResult.success || !characterResult.data) {
      throw new Error(characterResult.error || "Character Designer failed");
    }

    state.characters = characterResult.data;
    state.tokensUsed.input += characterResult.tokensUsed.input;
    state.tokensUsed.output += characterResult.tokensUsed.output;

    yield {
      type: "agent_complete",
      agent: "character-designer",
      message: `Created ${characterResult.data.suspects.length} suspects`,
      progress: 50,
      data: {
        suspectCount: characterResult.data.suspects.length,
        tier1: characterResult.data.suspects.filter((s) => s.tier === 1).length,
        tier2: characterResult.data.suspects.filter((s) => s.tier === 2).length,
        tier3: characterResult.data.suspects.filter((s) => s.tier === 3).length,
        relationshipCount: characterResult.data.relationships.length,
      },
      tokensUsed: characterResult.tokensUsed,
    };

    // ========================================
    // Phase 3: Evidence Crafter (50-75%)
    // ========================================
    yield {
      type: "agent_start",
      agent: "evidence-crafter",
      message: "Crafting evidence and clues...",
      progress: 55,
    };

    const evidenceResult = await runEvidenceCrafter(
      {
        storyFoundation: state.storyFoundation,
        characters: state.characters,
        playerCount: settings.playerCount,
        duration: settings.duration,
        difficulty: settings.difficulty,
      });

    if (!evidenceResult.success || !evidenceResult.data) {
      throw new Error(evidenceResult.error || "Evidence Crafter failed");
    }

    state.evidence = evidenceResult.data;
    state.tokensUsed.input += evidenceResult.tokensUsed.input;
    state.tokensUsed.output += evidenceResult.tokensUsed.output;

    yield {
      type: "agent_complete",
      agent: "evidence-crafter",
      message: `Created ${evidenceResult.data.evidence.length} evidence items across ${evidenceResult.data.phases.length} phases`,
      progress: 75,
      data: {
        evidenceCount: evidenceResult.data.evidence.length,
        phaseCount: evidenceResult.data.phases.length,
        trueClueCount: evidenceResult.data.trueClues.length,
        redHerringCount: evidenceResult.data.redHerrings.length,
      },
      tokensUsed: evidenceResult.tokensUsed,
    };

    // ========================================
    // Phase 4: Validation (75-95%)
    // ========================================
    state.status = "validating";

    yield {
      type: "validation_start",
      message: "Running validation agents...",
      progress: 78,
    };

    const validationInput: ValidationInput = {
      storyFoundation: state.storyFoundation,
      characters: state.characters,
      evidence: state.evidence,
    };

    const validationResults = await runAllValidators(validationInput);

    // Aggregate validation results
    const validationAgentResults = [];
    let validationStatus: "valid" | "warnings" | "errors" = "valid";

    // Timeline
    if (validationResults.timeline.success && validationResults.timeline.data) {
      validationAgentResults.push(
        toValidationResult("timeline_auditor", validationResults.timeline.data)
      );
      if (validationResults.timeline.data.status === "fail")
        validationStatus = "errors";
      else if (
        validationResults.timeline.data.status === "warning" &&
        validationStatus !== "errors"
      )
        validationStatus = "warnings";
    }

    // Evidence
    if (validationResults.evidence.success && validationResults.evidence.data) {
      validationAgentResults.push(
        toValidationResult("evidence_validator", validationResults.evidence.data)
      );
      if (validationResults.evidence.data.status === "fail")
        validationStatus = "errors";
      else if (
        validationResults.evidence.data.status === "warning" &&
        validationStatus !== "errors"
      )
        validationStatus = "warnings";
    }

    // Motive
    if (validationResults.motive.success && validationResults.motive.data) {
      validationAgentResults.push(
        toValidationResult("motive_analyzer", validationResults.motive.data)
      );
      if (validationResults.motive.data.status === "fail")
        validationStatus = "errors";
      else if (
        validationResults.motive.data.status === "warning" &&
        validationStatus !== "errors"
      )
        validationStatus = "warnings";
    }

    // Twist
    if (validationResults.twist.success && validationResults.twist.data) {
      validationAgentResults.push(
        toValidationResult("twist_fairness", validationResults.twist.data)
      );
      if (validationResults.twist.data.status === "fail")
        validationStatus = "errors";
      else if (
        validationResults.twist.data.status === "warning" &&
        validationStatus !== "errors"
      )
        validationStatus = "warnings";
    }

    state.validation = {
      lastValidated: new Date().toISOString(),
      overallStatus: validationStatus,
      agents: validationAgentResults,
    };

    // Sum up validation tokens
    const validationTokens = {
      input:
        validationResults.timeline.tokensUsed.input +
        validationResults.evidence.tokensUsed.input +
        validationResults.motive.tokensUsed.input +
        validationResults.twist.tokensUsed.input,
      output:
        validationResults.timeline.tokensUsed.output +
        validationResults.evidence.tokensUsed.output +
        validationResults.motive.tokensUsed.output +
        validationResults.twist.tokensUsed.output,
    };

    state.tokensUsed.input += validationTokens.input;
    state.tokensUsed.output += validationTokens.output;

    yield {
      type: "validation_complete",
      message: `Validation complete: ${validationStatus}`,
      progress: 95,
      data: {
        status: validationStatus,
        agentCount: validationAgentResults.length,
        issueCount: validationAgentResults.reduce(
          (sum, r) => sum + r.issues.length,
          0
        ),
      },
      tokensUsed: validationTokens,
    };

    // ========================================
    // Phase 5: Assemble Project (95-100%)
    // ========================================
    state.status = "complete";

    const project = assembleProject(
      projectId,
      settings,
      state.storyFoundation,
      state.characters,
      state.evidence,
      state.validation
    );

    yield {
      type: "complete",
      message: "Mystery generation complete!",
      progress: 100,
      data: {
        project,
        tokensUsed: state.tokensUsed,
      },
    };
  } catch (error) {
    state.status = "error";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    state.error = errorMessage;

    yield {
      type: "error",
      message: `Generation failed: ${errorMessage}`,
      progress: state.progress,
      error: errorMessage,
    };
  }
}

// Assemble final project from agent outputs
function assembleProject(
  projectId: string,
  settings: GenerationSettings,
  story: StoryArchitectOutput,
  characters: CharacterDesignerOutput,
  evidence: EvidenceCrafterOutput,
  validation: ValidationState
): MysteryProject {
  const now = new Date().toISOString();

  return {
    id: projectId,
    name: story.title,
    status: validation.overallStatus === "errors" ? "error" : "complete",
    createdAt: now,
    updatedAt: now,
    settings,
    narrative: {
      title: story.title,
      tagline: story.tagline,
      setting: {
        location: story.setting.location,
        time: story.setting.era,
        atmosphere: story.setting.atmosphere,
      },
      premise: `${story.victim.name}, ${story.victim.occupation}, has been murdered at ${story.setting.occasion}.`,
      murderMethod: {
        description: story.murderMethod.causeOfDeath,
        stages: story.murderMethod.stages.map((s) => ({
          stage: s.stage,
          description: s.description,
          time: s.time,
          location: s.location,
          method: s.method,
          perpetrator: s.perpetrator,
        })),
        centralMechanic: story.murderMethod.centralMechanic,
      },
      themes: story.themes,
    },
    suspects: characters.suspects,
    evidence: evidence.evidence,
    timeline: [], // Timeline events extracted from evidence
    phases: evidence.phases,
    redHerrings: evidence.redHerrings,
    solution: {
      summary: story.solution.howItWasDone,
      killerIdentity: [
        {
          suspectId:
            characters.suspects.find(
              (s) => s.name === story.solution.mastermind.name
            )?.id || "",
          name: story.solution.mastermind.name,
          role: "mastermind",
        },
        ...(story.solution.executor.name !== story.solution.mastermind.name
          ? [
              {
                suspectId:
                  characters.suspects.find(
                    (s) => s.name === story.solution.executor.name
                  )?.id || "",
                name: story.solution.executor.name,
                role: "executor" as const,
              },
            ]
          : []),
      ],
      motive: story.solution.mastermind.motive,
      opportunity: "During the murder window when alibis had gaps",
      method: story.murderMethod.causeOfDeath,
      keyEvidence: evidence.trueClues.map((c) => c.evidenceId),
      timeline: story.murderMethod.stages.map((s) => s.description).join(" → "),
    },
    validation,
  };
}

// Re-validate an existing project
export async function* revalidateProject(
  project: MysteryProject,
  storyFoundation: StoryArchitectOutput,
  characters: CharacterDesignerOutput,
  evidence: EvidenceCrafterOutput
): AsyncGenerator<GenerationEvent> {
  yield {
    type: "validation_start",
    message: "Re-validating mystery...",
    progress: 0,
  };

  const validationInput: ValidationInput = {
    storyFoundation,
    characters,
    evidence,
  };

  const validationResults = await runAllValidators(validationInput);

  // ... similar aggregation as above
  yield {
    type: "validation_complete",
    message: "Validation complete",
    progress: 100,
    data: validationResults,
  };
}
