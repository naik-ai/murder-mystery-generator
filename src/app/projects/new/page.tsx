"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  PartyPopper,
  Users,
  Clock,
  Gauge,
  Skull,
  FlaskConical,
  Target,
  User,
  UserX,
  AlertTriangle,
  Loader2,
  Check,
  Zap,
} from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { GenerationSettings, Difficulty } from "@/lib/types";

// Step definitions
const steps = [
  { id: 1, title: "Theme & Setting", icon: MapPin },
  { id: 2, title: "Scale", icon: Users },
  { id: 3, title: "Murder Method", icon: Skull },
  { id: 4, title: "Characters", icon: User },
  { id: 5, title: "Generate", icon: Sparkles },
];

// Preset themes
const themePresets = [
  { value: "gatsby", label: "Gatsby Era Glamour", era: "1920s", description: "Roaring twenties, jazz, prohibition" },
  { value: "victorian", label: "Victorian Mystery", era: "1890s", description: "Gaslit streets, secrets, intrigue" },
  { value: "noir", label: "Film Noir", era: "1940s", description: "Dark alleys, femme fatales, shadows" },
  { value: "modern", label: "Modern Thriller", era: "Present", description: "Tech, wealth, contemporary drama" },
  { value: "bollywood", label: "Bollywood Drama", era: "Present", description: "Family secrets, weddings, rivalry" },
  { value: "custom", label: "Custom Theme", era: "Any", description: "Create your own setting" },
];

// Location presets
const locationPresets = [
  "Grand Estate",
  "Luxury Hotel",
  "Cruise Ship",
  "Wedding Venue",
  "Corporate Retreat",
  "Private Island",
  "Mountain Lodge",
  "Vineyard",
];

// Occasion presets
const occasionPresets = [
  "Birthday Celebration",
  "Anniversary Party",
  "Wedding Reception",
  "Business Conference",
  "Charity Gala",
  "Family Reunion",
  "New Year's Eve",
  "Awards Ceremony",
];

// Default settings
const defaultSettings: GenerationSettings = {
  theme: "",
  location: "",
  era: "",
  occasion: "",
  playerCount: 5,
  duration: 90,
  difficulty: "medium",
  murderMethod: {
    cause: "",
    stages: 1,
    centralMechanic: "",
  },
  victimProfile: {
    name: "",
    role: "",
    personality: "",
  },
  killerCount: 1,
  redHerringStrength: "moderate",
  suspectCount: {
    tier1: 5,
    tier2: 8,
    tier3: 10,
  },
};

