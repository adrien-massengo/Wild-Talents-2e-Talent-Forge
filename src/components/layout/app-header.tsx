
// src/components/layout/app-header.tsx
"use client";

import * as React from "react";
import type { GmSettings } from "@/app/page"; // Added for onImportGmSettings
import type { GmCustomArchetypeData } from "@/app/page"; // Import for custom archetype data
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
  onImportCustomArchetype: (archetypeData: GmCustomArchetypeData) => void; // New prop
  onResetToDefault: () => void;
}

type SettingsView = 'main' | 'appearance' | 'characters' | 'imports'; 
type ThemeOption = 'light' | 'dark';
type ImportType = 'gmSettings' | 'customArchetype' | null; // To track what to import

export function AppHeader({ 
  onSave, 
  onLoad, 
  onExport, 
  onImportGmSettings, 
  onImportCustomArchetype, // Destructure new prop
  onResetToDefault 
}: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [settingsView, setSettingsView] = React.useState<SettingsView>('main');
  const [importType, setImportType] = React.useState<ImportType>(null); // New state for import type
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast(); 

  const handleOpenChange = (open: boolean) => {
    setIsSettingsOpen(open);
    if (!open) {
      setSettingsView('main');
      setImportType(null); // Reset import type when dialog closes
    }
  };

  const handleTriggerImport = (type: ImportType) => {
    setImportType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImportType(null); // Reset if no file selected
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Failed to read file content.");
        }
        
        if (importType === 'gmSettings') {
          const importedSettings = JSON.parse(text) as GmSettings;
          if (importedSettings && typeof importedSettings === 'object' && importedSettings.pointRestrictions) {
            onImportGmSettings(importedSettings);
            // Toast is handled in page.tsx to ensure proper sequencing with state updates
            handleOpenChange(false); 
          } else {
            throw new Error("Invalid GM settings file format.");
          }
        } else if (importType === 'customArchetype') {
          const importedArchetype = JSON.parse(text) as GmCustomArchetypeData;
          // Basic validation for custom archetype
          if (importedArchetype && typeof importedArchetype === 'object' && importedArchetype.name !== undefined && importedArchetype.sourceMQIds) {
            onImportCustomArchetype(importedArchetype);
             // Toast is handled in page.tsx
            handleOpenChange(false);
          } else {
            throw new Error("Invalid Custom Archetype file format.");
          }
        }
      } catch (error) {
        console.error(`Failed to import ${importType}:`, error);
        toast({
          title: "Import Error",
          description: error instanceof Error ? error.message : `Could not parse or apply ${importType} data.`,
          variant: "destructive",
        });
      } finally {
        if (event.target) {
          event.target.value = "";
        }
        setImportType(null); // Reset import type after handling
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
                    Import GM settings or custom archetype files.
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
                        <FileInput className="mr-2 h-4 w-4" />
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
                       <Button variant="outline" onClick={() => handleTriggerImport('gmSettings')} aria-label="Import GM Settings">
                        <Upload className="mr-2 h-4 w-4" /> Import GM Settings
                      </Button>
                      <Button variant="outline" onClick={() => handleTriggerImport('customArchetype')} aria-label="Import Custom Archetype">
                        <Upload className="mr-2 h-4 w-4" /> Import Custom Archetype
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

