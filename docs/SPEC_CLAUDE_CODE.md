# Claude Code Integration Specification

## Overview

The Murder Mystery Generator integrates with Claude Code to share authentication, enable CLI triggering from the web UI, and allow seamless handoff between the two interfaces.

---

## Authentication Sharing

### Claude Code Auth Location

Claude Code stores authentication in the user's home directory:

```
~/.claude/
├── config.json          # Configuration including auth settings
├── credentials.json     # API credentials (if stored locally)
└── settings.json        # User preferences
```

### Shared ANTHROPIC_API_KEY

Both the web app and Claude Code use the same environment variable:

```bash
# .env.local (Next.js)
ANTHROPIC_API_KEY=sk-ant-api03-...

# This is the same key Claude Code uses from:
# 1. Environment variable: ANTHROPIC_API_KEY
# 2. Claude Code config: ~/.claude/credentials.json
```

### Implementation

```typescript
// lib/claude-code/auth.ts

import fs from 'fs';
import path from 'path';
import os from 'os';

interface ClaudeCodeConfig {
  apiKey?: string;
  model?: string;
  workspaceDir?: string;
}

export function getAnthropicApiKey(): string {
  // Priority 1: Environment variable
  if (process.env.ANTHROPIC_API_KEY) {
    return process.env.ANTHROPIC_API_KEY;
  }

  // Priority 2: Claude Code credentials file
  const credentialsPath = path.join(os.homedir(), '.claude', 'credentials.json');
  if (fs.existsSync(credentialsPath)) {
    try {
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
      if (credentials.apiKey) {
        return credentials.apiKey;
      }
    } catch (e) {
      console.warn('Could not read Claude Code credentials:', e);
    }
  }

  throw new Error('No ANTHROPIC_API_KEY found. Set it in environment or Claude Code.');
}

export function getClaudeCodeConfig(): ClaudeCodeConfig | null {
  const configPath = path.join(os.homedir(), '.claude', 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (e) {
      return null;
    }
  }
  return null;
}
```

---

## Triggering Claude Code from Web UI

### Use Cases

1. **Refine Generated Content**: Open project in Claude Code for manual adjustments
2. **Debug Issues**: Launch Claude Code with project context for troubleshooting
3. **Extended Editing**: Complex changes that need full Claude Code capabilities

### CLI Trigger Implementation

```typescript
// lib/claude-code/trigger.ts

import { exec, spawn } from 'child_process';
import path from 'path';

interface TriggerOptions {
  projectPath: string;
  instruction?: string;
  openInTerminal?: boolean;
}

interface TriggerResult {
  success: boolean;
  processId?: number;
  error?: string;
}

/**
 * Trigger Claude Code CLI with a project directory
 */
export async function triggerClaudeCode(options: TriggerOptions): Promise<TriggerResult> {
  const { projectPath, instruction, openInTerminal } = options;

  // Verify project exists
  if (!fs.existsSync(projectPath)) {
    return { success: false, error: 'Project path does not exist' };
  }

  // Build command
  let command = `claude`;
  const args: string[] = [];

  // Add project directory
  args.push('--cwd', projectPath);

  // Add instruction if provided
  if (instruction) {
    args.push('--prompt', instruction);
  }

  if (openInTerminal) {
    // Open in new terminal window (macOS)
    const fullCommand = `${command} ${args.join(' ')}`;
    const terminalCommand = `osascript -e 'tell application "Terminal" to do script "${fullCommand}"'`;

    return new Promise((resolve) => {
      exec(terminalCommand, (error) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true });
        }
      });
    });
  } else {
    // Spawn detached process
    const childProcess = spawn(command, args, {
      detached: true,
      stdio: 'ignore',
      cwd: projectPath
    });

    childProcess.unref();

    return {
      success: true,
      processId: childProcess.pid
    };
  }
}

/**
 * Check if Claude Code CLI is installed and accessible
 */
export async function isClaudeCodeAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('which claude', (error) => {
      resolve(!error);
    });
  });
}

/**
 * Get Claude Code version
 */
export async function getClaudeCodeVersion(): Promise<string | null> {
  return new Promise((resolve) => {
    exec('claude --version', (error, stdout) => {
      if (error) {
        resolve(null);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}
```

### API Route

