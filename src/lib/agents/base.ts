import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";

// Agent types
export type AgentType =
  | "story-architect"
  | "character-designer"
  | "evidence-crafter"
  | "timeline-auditor"
  | "evidence-validator"
  | "motive-analyzer"
  | "twist-fairness";

export type GenerationAgentType =
  | "story-architect"
  | "character-designer"
  | "evidence-crafter";

export type ValidationAgentType =
  | "timeline-auditor"
  | "evidence-validator"
  | "motive-analyzer"
  | "twist-fairness";

// Agent output types
export interface AgentResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  tokensUsed: {
    input: number;
    output: number;
  };
  duration: number;
}

// Progress callback
export type ProgressCallback = (progress: AgentProgress) => void;

export interface AgentProgress {
  agent: AgentType;
  stage: "starting" | "processing" | "parsing" | "complete" | "error";
  message: string;
  progress: number; // 0-100
}

// Configuration
export interface AgentConfig {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

const DEFAULT_CONFIG: Required<AgentConfig> = {
  model: process.env.DEFAULT_MODEL || "claude-sonnet-4-20250514",
  maxTokens: 8192,
  temperature: 0.7,
};

const VALIDATION_CONFIG: Required<AgentConfig> = {
  model: process.env.VALIDATION_MODEL || "claude-sonnet-4-20250514",
  maxTokens: 4096,
  temperature: 0.3,
};

// Create Anthropic client
let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY environment variable is not set. " +
          "Please add it to your .env.local file."
      );
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

// Load system prompt from file
export function loadSystemPrompt(agentType: AgentType): string {
  const promptPath = join(process.cwd(), "prompts", `${agentType}.md`);
  try {
    return readFileSync(promptPath, "utf-8");
  } catch {
    throw new Error(`System prompt not found for agent: ${agentType}`);
  }
}

// Base agent runner
export async function runAgent<T>(
  agentType: AgentType,
  userPrompt: string,
  config?: AgentConfig,
  onProgress?: ProgressCallback
): Promise<AgentResult<T>> {
  const startTime = Date.now();
  const isValidation = [
    "timeline-auditor",
    "evidence-validator",
    "motive-analyzer",
    "twist-fairness",
  ].includes(agentType);

  const finalConfig = {
    ...(isValidation ? VALIDATION_CONFIG : DEFAULT_CONFIG),
    ...config,
  };

  onProgress?.({
    agent: agentType,
    stage: "starting",
    message: `Starting ${agentType}...`,
    progress: 0,
  });

  try {
    const client = getAnthropicClient();
    const systemPrompt = loadSystemPrompt(agentType);

    onProgress?.({
      agent: agentType,
      stage: "processing",
      message: `${agentType} is generating...`,
      progress: 30,
    });

    const response = await client.messages.create({
      model: finalConfig.model,
      max_tokens: finalConfig.maxTokens,
      temperature: finalConfig.temperature,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    onProgress?.({
      agent: agentType,
      stage: "parsing",
      message: `Parsing ${agentType} response...`,
      progress: 80,
    });

    // Extract text content
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in response");
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/```json\n?([\s\S]*?)\n?```/);
    let data: T;

    if (jsonMatch) {
      data = JSON.parse(jsonMatch[1]) as T;
    } else {
      // Try parsing the entire response as JSON
      try {
        data = JSON.parse(textContent.text) as T;
      } catch {
        throw new Error("Could not parse JSON from agent response");
      }
    }

    onProgress?.({
      agent: agentType,
      stage: "complete",
      message: `${agentType} completed`,
      progress: 100,
    });

    return {
      success: true,
      data,
      tokensUsed: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
      duration: Date.now() - startTime,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    onProgress?.({
      agent: agentType,
      stage: "error",
      message: `${agentType} failed: ${errorMessage}`,
      progress: 0,
    });

    return {
      success: false,
      error: errorMessage,
      tokensUsed: { input: 0, output: 0 },
      duration: Date.now() - startTime,
    };
  }
}

// Retry wrapper
export async function runAgentWithRetry<T>(
  agentType: AgentType,
  userPrompt: string,
  config?: AgentConfig,
  onProgress?: ProgressCallback,
  maxRetries: number = 3
): Promise<AgentResult<T>> {
  let lastError: string = "";

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      onProgress?.({
        agent: agentType,
        stage: "starting",
        message: `Retrying ${agentType} (attempt ${attempt + 1}/${maxRetries})...`,
        progress: 0,
      });
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt))
      );
    }

    const result = await runAgent<T>(agentType, userPrompt, config, onProgress);

    if (result.success) {
      return result;
    }

    lastError = result.error || "Unknown error";
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`,
    tokensUsed: { input: 0, output: 0 },
    duration: 0,
  };
}

// Format input for agents
export function formatAgentInput(data: Record<string, unknown>): string {
  return JSON.stringify(data, null, 2);
}
