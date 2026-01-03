"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Clock,
  Users,
  FileText,
  MoreVertical,
  Trash2,
  Copy,
  ExternalLink,
  Skull,
  Search,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ProjectListItem, ProjectStatus } from "@/lib/types";

// Mock data for demonstration
const mockProjects: ProjectListItem[] = [
  {
    id: "1",
    name: "The Last Toast",
    status: "complete",
    suspectCount: 22,
    evidenceCount: 8,
    createdAt: "2024-01-02T10:00:00Z",
    updatedAt: "2024-01-03T15:30:00Z",
  },
  {
    id: "2",
    name: "Murder at Midnight Manor",
    status: "generating",
    suspectCount: 15,
    evidenceCount: 0,
    createdAt: "2024-01-03T09:00:00Z",
    updatedAt: "2024-01-03T09:15:00Z",
  },
  {
    id: "3",
    name: "The Poisoned Pen",
    status: "draft",
    suspectCount: 0,
    evidenceCount: 0,
    createdAt: "2024-01-01T14:00:00Z",
    updatedAt: "2024-01-01T14:00:00Z",
  },
];

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "badge-draft" },
  generating: { label: "Generating", className: "badge-generating" },
  validating: { label: "Validating", className: "badge-generating" },
  complete: { label: "Complete", className: "badge-complete" },
  error: { label: "Error", className: "badge-error" },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function ProjectCard({ project }: { project: ProjectListItem }) {
  const status = statusConfig[project.status];

  return (
    <div
      className="noir-card rounded-xl p-6 group cursor-pointer"
      style={{ animationDelay: `${Math.random() * 0.2}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(var(--crimson-500))] to-[rgb(var(--crimson-700))] flex items-center justify-center">
            <Skull className="w-5 h-5 text-[rgb(var(--paper))]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-[rgb(var(--paper))] group-hover:text-amber-glow transition-colors">
              {project.name}
            </h3>
            <Badge className={cn("mt-1 text-xs", status.className)}>
              {status.label}
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(var(--paper-muted))] hover:text-[rgb(var(--paper))] hover:bg-[rgba(var(--amber-500),0.1)]"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[rgb(var(--noir-surface-elevated))] border-[rgb(var(--noir-border))]"
          >
            <DropdownMenuItem className="text-[rgb(var(--paper))] focus:bg-[rgba(var(--amber-500),0.1)] focus:text-[rgb(var(--amber-500))]">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[rgb(var(--paper))] focus:bg-[rgba(var(--amber-500),0.1)] focus:text-[rgb(var(--amber-500))]">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[rgb(var(--noir-border))]" />
            <DropdownMenuItem className="text-[rgb(var(--crimson-500))] focus:bg-[rgba(var(--crimson-500),0.1)] focus:text-[rgb(var(--crimson-500))]">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-[rgb(var(--paper-muted))]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{project.suspectCount} suspects</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>{project.evidenceCount} evidence</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-[rgba(var(--amber-500),0.1)] flex items-center text-xs text-[rgb(var(--paper-dim))]">
        <Clock className="w-3 h-3 mr-1" />
        <span>Updated {formatDate(project.updatedAt)}</span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[rgb(var(--noir-surface))] to-[rgb(var(--noir-surface-elevated))] flex items-center justify-center border border-[rgba(var(--amber-500),0.1)]">
          <Skull className="w-16 h-16 text-[rgb(var(--paper-dim))] opacity-50" />
        </div>
        <div className="absolute -inset-4 bg-[rgb(var(--amber-500))] opacity-5 blur-2xl rounded-full" />

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[rgb(var(--crimson-500))] opacity-60" />
        <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-[rgb(var(--amber-500))] opacity-40" />
      </div>

      <h2 className="font-display text-2xl font-semibold text-[rgb(var(--paper))] mb-3">
        No mysteries yet
      </h2>
      <p className="text-[rgb(var(--paper-muted))] text-center max-w-md mb-8 leading-relaxed">
        Create your first murder mystery game. Our AI agents will help you craft
        an intricate web of suspects, motives, and evidence.
      </p>

      <Link href="/projects/new">
        <Button className="bg-gradient-to-r from-[rgb(var(--amber-600))] to-[rgb(var(--amber-500))] hover:from-[rgb(var(--amber-500))] hover:to-[rgb(var(--amber-400))] text-[rgb(var(--noir-bg))] font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(212,165,116,0.3)] transition-all duration-300 px-8 py-6 text-lg btn-glow">
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Mystery
        </Button>
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(var(--noir-bg),0.8)] border-b border-[rgba(var(--amber-500),0.1)]">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-[rgb(var(--paper))]">
                Dashboard
              </h1>
              <p className="text-[rgb(var(--paper-muted))] mt-1">
                Manage your murder mystery projects
              </p>
            </div>

            <Link href="/projects/new">
              <Button className="bg-gradient-to-r from-[rgb(var(--amber-600))] to-[rgb(var(--amber-500))] hover:from-[rgb(var(--amber-500))] hover:to-[rgb(var(--amber-400))] text-[rgb(var(--noir-bg))] font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(212,165,116,0.3)] transition-all duration-300 btn-glow">
                <Plus className="w-4 h-4 mr-2" />
                New Mystery
              </Button>
            </Link>
          </div>

          {/* Search */}
          {projects.length > 0 && (
            <div className="mt-6 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--paper-dim))]" />
                <Input
                  placeholder="Search mysteries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[rgb(var(--noir-surface))] border-[rgb(var(--noir-border))] text-[rgb(var(--paper))] placeholder:text-[rgb(var(--paper-dim))] focus:border-[rgb(var(--amber-500))] focus:ring-[rgb(var(--amber-500))]"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="noir-card rounded-xl p-6 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgb(var(--noir-border))]" />
                  <div className="space-y-2">
                    <div className="w-32 h-5 bg-[rgb(var(--noir-border))] rounded" />
                    <div className="w-16 h-4 bg-[rgb(var(--noir-border))] rounded" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 h-4 bg-[rgb(var(--noir-border))] rounded" />
                  <div className="w-24 h-4 bg-[rgb(var(--noir-border))] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-12 h-12 text-[rgb(var(--paper-dim))] mb-4" />
            <h3 className="font-display text-xl font-semibold text-[rgb(var(--paper))] mb-2">
              No matches found
            </h3>
            <p className="text-[rgb(var(--paper-muted))]">
              Try adjusting your search query
            </p>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="flex items-center gap-4 mb-6 text-sm text-[rgb(var(--paper-muted))]">
              <span>{filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}</span>
              <span className="w-1 h-1 rounded-full bg-[rgb(var(--noir-border))]" />
              <span>
                {filteredProjects.filter((p) => p.status === "complete").length} complete
              </span>
              <span className="w-1 h-1 rounded-full bg-[rgb(var(--noir-border))]" />
              <span>
                {filteredProjects.reduce((acc, p) => acc + p.suspectCount, 0)} total suspects
              </span>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <div
                    className="stagger-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProjectCard project={project} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
