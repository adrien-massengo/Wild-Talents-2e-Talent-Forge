// src/app/page.tsx
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/layout/app-header";
import { CharacterTabContent } from "@/components/tabs/character-tab-content";
import { TablesTabContent } from "@/components/tabs/tables-tab-content";
import { SummaryTabContent } from "@/components/tabs/summary-tab-content";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define a basic structure for character data
interface CharacterData {
  basicInfo: {
    name: string;
    archetype: string;
    motivation: string;
  };
  // Add other sections as they are developed
  // stats: Record<string, any>;
  // skills: Record<string, any>;
  // willpower: number;
  // miracles: any[];
}

const initialCharacterData: CharacterData = {
  basicInfo: { name: '', archetype: '', motivation: '' },
};

export default function HomePage() {
  const [characterData, setCharacterData] = React.useState<CharacterData>(initialCharacterData);
  const { toast } = useToast();

  const handleCharacterDataChange = (field: keyof CharacterData['basicInfo'], value: string) => {
    setCharacterData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value,
      }
    }));
  };

  const handleSaveCharacter = () => {
    try {
      localStorage.setItem("wildTalentsCharacter", JSON.stringify(characterData));
      toast({
        title: "Character Saved",
        description: "Your character data has been saved to local storage.",
      });
    } catch (error) {
      console.error("Failed to save character:", error);
      toast({
        title: "Save Error",
        description: "Could not save character data. Local storage might be full or disabled.",
        variant: "destructive",
      });
    }
  };

  const handleLoadCharacter = () => {
    try {
      const savedData = localStorage.getItem("wildTalentsCharacter");
      if (savedData) {
        const parsedData = JSON.parse(savedData) as CharacterData;
        // Basic validation or migration could be added here
        if (parsedData && parsedData.basicInfo) {
           setCharacterData(parsedData);
            toast({
              title: "Character Loaded",
              description: "Character data has been loaded from local storage.",
            });
        } else {
            throw new Error("Invalid character data format.");
        }
      } else {
        toast({
          title: "No Saved Data",
          description: "No character data found in local storage.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load character:", error);
      toast({
        title: "Load Error",
        description: `Could not load character data. ${error instanceof Error ? error.message : 'Unknown error.'}`,
        variant: "destructive",
      });
    }
  };

  const handleExportCharacter = () => {
    try {
      const jsonString = JSON.stringify(characterData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = characterData.basicInfo.name ? `${characterData.basicInfo.name.replace(/\s+/g, '_')}_character.json` : "wild_talents_character.json";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Character Exported",
        description: `Character data downloaded as ${fileName}.`,
      });
    } catch (error) {
       console.error("Failed to export character:", error);
       toast({
        title: "Export Error",
        description: "Could not export character data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader
        onSave={handleSaveCharacter}
        onLoad={handleLoadCharacter}
        onExport={handleExportCharacter}
      />
      <main className="flex-grow container mx-auto px-4 py-2 md:py-4">
        <Tabs defaultValue="character" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-4 shadow-sm">
            <TabsTrigger value="character">Character</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-220px)]"> {/* Adjust height as needed */}
            <div className="p-1"> {/* Padding for scrollbar visibility */}
              <TabsContent value="character" className="mt-0">
                <CharacterTabContent characterData={characterData} onCharacterDataChange={handleCharacterDataChange} />
              </TabsContent>
              <TabsContent value="tables" className="mt-0">
                <TablesTabContent />
              </TabsContent>
              <TabsContent value="summary" className="mt-0">
                <SummaryTabContent characterData={characterData} />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Wild Talents 2e: Talent Forge - Alpha
      </footer>
    </div>
  );
}
