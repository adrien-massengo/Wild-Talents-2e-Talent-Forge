
// src/app/page.tsx
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/layout/app-header";
import { CharacterTabContent } from "@/components/tabs/character-tab-content";
import { TablesTabContent } from "@/components/tabs/tables-tab-content";
import { SummaryTabContent } from "@/components/tabs/summary-tab-content";
import { GmToolsTabContent } from "@/components/tabs/gm-tools-tab-content";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AttributeName, SkillDefinition as PredefinedSkillDef } from "@/lib/skills-definitions";
import type { MiracleDefinition, MiracleQuality, AppliedExtraOrFlaw, MiracleQualityType, MiracleCapacityType } from "@/lib/miracles-definitions";
import { PREDEFINED_MIRACLES_TEMPLATES, PREDEFINED_EXTRAS, PREDEFINED_FLAWS } from "@/lib/miracles-definitions";
import type { AllergyEffectType, AllergySubstanceType, BruteFrailType, DiscardedAttributeType, ArchetypeDefinition } from "@/lib/character-definitions";
import { ARCHETYPES, SOURCE_META_QUALITIES, PERMISSION_META_QUALITIES, INTRINSIC_META_QUALITIES } from "@/lib/character-definitions";


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

export interface MotivationObject {
  id: string;
  motivationText: string;
  type: 'loyalty' | 'passion';
  investedBaseWill: number;
}

export interface BasicInfo {
  name: string;
  motivations: MotivationObject[];
  selectedArchetypeId?: string;
  selectedSourceMQIds: string[];
  selectedPermissionMQIds: string[];
  selectedIntrinsicMQIds: string[];
  intrinsicAllergyConfig: {
    [intrinsicId: string]: {
        substance?: AllergySubstanceType;
        effect?: AllergyEffectType;
    }
  };
  intrinsicBruteFrailConfig: {
    [intrinsicId: string]: {
        type?: BruteFrailType;
    }
  };
  intrinsicCustomStatsConfig: {
    [intrinsicId: string]: {
        discardedAttribute?: DiscardedAttributeType;
    }
  };
  intrinsicMandatoryPowerConfig: {
    [intrinsicId: string]: {
        count: number;
    }
  };
  intrinsicVulnerableConfig: {
    [intrinsicId: string]: {
        extraBoxes: number;
    }
  };
}

export interface CharacterData {
  basicInfo: BasicInfo;
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
  pointLimit: number;
}

const initialStatDetail: StatDetail = { dice: '2D', hardDice: '0HD', wiggleDice: '0WD' };

const initialBasicInfo: BasicInfo = {
  name: '',
  motivations: [],
  selectedArchetypeId: 'custom',
  selectedSourceMQIds: [],
  selectedPermissionMQIds: [],
  selectedIntrinsicMQIds: [],
  intrinsicAllergyConfig: {},
  intrinsicBruteFrailConfig: {},
  intrinsicCustomStatsConfig: {},
  intrinsicMandatoryPowerConfig: {},
  intrinsicVulnerableConfig: {},
};

const initialCharacterData: CharacterData = {
  basicInfo: { ...initialBasicInfo },
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
  pointLimit: 250,
};

