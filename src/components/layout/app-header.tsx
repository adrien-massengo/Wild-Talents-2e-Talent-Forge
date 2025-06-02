
// src/components/layout/app-header.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Save, Upload, Download, Settings, Moon, Sun, ChevronRight, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/use-theme";

interface AppHeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
}

type SettingsView = 'main' | 'appearance';
type ThemeOption = 'light' | 'dark';

export function AppHeader({ onSave, onLoad, onExport }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [settingsView, setSettingsView] = React.useState<SettingsView>('main');

  const handleOpenChange = (open: boolean) => {
    setIsSettingsOpen(open);
    if (!open) {
      // Reset to main view when dialog is closed
      setSettingsView('main');
    }
  };

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

          <Dialog open={isSettingsOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open Settings">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {settingsView === 'appearance' ? 'Appearance Settings' : 'Settings'}
                </DialogTitle>
                {settingsView === 'main' && (
                  <DialogDescription>
                    Manage your application preferences here.
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {settingsView === 'main' && (
                  <Button
                    variant="ghost"
                    className="flex justify-between items-center w-full text-left px-3 py-2 hover:bg-accent"
                    onClick={() => setSettingsView('appearance')}
                  >
                    <span>Appearance</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}

                {settingsView === 'appearance' && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setSettingsView('main')}
                      className="justify-start px-1 mb-2 text-sm text-muted-foreground hover:text-foreground"
                      aria-label="Back to main settings"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Back to Settings
                    </Button>
                    <div className="flex items-center space-x-2 justify-between px-2">
                      <Label htmlFor="theme-select" className="flex items-center">
                        {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                        Theme
                      </Label>
                      <Select value={theme} onValueChange={(value) => setTheme(value as ThemeOption)}>
                        <SelectTrigger id="theme-select" className="w-[180px]">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
