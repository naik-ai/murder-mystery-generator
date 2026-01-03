"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
  Skull,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[rgb(var(--noir-surface))] border-r border-[rgba(var(--amber-500),0.1)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[rgba(var(--amber-500),0.1)]">
        <div className="relative">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(var(--amber-500))] to-[rgb(var(--amber-600))] flex items-center justify-center shadow-lg">
            <Skull className="w-5 h-5 text-[rgb(var(--noir-bg))]" />
          </div>
          <div className="absolute -inset-1 bg-[rgb(var(--amber-500))] opacity-20 blur-md rounded-lg -z-10" />
        </div>
        <div>
          <h1 className="font-display text-lg font-semibold text-[rgb(var(--paper))] leading-tight">
            Mystery
          </h1>
          <p className="text-xs text-[rgb(var(--paper-muted))] tracking-wider uppercase">
            Generator
          </p>
        </div>
      </div>

      {/* New Project Button */}
      <div className="px-4 py-4">
        <Link href="/projects/new">
          <Button className="w-full bg-gradient-to-r from-[rgb(var(--amber-600))] to-[rgb(var(--amber-500))] hover:from-[rgb(var(--amber-500))] hover:to-[rgb(var(--amber-400))] text-[rgb(var(--noir-bg))] font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(212,165,116,0.3)] transition-all duration-300 btn-glow">
            <Plus className="w-4 h-4 mr-2" />
            New Mystery
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "sidebar-link",
                    isActive && "active"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-body">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 opacity-10">
          <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 0L120 20H180L200 40V60H0V40L20 20H80L100 0Z"
              fill="rgb(var(--amber-500))"
            />
            <circle cx="100" cy="40" r="8" fill="rgb(var(--noir-bg))" />
          </svg>
        </div>
      </div>

      {/* Version */}
      <div className="absolute bottom-4 left-0 right-0 px-6">
        <p className="text-xs text-[rgb(var(--paper-dim))] font-mono">
          v1.0.0 — Film Noir Edition
        </p>
      </div>
    </aside>
  );
}
