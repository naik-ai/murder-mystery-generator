import { promises as fs } from "fs";
import { join } from "path";
import { MysteryProject, ProjectListItem } from "@/lib/types";

// Get the data directory path
function getDataPath(): string {
  return process.env.MYSTERY_DATA_PATH || join(process.cwd(), "data", "projects");
}

// Ensure the data directory exists
async function ensureDataDir(): Promise<string> {
  const dataPath = getDataPath();
  try {
    await fs.access(dataPath);
  } catch {
    await fs.mkdir(dataPath, { recursive: true });
  }
  return dataPath;
}

// Save a project to disk
export async function saveProject(project: MysteryProject): Promise<void> {
  const dataPath = await ensureDataDir();
  const projectDir = join(dataPath, project.id);

  // Create project directory
  await fs.mkdir(projectDir, { recursive: true });

  // Save project.json
  await fs.writeFile(
    join(projectDir, "project.json"),
    JSON.stringify(project, null, 2),
    "utf-8"
  );

  // Generate markdown files
  await generateMarkdownFiles(projectDir, project);
}

// Load a project from disk
export async function loadProject(projectId: string): Promise<MysteryProject | null> {
  const dataPath = getDataPath();
  const projectPath = join(dataPath, projectId, "project.json");

  try {
    const data = await fs.readFile(projectPath, "utf-8");
    return JSON.parse(data) as MysteryProject;
  } catch {
    return null;
  }
}

// List all projects
export async function listProjects(): Promise<ProjectListItem[]> {
  const dataPath = await ensureDataDir();

  try {
    const entries = await fs.readdir(dataPath, { withFileTypes: true });
    const projects: ProjectListItem[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const project = await loadProject(entry.name);
        if (project) {
          projects.push({
            id: project.id,
            name: project.name,
            status: project.status,
            suspectCount: project.suspects.length,
            evidenceCount: project.evidence.length,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          });
        }
      }
    }

    // Sort by updatedAt descending
    projects.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return projects;
  } catch {
    return [];
  }
}

