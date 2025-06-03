
// src/app/page.tsx
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/layout/app-header";
import { CharacterTabContent } from "@/components/tabs/character-tab-content";
import { TablesTabContent } from "@/components/tabs/tables-tab-content";
import { SummaryTabContent } from "@/components/tabs/summary-tab-content";
import { GmToolsTabContent, type CustomArchetypeCreationData as GmCustomArchetypeData } from "@/components/tabs/gm-tools-tab-content";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AttributeName, SkillDefinition as PredefinedSkillDef } from "@/lib/skills-definitions";
import { SKILL_DEFINITIONS } from "@/lib/skills-definitions";
import type { MiracleDefinition, MiracleQuality, AppliedExtraOrFlaw, MiracleQualityType, MiracleCapacityType } from "@/lib/miracles-definitions";
import { PREDEFINED_MIRACLES_TEMPLATES, PREDEFINED_EXTRAS, PREDEFINED_FLAWS, POWER_QUALITY_DEFINITIONS, POWER_CAPACITY_OPTIONS } from "@/lib/miracles-definitions";
import type { 
    AllergyEffectType, AllergySubstanceType, BruteFrailType, DiscardedAttributeType, ArchetypeDefinition,
    InhumanStatsSettings, InhumanStatSetting, AttributeCondition
} from "@/lib/character-definitions";
import { ARCHETYPES, SOURCE_META_QUALITIES, PERMISSION_META_QUALITIES, INTRINSIC_META_QUALITIES } from "@/lib/character-definitions";
import {
  calculateTotalStatPoints,
  calculateTotalWillpowerPoints,
  calculateTotalSkillPoints,
  calculateTotalMiraclePoints,
  calculateCurrentArchetypeCost,
  calculateSingleStatPoints,
  calculateSingleSkillPoints,
  calculateSingleMiracleTotalCost,
} from "@/lib/cost-calculations";


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
  intrinsicMandatoryPowerConfig: { // This remains for character's direct mandatory powers
    [intrinsicId: string]: {
        count: number;
    }
  };
  intrinsicVulnerableConfig: {
    [intrinsicId: string]: {
        extraBoxes: number;
    }
  };
  inhumanStatsSettings?: InhumanStatsSettings;
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
  archetypePointLimit?: number;
  statPointLimit?: number;
  skillPointLimit?: number;
  willpowerPointLimit?: number;
  miraclePointLimit?: number;
}

// GM Settings Interfaces
interface GmPointRestrictions {
  overallPointLimit?: number;
  archetypePointLimit?: number;
  statPointLimit?: number;
  willpowerPointLimit?: number;
  skillPointLimit?: number;
  miraclePointLimit?: number;
}

interface GmToggleableItems {
  [id: string]: boolean; // true if allowed
}

interface GmWillpowerRestrictions {
  maxBaseWill?: number;
  maxTotalWill?: number;
}

interface GmMiracleNumericRestrictions {
  maxPowerQualityLevels?: number;
  maxDicePerType?: number; 
}

export interface GmSettings {
  pointRestrictions: GmPointRestrictions;
  sampleArchetypes: GmToggleableItems;
  metaQualitiesSource: GmToggleableItems;
  metaQualitiesPermission: GmToggleableItems;
  metaQualitiesIntrinsic: GmToggleableItems;
  sampleSkills: GmToggleableItems;
  willpowerRestrictions: GmWillpowerRestrictions;
  miracleRestrictions: {
    allowedSampleMiracles: GmToggleableItems;
    allowedQualities: GmToggleableItems;
    allowedCapacities: GmToggleableItems;
    allowedExtras: GmToggleableItems;
    allowedFlaws: GmToggleableItems;
    numericRestrictions: GmMiracleNumericRestrictions;
  };
}

// Re-export for AppHeader prop, if not already available via CharacterData or similar
export type { CustomArchetypeCreationData as GmCustomArchetypeData } from "@/components/tabs/gm-tools-tab-content";


const initialStatDetail: StatDetail = { dice: '2D', hardDice: '0HD', wiggleDice: '0WD' };
const ALL_STATS: (keyof CharacterData['stats'])[] = ['body', 'coordination', 'sense', 'mind', 'charm', 'command'];


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
  inhumanStatsSettings: ALL_STATS.reduce((acc, statName) => {
    acc[statName] = { condition: 'normal' };
    return acc;
  }, {} as InhumanStatsSettings),
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
  archetypePointLimit: undefined,
  statPointLimit: undefined,
  skillPointLimit: undefined,
  willpowerPointLimit: undefined,
  miraclePointLimit: undefined,
};


const initialGmSettings: GmSettings = {
  pointRestrictions: {
    overallPointLimit: undefined,
    archetypePointLimit: undefined,
    statPointLimit: undefined,
    willpowerPointLimit: undefined,
    skillPointLimit: undefined,
    miraclePointLimit: undefined,
  },
  sampleArchetypes: ARCHETYPES.reduce((acc, arch) => { if(arch.id !== 'custom') acc[arch.id] = true; return acc; }, {} as GmToggleableItems),
  metaQualitiesSource: SOURCE_META_QUALITIES.reduce((acc, mq) => { acc[mq.id] = true; return acc; }, {} as GmToggleableItems),
  metaQualitiesPermission: PERMISSION_META_QUALITIES.reduce((acc, mq) => { acc[mq.id] = true; return acc; }, {} as GmToggleableItems),
  metaQualitiesIntrinsic: INTRINSIC_META_QUALITIES.reduce((acc, mq) => { acc[mq.id] = true; return acc; }, {} as GmToggleableItems),
  sampleSkills: SKILL_DEFINITIONS.reduce((acc, skill) => { acc[skill.id] = true; return acc; }, {} as GmToggleableItems),
  willpowerRestrictions: {
    maxBaseWill: undefined,
    maxTotalWill: undefined,
  },
  miracleRestrictions: {
    allowedSampleMiracles: PREDEFINED_MIRACLES_TEMPLATES.reduce((acc, miracle) => { if(miracle.definitionId) acc[miracle.definitionId] = true; return acc; }, {} as GmToggleableItems),
    allowedQualities: POWER_QUALITY_DEFINITIONS.reduce((acc, pq) => { acc[pq.key] = true; return acc; }, {} as GmToggleableItems),
    allowedCapacities: POWER_CAPACITY_OPTIONS.reduce((acc, cap) => { acc[cap.value] = true; return acc; }, {} as GmToggleableItems),
    allowedExtras: PREDEFINED_EXTRAS.reduce((acc, extra) => { acc[extra.id] = true; return acc; }, {} as GmToggleableItems),
    allowedFlaws: PREDEFINED_FLAWS.reduce((acc, flaw) => { acc[flaw.id] = true; return acc; }, {} as GmToggleableItems),
    numericRestrictions: {
      maxPowerQualityLevels: undefined,
      maxDicePerType: undefined,
    },
  },
};

const initialCustomArchetypeData: GmCustomArchetypeData = {
  name: '',
  description: '',
  sourceMQIds: [],
  permissionMQIds: [],
  intrinsicMQIds: [],
  intrinsicConfigs: {
    intrinsicAllergyConfig: {},
    intrinsicBruteFrailConfig: {},
    intrinsicCustomStatsConfig: {},
    intrinsicVulnerableConfig: {},
  },
  mandatoryPowerDetails: {
    count: 0,
    miracles: [],
  },
  inhumanStatsSettings: ALL_STATS.reduce((acc, statName) => {
    acc[statName] = { condition: 'normal' };
    return acc;
  }, {} as InhumanStatsSettings),
};