```typescript
// app/api/claude-code/trigger/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { triggerClaudeCode, isClaudeCodeAvailable } from '@/lib/claude-code/trigger';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { projectId, instruction, openInTerminal } = body;

  // Check Claude Code availability
  const available = await isClaudeCodeAvailable();
  if (!available) {
    return NextResponse.json(
      { error: 'Claude Code CLI not found. Install with: npm install -g @anthropic-ai/claude-code' },
      { status: 400 }
    );
  }

  // Get project path
  const projectPath = path.join(
    process.env.MYSTERY_DATA_PATH || './data/projects',
    projectId
  );

  // Trigger Claude Code
  const result = await triggerClaudeCode({
    projectPath,
    instruction,
    openInTerminal: openInTerminal ?? true
  });

  if (result.success) {
    return NextResponse.json({ success: true, processId: result.processId });
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
}

export async function GET() {
  const available = await isClaudeCodeAvailable();
  const version = available ? await getClaudeCodeVersion() : null;

  return NextResponse.json({
    available,
    version,
    configPath: path.join(os.homedir(), '.claude')
  });
}
```

### UI Component

```typescript
// components/ClaudeCodeButton.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Terminal, ExternalLink } from 'lucide-react';

interface ClaudeCodeButtonProps {
  projectId: string;
  instruction?: string;
}

export function ClaudeCodeButton({ projectId, instruction }: ClaudeCodeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/claude-code/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          instruction,
          openInTerminal: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      }
    } catch (e) {
      setError('Failed to trigger Claude Code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        disabled={isLoading}
        variant="outline"
      >
        <Terminal className="w-4 h-4 mr-2" />
        {isLoading ? 'Opening...' : 'Open in Claude Code'}
        <ExternalLink className="w-3 h-3 ml-2" />
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
```

---

## Shared Project Directory

### Directory Structure

Projects are stored in a shared location accessible by both apps:

```
~/mystery-projects/                    # MYSTERY_DATA_PATH
├── proj_abc123/
│   ├── project.json                  # Full project data
│   ├── .claude-instructions.md       # Instructions for Claude Code
│   ├── exports/
│   │   ├── 00_GAME_MASTER_BLUEPRINT.md
│   │   ├── 01_CASE_BRIEF.md
│   │   └── ...
│   └── validations/
│       └── latest.json
└── proj_def456/
    └── ...
```

### Claude Instructions File

When Claude Code opens a project, it reads `.claude-instructions.md`:

```markdown
# Murder Mystery Project: The Last Toast

## Project Overview
This is a murder mystery game with 23 suspects, 8 evidence items, and 4 phases.

## Current Status
- Generation: Complete
- Validation: 3 warnings, 0 errors

## Files
- `project.json` - Full project data (source of truth)
- `exports/` - Generated markdown files
- `validations/` - Validation results

## Suggested Tasks
1. Review and fix validation warnings
2. Refine suspect dialogue
3. Adjust evidence distribution
4. Regenerate specific documents

## How to Regenerate
Edit `project.json` and run validation:
- Update suspect properties
- Modify timeline events
- Adjust evidence assignments

The web UI will detect changes and offer to regenerate documents.
```

### File Sync Implementation

```typescript
// lib/storage/file-sync.ts

import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

interface SyncOptions {
  projectPath: string;
  onExternalChange: (file: string) => void;
}

/**
 * Watch project directory for external changes (e.g., from Claude Code)
 */
export function watchProjectChanges(options: SyncOptions) {
  const { projectPath, onExternalChange } = options;

  const watcher = chokidar.watch(projectPath, {
    ignored: /node_modules/,
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', (filePath) => {
    // Only notify for relevant files
    if (
      filePath.endsWith('.json') ||
      filePath.endsWith('.md')
    ) {
      onExternalChange(filePath);
    }
  });

  return () => watcher.close();
}

/**
 * Generate Claude instructions file for a project
 */
export function generateClaudeInstructions(project: MysteryProject): string {
  const warnings = project.validation?.results?.filter(
    r => r.status === 'warning'
  ).length ?? 0;
  const errors = project.validation?.results?.filter(
    r => r.status === 'fail'
  ).length ?? 0;

  return `# Murder Mystery Project: ${project.name}

## Project Overview
This is a murder mystery game with ${project.suspects.length} suspects, ${project.evidence.length} evidence items, and ${project.phases.length} phases.

## Current Status
- Generation: ${project.status}
- Validation: ${warnings} warnings, ${errors} errors

