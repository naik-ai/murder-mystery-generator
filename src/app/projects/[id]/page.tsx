"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  FileText,
  Clock,
  Shield,
  Download,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Skull,
  Eye,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Suspect, Evidence, TimelineEvent, ValidationState } from "@/lib/types";

// Mock project data
const mockProject = {
  id: "1",
  name: "The Last Toast",
  status: "complete" as const,
  createdAt: "2024-01-02T10:00:00Z",
  updatedAt: "2024-01-03T15:30:00Z",
  settings: {
    theme: "Bollywood Drama",
    location: "Singhania Estate",
    era: "Present Day",
    occasion: "60th Birthday Celebration",
    playerCount: 5,
    duration: 80,
    difficulty: "hard" as const,
  },
  narrative: {
    title: "The Last Toast",
    tagline: "A celebration turned deadly. A family torn apart. One killer among them.",
    victim: "Raghav Singhania, 60, Patriarch of Singhania Industries",
  },
};

// Mock suspects
const mockSuspects: Suspect[] = [
  {
    id: "S-001",
    tier: 1,
    name: "Kavya Joshi",
    role: "Personal Assistant",
    age: 28,
    description: "Raghav's trusted personal assistant",
    personality: ["Ambitious", "Secretive"],
    background: "Worked for Raghav for 3 years",
    motive: {
      summary: "Hidden romantic relationship with Vikash",
      strength: "high",
      details: "Discovered embezzlement that Raghav was investigating",
    },
    alibi: {
      claimed: "Was overseeing the kitchen during the toast",
      actual: "Briefly left to signal Vikash",
      verified: false,
      witnesses: ["Kitchen staff"],
    },
    secrets: ["Secret relationship with Vikash", "Knew about embezzlement"],
    relationships: [],
    isKiller: true,
    killerRole: "mastermind",
    isRedHerring: false,
  },
  {
    id: "S-002",
    tier: 1,
    name: "Vikash Mehra",
    role: "Catering Coordinator",
    age: 32,
    description: "External catering coordinator with access to food and drinks",
    personality: ["Charming", "Calculating"],
    background: "Runs a catering business",
    motive: {
      summary: "In conspiracy with Kavya",
      strength: "high",
      details: "Executed the poison swap on Kavya's direction",
    },
    alibi: {
      claimed: "Was in the service area preparing drinks",
      actual: "Swapped bottles during the toast preparation",
      verified: false,
      witnesses: ["Wait staff"],
    },
    secrets: ["Secret relationship with Kavya"],
    relationships: [],
    isKiller: true,
    killerRole: "executor",
    isRedHerring: false,
  },
  {
    id: "S-003",
    tier: 1,
    name: "Rohit Singhania",
    role: "Elder Son",
    age: 35,
    description: "Raghav's eldest son, next in line for the business",
    personality: ["Ambitious", "Resentful"],
    background: "Works at Singhania Industries",
    motive: {
      summary: "Passed over for promotion, needed inheritance",
      strength: "extreme",
      details: "Gambling debts and corporate rivalry",
    },
    alibi: {
      claimed: "Was with guests during the toast",
      actual: "Verified by multiple witnesses",
      verified: true,
      witnesses: ["Multiple guests"],
    },
    secrets: ["Gambling addiction", "Secret debts"],
    relationships: [],
    isKiller: false,
    isRedHerring: true,
  },
];

