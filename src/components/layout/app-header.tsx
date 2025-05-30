// src/components/layout/app-header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Save, Upload, Download, Info } from "lucide-react"; // Added Info for a potential help/info icon

interface AppHeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
}

export function AppHeader({ onSave, onLoad, onExport }: AppHeaderProps) {
  return (
    <header className="mb-8 p-4 bg-card shadow-md rounded-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="font-headline text-3xl text-primary mb-4 sm:mb-0">
          Wild Talents 2e: Talent Forge
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onSave} aria-label="Save Character">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button variant="outline" onClick={onLoad} aria-label="Load Character">
            <Upload className="mr-2 h-4 w-4" /> Load
          </Button>
          <Button variant="outline" onClick={onExport} aria-label="Export Character">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
    </header>
  );
}
