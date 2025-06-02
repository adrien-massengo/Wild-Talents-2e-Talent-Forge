
// src/components/tabs/character-tab-content.tsx
"use client";

import type { CharacterData, StatDetail, SkillInstance, BasicInfo, MotivationObject } from "@/app/page";
import type { AttributeName, SkillDefinition as PredefinedSkillDef } from "@/lib/skills-definitions";
import { SKILL_DEFINITIONS } from "@/lib/skills-definitions";
import type { MiracleDefinition, MiracleQuality, AppliedExtraOrFlaw, MiracleQualityType, MiracleCapacityType, PredefinedExtraOrFlaw } from "@/lib/miracles-definitions";
import { PREDEFINED_MIRACLES_TEMPLATES, POWER_QUALITY_DEFINITIONS, POWER_CAPACITY_OPTIONS, PREDEFINED_EXTRAS, PREDEFINED_FLAWS, getDynamicPowerQualityDefinitions } from "@/lib/miracles-definitions";
import {
  ARCHETYPES, SOURCE_META_QUALITIES, PERMISSION_META_QUALITIES, INTRINSIC_META_QUALITIES,
  ALLERGY_SUBSTANCES, ALLERGY_EFFECTS,
  type IntrinsicMetaQuality, type SourceMetaQuality, type PermissionMetaQuality,
  type AllergySubstanceType, type AllergyEffectType, type BruteFrailType, type DiscardedAttributeType
} from "@/lib/character-definitions";


import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle, ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface CharacterTabContentProps {
  characterData: CharacterData;
  onBasicInfoChange: (field: keyof Omit<BasicInfo, 'motivations'>, value: any) => void;
  onAddMotivation: () => void;
  onRemoveMotivation: (motivationId: string) => void;
  onMotivationChange: (motivationId: string, field: keyof MotivationObject, value: any) => void;
  uninvestedBaseWill: number;
  totalBaseWill: number;
  totalWill: number;
  calculatedBaseWillFromStats: number;
  onMQSelectionChange: (mqType: 'source' | 'permission' | 'intrinsic', mqId: string, isSelected: boolean) => void;
  onIntrinsicConfigChange: (intrinsicId: string, configKey: keyof Omit<BasicInfo, 'name'|'motivations'|'selectedArchetypeId'|'selectedSourceMQIds'|'selectedPermissionMQIds'|'selectedIntrinsicMQIds'>, field: string, value: any, currentMiracles?: MiracleDefinition[], calledFromArchetypeChange?: boolean, newArchetypeIdForContext?: string) => void;
  onStatChange: (statName: keyof CharacterData['stats'], dieType: keyof StatDetail, value: string) => void;
  onWillpowerChange: (field: keyof CharacterData['willpower'], value: number) => void;
  onAddSkill: (skillDef: PredefinedSkillDef) => void;
  onAddCustomSkill: () => void;
  onRemoveSkill: (skillId: string) => void;
  onSkillChange: (skillId: string, field: keyof SkillInstance, value: string | AttributeName) => void;

  onAddMiracle: (type: 'custom' | string) => void;
  onRemoveMiracle: (miracleId: string) => void;
  onMiracleChange: (miracleId: string, field: keyof MiracleDefinition, value: any) => void;
  onAddMiracleQuality: (miracleId: string) => void;
  onRemoveMiracleQuality: (miracleId: string, qualityId: string) => void;
  onMiracleQualityChange: (miracleId: string, qualityId: string, field: keyof MiracleQuality, value: any) => void;
  onAddExtraOrFlawToQuality: (miracleId: string, qualityId: string, itemType: 'extra' | 'flaw', definitionId?: string) => void;
  onRemoveExtraOrFlawFromQuality: (miracleId: string, qualityId: string, itemType: 'extra' | 'flaw', itemId: string) => void;
  onExtraOrFlawChange: (miracleId: string, qualityId: string, itemType: 'extra' | 'flaw', itemId: string, field: keyof AppliedExtraOrFlaw, value: string | number) => void;
  discardedAttribute?: DiscardedAttributeType;
}

interface StatDefinition {
  name: keyof CharacterData['stats'];
  label: string;
  description: string;
}

const statsDefinitions: StatDefinition[] = [
  { name: 'body', label: 'Body', description: 'Hand-to-hand combat is governed by the Body Stat, which measures sheer physical power and the ability to use it. With high Body you can lift more, hit harder and run faster than someone with low Body.' },
  { name: 'coordination', label: 'Coordination', description: 'Coordination measures hand-eye coordination, reflexes and how well you control and maneuver your body.' },
  { name: 'sense', label: 'Sense', description: 'The Sense Stat indicates how observant you are. With a high Sense Stat you have keen hearing, clear vision, and a better-than-average shot at noticing that funny burnt-almond odor before eating the poisoned date. With a low Sense you are nearsighted, hard of hearing, or generally oblivious to your surroundings.' },
  { name: 'mind', label: 'Mind', description: 'The Mind Stat measures your natural intellect. With a high Mind Stat you have a better memory, quicker math skills, and a better grasp of abstract concepts than someone with a low Mind Stat.' },
  { name: 'charm', label: 'Charm', description: 'The Charm Stat measures charisma, influence and diplomacy. Beauty is often a part of high Charm, but not always; there are plenty of people who are physically unimpressive but terrifically charming. With high Charm you easily draw attention, dominate conversations, sway opinions, and persuade others to see things your way.' },
  { name: 'command', label: 'Command', description: 'The Command Stat measures your force of personality, your capacity for leadership, and your composure in the face of crisis. With high Command you remain uncracked under great pressure and people instinctively listen to you in a crisis.' },
];

const attributeNames: AttributeName[] = ['body', 'coordination', 'sense', 'mind', 'charm', 'command'];

export const calculateMiracleQualityCost = (quality: MiracleQuality, miracle: MiracleDefinition, allPowerQualityDefinitions: ReturnType<typeof getDynamicPowerQualityDefinitions>): number => {
  const NDice = parseInt(miracle.dice.replace('D', '')) || 0;
  const HDice = parseInt(miracle.hardDice.replace('HD', '')) || 0;
  const WDice = parseInt(miracle.wiggleDice.replace('WD', '')) || 0;

  const qualityDef = allPowerQualityDefinitions.find(def => def.key === quality.type);
  if (!qualityDef) return 0;

  const baseCostFactor = qualityDef.baseCostFactor;
  let totalExtrasCostModifier = quality.extras.reduce((sum, ex) => sum + ex.costModifier, 0);
  let totalFlawsCostModifier = quality.flaws.reduce((sum, fl) => sum + fl.costModifier, 0);

  const effectiveCostModifier = quality.levels + totalExtrasCostModifier + totalFlawsCostModifier;
  
  const perNormalDieCostFactor = baseCostFactor + effectiveCostModifier;
  const costND = NDice > 0 ? NDice * Math.max(1, perNormalDieCostFactor) : 0;

  const perHardDieCostFactor = (baseCostFactor * 2) + effectiveCostModifier;
  const costHD = HDice * Math.max(0, perHardDieCostFactor);

  const perWiggleDieCostFactor = (baseCostFactor * 4) + effectiveCostModifier;
  const costWD = WDice * Math.max(0, perWiggleDieCostFactor);

  return costND + costHD + costWD;
};