// Delete a project
export async function deleteProject(projectId: string): Promise<boolean> {
  const dataPath = getDataPath();
  const projectDir = join(dataPath, projectId);

  try {
    await fs.rm(projectDir, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

// Update a project
export async function updateProject(
  projectId: string,
  updates: Partial<MysteryProject>
): Promise<MysteryProject | null> {
  const project = await loadProject(projectId);
  if (!project) return null;

  const updatedProject = {
    ...project,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await saveProject(updatedProject);
  return updatedProject;
}

// Generate markdown files for a project
async function generateMarkdownFiles(
  projectDir: string,
  project: MysteryProject
): Promise<void> {
  // 00_GAME_MASTER_BLUEPRINT.md
  const blueprint = generateGameMasterBlueprint(project);
  await fs.writeFile(join(projectDir, "00_GAME_MASTER_BLUEPRINT.md"), blueprint);

  // 01_CASE_BRIEF.md
  const caseBrief = generateCaseBrief(project);
  await fs.writeFile(join(projectDir, "01_CASE_BRIEF.md"), caseBrief);

  // 02_PHASE_1_EVIDENCE.md
  const phase1 = generatePhaseEvidence(project, 1);
  await fs.writeFile(join(projectDir, "02_PHASE_1_EVIDENCE.md"), phase1);

  // 03_PHASE_2_EVIDENCE.md
  const phase2 = generatePhaseEvidence(project, 2);
  await fs.writeFile(join(projectDir, "03_PHASE_2_EVIDENCE.md"), phase2);

  // 04_PHASE_3_TWIST.md
  const phase3 = generatePhaseEvidence(project, 3);
  await fs.writeFile(join(projectDir, "04_PHASE_3_TWIST.md"), phase3);

  // 05_HOST_MATERIALS.md
  const hostMaterials = generateHostMaterials(project);
  await fs.writeFile(join(projectDir, "05_HOST_MATERIALS.md"), hostMaterials);

  // 06_APPENDIX_PERSONS.md
  const appendix = generatePersonsAppendix(project);
  await fs.writeFile(join(projectDir, "06_APPENDIX_PERSONS.md"), appendix);
}

// Generate Game Master Blueprint
function generateGameMasterBlueprint(project: MysteryProject): string {
  const { narrative, solution, suspects } = project;

  const killers = suspects.filter((s) => s.isKiller);
  const mastermind = killers.find((k) => k.killerRole === "mastermind");
  const executor = killers.find((k) => k.killerRole === "executor");

  return `# GAME MASTER BLUEPRINT
## ${narrative?.title || project.name}

**FOR HOST EYES ONLY**

---

## The Solution

### The Killers
${mastermind ? `- **Mastermind**: ${mastermind.name} (${mastermind.role})` : ""}
${executor && executor.id !== mastermind?.id ? `- **Executor**: ${executor.name} (${executor.role})` : ""}

### Motive
${solution?.motive || "Not specified"}

### How It Was Done
${solution?.summary || "Not specified"}

### Key Evidence
${solution?.keyEvidence?.map((e) => `- ${e}`).join("\n") || "Not specified"}

---

## Timeline of the Murder

${solution?.timeline || "See timeline events for details"}

---

## Suspect Quick Reference

| Name | Role | Killer? | Red Herring? |
|------|------|---------|--------------|
${suspects
  .filter((s) => s.tier === 1)
  .map(
    (s) =>
      `| ${s.name} | ${s.role} | ${s.isKiller ? "YES" : "No"} | ${s.isRedHerring ? "YES" : "No"} |`
  )
  .join("\n")}

---

## Themes
${narrative?.themes?.map((t) => `- ${t}`).join("\n") || "Not specified"}
`;
}

// Generate Case Brief
function generateCaseBrief(project: MysteryProject): string {
  const { narrative } = project;

  return `# ${narrative?.title || project.name}

*${narrative?.tagline || "A Murder Mystery"}*

---

## The Setting

**Location**: ${narrative?.setting?.location || "Unknown"}
**Time**: ${narrative?.setting?.time || "Unknown"}
**Atmosphere**: ${narrative?.setting?.atmosphere || "Mysterious"}

---

## The Premise

${narrative?.premise || "A murder has occurred. Your mission: find the killer."}

---

## Your Mission

You are a detective assigned to solve this case. Work with your fellow investigators to:

1. Examine the evidence
2. Interview suspects
3. Uncover secrets and lies
4. Identify the murderer(s)

**Remember**: No single detective has all the pieces. Collaboration is key.

---

## Investigation Phases

The investigation will proceed in three phases:
- **Phase 1** (20 min): Initial investigation and evidence gathering
- **Phase 2** (30 min): Deep investigation and cross-referencing
- **Phase 3** (15 min): Final revelations and accusation

Good luck, detectives.
`;
}

// Generate Phase Evidence
function generatePhaseEvidence(project: MysteryProject, phase: 1 | 2 | 3): string {
  const phaseData = project.phases.find((p) => p.phase === phase);
  const phaseEvidence = project.evidence.filter((e) => e.revealedInPhase === phase);

  const phaseTitle =
    phase === 1
      ? "INITIAL INVESTIGATION"
      : phase === 2
        ? "DEEP INVESTIGATION"
        : "THE REVELATION";

  return `# Phase ${phase}: ${phaseTitle}

${phaseData?.description || ""}

---

## Evidence Available This Phase

${phaseEvidence
  .map(
    (e) => `### ${e.id}: ${e.name}

**Type**: ${e.type}
**Location**: ${e.location}

${e.description}

${e.forensicDetails ? `**Forensic Analysis**: ${e.forensicDetails.analysis}\n**Results**: ${e.forensicDetails.results}` : ""}
`
  )
  .join("\n---\n\n")}

---

## Detective Assignments

${
  phaseData?.detectivePackets
    ?.map(
      (dp) => `### Detective ${dp.detective}: ${dp.name}
**Focus**: ${dp.specialInstructions}
**Assigned Evidence**: ${dp.assignedEvidence.join(", ")}
**Assigned Suspects**: ${dp.assignedSuspects.join(", ")}
`
    )
    .join("\n") || "See host materials for assignments"
}
`;
}

// Generate Host Materials
function generateHostMaterials(project: MysteryProject): string {
  const { solution, validation } = project;

  return `# HOST MATERIALS

## Scoring Guide

### Full Points (10 each)
- Correctly identify the mastermind
- Correctly identify the executor (if different)
- Correctly explain the motive
- Correctly explain the method

### Partial Points (5 each)
- Identify one killer but not both
- Partial motive explanation
- Partial method explanation

### Bonus Points (5 each)
- Correctly identify the central mechanic
- Clear the primary red herring with evidence

---

## Answer Key

**Mastermind**: ${solution?.killerIdentity?.find((k) => k.role === "mastermind")?.name || "Unknown"}
**Executor**: ${solution?.killerIdentity?.find((k) => k.role === "executor")?.name || "Same as mastermind"}
**Motive**: ${solution?.motive || "Unknown"}
**Method**: ${solution?.method || "Unknown"}
**Key Evidence**: ${solution?.keyEvidence?.join(", ") || "Unknown"}

---

## Validation Status

${validation?.overallStatus === "valid" ? "✅ Mystery validated successfully" : validation?.overallStatus === "warnings" ? "⚠️ Mystery has warnings" : "❌ Mystery has errors"}

${validation?.agents?.map((a) => `- ${a.agent}: ${a.status} (${a.issues.length} issues)`).join("\n") || ""}
`;
}

// Generate Persons Appendix
function generatePersonsAppendix(project: MysteryProject): string {
  const { suspects } = project;

  const tier1 = suspects.filter((s) => s.tier === 1);
  const tier2 = suspects.filter((s) => s.tier === 2);
  const tier3 = suspects.filter((s) => s.tier === 3);

  const formatSuspect = (s: (typeof suspects)[0]) => `### ${s.name}
**Age**: ${s.age} | **Role**: ${s.role}

${s.description}

**Background**: ${s.background}

**Personality**: ${s.personality.join(", ")}
`;

  return `# APPENDIX: PERSONS OF INTEREST

## Tier 1: Core Suspects

${tier1.map(formatSuspect).join("\n---\n\n")}

---

## Tier 2: Secondary Suspects

${tier2.map(formatSuspect).join("\n---\n\n")}

---

## Tier 3: Background Characters

${tier3.map(formatSuspect).join("\n---\n\n")}
`;
}
