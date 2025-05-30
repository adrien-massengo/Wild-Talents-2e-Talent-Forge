
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
import type { AttributeName, SkillDefinition as PredefinedSkillDef } from "@/lib/skills-definitions";
import type { MiracleDefinition, MiracleQuality, AppliedExtraOrFlaw, MiracleQualityType, MiracleCapacityType, PowerQualityDefinition } from "@/lib/miracles-definitions";
import { PREDEFINED_MIRACLES_TEMPLATES, POWER_QUALITY_DEFINITIONS, PREDEFINED_EXTRAS, PREDEFINED_FLAWS } from "@/lib/miracles-definitions";


export interface StatDetail {
  dice: string;
  hardDice: string;
  wiggleDice: string;
}

export interface SkillInstance {
  id: string;
  definitionId: string;
  name: string;
  baseName: string;
  linkedAttribute: AttributeName;
  description: string;
  dice: string;
  hardDice: string;
  wiggleDice: string;
  isCustom: boolean;
  typeSpecification?: string;
  notes?: string;
  sampleTypes?: string;
  hasType?: boolean;
}

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
  willpower: {
    purchasedBaseWill: number;
    purchasedWill: number;
  };
  skills: SkillInstance[];
  miracles: MiracleDefinition[];
}

const initialStatDetail: StatDetail = { dice: '2D', hardDice: '0HD', wiggleDice: '0WD' };

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
  willpower: {
    purchasedBaseWill: 0,
    purchasedWill: 0,
  },
  skills: [],
  miracles: [],
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

  const handleWillpowerChange = (field: keyof CharacterData['willpower'], value: number) => {
    setCharacterData(prev => ({
      ...prev,
      willpower: {
        ...prev.willpower,
        [field]: isNaN(value) ? 0 : value,
      }
    }));
  };

  const handleAddSkill = (skillDef: PredefinedSkillDef) => {
    const newSkillInstance: SkillInstance = {
      id: Date.now().toString(),
      definitionId: skillDef.id,
      name: skillDef.hasType ? `${skillDef.name} (Unspecified)` : skillDef.name,
      baseName: skillDef.name,
      linkedAttribute: skillDef.linkedAttribute,
      description: skillDef.description,
      dice: '1D',
      hardDice: '0HD',
      wiggleDice: '0WD',
      isCustom: false,
      typeSpecification: '',
      notes: skillDef.notes,
      sampleTypes: skillDef.sampleTypes,
      hasType: skillDef.hasType,
    };
    setCharacterData(prev => ({ ...prev, skills: [...prev.skills, newSkillInstance] }));
  };

  const handleAddCustomSkill = () => {
    const newCustomSkill: SkillInstance = {
      id: Date.now().toString(),
      definitionId: `custom-${Date.now().toString()}`,
      name: 'Custom Skill',
      baseName: 'Custom Skill',
      linkedAttribute: 'body',
      description: 'Custom skill description.',
      dice: '1D',
      hardDice: '0HD',
      wiggleDice: '0WD',
      isCustom: true,
      typeSpecification: '',
    };
    setCharacterData(prev => ({ ...prev, skills: [...prev.skills, newCustomSkill] }));
  };

  const handleRemoveSkill = (skillIdToRemove: string) => {
    setCharacterData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== skillIdToRemove),
    }));
  };

  const handleSkillChange = (
    skillId: string,
    field: keyof SkillInstance,
    value: string | AttributeName
  ) => {
    setCharacterData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => {
        if (skill.id === skillId) {
          const updatedSkill = { ...skill, [field]: value };
          if (field === 'typeSpecification' && skill.hasType) {
            updatedSkill.name = `${skill.baseName}${value ? ` (${value})` : ' (Unspecified)'}`;
          }
          if (field === 'name' && skill.isCustom) {
             updatedSkill.baseName = value as string;
          }
          return updatedSkill;
        }
        return skill;
      }),
    }));
  };

  // Miracle Handlers
  const handleAddMiracle = (type: 'custom' | string) => { // string for predefined miracle definitionId
    let newMiracle: MiracleDefinition;
    if (type === 'custom') {
      newMiracle = {
        id: `miracle-${Date.now()}`,
        name: 'New Custom Miracle',
        dice: '1D',
        hardDice: '0HD',
        wiggleDice: '0WD',
        qualities: [],
        description: 'Custom miracle description.',
        isCustom: true,
        isMandatory: false,
      };
    } else {
      const template = PREDEFINED_MIRACLES_TEMPLATES.find(m => m.definitionId === type);
      if (!template) return;
      newMiracle = {
        ...template,
        id: `miracle-${template.definitionId}-${Date.now()}`,
        dice: '1D', // Default dice for predefined, can be adjusted
        hardDice: '0HD',
        wiggleDice: '0WD',
        qualities: template.qualities.map(q => ({...q, id: `${q.id}-${Date.now()}`})), // ensure unique quality IDs
        isCustom: false,
        isMandatory: false, // Default, can be changed
      };
    }
    setCharacterData(prev => ({ ...prev, miracles: [...prev.miracles, newMiracle] }));
  };

  const handleRemoveMiracle = (miracleId: string) => {
    setCharacterData(prev => ({
      ...prev,
      miracles: prev.miracles.filter(m => m.id !== miracleId),
    }));
  };

  const handleMiracleChange = (miracleId: string, field: keyof MiracleDefinition, value: any) => {
    setCharacterData(prev => ({
      ...prev,
      miracles: prev.miracles.map(m => m.id === miracleId ? { ...m, [field]: value } : m),
    }));
  };

  const handleAddMiracleQuality = (miracleId: string) => {
    const newQuality: MiracleQuality = {
      id: `quality-${Date.now()}`,
      type: 'attacks', // Default type
      capacity: 'touch', // Default capacity
      levels: 0,
      extras: [],
      flaws: [],
    };
    setCharacterData(prev => ({
      ...prev,
      miracles: prev.miracles.map(m =>
        m.id === miracleId ? { ...m, qualities: [...m.qualities, newQuality] } : m
      ),
    }));
  };

  const handleRemoveMiracleQuality = (miracleId: string, qualityId: string) => {
    setCharacterData(prev => ({
      ...prev,
      miracles: prev.miracles.map(m =>
        m.id === miracleId ? { ...m, qualities: m.qualities.filter(q => q.id !== qualityId) } : m
      ),
    }));
  };

  const handleMiracleQualityChange = (
    miracleId: string,
    qualityId: string,
    field: keyof MiracleQuality,
    value: any
  ) => {
    setCharacterData(prev => ({
      ...prev,
      miracles: prev.miracles.map(m =>
        m.id === miracleId ? {
          ...m,
          qualities: m.qualities.map(q =>
            q.id === qualityId ? { ...q, [field]: value } : q
          )
        } : m
      ),
    }));
  };

  const handleAddExtraOrFlawToQuality = (
    miracleId: string,
    qualityId: string,
    itemType: 'extra' | 'flaw',
    definitionId?: string
  ) => {
    let newItem: AppliedExtraOrFlaw;
    if (definitionId) {
      const collection = itemType === 'extra' ? PREDEFINED_EXTRAS : PREDEFINED_FLAWS;
      const definition = collection.find(item => item.id === definitionId);
      if (!definition) return;
      newItem = {
        id: `${itemType}-def-${definition.id}-${Date.now()}`,
        definitionId: definition.id,
        name: definition.name,
        costModifier: definition.costModifier,
        isCustom: false,
      };
    } else { // Custom
      newItem = {
        id: `custom-${itemType}-${Date.now()}`,
        name: `Custom ${itemType === 'extra' ? 'Extra' : 'Flaw'}`,
        costModifier: itemType === 'extra' ? 1 : -1, // Default custom costs
        isCustom: true,
      };
    }

    setCharacterData(prev => ({
      ...prev,
      miracles: prev.miracles.map(m =>
        m.id === miracleId ? {
          ...m,
          qualities: m.qualities.map(q => {
            if (q.id === qualityId) {
              return itemType === 'extra'
                ? { ...q, extras: [...q.extras, newItem] }
                : { ...q, flaws: [...q.flaws, newItem] };
            }
            return q;
          })
        } : m
      ),
    }));
  };

  const handleRemoveExtraOrFlawFromQuality = (
    miracleId: string,
    qualityId: string,
    itemType: 'extra' | 'flaw',
    itemId: string
  ) => {
    setCharacterData(prev => ({
      ...prev,
      miracles: prev.miracles.map(m =>
        m.id === miracleId ? {
          ...m,
          qualities: m.qualities.map(q => {
            if (q.id === qualityId) {
              return itemType === 'extra'
                ? { ...q, extras: q.extras.filter(ex => ex.id !== itemId) }
                : { ...q, flaws: q.flaws.filter(fl => fl.id !== itemId) };
            }
            return q;
          })
        } : m
      ),
    }));
  };

  const handleExtraOrFlawChange = (
    miracleId: string,
    qualityId: string,
    itemType: 'extra' | 'flaw',
    itemId: string,
    field: keyof AppliedExtraOrFlaw,
    value: string | number
  ) => {
     setCharacterData(prev => ({
      ...prev,
      miracles: prev.miracles.map(m =>
        m.id === miracleId ? {
          ...m,
          qualities: m.qualities.map(q => {
            if (q.id === qualityId) {
              const listToUpdate = itemType === 'extra' ? q.extras : q.flaws;
              const updatedList = listToUpdate.map(item => {
                if (item.id === itemId) {
                  let processedValue = value;
                  if (field === 'costModifier') {
                    const numericValue = Number(value); 
                    processedValue = isNaN(numericValue) ? 0 : numericValue;
                  }
                  return { ...item, [field]: processedValue };
                }
                return item;
              });
              return itemType === 'extra'
                ? { ...q, extras: updatedList }
                : { ...q, flaws: updatedList };
            }
            return q;
          })
        } : m
      ),
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
        const parsedData = JSON.parse(savedData) as Partial<CharacterData>;

        const validatedData: CharacterData = {
          ...initialCharacterData,
          ...parsedData,
          basicInfo: { ...initialCharacterData.basicInfo, ...(parsedData.basicInfo || {}) },
          stats: { ...initialCharacterData.stats }, // Ensures all stats exist
          willpower: { ...initialCharacterData.willpower, ...(parsedData.willpower || {}) },
          skills: parsedData.skills ? parsedData.skills.map(skill => ({
            id: `loaded-skill-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            definitionId: typeof skill.definitionId === 'string' ? skill.definitionId : '',
            name: typeof skill.name === 'string' ? skill.name : 'Unnamed Skill',
            baseName: typeof skill.baseName === 'string' ? skill.baseName : 'Unnamed Skill',
            linkedAttribute: typeof skill.linkedAttribute === 'string' ? skill.linkedAttribute as AttributeName : 'body' as AttributeName,
            description: typeof skill.description === 'string' ? skill.description : '',
            dice: typeof skill.dice === 'string' ? skill.dice : '1D',
            hardDice: typeof skill.hardDice === 'string' ? skill.hardDice : '0HD',
            wiggleDice: typeof skill.wiggleDice === 'string' ? skill.wiggleDice : '0WD',
            isCustom: typeof skill.isCustom === 'boolean' ? skill.isCustom : true,
            typeSpecification: typeof skill.typeSpecification === 'string' ? skill.typeSpecification : '',
            notes: typeof skill.notes === 'string' ? skill.notes : undefined,
            sampleTypes: typeof skill.sampleTypes === 'string' ? skill.sampleTypes : undefined,
            hasType: typeof skill.hasType === 'boolean' ? skill.hasType : false,
            ...skill, 
            id: `loaded-skill-${Date.now()}-${Math.random().toString(36).substring(7)}`, 
          })) : [],
          miracles: parsedData.miracles ? parsedData.miracles.map(miracle => {
            const defaultMiracle: MiracleDefinition = {
              id: `loaded-miracle-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              name: 'Unnamed Miracle',
              dice: '1D',
              hardDice: '0HD',
              wiggleDice: '0WD',
              qualities: [],
              description: '',
              isCustom: true,
              isMandatory: false,
            };
            return {
              ...defaultMiracle,
              ...miracle,
              name: typeof miracle.name === 'string' ? miracle.name : defaultMiracle.name,
              dice: typeof miracle.dice === 'string' ? miracle.dice : defaultMiracle.dice,
              hardDice: typeof miracle.hardDice === 'string' ? miracle.hardDice : defaultMiracle.hardDice,
              wiggleDice: typeof miracle.wiggleDice === 'string' ? miracle.wiggleDice : defaultMiracle.wiggleDice,
              description: typeof miracle.description === 'string' ? miracle.description : defaultMiracle.description,
              isCustom: typeof miracle.isCustom === 'boolean' ? miracle.isCustom : defaultMiracle.isCustom,
              isMandatory: typeof miracle.isMandatory === 'boolean' ? miracle.isMandatory : defaultMiracle.isMandatory,
              id: defaultMiracle.id, 
              qualities: miracle.qualities ? miracle.qualities.map(quality => {
                const defaultQuality: MiracleQuality = {
                  id: `loaded-quality-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                  type: 'useful' as MiracleQualityType,
                  capacity: 'touch' as MiracleCapacityType,
                  levels: 0,
                  extras: [],
                  flaws: [],
                };
                return {
                  ...defaultQuality,
                  ...quality,
                  type: typeof quality.type === 'string' ? quality.type as MiracleQualityType : defaultQuality.type,
                  capacity: typeof quality.capacity === 'string' ? quality.capacity as MiracleCapacityType : defaultQuality.capacity,
                  levels: typeof quality.levels === 'number' && !isNaN(quality.levels) ? quality.levels : defaultQuality.levels,
                  id: defaultQuality.id, 
                  extras: quality.extras ? quality.extras.map(ex => {
                    const defaultExtra: AppliedExtraOrFlaw = {
                        id: `loaded-extra-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                        name: 'Custom Extra',
                        costModifier: 1, 
                        isCustom: true,
                    };
                    let loadedCostModifier = ex.costModifier;
                    if (typeof loadedCostModifier !== 'number' || isNaN(loadedCostModifier)) {
                        const predefinedEx = PREDEFINED_EXTRAS.find(pEx => pEx.id === ex.definitionId);
                        loadedCostModifier = ex.isCustom ? 1 : (predefinedEx?.costModifier ?? 0);
                    }
                    if (isNaN(loadedCostModifier)) { // Final check for NaN
                        loadedCostModifier = ex.isCustom ? 1 : 0;
                    }
                    return {
                        ...defaultExtra,
                        ...ex,
                        name: typeof ex.name === 'string' ? ex.name : defaultExtra.name,
                        costModifier: loadedCostModifier,
                        isCustom: typeof ex.isCustom === 'boolean' ? ex.isCustom : defaultExtra.isCustom,
                        id: defaultExtra.id,
                    };
                  }) : [],
                  flaws: quality.flaws ? quality.flaws.map(fl => {
                    const defaultFlaw: AppliedExtraOrFlaw = {
                        id: `loaded-flaw-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                        name: 'Custom Flaw',
                        costModifier: -1, 
                        isCustom: true,
                    };
                    let loadedCostModifier = fl.costModifier;
                    if (typeof loadedCostModifier !== 'number' || isNaN(loadedCostModifier)) {
                        const predefinedFl = PREDEFINED_FLAWS.find(pFL => pFL.id === fl.definitionId);
                        loadedCostModifier = fl.isCustom ? -1 : (predefinedFl?.costModifier ?? 0);
                    }
                    if (isNaN(loadedCostModifier)) { // Final check for NaN
                        loadedCostModifier = fl.isCustom ? -1 : 0;
                    }
                     return {
                        ...defaultFlaw,
                        ...fl,
                        name: typeof fl.name === 'string' ? fl.name : defaultFlaw.name,
                        costModifier: loadedCostModifier,
                        isCustom: typeof fl.isCustom === 'boolean' ? fl.isCustom : defaultFlaw.isCustom,
                        id: defaultFlaw.id,
                    };
                  }) : [],
                };
              }) : [],
            };
          }) : [],
        };

        for (const statKey in initialCharacterData.stats) {
          if (parsedData.stats && parsedData.stats[statKey as keyof CharacterData['stats']]) {
            validatedData.stats[statKey as keyof CharacterData['stats']] = {
              ...initialStatDetail,
              ...parsedData.stats[statKey as keyof CharacterData['stats']],
            };
          }
        }

        setCharacterData(validatedData);
        toast({
          title: "Character Loaded",
          description: "Character data has been loaded from local storage.",
        });

      } else {
        toast({
          title: "No Saved Data",
          description: "No character data found in local storage.",
          variant: "destructive",
        });
        setCharacterData(initialCharacterData);
      }
    } catch (error) {
      console.error("Failed to load character:", error);
      toast({
        title: "Load Error",
        description: `Could not load character data. ${error instanceof Error ? error.message : 'Unknown error.'}`,
        variant: "destructive",
      });
       setCharacterData(initialCharacterData);
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

          <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-220px)]">
            <div className="p-1">
              <TabsContent value="character" className="mt-0">
                <CharacterTabContent
                  characterData={characterData}
                  onBasicInfoChange={handleBasicInfoChange}
                  onStatChange={handleStatChange}
                  onWillpowerChange={handleWillpowerChange}
                  onAddSkill={handleAddSkill}
                  onAddCustomSkill={handleAddCustomSkill}
                  onRemoveSkill={handleRemoveSkill}
                  onSkillChange={handleSkillChange}
                  onAddMiracle={handleAddMiracle}
                  onRemoveMiracle={handleRemoveMiracle}
                  onMiracleChange={handleMiracleChange}
                  onAddMiracleQuality={handleAddMiracleQuality}
                  onRemoveMiracleQuality={handleRemoveMiracleQuality}
                  onMiracleQualityChange={handleMiracleQualityChange}
                  onAddExtraOrFlawToQuality={handleAddExtraOrFlawToQuality}
                  onRemoveExtraOrFlawFromQuality={handleRemoveExtraOrFlawFromQuality}
                  onExtraOrFlawChange={handleExtraOrFlawChange}
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