// Mock evidence
const mockEvidence: Evidence[] = [
  {
    id: "EV-001",
    name: "Poisoned Whiskey Bottle",
    type: "physical",
    description: "Raghav's personal whiskey bottle with traces of poison",
    revealedInPhase: 1,
    assignedToDetective: 1,
    isClue: true,
    pointsTo: "S-002",
    location: "Bar area",
    discoveryMethod: "Forensic analysis",
    bottleId: "BTL-7711",
    forensicDetails: {
      analysis: "Liquid chromatography",
      results: "Thallium sulfate detected",
      significance: "Poison was added within 2 hours of consumption",
    },
  },
  {
    id: "EV-002",
    name: "Switched Bottle Label",
    type: "physical",
    description: "Label from BTL-7794 found in trash near service area",
    revealedInPhase: 2,
    assignedToDetective: 2,
    isClue: true,
    pointsTo: "S-002",
    location: "Service area trash",
    discoveryMethod: "Search",
    bottleId: "BTL-7794",
  },
  {
    id: "EV-003",
    name: "Text Messages",
    type: "digital",
    description: "Encrypted messages between Kavya and an unknown number",
    revealedInPhase: 3,
    assignedToDetective: 3,
    isClue: true,
    pointsTo: "S-001",
    location: "Kavya's phone",
    discoveryMethod: "Phone forensics",
    digitalMetadata: {
      device: "iPhone 14",
      timestamp: "2024-01-02T21:15:00Z",
      data: "Encrypted Signal messages to V.M.",
    },
  },
];

// Mock timeline
const mockTimeline: TimelineEvent[] = [
  {
    id: "TL-001",
    timestamp: "2024-01-02T19:00:00Z",
    time: "7:00 PM",
    date: "January 2, 2024",
    title: "Guests Begin Arriving",
    description: "Birthday celebration guests start arriving at Singhania Estate",
    location: "Main entrance",
    participants: ["S-003", "S-004", "S-005"],
    type: "setup",
    importance: "minor",
  },
  {
    id: "TL-002",
    timestamp: "2024-01-02T20:30:00Z",
    time: "8:30 PM",
    date: "January 2, 2024",
    title: "Bottle Swap",
    description: "Vikash swaps the poisoned bottle into Raghav's private collection",
    location: "Bar service area",
    participants: ["S-002"],
    type: "murder",
    importance: "critical",
    relatedEvidence: ["EV-001", "EV-002"],
  },
  {
    id: "TL-003",
    timestamp: "2024-01-02T21:15:00Z",
    time: "9:15 PM",
    date: "January 2, 2024",
    title: "The Birthday Toast",
    description: "Raghav drinks from the poisoned bottle during his toast",
    location: "Main ballroom",
    participants: ["S-001", "S-002", "S-003"],
    type: "murder",
    importance: "critical",
    relatedEvidence: ["EV-001"],
  },
  {
    id: "TL-004",
    timestamp: "2024-01-02T21:30:00Z",
    time: "9:30 PM",
    date: "January 2, 2024",
    title: "Raghav Collapses",
    description: "Raghav suddenly collapses during the celebration",
    location: "Main ballroom",
    participants: ["S-001", "S-002", "S-003", "S-004", "S-005"],
    type: "discovery",
    importance: "critical",
  },
];