export default function HomePage() {
  const [characterData, setCharacterData] = React.useState<CharacterData>(initialCharacterData);
  const { toast } = useToast();

  const handleBasicInfoChange = (field: keyof Omit<BasicInfo, 'motivations'>, value: any) => {
    setCharacterData(prev => {
      const newBasicInfo = { ...prev.basicInfo, [field]: value };
      let newWillpower = { ...prev.willpower };

      if (field === 'selectedArchetypeId') {
        const archetype = ARCHETYPES.find(arch => arch.id === value);
        if (archetype && archetype.id !== 'custom') {
          newBasicInfo.selectedSourceMQIds = archetype.sourceMQIds || [];
          newBasicInfo.selectedPermissionMQIds = archetype.permissionMQIds || [];
          newBasicInfo.selectedIntrinsicMQIds = archetype.intrinsicMQIds || [];
          
          const currentIntrinsicConfigs = {
            intrinsicAllergyConfig: { ...newBasicInfo.intrinsicAllergyConfig },
            intrinsicBruteFrailConfig: { ...newBasicInfo.intrinsicBruteFrailConfig },
            intrinsicCustomStatsConfig: { ...newBasicInfo.intrinsicCustomStatsConfig },
            intrinsicMandatoryPowerConfig: { ...newBasicInfo.intrinsicMandatoryPowerConfig },
            intrinsicVulnerableConfig: { ...newBasicInfo.intrinsicVulnerableConfig },
          };
          newBasicInfo.intrinsicAllergyConfig = {};
          newBasicInfo.intrinsicBruteFrailConfig = {};
          newBasicInfo.intrinsicCustomStatsConfig = {};
          newBasicInfo.intrinsicMandatoryPowerConfig = {};
          newBasicInfo.intrinsicVulnerableConfig = {};

          let updatedMiracles = [...prev.miracles];
          updatedMiracles = updatedMiracles.filter(m => !m.definitionId?.startsWith('archetype-mandatory-'));


          (archetype.intrinsicMQIds || []).forEach(mqId => {
            const intrinsicDef = INTRINSIC_META_QUALITIES.find(imq => imq.id === mqId);
            if (intrinsicDef?.configKey) {
                // @ts-ignore
                newBasicInfo[intrinsicDef.configKey][mqId] = currentIntrinsicConfigs[intrinsicDef.configKey]?.[mqId] || (intrinsicDef.configKey === 'intrinsicMandatoryPowerConfig' || intrinsicDef.configKey === 'intrinsicVulnerableConfig' ? {count:0, extraBoxes:0} : {});
                 if (intrinsicDef.id === 'mandatory_power') {
                    // @ts-ignore
                    const count = newBasicInfo.intrinsicMandatoryPowerConfig[mqId]?.count || ARCHETYPES.find(a => a.id === value)?.mandatoryPowerText ? 1 : 0;
                    // @ts-ignore
                    newBasicInfo.intrinsicMandatoryPowerConfig[mqId] = { count };
                    updatedMiracles = handleIntrinsicConfigChange(mqId, 'intrinsicMandatoryPowerConfig', 'count', count, updatedMiracles, true) as MiracleDefinition[];
                }
            }
          });
           // Apply willpower restrictions for the new archetype's intrinsics
          if (newBasicInfo.selectedIntrinsicMQIds.includes('no_base_will')) {
            newWillpower.purchasedBaseWill = 0;
            newWillpower.purchasedWill = 0;
          } else if (newBasicInfo.selectedIntrinsicMQIds.includes('no_willpower')) {
            newWillpower.purchasedWill = 0;
          }

          return { ...prev, basicInfo: newBasicInfo, willpower: newWillpower, miracles: updatedMiracles };
        } else if (value === 'custom') {
          // User selected custom, MQs are handled by onMQSelectionChange
          // Keep existing MQ selections if switching from a sample archetype to custom
        }
      }
      return { ...prev, basicInfo: newBasicInfo, willpower: newWillpower };
    });
  };
  
  const handleAddMotivation = () => {
    setCharacterData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        motivations: [
          ...prev.basicInfo.motivations,
          { id: `motivation-${Date.now()}`, motivationText: '', type: 'passion', investedBaseWill: 0 }
        ]
      }
    }));
  };

  const handleRemoveMotivation = (motivationId: string) => {
    setCharacterData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        motivations: prev.basicInfo.motivations.filter(m => m.id !== motivationId)
      }
    }));
  };

  const handleMotivationChange = (motivationId: string, field: keyof MotivationObject, value: any) => {
    setCharacterData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        motivations: prev.basicInfo.motivations.map(m =>
          m.id === motivationId ? { ...m, [field]: value } : m
        )
      }
    }));
  };


  const handleMQSelectionChange = (
    mqType: 'source' | 'permission' | 'intrinsic',
    mqId: string,
    isSelected: boolean
  ) => {
    setCharacterData(prev => {
      const newBasicInfo = { ...prev.basicInfo };
      let currentSelection: string[] = [];
      let newWillpower = { ...prev.willpower };

      if (mqType === 'source') currentSelection = [...newBasicInfo.selectedSourceMQIds];
      else if (mqType === 'permission') currentSelection = [...newBasicInfo.selectedPermissionMQIds];
      else if (mqType === 'intrinsic') currentSelection = [...newBasicInfo.selectedIntrinsicMQIds];

      let updatedMiracles = [...prev.miracles];

      if (isSelected) {
        if (!currentSelection.includes(mqId)) {
          currentSelection.push(mqId);
           if (mqType === 'intrinsic' && mqId === 'mandatory_power') {
                // @ts-ignore
                const currentCount = newBasicInfo.intrinsicMandatoryPowerConfig[mqId]?.count || 0;
                updatedMiracles = handleIntrinsicConfigChange(mqId, 'intrinsicMandatoryPowerConfig', 'count', currentCount, updatedMiracles, true) as MiracleDefinition[];
           }
           if (mqType === 'intrinsic' && mqId === 'no_base_will') {
              newWillpower.purchasedBaseWill = 0;
              newWillpower.purchasedWill = 0;
           } else if (mqType === 'intrinsic' && mqId === 'no_willpower' && !currentSelection.includes('no_base_will')) {
             newWillpower.purchasedWill = 0;
           }
        }
      } else {
        currentSelection = currentSelection.filter(id => id !== mqId);
        if (mqType === 'intrinsic') {
            const intrinsicDef = INTRINSIC_META_QUALITIES.find(imq => imq.id === mqId);
            if (intrinsicDef?.configKey) {
                 // @ts-ignore
                delete newBasicInfo[intrinsicDef.configKey][mqId];
                 if (intrinsicDef.id === 'mandatory_power') {
                    updatedMiracles = handleIntrinsicConfigChange(mqId, 'intrinsicMandatoryPowerConfig', 'count', 0, updatedMiracles, true) as MiracleDefinition[];
                }
            }
            // If 'no_base_will' is deselected, but 'no_willpower' is still selected, ensure purchasedWill remains 0
            if (mqId === 'no_base_will' && newBasicInfo.selectedIntrinsicMQIds.includes('no_willpower')) {
                newWillpower.purchasedWill = 0;
            }
        }
      }

      if (mqType === 'source') newBasicInfo.selectedSourceMQIds = currentSelection;
      else if (mqType === 'permission') newBasicInfo.selectedPermissionMQIds = currentSelection;
      else if (mqType === 'intrinsic') newBasicInfo.selectedIntrinsicMQIds = currentSelection;
      
      newBasicInfo.selectedArchetypeId = 'custom';

      return { ...prev, basicInfo: newBasicInfo, willpower: newWillpower, miracles: updatedMiracles };
    });
  };
  
 const handleIntrinsicConfigChange = (
    intrinsicId: string,
    configKey: keyof Omit<BasicInfo, 'name'|'motivations'|'selectedArchetypeId'|'selectedSourceMQIds'|'selectedPermissionMQIds'|'selectedIntrinsicMQIds'>,
    field: string,
    value: any,
    currentMiraclesParam?: MiracleDefinition[],
    calledFromArchetypeChange?: boolean 
  ): MiracleDefinition[] | CharacterData => {
    let finalMiracles: MiracleDefinition[] | undefined = undefined;

    setCharacterData(prev => {
        const miraclesToUpdate = currentMiraclesParam || prev.miracles;
        const newBasicInfo = {
         ...prev.basicInfo,
         [configKey]: {
           // @ts-ignore
           ...(prev.basicInfo[configKey] || {}), 
           [intrinsicId]: {
             // @ts-ignore
             ...(prev.basicInfo[configKey]?.[intrinsicId] || {}),
             [field]: value,
           }
         }
       };

      let updatedMiracles = [...miraclesToUpdate];

      if (configKey === 'intrinsicMandatoryPowerConfig' && field === 'count') {
          const newCount = Math.max(0, Number(value) || 0);
          const mandatoryMiraclesForThisIntrinsic = updatedMiracles.filter(m => 
            m.isMandatory && m.definitionId?.startsWith(`archetype-mandatory-${intrinsicId}-`)
          );
          const difference = newCount - mandatoryMiraclesForThisIntrinsic.length;


          if (difference > 0) {
              for (let i = 0; i < difference; i++) {
                  const newMandatoryMiracle: MiracleDefinition = {
                      id: `miracle-archetype-mandatory-${intrinsicId}-${Date.now()}-${i}`,
                      definitionId: `archetype-mandatory-${intrinsicId}-${Date.now()}-${i}`, 
                      name: `Mandatory Power (${INTRINSIC_META_QUALITIES.find(imq=>imq.id===intrinsicId)?.label || 'Intrinsic'})`,
                      dice: '1D',
                      hardDice: '0HD',
                      wiggleDice: '0WD',
                      qualities: [],
                      description: `This power is mandated by the ${INTRINSIC_META_QUALITIES.find(imq=>imq.id===intrinsicId)?.label || 'selected'} intrinsic.`,
                      isCustom: true, 
                      isMandatory: true,
                  };
                  updatedMiracles.push(newMandatoryMiracle);
              }
          } else if (difference < 0) {
              const miraclesToRemove = Math.abs(difference);
              let removedCount = 0;
              updatedMiracles = updatedMiracles.filter(m => {
                  if (m.isMandatory && m.definitionId?.startsWith(`archetype-mandatory-${intrinsicId}-`) && removedCount < miraclesToRemove) {
                      removedCount++;
                      return false;
                  }
                  return true;
              });
          }
          finalMiracles = updatedMiracles;
          if (calledFromArchetypeChange) return prev; 
          return { ...prev, basicInfo: newBasicInfo, miracles: updatedMiracles };
      }
      finalMiracles = updatedMiracles;
      if (calledFromArchetypeChange) return prev;
      return { ...prev, basicInfo: newBasicInfo };
    });

    return finalMiracles || []; 
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
    const hasNoBaseWillIntrinsic = characterData.basicInfo.selectedIntrinsicMQIds.includes('no_base_will');
    const hasNoWillpowerIntrinsic = characterData.basicInfo.selectedIntrinsicMQIds.includes('no_willpower');

    let processedValue = isNaN(value) ? 0 : value;

    if (field === 'purchasedBaseWill' && hasNoBaseWillIntrinsic) {
      processedValue = 0; // Force to 0 if No Base Will intrinsic is selected
    }
    if (field === 'purchasedWill' && (hasNoBaseWillIntrinsic || hasNoWillpowerIntrinsic)) {
      processedValue = 0; // Force to 0 if No Base Will or No Willpower intrinsic is selected
    }
    
    setCharacterData(prev => ({
      ...prev,
      willpower: {
        ...prev.willpower,
        [field]: processedValue,
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

  const handleAddMiracle = (type: 'custom' | string) => {
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
        dice: '1D', 
        hardDice: '0HD',
        wiggleDice: '0WD',
        qualities: template.qualities.map(q => ({...q, id: `${q.id}-${Date.now()}`})), 
        isCustom: false,
        isMandatory: false, 
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
     const miracle = characterData.miracles.find(m => m.id === miracleId);
     if (miracle && miracle.definitionId?.startsWith('archetype-mandatory-') && field === 'isMandatory' && !value) {
       toast({ title: "Cannot change mandatory status", description: "This miracle is mandated by an archetype intrinsic.", variant: "destructive"});
       return;
     }

    setCharacterData(prev => ({
      ...prev,
      miracles: prev.miracles.map(m => m.id === miracleId ? { ...m, [field]: value } : m),
    }));
  };

  const handleAddMiracleQuality = (miracleId: string) => {
    const newQuality: MiracleQuality = {
      id: `quality-${Date.now()}`,
      type: 'useful', 
      capacity: 'touch', 
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
    } else { 
      newItem = {
        id: `custom-${itemType}-${Date.now()}`,
        name: `Custom ${itemType === 'extra' ? 'Extra' : 'Flaw'}`,
        costModifier: itemType === 'extra' ? 1 : -1, 
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
  
  const handlePointLimitChange = (value: number) => {
    setCharacterData(prev => ({
      ...prev,
      pointLimit: isNaN(value) || value < 0 ? 250 : value,
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

        const loadedBasicInfo: BasicInfo = {
            ...initialCharacterData.basicInfo, 
            ...(parsedData.basicInfo || {}),
            motivations: Array.isArray(parsedData.basicInfo?.motivations) ? parsedData.basicInfo.motivations.map((m: any) => ({
                id: typeof m.id === 'string' ? m.id : `loaded-motivation-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                motivationText: typeof m.motivationText === 'string' ? m.motivationText : '',
                type: (m.type === 'loyalty' || m.type === 'passion') ? m.type : 'passion',
                investedBaseWill: typeof m.investedBaseWill === 'number' ? m.investedBaseWill : 0,
            })) : [],
            selectedSourceMQIds: Array.isArray(parsedData.basicInfo?.selectedSourceMQIds) ? parsedData.basicInfo.selectedSourceMQIds : [],
            selectedPermissionMQIds: Array.isArray(parsedData.basicInfo?.selectedPermissionMQIds) ? parsedData.basicInfo.selectedPermissionMQIds : [],
            selectedIntrinsicMQIds: Array.isArray(parsedData.basicInfo?.selectedIntrinsicMQIds) ? parsedData.basicInfo.selectedIntrinsicMQIds : [],
            intrinsicAllergyConfig: {...(parsedData.basicInfo?.intrinsicAllergyConfig || {})},
            intrinsicBruteFrailConfig: {...(parsedData.basicInfo?.intrinsicBruteFrailConfig || {})},
            intrinsicCustomStatsConfig: {...(parsedData.basicInfo?.intrinsicCustomStatsConfig || {})},
            intrinsicMandatoryPowerConfig: {...(parsedData.basicInfo?.intrinsicMandatoryPowerConfig || {})},
            intrinsicVulnerableConfig: {...(parsedData.basicInfo?.intrinsicVulnerableConfig || {})},
        };
        
        Object.keys(loadedBasicInfo.intrinsicMandatoryPowerConfig).forEach(key => {
            // @ts-ignore
            if (typeof loadedBasicInfo.intrinsicMandatoryPowerConfig[key]?.count !== 'number') {
                // @ts-ignore
                loadedBasicInfo.intrinsicMandatoryPowerConfig[key] = { ...(loadedBasicInfo.intrinsicMandatoryPowerConfig[key] || {}), count: 0};
            }
        });
        Object.keys(loadedBasicInfo.intrinsicVulnerableConfig).forEach(key => {
            // @ts-ignore
             if (typeof loadedBasicInfo.intrinsicVulnerableConfig[key]?.extraBoxes !== 'number') {
                // @ts-ignore
                 loadedBasicInfo.intrinsicVulnerableConfig[key] = { ...(loadedBasicInfo.intrinsicVulnerableConfig[key] || {}), extraBoxes: 0};
            }
        });


        const validatedData: CharacterData = {
          ...initialCharacterData,
          ...parsedData,
          basicInfo: loadedBasicInfo,
          stats: { ...initialCharacterData.stats }, 
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
                  levels: (typeof quality.levels === 'number' && !isNaN(quality.levels)) ? quality.levels : defaultQuality.levels,
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
                    if (isNaN(loadedCostModifier)) { 
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
                    if (isNaN(loadedCostModifier)) { 
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
          pointLimit: typeof parsedData.pointLimit === 'number' && parsedData.pointLimit >=0 ? parsedData.pointLimit : initialCharacterData.pointLimit,
        };

        for (const statKey in initialCharacterData.stats) {
          if (parsedData.stats && parsedData.stats[statKey as keyof CharacterData['stats']]) {
            validatedData.stats[statKey as keyof CharacterData['stats']] = {
              ...initialStatDetail,
              ...parsedData.stats[statKey as keyof CharacterData['stats']],
            };
          }
        }
        
        // Ensure willpower values are numbers
        validatedData.willpower.purchasedBaseWill = Number(validatedData.willpower.purchasedBaseWill) || 0;
        validatedData.willpower.purchasedWill = Number(validatedData.willpower.purchasedWill) || 0;
        
        // Apply willpower restrictions based on loaded intrinsics
        if (validatedData.basicInfo.selectedIntrinsicMQIds.includes('no_base_will')) {
            validatedData.willpower.purchasedBaseWill = 0;
            validatedData.willpower.purchasedWill = 0;
        } else if (validatedData.basicInfo.selectedIntrinsicMQIds.includes('no_willpower')) {
            validatedData.willpower.purchasedWill = 0;
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

  const hasNoBaseWillIntrinsic = characterData.basicInfo.selectedIntrinsicMQIds.includes('no_base_will');
  const hasNoWillpowerIntrinsic = characterData.basicInfo.selectedIntrinsicMQIds.includes('no_willpower');

  const rawCalculatedBaseWillFromStats = 
    (parseInt(characterData.stats.charm.dice.replace('D',''), 10) || 0) +
    (parseInt(characterData.stats.charm.hardDice.replace('HD',''), 10) || 0) +
    (parseInt(characterData.stats.charm.wiggleDice.replace('WD',''), 10) || 0) +
    (parseInt(characterData.stats.command.dice.replace('D',''), 10) || 0) +
    (parseInt(characterData.stats.command.hardDice.replace('HD',''), 10) || 0) +
    (parseInt(characterData.stats.command.wiggleDice.replace('WD',''), 10) || 0);
  
  const displayCalculatedBaseWillFromStats = hasNoBaseWillIntrinsic ? 0 : rawCalculatedBaseWillFromStats;
  const currentPurchasedBaseWill = hasNoBaseWillIntrinsic ? 0 : (characterData.willpower.purchasedBaseWill || 0);
  const currentPurchasedWill = (hasNoBaseWillIntrinsic || hasNoWillpowerIntrinsic) ? 0 : (characterData.willpower.purchasedWill || 0);

  const displayTotalBaseWill = displayCalculatedBaseWillFromStats + currentPurchasedBaseWill;
  const displayTotalWill = displayTotalBaseWill + currentPurchasedWill;
  
  const totalInvestedInMotivations = characterData.basicInfo.motivations.reduce((sum, m) => sum + (m.investedBaseWill || 0), 0);
  const uninvestedBaseWill = displayTotalBaseWill - totalInvestedInMotivations;


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader
        onSave={handleSaveCharacter}
        onLoad={handleLoadCharacter}
        onExport={handleExportCharacter}
      />
      <main className="flex-grow container mx-auto px-4 py-2 md:py-4">
        <Tabs defaultValue="character" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 md:w-auto md:inline-flex mb-4 shadow-sm">
            <TabsTrigger value="character">Character</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="gm-tools">GM Tools</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-220px)]">
            <div className="p-1">
              <TabsContent value="character" className="mt-0">
                <CharacterTabContent
                  characterData={characterData}
                  onBasicInfoChange={handleBasicInfoChange}
                  onAddMotivation={handleAddMotivation}
                  onRemoveMotivation={handleRemoveMotivation}
                  onMotivationChange={handleMotivationChange}
                  uninvestedBaseWill={uninvestedBaseWill}
                  totalBaseWill={displayTotalBaseWill}
                  calculatedBaseWillFromStats={displayCalculatedBaseWillFromStats}
                  onMQSelectionChange={handleMQSelectionChange}
                  onIntrinsicConfigChange={handleIntrinsicConfigChange as any}
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
                <SummaryTabContent
                  characterData={characterData}
                  onPointLimitChange={handlePointLimitChange}
                />
              </TabsContent>
              <TabsContent value="gm-tools" className="mt-0">
                <GmToolsTabContent />
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
  
