"use client";

import { FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const templates = [
  {
    id: "gatsby",
    name: "Gatsby Era Murder",
    description: "A roaring twenties party turns deadly when the host is found murdered.",
    theme: "1920s Glamour",
    difficulty: "Medium",
    players: "5-8",
  },
  {
    id: "corporate",
    name: "Corporate Conspiracy",
    description: "A tech CEO is killed during a high-stakes merger announcement.",
    theme: "Modern Thriller",
    difficulty: "Hard",
    players: "4-6",
  },
  {
    id: "wedding",
    name: "Wedding Gone Wrong",
    description: "A lavish wedding celebration ends in tragedy.",
    theme: "Bollywood Drama",
    difficulty: "Medium",
    players: "6-10",
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(var(--noir-bg),0.8)] border-b border-[rgba(var(--amber-500),0.1)]">
        <div className="px-8 py-6">
          <h1 className="font-display text-3xl font-bold text-[rgb(var(--paper))]">
            Templates
          </h1>
          <p className="text-[rgb(var(--paper-muted))] mt-1">
            Start from a pre-designed mystery template
          </p>
        </div>
      </header>

      <div className="px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="noir-card rounded-xl p-6 group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--amber-500))] to-[rgb(var(--amber-600))] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[rgb(var(--noir-bg))]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[rgb(var(--paper))]">
                    {template.name}
                  </h3>
                  <span className="text-xs text-[rgb(var(--amber-500))]">
                    {template.theme}
                  </span>
                </div>
              </div>

              <p className="text-[rgb(var(--paper-muted))] text-sm mb-4 line-clamp-2">
                {template.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-[rgb(var(--paper-dim))] mb-4">
                <span>{template.difficulty}</span>
                <span className="w-1 h-1 rounded-full bg-[rgb(var(--noir-border))]" />
                <span>{template.players} players</span>
              </div>

              <Button
                className="w-full bg-[rgb(var(--noir-surface-elevated))] hover:bg-[rgba(var(--amber-500),0.2)] text-[rgb(var(--paper))] border border-[rgb(var(--noir-border))] hover:border-[rgb(var(--amber-500))]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
