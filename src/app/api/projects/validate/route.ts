import { NextRequest } from "next/server";
import { loadProject, updateProject } from "@/lib/storage";
import { runAllValidators, toValidationResult, ValidationInput } from "@/lib/agents";
import { ValidationState } from "@/lib/types";

// POST - Re-validate a project
export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return new Response(
        JSON.stringify({ success: false, error: "projectId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const project = await loadProject(projectId);

    if (!project) {
      return new Response(
        JSON.stringify({ success: false, error: "Project not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // We need the original agent outputs for validation
    // For now, we'll construct a partial input from the project data
    // In a full implementation, you'd store the agent outputs separately

    // This is a simplified validation - in production you'd want to
    // reconstruct or store the full agent outputs
    const validationInput: ValidationInput = {
      storyFoundation: {
        title: project.narrative?.title || project.name,
        tagline: project.narrative?.tagline || "",
        victim: {
          name: "Victim",
          age: 50,
          occupation: "Unknown",
          netWorth: "Unknown",
          description: "",
          background: "",
          relationships: [],
          secrets: [],
        },
        setting: {
          location: project.narrative?.setting?.location || "",
          locationType: "Estate",
          country: "Unknown",
          city: "Unknown",
          era: project.narrative?.setting?.time || "",
          occasion: "",
          atmosphere: project.narrative?.setting?.atmosphere || "",
          guestCount: 20,
        },
        murderMethod: {
          primaryCause: project.settings.murderMethod.cause,
          stages: project.narrative?.murderMethod?.stages || [],
          causeOfDeath: project.narrative?.murderMethod?.description || "",
          keyMystery: "",
          centralMechanic: project.settings.murderMethod.centralMechanic,
        },
        solution: {
          mastermind: {
            name: project.solution?.killerIdentity?.[0]?.name || "",
            relationship: "",
            motive: project.solution?.motive || "",
          },
          executor: {
            name: project.solution?.killerIdentity?.[1]?.name || project.solution?.killerIdentity?.[0]?.name || "",
            relationship: "",
            role: "executor",
          },
          howItWasDone: project.solution?.summary || "",
          howToSolve: [],
        },
        themes: project.narrative?.themes || [],
      },
      characters: {
        suspects: project.suspects,
        relationships: project.suspects.flatMap((s) => s.relationships || []),
        redHerringStrategy: {
          primaryRedHerring: project.suspects.find((s) => s.isRedHerring)?.id || "",
          reason: "",
          innocenceProof: "",
        },
      },
      evidence: {
        evidence: project.evidence,
        phases: project.phases,
        redHerrings: project.redHerrings,
        trueClues: project.evidence
          .filter((e) => e.isClue)
          .map((e) => ({
            evidenceId: e.id,
            pointsTo: e.pointsTo || "",
            killerRole: "mastermind" as const,
            howItReveals: "",
            requiredCollaboration: [],
            difficultyToSpot: "medium" as const,
          })),
        centralMechanic: {
          name: project.settings.murderMethod.centralMechanic,
          phase1Evidence: [],
          phase1Observation: "",
          phase2Evidence: [],
          phase2Observation: "",
          phase3Revelation: "",
          ahaConnection: "",
        },
        solutionPath: {
          minimumCluesNeeded: 5,
          optimalPath: [],
          collaborationRequired: "",
        },
      },
    };

    const results = await runAllValidators(validationInput);

    // Aggregate results
    const validationAgentResults = [];
    let validationStatus: "valid" | "warnings" | "errors" = "valid";

    if (results.timeline.success && results.timeline.data) {
      validationAgentResults.push(
        toValidationResult("timeline_auditor", results.timeline.data)
      );
      if (results.timeline.data.status === "fail") validationStatus = "errors";
      else if (results.timeline.data.status === "warning" && validationStatus !== "errors")
        validationStatus = "warnings";
    }

    if (results.evidence.success && results.evidence.data) {
      validationAgentResults.push(
        toValidationResult("evidence_validator", results.evidence.data)
      );
      if (results.evidence.data.status === "fail") validationStatus = "errors";
      else if (results.evidence.data.status === "warning" && validationStatus !== "errors")
        validationStatus = "warnings";
    }

    if (results.motive.success && results.motive.data) {
      validationAgentResults.push(
        toValidationResult("motive_analyzer", results.motive.data)
      );
      if (results.motive.data.status === "fail") validationStatus = "errors";
      else if (results.motive.data.status === "warning" && validationStatus !== "errors")
        validationStatus = "warnings";
    }

    if (results.twist.success && results.twist.data) {
      validationAgentResults.push(
        toValidationResult("twist_fairness", results.twist.data)
      );
      if (results.twist.data.status === "fail") validationStatus = "errors";
      else if (results.twist.data.status === "warning" && validationStatus !== "errors")
        validationStatus = "warnings";
    }

    const validation: ValidationState = {
      lastValidated: new Date().toISOString(),
      overallStatus: validationStatus,
      agents: validationAgentResults,
    };

    // Update project with new validation
    await updateProject(projectId, { validation });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          validation,
          tokensUsed: {
            input:
              results.timeline.tokensUsed.input +
              results.evidence.tokensUsed.input +
              results.motive.tokensUsed.input +
              results.twist.tokensUsed.input,
            output:
              results.timeline.tokensUsed.output +
              results.evidence.tokensUsed.output +
              results.motive.tokensUsed.output +
              results.twist.tokensUsed.output,
          },
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
