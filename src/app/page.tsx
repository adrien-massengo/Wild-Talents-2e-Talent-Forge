
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
  inhumanStatsSettings?: InhumanStatsSettings; // Added for Inhuman Stats config
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

export default function HomePage() {
  const [characterData, setCharacterData] = React.useState<CharacterData>(initialCharacterData);
  const { toast } = useToast();

  const handleBasicInfoChange = (field: keyof Omit<BasicInfo, 'motivations' | 'inhumanStatsSettings'>, value: any) => {
    setCharacterData(prev => {
      const previousArchetypeId = prev.basicInfo.selectedArchetypeId;
      let newBasicInfo = { ...prev.basicInfo, [field]: value };
      let newWillpower = { ...prev.willpower };
      let updatedMiracles = [...prev.miracles];
      let newInhumanStatsSettings = prev.basicInfo.inhumanStatsSettings || 
        ALL_STATS.reduce((acc, statName) => {
            acc[statName] = { condition: 'normal' };
            return acc;
        }, {} as InhumanStatsSettings);

      if (field === 'selectedArchetypeId') {
        const newArchetypeDef = ARCHETYPES.find(arch => arch.id === value);
        
        // Check Archetype Point Limit
        if (newArchetypeDef && newArchetypeDef.id !== 'custom' && prev.archetypePointLimit !== undefined && newArchetypeDef.points > prev.archetypePointLimit) {
            toast({ title: "Archetype Limit Exceeded", description: `Cannot select ${newArchetypeDef.name}. Its cost (${newArchetypeDef.points}) exceeds the Archetype Point Limit of ${prev.archetypePointLimit}.`, variant: "destructive" });
            return prev; // Revert change
        }
        // Also, if changing to 'custom', the cost will be calculated from MQs, so check that below.
         if (newArchetypeDef && value === 'custom') {
            // For custom, the cost is MQs. We need to ensure current MQs don't exceed limit.
            const currentCustomCost = calculateCurrentArchetypeCost(newBasicInfo); // basicInfo with new 'custom' archetypeId
            if (prev.archetypePointLimit !== undefined && currentCustomCost > prev.archetypePointLimit) {
                 toast({ title: "Archetype Limit Exceeded", description: `Changing to Custom Archetype with current Meta-Qualities (${currentCustomCost}pts) exceeds the Archetype Point Limit of ${prev.archetypePointLimit}. Adjust Meta-Qualities first.`, variant: "destructive" });
                 return prev;
            }
        }


        if (previousArchetypeId === 'godlike_talent' && value !== 'godlike_talent') {
          updatedMiracles = updatedMiracles.filter(m => m.definitionId !== 'perceive_godlike_talents');
        }
        
        if (newArchetypeDef && newArchetypeDef.id !== previousArchetypeId) {
             updatedMiracles = updatedMiracles.filter(m => {
                const isGenericMandatory = m.definitionId?.startsWith('archetype-mandatory-');
                if (m.definitionId === 'perceive_godlike_talents' && value !== 'godlike_talent') return false;
                if (m.definitionId === 'perceive_godlike_talents' && value === 'godlike_talent') return true; 
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
            intrinsicAllergyConfig: { ...prev.basicInfo.intrinsicAllergyConfig },
            intrinsicBruteFrailConfig: { ...prev.basicInfo.intrinsicBruteFrailConfig },
            intrinsicCustomStatsConfig: { ...prev.basicInfo.intrinsicCustomStatsConfig },
            intrinsicMandatoryPowerConfig: { ...prev.basicInfo.intrinsicMandatoryPowerConfig },
            intrinsicVulnerableConfig: { ...prev.basicInfo.intrinsicVulnerableConfig },
          };
          
          newBasicInfo.intrinsicAllergyConfig = {};
          newBasicInfo.intrinsicBruteFrailConfig = {};
          newBasicInfo.intrinsicCustomStatsConfig = {};
          newBasicInfo.intrinsicMandatoryPowerConfig = {};
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

                 if (intrinsicDef.id === 'mandatory_power') {
                    const count = newBasicInfo.intrinsicMandatoryPowerConfig[mqId]?.count || (newArchetypeDef.mandatoryPowerText ? 1 : 0);
                    newBasicInfo.intrinsicMandatoryPowerConfig[mqId] = { count };
                    updatedMiracles = handleMetaQualityConfigChange(mqId, 'intrinsicMandatoryPowerConfig', 'count', count, updatedMiracles, true, value) as MiracleDefinition[];
                }
            }
          });
           if (!newBasicInfo.selectedPermissionMQIds.includes('inhuman_stats')) {
                newInhumanStatsSettings = ALL_STATS.reduce((acc, statName) => {
                    acc[statName] = { condition: 'normal' };
                    return acc;
                }, {} as InhumanStatsSettings);
            } else if (!prev.basicInfo.selectedPermissionMQIds.includes('inhuman_stats') && newBasicInfo.selectedPermissionMQIds.includes('inhuman_stats')) {
                 newInhumanStatsSettings = prev.basicInfo.inhumanStatsSettings && Object.keys(prev.basicInfo.inhumanStatsSettings).length > 0
                    ? prev.basicInfo.inhumanStatsSettings
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
      return { ...prev, basicInfo: {...newBasicInfo, inhumanStatsSettings: newInhumanStatsSettings }, willpower: newWillpower, miracles: updatedMiracles };
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
      const tempBasicInfo = { ...prev.basicInfo };
      let currentSelection: string[] = [];

      if (mqType === 'source') currentSelection = [...tempBasicInfo.selectedSourceMQIds];
      else if (mqType === 'permission') currentSelection = [...tempBasicInfo.selectedPermissionMQIds];
      else if (mqType === 'intrinsic') currentSelection = [...tempBasicInfo.selectedIntrinsicMQIds];

      if (isSelected) {
        if (!currentSelection.includes(mqId)) currentSelection.push(mqId);
      } else {
        currentSelection = currentSelection.filter(id => id !== mqId);
      }
      
      if (mqType === 'source') tempBasicInfo.selectedSourceMQIds = currentSelection;
      else if (mqType === 'permission') tempBasicInfo.selectedPermissionMQIds = currentSelection;
      else if (mqType === 'intrinsic') tempBasicInfo.selectedIntrinsicMQIds = currentSelection;
      tempBasicInfo.selectedArchetypeId = 'custom'; // Changing MQs always results in a custom archetype

      const potentialArchetypeCost = calculateCurrentArchetypeCost(tempBasicInfo);
      if (prev.archetypePointLimit !== undefined && potentialArchetypeCost > prev.archetypePointLimit) {
        toast({ title: "Archetype Limit Exceeded", description: `This Meta-Quality change would make the custom archetype cost ${potentialArchetypeCost}pts, exceeding the limit of ${prev.archetypePointLimit}.`, variant: "destructive" });
        return prev; // Revert
      }

      // If cost is fine, proceed with actual update
      const newBasicInfo = { ...prev.basicInfo };
      let currentActualSelection: string[] = [];
      let newWillpower = { ...prev.willpower };
      let newInhumanStatsSettings = prev.basicInfo.inhumanStatsSettings || 
        ALL_STATS.reduce((acc, statName) => {
            acc[statName] = { condition: 'normal' };
            return acc;
        }, {} as InhumanStatsSettings);

      if (mqType === 'source') currentActualSelection = [...newBasicInfo.selectedSourceMQIds];
      else if (mqType === 'permission') currentActualSelection = [...newBasicInfo.selectedPermissionMQIds];
      else if (mqType === 'intrinsic') currentActualSelection = [...newBasicInfo.selectedIntrinsicMQIds];

      let updatedMiracles = [...prev.miracles];

      if (isSelected) {
        if (!currentActualSelection.includes(mqId)) {
          currentActualSelection.push(mqId);
           if (mqType === 'intrinsic' && mqId === 'mandatory_power') {
                const currentCount = newBasicInfo.intrinsicMandatoryPowerConfig[mqId]?.count || 0;
                updatedMiracles = handleMetaQualityConfigChange(mqId, 'intrinsicMandatoryPowerConfig', 'count', currentCount, updatedMiracles, false, newBasicInfo.selectedArchetypeId) as MiracleDefinition[];
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
                 if (intrinsicDef.id === 'mandatory_power') {
                    updatedMiracles = handleMetaQualityConfigChange(mqId, 'intrinsicMandatoryPowerConfig', 'count', 0, updatedMiracles, false, newBasicInfo.selectedArchetypeId) as MiracleDefinition[];
                }
            }
            if (mqId === 'no_base_will' && newBasicInfo.selectedIntrinsicMQIds.includes('no_willpower')) {
                // No change needed here
            } else if (mqId === 'no_willpower' && newBasicInfo.selectedIntrinsicMQIds.includes('no_base_will')){
                 newWillpower.purchasedWill = 0; 
            }
            if (newBasicInfo.selectedArchetypeId === 'godlike_talent' && mqId === 'mandatory_power') { // This check seems redundant as archetype becomes custom
                updatedMiracles = updatedMiracles.filter(m => m.definitionId !== 'perceive_godlike_talents');
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

      return { ...prev, basicInfo: {...newBasicInfo, inhumanStatsSettings: newInhumanStatsSettings }, willpower: newWillpower, miracles: updatedMiracles };
    });
  };
  
 const handleMetaQualityConfigChange = (
    metaQualityId: string, 
    configKey: keyof Omit<BasicInfo, 'name'|'motivations'|'selectedArchetypeId'|'selectedSourceMQIds'|'selectedPermissionMQIds'|'selectedIntrinsicMQIds'>,
    fieldOrStatName: string, 
    valueOrSubField: any, 
    currentMiraclesParam?: MiracleDefinition[],
    calledFromArchetypeChange?: boolean,
    archetypeIdForContext?: string
  ): MiracleDefinition[] | CharacterData => {
    let finalMiracles: MiracleDefinition[] | undefined = undefined;

    setCharacterData(prev => {
        // Create a temporary newBasicInfo to calculate potential cost for intrinsics
        const tempNewBasicInfo = JSON.parse(JSON.stringify(prev.basicInfo)); // Deep clone
        if (configKey !== 'inhumanStatsSettings') {
            // @ts-ignore
            tempNewBasicInfo[configKey] = {
                // @ts-ignore
                ...(prev.basicInfo[configKey] || {}),
                [metaQualityId]: {
                    // @ts-ignore
                    ...(prev.basicInfo[configKey]?.[metaQualityId] || {}),
                    [fieldOrStatName]: valueOrSubField,
                }
            };
        } else { // For inhumanStatsSettings
            const statName = fieldOrStatName as keyof CharacterData['stats'];
            const { field: subField, value: subValue } = valueOrSubField as { field: keyof InhumanStatSetting, value: any };
            tempNewBasicInfo.inhumanStatsSettings = {
                ...(tempNewBasicInfo.inhumanStatsSettings || {}),
                [statName]: {
                    ...(tempNewBasicInfo.inhumanStatsSettings?.[statName] || { condition: 'normal' }),
                    [subField]: subValue,
                }
            };
            if (subField === 'condition' && subValue !== 'inferior') { // @ts-ignore
                delete tempNewBasicInfo.inhumanStatsSettings[statName].inferiorMaxDice;
            }
            if (subField === 'condition' && subValue === 'inferior' && !tempNewBasicInfo.inhumanStatsSettings?.[statName]?.inferiorMaxDice) { // @ts-ignore
                tempNewBasicInfo.inhumanStatsSettings[statName].inferiorMaxDice = 4;
            }
        }
        
        // If this MQ change makes the archetype custom, check its cost
        const archetypeIdForCostCheck = calledFromArchetypeChange ? archetypeIdForContext : 'custom';
        const basicInfoForCostCheck = { ...tempNewBasicInfo, selectedArchetypeId: archetypeIdForCostCheck };
        
        const potentialArchetypeCost = calculateCurrentArchetypeCost(basicInfoForCostCheck);

        if (prev.archetypePointLimit !== undefined && potentialArchetypeCost > prev.archetypePointLimit) {
            toast({ title: "Archetype Limit Exceeded", description: `This Meta-Quality configuration change would make the archetype cost ${potentialArchetypeCost}pts, exceeding the limit of ${prev.archetypePointLimit}.`, variant: "destructive" });
            if (calledFromArchetypeChange && finalMiracles) return finalMiracles; // Special handling for archetype change
            return prev; // Revert
        }


        // If cost is fine, proceed with actual update
        const miraclesToUpdate = currentMiraclesParam || prev.miracles;
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


      let updatedMiracles = [...miraclesToUpdate];

      if (configKey === 'intrinsicMandatoryPowerConfig' && fieldOrStatName === 'count') {
          const newCount = Math.max(0, Number(valueOrSubField) || 0);
          const currentArchetypeForContext = archetypeIdForContext || prev.basicInfo.selectedArchetypeId;
          
          const mandatoryMiraclesForThisIntrinsic = updatedMiracles.filter(m => 
            m.isMandatory && 
            (
              m.definitionId?.startsWith(`archetype-mandatory-${metaQualityId}-`) || 
              (currentArchetypeForContext === 'godlike_talent' && m.definitionId === 'perceive_godlike_talents' && metaQualityId === 'mandatory_power')
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
                                dice: '0D', 
                                hardDice: '2HD', 
                                wiggleDice: '0WD',
                                qualities: template.qualities.map(tq => ({ 
                                  ...tq,
                                  id: `quality-instance-pgt-${Date.now()}-${i}-${Math.random().toString(36).substring(2)}`,
                                  extras: tq.extras.map(tex => ({
                                    ...tex,
                                    id: `extra-instance-pgt-${Date.now()}-${i}-${Math.random().toString(36).substring(2)}`,
                                  })),
                                  flaws: tq.flaws.map(tfl => ({
                                    ...tfl,
                                    id: `flaw-instance-pgt-${Date.now()}-${i}-${Math.random().toString(36).substring(2)}`,
                                  })),
                                })),
                                isCustom: false, 
                                isMandatory: true,
                            };
                        }
                      }
                  }
                  
                  if (!newMandatoryMiracle) { 
                      newMandatoryMiracle = {
                          id: `miracle-archetype-mandatory-${metaQualityId}-${Date.now()}-${i}`,
                          definitionId: `archetype-mandatory-${metaQualityId}-${Date.now()}-${i}`, 
                          name: `Mandatory Power (${INTRINSIC_META_QUALITIES.find(imq=>imq.id===metaQualityId)?.label || 'Intrinsic'})`,
                          dice: '1D',
                          hardDice: '0HD',
                          wiggleDice: '0WD',
                          qualities: [],
                          description: `This power is mandated by the ${INTRINSIC_META_QUALITIES.find(imq=>imq.id===metaQualityId)?.label || 'selected'} intrinsic.`,
                          isCustom: true, 
                          isMandatory: true,
                      };
                  }
                  if (newMandatoryMiracle) { 
                    updatedMiracles.push(newMandatoryMiracle);
                  }
              }
          } else if (difference < 0) { 
              const miraclesToRemoveCount = Math.abs(difference);
              let removedCount = 0;
              updatedMiracles = updatedMiracles.filter(m => {
                  const isPGTForGodlike = currentArchetypeForContext === 'godlike_talent' && m.definitionId === 'perceive_godlike_talents' && metaQualityId === 'mandatory_power';
                  const isGenericMandatoryForIntrinsic = m.definitionId?.startsWith(`archetype-mandatory-${metaQualityId}-`);

                  if (m.isMandatory && (isPGTForGodlike || isGenericMandatoryForIntrinsic) && removedCount < miraclesToRemoveCount) {
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
      return { ...prev, basicInfo: newBasicInfo, miracles: inhumanStatsUpdate ? prev.miracles : updatedMiracles };
    });

    return finalMiracles || []; 
  };


  const handleStatChange = (
    statName: keyof CharacterData['stats'],
    dieType: keyof StatDetail,
    value: string
  ) => {
    setCharacterData(prev => {
      const discardedAttr = getDiscardedAttributeFromBasicInfo(prev.basicInfo);
      const currentTotalStatCost = calculateTotalStatPoints(prev.stats, discardedAttr);
      const costOfStatBeingChanged = calculateSingleStatPoints(prev.stats[statName], statName, discardedAttr);
      
      const potentialNewStatDetail = { ...prev.stats[statName], [dieType]: value };
      const costOfPotentialNewStat = calculateSingleStatPoints(potentialNewStatDetail, statName, discardedAttr);
      
      const potentialNewTotalStatCost = currentTotalStatCost - costOfStatBeingChanged + costOfPotentialNewStat;

      if (prev.statPointLimit !== undefined && potentialNewTotalStatCost > prev.statPointLimit) {
        toast({ title: "Stat Limit Exceeded", description: `Changing ${statName} would make total stat cost ${potentialNewTotalStatCost}pts, exceeding the limit of ${prev.statPointLimit}.`, variant: "destructive" });
        return prev;
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          [statName]: potentialNewStatDetail,
        },
      };
    });
  };

  const handleWillpowerChange = (field: keyof CharacterData['willpower'], value: number) => {
    setCharacterData(prev => {
      const hasNoBaseWillIntrinsic = prev.basicInfo.selectedIntrinsicMQIds.includes('no_base_will');
      const hasNoWillpowerIntrinsic = prev.basicInfo.selectedIntrinsicMQIds.includes('no_willpower');
      let processedValue = isNaN(value) ? 0 : Math.max(0, value);

      if (field === 'purchasedBaseWill' && hasNoBaseWillIntrinsic) processedValue = 0;
      if (field === 'purchasedWill' && (hasNoBaseWillIntrinsic || hasNoWillpowerIntrinsic)) processedValue = 0;

      const tempWillpower = { ...prev.willpower, [field]: processedValue };
      const potentialWillpowerCost = calculateTotalWillpowerPoints(
        tempWillpower.purchasedBaseWill,
        tempWillpower.purchasedWill,
        hasNoBaseWillIntrinsic,
        hasNoWillpowerIntrinsic
      );

      if (prev.willpowerPointLimit !== undefined && potentialWillpowerCost > prev.willpowerPointLimit) {
        toast({ title: "Willpower Limit Exceeded", description: `This change would make Willpower cost ${potentialWillpowerCost}pts, exceeding the limit of ${prev.willpowerPointLimit}.`, variant: "destructive" });
        return prev;
      }
      
      return {
        ...prev,
        willpower: tempWillpower,
      };
    });
  };

  const handleAddSkill = (skillDef: PredefinedSkillDef) => {
    setCharacterData(prev => {
      const newSkillCost = calculateSingleSkillPoints({
        id: '', definitionId: '', name: '', baseName: '', linkedAttribute: skillDef.linkedAttribute, description: '',
        dice: '1D', hardDice: '0HD', wiggleDice: '0WD', isCustom: false
      });
      const currentTotalSkillCost = calculateTotalSkillPoints(prev.skills);
      if (prev.skillPointLimit !== undefined && (currentTotalSkillCost + newSkillCost) > prev.skillPointLimit) {
        toast({ title: "Skill Limit Exceeded", description: `Adding this skill would exceed the Skill Point Limit of ${prev.skillPointLimit}.`, variant: "destructive" });
        return prev;
      }

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
      return { ...prev, skills: [...prev.skills, newSkillInstance] };
    });
  };

  const handleAddCustomSkill = () => {
    setCharacterData(prev => {
      const newSkillCost = calculateSingleSkillPoints({
        id: '', definitionId: '', name: '', baseName: '', linkedAttribute: 'body', description: '',
        dice: '1D', hardDice: '0HD', wiggleDice: '0WD', isCustom: true
      });
      const currentTotalSkillCost = calculateTotalSkillPoints(prev.skills);
      if (prev.skillPointLimit !== undefined && (currentTotalSkillCost + newSkillCost) > prev.skillPointLimit) {
        toast({ title: "Skill Limit Exceeded", description: `Adding a custom skill would exceed the Skill Point Limit of ${prev.skillPointLimit}.`, variant: "destructive" });
        return prev;
      }
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
      return { ...prev, skills: [...prev.skills, newCustomSkill] };
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
    setCharacterData(prev => {
      const currentTotalSkillCost = calculateTotalSkillPoints(prev.skills);
      const skillBeingChanged = prev.skills.find(s => s.id === skillId);
      if (!skillBeingChanged) return prev;

      const costOfSkillBeingChanged = calculateSingleSkillPoints(skillBeingChanged);
      const tempSkill = { ...skillBeingChanged, [field]: value };
      // If name changed for custom skill, update baseName. If typeSpec changed, update name.
      if (field === 'typeSpecification' && tempSkill.hasType) {
        tempSkill.name = `${tempSkill.baseName}${value ? ` (${value})` : ' (Unspecified)'}`;
      }
      if (field === 'name' && tempSkill.isCustom) {
         tempSkill.baseName = value as string;
      }

      const costOfPotentialNewSkill = calculateSingleSkillPoints(tempSkill);
      const potentialNewTotalSkillCost = currentTotalSkillCost - costOfSkillBeingChanged + costOfPotentialNewSkill;

      if (prev.skillPointLimit !== undefined && potentialNewTotalSkillCost > prev.skillPointLimit) {
        toast({ title: "Skill Limit Exceeded", description: `This skill change would make total skill cost ${potentialNewTotalSkillCost}pts, exceeding the limit of ${prev.skillPointLimit}.`, variant: "destructive" });
        return prev;
      }
      
      return {
        ...prev,
        skills: prev.skills.map(skill => skill.id === skillId ? tempSkill : skill),
      };
    });
  };

  const withMiracleCostCheck = (
    miracleUpdater: (prev: CharacterData) => CharacterData 
  ): ((prev: CharacterData) => CharacterData) => {
    return (prev: CharacterData) => {
      const potentialNextState = miracleUpdater(prev);
      const potentialMiracleCost = calculateTotalMiraclePoints(potentialNextState.miracles, potentialNextState.skills);
      
      if (prev.miraclePointLimit !== undefined && potentialMiracleCost > prev.miraclePointLimit) {
        toast({ title: "Miracle Limit Exceeded", description: `This change would make total miracle cost ${potentialMiracleCost}pts, exceeding the limit of ${prev.miraclePointLimit}.`, variant: "destructive"});
        return prev; // Revert
      }
      return potentialNextState;
    };
  };

  const handleAddMiracle = (type: 'custom' | string) => {
    setCharacterData(withMiracleCostCheck(prev => {
      let newMiracle: MiracleDefinition;
      if (type === 'custom') {
        newMiracle = {
          id: `miracle-${Date.now()}`,
          name: 'New Custom Miracle',
          dice: '1D', hardDice: '0HD', wiggleDice: '0WD', qualities: [],
          description: 'Custom miracle description.', isCustom: true, isMandatory: false,
        };
      } else {
        const template = PREDEFINED_MIRACLES_TEMPLATES.find(m => m.definitionId === type);
        if (!template) return prev;
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
      return { ...prev, miracles: [...prev.miracles, newMiracle] };
    }));
  };

  const handleRemoveMiracle = (miracleId: string) => {
     const miracleToRemove = characterData.miracles.find(m => m.id === miracleId);
     const isIntrinsicMandatedUnremovable = miracleToRemove && miracleToRemove.isMandatory && 
        (miracleToRemove.definitionId?.startsWith('archetype-mandatory-') || 
         (characterData.basicInfo.selectedArchetypeId === 'godlike_talent' && miracleToRemove.definitionId === 'perceive_godlike_talents'));

     if (isIntrinsicMandatedUnremovable) {
        toast({ title: "Cannot remove intrinsic-mandated miracle", description: "This miracle's existence is tied to an archetype or intrinsic setting.", variant: "destructive"});
        return;
    }
    // Cost check not strictly needed for removal, but good practice for consistency if logic changes
    setCharacterData(withMiracleCostCheck(prev => ({
      ...prev,
      miracles: prev.miracles.filter(m => m.id !== miracleId),
    })));
  };

  const handleMiracleChange = (miracleId: string, field: keyof MiracleDefinition, value: any) => {
     const miracle = characterData.miracles.find(m => m.id === miracleId);
     const isIntrinsicMandatedUnremovable = miracle && miracle.isMandatory && 
        (miracle.definitionId?.startsWith('archetype-mandatory-') || 
         (characterData.basicInfo.selectedArchetypeId === 'godlike_talent' && miracle.definitionId === 'perceive_godlike_talents'));

     if (isIntrinsicMandatedUnremovable && field === 'isMandatory' && !value) {
       toast({ title: "Cannot change mandatory status", description: "This miracle is mandated by an archetype intrinsic or specific archetype rule.", variant: "destructive"});
       return;
     }

    setCharacterData(withMiracleCostCheck(prev => ({
      ...prev,
      miracles: prev.miracles.map(m => m.id === miracleId ? { ...m, [field]: value } : m),
    })));
  };

  const handleAddMiracleQuality = (miracleId: string) => {
    setCharacterData(withMiracleCostCheck(prev => {
      const newQuality: MiracleQuality = {
        id: `quality-${Date.now()}`, type: 'useful', capacity: 'touch', levels: 0, extras: [], flaws: [],
      };
      return {
        ...prev,
        miracles: prev.miracles.map(m =>
          m.id === miracleId ? { ...m, qualities: [...m.qualities, newQuality] } : m
        ),
      };
    }));
  };

  const handleRemoveMiracleQuality = (miracleId: string, qualityId: string) => {
    setCharacterData(withMiracleCostCheck(prev => ({
      ...prev,
      miracles: prev.miracles.map(m =>
        m.id === miracleId ? { ...m, qualities: m.qualities.filter(q => q.id !== qualityId) } : m
      ),
    })));
  };

  const handleMiracleQualityChange = (
    miracleId: string,
    qualityId: string,
    field: keyof MiracleQuality,
    value: any
  ) => {
    setCharacterData(withMiracleCostCheck(prev => ({
      ...prev,
      miracles: prev.miracles.map(m =>
        m.id === miracleId ? {
          ...m,
          qualities: m.qualities.map(q => {
            if (q.id === qualityId) {
              let processedValue = value;
              if (field === 'levels') {
                const numericValue = Number(value);
                processedValue = Math.max(0, isNaN(numericValue) ? 0 : numericValue);
              }
              return { ...q, [field]: processedValue };
            }
            return q;
          })
        } : m
      ),
    })));
  };

  const handleAddExtraOrFlawToQuality = (
    miracleId: string,
    qualityId: string,
    itemType: 'extra' | 'flaw',
    definitionId?: string
  ) => {
    setCharacterData(withMiracleCostCheck(prev => {
      let newItem: AppliedExtraOrFlaw;
      if (definitionId) {
        const collection = itemType === 'extra' ? PREDEFINED_EXTRAS : PREDEFINED_FLAWS;
        const definition = collection.find(item => item.id === definitionId);
        if (!definition) return prev;
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
      return {
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
      };
    }));
  };

  const handleRemoveExtraOrFlawFromQuality = (
    miracleId: string,
    qualityId: string,
    itemType: 'extra' | 'flaw',
    itemId: string
  ) => {
    setCharacterData(withMiracleCostCheck(prev => ({
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
    })));
  };

  const handleExtraOrFlawChange = (
    miracleId: string,
    qualityId: string,
    itemType: 'extra' | 'flaw',
    itemId: string,
    field: keyof AppliedExtraOrFlaw,
    value: string | number
  ) => {
     setCharacterData(withMiracleCostCheck(prev => ({
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
    })));
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
  
    setCharacterData(prev => {
      const { 
        pointLimit, archetypePointLimit, statPointLimit, 
        skillPointLimit, willpowerPointLimit, miraclePointLimit 
      } = prev;
  
      let sumOfOtherSubLimits = 0;
      if (limitType !== 'archetype') sumOfOtherSubLimits += (archetypePointLimit || 0);
      if (limitType !== 'stat') sumOfOtherSubLimits += (statPointLimit || 0);
      if (limitType !== 'willpower') sumOfOtherSubLimits += (willpowerPointLimit || 0);
      if (limitType !== 'skill') sumOfOtherSubLimits += (skillPointLimit || 0);
      if (limitType !== 'miracle') sumOfOtherSubLimits += (miraclePointLimit || 0);
  
      const overallLimit = pointLimit || 0; 
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
      // @ts-ignore
      return { ...prev, [`${limitType}PointLimit`]: finalNewSubLimitValue };
    });
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

        const validatedData: CharacterData = {
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
        
        if (validatedData.basicInfo.selectedIntrinsicMQIds.includes('no_base_will')) {
            validatedData.willpower.purchasedBaseWill = 0;
            validatedData.willpower.purchasedWill = 0;
        } else if (validatedData.basicInfo.selectedIntrinsicMQIds.includes('no_willpower')) {
            validatedData.willpower.purchasedWill = 0;
        }

        setCharacterData(validatedData);
        toast({ title: "Character Loaded", description: "Character data has been loaded from local storage." });
      } else {
        toast({ title: "No Saved Data", description: "No character data found in local storage.", variant: "destructive" });
        setCharacterData(initialCharacterData);
      }
    } catch (error) {
      console.error("Failed to load character:", error);
      toast({ title: "Load Error", description: `Could not load character data. ${error instanceof Error ? error.message : 'Unknown error.'}`, variant: "destructive" });
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
  const discardedAttribute = getDiscardedAttributeFromBasicInfo(characterData.basicInfo);

  const calculateStatValue = (statName: keyof CharacterData['stats'], stat: StatDetail | undefined): number => {
    if (!stat || discardedAttribute === statName) return 0;
    return (parseInt(stat.dice.replace('D',''), 10) || 0) +
           (parseInt(stat.hardDice.replace('HD',''), 10) || 0) +
           (parseInt(stat.wiggleDice.replace('WD',''), 10) || 0);
  }

  const charmValue = calculateStatValue('charm', characterData.stats.charm);
  const commandValue = calculateStatValue('command', characterData.stats.command);
  
  let rawCalculatedBaseWillFromStats = charmValue + commandValue;
  if (discardedAttribute === 'charm') rawCalculatedBaseWillFromStats -= charmValue; 
  if (discardedAttribute === 'command') rawCalculatedBaseWillFromStats -= commandValue; 
  
  const hasNoBaseWillIntrinsic = characterData.basicInfo.selectedIntrinsicMQIds.includes('no_base_will');
  const displayCalculatedBaseWillFromStats = hasNoBaseWillIntrinsic ? 0 : rawCalculatedBaseWillFromStats;
  
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
                <GmToolsTabContent />
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
  

    

    




    



