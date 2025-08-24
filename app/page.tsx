"use client";

import React from "react";
import { DataExplorer } from "@/components/data-explorer/DataExplorer";
import { ThemeToggle } from "@/components/theme-toggle";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function HomePage() {
  return (
    <BackgroundBeamsWithCollision className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div>
        {/* Theme toggle positioned fixed at top-right */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Main Data Explorer feature */}
        <DataExplorer />
      </div>
    </BackgroundBeamsWithCollision>
  );
}
