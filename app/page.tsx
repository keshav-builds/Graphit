"use client"

import { DataExplorer } from "@/components/data-explorer"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <DataExplorer />
    </div>
  )
}
