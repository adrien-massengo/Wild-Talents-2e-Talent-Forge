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

// Define a detailed structure for character stats
export interface StatDetail {
  dice: string; // e.g., "1D"
  hardDice: string; // e.g., "0HD"
  wiggleDice: string; // e.g., "0WD"
}

// Define the main structure for character data
export interface CharacterData {
  basicInfo: {
    name: string;
    archetype: string;
    motivation: string;
  };
  stats: {
    body: StatDetail;
    coordination: StatDetail;
    sense: StatDetail;
    mind: StatDetail;
    charm: StatDetail;
    command: StatDetail;
  };
  // skills: Record<string, any>; // Add structure as developed
  // willpower: number; // Add structure as developed
  // miracles: any[]; // Add structure as developed
}

const initialStatDetail: StatDetail = { dice: '1D', hardDice: '0HD', wiggleDice: '0WD' };

const initialCharacterData: CharacterData = {
  basicInfo: { name: '', archetype: '', motivation: '' },
  stats: {
    body: { ...initialStatDetail },
    coordination: { ...initialStatDetail },
    sense: { ...initialStatDetail },
    mind: { ...initialStatDetail },
    charm: { ...initialStatDetail },
    command: { ...initialStatDetail },
  },
};

export default function HomePage() {
  const [characterData, setCharacterData] = React.useState<CharacterData>(initialCharacterData);
  const { toast } = useToast();

  const handleBasicInfoChange = (field: keyof CharacterData['basicInfo'], value: string) => {
    setCharacterData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value,
      }
    }));
  };

  const handleStatChange = (
    statName: keyof CharacterData['stats'],
    dieType: keyof StatDetail,
    value: string
  ) => {
    setCharacterData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statName]: {
          ...prev.stats[statName],
          [dieType]: value,
        },
      },
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
        // Basic validation: ensure essential structures like basicInfo and stats exist
        if (parsedData && parsedData.basicInfo && parsedData.stats) {
           // Ensure all stat details are present, falling back to initial if missing
           const validatedStats = { ...initialCharacterData.stats };
           for (const statKey in validatedStats) {
             if (parsedData.stats[statKey as keyof CharacterData['stats']]) {
               validatedStats[statKey as keyof CharacterData['stats']] = {
                 ...initialStatDetail,
                 ...parsedData.stats[statKey as keyof CharacterData['stats']],
               };
             }
           }
           setCharacterData({...parsedData, stats: validatedStats });
            toast({
              title: "Character Loaded",
              description: "Character data has been loaded from local storage.",
            });
        } else {
            // If data is malformed or very old, reset to initial or provide a more specific error
            toast({
              title: "Load Error",
              description: "Saved character data is not in the expected format. Loading default character.",
              variant: "destructive",
            });
            setCharacterData(initialCharacterData); // Optionally reset
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
       setCharacterData(initialCharacterData); // Optionally reset on critical error
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
                <CharacterTabContent 
                  characterData={characterData} 
                  onBasicInfoChange={handleBasicInfoChange}
                  onStatChange={handleStatChange}
                />
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