// Mock validation
const mockValidation: ValidationState = {
  lastValidated: "2024-01-03T15:00:00Z",
  overallStatus: "valid",
  agents: [
    {
      agent: "timeline_auditor",
      status: "pass",
      issues: [],
      runAt: "2024-01-03T15:00:00Z",
    },
    {
      agent: "evidence_validator",
      status: "pass",
      issues: [],
      runAt: "2024-01-03T15:00:00Z",
    },
    {
      agent: "motive_analyzer",
      status: "pass",
      issues: [],
      runAt: "2024-01-03T15:00:00Z",
    },
    {
      agent: "twist_fairness",
      status: "pass",
      issues: [],
      runAt: "2024-01-03T15:00:00Z",
    },
  ],
};

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="noir-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(var(--amber-500),0.2)] flex items-center justify-center">
              <Users className="w-5 h-5 text-[rgb(var(--amber-500))]" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-[rgb(var(--paper))]">22</p>
              <p className="text-xs text-[rgb(var(--paper-muted))]">Suspects</p>
            </div>
          </div>
        </div>
        <div className="noir-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(var(--amber-500),0.2)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[rgb(var(--amber-500))]" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-[rgb(var(--paper))]">8</p>
              <p className="text-xs text-[rgb(var(--paper-muted))]">Evidence</p>
            </div>
          </div>
        </div>
        <div className="noir-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(var(--amber-500),0.2)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[rgb(var(--amber-500))]" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-[rgb(var(--paper))]">80</p>
              <p className="text-xs text-[rgb(var(--paper-muted))]">Minutes</p>
            </div>
          </div>
        </div>
        <div className="noir-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(76,175,80,0.2)] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#81c784]" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-[#81c784]">4/4</p>
              <p className="text-xs text-[rgb(var(--paper-muted))]">Validated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Summary */}
      <div className="noir-card rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-[rgb(var(--paper))] mb-4">
          Story Summary
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[rgb(var(--paper-dim))]">Tagline</p>
            <p className="text-[rgb(var(--paper))] italic">"{mockProject.narrative.tagline}"</p>
          </div>
          <div>
            <p className="text-sm text-[rgb(var(--paper-dim))]">Victim</p>
            <p className="text-[rgb(var(--paper))]">{mockProject.narrative.victim}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[rgb(var(--noir-border))]">
            <div>
              <p className="text-sm text-[rgb(var(--paper-dim))]">Theme</p>
              <p className="text-[rgb(var(--paper))]">{mockProject.settings.theme}</p>
            </div>
            <div>
              <p className="text-sm text-[rgb(var(--paper-dim))]">Location</p>
              <p className="text-[rgb(var(--paper))]">{mockProject.settings.location}</p>
            </div>
            <div>
              <p className="text-sm text-[rgb(var(--paper-dim))]">Era</p>
              <p className="text-[rgb(var(--paper))]">{mockProject.settings.era}</p>
            </div>
            <div>
              <p className="text-sm text-[rgb(var(--paper-dim))]">Occasion</p>
              <p className="text-[rgb(var(--paper))]">{mockProject.settings.occasion}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="noir-card rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-[rgb(var(--paper))] mb-4">
          Validation Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockValidation.agents.map((agent) => (
            <div
              key={agent.agent}
              className={cn(
                "p-4 rounded-lg border",
                agent.status === "pass"
                  ? "bg-[rgba(76,175,80,0.1)] border-[rgba(76,175,80,0.3)]"
                  : agent.status === "warn"
                  ? "bg-[rgba(var(--amber-500),0.1)] border-[rgba(var(--amber-500),0.3)]"
                  : "bg-[rgba(var(--crimson-500),0.1)] border-[rgba(var(--crimson-500),0.3)]"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {agent.status === "pass" ? (
                  <CheckCircle2 className="w-5 h-5 text-[#81c784]" />
                ) : agent.status === "warn" ? (
                  <AlertTriangle className="w-5 h-5 text-[rgb(var(--amber-500))]" />
                ) : (
                  <XCircle className="w-5 h-5 text-[rgb(var(--crimson-500))]" />
                )}
                <span className="text-sm font-medium text-[rgb(var(--paper))] capitalize">
                  {agent.agent.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-[rgb(var(--paper-muted))]">
                {agent.issues.length === 0 ? "No issues found" : `${agent.issues.length} issues`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SuspectsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[rgb(var(--paper-muted))]">
          Showing {mockSuspects.length} of 22 suspects
        </p>
        <Button
          variant="outline"
          className="border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] hover:bg-[rgba(var(--amber-500),0.1)]"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Suspects
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSuspects.map((suspect) => (
          <div
            key={suspect.id}
            className={cn(
              "noir-card rounded-xl p-4 relative overflow-hidden",
              suspect.isKiller && "border-[rgba(var(--crimson-500),0.5)]"
            )}
          >
            {suspect.isKiller && (
              <div className="absolute top-0 right-0 bg-[rgb(var(--crimson-500))] text-white text-xs px-2 py-1 rounded-bl-lg">
                <Skull className="w-3 h-3 inline mr-1" />
                {suspect.killerRole}
              </div>
            )}

            <div className="flex items-start gap-3 mb-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                  suspect.tier === 1
                    ? "bg-[rgba(var(--crimson-500),0.3)] text-[rgb(var(--crimson-500))]"
                    : suspect.tier === 2
                    ? "bg-[rgba(var(--amber-500),0.3)] text-[rgb(var(--amber-500))]"
                    : "bg-[rgba(var(--paper-dim),0.3)] text-[rgb(var(--paper-dim))]"
                )}
              >
                T{suspect.tier}
              </div>
              <div>
                <h4 className="font-display font-semibold text-[rgb(var(--paper))]">
                  {suspect.name}
                </h4>
                <p className="text-sm text-[rgb(var(--amber-500))]">{suspect.role}</p>
              </div>
            </div>

            <p className="text-sm text-[rgb(var(--paper-muted))] mb-3 line-clamp-2">
              {suspect.motive.summary}
            </p>

            <div className="flex items-center justify-between">
              <Badge
                className={cn(
                  "text-xs",
                  suspect.motive.strength === "extreme"
                    ? "bg-[rgba(var(--crimson-500),0.2)] text-[rgb(var(--crimson-500))] border-[rgba(var(--crimson-500),0.3)]"
                    : suspect.motive.strength === "high"
                    ? "bg-[rgba(var(--amber-500),0.2)] text-[rgb(var(--amber-500))] border-[rgba(var(--amber-500),0.3)]"
                    : "bg-[rgba(var(--paper-dim),0.2)] text-[rgb(var(--paper-dim))] border-[rgba(var(--paper-dim),0.3)]"
                )}
              >
                {suspect.motive.strength} motive
              </Badge>
              {suspect.isRedHerring && (
                <Badge className="text-xs bg-[rgba(var(--paper-dim),0.2)] text-[rgb(var(--paper-muted))] border-[rgba(var(--paper-dim),0.3)]">
                  Red Herring
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidenceTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[rgb(var(--paper-muted))]">
          {mockEvidence.length} evidence items across 3 phases
        </p>
        <Button
          variant="outline"
          className="border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] hover:bg-[rgba(var(--amber-500),0.1)]"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Evidence
        </Button>
      </div>

      <div className="space-y-4">
        {mockEvidence.map((evidence) => (
          <div key={evidence.id} className="noir-card rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[rgba(var(--amber-500),0.2)] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[rgb(var(--amber-500))]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-[rgb(var(--amber-500))]">
                      {evidence.id}
                    </span>
                    <Badge className="badge-draft text-xs">Phase {evidence.revealedInPhase}</Badge>
                    <Badge className="badge-draft text-xs capitalize">{evidence.type}</Badge>
                  </div>
                  <h4 className="font-display font-semibold text-[rgb(var(--paper))]">
                    {evidence.name}
                  </h4>
                  <p className="text-sm text-[rgb(var(--paper-muted))] mt-1">
                    {evidence.description}
                  </p>
                  {evidence.bottleId && (
                    <p className="text-xs text-[rgb(var(--amber-500))] font-mono mt-2">
                      Bottle ID: {evidence.bottleId}
                    </p>
                  )}
                </div>
              </div>
              <Badge
                className={cn(
                  "text-xs",
                  evidence.isClue
                    ? "bg-[rgba(76,175,80,0.2)] text-[#81c784] border-[rgba(76,175,80,0.3)]"
                    : "bg-[rgba(var(--paper-dim),0.2)] text-[rgb(var(--paper-muted))] border-[rgba(var(--paper-dim),0.3)]"
                )}
              >
                {evidence.isClue ? "True Clue" : "Red Herring"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[rgb(var(--paper-muted))]">
          {mockTimeline.length} events in timeline
        </p>
        <Button
          variant="outline"
          className="border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] hover:bg-[rgba(var(--amber-500),0.1)]"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Timeline
        </Button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[rgb(var(--noir-border))]" />

        <div className="space-y-4">
          {mockTimeline.map((event, index) => (
            <div key={event.id} className="relative pl-16">
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute left-4 w-5 h-5 rounded-full border-2 -translate-x-1/2",
                  event.importance === "critical"
                    ? "bg-[rgb(var(--crimson-500))] border-[rgb(var(--crimson-500))]"
                    : event.importance === "major"
                    ? "bg-[rgb(var(--amber-500))] border-[rgb(var(--amber-500))]"
                    : "bg-[rgb(var(--noir-surface-elevated))] border-[rgb(var(--noir-border))]"
                )}
              />

              <div className="noir-card rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-mono text-[rgb(var(--amber-500))]">
                      {event.time}
                    </span>
                    <h4 className="font-display font-semibold text-[rgb(var(--paper))]">
                      {event.title}
                    </h4>
                  </div>
                  <Badge
                    className={cn(
                      "text-xs capitalize",
                      event.type === "murder"
                        ? "bg-[rgba(var(--crimson-500),0.2)] text-[rgb(var(--crimson-500))] border-[rgba(var(--crimson-500),0.3)]"
                        : event.type === "discovery"
                        ? "bg-[rgba(var(--amber-500),0.2)] text-[rgb(var(--amber-500))] border-[rgba(var(--amber-500),0.3)]"
                        : "badge-draft"
                    )}
                  >
                    {event.type}
                  </Badge>
                </div>
                <p className="text-sm text-[rgb(var(--paper-muted))]">{event.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-[rgb(var(--paper-dim))]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {event.location}
                  </span>
                  {event.relatedEvidence && event.relatedEvidence.length > 0 && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {event.relatedEvidence.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(var(--noir-bg),0.8)] border-b border-[rgba(var(--amber-500),0.1)]">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[rgb(var(--paper-muted))] hover:text-[rgb(var(--paper))] hover:bg-[rgba(var(--amber-500),0.1)]"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-3xl font-bold text-[rgb(var(--paper))]">
                    {mockProject.name}
                  </h1>
                  <Badge className="badge-complete">Complete</Badge>
                </div>
                <p className="text-[rgb(var(--paper-muted))] mt-1">
                  {mockProject.settings.theme} • {mockProject.settings.playerCount} players
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] hover:bg-[rgba(var(--amber-500),0.1)]"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button className="bg-gradient-to-r from-[rgb(var(--amber-600))] to-[rgb(var(--amber-500))] hover:from-[rgb(var(--amber-500))] hover:to-[rgb(var(--amber-400))] text-[rgb(var(--noir-bg))] font-semibold btn-glow">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[rgb(var(--paper-muted))] hover:text-[rgb(var(--paper))] hover:bg-[rgba(var(--amber-500),0.1)]"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[rgb(var(--noir-surface-elevated))] border-[rgb(var(--noir-border))]"
                >
                  <DropdownMenuItem className="text-[rgb(var(--paper))] focus:bg-[rgba(var(--amber-500),0.1)]">
                    <Play className="w-4 h-4 mr-2" />
                    Run Validation
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[rgb(var(--paper))] focus:bg-[rgba(var(--amber-500),0.1)]">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Claude Code
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[rgb(var(--noir-border))]" />
                  <DropdownMenuItem className="text-[rgb(var(--crimson-500))] focus:bg-[rgba(var(--crimson-500),0.1)]">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[rgb(var(--noir-surface))] border border-[rgb(var(--noir-border))]">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[rgba(var(--amber-500),0.2)] data-[state=active]:text-[rgb(var(--amber-500))]"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="suspects"
              className="data-[state=active]:bg-[rgba(var(--amber-500),0.2)] data-[state=active]:text-[rgb(var(--amber-500))]"
            >
              <Users className="w-4 h-4 mr-2" />
              Suspects
            </TabsTrigger>
            <TabsTrigger
              value="evidence"
              className="data-[state=active]:bg-[rgba(var(--amber-500),0.2)] data-[state=active]:text-[rgb(var(--amber-500))]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Evidence
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-[rgba(var(--amber-500),0.2)] data-[state=active]:text-[rgb(var(--amber-500))]"
            >
              <Clock className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="suspects">
              <SuspectsTab />
            </TabsContent>
            <TabsContent value="evidence">
              <EvidenceTab />
            </TabsContent>
            <TabsContent value="timeline">
              <TimelineTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
