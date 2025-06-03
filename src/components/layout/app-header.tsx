
// src/components/layout/app-header.tsx
"use client";

import * as React from "react";
import type { GmSettings } from "@/app/page"; // Added for onImportGmSettings
import { Button } from "@/components/ui/button";
import { Save, Upload, Download, Settings, Moon, Sun, ChevronRight, ChevronLeft, User, FileInput, RotateCcw } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast"; 

interface AppHeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onImportGmSettings: (settings: GmSettings) => void;
  onResetToDefault: () => void; // New prop for resetting to default
}

type SettingsView = 'main' | 'appearance' | 'characters' | 'imports'; 
type ThemeOption = 'light' | 'dark';

export function AppHeader({ onSave, onLoad, onExport, onImportGmSettings, onResetToDefault }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [settingsView, setSettingsView] = React.useState<SettingsView>('main');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast(); 

  const handleOpenChange = (open: boolean) => {
    setIsSettingsOpen(open);
    if (!open) {
      // Reset to main view when dialog is closed
      setSettingsView('main');
    }
  };

  const handleImportButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Failed to read file content.");
        }
        const importedSettings = JSON.parse(text) as GmSettings;
        // Basic validation can be done here, or more thoroughly in the parent
        if (importedSettings && typeof importedSettings === 'object' && importedSettings.pointRestrictions) {
          onImportGmSettings(importedSettings);
          toast({ title: "GM Settings Imported", description: "Character creation parameters have been successfully imported and applied." });
          handleOpenChange(false); // Close dialog on successful import
        } else {
          throw new Error("Invalid GM settings file format.");
        }
      } catch (error) {
        console.error("Failed to import GM settings:", error);
        toast({
          title: "Import Error",
          description: error instanceof Error ? error.message : "Could not parse or apply GM settings.",
          variant: "destructive",
        });
      } finally {
        // Reset file input value to allow importing the same file again
        if (event.target) {
          event.target.value = "";
        }
      }
    };
    reader.readAsText(file);
  };


  return (
    <header className="mb-8 p-4 bg-card shadow-md rounded-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="font-headline text-3xl text-primary mb-4 sm:mb-0">
          Wild Talents 2e: Talent Forge
        </h1>
        <div className="flex space-x-2 items-center">
          <Button variant="outline" onClick={onExport} aria-label="Export Character">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button variant="outline" onClick={onResetToDefault} aria-label="Reset to Default">
            <RotateCcw className="mr-2 h-4 w-4" /> Default
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
                  {settingsView === 'appearance' ? 'Appearance Settings' 
                    : settingsView === 'characters' ? 'Character Actions'
                    : settingsView === 'imports' ? 'Import Settings'
                    : 'Settings'}
                </DialogTitle>
                {settingsView === 'main' && (
                  <DialogDescription>
                    Manage your application preferences, character, and import actions here.
                  </DialogDescription>
                )}
                 {settingsView === 'characters' && (
                  <DialogDescription>
                    Save or load your character data.
                  </DialogDescription>
                )}
                {settingsView === 'imports' && (
                  <DialogDescription>
                    Import settings files.
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {settingsView === 'main' && (
                  <>
                    <Button
                      variant="ghost"
                      className="flex justify-between items-center w-full text-left px-3 py-2 hover:bg-accent"
                      onClick={() => setSettingsView('characters')}
                    >
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Character Actions</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                     <Button
                      variant="ghost"
                      className="flex justify-between items-center w-full text-left px-3 py-2 hover:bg-accent"
                      onClick={() => setSettingsView('imports')}
                    >
                      <div className="flex items-center">
                        <FileInput className="mr-2 h-4 w-4" /> {/* Using FileInput as placeholder icon */}
                        <span>Import Settings</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex justify-between items-center w-full text-left px-3 py-2 hover:bg-accent"
                      onClick={() => setSettingsView('appearance')}
                    >
                      <div className="flex items-center">
                        {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                        <span>Appearance</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {settingsView === 'characters' && (
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
                    <div className="flex flex-col space-y-3 px-2">
                       <Button variant="outline" onClick={() => { onSave(); handleOpenChange(false);}} aria-label="Save Character">
                        <Save className="mr-2 h-4 w-4" /> Save Character
                      </Button>
                      <Button variant="outline" onClick={() => { onLoad(); handleOpenChange(false);}} aria-label="Load Character">
                        <Upload className="mr-2 h-4 w-4" /> Load Character
                      </Button>
                    </div>
                  </>
                )}

                {settingsView === 'imports' && (
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
                    <div className="flex flex-col space-y-3 px-2">
                       <Button variant="outline" onClick={handleImportButtonClick} aria-label="Import Character Creation Parameters">
                        <Upload className="mr-2 h-4 w-4" /> Import Character Creation Parameters
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </div>
                  </>
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
