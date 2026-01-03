"use client";

import { useState } from "react";
import { Save, Key, FolderOpen, Cpu, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [dataPath, setDataPath] = useState("~/mystery-projects");
  const [defaultModel, setDefaultModel] = useState("claude-sonnet-4-20250514");
  const [validationModel, setValidationModel] = useState("claude-haiku-3-20240307");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(var(--noir-bg),0.8)] border-b border-[rgba(var(--amber-500),0.1)]">
        <div className="px-8 py-6">
          <h1 className="font-display text-3xl font-bold text-[rgb(var(--paper))]">
            Settings
          </h1>
          <p className="text-[rgb(var(--paper-muted))] mt-1">
            Configure your Murder Mystery Generator
          </p>
        </div>
      </header>

      <div className="px-8 py-8 max-w-2xl">
        <div className="space-y-8">
          {/* API Key */}
          <div className="noir-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[rgba(var(--amber-500),0.2)] flex items-center justify-center">
                <Key className="w-5 h-5 text-[rgb(var(--amber-500))]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-[rgb(var(--paper))]">
                  API Configuration
                </h3>
                <p className="text-sm text-[rgb(var(--paper-muted))]">
                  Connect to Claude API
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[rgb(var(--paper-muted))]">Anthropic API Key</Label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="bg-[rgb(var(--noir-bg))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] font-mono"
              />
              <p className="text-xs text-[rgb(var(--paper-dim))] flex items-center gap-1">
                <Info className="w-3 h-3" />
                Uses the same key as Claude Code if set in environment
              </p>
            </div>
          </div>

          {/* Storage */}
          <div className="noir-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[rgba(var(--amber-500),0.2)] flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-[rgb(var(--amber-500))]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-[rgb(var(--paper))]">
                  Storage
                </h3>
                <p className="text-sm text-[rgb(var(--paper-muted))]">
                  Project file location
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[rgb(var(--paper-muted))]">Data Path</Label>
              <Input
                value={dataPath}
                onChange={(e) => setDataPath(e.target.value)}
                placeholder="~/mystery-projects"
                className="bg-[rgb(var(--noir-bg))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] font-mono"
              />
              <p className="text-xs text-[rgb(var(--paper-dim))]">
                Directory where mystery projects are saved
              </p>
            </div>
          </div>

          {/* Model Configuration */}
          <div className="noir-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[rgba(var(--amber-500),0.2)] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[rgb(var(--amber-500))]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-[rgb(var(--paper))]">
                  Model Configuration
                </h3>
                <p className="text-sm text-[rgb(var(--paper-muted))]">
                  AI model selection
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[rgb(var(--paper-muted))]">Generation Model</Label>
                <Select value={defaultModel} onValueChange={setDefaultModel}>
                  <SelectTrigger className="bg-[rgb(var(--noir-bg))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[rgb(var(--noir-surface-elevated))] border-[rgb(var(--noir-border))]">
                    <SelectItem value="claude-opus-4-5-20251101" className="text-[rgb(var(--paper))]">
                      Claude Opus 4.5 (Best Quality)
                    </SelectItem>
                    <SelectItem value="claude-sonnet-4-20250514" className="text-[rgb(var(--paper))]">
                      Claude Sonnet 4 (Balanced)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[rgb(var(--paper-dim))]">
                  Used for story generation and character creation
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-[rgb(var(--paper-muted))]">Validation Model</Label>
                <Select value={validationModel} onValueChange={setValidationModel}>
                  <SelectTrigger className="bg-[rgb(var(--noir-bg))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[rgb(var(--noir-surface-elevated))] border-[rgb(var(--noir-border))]">
                    <SelectItem value="claude-sonnet-4-20250514" className="text-[rgb(var(--paper))]">
                      Claude Sonnet 4 (More Thorough)
                    </SelectItem>
                    <SelectItem value="claude-haiku-3-20240307" className="text-[rgb(var(--paper))]">
                      Claude Haiku 3 (Faster)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[rgb(var(--paper-dim))]">
                  Used for validation and consistency checks
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button className="w-full bg-gradient-to-r from-[rgb(var(--amber-600))] to-[rgb(var(--amber-500))] hover:from-[rgb(var(--amber-500))] hover:to-[rgb(var(--amber-400))] text-[rgb(var(--noir-bg))] font-semibold shadow-lg btn-glow">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