export default function HomePage() {
  const [characterData, setCharacterData] = React.useState<CharacterData>(initialCharacterData);
  const [gmSettings, setGmSettings] = React.useState<GmSettings>(initialGmSettings);
  const [customArchetypeData, setCustomArchetypeData] = React.useState<GmCustomArchetypeData>(initialCustomArchetypeData);
  const { toast } = useToast();

  const handleBasicInfoChange = (field: keyof Omit<BasicInfo, 'motivations' | 'inhumanStatsSettings'>, value: any) => {
    let potentialArchetypeCost = 0;
    const currentCharacterState = characterData; 

    if (field === 'selectedArchetypeId') {
      const newArchetypeDef = ARCHETYPES.find(arch => arch.id === value);
      if (newArchetypeDef) {
        potentialArchetypeCost = newArchetypeDef.points;
        if (newArchetypeDef.id === 'custom') {
            const tempBasicInfo = {...currentCharacterState.basicInfo, selectedArchetypeId: 'custom'};
            potentialArchetypeCost = calculateCurrentArchetypeCost(tempBasicInfo);
        }
      }
      if (currentCharacterState.archetypePointLimit !== undefined && potentialArchetypeCost > currentCharacterState.archetypePointLimit) {
        toast({ title: "Archetype Limit Exceeded", description: `Cannot select ${newArchetypeDef?.name || 'this archetype'}. Its cost (${potentialArchetypeCost}) exceeds the Archetype Point Limit of ${currentCharacterState.archetypePointLimit}.`, variant: "destructive" });
        return;
      }
    }
    
    setCharacterData(current => {
      let newBasicInfo = { ...current.basicInfo, [field]: value };
      let newWillpower = { ...current.willpower };
      let updatedMiracles = [...current.miracles];
      let newInhumanStatsSettings = current.basicInfo.inhumanStatsSettings || 
        ALL_STATS.reduce((acc, statName) => {
            acc[statName] = { condition: 'normal' };
            return acc;
        }, {} as InhumanStatsSettings);

      if (field === 'selectedArchetypeId') {
        const newArchetypeDef = ARCHETYPES.find(arch => arch.id === value);
        const previousArchetypeId = current.basicInfo.selectedArchetypeId;

        // Specific logic for Godlike Talent's mandatory power
        if (previousArchetypeId === 'godlike_talent' && value !== 'godlike_talent') {
          updatedMiracles = updatedMiracles.filter(m => m.definitionId !== 'perceive_godlike_talents');
        }
        // Specific logic for Mystic's mandatory power
        if (previousArchetypeId === 'mystic' && value !== 'mystic') {
          updatedMiracles = updatedMiracles.filter(m => m.definitionId !== 'cosmic_power');
        }
        
        if (newArchetypeDef && newArchetypeDef.id !== previousArchetypeId) {
             updatedMiracles = updatedMiracles.filter(m => {
                const isGenericMandatory = m.definitionId?.startsWith('archetype-mandatory-');
                if (m.definitionId === 'perceive_godlike_talents' && value !== 'godlike_talent') return false;
                if (m.definitionId === 'perceive_godlike_talents' && value === 'godlike_talent') return true; 
                if (m.definitionId === 'cosmic_power' && value !== 'mystic') return false;
                if (m.definitionId === 'cosmic_power' && value === 'mystic') return true;
                if (isGenericMandatory) {
                    if (value === 'custom') return false; 
                    const newArchHasMandatoryPowerIntrinsic = newArchetypeDef?.intrinsicMQIds.includes('mandatory_power');
                    if (!newArchHasMandatoryPowerIntrinsic) return false; 
                }
                return true;
            });
        }

        if (newArchetypeDef && newArchetypeDef.id !== 'custom') {
          newBasicInfo.selectedSourceMQIds = newArchetypeDef.sourceMQIds || [];
          newBasicInfo.selectedPermissionMQIds = newArchetypeDef.permissionMQIds || [];
          newBasicInfo.selectedIntrinsicMQIds = newArchetypeDef.intrinsicMQIds || [];
          
          const currentIntrinsicConfigs = {
            intrinsicAllergyConfig: { ...current.basicInfo.intrinsicAllergyConfig },
            intrinsicBruteFrailConfig: { ...current.basicInfo.intrinsicBruteFrailConfig },
            intrinsicCustomStatsConfig: { ...current.basicInfo.intrinsicCustomStatsConfig },
            intrinsicMandatoryPowerConfig: { ...current.basicInfo.intrinsicMandatoryPowerConfig },
            intrinsicVulnerableConfig: { ...current.basicInfo.intrinsicVulnerableConfig },
          };
          
          newBasicInfo.intrinsicAllergyConfig = {};
          newBasicInfo.intrinsicBruteFrailConfig = {};
          newBasicInfo.intrinsicCustomStatsConfig = {};
          newBasicInfo.intrinsicMandatoryPowerConfig = {}; // Reset character's direct mandatory power count config
          newBasicInfo.intrinsicVulnerableConfig = {};

          (newArchetypeDef.intrinsicMQIds || []).forEach(mqId => {
            const intrinsicDef = INTRINSIC_META_QUALITIES.find(imq => imq.id === mqId);
            if (intrinsicDef?.configKey) {
                // @ts-ignore
                newBasicInfo[intrinsicDef.configKey][mqId] = currentIntrinsicConfigs[intrinsicDef.configKey]?.[mqId] || 
                  (intrinsicDef.configKey === 'intrinsicMandatoryPowerConfig' 
                    ? { count: (newArchetypeDef.mandatoryPowerText ? 1 : 0) } 
                    : (intrinsicDef.configKey === 'intrinsicVulnerableConfig' ? {extraBoxes:0} : {})
                  );

                 if (intrinsicDef.id === 'mandatory_power' && intrinsicDef.configKey === 'intrinsicMandatoryPowerConfig') { // Ensure it's the correct config key
                    const count = newBasicInfo.intrinsicMandatoryPowerConfig[mqId]?.count || (newArchetypeDef.mandatoryPowerText ? 1 : 0);
                    newBasicInfo.intrinsicMandatoryPowerConfig[mqId] = { count };
                    
                    const result = handleMetaQualityConfigChange(mqId, 'intrinsicMandatoryPowerConfig', 'count', count, updatedMiracles, true, value, current);
                    if (Array.isArray(result)) {
                        updatedMiracles = result;
                    } else { 
                       // Toast shown in handleMetaQualityConfigChange
                    }
                }
            }
          });
           if (!newBasicInfo.selectedPermissionMQIds.includes('inhuman_stats')) {
                newInhumanStatsSettings = ALL_STATS.reduce((acc, statName) => {
                    acc[statName] = { condition: 'normal' };
                    return acc;
                }, {} as InhumanStatsSettings);
            } else if (!current.basicInfo.selectedPermissionMQIds.includes('inhuman_stats') && newBasicInfo.selectedPermissionMQIds.includes('inhuman_stats')) {
                 newInhumanStatsSettings = current.basicInfo.inhumanStatsSettings && Object.keys(current.basicInfo.inhumanStatsSettings).length > 0
                    ? current.basicInfo.inhumanStatsSettings
                    : ALL_STATS.reduce((acc, statName) => {
                          acc[statName] = { condition: 'normal' };
                          return acc;
                      }, {} as InhumanStatsSettings);
            }
          
          if (newBasicInfo.selectedIntrinsicMQIds.includes('no_base_will')) {
            newWillpower.purchasedBaseWill = 0;
            newWillpower.purchasedWill = 0;
          } else if (newBasicInfo.selectedIntrinsicMQIds.includes('no_willpower')) {
            newWillpower.purchasedWill = 0;
          }
        } 
      }
      return { ...current, basicInfo: {...newBasicInfo, inhumanStatsSettings: newInhumanStatsSettings }, willpower: newWillpower, miracles: updatedMiracles };
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
    const tempBasicInfoForCostCheck = JSON.parse(JSON.stringify(characterData.basicInfo)); 

    let currentSelection: string[] = [];
    if (mqType === 'source') currentSelection = [...tempBasicInfoForCostCheck.selectedSourceMQIds];
    else if (mqType === 'permission') currentSelection = [...tempBasicInfoForCostCheck.selectedPermissionMQIds];
    else if (mqType === 'intrinsic') currentSelection = [...tempBasicInfoForCostCheck.selectedIntrinsicMQIds];

    if (isSelected) {
      if (!currentSelection.includes(mqId)) currentSelection.push(mqId);
    } else {
      currentSelection = currentSelection.filter(id => id !== mqId);
    }
    
    if (mqType === 'source') tempBasicInfoForCostCheck.selectedSourceMQIds = currentSelection;
    else if (mqType === 'permission') tempBasicInfoForCostCheck.selectedPermissionMQIds = currentSelection;
    else if (mqType === 'intrinsic') tempBasicInfoForCostCheck.selectedIntrinsicMQIds = currentSelection;
    tempBasicInfoForCostCheck.selectedArchetypeId = 'custom'; 

    const potentialArchetypeCost = calculateCurrentArchetypeCost(tempBasicInfoForCostCheck);
    if (characterData.archetypePointLimit !== undefined && potentialArchetypeCost > characterData.archetypePointLimit) {
      toast({ title: "Archetype Limit Exceeded", description: `This Meta-Quality change would make the custom archetype cost ${potentialArchetypeCost}pts, exceeding the limit of ${characterData.archetypePointLimit}.`, variant: "destructive" });
      return; 
    }
    
    setCharacterData(current => { 
      const newBasicInfo = { ...current.basicInfo };
      let currentActualSelection: string[] = [];
      let newWillpower = { ...current.willpower };
      let newInhumanStatsSettings = current.basicInfo.inhumanStatsSettings || 
        ALL_STATS.reduce((acc, statName) => {
            acc[statName] = { condition: 'normal' };
            return acc;
        }, {} as InhumanStatsSettings);

      if (mqType === 'source') currentActualSelection = [...newBasicInfo.selectedSourceMQIds];
      else if (mqType === 'permission') currentActualSelection = [...newBasicInfo.selectedPermissionMQIds];
      else if (mqType === 'intrinsic') currentActualSelection = [...newBasicInfo.selectedIntrinsicMQIds];

      let updatedMiracles = [...current.miracles];

      if (isSelected) {
        if (!currentActualSelection.includes(mqId)) {
          currentActualSelection.push(mqId);
           if (mqType === 'intrinsic' && mqId === 'mandatory_power') {
                const currentCount = newBasicInfo.intrinsicMandatoryPowerConfig[mqId]?.count || 0;
                const intrinsicDef = INTRINSIC_META_QUALITIES.find(imq => imq.id === mqId);
                if (intrinsicDef?.configKey === 'intrinsicMandatoryPowerConfig') { // Check configKey
                    const result = handleMetaQualityConfigChange(mqId, 'intrinsicMandatoryPowerConfig', 'count', currentCount, updatedMiracles, false, newBasicInfo.selectedArchetypeId, current);
                    if(Array.isArray(result)) { updatedMiracles = result; } else { /* Toast was shown */ return current; }
                }
           }
           if (mqType === 'intrinsic' && mqId === 'no_base_will') {
              newWillpower.purchasedBaseWill = 0;
              newWillpower.purchasedWill = 0;
           } else if (mqType === 'intrinsic' && mqId === 'no_willpower' && !newBasicInfo.selectedIntrinsicMQIds.includes('no_base_will')) {
             newWillpower.purchasedWill = 0;
           }
           if (mqType === 'permission' && mqId === 'inhuman_stats') {
                if (!newInhumanStatsSettings || Object.keys(newInhumanStatsSettings).length === 0) {
                     newInhumanStatsSettings = ALL_STATS.reduce((acc, statName) => {
                        acc[statName] = { condition: 'normal' };
                        return acc;
                    }, {} as InhumanStatsSettings);
                }
            }
        }
      } else {
        currentActualSelection = currentActualSelection.filter(id => id !== mqId);
        if (mqType === 'intrinsic') {
            const intrinsicDef = INTRINSIC_META_QUALITIES.find(imq => imq.id === mqId);
            if (intrinsicDef?.configKey) {
                 // @ts-ignore
                delete newBasicInfo[intrinsicDef.configKey][mqId];
                 if (intrinsicDef.id === 'mandatory_power' && intrinsicDef.configKey === 'intrinsicMandatoryPowerConfig') { // Check configKey
                    const result = handleMetaQualityConfigChange(mqId, 'intrinsicMandatoryPowerConfig', 'count', 0, updatedMiracles, false, newBasicInfo.selectedArchetypeId, current);
                    if(Array.isArray(result)) {updatedMiracles = result;} else { return current; }
                }
            }
            if (mqId === 'no_base_will' && newBasicInfo.selectedIntrinsicMQIds.includes('no_willpower')) {
                // No change needed here
            } else if (mqId === 'no_willpower' && newBasicInfo.selectedIntrinsicMQIds.includes('no_base_will')){
                 newWillpower.purchasedWill = 0; 
            }
            if (newBasicInfo.selectedArchetypeId === 'godlike_talent' && mqId === 'mandatory_power') {
                updatedMiracles = updatedMiracles.filter(m => m.definitionId !== 'perceive_godlike_talents');
            }
            if (newBasicInfo.selectedArchetypeId === 'mystic' && mqId === 'mandatory_power') {
                updatedMiracles = updatedMiracles.filter(m => m.definitionId !== 'cosmic_power');
            }
        }
        if (mqType === 'permission' && mqId === 'inhuman_stats') {
            newInhumanStatsSettings = ALL_STATS.reduce((acc, statName) => {
                acc[statName] = { condition: 'normal' };
                return acc;
            }, {} as InhumanStatsSettings);
        }
      }

      if (mqType === 'source') newBasicInfo.selectedSourceMQIds = currentActualSelection;
      else if (mqType === 'permission') newBasicInfo.selectedPermissionMQIds = currentActualSelection;
      else if (mqType === 'intrinsic') newBasicInfo.selectedIntrinsicMQIds = currentActualSelection;
      
      newBasicInfo.selectedArchetypeId = 'custom';

      return { ...current, basicInfo: {...newBasicInfo, inhumanStatsSettings: newInhumanStatsSettings }, willpower: newWillpower, miracles: updatedMiracles };
    });
  };
  
 const handleMetaQualityConfigChange = (
    metaQualityId: string, 
    configKey: keyof Omit<BasicInfo, 'name'|'motivations'|'selectedArchetypeId'|'selectedSourceMQIds'|'selectedPermissionMQIds'|'selectedIntrinsicMQIds'>,
    fieldOrStatName: string, 
    valueOrSubField: any, 
    currentMiraclesParam?: MiracleDefinition[],
    calledFromArchetypeChange?: boolean,
    archetypeIdForContext?: string,
    currentStateForCheck?: CharacterData 
  ): MiracleDefinition[] | CharacterData => { 
    
    const stateForChecks = currentStateForCheck || characterData;
    const tempNewBasicInfoForCostCheck = JSON.parse(JSON.stringify(stateForChecks.basicInfo)); 
    if (configKey !== 'inhumanStatsSettings') {
        // @ts-ignore
        tempNewBasicInfoForCostCheck[configKey] = {
            // @ts-ignore
            ...(stateForChecks.basicInfo[configKey] || {}),
            [metaQualityId]: {
                // @ts-ignore
                ...(stateForChecks.basicInfo[configKey]?.[metaQualityId] || {}),
                [fieldOrStatName]: valueOrSubField,
            }
        };
    } else { 
        const statName = fieldOrStatName as keyof CharacterData['stats'];
        const { field: subField, value: subValue } = valueOrSubField as { field: keyof InhumanStatSetting, value: any };
        tempNewBasicInfoForCostCheck.inhumanStatsSettings = {
            ...(tempNewBasicInfoForCostCheck.inhumanStatsSettings || {}),
            [statName]: {
                ...(tempNewBasicInfoForCostCheck.inhumanStatsSettings?.[statName] || { condition: 'normal' }),
                [subField]: subValue,
            }
        };
        if (subField === 'condition' && subValue !== 'inferior') { // @ts-ignore
            delete tempNewBasicInfoForCostCheck.inhumanStatsSettings[statName].inferiorMaxDice;
        }
        if (subField === 'condition' && subValue === 'inferior' && !tempNewBasicInfoForCostCheck.inhumanStatsSettings?.[statName]?.inferiorMaxDice) { // @ts-ignore
            tempNewBasicInfoForCostCheck.inhumanStatsSettings[statName].inferiorMaxDice = 4;
        }
    }
    
    const archetypeIdForCostCheck = calledFromArchetypeChange ? archetypeIdForContext : 'custom';
    const basicInfoForCostCheck = { ...tempNewBasicInfoForCostCheck, selectedArchetypeId: archetypeIdForCostCheck };
    const potentialArchetypeCost = calculateCurrentArchetypeCost(basicInfoForCostCheck);

    if (stateForChecks.archetypePointLimit !== undefined && potentialArchetypeCost > stateForChecks.archetypePointLimit) {
        toast({ title: "Archetype Limit Exceeded", description: `This Meta-Quality configuration change would make the archetype cost ${potentialArchetypeCost}pts, exceeding the limit of ${stateForChecks.archetypePointLimit}.`, variant: "destructive" });
        return calledFromArchetypeChange ? (currentMiraclesParam || stateForChecks.miracles) : stateForChecks;
    }

    let updatedMiracles = [...(currentMiraclesParam || stateForChecks.miracles)];

    if (configKey === 'intrinsicMandatoryPowerConfig' && fieldOrStatName === 'count') {
      const newCount = Math.max(0, Number(valueOrSubField) || 0);
      const currentArchetypeForContext = archetypeIdForContext || stateForChecks.basicInfo.selectedArchetypeId;
      
      const mandatoryMiraclesForThisIntrinsic = updatedMiracles.filter(m => 
        m.isMandatory && 
        (
          m.definitionId?.startsWith(`archetype-mandatory-${metaQualityId}-`) || 
          (currentArchetypeForContext === 'godlike_talent' && m.definitionId === 'perceive_godlike_talents' && metaQualityId === 'mandatory_power') ||
          (currentArchetypeForContext === 'mystic' && m.definitionId === 'cosmic_power' && metaQualityId === 'mandatory_power')
        )
      );
      const difference = newCount - mandatoryMiraclesForThisIntrinsic.length;

      if (difference > 0) { 
          for (let i = 0; i < difference; i++) {
              let newMandatoryMiracle: MiracleDefinition | undefined = undefined;
              if (currentArchetypeForContext === 'godlike_talent' && metaQualityId === 'mandatory_power') {
                  const pgtExists = updatedMiracles.some(m => m.definitionId === 'perceive_godlike_talents' && m.isMandatory);
                  if (!pgtExists) { 
                    const template = PREDEFINED_MIRACLES_TEMPLATES.find(t => t.definitionId === 'perceive_godlike_talents');
                    if (template) {
                        newMandatoryMiracle = {
                            ...template, 
                            id: `miracle-arch-mandatory-pgt-${Date.now()}-${i}`,
                            dice: '0D', hardDice: '2HD', wiggleDice: '0WD',
                            qualities: template.qualities.map(tq => ({ 
                              ...tq, id: `quality-instance-pgt-${Date.now()}-${i}-${Math.random().toString(36).substring(2)}`,
                              extras: tq.extras.map(tex => ({ ...tex, id: `extra-instance-pgt-${Date.now()}-${i}-${Math.random().toString(36).substring(2)}`})),
                              flaws: tq.flaws.map(tfl => ({ ...tfl, id: `flaw-instance-pgt-${Date.now()}-${i}-${Math.random().toString(36).substring(2)}`})),
                            })), isCustom: false, isMandatory: true,
                        };
                    }
                  }
              } else if (currentArchetypeForContext === 'mystic' && metaQualityId === 'mandatory_power') {
                  const cpExists = updatedMiracles.some(m => m.definitionId === 'cosmic_power' && m.isMandatory);
                  if (!cpExists) {
                    const template = PREDEFINED_MIRACLES_TEMPLATES.find(t => t.definitionId === 'cosmic_power');
                    if (template) {
                        newMandatoryMiracle = {
                            ...template,
                            id: `miracle-arch-mandatory-cp-${Date.now()}-${i}`,
                            dice: '1D', hardDice: '0HD', wiggleDice: '0WD', // Default dice for mandatory Cosmic Power
                            qualities: template.qualities.map(tq => ({
                              ...tq, id: `quality-instance-cp-${Date.now()}-${i}-${Math.random().toString(36).substring(2)}`,
                              extras: tq.extras.map(tex => ({ ...tex, id: `extra-instance-cp-${Date.now()}-${i}-${Math.random().toString(36).substring(2)}`})),
                              flaws: tq.flaws.map(tfl => ({ ...tfl, id: `flaw-instance-cp-${Date.now()}-${i}-${Math.random().toString(36).substring(2)}`})),
                            })), isCustom: false, isMandatory: true,
                        };
                    }
                  }
              }
              if (!newMandatoryMiracle) { 
                  newMandatoryMiracle = {
                      id: `miracle-archetype-mandatory-${metaQualityId}-${Date.now()}-${i}`,
                      definitionId: `archetype-mandatory-${metaQualityId}-${Date.now()}-${i}`, 
                      name: `Mandatory Power (${INTRINSIC_META_QUALITIES.find(imq=>imq.id===metaQualityId)?.label || 'Intrinsic'})`,
                      dice: '1D', hardDice: '0HD', wiggleDice: '0WD', qualities: [],
                      description: `This power is mandated by the ${INTRINSIC_META_QUALITIES.find(imq=>imq.id===metaQualityId)?.label || 'selected'} intrinsic.`,
                      isCustom: true, isMandatory: true,
                  };
              }
              if (newMandatoryMiracle) updatedMiracles.push(newMandatoryMiracle);
          }
      } else if (difference < 0) { 
          const miraclesToRemoveCount = Math.abs(difference);
          let removedCount = 0;
          updatedMiracles = updatedMiracles.filter(m => {
              const isPGTForGodlike = currentArchetypeForContext === 'godlike_talent' && m.definitionId === 'perceive_godlike_talents' && metaQualityId === 'mandatory_power';
              const isCPForMystic = currentArchetypeForContext === 'mystic' && m.definitionId === 'cosmic_power' && metaQualityId === 'mandatory_power';
              const isGenericMandatoryForIntrinsic = m.definitionId?.startsWith(`archetype-mandatory-${metaQualityId}-`);
              if (m.isMandatory && (isPGTForGodlike || isCPForMystic || isGenericMandatoryForIntrinsic) && removedCount < miraclesToRemoveCount) {
                  removedCount++; return false; 
              }
              return true; 
          });
      }
    }

    if (calledFromArchetypeChange) {
        return updatedMiracles; 
    }

    setCharacterData(prev => {
        const newBasicInfo = { ...prev.basicInfo };
        let inhumanStatsUpdate = false;

        if (configKey === 'inhumanStatsSettings') {
            const statName = fieldOrStatName as keyof CharacterData['stats'];
            const { field: subField, value: subValue } = valueOrSubField as { field: keyof InhumanStatSetting, value: any };
            
            newBasicInfo.inhumanStatsSettings = {
                ...(newBasicInfo.inhumanStatsSettings || {}),
                [statName]: {
                    ...(newBasicInfo.inhumanStatsSettings?.[statName] || { condition: 'normal' }), 
                    [subField]: subValue,
                }
            };
            if (subField === 'condition' && subValue !== 'inferior') { // @ts-ignore
                delete newBasicInfo.inhumanStatsSettings[statName].inferiorMaxDice;
            }
            if (subField === 'condition' && subValue === 'inferior' && !newBasicInfo.inhumanStatsSettings?.[statName]?.inferiorMaxDice) { // @ts-ignore
                newBasicInfo.inhumanStatsSettings[statName].inferiorMaxDice = 4;
            }
            inhumanStatsUpdate = true;
        } else {
             // @ts-ignore
             newBasicInfo[configKey] = {
               // @ts-ignore
               ...(prev.basicInfo[configKey] || {}), 
               [metaQualityId]: {
                 // @ts-ignore
                 ...(prev.basicInfo[configKey]?.[metaQualityId] || {}),
                 [fieldOrStatName]: valueOrSubField,
               }
             };
        }
        return { ...prev, basicInfo: newBasicInfo, miracles: inhumanStatsUpdate ? prev.miracles : updatedMiracles };
    });
    return []; 
  };


  const handleStatChange = (
    statName: keyof CharacterData['stats'],
    dieType: keyof StatDetail,
    value: string
  ) => {
    const discardedAttr = getDiscardedAttributeFromBasicInfo(characterData.basicInfo);
    const currentTotalStatCost = calculateTotalStatPoints(characterData.stats, discardedAttr);
    const costOfStatBeingChanged = calculateSingleStatPoints(characterData.stats[statName], statName, discardedAttr);
    
    const potentialNewStatDetail = { ...characterData.stats[statName], [dieType]: value };
    const costOfPotentialNewStat = calculateSingleStatPoints(potentialNewStatDetail, statName, discardedAttr);
    
    const potentialNewTotalStatCost = currentTotalStatCost - costOfStatBeingChanged + costOfPotentialNewStat;

    if (characterData.statPointLimit !== undefined && potentialNewTotalStatCost > characterData.statPointLimit) {
      toast({ title: "Stat Limit Exceeded", description: `Changing ${statName} would make total stat cost ${potentialNewTotalStatCost}pts, exceeding the limit of ${characterData.statPointLimit}.`, variant: "destructive" });
      return; 
    }

    setCharacterData(current => ({ 
      ...current,
      stats: {
        ...current.stats,
        [statName]: { ...current.stats[statName], [dieType]: value },
      },
    }));
  };

  const handleWillpowerChange = (field: keyof CharacterData['willpower'], value: number) => {
    setCharacterData(current => {
      const localGmSettings = gmSettings; 
      const currentCalcBaseWillFromStats = calculateBaseWillFromStats(current.stats, getDiscardedAttributeFromBasicInfo(current.basicInfo));
      let toastMessagesProps: Array<Parameters<typeof toast>[0]> = [];


      let newPurchasedBaseWill = field === 'purchasedBaseWill' ? value : current.willpower.purchasedBaseWill;
      let newPurchasedWill = field === 'purchasedWill' ? value : current.willpower.purchasedWill;

      newPurchasedBaseWill = Math.max(0, isNaN(newPurchasedBaseWill) ? 0 : newPurchasedBaseWill);
      newPurchasedWill = Math.max(0, isNaN(newPurchasedWill) ? 0 : newPurchasedWill);

      if (current.basicInfo.selectedIntrinsicMQIds.includes('no_base_will')) {
        newPurchasedBaseWill = 0;
        newPurchasedWill = 0;
      } else if (current.basicInfo.selectedIntrinsicMQIds.includes('no_willpower')) {
        newPurchasedWill = 0;
      }
      
      let newTotalBaseWill = currentCalcBaseWillFromStats + newPurchasedBaseWill;
      if (localGmSettings.willpowerRestrictions.maxBaseWill !== undefined && newTotalBaseWill > localGmSettings.willpowerRestrictions.maxBaseWill) {
        const oldPurchasedBaseWill = newPurchasedBaseWill;
        newPurchasedBaseWill = Math.max(0, localGmSettings.willpowerRestrictions.maxBaseWill - currentCalcBaseWillFromStats);
        newTotalBaseWill = currentCalcBaseWillFromStats + newPurchasedBaseWill;
        if (oldPurchasedBaseWill !== newPurchasedBaseWill) {
           toastMessagesProps.push({ title: "Willpower Adjusted by GM Settings", description: `Purchased Base Will adjusted to ${newPurchasedBaseWill} to not exceed GM's Total Base Will limit of ${localGmSettings.willpowerRestrictions.maxBaseWill}.`, variant: "default" });
        }
      }

      let newTotalWill = newTotalBaseWill + newPurchasedWill;
      if (localGmSettings.willpowerRestrictions.maxTotalWill !== undefined && newTotalWill > localGmSettings.willpowerRestrictions.maxTotalWill) {
        const oldPurchasedWill = newPurchasedWill;
        newPurchasedWill = Math.max(0, localGmSettings.willpowerRestrictions.maxTotalWill - newTotalBaseWill);
         if (oldPurchasedWill !== newPurchasedWill) {
            toastMessagesProps.push({ title: "Willpower Adjusted by GM Settings", description: `Purchased Will adjusted to ${newPurchasedWill} to not exceed GM's Total Will limit of ${localGmSettings.willpowerRestrictions.maxTotalWill}.`, variant: "default" });
        }
      }
      
      const tempWillpowerForCheck = { purchasedBaseWill: newPurchasedBaseWill, purchasedWill: newPurchasedWill };
      const potentialWillpowerCost = calculateTotalWillpowerPoints(
        tempWillpowerForCheck.purchasedBaseWill,
        tempWillpowerForCheck.purchasedWill,
        current.basicInfo.selectedIntrinsicMQIds.includes('no_base_will'),
        current.basicInfo.selectedIntrinsicMQIds.includes('no_willpower')
      );

      if (current.willpowerPointLimit !== undefined && potentialWillpowerCost > current.willpowerPointLimit) {
        toast({ title: "Willpower Limit Exceeded", description: `This change would make Willpower cost ${potentialWillpowerCost}pts, exceeding the limit of ${current.willpowerPointLimit}. Change reverted.`, variant: "destructive" });
        return current; 
      }

      if (toastMessagesProps.length > 0) {
        setTimeout(() => {
          toastMessagesProps.forEach(tProps => toast(tProps));
        }, 0);
      }
      
      return {
        ...current,
        willpower: { purchasedBaseWill: newPurchasedBaseWill, purchasedWill: newPurchasedWill },
      };
    });
  };

  const handleAddSkill = (skillDef: PredefinedSkillDef) => {
    const newSkillCost = calculateSingleSkillPoints({
      id: '', definitionId: '', name: '', baseName: '', linkedAttribute: skillDef.linkedAttribute, description: '',
      dice: '1D', hardDice: '0HD', wiggleDice: '0WD', isCustom: false
    });
    const currentTotalSkillCost = calculateTotalSkillPoints(characterData.skills);
    if (characterData.skillPointLimit !== undefined && (currentTotalSkillCost + newSkillCost) > characterData.skillPointLimit) {
      toast({ title: "Skill Limit Exceeded", description: `Adding this skill would exceed the Skill Point Limit of ${characterData.skillPointLimit}.`, variant: "destructive" });
      return; 
    }

    setCharacterData(current => { 
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
      return { ...current, skills: [...current.skills, newSkillInstance] };
    });
  };

  const handleAddCustomSkill = () => {
    const newSkillCost = calculateSingleSkillPoints({
      id: '', definitionId: '', name: '', baseName: '', linkedAttribute: 'body', description: '',
      dice: '1D', hardDice: '0HD', wiggleDice: '0WD', isCustom: true
    });
    const currentTotalSkillCost = calculateTotalSkillPoints(characterData.skills);
    if (characterData.skillPointLimit !== undefined && (currentTotalSkillCost + newSkillCost) > characterData.skillPointLimit) {
      toast({ title: "Skill Limit Exceeded", description: `Adding a custom skill would exceed the Skill Point Limit of ${characterData.skillPointLimit}.`, variant: "destructive" });
      return; 
    }
    setCharacterData(current => { 
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
      return { ...current, skills: [...current.skills, newCustomSkill] };
    });
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
    const currentTotalSkillCost = calculateTotalSkillPoints(characterData.skills);
    const skillBeingChanged = characterData.skills.find(s => s.id === skillId);
    if (!skillBeingChanged) return;

    const costOfSkillBeingChanged = calculateSingleSkillPoints(skillBeingChanged);
    
    const tempSkillForCheck = { ...skillBeingChanged, [field]: value };
    if (field === 'typeSpecification' && tempSkillForCheck.hasType) {
      tempSkillForCheck.name = `${tempSkillForCheck.baseName}${value ? ` (${value})` : ' (Unspecified)'}`;
    }
    if (field === 'name' && tempSkillForCheck.isCustom) {
       tempSkillForCheck.baseName = value as string;
    }
    const costOfPotentialNewSkill = calculateSingleSkillPoints(tempSkillForCheck);
    const potentialNewTotalSkillCost = currentTotalSkillCost - costOfSkillBeingChanged + costOfPotentialNewSkill;

    if (characterData.skillPointLimit !== undefined && potentialNewTotalSkillCost > characterData.skillPointLimit) {
      toast({ title: "Skill Limit Exceeded", description: `This skill change would make total skill cost ${potentialNewTotalSkillCost}pts, exceeding the limit of ${characterData.skillPointLimit}.`, variant: "destructive" });
      return; 
    }
    
    setCharacterData(current => { 
      return {
        ...current,
        skills: current.skills.map(skill => {
          if (skill.id === skillId) {
            const updatedSkill = { ...skill, [field]: value };
            if (field === 'typeSpecification' && updatedSkill.hasType) {
              updatedSkill.name = `${updatedSkill.baseName}${value ? ` (${value})` : ' (Unspecified)'}`;
            }
            if (field === 'name' && updatedSkill.isCustom) {
               updatedSkill.baseName = value as string;
            }
            return updatedSkill;
          }
          return skill;
        }),
      };
    });
  };

  const updateMiraclesIfAllowed = (
      updater: (currentMiracles: MiracleDefinition[], currentSkills: SkillInstance[]) => MiracleDefinition[],
      toastTitleOnLimitExceeded: string,
      toastDescriptionFnOnLimitExceeded: (cost: number, limit:number) => string,
      adjustmentToastInfo?: { title: string; description: string } | null
    ) => {
    const currentCharacterState = characterData;
    const newMiracles = updater(currentCharacterState.miracles, currentCharacterState.skills);
    const potentialMiracleCost = calculateTotalMiraclePoints(newMiracles, currentCharacterState.skills);

    if (currentCharacterState.miraclePointLimit !== undefined && potentialMiracleCost > currentCharacterState.miraclePointLimit) {
        toast({ title: toastTitleOnLimitExceeded, description: toastDescriptionFnOnLimitExceeded(potentialMiracleCost, currentCharacterState.miraclePointLimit), variant: "destructive"});
        return;
    }
    
    if (adjustmentToastInfo) {
      setTimeout(() => { 
        toast({ title: adjustmentToastInfo.title, description: adjustmentToastInfo.description, variant: "default" });
      }, 0);
    }

    setCharacterData(current => ({...current, miracles: newMiracles}));
  };


  const handleAddMiracle = (type: 'custom' | string) => {
    updateMiraclesIfAllowed(
      (currentMiracles, currentSkills) => {
        let newMiracle: MiracleDefinition;
        if (type === 'custom') {
          newMiracle = {
            id: `miracle-${Date.now()}`, name: 'New Custom Miracle',
            dice: '1D', hardDice: '0HD', wiggleDice: '0WD', qualities: [],
            description: 'Custom miracle description.', isCustom: true, isMandatory: false,
          };
        } else {
          const template = PREDEFINED_MIRACLES_TEMPLATES.find(m => m.definitionId === type);
          if (!template) return currentMiracles; 
          newMiracle = {
            ...template, id: `miracle-${template.definitionId}-${Date.now()}`,
            dice: '1D', hardDice: '0HD', wiggleDice: '0WD',
            qualities: template.qualities.map(q => ({
                ...q, id: `quality-instance-${Date.now()}-${Math.random().toString(36).substring(2)}`,
                extras: q.extras.map(ex => ({...ex, id: `extra-instance-${Date.now()}-${Math.random().toString(36).substring(2)}`})),
                flaws: q.flaws.map(fl => ({...fl, id: `flaw-instance-${Date.now()}-${Math.random().toString(36).substring(2)}`})),
            })), 
            isCustom: false, isMandatory: false, 
          };
        }
        return [...currentMiracles, newMiracle];
      },
      "Miracle Limit Exceeded",
      (cost, limit) => `Adding this miracle would make total miracle cost ${cost}pts, exceeding the limit of ${limit}.`
    );
  };

  const handleRemoveMiracle = (miracleId: string) => {
     const miracleToRemove = characterData.miracles.find(m => m.id === miracleId);
     const isIntrinsicMandatedUnremovable = miracleToRemove && miracleToRemove.isMandatory && 
        (
          miracleToRemove.definitionId?.startsWith('archetype-mandatory-') || 
          (characterData.basicInfo.selectedArchetypeId === 'godlike_talent' && miracleToRemove.definitionId === 'perceive_godlike_talents') ||
          (characterData.basicInfo.selectedArchetypeId === 'mystic' && miracleToRemove.definitionId === 'cosmic_power')
        );

     if (isIntrinsicMandatedUnremovable) {
        toast({ title: "Cannot remove intrinsic-mandated miracle", description: "This miracle's existence is tied to an archetype or intrinsic setting.", variant: "destructive"});
        return;
    }
    updateMiraclesIfAllowed(
      (currentMiracles) => currentMiracles.filter(m => m.id !== miracleId),
       "Miracle Limit Exceeded", 
       (cost, limit) => `This change would make total miracle cost ${cost}pts, exceeding the limit of ${limit}.`
    );
  };

  const handleMiracleChange = (miracleId: string, field: keyof MiracleDefinition, value: any) => {
     const miracle = characterData.miracles.find(m => m.id === miracleId);
     const isIntrinsicMandatedUnremovable = miracle && miracle.isMandatory && 
        (
          miracle.definitionId?.startsWith('archetype-mandatory-') || 
          (characterData.basicInfo.selectedArchetypeId === 'godlike_talent' && miracle.definitionId === 'perceive_godlike_talents') ||
          (characterData.basicInfo.selectedArchetypeId === 'mystic' && miracle.definitionId === 'cosmic_power')
        );

     if (isIntrinsicMandatedUnremovable && field === 'isMandatory' && !value) {
       toast({ title: "Cannot change mandatory status", description: "This miracle is mandated by an archetype intrinsic or specific archetype rule.", variant: "destructive"});
       return;
     }

    let processedValue = value;
    let toastInfo: { title: string; description: string } | null = null;
    const maxDicePerType = gmSettings.miracleRestrictions.numericRestrictions.maxDicePerType;

    if (maxDicePerType !== undefined && (field === 'dice' || field === 'hardDice' || field === 'wiggleDice')) {
      const dieSuffix = field === 'dice' ? 'D' : field === 'hardDice' ? 'HD' : 'WD';
      let numericPart = parseInt((value as string).replace(dieSuffix, ''), 10);
      
      if (isNaN(numericPart)) { 
        numericPart = (field === 'dice' ? 1: 0); 
      }


      if (numericPart > maxDicePerType) {
        toastInfo = {
          title: `Max ${dieSuffix} Adjusted by GM Setting`,
          description: `${dieSuffix} for miracles cannot exceed ${maxDicePerType}. Value set to ${maxDicePerType}${dieSuffix}.`,
        };
        numericPart = maxDicePerType;
      }
      processedValue = `${numericPart}${dieSuffix}`;
    }
    
    updateMiraclesIfAllowed(
      (currentMiracles) => currentMiracles.map(m => m.id === miracleId ? { ...m, [field]: processedValue } : m),
      "Miracle Limit Exceeded",
      (cost, limit) => `This miracle change would make total miracle cost ${cost}pts, exceeding the limit of ${limit}.`,
      toastInfo
    );
  };

  const handleAddMiracleQuality = (miracleId: string) => {
    updateMiraclesIfAllowed(
      (currentMiracles) => {
        const newQuality: MiracleQuality = {
          id: `quality-${Date.now()}`, type: 'useful', capacity: 'touch', levels: 0, extras: [], flaws: [],
        };
        return currentMiracles.map(m =>
          m.id === miracleId ? { ...m, qualities: [...m.qualities, newQuality] } : m
        );
      },
      "Miracle Limit Exceeded",
      (cost, limit) => `Adding this quality would make total miracle cost ${cost}pts, exceeding the limit of ${limit}.`
    );
  };

  const handleRemoveMiracleQuality = (miracleId: string, qualityId: string) => {
    updateMiraclesIfAllowed(
      (currentMiracles) => currentMiracles.map(m =>
        m.id === miracleId ? { ...m, qualities: m.qualities.filter(q => q.id !== qualityId) } : m
      ),
      "Miracle Limit Exceeded", 
      (cost, limit) => `This change would make total miracle cost ${cost}pts, exceeding the limit of ${limit}.`
    );
  };

  const handleMiracleQualityChange = (
    miracleId: string,
    qualityId: string,
    field: keyof MiracleQuality,
    value: any
  ) => {
    let processedValue = value;
    let toastInfo: { title: string; description: string } | null = null;

    if (field === 'levels') {
      const numericValue = Number(value);
      let val = Math.max(0, isNaN(numericValue) ? 0 : numericValue);
      const maxLevels = gmSettings.miracleRestrictions.numericRestrictions.maxPowerQualityLevels;
      if (maxLevels !== undefined && val > maxLevels) {
        toastInfo = {
          title: "Max Quality Levels Adjusted by GM Setting",
          description: `Power Quality Levels cannot exceed ${maxLevels}. Value set to ${maxLevels}.`,
        };
        val = maxLevels;
      }
      processedValue = val;
    }
    
    updateMiraclesIfAllowed(
      (currentMiracles) => currentMiracles.map(m =>
        m.id === miracleId ? {
          ...m,
          qualities: m.qualities.map(q => {
            if (q.id === qualityId) {
              return { ...q, [field]: processedValue };
            }
            return q;
          })
        } : m
      ),
      "Miracle Limit Exceeded",
      (cost, limit) => `This quality change would make total miracle cost ${cost}pts, exceeding the limit of ${limit}.`,
      toastInfo
    );
  };

  const handleAddExtraOrFlawToQuality = (
    miracleId: string,
    qualityId: string,
    itemType: 'extra' | 'flaw',
    definitionId?: string
  ) => {
    updateMiraclesIfAllowed(
      (currentMiracles) => {
        let newItem: AppliedExtraOrFlaw;
        if (definitionId) {
          const collection = itemType === 'extra' ? PREDEFINED_EXTRAS : PREDEFINED_FLAWS;
          const definition = collection.find(item => item.id === definitionId);
          if (!definition) return currentMiracles;
          newItem = {
            id: `${itemType}-def-${definition.id}-${Date.now()}`, definitionId: definition.id,
            name: definition.name, costModifier: definition.costModifier, isCustom: false,
          };
        } else { 
          newItem = {
            id: `custom-${itemType}-${Date.now()}`, name: `Custom ${itemType === 'extra' ? 'Extra' : 'Flaw'}`,
            costModifier: itemType === 'extra' ? 1 : -1, isCustom: true,
          };
        }
        return currentMiracles.map(m =>
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
        );
      },
      "Miracle Limit Exceeded",
      (cost, limit) => `Adding this ${itemType} would make total miracle cost ${cost}pts, exceeding the limit of ${limit}.`
    );
  };

  const handleRemoveExtraOrFlawFromQuality = (
    miracleId: string,
    qualityId: string,
    itemType: 'extra' | 'flaw',
    itemId: string
  ) => {
    updateMiraclesIfAllowed(
      (currentMiracles) => currentMiracles.map(m =>
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
       "Miracle Limit Exceeded", 
       (cost, limit) => `This change would make total miracle cost ${cost}pts, exceeding the limit of ${limit}.`
    );
  };

  const handleExtraOrFlawChange = (
    miracleId: string,
    qualityId: string,
    itemType: 'extra' | 'flaw',
    itemId: string,
    field: keyof AppliedExtraOrFlaw,
    value: string | number
  ) => {
     updateMiraclesIfAllowed(
      (currentMiracles) => currentMiracles.map(m =>
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
      "Miracle Limit Exceeded",
      (cost, limit) => `This ${itemType} change would make total miracle cost ${cost}pts, exceeding the limit of ${limit}.`
    );
  };
  
  const handlePointLimitChange = (value: number) => {
    setCharacterData(prev => ({
      ...prev,
      pointLimit: isNaN(value) || value < 0 ? 250 : value,
    }));
  };

  const handleSubPointLimitChange = (
    limitType: 'archetype' | 'stat' | 'skill' | 'willpower' | 'miracle',
    value: string
  ) => {
    const rawNumericValue = parseInt(value, 10);
    const intendedNewSubLimitValue = isNaN(rawNumericValue) || rawNumericValue < 0 ? undefined : rawNumericValue;
  
    const { 
        pointLimit: currentOverallLimitFromState,
        archetypePointLimit: currentArchetypeLimitFromState, 
        statPointLimit: currentStatLimitFromState, 
        skillPointLimit: currentSkillLimitFromState, 
        willpowerPointLimit: currentWillpowerLimitFromState, 
        miraclePointLimit: currentMiracleLimitFromState 
      } = characterData; 
  
      let sumOfOtherSubLimits = 0;
      if (limitType !== 'archetype') sumOfOtherSubLimits += (currentArchetypeLimitFromState || 0);
      if (limitType !== 'stat') sumOfOtherSubLimits += (currentStatLimitFromState || 0);
      if (limitType !== 'willpower') sumOfOtherSubLimits += (currentWillpowerLimitFromState || 0);
      if (limitType !== 'skill') sumOfOtherSubLimits += (currentSkillLimitFromState || 0);
      if (limitType !== 'miracle') sumOfOtherSubLimits += (currentMiracleLimitFromState || 0);
  
      const overallLimit = currentOverallLimitFromState || 0; 
      let finalNewSubLimitValue = intendedNewSubLimitValue;
      
  
      if (intendedNewSubLimitValue !== undefined) {
        if ((sumOfOtherSubLimits + intendedNewSubLimitValue) > overallLimit) {
          const maxAllowedForThisSubLimit = overallLimit - sumOfOtherSubLimits;
          finalNewSubLimitValue = Math.max(0, maxAllowedForThisSubLimit); 
          
          if (intendedNewSubLimitValue > finalNewSubLimitValue) {
            toast({ 
              title: "Limit Adjusted", 
              description: `The entered ${limitType} limit (${intendedNewSubLimitValue}) was automatically adjusted to ${finalNewSubLimitValue} to not exceed the Overall Point Limit (${overallLimit}).`,
              variant: "default"
            });
          }
        }
      }
      
      setCharacterData(prev => ({ 
        ...prev, 
        [`${limitType}PointLimit`]: finalNewSubLimitValue 
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

  const applyWillpowerCaps = (
    currentWillpower: CharacterData['willpower'],
    currentStats: CharacterData['stats'],
    currentBasicInfo: BasicInfo,
    activeGmSettings: GmSettings
  ): { updatedWillpower: CharacterData['willpower'], toasts: Array<Parameters<typeof toast>[0]> } => {
    let { purchasedBaseWill, purchasedWill } = currentWillpower;
    const toastPropsArray: Array<Parameters<typeof toast>[0]> = [];

    const calcBaseWillFromStats = calculateBaseWillFromStats(currentStats, getDiscardedAttributeFromBasicInfo(currentBasicInfo));
    
    if (currentBasicInfo.selectedIntrinsicMQIds.includes('no_base_will')) {
      purchasedBaseWill = 0;
      purchasedWill = 0;
    } else if (currentBasicInfo.selectedIntrinsicMQIds.includes('no_willpower')) {
      purchasedWill = 0;
    }

    let currentTotalBaseWill = calcBaseWillFromStats + purchasedBaseWill;
    const gmMaxBaseWill = activeGmSettings.willpowerRestrictions.maxBaseWill;

    if (gmMaxBaseWill !== undefined && currentTotalBaseWill > gmMaxBaseWill) {
      const oldPBase = purchasedBaseWill;
      purchasedBaseWill = Math.max(0, gmMaxBaseWill - calcBaseWillFromStats);
      currentTotalBaseWill = calcBaseWillFromStats + purchasedBaseWill;
      if (oldPBase !== purchasedBaseWill) {
        toastPropsArray.push({ title: "Willpower Adjusted by GM Setting", description: `Total Base Will was capped at ${gmMaxBaseWill} by GM settings. Purchased Base Will adjusted to ${purchasedBaseWill}.`, variant: "default" });
      }
    }

    let currentTotalWill = currentTotalBaseWill + purchasedWill;
    const gmMaxTotalWill = activeGmSettings.willpowerRestrictions.maxTotalWill;

    if (gmMaxTotalWill !== undefined && currentTotalWill > gmMaxTotalWill) {
      const oldPWill = purchasedWill;
      purchasedWill = Math.max(0, gmMaxTotalWill - currentTotalBaseWill);
      if (oldPWill !== purchasedWill) {
         toastPropsArray.push({ title: "Willpower Adjusted by GM Setting", description: `Total Will was capped at ${gmMaxTotalWill} by GM settings. Purchased Will adjusted to ${purchasedWill}.`, variant: "default" });
      }
    }
    
    return { updatedWillpower: { purchasedBaseWill, purchasedWill }, toasts: toastPropsArray };
  };


  const handleLoadCharacter = () => {
    try {
      const savedData = localStorage.getItem("wildTalentsCharacter");
      let willpowerToastProps: Array<Parameters<typeof toast>[0]> = [];

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
            inhumanStatsSettings: parsedData.basicInfo?.inhumanStatsSettings 
              ? ALL_STATS.reduce((acc, statName) => {
                  acc[statName] = { 
                    condition: parsedData.basicInfo?.inhumanStatsSettings?.[statName]?.condition || 'normal',
                    inferiorMaxDice: parsedData.basicInfo?.inhumanStatsSettings?.[statName]?.inferiorMaxDice
                  };
                  return acc;
                }, {} as InhumanStatsSettings)
              : initialCharacterData.basicInfo.inhumanStatsSettings,
        };
        
        Object.keys(loadedBasicInfo.intrinsicMandatoryPowerConfig).forEach(key => { // @ts-ignore
            if (typeof loadedBasicInfo.intrinsicMandatoryPowerConfig[key]?.count !== 'number') { // @ts-ignore
                loadedBasicInfo.intrinsicMandatoryPowerConfig[key] = { ...(loadedBasicInfo.intrinsicMandatoryPowerConfig[key] || {}), count: 0};
            }
        });
        Object.keys(loadedBasicInfo.intrinsicVulnerableConfig).forEach(key => { // @ts-ignore
             if (typeof loadedBasicInfo.intrinsicVulnerableConfig[key]?.extraBoxes !== 'number') { // @ts-ignore
                 loadedBasicInfo.intrinsicVulnerableConfig[key] = { ...(loadedBasicInfo.intrinsicVulnerableConfig[key] || {}), extraBoxes: 0};
            }
        });

        let validatedData: CharacterData = {
          ...initialCharacterData, ...parsedData, basicInfo: loadedBasicInfo,
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
            ...skill, id: `loaded-skill-${Date.now()}-${Math.random().toString(36).substring(7)}`, 
          })) : [],
          miracles: parsedData.miracles ? parsedData.miracles.map(miracle => {
            const defaultMiracle: MiracleDefinition = {
              id: `loaded-miracle-${Date.now()}-${Math.random().toString(36).substring(7)}`, name: 'Unnamed Miracle',
              dice: '1D', hardDice: '0HD', wiggleDice: '0WD', qualities: [], description: '', isCustom: true, isMandatory: false,
            };
            return {
              ...defaultMiracle, ...miracle,
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
                  type: 'useful' as MiracleQualityType, capacity: 'touch' as MiracleCapacityType, levels: 0, extras: [], flaws: [],
                };
                return { ...defaultQuality, ...quality,
                  type: typeof quality.type === 'string' ? quality.type as MiracleQualityType : defaultQuality.type,
                  capacity: typeof quality.capacity === 'string' ? quality.capacity as MiracleCapacityType : defaultQuality.capacity,
                  levels: (typeof quality.levels === 'number' && !isNaN(quality.levels)) ? quality.levels : defaultQuality.levels,
                  id: defaultQuality.id, 
                  extras: quality.extras ? quality.extras.map(ex => {
                    const defaultExtra: AppliedExtraOrFlaw = {
                        id: `loaded-extra-${Date.now()}-${Math.random().toString(36).substring(7)}`, name: 'Custom Extra', costModifier: 1, isCustom: true,
                    };
                    let loadedCostModifier = ex.costModifier;
                    if (typeof loadedCostModifier !== 'number' || isNaN(loadedCostModifier)) {
                        const predefinedEx = PREDEFINED_EXTRAS.find(pEx => pEx.id === ex.definitionId);
                        loadedCostModifier = ex.isCustom ? 1 : (predefinedEx?.costModifier ?? 0);
                    }
                    if (isNaN(loadedCostModifier)) loadedCostModifier = ex.isCustom ? 1 : 0;
                    return { ...defaultExtra, ...ex, name: typeof ex.name === 'string' ? ex.name : defaultExtra.name, costModifier: loadedCostModifier, isCustom: typeof ex.isCustom === 'boolean' ? ex.isCustom : defaultExtra.isCustom, id: defaultExtra.id, };
                  }) : [],
                  flaws: quality.flaws ? quality.flaws.map(fl => {
                    const defaultFlaw: AppliedExtraOrFlaw = {
                        id: `loaded-flaw-${Date.now()}-${Math.random().toString(36).substring(7)}`, name: 'Custom Flaw', costModifier: -1, isCustom: true,
                    };
                    let loadedCostModifier = fl.costModifier;
                    if (typeof loadedCostModifier !== 'number' || isNaN(loadedCostModifier)) {
                        const predefinedFl = PREDEFINED_FLAWS.find(pFL => pFL.id === fl.definitionId);
                        loadedCostModifier = fl.isCustom ? -1 : (predefinedFl?.costModifier ?? 0);
                    }
                    if (isNaN(loadedCostModifier)) loadedCostModifier = fl.isCustom ? -1 : 0;
                     return { ...defaultFlaw, ...fl, name: typeof fl.name === 'string' ? fl.name : defaultFlaw.name, costModifier: loadedCostModifier, isCustom: typeof fl.isCustom === 'boolean' ? fl.isCustom : defaultFlaw.isCustom, id: defaultFlaw.id, };
                  }) : [],
                };
              }) : [],
            };
          }) : [],
          pointLimit: typeof parsedData.pointLimit === 'number' && parsedData.pointLimit >=0 ? parsedData.pointLimit : initialCharacterData.pointLimit,
          archetypePointLimit: typeof parsedData.archetypePointLimit === 'number' && parsedData.archetypePointLimit >=0 ? parsedData.archetypePointLimit : initialCharacterData.archetypePointLimit,
          statPointLimit: typeof parsedData.statPointLimit === 'number' && parsedData.statPointLimit >=0 ? parsedData.statPointLimit : initialCharacterData.statPointLimit,
          skillPointLimit: typeof parsedData.skillPointLimit === 'number' && parsedData.skillPointLimit >=0 ? parsedData.skillPointLimit : initialCharacterData.skillPointLimit,
          willpowerPointLimit: typeof parsedData.willpowerPointLimit === 'number' && parsedData.willpowerPointLimit >=0 ? parsedData.willpowerPointLimit : initialCharacterData.willpowerPointLimit,
          miraclePointLimit: typeof parsedData.miraclePointLimit === 'number' && parsedData.miraclePointLimit >=0 ? parsedData.miraclePointLimit : initialCharacterData.miraclePointLimit,
        };

        for (const statKey in initialCharacterData.stats) {
          if (parsedData.stats && parsedData.stats[statKey as keyof CharacterData['stats']]) {
            validatedData.stats[statKey as keyof CharacterData['stats']] = {
              ...initialStatDetail, ...parsedData.stats[statKey as keyof CharacterData['stats']],
            };
          }
        }
        
        validatedData.willpower.purchasedBaseWill = Number(validatedData.willpower.purchasedBaseWill) || 0;
        validatedData.willpower.purchasedWill = Number(validatedData.willpower.purchasedWill) || 0;
        
        const { updatedWillpower, toasts: toastsFromCaps } = applyWillpowerCaps(
          validatedData.willpower,
          validatedData.stats,
          validatedData.basicInfo,
          gmSettings 
        );
        validatedData.willpower = updatedWillpower;
        willpowerToastProps = toastsFromCaps;
        
        setCharacterData(validatedData);

        setTimeout(() => {
          willpowerToastProps.forEach(tProps => toast(tProps));
          toast({ title: "Character Loaded", description: "Character data has been loaded from local storage." });
        }, 0);

      } else {
        setTimeout(() => {
          toast({ title: "No Saved Data", description: "No character data found in local storage.", variant: "destructive" });
        }, 0);
        setCharacterData(initialCharacterData); 
      }
    } catch (error) {
      console.error("Failed to load character:", error);
      setTimeout(() => {
        toast({ title: "Load Error", description: `Could not load character data. ${error instanceof Error ? error.message : 'Unknown error.'}`, variant: "destructive" });
      }, 0);
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
      toast({ title: "Character Exported", description: `Character data downloaded as ${fileName}.` });
    } catch (error) {
       console.error("Failed to export character:", error);
       toast({ title: "Export Error", description: "Could not export character data.", variant: "destructive" });
    }
  };

  const handleResetToDefault = () => {
    setCharacterData(initialCharacterData);
    setGmSettings(initialGmSettings);
    setCustomArchetypeData(initialCustomArchetypeData); 
    setTimeout(() => {
      toast({
        title: "Data Reset",
        description: "Character data, GM settings, and custom archetype form have been reset to default.",
      });
    }, 0);
  };
  
  const handleGmPointLimitChange = (limitType: keyof GmPointRestrictions, value: string) => {
    const numericValue = parseInt(value, 10);
    const processedValue = isNaN(numericValue) || numericValue < 0 ? undefined : numericValue;
    setGmSettings(prev => ({
      ...prev,
      pointRestrictions: {
        ...prev.pointRestrictions,
        [limitType]: processedValue,
      }
    }));
  };

  const handleGmToggleableItemChange = (
    category: keyof Pick<GmSettings, 'sampleArchetypes' | 'metaQualitiesSource' | 'metaQualitiesPermission' | 'metaQualitiesIntrinsic' | 'sampleSkills'> | 
              keyof GmSettings['miracleRestrictions'], 
    itemId: string,
    isChecked: boolean
  ) => {
    setGmSettings(prev => {
      const newSettings = { ...prev };
      if (category === 'allowedSampleMiracles' || category === 'allowedQualities' || category === 'allowedCapacities' || category === 'allowedExtras' || category === 'allowedFlaws') {
        newSettings.miracleRestrictions = {
          ...newSettings.miracleRestrictions,
          [category]: {
            // @ts-ignore
            ...(newSettings.miracleRestrictions[category] || {}),
            [itemId]: isChecked,
          }
        };
      } else {
         // @ts-ignore
        newSettings[category] = {
           // @ts-ignore
          ...(newSettings[category] || {}),
          [itemId]: isChecked,
        };
      }
      return newSettings;
    });
  };
  
  const handleGmWillpowerRestrictionChange = (field: keyof GmWillpowerRestrictions, value: string) => {
    const numericValue = parseInt(value, 10);
    const processedValue = isNaN(numericValue) || numericValue < 0 ? undefined : numericValue;
    setGmSettings(prev => ({
      ...prev,
      willpowerRestrictions: {
        ...prev.willpowerRestrictions,
        [field]: processedValue,
      }
    }));
  };

  const handleGmMiracleNumericRestrictionChange = (field: keyof GmMiracleNumericRestrictions, value: string) => {
    const numericValue = parseInt(value, 10);
    const processedValue = isNaN(numericValue) || numericValue < 0 ? undefined : numericValue;
    setGmSettings(prev => ({
      ...prev,
      miracleRestrictions: {
        ...prev.miracleRestrictions,
        numericRestrictions: {
          ...prev.miracleRestrictions.numericRestrictions,
          [field]: processedValue,
        }
      }
    }));
  };

  const handleExportGmSettings = () => {
    try {
      const jsonString = JSON.stringify(gmSettings, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wild_talents_gm_settings.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "GM Settings Exported", description: "GM settings downloaded as wild_talents_gm_settings.json." });
    } catch (error) {
       console.error("Failed to export GM settings:", error);
       toast({ title: "Export Error", description: "Could not export GM settings.", variant: "destructive" });
    }
  };

  const handleImportGmSettings = (importedSettings: GmSettings) => {
    let willpowerToastPropsArray: Array<Parameters<typeof toast>[0]> = [];
    if (
      !importedSettings ||
      typeof importedSettings !== 'object' ||
      !importedSettings.pointRestrictions ||
      !importedSettings.sampleArchetypes ||
      !importedSettings.metaQualitiesSource ||
      !importedSettings.metaQualitiesPermission ||
      !importedSettings.metaQualitiesIntrinsic ||
      !importedSettings.sampleSkills ||
      !importedSettings.willpowerRestrictions ||
      !importedSettings.miracleRestrictions
    ) {
      setTimeout(() => {
        toast({
          title: "Import Error",
          description: "Invalid GM settings file structure.",
          variant: "destructive",
        });
      }, 0);
      return;
    }

    setGmSettings(importedSettings);

    setCharacterData(prevCharData => {
      let newCharData = { ...prevCharData };
      const { pointRestrictions: importedPointRestrictions } = importedSettings;

      if (importedPointRestrictions.overallPointLimit !== undefined) {
        newCharData.pointLimit = importedPointRestrictions.overallPointLimit;
      }
      if (importedPointRestrictions.archetypePointLimit !== undefined) {
        newCharData.archetypePointLimit = importedPointRestrictions.archetypePointLimit;
      }
      if (importedPointRestrictions.statPointLimit !== undefined) {
        newCharData.statPointLimit = importedPointRestrictions.statPointLimit;
      }
      if (importedPointRestrictions.willpowerPointLimit !== undefined) {
        newCharData.willpowerPointLimit = importedPointRestrictions.willpowerPointLimit;
      }
      if (importedPointRestrictions.skillPointLimit !== undefined) {
        newCharData.skillPointLimit = importedPointRestrictions.skillPointLimit;
      }
      if (importedPointRestrictions.miraclePointLimit !== undefined) {
        newCharData.miraclePointLimit = importedPointRestrictions.miraclePointLimit;
      }

      const { updatedWillpower, toasts: willpowerToastsFromApply } = applyWillpowerCaps(
        newCharData.willpower,
        newCharData.stats,
        newCharData.basicInfo,
        importedSettings
      );
      newCharData.willpower = updatedWillpower;
      willpowerToastPropsArray = willpowerToastsFromApply; 
      
      return newCharData;
    });

    setTimeout(() => {
      willpowerToastPropsArray.forEach(tProps => toast(tProps));
      toast({
        title: "GM Settings Imported",
        description: "Character creation parameters have been successfully imported and applied. Character's willpower and point limits updated if necessary.",
      });
    }, 0);
  };

  const handleImportCustomArchetype = (importedArchetype: GmCustomArchetypeData) => {
    // Basic validation
    if (
      !importedArchetype ||
      typeof importedArchetype !== 'object' ||
      typeof importedArchetype.name !== 'string' ||
      !Array.isArray(importedArchetype.sourceMQIds) ||
      !Array.isArray(importedArchetype.permissionMQIds) ||
      !Array.isArray(importedArchetype.intrinsicMQIds) ||
      typeof importedArchetype.intrinsicConfigs !== 'object' ||
      typeof importedArchetype.mandatoryPowerDetails !== 'object'
    ) {
      setTimeout(() => {
        toast({
          title: "Import Error",
          description: "Invalid Custom Archetype file structure.",
          variant: "destructive",
        });
      }, 0);
      return;
    }

    // More detailed validation can be added here for specific fields,
    // e.g., ensuring miracle structures are correct, MQ IDs are valid, etc.

    setCustomArchetypeData(importedArchetype);
    setTimeout(() => {
      toast({
        title: "Custom Archetype Imported",
        description: `Custom Archetype "${importedArchetype.name}" has been loaded into the GM Tools.`,
      });
    }, 0);
  };


  const getDiscardedAttributeFromBasicInfo = (bInfo: BasicInfo): DiscardedAttributeType => {
    if (bInfo.selectedIntrinsicMQIds.includes('custom_stats')) {
        for (const id of Object.keys(bInfo.intrinsicCustomStatsConfig)) {
            const intrinsicDef = INTRINSIC_META_QUALITIES.find(mq => mq.id === id);
            if (bInfo.selectedIntrinsicMQIds.includes(id) && intrinsicDef?.id === 'custom_stats' && intrinsicDef?.configKey === 'intrinsicCustomStatsConfig') {
                 // @ts-ignore
                const discarded = bInfo.intrinsicCustomStatsConfig[id]?.discardedAttribute;
                if (discarded) return discarded;
            }
        }
    }
    return undefined;
  };

  const calculateBaseWillFromStats = (currentStats: CharacterData['stats'], currentDiscardedAttribute?: DiscardedAttributeType): number => {
    const charmDice = parseInt(currentStats.charm.dice.replace('D',''),10) || 0;
    const charmHD = parseInt(currentStats.charm.hardDice.replace('HD',''),10) || 0;
    const charmWD = parseInt(currentStats.charm.wiggleDice.replace('WD',''),10) || 0;
    const commandDice = parseInt(currentStats.command.dice.replace('D',''),10) || 0;
    const commandHD = parseInt(currentStats.command.hardDice.replace('HD',''),10) || 0;
    const commandWD = parseInt(currentStats.command.wiggleDice.replace('WD',''),10) || 0;

    let charmValue = charmDice + charmHD + charmWD;
    let commandValue = commandDice + commandHD + commandWD;

    if (currentDiscardedAttribute === 'charm') charmValue = 0;
    if (currentDiscardedAttribute === 'command') commandValue = 0;
    
    return charmValue + commandValue;
  };
  
  // Custom Archetype Creation Handlers
  const handleCustomArchetypeFieldChange = (field: keyof Omit<GmCustomArchetypeData, 'sourceMQIds' | 'permissionMQIds' | 'intrinsicMQIds' | 'intrinsicConfigs' | 'mandatoryPowerDetails' | 'inhumanStatsSettings'>, value: string) => {
    setCustomArchetypeData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomArchetypeMQSelectionChange = (
    mqType: 'source' | 'permission' | 'intrinsic',
    mqId: string,
    isSelected: boolean
  ) => {
    setCustomArchetypeData(prev => {
      const newCustomData = { ...prev };
      let currentSelection: string[] = [];

      if (mqType === 'source') currentSelection = [...newCustomData.sourceMQIds];
      else if (mqType === 'permission') currentSelection = [...newCustomData.permissionMQIds];
      else if (mqType === 'intrinsic') currentSelection = [...newCustomData.intrinsicMQIds];

      if (isSelected) {
        if (!currentSelection.includes(mqId)) currentSelection.push(mqId);
      } else {
        currentSelection = currentSelection.filter(id => id !== mqId);
        if (mqType === 'intrinsic' && mqId === 'mandatory_power') {
          newCustomData.mandatoryPowerDetails = { count: 0, miracles: [] };
        }
        const intrinsicDef = INTRINSIC_META_QUALITIES.find(imq => imq.id === mqId);
        if (mqType === 'intrinsic' && intrinsicDef?.configKey && intrinsicDef.configKey !== 'intrinsicMandatoryPowerConfig') {
           // @ts-ignore
          delete newCustomData.intrinsicConfigs[intrinsicDef.configKey][mqId];
        }
      }

      if (mqType === 'source') newCustomData.sourceMQIds = currentSelection;
      else if (mqType === 'permission') newCustomData.permissionMQIds = currentSelection;
      else if (mqType === 'intrinsic') newCustomData.intrinsicMQIds = currentSelection;
      
      return newCustomData;
    });
  };
  
  const handleCustomArchetypeMandatoryPowerCountChange = (newCountString: string) => {
    const newCount = Math.max(0, parseInt(newCountString, 10) || 0);
    setCustomArchetypeData(prev => {
      const currentMiracles = prev.mandatoryPowerDetails.miracles;
      const updatedMiracles: MiracleDefinition[] = [];
      for (let i = 0; i < newCount; i++) {
        if (i < currentMiracles.length) {
          updatedMiracles.push(currentMiracles[i]);
        } else {
          updatedMiracles.push({
            id: `gm-mandatory-miracle-${Date.now()}-${i}`,
            name: `Mandatory Power ${i + 1}`,
            description: 'GM-defined mandatory power.',
            dice: '1D', hardDice: '0HD', wiggleDice: '0WD',
            qualities: [],
            isCustom: true, 
            isMandatory: true,
          });
        }
      }
      return {
        ...prev,
        mandatoryPowerDetails: {
          count: newCount,
          miracles: updatedMiracles,
        }
      };
    });
  };

  const handleCustomArchetypeMandatoryMiracleChange = (
    miracleIndex: number,
    field: keyof Pick<MiracleDefinition, 'name' | 'description' | 'dice' | 'hardDice' | 'wiggleDice'>,
    value: string
  ) => {
    setCustomArchetypeData(prev => {
      const updatedMiracles = [...prev.mandatoryPowerDetails.miracles];
      if (updatedMiracles[miracleIndex]) {
        // @ts-ignore
        updatedMiracles[miracleIndex] = { ...updatedMiracles[miracleIndex], [field]: value };
      }
      return {
        ...prev,
        mandatoryPowerDetails: {
          ...prev.mandatoryPowerDetails,
          miracles: updatedMiracles,
        }
      };
    });
  };
  
  const handleCustomArchetypeIntrinsicConfigChange = (
    metaQualityId: string,
    configKey: keyof GmCustomArchetypeData['intrinsicConfigs'],
    field: string,
    value: any
  ) => {
    setCustomArchetypeData(prev => ({
      ...prev,
      intrinsicConfigs: {
        ...prev.intrinsicConfigs,
        [configKey]: {
          // @ts-ignore
          ...(prev.intrinsicConfigs[configKey] || {}),
          [metaQualityId]: {
             // @ts-ignore
            ...(prev.intrinsicConfigs[configKey]?.[metaQualityId] || {}),
            [field]: value,
          }
        }
      }
    }));
  };
   const handleCustomArchetypeInhumanStatSettingChange = (
    statName: keyof InhumanStatsSettings,
    field: keyof InhumanStatSetting,
    value: any
  ) => {
    setCustomArchetypeData(prev => {
        const newInhumanSettings = {
            ...(prev.inhumanStatsSettings || {}),
            [statName]: {
                ...(prev.inhumanStatsSettings?.[statName] || { condition: 'normal' }),
                [field]: value,
            }
        } as InhumanStatsSettings;

        if (field === 'condition' && value !== 'inferior') {
            delete newInhumanSettings[statName]?.inferiorMaxDice;
        }
        if (field === 'condition' && value === 'inferior' && !newInhumanSettings[statName]?.inferiorMaxDice) {
            if(newInhumanSettings[statName]) { // @ts-ignore
                 newInhumanSettings[statName].inferiorMaxDice = 4;
            }
        }
        return { ...prev, inhumanStatsSettings: newInhumanSettings };
    });
  };


  const handleExportCustomArchetype = () => {
    try {
      const archetypeToExport: GmCustomArchetypeData = {
        ...customArchetypeData,
        // Ensure mandatory miracles have unique IDs if they were just placeholders
        mandatoryPowerDetails: {
            ...customArchetypeData.mandatoryPowerDetails,
            miracles: customArchetypeData.mandatoryPowerDetails.miracles.map((m, i) => ({
                ...m,
                id: m.id.startsWith('gm-mandatory-miracle-') ? `exported-gm-mandatory-${customArchetypeData.name.replace(/\s+/g, '_') || 'arch'}-${Date.now()}-${i}` : m.id
            }))
        }
      };
      const jsonString = JSON.stringify(archetypeToExport, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = customArchetypeData.name ? `${customArchetypeData.name.replace(/\s+/g, '_')}_archetype.json` : "custom_archetype.json";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Custom Archetype Exported", description: `Archetype definition downloaded as ${fileName}.` });
    } catch (error) {
       console.error("Failed to export custom archetype:", error);
       toast({ title: "Export Error", description: "Could not export custom archetype data.", variant: "destructive" });
    }
  };


  const discardedAttribute = getDiscardedAttributeFromBasicInfo(characterData.basicInfo);
  const calculatedBaseWillFromStats = calculateBaseWillFromStats(characterData.stats, discardedAttribute);
  
  const hasNoBaseWillIntrinsic = characterData.basicInfo.selectedIntrinsicMQIds.includes('no_base_will');
  const displayCalculatedBaseWillFromStats = hasNoBaseWillIntrinsic ? 0 : calculatedBaseWillFromStats;
  
  const currentPurchasedBaseWill = hasNoBaseWillIntrinsic ? 0 : (characterData.willpower.purchasedBaseWill || 0);
  
  const hasNoWillpowerIntrinsic = characterData.basicInfo.selectedIntrinsicMQIds.includes('no_willpower');
  const currentPurchasedWill = (hasNoBaseWillIntrinsic || hasNoWillpowerIntrinsic) ? 0 : (characterData.willpower.purchasedWill || 0);

  const displayTotalBaseWill = displayCalculatedBaseWillFromStats + currentPurchasedBaseWill;
  
  let displayTotalWill = displayTotalBaseWill + currentPurchasedWill;
  if (hasNoBaseWillIntrinsic || hasNoWillpowerIntrinsic) displayTotalWill = 0;
  
  const totalInvestedInMotivations = characterData.basicInfo.motivations.reduce((sum, m) => sum + (m.investedBaseWill || 0), 0);
  const uninvestedBaseWill = displayTotalBaseWill - totalInvestedInMotivations;


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader
        onSave={handleSaveCharacter}
        onLoad={handleLoadCharacter}
        onExport={handleExportCharacter}
        onImportGmSettings={handleImportGmSettings}
        onImportCustomArchetype={handleImportCustomArchetype} // Pass new handler
        onResetToDefault={handleResetToDefault}
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
                  gmSettings={gmSettings}
                  onBasicInfoChange={handleBasicInfoChange}
                  onAddMotivation={handleAddMotivation}
                  onRemoveMotivation={handleRemoveMotivation}
                  onMotivationChange={handleMotivationChange}
                  uninvestedBaseWill={uninvestedBaseWill}
                  totalBaseWill={displayTotalBaseWill}
                  totalWill={displayTotalWill}
                  calculatedBaseWillFromStats={displayCalculatedBaseWillFromStats}
                  onMQSelectionChange={handleMQSelectionChange}
                  onMetaQualityConfigChange={handleMetaQualityConfigChange as any}
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
                  discardedAttribute={discardedAttribute}
                />
              </TabsContent>
              <TabsContent value="tables" className="mt-0">
                <TablesTabContent />
              </TabsContent>
              <TabsContent value="summary" className="mt-0">
                <SummaryTabContent
                  characterData={characterData}
                  onPointLimitChange={handlePointLimitChange}
                  onSubPointLimitChange={handleSubPointLimitChange}
                  discardedAttribute={discardedAttribute}
                  calculatedBaseWillFromStats={displayCalculatedBaseWillFromStats}
                  totalBaseWill={displayTotalBaseWill}
                  totalWill={displayTotalWill}
                  purchasedBaseWill={currentPurchasedBaseWill}
                  purchasedWill={currentPurchasedWill}
                  hasNoBaseWillIntrinsic={hasNoBaseWillIntrinsic}
                  hasNoWillpowerIntrinsic={hasNoWillpowerIntrinsic}
                />
              </TabsContent>
              <TabsContent value="gm-tools" className="mt-0">
                <GmToolsTabContent 
                  gmSettings={gmSettings}
                  onPointLimitChange={handleGmPointLimitChange}
                  onToggleableItemChange={handleGmToggleableItemChange}
                  onWillpowerRestrictionChange={handleGmWillpowerRestrictionChange}
                  onMiracleNumericRestrictionChange={handleGmMiracleNumericRestrictionChange}
                  onExportSettings={handleExportGmSettings}
                  customArchetypeData={customArchetypeData}
                  onCustomArchetypeFieldChange={handleCustomArchetypeFieldChange}
                  onCustomArchetypeMQSelectionChange={handleCustomArchetypeMQSelectionChange}
                  onCustomArchetypeMandatoryPowerCountChange={handleCustomArchetypeMandatoryPowerCountChange}
                  onCustomArchetypeMandatoryMiracleChange={handleCustomArchetypeMandatoryMiracleChange}
                  onCustomArchetypeIntrinsicConfigChange={handleCustomArchetypeIntrinsicConfigChange}
                  onCustomArchetypeInhumanStatSettingChange={handleCustomArchetypeInhumanStatSettingChange}
                  onExportCustomArchetype={handleExportCustomArchetype}
                />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Wild Talents 2e: Talent Forge
      </footer>
    </div>
  );
}
  

    

    




    





    