## Files
- \`project.json\` - Full project data (source of truth)
- \`exports/\` - Generated markdown files
- \`validations/\` - Validation results

## Key Information
- Victim: ${project.narrative.victim.name}
- Killers: ${project.solution.killers.map(k => k.name).join(', ')}
- Central Mechanic: ${project.narrative.murderMethod.centralMechanic}

## Editing Guidelines
1. Edit \`project.json\` to modify the mystery
2. The web UI will detect changes
3. Re-export documents after changes

## Suggested Tasks
${project.validation?.results
  ?.filter(r => r.issues.length > 0)
  ?.flatMap(r => r.issues.map(i => `- ${i.message}`))
  ?.join('\n') || '- No issues found'}
`;
}

/**
 * Save Claude instructions file
 */
export function saveClaudeInstructions(projectPath: string, project: MysteryProject) {
  const instructions = generateClaudeInstructions(project);
  const instructionsPath = path.join(projectPath, '.claude-instructions.md');
  fs.writeFileSync(instructionsPath, instructions, 'utf-8');
}
```

---

## Environment Configuration

### .env.example

```bash
# API Key (same as Claude Code uses)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Project storage location (shared with Claude Code)
MYSTERY_DATA_PATH=~/mystery-projects

# Default model for generation
DEFAULT_MODEL=claude-sonnet-4-20250514

# Default model for validation (cheaper)
VALIDATION_MODEL=claude-haiku-3-20240307

# Enable debug logging
DEBUG=false
```

### Reading Claude Code Settings

```typescript
// lib/claude-code/settings.ts

import fs from 'fs';
import path from 'path';
import os from 'os';

interface ClaudeCodeSettings {
  theme?: 'light' | 'dark' | 'system';
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export function readClaudeCodeSettings(): ClaudeCodeSettings {
  const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');

  if (fs.existsSync(settingsPath)) {
    try {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch (e) {
      return {};
    }
  }

  return {};
}

export function getDefaultModel(): string {
  const settings = readClaudeCodeSettings();
  return settings.model || process.env.DEFAULT_MODEL || 'claude-sonnet-4-20250514';
}
```

---

## Security Considerations

### API Key Protection

1. **Never expose API key to client**: All Claude API calls happen server-side
2. **Environment variables**: Use `.env.local` (not committed to git)
3. **Credential file permissions**: `~/.claude/` should be user-read-only

### Project Access

1. **Local filesystem only**: No cloud storage by default
2. **User's home directory**: Projects stored in user-controlled location
3. **No network exposure**: Web server only listens on localhost

### Claude Code Trigger

1. **Validate project paths**: Prevent directory traversal
2. **Sanitize instructions**: Escape shell characters
3. **User confirmation**: Require explicit action to open Claude Code

---

## Testing Claude Code Integration

### Manual Test Script

```bash
#!/bin/bash

# test-claude-code-integration.sh

echo "Testing Claude Code Integration..."

# 1. Check Claude Code installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code CLI not found"
    exit 1
fi
echo "✓ Claude Code CLI found: $(claude --version)"

# 2. Check API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    if [ -f ~/.claude/credentials.json ]; then
        echo "✓ Credentials file exists"
    else
        echo "❌ No API key found"
        exit 1
    fi
else
    echo "✓ ANTHROPIC_API_KEY set"
fi

# 3. Check project directory
PROJECT_DIR="${MYSTERY_DATA_PATH:-~/mystery-projects}"
mkdir -p "$PROJECT_DIR"
echo "✓ Project directory: $PROJECT_DIR"

# 4. Test CLI trigger
echo "Testing CLI trigger (5 second timeout)..."
timeout 5 claude --help > /dev/null 2>&1
if [ $? -eq 0 ] || [ $? -eq 124 ]; then
    echo "✓ Claude Code CLI responds"
else
    echo "❌ Claude Code CLI failed"
    exit 1
fi

echo ""
echo "All tests passed!"
```

### Integration Test

```typescript
// __tests__/claude-code-integration.test.ts

import { isClaudeCodeAvailable, getClaudeCodeVersion } from '@/lib/claude-code/trigger';
import { getAnthropicApiKey } from '@/lib/claude-code/auth';

describe('Claude Code Integration', () => {
  test('Claude Code CLI is available', async () => {
    const available = await isClaudeCodeAvailable();
    expect(available).toBe(true);
  });

  test('Can get Claude Code version', async () => {
    const version = await getClaudeCodeVersion();
    expect(version).toMatch(/\d+\.\d+\.\d+/);
  });

  test('Can retrieve API key', () => {
    const apiKey = getAnthropicApiKey();
    expect(apiKey).toMatch(/^sk-ant-/);
  });
});
```