// Step 1: Theme & Setting
function StepThemeSetting({
  settings,
  updateSettings,
}: {
  settings: GenerationSettings;
  updateSettings: (updates: Partial<GenerationSettings>) => void;
}) {
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    const theme = themePresets.find((t) => t.value === preset);
    if (theme && preset !== "custom") {
      updateSettings({
        theme: theme.label,
        era: theme.era,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div className="space-y-4">
        <Label className="text-lg font-display text-[rgb(var(--paper))]">
          Choose Your Theme
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {themePresets.map((theme) => (
            <button
              key={theme.value}
              onClick={() => handlePresetSelect(theme.value)}
              className={cn(
                "p-4 rounded-xl text-left transition-all duration-300",
                "border border-[rgb(var(--noir-border))]",
                "hover:border-[rgba(var(--amber-500),0.5)]",
                selectedPreset === theme.value
                  ? "bg-[rgba(var(--amber-500),0.1)] border-[rgb(var(--amber-500))]"
                  : "bg-[rgb(var(--noir-surface))]"
              )}
            >
              <span className="block font-display font-semibold text-[rgb(var(--paper))]">
                {theme.label}
              </span>
              <span className="block text-xs text-[rgb(var(--amber-500))] mt-1">
                {theme.era}
              </span>
              <span className="block text-sm text-[rgb(var(--paper-muted))] mt-2">
                {theme.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label className="text-[rgb(var(--paper))] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[rgb(var(--amber-500))]" />
          Location
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {locationPresets.map((loc) => (
            <button
              key={loc}
              onClick={() => updateSettings({ location: loc })}
              className={cn(
                "px-3 py-2 rounded-lg text-sm transition-all",
                "border border-[rgb(var(--noir-border))]",
                settings.location === loc
                  ? "bg-[rgba(var(--amber-500),0.2)] border-[rgb(var(--amber-500))] text-[rgb(var(--amber-500))]"
                  : "bg-[rgb(var(--noir-surface))] text-[rgb(var(--paper-muted))] hover:text-[rgb(var(--paper))] hover:border-[rgba(var(--amber-500),0.3)]"
              )}
            >
              {loc}
            </button>
          ))}
        </div>
        <Input
          value={settings.location}
          onChange={(e) => updateSettings({ location: e.target.value })}
          placeholder="Or enter a custom location..."
          className="bg-[rgb(var(--noir-surface))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] placeholder:text-[rgb(var(--paper-dim))]"
        />
      </div>

      {/* Era */}
      <div className="space-y-3">
        <Label className="text-[rgb(var(--paper))] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[rgb(var(--amber-500))]" />
          Time Period
        </Label>
        <Input
          value={settings.era}
          onChange={(e) => updateSettings({ era: e.target.value })}
          placeholder="e.g., 1920s, Victorian Era, Present Day"
          className="bg-[rgb(var(--noir-surface))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] placeholder:text-[rgb(var(--paper-dim))]"
        />
      </div>

      {/* Occasion */}
      <div className="space-y-3">
        <Label className="text-[rgb(var(--paper))] flex items-center gap-2">
          <PartyPopper className="w-4 h-4 text-[rgb(var(--amber-500))]" />
          Occasion
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {occasionPresets.map((occ) => (
            <button
              key={occ}
              onClick={() => updateSettings({ occasion: occ })}
              className={cn(
                "px-3 py-2 rounded-lg text-sm transition-all",
                "border border-[rgb(var(--noir-border))]",
                settings.occasion === occ
                  ? "bg-[rgba(var(--amber-500),0.2)] border-[rgb(var(--amber-500))] text-[rgb(var(--amber-500))]"
                  : "bg-[rgb(var(--noir-surface))] text-[rgb(var(--paper-muted))] hover:text-[rgb(var(--paper))] hover:border-[rgba(var(--amber-500),0.3)]"
              )}
            >
              {occ}
            </button>
          ))}
        </div>
        <Input
          value={settings.occasion}
          onChange={(e) => updateSettings({ occasion: e.target.value })}
          placeholder="Or enter a custom occasion..."
          className="bg-[rgb(var(--noir-surface))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] placeholder:text-[rgb(var(--paper-dim))]"
        />
      </div>
    </div>
  );
}

// Step 2: Scale
function StepScale({
  settings,
  updateSettings,
}: {
  settings: GenerationSettings;
  updateSettings: (updates: Partial<GenerationSettings>) => void;
}) {
  const difficultyOptions: { value: Difficulty; label: string; description: string }[] = [
    { value: "easy", label: "Easy", description: "Clear clues, obvious solution path" },
    { value: "medium", label: "Medium", description: "Balanced challenge, some red herrings" },
    { value: "hard", label: "Hard", description: "Complex clues, multiple suspects" },
    { value: "expert", label: "Expert", description: "Intricate plot, hidden connections" },
  ];

  return (
    <div className="space-y-10">
      {/* Player Count */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-display text-[rgb(var(--paper))] flex items-center gap-2">
            <Users className="w-5 h-5 text-[rgb(var(--amber-500))]" />
            Number of Players
          </Label>
          <span className="text-2xl font-display font-bold text-[rgb(var(--amber-500))]">
            {settings.playerCount}
          </span>
        </div>
        <Slider
          value={[settings.playerCount]}
          onValueChange={(value) => updateSettings({ playerCount: value[0] })}
          min={3}
          max={10}
          step={1}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-[rgb(var(--paper-dim))]">
          <span>3 players</span>
          <span>10 players</span>
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-display text-[rgb(var(--paper))] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[rgb(var(--amber-500))]" />
            Game Duration
          </Label>
          <span className="text-2xl font-display font-bold text-[rgb(var(--amber-500))]">
            {settings.duration} min
          </span>
        </div>
        <Slider
          value={[settings.duration]}
          onValueChange={(value) => updateSettings({ duration: value[0] })}
          min={30}
          max={180}
          step={15}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-[rgb(var(--paper-dim))]">
          <span>30 min (Quick)</span>
          <span>180 min (Epic)</span>
        </div>
      </div>

      {/* Difficulty */}
      <div className="space-y-4">
        <Label className="text-lg font-display text-[rgb(var(--paper))] flex items-center gap-2">
          <Gauge className="w-5 h-5 text-[rgb(var(--amber-500))]" />
          Difficulty Level
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSettings({ difficulty: option.value })}
              className={cn(
                "p-4 rounded-xl text-center transition-all duration-300",
                "border border-[rgb(var(--noir-border))]",
                settings.difficulty === option.value
                  ? "bg-[rgba(var(--amber-500),0.1)] border-[rgb(var(--amber-500))]"
                  : "bg-[rgb(var(--noir-surface))] hover:border-[rgba(var(--amber-500),0.3)]"
              )}
            >
              <span className="block font-display font-semibold text-[rgb(var(--paper))]">
                {option.label}
              </span>
              <span className="block text-xs text-[rgb(var(--paper-muted))] mt-2">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 3: Murder Method
function StepMurderMethod({
  settings,
  updateSettings,
}: {
  settings: GenerationSettings;
  updateSettings: (updates: Partial<GenerationSettings>) => void;
}) {
  const murderMethods = [
    { value: "poison", label: "Poison", icon: FlaskConical },
    { value: "stabbing", label: "Stabbing", icon: Target },
    { value: "strangling", label: "Strangling", icon: UserX },
    { value: "shooting", label: "Shooting", icon: Target },
    { value: "drowning", label: "Drowning", icon: AlertTriangle },
    { value: "custom", label: "Custom", icon: Skull },
  ];

  const updateMurderMethod = (updates: Partial<GenerationSettings["murderMethod"]>) => {
    updateSettings({
      murderMethod: { ...settings.murderMethod, ...updates },
    });
  };

  return (
    <div className="space-y-8">
      {/* Murder Cause */}
      <div className="space-y-4">
        <Label className="text-lg font-display text-[rgb(var(--paper))]">
          Cause of Death
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {murderMethods.map((method) => (
            <button
              key={method.value}
              onClick={() => updateMurderMethod({ cause: method.value })}
              className={cn(
                "p-4 rounded-xl flex flex-col items-center gap-3 transition-all duration-300",
                "border border-[rgb(var(--noir-border))]",
                settings.murderMethod.cause === method.value
                  ? "bg-[rgba(var(--crimson-500),0.2)] border-[rgb(var(--crimson-500))]"
                  : "bg-[rgb(var(--noir-surface))] hover:border-[rgba(var(--crimson-500),0.3)]"
              )}
            >
              <method.icon
                className={cn(
                  "w-8 h-8",
                  settings.murderMethod.cause === method.value
                    ? "text-[rgb(var(--crimson-500))]"
                    : "text-[rgb(var(--paper-muted))]"
                )}
              />
              <span className="font-display font-semibold text-[rgb(var(--paper))]">
                {method.label}
              </span>
            </button>
          ))}
        </div>
        {settings.murderMethod.cause === "custom" && (
          <Input
            placeholder="Describe the murder method..."
            className="mt-4 bg-[rgb(var(--noir-surface))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))]"
          />
        )}
      </div>

      {/* Murder Stages */}
      <div className="space-y-4">
        <Label className="text-lg font-display text-[rgb(var(--paper))]">
          Murder Complexity
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateMurderMethod({ stages: 1 })}
            className={cn(
              "p-6 rounded-xl text-left transition-all duration-300",
              "border border-[rgb(var(--noir-border))]",
              settings.murderMethod.stages === 1
                ? "bg-[rgba(var(--amber-500),0.1)] border-[rgb(var(--amber-500))]"
                : "bg-[rgb(var(--noir-surface))] hover:border-[rgba(var(--amber-500),0.3)]"
            )}
          >
            <span className="block font-display text-xl font-bold text-[rgb(var(--paper))]">
              Single Stage
            </span>
            <span className="block text-sm text-[rgb(var(--paper-muted))] mt-2">
              One killer, one method, straightforward execution
            </span>
          </button>
          <button
            onClick={() => updateMurderMethod({ stages: 2 })}
            className={cn(
              "p-6 rounded-xl text-left transition-all duration-300",
              "border border-[rgb(var(--noir-border))]",
              settings.murderMethod.stages === 2
                ? "bg-[rgba(var(--amber-500),0.1)] border-[rgb(var(--amber-500))]"
                : "bg-[rgb(var(--noir-surface))] hover:border-[rgba(var(--amber-500),0.3)]"
            )}
          >
            <span className="block font-display text-xl font-bold text-[rgb(var(--paper))]">
              Two Stage
            </span>
            <span className="block text-sm text-[rgb(var(--paper-muted))] mt-2">
              Conspiracy plot, two killers, delayed death mechanism
            </span>
          </button>
        </div>
      </div>

      {/* Central Mechanic */}
      <div className="space-y-3">
        <Label className="text-[rgb(var(--paper))]">
          Central Mechanic (Optional)
        </Label>
        <Input
          value={settings.murderMethod.centralMechanic}
          onChange={(e) => updateMurderMethod({ centralMechanic: e.target.value })}
          placeholder="e.g., Bottle swap, timed poison, switched drinks"
          className="bg-[rgb(var(--noir-surface))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] placeholder:text-[rgb(var(--paper-dim))]"
        />
        <p className="text-xs text-[rgb(var(--paper-dim))]">
          The unique twist that makes solving the mystery challenging
        </p>
      </div>
    </div>
  );
}

// Step 4: Characters
function StepCharacters({
  settings,
  updateSettings,
}: {
  settings: GenerationSettings;
  updateSettings: (updates: Partial<GenerationSettings>) => void;
}) {
  const updateVictimProfile = (updates: Partial<GenerationSettings["victimProfile"]>) => {
    updateSettings({
      victimProfile: { ...settings.victimProfile, ...updates },
    });
  };

  const updateSuspectCount = (updates: Partial<GenerationSettings["suspectCount"]>) => {
    updateSettings({
      suspectCount: { ...settings.suspectCount, ...updates },
    });
  };

  const totalSuspects =
    settings.suspectCount.tier1 +
    settings.suspectCount.tier2 +
    settings.suspectCount.tier3;

  return (
    <div className="space-y-8">
      {/* Victim Profile */}
      <div className="space-y-4">
        <Label className="text-lg font-display text-[rgb(var(--paper))]">
          Victim Profile
        </Label>
        <div className="noir-card rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[rgb(var(--paper-muted))]">Name</Label>
              <Input
                value={settings.victimProfile.name}
                onChange={(e) => updateVictimProfile({ name: e.target.value })}
                placeholder="Leave blank to auto-generate"
                className="bg-[rgb(var(--noir-bg))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[rgb(var(--paper-muted))]">Role</Label>
              <Input
                value={settings.victimProfile.role}
                onChange={(e) => updateVictimProfile({ role: e.target.value })}
                placeholder="e.g., Business tycoon, Matriarch"
                className="bg-[rgb(var(--noir-bg))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[rgb(var(--paper-muted))]">Personality</Label>
            <Input
              value={settings.victimProfile.personality}
              onChange={(e) => updateVictimProfile({ personality: e.target.value })}
              placeholder="e.g., Charismatic but manipulative"
              className="bg-[rgb(var(--noir-bg))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))]"
            />
          </div>
        </div>
      </div>

      {/* Killer Count */}
      <div className="space-y-4">
        <Label className="text-lg font-display text-[rgb(var(--paper))]">
          Number of Killers
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateSettings({ killerCount: 1 })}
            className={cn(
              "p-4 rounded-xl text-center transition-all duration-300",
              "border border-[rgb(var(--noir-border))]",
              settings.killerCount === 1
                ? "bg-[rgba(var(--crimson-500),0.2)] border-[rgb(var(--crimson-500))]"
                : "bg-[rgb(var(--noir-surface))] hover:border-[rgba(var(--crimson-500),0.3)]"
            )}
          >
            <Skull className="w-8 h-8 mx-auto mb-2 text-[rgb(var(--crimson-500))]" />
            <span className="font-display font-semibold text-[rgb(var(--paper))]">
              Single Killer
            </span>
          </button>
          <button
            onClick={() => updateSettings({ killerCount: 2 })}
            className={cn(
              "p-4 rounded-xl text-center transition-all duration-300",
              "border border-[rgb(var(--noir-border))]",
              settings.killerCount === 2
                ? "bg-[rgba(var(--crimson-500),0.2)] border-[rgb(var(--crimson-500))]"
                : "bg-[rgb(var(--noir-surface))] hover:border-[rgba(var(--crimson-500),0.3)]"
            )}
          >
            <div className="flex justify-center gap-1 mb-2">
              <Skull className="w-7 h-7 text-[rgb(var(--crimson-500))]" />
              <Skull className="w-7 h-7 text-[rgb(var(--crimson-500))]" />
            </div>
            <span className="font-display font-semibold text-[rgb(var(--paper))]">
              Conspiracy (2 Killers)
            </span>
          </button>
        </div>
      </div>

      {/* Suspect Count per Tier */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-display text-[rgb(var(--paper))]">
            Suspect Distribution
          </Label>
          <span className="text-sm text-[rgb(var(--amber-500))] font-mono">
            {totalSuspects} total
          </span>
        </div>

        <div className="space-y-6">
          {/* Tier 1 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[rgb(var(--paper))]">
                <span className="font-semibold">Tier 1</span>
                <span className="text-[rgb(var(--paper-muted))] ml-2">Prime suspects</span>
              </span>
              <span className="text-[rgb(var(--amber-500))] font-mono">
                {settings.suspectCount.tier1}
              </span>
            </div>
            <Slider
              value={[settings.suspectCount.tier1]}
              onValueChange={(value) => updateSuspectCount({ tier1: value[0] })}
              min={3}
              max={8}
              step={1}
            />
          </div>

          {/* Tier 2 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[rgb(var(--paper))]">
                <span className="font-semibold">Tier 2</span>
                <span className="text-[rgb(var(--paper-muted))] ml-2">Secondary suspects</span>
              </span>
              <span className="text-[rgb(var(--amber-500))] font-mono">
                {settings.suspectCount.tier2}
              </span>
            </div>
            <Slider
              value={[settings.suspectCount.tier2]}
              onValueChange={(value) => updateSuspectCount({ tier2: value[0] })}
              min={4}
              max={12}
              step={1}
            />
          </div>

          {/* Tier 3 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[rgb(var(--paper))]">
                <span className="font-semibold">Tier 3</span>
                <span className="text-[rgb(var(--paper-muted))] ml-2">Background characters</span>
              </span>
              <span className="text-[rgb(var(--amber-500))] font-mono">
                {settings.suspectCount.tier3}
              </span>
            </div>
            <Slider
              value={[settings.suspectCount.tier3]}
              onValueChange={(value) => updateSuspectCount({ tier3: value[0] })}
              min={5}
              max={15}
              step={1}
            />
          </div>
        </div>
      </div>

      {/* Red Herring Strength */}
      <div className="space-y-4">
        <Label className="text-lg font-display text-[rgb(var(--paper))]">
          Red Herring Intensity
        </Label>
        <Select
          value={settings.redHerringStrength}
          onValueChange={(value: "subtle" | "moderate" | "strong") =>
            updateSettings({ redHerringStrength: value })
          }
        >
          <SelectTrigger className="bg-[rgb(var(--noir-surface))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[rgb(var(--noir-surface-elevated))] border-[rgb(var(--noir-border))]">
            <SelectItem value="subtle" className="text-[rgb(var(--paper))]">
              Subtle - Light misdirection
            </SelectItem>
            <SelectItem value="moderate" className="text-[rgb(var(--paper))]">
              Moderate - Balanced deception
            </SelectItem>
            <SelectItem value="strong" className="text-[rgb(var(--paper))]">
              Strong - Heavy misdirection
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Step 5: Generate
function StepGenerate({
  settings,
  isGenerating,
  progress,
  onGenerate,
}: {
  settings: GenerationSettings;
  isGenerating: boolean;
  progress: { stage: string; percent: number; message: string };
  onGenerate: () => void;
}) {
  const stages = [
    { id: "story", label: "Story Architect", description: "Creating narrative structure" },
    { id: "characters", label: "Character Designer", description: "Generating suspects" },
    { id: "evidence", label: "Evidence Crafter", description: "Designing clues" },
    { id: "validation", label: "Validation Pipeline", description: "Checking consistency" },
  ];

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="noir-card rounded-xl p-6">
        <h3 className="font-display text-xl font-semibold text-[rgb(var(--paper))] mb-4">
          Mystery Configuration
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-[rgb(var(--paper-dim))]">Theme</span>
            <p className="text-[rgb(var(--paper))] font-medium">{settings.theme || "Not set"}</p>
          </div>
          <div>
            <span className="text-[rgb(var(--paper-dim))]">Location</span>
            <p className="text-[rgb(var(--paper))] font-medium">{settings.location || "Not set"}</p>
          </div>
          <div>
            <span className="text-[rgb(var(--paper-dim))]">Players</span>
            <p className="text-[rgb(var(--paper))] font-medium">{settings.playerCount}</p>
          </div>
          <div>
            <span className="text-[rgb(var(--paper-dim))]">Duration</span>
            <p className="text-[rgb(var(--paper))] font-medium">{settings.duration} min</p>
          </div>
          <div>
            <span className="text-[rgb(var(--paper-dim))]">Difficulty</span>
            <p className="text-[rgb(var(--paper))] font-medium capitalize">{settings.difficulty}</p>
          </div>
          <div>
            <span className="text-[rgb(var(--paper-dim))]">Murder Method</span>
            <p className="text-[rgb(var(--paper))] font-medium capitalize">
              {settings.murderMethod.cause || "Not set"}
            </p>
          </div>
          <div>
            <span className="text-[rgb(var(--paper-dim))]">Killers</span>
            <p className="text-[rgb(var(--paper))] font-medium">{settings.killerCount}</p>
          </div>
          <div>
            <span className="text-[rgb(var(--paper-dim))]">Total Suspects</span>
            <p className="text-[rgb(var(--paper))] font-medium">
              {settings.suspectCount.tier1 +
                settings.suspectCount.tier2 +
                settings.suspectCount.tier3}
            </p>
          </div>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[rgb(var(--amber-500))]" />
            <span className="font-display text-xl text-[rgb(var(--paper))]">
              Generating your mystery...
            </span>
          </div>

          {/* Agent Progress */}
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const isActive = progress.stage === stage.id;
              const isComplete =
                stages.findIndex((s) => s.id === progress.stage) > index;

              return (
                <div
                  key={stage.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-[rgba(var(--amber-500),0.1)] border border-[rgb(var(--amber-500))]"
                      : isComplete
                      ? "bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.3)]"
                      : "bg-[rgb(var(--noir-surface))] border border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      isActive
                        ? "bg-[rgb(var(--amber-500))]"
                        : isComplete
                        ? "bg-[#4caf50]"
                        : "bg-[rgb(var(--noir-border))]"
                    )}
                  >
                    {isComplete ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 animate-spin text-[rgb(var(--noir-bg))]" />
                    ) : (
                      <Zap className="w-5 h-5 text-[rgb(var(--paper-dim))]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[rgb(var(--paper))]">{stage.label}</p>
                    <p className="text-sm text-[rgb(var(--paper-muted))]">
                      {isActive ? progress.message : stage.description}
                    </p>
                  </div>
                  {isActive && (
                    <span className="text-[rgb(var(--amber-500))] font-mono">
                      {progress.percent}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="h-2 bg-[rgb(var(--noir-surface))] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[rgb(var(--amber-600))] to-[rgb(var(--amber-500))] transition-all duration-500"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[rgb(var(--amber-500))] to-[rgb(var(--amber-600))] flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-[rgb(var(--noir-bg))]" />
            </div>
            <div className="absolute -inset-4 bg-[rgb(var(--amber-500))] opacity-20 blur-2xl rounded-full -z-10" />
          </div>

          <h3 className="font-display text-2xl font-bold text-[rgb(var(--paper))] mb-2">
            Ready to Generate
          </h3>
          <p className="text-[rgb(var(--paper-muted))] mb-8 max-w-md mx-auto">
            Our AI agents will craft an intricate murder mystery based on your
            configuration. This typically takes 2-3 minutes.
          </p>

          <Button
            onClick={onGenerate}
            size="lg"
            className="bg-gradient-to-r from-[rgb(var(--amber-600))] to-[rgb(var(--amber-500))] hover:from-[rgb(var(--amber-500))] hover:to-[rgb(var(--amber-400))] text-[rgb(var(--noir-bg))] font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(212,165,116,0.4)] transition-all duration-300 px-12 py-6 text-lg btn-glow"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Mystery
          </Button>

          <p className="text-xs text-[rgb(var(--paper-dim))] mt-4">
            Estimated token usage: ~300K tokens (~$3-5 USD)
          </p>
        </div>
      )}
    </div>
  );
}

// Main Wizard Component
export default function GenerationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({
    stage: "story",
    percent: 0,
    message: "Initializing...",
  });

  const updateSettings = useCallback((updates: Partial<GenerationSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate generation progress
    const stages = ["story", "characters", "evidence", "validation"];
    for (let i = 0; i < stages.length; i++) {
      setProgress({
        stage: stages[i],
        percent: 0,
        message: `Starting ${stages[i]}...`,
      });

      for (let p = 0; p <= 100; p += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setProgress({
          stage: stages[i],
          percent: p,
          message: `Processing ${stages[i]}...`,
        });
      }
    }

    // Redirect to project on completion
    router.push("/projects/demo-project");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepThemeSetting settings={settings} updateSettings={updateSettings} />;
      case 2:
        return <StepScale settings={settings} updateSettings={updateSettings} />;
      case 3:
        return <StepMurderMethod settings={settings} updateSettings={updateSettings} />;
      case 4:
        return <StepCharacters settings={settings} updateSettings={updateSettings} />;
      case 5:
        return (
          <StepGenerate
            settings={settings}
            isGenerating={isGenerating}
            progress={progress}
            onGenerate={handleGenerate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(var(--noir-bg),0.8)] border-b border-[rgba(var(--amber-500),0.1)]">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-[rgb(var(--paper))]">
                Create New Mystery
              </h1>
              <p className="text-[rgb(var(--paper-muted))] mt-1">
                Configure your murder mystery game
              </p>
            </div>

            {/* Step Indicator */}
            <div className="step-indicator">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => !isGenerating && setCurrentStep(step.id)}
                    disabled={isGenerating}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                      currentStep === step.id
                        ? "bg-[rgba(var(--amber-500),0.2)] text-[rgb(var(--amber-500))]"
                        : currentStep > step.id
                        ? "text-[rgb(var(--amber-600))]"
                        : "text-[rgb(var(--paper-dim))]"
                    )}
                  >
                    <div
                      className={cn(
                        "step-dot",
                        currentStep === step.id && "active",
                        currentStep > step.id && "completed"
                      )}
                    />
                    <span className="hidden md:inline text-sm font-medium">
                      {step.title}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "step-line mx-2",
                        currentStep > step.id && "completed"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              {(() => {
                const StepIcon = steps[currentStep - 1].icon;
                return (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--amber-500))] to-[rgb(var(--amber-600))] flex items-center justify-center">
                    <StepIcon className="w-6 h-6 text-[rgb(var(--noir-bg))]" />
                  </div>
                );
              })()}
              <div>
                <p className="text-sm text-[rgb(var(--amber-500))] font-mono">
                  Step {currentStep} of 5
                </p>
                <h2 className="font-display text-2xl font-bold text-[rgb(var(--paper))]">
                  {steps[currentStep - 1].title}
                </h2>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="noir-card rounded-xl p-8">{renderStep()}</div>

          {/* Navigation */}
          {!isGenerating && (
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="text-[rgb(var(--paper-muted))] hover:text-[rgb(var(--paper))] hover:bg-[rgba(var(--amber-500),0.1)]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < 5 && (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-[rgb(var(--amber-600))] to-[rgb(var(--amber-500))] hover:from-[rgb(var(--amber-500))] hover:to-[rgb(var(--amber-400))] text-[rgb(var(--noir-bg))] font-semibold btn-glow"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