export const calculateMiracleTotalCost = (miracle: MiracleDefinition, skills: SkillInstance[]): number => {
  if (miracle.isMandatory) return 0;
  const dynamicPqDefs = getDynamicPowerQualityDefinitions(skills);
  return miracle.qualities.reduce((sum, quality) => sum + calculateMiracleQualityCost(quality, miracle, dynamicPqDefs), 0);
};

interface MQCollapsibleProps {
  title: string;
  mqList: (SourceMetaQuality | PermissionMetaQuality | IntrinsicMetaQuality)[];
  selectedMQIds: string[];
  onMQSelectionChange: (mqId: string, isSelected: boolean) => void;
  basicInfo: BasicInfo;
  onIntrinsicConfigChange: CharacterTabContentProps['onIntrinsicConfigChange'];
  mqType: 'source' | 'permission' | 'intrinsic';
}

const MetaQualityCollapsible: React.FC<MQCollapsibleProps> = ({
  title, mqList, selectedMQIds, onMQSelectionChange, basicInfo, onIntrinsicConfigChange, mqType
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="bg-card/50 shadow-sm">
      <CardHeader
        className="flex flex-row items-center justify-between p-3 cursor-pointer hover:bg-accent/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-lg font-headline">{title}</CardTitle>
        {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </CardHeader>
      {isOpen && (
        <CardContent className="p-3 space-y-3">
          {mqList.map(mq => (
            <div key={mq.id} className="p-2 border rounded-md bg-background/70">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${mqType}-${mq.id}`}
                  checked={selectedMQIds.includes(mq.id)}
                  onCheckedChange={(checked) => onMQSelectionChange(mq.id, !!checked)}
                />
                <Label htmlFor={`${mqType}-${mq.id}`} className="text-sm font-medium flex-grow">
                  {mq.label} ({typeof mq.points === 'function' ? 'Var' : mq.points} Pts)
                </Label>
              </div>
              {selectedMQIds.includes(mq.id) && (
                <div className="mt-2 pl-6 text-xs space-y-2">
                  <p className="text-muted-foreground">{mq.description}</p>
                  {mqType === 'intrinsic' && (mq as IntrinsicMetaQuality).configKey && (
                    <div className="p-2 border rounded-md bg-muted/30 space-y-2">
                      <h5 className="text-xs font-semibold">Configuration:</h5>
                      {(mq as IntrinsicMetaQuality).configKey === 'intrinsicAllergyConfig' && (
                        <>
                          <div>
                            <Label htmlFor={`${mq.id}-allergySubstance`} className="text-xs">Allergy Substance</Label>
                            <Select
                               // @ts-ignore
                              value={basicInfo.intrinsicAllergyConfig[mq.id]?.substance}
                              onValueChange={(val) => onIntrinsicConfigChange(mq.id, 'intrinsicAllergyConfig', 'substance', val as AllergySubstanceType)}
                            >
                              <SelectTrigger id={`${mq.id}-allergySubstance`} className="h-8 text-xs"><SelectValue placeholder="Select substance..."/></SelectTrigger>
                              <SelectContent>
                                {ALLERGY_SUBSTANCES.map(s => <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`${mq.id}-allergyEffect`} className="text-xs">Allergy Effect</Label>
                            <Select
                               // @ts-ignore
                              value={basicInfo.intrinsicAllergyConfig[mq.id]?.effect}
                              onValueChange={(val) => onIntrinsicConfigChange(mq.id, 'intrinsicAllergyConfig', 'effect', val as AllergyEffectType)}
                            >
                              <SelectTrigger id={`${mq.id}-allergyEffect`} className="h-8 text-xs"><SelectValue placeholder="Select effect..."/></SelectTrigger>
                              <SelectContent>
                                {ALLERGY_EFFECTS.map(e => <SelectItem key={e.value} value={e.value} className="text-xs">{e.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      {(mq as IntrinsicMetaQuality).configKey === 'intrinsicBruteFrailConfig' && (
                        <div>
                          <Label className="text-xs">Type</Label>
                          <RadioGroup
                             // @ts-ignore
                            value={basicInfo.intrinsicBruteFrailConfig[mq.id]?.type}
                            onValueChange={(val) => onIntrinsicConfigChange(mq.id, 'intrinsicBruteFrailConfig', 'type', val as BruteFrailType)}
                            className="flex space-x-3 mt-1"
                          >
                            <div className="flex items-center space-x-1"><RadioGroupItem value="brute" id={`${mq.id}-brute`} className="h-3 w-3"/><Label htmlFor={`${mq.id}-brute`} className="text-xs font-normal">Brute</Label></div>
                            <div className="flex items-center space-x-1"><RadioGroupItem value="frail" id={`${mq.id}-frail`} className="h-3 w-3"/><Label htmlFor={`${mq.id}-frail`} className="text-xs font-normal">Frail</Label></div>
                          </RadioGroup>
                        </div>
                      )}
                      {(mq as IntrinsicMetaQuality).configKey === 'intrinsicCustomStatsConfig' && (
                        <div>
                          <Label className="text-xs">Discard Attribute</Label>
                          <RadioGroup
                             // @ts-ignore
                            value={basicInfo.intrinsicCustomStatsConfig[mq.id]?.discardedAttribute}
                            onValueChange={(val) => onIntrinsicConfigChange(mq.id, 'intrinsicCustomStatsConfig', 'discardedAttribute', val as DiscardedAttributeType)}
                            className="mt-1 space-y-1"
                          >
                            {(mq as IntrinsicMetaQuality).customStatsDiscardOptions?.map(opt => (
                              <div key={opt.value} className="flex items-center space-x-1">
                                <RadioGroupItem value={opt.value} id={`${mq.id}-cs-${opt.value}`} className="h-3 w-3"/>
                                <Label htmlFor={`${mq.id}-cs-${opt.value}`} className="text-xs font-normal">{opt.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                           {// @ts-ignore
                           basicInfo.intrinsicCustomStatsConfig[mq.id]?.discardedAttribute && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                  {// @ts-ignore
                                  (mq as IntrinsicMetaQuality).customStatsDiscardOptions?.find(opt => opt.value === basicInfo.intrinsicCustomStatsConfig[mq.id]?.discardedAttribute)?.description}
                              </p>
                          )}
                        </div>
                      )}
                      {(mq as IntrinsicMetaQuality).configKey === 'intrinsicMandatoryPowerConfig' && (
                        <div>
                          <Label htmlFor={`${mq.id}-mandatoryPowerCount`} className="text-xs">Number of Mandatory Powers</Label>
                          <Input
                            id={`${mq.id}-mandatoryPowerCount`} type="number" min="0"
                             // @ts-ignore
                            value={basicInfo.intrinsicMandatoryPowerConfig[mq.id]?.count ?? 0}
                            onChange={(e) => onIntrinsicConfigChange(mq.id, 'intrinsicMandatoryPowerConfig', 'count', parseInt(e.target.value) || 0)}
                            className="w-16 h-8 mt-1 text-xs"
                          />
                        </div>
                      )}
                      {(mq as IntrinsicMetaQuality).configKey === 'intrinsicVulnerableConfig' && (
                         <div>
                          <Label htmlFor={`${mq.id}-vulnerableExtraBoxes`} className="text-xs">Number of Extra Brain Boxes</Label>
                          <Input
                            id={`${mq.id}-vulnerableExtraBoxes`} type="number" min="0"
                             // @ts-ignore
                            value={basicInfo.intrinsicVulnerableConfig[mq.id]?.extraBoxes ?? 0}
                            onChange={(e) => onIntrinsicConfigChange(mq.id, 'intrinsicVulnerableConfig', 'extraBoxes', parseInt(e.target.value) || 0)}
                            className="w-16 h-8 mt-1 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
};


export function CharacterTabContent({
  characterData,
  onBasicInfoChange,
  onAddMotivation,
  onRemoveMotivation,
  onMotivationChange,
  uninvestedBaseWill,
  totalBaseWill,
  totalWill,
  calculatedBaseWillFromStats,
  onMQSelectionChange,
  onIntrinsicConfigChange,
  onStatChange,
  onWillpowerChange,
  onAddSkill,
  onAddCustomSkill,
  onRemoveSkill,
  onSkillChange,
  onAddMiracle,
  onRemoveMiracle,
  onMiracleChange,
  onAddMiracleQuality,
  onRemoveMiracleQuality,
  onMiracleQualityChange,
  onAddExtraOrFlawToQuality,
  onRemoveExtraOrFlawFromQuality,
  onExtraOrFlawChange,
  discardedAttribute,
}: CharacterTabContentProps) {

  const [selectedSkillToAdd, setSelectedSkillToAdd] = React.useState<string>("");
  const [selectedMiracleToAdd, setSelectedMiracleToAdd] = React.useState<string>("");
  const [selectedExtraToAdd, setSelectedExtraToAdd] = React.useState<{ [qualityId: string]: string }>({});
  const [selectedFlawToAdd, setSelectedFlawToAdd] = React.useState<{ [qualityId: string]: string }>({});

  const {
    canAddHyperskillQuality,
    canAddHyperstatQuality,
    canAddStandardMiracleQuality,
    canUseHardWiggleDiceForStats,
    canUseHardWiggleDiceForSkills
  } = React.useMemo(() => {
    const selectedPermissions = characterData.basicInfo.selectedPermissionMQIds;
    const hasHypertrained = selectedPermissions.includes('hypertrained');
    const hasOtherHyperskillPermission = [
      'inventor', 'one_power', 'power_theme', 'super_permission', 'super_equipment'
    ].some(id => selectedPermissions.includes(id));
    
    const canAddHS = hasHypertrained || hasOtherHyperskillPermission;
    const canAddHStat = ['prime_specimen', 'inventor', 'one_power', 'power_theme', 'super_permission', 'super_equipment'].some(id => selectedPermissions.includes(id));
    const canAddStandard = ['inventor', 'one_power', 'power_theme', 'super_permission', 'super_equipment'].some(id => selectedPermissions.includes(id));
    
    const canUseHardWiggleForStatsPerm = selectedPermissions.includes('inhuman_stats') || selectedPermissions.includes('peak_performer');
    const canUseHardWiggleForSkillsPerm = selectedPermissions.includes('peak_performer');
    
    return { 
      canAddHyperskillQuality: canAddHS, 
      canAddHyperstatQuality: canAddHStat, 
      canAddStandardMiracleQuality: canAddStandard,
      canUseHardWiggleDiceForStats: canUseHardWiggleForStatsPerm,
      canUseHardWiggleDiceForSkills: canUseHardWiggleForSkillsPerm
    };
  }, [characterData.basicInfo.selectedPermissionMQIds]);
  
  const canCharacterAddAnyMiracle = canAddHyperskillQuality || canAddHyperstatQuality || canAddStandardMiracleQuality;
  const onePowerLimitReached = characterData.basicInfo.selectedPermissionMQIds.includes('one_power') && characterData.miracles.filter(m => !m.isMandatory).length >= 1;
  
  const filteredDynamicPqDefs = React.useMemo(() => {
      const allDynamicDefs = getDynamicPowerQualityDefinitions(characterData.skills);
      return allDynamicDefs.filter(def => {
          if (def.key.startsWith('hyperskill_')) {
              return canAddHyperskillQuality;
          }
          if (def.key.startsWith('hyperstat_')) {
              return canAddHyperstatQuality;
          }
          if (['attacks', 'defends', 'useful'].includes(def.key)) {
              return canAddStandardMiracleQuality;
          }
          return false; 
      });
  }, [characterData.skills, canAddHyperskillQuality, canAddHyperstatQuality, canAddStandardMiracleQuality]);

  const filteredMiracleTemplates = React.useMemo(() => {
    return PREDEFINED_MIRACLES_TEMPLATES.filter(template => {
        if (!template.qualities || template.qualities.length === 0) { 
             return canAddStandardMiracleQuality || canAddHyperstatQuality || canAddHyperskillQuality; 
        }
        return template.qualities.every(quality => {
            const type = quality.type;
            if (type === 'attacks' || type === 'defends' || type === 'useful') {
                return canAddStandardMiracleQuality;
            } else if (type.startsWith('hyperstat_')) {
                return canAddHyperstatQuality;
            } else if (type.startsWith('hyperskill_')) { 
                return canAddHyperskillQuality;
            }
            return false; 
        });
    });
  }, [canAddHyperskillQuality, canAddHyperstatQuality, canAddStandardMiracleQuality]);

  const isAddMiracleOverallDisabled = onePowerLimitReached || !canCharacterAddAnyMiracle;

  let addMiracleTooltipContent = "";
  if (onePowerLimitReached) {
      addMiracleTooltipContent = "Cannot add more miracles due to 'One Power' permission limit (1 regular miracle).";
  } else if (!canCharacterAddAnyMiracle) {
      addMiracleTooltipContent = "No permissions selected that allow adding new miracles or specific miracle qualities.";
  } else if (filteredMiracleTemplates.length === 0 && PREDEFINED_MIRACLES_TEMPLATES.length > 0) {
      addMiracleTooltipContent = "No predefined miracle templates match your current permissions. You can still add a custom miracle.";
  }

  const peakPerformerDiceCap = 5;
  const inhumanDiceCap = 10;
  const generateDiceOptions = (cap: number, suffix: 'HD' | 'WD') => Array.from({ length: cap + 1 }, (_, i) => `${i}${suffix}`);


  const getSkillNormalDiceOptions = (_linkedAttribute: AttributeName): string[] => {
    const maxStatNormalDice = 5; // Skills are capped by stat normal dice, usually 5
    return Array.from({ length: maxStatNormalDice + 1 }, (_, i) => `${i}D`); // 0D to 5D
  };

  const handleAddPredefinedSkill = () => {
    if (selectedSkillToAdd) {
      const skillDef = SKILL_DEFINITIONS.find(s => s.id === selectedSkillToAdd);
      if (skillDef) {
        onAddSkill(skillDef);
        setSelectedSkillToAdd("");
      }
    }
  };

  const handleAddSelectedMiracle = () => {
    if (selectedMiracleToAdd && selectedMiracleToAdd !== 'custom') {
      onAddMiracle(selectedMiracleToAdd);
      setSelectedMiracleToAdd("");
    } else if (selectedMiracleToAdd === 'custom') {
      onAddMiracle('custom');
      setSelectedMiracleToAdd("");
    }
  };

  const mandatoryMiracles = characterData.miracles.filter(m => m.isMandatory);
  const regularMiracles = characterData.miracles.filter(m => !m.isMandatory);

  const selectedArchetype = ARCHETYPES.find(arch => arch.id === characterData.basicInfo.selectedArchetypeId);

  const calculateDisplayedNDFactor = (quality: MiracleQuality) => {
    const allDynamicDefs = getDynamicPowerQualityDefinitions(characterData.skills); 
    const qualityDef = allDynamicDefs.find(def => def.key === quality.type);
    if (!qualityDef) return 1; 

    const baseCostFactor = qualityDef.baseCostFactor;
    const totalExtrasCostModifier = quality.extras.reduce((sum, ex) => sum + ex.costModifier, 0);
    const totalFlawsCostModifier = quality.flaws.reduce((sum, fl) => sum + fl.costModifier, 0);
    const effectiveCostModifier = quality.levels + totalExtrasCostModifier + totalFlawsCostModifier;

    return Math.max(1, baseCostFactor + effectiveCostModifier);
  };

  const hasNoBaseWillIntrinsic = characterData.basicInfo.selectedIntrinsicMQIds.includes('no_base_will');
  const hasNoWillpowerIntrinsic = characterData.basicInfo.selectedIntrinsicMQIds.includes('no_willpower');

  const customStatsDefinition = INTRINSIC_META_QUALITIES.find(mq => mq.id === 'custom_stats');

  const renderMiracleCardContent = (miracle: MiracleDefinition) => {
    const isIntrinsicMandatedUnremovable = miracle.isMandatory && 
        (miracle.definitionId?.startsWith('archetype-mandatory-') || 
         (characterData.basicInfo.selectedArchetypeId === 'godlike_talent' && miracle.definitionId === 'perceive_godlike_talents'));
    
    return (
      <>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            {(miracle.isCustom || !miracle.definitionId || miracle.definitionId?.startsWith('archetype-mandatory-') || (characterData.basicInfo.selectedArchetypeId === 'godlike_talent' && miracle.definitionId === 'perceive_godlike_talents')) ? (
              <Input
                value={miracle.name}
                onChange={(e) => onMiracleChange(miracle.id, 'name', e.target.value)}
                className="text-xl font-headline mr-2 flex-grow"
                placeholder="Miracle Name"
              />
            ) : (
              <h3 className="text-xl font-headline text-primary flex-grow">{miracle.name}</h3>
            )}
            { !isIntrinsicMandatedUnremovable &&
                <Button variant="ghost" size="icon" onClick={() => onRemoveMiracle(miracle.id)} aria-label={`Remove ${miracle.name}`}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
            }
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <Checkbox
              id={`${miracle.id}-mandatory`}
              checked={miracle.isMandatory}
              onCheckedChange={(checked) => onMiracleChange(miracle.id, 'isMandatory', !!checked)}
              disabled={isIntrinsicMandatedUnremovable}
              className="form-checkbox h-4 w-4 text-primary rounded disabled:opacity-50"
            />
            <Label htmlFor={`${miracle.id}-mandatory`} className="text-xs">Mandatory</Label>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-semibold block mb-1">Miracle Base Dice</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 mb-3">
              <Select value={miracle.dice} onValueChange={(v) => onMiracleChange(miracle.id, 'dice', v)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{Array.from({ length: 11 }, (_, i) => `${i}D`).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={miracle.hardDice} onValueChange={(v) => onMiracleChange(miracle.id, 'hardDice', v)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{generateDiceOptions(10, 'HD').map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={miracle.wiggleDice} onValueChange={(v) => onMiracleChange(miracle.id, 'wiggleDice', v)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{generateDiceOptions(10, 'WD').map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor={`${miracle.id}-description`} className="text-sm font-semibold">Description</Label>
            <Textarea
              id={`${miracle.id}-description`}
              value={miracle.description}
              onChange={(e) => onMiracleChange(miracle.id, 'description', e.target.value)}
              placeholder="Describe the miracle..."
              className="text-sm"
            />
          </div>

          <p className="font-semibold">
            Total Miracle Cost: {miracle.isMandatory ? '0 points (Mandatory)' : `${calculateMiracleTotalCost(miracle, characterData.skills)} points`}
          </p>


          <div className="space-y-3 mt-3">
            <div className="flex justify-between items-center">
              <h5 className="text-md font-semibold text-accent">Power Qualities</h5>
              <Button size="sm" variant="outline" onClick={() => onAddMiracleQuality(miracle.id)} disabled={filteredDynamicPqDefs.length === 0}>
                <PlusCircle className="mr-2 h-4 w-4"/> Add Quality
              </Button>
            </div>
            {filteredDynamicPqDefs.length === 0 && <p className="text-xs text-muted-foreground">No quality types available based on current permissions.</p>}
            {miracle.qualities.length === 0 && filteredDynamicPqDefs.length > 0 && <p className="text-xs text-muted-foreground">No qualities added yet.</p>}
            
            {miracle.qualities.map((quality) => (
              <Card key={quality.id} className="p-3 bg-background/50 border-border shadow-inner">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Quality Configuration</p>
                  <Button variant="ghost" size="sm" onClick={() => onRemoveMiracleQuality(miracle.id, quality.id)}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div>
                    <Label htmlFor={`${quality.id}-type`} className="text-xs">Quality Type</Label>
                    <Select value={quality.type} onValueChange={(v) => onMiracleQualityChange(miracle.id, quality.id, 'type', v)}>
                      <SelectTrigger id={`${quality.id}-type`}><SelectValue/></SelectTrigger>
                      <SelectContent>
                        {filteredDynamicPqDefs.map(def => <SelectItem key={def.key} value={def.key}>{def.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`${quality.id}-capacity`} className="text-xs">Capacity</Label>
                    <Select value={quality.capacity} onValueChange={(v) => onMiracleQualityChange(miracle.id, quality.id, 'capacity', v as MiracleCapacityType)}>
                      <SelectTrigger id={`${quality.id}-capacity`}><SelectValue/></SelectTrigger>
                      <SelectContent>
                        {POWER_CAPACITY_OPTIONS.map(cap => <SelectItem key={cap.value} value={cap.value}>{cap.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`${quality.id}-levels`} className="text-xs">Power Quality Levels</Label>
                    <Input
                      id={`${quality.id}-levels`}
                      type="number"
                      min="0"
                      value={String(Math.max(0, quality.levels || 0))}
                      onChange={(e) => {
                          let val = parseInt(e.target.value, 10);
                          val = Math.max(0, isNaN(val) ? 0 : val);
                          onMiracleQualityChange(miracle.id, quality.id, 'levels', val);
                      }}
                      className="text-sm"
                      placeholder="0"
                    />
                  </div>
                   <div>
                      <Label className="text-xs block">Effective Factor (per ND)</Label>
                      <Input
                          type="text"
                          readOnly
                          value={String(calculateDisplayedNDFactor(quality))}
                          className="text-sm bg-muted cursor-not-allowed"
                      />
                  </div>
                </div>

                {/* Extras Section */}
                <div className="mt-3 pt-2 border-t border-dashed">
                  <Label className="text-xs font-semibold">Extras</Label>
                  {quality.extras.map(extra => (
                    <div key={extra.id} className="flex items-center space-x-2 my-1 text-xs p-1 bg-primary/10 rounded-md">
                      {extra.isCustom ? (
                        <>
                          <Input value={extra.name} onChange={e => onExtraOrFlawChange(miracle.id, quality.id, 'extra', extra.id, 'name', e.target.value)} placeholder="Custom Extra Name" className="flex-grow h-7 text-xs"/>
                          <Input
                            type="number"
                            value={(typeof extra.costModifier === 'number' && !isNaN(extra.costModifier)) ? String(extra.costModifier) : ''}
                            onChange={e => onExtraOrFlawChange(miracle.id, quality.id, 'extra', extra.id, 'costModifier', parseInt(e.target.value) || 0)}
                            className="w-16 h-7 text-xs" placeholder="Cost"
                          />
                        </>
                      ) : (
                        <span className="flex-grow">{extra.name} ({extra.costModifier > 0 ? '+' : ''}{extra.costModifier})</span>
                      )}
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemoveExtraOrFlawFromQuality(miracle.id, quality.id, 'extra', extra.id)}><Trash2 className="h-3 w-3 text-destructive"/></Button>
                    </div>
                  ))}
                  <div className="flex items-end space-x-1 mt-1">
                      <Select
                          value={selectedExtraToAdd[quality.id] || ""}
                          onValueChange={val => setSelectedExtraToAdd(prev => ({...prev, [quality.id]: val}))}
                      >
                          <SelectTrigger className="h-8 text-xs flex-grow" ><SelectValue placeholder="Add Extra..."/></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="custom_extra">Custom Extra</SelectItem>
                              {PREDEFINED_EXTRAS.map(ex => <SelectItem key={ex.id} value={ex.id}>{ex.name} ({ex.costModifier > 0 ? '+' : ''}{ex.costModifier})</SelectItem>)}
                          </SelectContent>
                      </Select>
                      <Button size="sm" className="h-8 text-xs" onClick={() => {
                          const val = selectedExtraToAdd[quality.id];
                          onAddExtraOrFlawToQuality(miracle.id, quality.id, 'extra', val === 'custom_extra' ? undefined : val);
                          setSelectedExtraToAdd(prev => ({...prev, [quality.id]: ""}));
                      }} disabled={!selectedExtraToAdd[quality.id]}>Add</Button>
                  </div>
                </div>

                {/* Flaws Section */}
                <div className="mt-3 pt-2 border-t border-dashed">
                  <Label className="text-xs font-semibold">Flaws</Label>
                   {quality.flaws.map(flaw => (
                    <div key={flaw.id} className="flex items-center space-x-2 my-1 text-xs p-1 bg-destructive/10 rounded-md">
                      {flaw.isCustom ? (
                        <>
                          <Input value={flaw.name} onChange={e => onExtraOrFlawChange(miracle.id, quality.id, 'flaw', flaw.id, 'name', e.target.value)} placeholder="Custom Flaw Name" className="flex-grow h-7 text-xs"/>
                          <Input
                            type="number"
                            value={(typeof flaw.costModifier === 'number' && !isNaN(flaw.costModifier)) ? String(flaw.costModifier) : ''}
                            onChange={e => onExtraOrFlawChange(miracle.id, quality.id, 'flaw', flaw.id, 'costModifier', parseInt(e.target.value) || 0)}
                            className="w-16 h-7 text-xs" placeholder="Cost"
                          />
                        </>
                      ) : (
                        <span className="flex-grow">{flaw.name} ({flaw.costModifier})</span>
                      )}
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemoveExtraOrFlawFromQuality(miracle.id, quality.id, 'flaw', flaw.id)}><Trash2 className="h-3 w-3 text-destructive"/></Button>
                    </div>
                  ))}
                   <div className="flex items-end space-x-1 mt-1">
                      <Select
                          value={selectedFlawToAdd[quality.id] || ""}
                          onValueChange={val => setSelectedFlawToAdd(prev => ({...prev, [quality.id]: val}))}
                      >
                          <SelectTrigger className="h-8 text-xs flex-grow" ><SelectValue placeholder="Add Flaw..." /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="custom_flaw">Custom Flaw</SelectItem>
                              {PREDEFINED_FLAWS.map(fl => <SelectItem key={fl.id} value={fl.id}>{fl.name} ({fl.costModifier})</SelectItem>)}
                          </SelectContent>
                      </Select>
                       <Button size="sm" className="h-8 text-xs" onClick={() => {
                          const val = selectedFlawToAdd[quality.id];
                          onAddExtraOrFlawToQuality(miracle.id, quality.id, 'flaw', val === 'custom_flaw' ? undefined : val);
                          setSelectedFlawToAdd(prev => ({...prev, [quality.id]: ""}));
                      }} disabled={!selectedFlawToAdd[quality.id]}>Add</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
           {isIntrinsicMandatedUnremovable &&
              <p className="text-xs italic text-muted-foreground mt-3">This miracle is mandated by an archetype intrinsic. Its "Mandatory" status cannot be unchecked, and it cannot be removed directly from this list (its existence is tied to the intrinsic configuration).</p>
          }
        </CardContent>
      </>
    );
  }


  return (
    <Accordion type="multiple" className="w-full space-y-6" >
      <CollapsibleSectionItem title="Basic Information" value="basic-information">
        <div className="space-y-4">
          <div>
            <Label htmlFor="charName" className="font-headline">Name</Label>
            <Input id="charName" placeholder="e.g., John Doe" value={characterData.basicInfo.name} onChange={(e) => onBasicInfoChange('name', e.target.value)} />
          </div>

          <div>
            <Label htmlFor="archetype" className="font-headline">Sample Archetype</Label>
            <Select value={characterData.basicInfo.selectedArchetypeId} onValueChange={(value) => onBasicInfoChange('selectedArchetypeId', value)}>
              <SelectTrigger id="archetype"><SelectValue placeholder="Select Archetype..." /></SelectTrigger>
              <SelectContent>
                {ARCHETYPES.map(arch => <SelectItem key={arch.id} value={arch.id}>{arch.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {selectedArchetype && selectedArchetype.id !== 'custom' && (
              <Card className="mt-2 p-3 bg-muted/50 text-sm">
                <p><strong>Source:</strong> {selectedArchetype.sourceText}</p>
                <p><strong>Permission:</strong> {selectedArchetype.permissionText}</p>
                {selectedArchetype.intrinsicsText && <p><strong>Intrinsics:</strong> {selectedArchetype.intrinsicsText}</p>}
                <p className="mt-1">{selectedArchetype.description}</p>
                {selectedArchetype.mandatoryPowerText && <p className="mt-1"><strong>Mandatory Power:</strong> {selectedArchetype.mandatoryPowerText}</p>}
                {selectedArchetype.additions && <p className="mt-1 text-xs italic">{selectedArchetype.additions}</p>}
              </Card>
            )}
             {selectedArchetype && selectedArchetype.id === 'custom' && (
                <Card className="mt-2 p-3 bg-muted/50 text-sm">
                    <p>{selectedArchetype.description}</p>
                </Card>
            )}
          </div>

          <MetaQualityCollapsible
            title="Source Meta-Qualities"
            mqList={SOURCE_META_QUALITIES}
            selectedMQIds={characterData.basicInfo.selectedSourceMQIds}
            onMQSelectionChange={(mqId, isSelected) => onMQSelectionChange('source', mqId, isSelected)}
            basicInfo={characterData.basicInfo}
            onIntrinsicConfigChange={onIntrinsicConfigChange}
            mqType="source"
          />

          <MetaQualityCollapsible
            title="Permission Meta-Qualities"
            mqList={PERMISSION_META_QUALITIES}
            selectedMQIds={characterData.basicInfo.selectedPermissionMQIds}
            onMQSelectionChange={(mqId, isSelected) => onMQSelectionChange('permission', mqId, isSelected)}
            basicInfo={characterData.basicInfo}
            onIntrinsicConfigChange={onIntrinsicConfigChange}
            mqType="permission"
          />

          <MetaQualityCollapsible
            title="Intrinsic Meta-Qualities"
            mqList={INTRINSIC_META_QUALITIES}
            selectedMQIds={characterData.basicInfo.selectedIntrinsicMQIds}
            onMQSelectionChange={(mqId, isSelected) => onMQSelectionChange('intrinsic', mqId, isSelected)}
            basicInfo={characterData.basicInfo}
            onIntrinsicConfigChange={onIntrinsicConfigChange}
            mqType="intrinsic"
          />
        </div>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Motivations" value="motivations">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Uninvested Base Will: {uninvestedBaseWill}</p>
            <Button onClick={onAddMotivation} size="sm" disabled={hasNoBaseWillIntrinsic}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Motivation
            </Button>
          </div>
          {characterData.basicInfo.motivations.length === 0 && (
            <p className="text-muted-foreground text-sm">No motivations added yet.</p>
          )}
          {characterData.basicInfo.motivations.map((motivation) => (
            <Card key={motivation.id} className="p-4 bg-card/60 shadow">
              <div className="flex justify-end mb-2">
                <Button variant="ghost" size="sm" onClick={() => onRemoveMotivation(motivation.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`motivation-text-${motivation.id}`}>Motivation</Label>
                  <Textarea
                    id={`motivation-text-${motivation.id}`}
                    value={motivation.motivationText}
                    onChange={(e) => onMotivationChange(motivation.id, 'motivationText', e.target.value)}
                    placeholder="Describe the motivation (e.g., Protect the innocent, Achieve ultimate power)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`motivation-type-${motivation.id}`}>Type</Label>
                    <Select
                      value={motivation.type}
                      onValueChange={(value) => onMotivationChange(motivation.id, 'type', value as 'loyalty' | 'passion')}
                    >
                      <SelectTrigger id={`motivation-type-${motivation.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loyalty">Loyalty</SelectItem>
                        <SelectItem value="passion">Passion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`motivation-invested-${motivation.id}`}>Invested Base Will</Label>
                    <Input
                      id={`motivation-invested-${motivation.id}`}
                      type="number"
                      min="0"
                      max={motivation.investedBaseWill + uninvestedBaseWill}
                      value={String(motivation.investedBaseWill)}
                      onChange={(e) => {
                        let val = parseInt(e.target.value, 10);
                        if (isNaN(val)) val = 0;

                        const currentOtherInvested = characterData.basicInfo.motivations
                          .filter(m => m.id !== motivation.id)
                          .reduce((sum, m) => sum + (m.investedBaseWill || 0), 0);

                        const maxPossibleForThisMotivation = totalBaseWill - currentOtherInvested;
                        val = Math.min(Math.max(0, val), maxPossibleForThisMotivation);

                        onMotivationChange(motivation.id, 'investedBaseWill', val);
                      }}
                      disabled={(uninvestedBaseWill === 0 && motivation.investedBaseWill === 0) || hasNoBaseWillIntrinsic}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Stats" value="stats">
        <p className="text-sm text-muted-foreground mb-4">
          Costs: Normal Dice: 5 points per die. Hard Dice: 10 points per die. Wiggle Dice: 20 points per die.
        </p>
        <div className="space-y-6">
          {statsDefinitions.map((stat) => {
            const isDiscarded = discardedAttribute === stat.name;
            const discardedDescription = isDiscarded && customStatsDefinition?.customStatsDiscardOptions?.find(opt => opt.value === stat.name)?.description;
            
            const showHardWiggleForThisStat = canUseHardWiggleDiceForStats && !isDiscarded;
            let statHardDiceOptions = generateDiceOptions(0, 'HD');
            let statWiggleDiceOptions = generateDiceOptions(0, 'WD');

            if (showHardWiggleForThisStat) {
                const cap = characterData.basicInfo.selectedPermissionMQIds.includes('inhuman_stats')
                            ? inhumanDiceCap
                            : peakPerformerDiceCap;
                statHardDiceOptions = generateDiceOptions(cap, 'HD');
                statWiggleDiceOptions = generateDiceOptions(cap, 'WD');
            }

            return (
            <div key={stat.name} className="p-4 border rounded-lg bg-card/50 shadow-sm">
              <h4 className="text-xl font-headline mb-2 text-primary">{stat.label}</h4>
              {isDiscarded ? (
                <div className="text-sm text-muted-foreground p-2 bg-muted/30 rounded-md">
                  <p><strong>This attribute is discarded due to the Custom Stats intrinsic.</strong></p>
                  <p className="mt-1 whitespace-pre-wrap">{discardedDescription}</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">{stat.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
                    <div>
                      <Label htmlFor={`${stat.name}-dice`} className="text-xs font-semibold">Normal Dice</Label>
                      <Select
                        value={characterData.stats[stat.name]?.dice || '2D'}
                        onValueChange={(value) => onStatChange(stat.name, 'dice', value)}
                      >
                        <SelectTrigger id={`${stat.name}-dice`} aria-label={`${stat.label} Normal Dice`}>
                          <SelectValue placeholder="Select dice" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 6 }, (_, i) => `${i}D`).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    {showHardWiggleForThisStat && (
                      <>
                        <div>
                          <Label htmlFor={`${stat.name}-hardDice`} className="text-xs font-semibold">Hard Dice</Label>
                          <Select
                            value={characterData.stats[stat.name]?.hardDice || '0HD'}
                            onValueChange={(value) => onStatChange(stat.name, 'hardDice', value)}
                          >
                            <SelectTrigger id={`${stat.name}-hardDice`} aria-label={`${stat.label} Hard Dice`}>
                              <SelectValue placeholder="Select hard dice" />
                            </SelectTrigger>
                            <SelectContent>
                              {statHardDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`${stat.name}-wiggleDice`} className="text-xs font-semibold">Wiggle Dice</Label>
                          <Select
                            value={characterData.stats[stat.name]?.wiggleDice || '0WD'}
                            onValueChange={(value) => onStatChange(stat.name, 'wiggleDice', value)}
                          >
                            <SelectTrigger id={`${stat.name}-wiggleDice`} aria-label={`${stat.label} Wiggle Dice`}>
                              <SelectValue placeholder="Select wiggle dice" />
                            </SelectTrigger>
                            <SelectContent>
                              {statWiggleDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
        </div>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Skills" value="skills">
        <p className="text-sm text-muted-foreground mb-2">
          Skill Costs: Normal Dice: 2 points/die. Hard Dice: 4 points/die. Wiggle Dice: 8 points/die.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Normal skill dice are capped by the linked attribute's maximum normal dice value (up to 5D).
        </p>
        <div className="mb-6 p-4 border rounded-lg bg-card/50 shadow-sm">
          <h4 className="text-lg font-headline mb-3">Add Skill</h4>
          <div className="flex items-end space-x-2 mb-4">
            <div className="flex-grow">
              <Label htmlFor="add-skill-select">Select Predefined Skill</Label>
              <Select value={selectedSkillToAdd} onValueChange={setSelectedSkillToAdd}>
                <SelectTrigger id="add-skill-select">
                  <SelectValue placeholder="Choose a skill..." />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_DEFINITIONS.map(def => (
                    <SelectItem key={def.id} value={def.id}>{def.name} ({def.linkedAttribute})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddPredefinedSkill} disabled={!selectedSkillToAdd}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Selected
            </Button>
          </div>
          <Button onClick={onAddCustomSkill} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Skill
          </Button>
        </div>

        {characterData.skills.length === 0 && (
          <p className="text-muted-foreground">No skills added yet.</p>
        )}

        <div className="space-y-6">
          {characterData.skills.map((skill) => {
            const showHardWiggleForThisSkill = canUseHardWiggleDiceForSkills;
            let skillHardDiceOptions = generateDiceOptions(0, 'HD');
            let skillWiggleDiceOptions = generateDiceOptions(0, 'WD');

            if (showHardWiggleForThisSkill) {
                skillHardDiceOptions = generateDiceOptions(peakPerformerDiceCap, 'HD');
                skillWiggleDiceOptions = generateDiceOptions(peakPerformerDiceCap, 'WD');
            }
            return (
            <div key={skill.id} className="p-4 border rounded-lg bg-card/50 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                {skill.isCustom ? (
                  <Input
                    value={skill.name}
                    onChange={(e) => onSkillChange(skill.id, 'name', e.target.value)}
                    className="text-lg font-headline mr-2 flex-grow"
                    placeholder="Custom Skill Name"
                  />
                ) : (
                  <h4 className="text-lg font-headline text-primary">{skill.name}</h4>
                )}
                <Button variant="ghost" size="sm" onClick={() => onRemoveSkill(skill.id)} aria-label="Remove skill">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              {skill.isCustom && (
                 <div className="mb-2">
                    <Label htmlFor={`${skill.id}-linkedAttribute`} className="text-xs font-semibold">Linked Attribute</Label>
                    <Select
                        value={skill.linkedAttribute}
                        onValueChange={(value) => onSkillChange(skill.id, 'linkedAttribute', value as AttributeName)}
                    >
                        <SelectTrigger id={`${skill.id}-linkedAttribute`}>
                            <SelectValue placeholder="Select attribute"/>
                        </SelectTrigger>
                        <SelectContent>
                            {attributeNames.map(attr => <SelectItem key={attr} value={attr} className="capitalize">{attr}</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
              )}

              {!skill.isCustom && <p className="text-sm text-muted-foreground capitalize mb-1">Linked Attribute: {skill.linkedAttribute}</p>}

              {skill.hasType && (
                <div className="mb-2">
                  <Label htmlFor={`${skill.id}-typeSpec`} className="text-xs font-semibold">
                    {SKILL_DEFINITIONS.find(s => s.id === skill.definitionId)?.typePrompt || 'Specify Type'}
                  </Label>
                  <Input
                    id={`${skill.id}-typeSpec`}
                    value={skill.typeSpecification || ""}
                    onChange={(e) => onSkillChange(skill.id, 'typeSpecification', e.target.value)}
                    placeholder={SKILL_DEFINITIONS.find(s => s.id === skill.definitionId)?.sampleTypes || "e.g., Sword, Pistol, Computer Hacking"}
                  />
                  {skill.notes && <p className="text-xs text-muted-foreground mt-1">{skill.notes}</p>}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 mb-2">
                <div>
                  <Label htmlFor={`${skill.id}-dice`} className="text-xs font-semibold">Normal Dice</Label>
                  <Select
                    value={skill.dice}
                    onValueChange={(value) => onSkillChange(skill.id, 'dice', value)}
                  >
                    <SelectTrigger id={`${skill.id}-dice`}>
                      <SelectValue placeholder="Dice" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSkillNormalDiceOptions(skill.linkedAttribute).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {showHardWiggleForThisSkill && (
                  <>
                    <div>
                      <Label htmlFor={`${skill.id}-hardDice`} className="text-xs font-semibold">Hard Dice</Label>
                      <Select
                        value={skill.hardDice}
                        onValueChange={(value) => onSkillChange(skill.id, 'hardDice', value)}
                      >
                        <SelectTrigger id={`${skill.id}-hardDice`}>
                          <SelectValue placeholder="HD" />
                        </SelectTrigger>
                        <SelectContent>
                          {skillHardDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`${skill.id}-wiggleDice`} className="text-xs font-semibold">Wiggle Dice</Label>
                      <Select
                        value={skill.wiggleDice}
                        onValueChange={(value) => onSkillChange(skill.id, 'wiggleDice', value)}
                      >
                        <SelectTrigger id={`${skill.id}-wiggleDice`}>
                          <SelectValue placeholder="WD" />
                        </SelectTrigger>
                        <SelectContent>
                          {skillWiggleDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
              {skill.isCustom ? (
                 <Textarea
                    value={skill.description}
                    onChange={(e) => onSkillChange(skill.id, 'description', e.target.value)}
                    placeholder="Custom skill description..."
                    className="text-sm"
                  />
              ) : (
                <p className="text-sm text-muted-foreground">{skill.description}</p>
              )}

            </div>
          )})}
        </div>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Willpower" value="willpower">
        <div className="space-y-3">
          <p><strong className="font-headline">Calculated Base Will (Charm + Command):</strong> { calculatedBaseWillFromStats }</p>
          <div className="space-y-1">
            <Label htmlFor="purchasedBaseWill" className="font-headline">Purchased Base Will (3pts/pt)</Label>
            <Input
              id="purchasedBaseWill"
              type="number"
              min="0"
              placeholder="0"
              className="w-24"
              value={String(hasNoBaseWillIntrinsic ? 0 : characterData.willpower.purchasedBaseWill)}
              onChange={(e) => onWillpowerChange('purchasedBaseWill', parseInt(e.target.value, 10))}
              disabled={hasNoBaseWillIntrinsic}
            />
          </div>
          <p><strong className="font-headline">Total Base Will:</strong> {totalBaseWill}</p>
           <p className="text-sm text-muted-foreground">Uninvested from Motivations: {uninvestedBaseWill}</p>
          <div className="space-y-1">
            <Label htmlFor="purchasedWill" className="font-headline">Purchased Will (1pt/pt)</Label>
            <Input
              id="purchasedWill"
              type="number"
              min="0"
              placeholder="0"
              className="w-24"
              value={String((hasNoBaseWillIntrinsic || hasNoWillpowerIntrinsic) ? 0 : characterData.willpower.purchasedWill)}
              onChange={(e) => onWillpowerChange('purchasedWill', parseInt(e.target.value, 10))}
              disabled={hasNoBaseWillIntrinsic || hasNoWillpowerIntrinsic}
            />
          </div>
          <p><strong className="font-headline">Total Will:</strong> {totalWill}</p>
        </div>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Miracles" value="miracles">
        <p className="text-sm text-muted-foreground mb-1">Miracle Dice represent the raw power of the miracle.</p>
        <p className="text-sm text-muted-foreground mb-1">Qualities determine how these dice are applied and costed.</p>
        <p className="text-sm text-muted-foreground mb-1">Power Quality (Attacks, Defends, Useful) costs a base factor related to the quality type (e.g. 2 for Attacks) per Normal Die. Each Normal Die used for a quality costs a minimum of 1 point.</p>
        <p className="text-sm text-muted-foreground mb-1">Hyperstat qualities cost a base factor of 4 per Normal Die.</p>
        <p className="text-sm text-muted-foreground mb-4">Hyperskill qualities cost a base factor of 1 per Normal Die. (Hard/Wiggle dice cost 2x/4x their Normal Die factor respectively for all types). Levels, Extras, and Flaws modify these factors.</p>

        <div className="mb-6 p-4 border rounded-lg bg-card/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-headline">Add Miracle</h4>
            {isAddMiracleOverallDisabled && addMiracleTooltipContent && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>{addMiracleTooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-end space-x-2 mb-4">
            <div className="flex-grow">
              <Label htmlFor="add-miracle-select">Select Miracle Template or Custom</Label>
              <Select 
                value={selectedMiracleToAdd} 
                onValueChange={setSelectedMiracleToAdd}
                disabled={isAddMiracleOverallDisabled}
              >
                <SelectTrigger id="add-miracle-select" disabled={isAddMiracleOverallDisabled}>
                  <SelectValue placeholder="Choose a miracle..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Add Custom Miracle</SelectItem>
                  {filteredMiracleTemplates.map(def => (
                    <SelectItem key={def.definitionId} value={def.definitionId!}>{def.name}</SelectItem>
                  ))}
                   {filteredMiracleTemplates.length === 0 && PREDEFINED_MIRACLES_TEMPLATES.length > 0 && !isAddMiracleOverallDisabled && (
                      <div className="p-2 text-xs text-muted-foreground">No predefined templates match current permissions.</div>
                    )}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddSelectedMiracle} disabled={!selectedMiracleToAdd || isAddMiracleOverallDisabled}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Selected
            </Button>
          </div>
        </div>

        {mandatoryMiracles.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xl font-headline text-accent mb-3">Mandatory Miracles</h4>
            {mandatoryMiracles.map(miracle => (
              <Card key={miracle.id} className="mb-4 bg-accent/10 shadow-md">
                {renderMiracleCardContent(miracle)}
              </Card>
            ))}
          </div>
        )}

        <h4 className="text-xl font-headline mb-3 mt-6">{mandatoryMiracles.length > 0 ? 'Regular Miracles' : 'Miracles'}</h4>
        {regularMiracles.length === 0 && mandatoryMiracles.length === 0 && (
          <p className="text-muted-foreground">No miracles added yet.</p>
        )}
         {regularMiracles.length === 0 && mandatoryMiracles.length > 0 && (
          <p className="text-muted-foreground">No regular miracles added yet.</p>
        )}


        <div className="space-y-6">
          {regularMiracles.map((miracle) => (
            <Card key={miracle.id} className="bg-card/70 shadow-md">
               {renderMiracleCardContent(miracle)}
            </Card>
          ))}
        </div>
      </CollapsibleSectionItem>
    </Accordion>
  );
}

    
