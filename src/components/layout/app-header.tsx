
// src/components/layout/app-header.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Save, Upload, Download, Settings, Moon, Sun } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";

interface AppHeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
}

export function AppHeader({ onSave, onLoad, onExport }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  return (
    <header className="mb-8 p-4 bg-card shadow-md rounded-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="font-headline text-3xl text-primary mb-4 sm:mb-0">
          Wild Talents 2e: Talent Forge
        </h1>
        <div className="flex space-x-2 items-center">
          <Button variant="outline" onClick={onSave} aria-label="Save Character">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button variant="outline" onClick={onLoad} aria-label="Load Character">
            <Upload className="mr-2 h-4 w-4" /> Load
          </Button>
          <Button variant="outline" onClick={onExport} aria-label="Export Character">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open Settings">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>
                  Manage your application preferences here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2 justify-between">
                  <Label htmlFor="dark-mode-toggle" className="flex items-center">
                    {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                    Dark Mode
                  </Label>
                  <Switch
                    id="dark-mode-toggle"
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    aria-label="Toggle dark mode"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
