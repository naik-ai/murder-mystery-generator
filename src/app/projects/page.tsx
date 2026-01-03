"use client";

import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(var(--noir-bg),0.8)] border-b border-[rgba(var(--amber-500),0.1)]">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-[rgb(var(--paper))]">
                Projects
              </h1>
              <p className="text-[rgb(var(--paper-muted))] mt-1">
                All your murder mystery projects
              </p>
            </div>
            <Link href="/projects/new">
              <Button className="bg-gradient-to-r from-[rgb(var(--amber-600))] to-[rgb(var(--amber-500))] hover:from-[rgb(var(--amber-500))] hover:to-[rgb(var(--amber-400))] text-[rgb(var(--noir-bg))] font-semibold btn-glow">
                <Plus className="w-4 h-4 mr-2" />
                New Mystery
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="px-8 py-16">
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[rgb(var(--noir-surface))] flex items-center justify-center mb-6 border border-[rgba(var(--amber-500),0.1)]">
            <FolderOpen className="w-12 h-12 text-[rgb(var(--paper-dim))]" />
          </div>
          <h2 className="font-display text-xl font-semibold text-[rgb(var(--paper))] mb-2">
            Projects View
          </h2>
          <p className="text-[rgb(var(--paper-muted))] text-center max-w-md">
            This page will show a detailed list of all projects with filtering and sorting options.
          </p>
        </div>
      </div>
    </div>
  );
}
