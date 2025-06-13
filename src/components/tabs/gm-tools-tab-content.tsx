
// src/components/tabs/gm-tools-tab-content.tsx
"use client";

import * as React from "react";
import type { GmSettings } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Download, PlusCircle, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MiracleDefinition, MiracleQuality, AppliedExtraOrFlaw, MiracleQualityType, MiracleCapacityType } from "@/lib/miracles-definitions";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs
import { PREDEFINED_MIRACLES_TEMPLATES, POWER_QUALITY_DEFINITIONS, POWER_CAPACITY_OPTIONS, PREDEFINED_EXTRAS, PREDEFINED_FLAWS, getDynamicPowerQualityDefinitions } from "@/lib/miracles-definitions";
import { calculateSingleMiracleTotalCost, calculateSingleMiracleQualityCost } from "@/lib/cost-calculations";


import {
  ARCHETYPES, SOURCE_META_QUALITIES, PERMISSION_META_QUALITIES, INTRINSIC_META_QUALITIES,
  ALLERGY_SUBSTANCES, ALLERGY_EFFECTS, type AllergySubstanceType, type AllergyEffectType,
  type BruteFrailType, type DiscardedAttributeType, type InhumanStatsSettings, type InhumanStatSetting, type AttributeCondition,
  type SourceMetaQuality, type PermissionMetaQuality, type IntrinsicMetaQuality
} from "@/lib/character-definitions";
import { SKILL_DEFINITIONS } from "@/lib/skills-definitions";
import type { SkillInstance } from "@/app/page";
import { Accordion } from "@/components/ui/accordion";

const ALL_STATS_KEYS_GM = ['body', 'coordination', 'sense', 'mind', 'charm', 'command'] as const;


export interface CustomArchetypeCreationData {
  name: string;
  description: string;
  sourceMQIds: string[];
  permissionMQIds: string[];
  intrinsicMQIds: string[];
  intrinsicConfigs: {
    intrinsicAllergyConfig: { [mqId: string]: { substance?: AllergySubstanceType; effect?: AllergyEffectType } };
    intrinsicBruteFrailConfig: { [mqId: string]: { type?: BruteFrailType } };
    intrinsicCustomStatsConfig: { [mqId: string]: { discardedAttribute?: DiscardedAttributeType } };
    intrinsicVulnerableConfig: { [mqId: string]: { extraBoxes?: number } };
  };
  mandatoryPowerDetails: {
    count: number;
    miracles: MiracleDefinition[];
  };
  inhumanStatsSettings?: InhumanStatsSettings;
}


interface GmToolsTabContentProps {
  gmSettings: GmSettings;
  onPointLimitChange: (limitType: keyof GmSettings['pointRestrictions'], value: string) => void;
  onToggleableItemChange: (
    category: keyof Pick<GmSettings, 'sampleArchetypes' | 'metaQualitiesSource' | 'metaQualitiesPermission' | 'metaQualitiesIntrinsic' | 'sampleSkills'> | keyof GmSettings['miracleRestrictions'],
    itemId: string,
    isChecked: boolean
  ) => void;
  onWillpowerRestrictionChange: (field: keyof GmSettings['willpowerRestrictions'], value: string) => void;
  onMiracleNumericRestrictionChange: (field: keyof GmSettings['miracleRestrictions']['numericRestrictions'], value: string) => void;
  onExportSettings: () => void;
  onExportPower: (power: MiracleDefinition) => void;

  customArchetypeData: CustomArchetypeCreationData;
  customExtraCreationData: {
    name: string;
    description: string;
    costModifier: number;
  };
  onCustomArchetypeFieldChange: (field: keyof Omit<CustomArchetypeCreationData, 'sourceMQIds' | 'permissionMQIds' | 'intrinsicMQIds' | 'intrinsicConfigs' | 'mandatoryPowerDetails' | 'inhumanStatsSettings'>, value: string) => void;
  onCustomArchetypeMQSelectionChange: (mqType: 'source' | 'permission' | 'intrinsic', mqId: string, isSelected: boolean) => void;
  onCustomArchetypeMandatoryPowerCountChange: (newCount: string) => void;
  onCustomArchetypeMandatoryMiracleChange: (miracleIndex: number, field: keyof Pick<MiracleDefinition, 'name' | 'description' | 'dice' | 'hardDice' | 'wiggleDice'>, value: string) => void;
  onCustomArchetypeIntrinsicConfigChange: (metaQualityId: string, configKey: keyof CustomArchetypeCreationData['intrinsicConfigs'], field: string, value: any) => void;
  onCustomArchetypeInhumanStatSettingChange: (statName: keyof InhumanStatsSettings, field: keyof InhumanStatSetting, value: any) => void;
  onExportCustomArchetype: () => void;
  
  customFlawCreationData: {
    name: string;
    description: string;
    costModifier: number;
  };
 onCustomExtraCreationFieldChange: (field: keyof GmToolsTabContentProps['customExtraCreationData'], value: string | number) => void;
  onExportCustomExtra: () => void;
  onAddCustomArchetypeMandatoryMiracleQuality: (miracleIndex: number) => void;
  onRemoveCustomArchetypeMandatoryMiracleQuality: (miracleIndex: number, qualityId: string) => void;
  onCustomArchetypeMandatoryMiracleQualityChange: (miracleIndex: number, qualityId: string, field: keyof MiracleQuality, value: any) => void;
  onAddExtraOrFlawToCustomArchetypeMandatoryQuality: (miracleIndex: number, qualityId: string, itemType: 'extra' | 'flaw', definitionId?: string) => void;
  onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality: (miracleIndex: number, qualityId: string, itemType: 'extra' | 'flaw', itemId: string) => void;
  onCustomArchetypeMandatoryExtraOrFlawChange: (miracleIndex: number, qualityId: string, itemType: 'extra' | 'flaw', itemId: string, field: keyof AppliedExtraOrFlaw, value: string | number) => void;
 allSkills: SkillInstance[]; // Add allSkills prop
 onCustomFlawCreationFieldChange: (field: keyof GmToolsTabContentProps['customFlawCreationData'], value: string | number) => void;
  onExportCustomFlaw: () => void;
}


interface GmMetaQualityCollapsibleProps {
  title: string;
  mqList: (SourceMetaQuality | PermissionMetaQuality | IntrinsicMetaQuality)[];
  selectedMQIds: string[];
  onMQSelectionChange: (mqId: string, isSelected: boolean) => void;
  customArchetypeData: CustomArchetypeCreationData;
  onCustomArchetypeIntrinsicConfigChange: GmToolsTabContentProps['onCustomArchetypeIntrinsicConfigChange'];
  onCustomArchetypeInhumanStatSettingChange: GmToolsTabContentProps['onCustomArchetypeInhumanStatSettingChange'];
  onCustomArchetypeMandatoryPowerCountChange: GmToolsTabContentProps['onCustomArchetypeMandatoryPowerCountChange'];
  onCustomArchetypeMandatoryMiracleChange: GmToolsTabContentProps['onCustomArchetypeMandatoryMiracleChange'];
  mqType: 'source' | 'permission' | 'intrinsic';
  onAddCustomArchetypeMandatoryMiracleQuality: GmToolsTabContentProps['onAddCustomArchetypeMandatoryMiracleQuality'];
  onRemoveCustomArchetypeMandatoryMiracleQuality: GmToolsTabContentProps['onRemoveCustomArchetypeMandatoryMiracleQuality'];
  onCustomArchetypeMandatoryMiracleQualityChange: GmToolsTabContentProps['onCustomArchetypeMandatoryMiracleQualityChange'];
  onAddExtraOrFlawToCustomArchetypeMandatoryQuality: GmToolsTabContentProps['onAddExtraOrFlawToCustomArchetypeMandatoryQuality'];
  onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality: GmToolsTabContentProps['onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality'];
  onCustomArchetypeMandatoryExtraOrFlawChange: GmToolsTabContentProps['onCustomArchetypeMandatoryExtraOrFlawChange'];
  allSkills: SkillInstance[];
}

const GmMetaQualityCollapsible = (props: GmMetaQualityCollapsibleProps): JSX.Element => {
  const {
    title, mqList, selectedMQIds, onMQSelectionChange,
    customArchetypeData, onCustomArchetypeIntrinsicConfigChange, onCustomArchetypeInhumanStatSettingChange,
    onCustomArchetypeMandatoryPowerCountChange, onCustomArchetypeMandatoryMiracleChange, mqType,
    onAddCustomArchetypeMandatoryMiracleQuality, onRemoveCustomArchetypeMandatoryMiracleQuality,
    onCustomArchetypeMandatoryMiracleQualityChange, onAddExtraOrFlawToCustomArchetypeMandatoryQuality,
    onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality, onCustomArchetypeMandatoryExtraOrFlawChange,
    allSkills
  } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedExtraToAdd, setSelectedExtraToAdd] = React.useState<{ [qualityId: string]: string }>({});
  const [selectedFlawToAdd, setSelectedFlawToAdd] = React.useState<{ [qualityId: string]: string }>({});

  const gmPowerQualityDefinitions = React.useMemo(() => getDynamicPowerQualityDefinitions([]), []);

  const calculateGmDisplayedNDFactor = (quality: MiracleQuality) => {
    const qualityDef = gmPowerQualityDefinitions.find(def => def.key === quality.type);
    if (!qualityDef) return 1; 

    const baseCostFactor = qualityDef.baseCostFactor;
    const totalExtrasCostModifier = quality.extras.reduce((sum, ex) => sum + ex.costModifier, 0);
    const totalFlawsCostModifier = quality.flaws.reduce((sum, fl) => sum + fl.costModifier, 0);
    const effectiveCostModifier = quality.levels + totalExtrasCostModifier + totalFlawsCostModifier;

    return Math.max(1, baseCostFactor + effectiveCostModifier);
  };


  return (
    <Card className="bg-card/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-3 cursor-pointer hover:bg-accent/5" onClick={() => setIsOpen(!isOpen)}>
        <CardTitle className="text-lg font-headline">{title}</CardTitle>
        {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </CardHeader>
      {isOpen && (
        <CardContent className="p-3 space-y-3">
          {mqList.map(mq => (
            <div key={mq.id} className="p-2 border rounded-md bg-background/70">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`gm-customarch-${mqType}-${mq.id}`}
                  checked={selectedMQIds.includes(mq.id)}
                  onCheckedChange={(checked) => onMQSelectionChange(mq.id, !!checked)}
                />
                <Label htmlFor={`gm-customarch-${mqType}-${mq.id}`} className="text-sm font-medium flex-grow">{mq.label}</Label>
              </div>
              {selectedMQIds.includes(mq.id) && (
                <div className="mt-2 pl-6 text-xs space-y-2">
                  <p className="text-muted-foreground">{mq.description}</p>
                  {mq.id === 'mandatory_power' && mqType === 'intrinsic' && (
                    <div className="p-2 border rounded-md bg-muted/30 space-y-2">
                      <h5 className="text-xs font-semibold">Configuration:</h5>
                      <div>
                        <Label htmlFor="gm-mandatoryPowerCount" className="text-xs">Number of Mandatory Powers</Label>
                        <Input
                          id="gm-mandatoryPowerCount" type="number" min="0"
                          value={String(customArchetypeData.mandatoryPowerDetails.count)}
                          onChange={(e) => onCustomArchetypeMandatoryPowerCountChange(e.target.value)}
                          className="w-16 h-8 mt-1 text-xs"
                        />
                      </div>
                      {customArchetypeData.mandatoryPowerDetails.miracles.map((miracle, index) => (
                        <Card key={miracle.id} className="p-3 my-2 bg-background/80 shadow-inner">
                          <Label className="text-sm font-semibold block mb-1">Mandatory Power {index + 1}</Label>
                          <Input
                            placeholder="Miracle Name"
                            value={miracle.name}
                            onChange={e => onCustomArchetypeMandatoryMiracleChange(index, 'name', e.target.value)}
                            className="h-8 text-sm mb-2"
                          />
                          <Textarea
                            placeholder="Miracle Description"
                            value={miracle.description}
                            onChange={e => onCustomArchetypeMandatoryMiracleChange(index, 'description', e.target.value)}
                            className="text-sm mb-2 min-h-[40px]"
                          />
                           <div className="grid grid-cols-3 gap-2 mb-3">
                            <Select value={miracle.dice} onValueChange={v => onCustomArchetypeMandatoryMiracleChange(index, 'dice', v)}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
                                <SelectContent>{Array.from({length:11}, (_,i)=>`${i}D`).map(d=><SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={miracle.hardDice} onValueChange={v => onCustomArchetypeMandatoryMiracleChange(index, 'hardDice', v)}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
                                <SelectContent>{Array.from({length:11}, (_,i)=>`${i}HD`).map(d=><SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={miracle.wiggleDice} onValueChange={v => onCustomArchetypeMandatoryMiracleChange(index, 'wiggleDice', v)}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
                                <SelectContent>{Array.from({length:11}, (_,i)=>`${i}WD`).map(d=><SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}</SelectContent>
                            </Select>
                           </div>

                            <div className="mt-3 pt-3 border-t border-dashed">
                                <div className="text-sm">
 <p><strong className="font-semibold">Miracle Quality Cost Factors (per ND):</strong></p>
                                {miracle.qualities.length > 0 && gmPowerQualityDefinitions.length > 0 ? ( // Added check for gmPowerQualityDefinitions
 <ul className="list-disc list-inside pl-4 space-y-1">
 {miracle.qualities.map(q => { // Modified line
                                        const qDef = gmPowerQualityDefinitions.find(def => def.key === q.type);
                                        const factor = calculateGmDisplayedNDFactor(q);
 return <li key={`${miracle.id}-${q.id}-factor-display`}>{qDef?.label || q.type}: {factor} points</li>;
                                    })}
 </ul>
                                ) : (
 <p className="ml-4 text-muted-foreground">No qualities added.</p>
                                )}
                                </div>
 {/* Miracle Cost Per ND Calculation */}
 
  <>
    <p className="font-semibold mt-1">
      Miracle Cost per ND: {miracle.qualities.reduce((sum, quality) => sum + calculateGmDisplayedNDFactor(quality), 0)} points
    </p>
  </>
<p className="font-semibold mt-1">
  Total Miracle Cost: {miracle.isMandatory ? '0 points (Mandatory)' : `${calculateSingleMiracleTotalCost(miracle, allSkills)} points`}
  </p>
 </div>

 {/* Qualities Editing for GM Mandatory Miracle */}
                            <div className="space-y-3 mt-3">
                                <div className="flex justify-between items-center">
                                <h5 className="text-sm font-semibold text-accent">Power Qualities</h5>
                                <Button size="sm" variant="outline" onClick={() => onAddCustomArchetypeMandatoryMiracleQuality(index)}>
                                    <PlusCircle className="mr-2 h-3 w-3"/> Add Quality
                                </Button>
                                </div>
                                {miracle.qualities.length === 0 && <p className="text-xs text-muted-foreground">No qualities added yet.</p>}
                                
                                {miracle.qualities.map((quality) => (
                                <Card key={quality.id} className="p-2 bg-background/60 border-border/70 shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium">Quality Config</p>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemoveCustomArchetypeMandatoryMiracleQuality(index, quality.id)}>
                                        <Trash2 className="h-3 w-3 text-destructive"/>
                                    </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1">
                                    <div>
                                        <Label htmlFor={`${quality.id}-type-gm`} className="text-2xs">Type</Label>
                                        <Select value={quality.type} onValueChange={(v) => onCustomArchetypeMandatoryMiracleQualityChange(index, quality.id, 'type', v)}>
                                        <SelectTrigger id={`${quality.id}-type-gm`} className="h-7 text-xs"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {gmPowerQualityDefinitions.map(def => <SelectItem key={def.key} value={def.key} className="text-xs">{def.label}</SelectItem>)}
                                        </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor={`${quality.id}-capacity-gm`} className="text-2xs">Capacity</Label>
                                        <Select value={quality.capacity} onValueChange={(v) => onCustomArchetypeMandatoryMiracleQualityChange(index, quality.id, 'capacity', v as MiracleCapacityType)}>
                                        <SelectTrigger id={`${quality.id}-capacity-gm`} className="h-7 text-xs"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {POWER_CAPACITY_OPTIONS.map(cap => <SelectItem key={cap.value} value={cap.value} className="text-xs">{cap.label}</SelectItem>)}
                                        </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor={`${quality.id}-levels-gm`} className="text-2xs">Power Quality Levels</Label>
                                        <Input
                                        id={`${quality.id}-levels-gm`} type="number" min="0"
                                        value={String(Math.max(0, quality.levels || 0))}
                                        onChange={(e) => onCustomArchetypeMandatoryMiracleQualityChange(index, quality.id, 'levels', parseInt(e.target.value,10) || 0)}
                                        className="text-xs h-7" placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-2xs block">Eff. Factor (per ND)</Label>
                                        <Input type="text" readOnly value={String(calculateGmDisplayedNDFactor(quality))} className="text-xs h-7 bg-muted cursor-not-allowed" />
                                    </div>
                                    </div>

                                    {/* Extras for GM Quality */}
                                    <div className="mt-2 pt-1 border-t border-dashed">
                                      <Label className="text-2xs font-semibold">Extras</Label>
                                      {quality.extras.map(extra => (
                                        <div key={extra.id} className="my-0.5 text-2xs p-0.5 bg-primary/5 rounded-md">
                                          <div className="flex items-center space-x-1">
                                            {extra.isCustom ? (
                                              <>
                                                <Input value={extra.name} onChange={e => onCustomArchetypeMandatoryExtraOrFlawChange(index, quality.id, 'extra', extra.id, 'name', e.target.value)} placeholder="Custom Extra" className="flex-grow h-6 text-2xs"/>
                                                <Input type="number" value={String(extra.costModifier)} onChange={e => onCustomArchetypeMandatoryExtraOrFlawChange(index, quality.id, 'extra', extra.id, 'costModifier', parseInt(e.target.value) || 0)} className="w-12 h-6 text-2xs" placeholder="Cost"/>
                                              </>
                                            ) : ( <span className="flex-grow">{extra.name} ({extra.costModifier > 0 ? '+' : ''}{extra.costModifier})</span> )}
                                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality(index, quality.id, 'extra', extra.id)}><Trash2 className="h-2.5 w-2.5 text-destructive"/></Button>
                                          </div>
                                        </div>
                                      ))}
                                      <div className="flex items-end space-x-1 mt-0.5">
                                        <Select value={selectedExtraToAdd[`${index}-${quality.id}`] || ""} onValueChange={val => setSelectedExtraToAdd(prev => ({...prev, [`${index}-${quality.id}`]: val}))}>
                                            <SelectTrigger className="h-7 text-2xs flex-grow" ><SelectValue placeholder="Add Extra..."/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="custom_extra" className="text-xs">Custom Extra</SelectItem>
                                                {PREDEFINED_EXTRAS.map(ex => <SelectItem key={ex.id} value={ex.id} className="text-xs">{ex.name} ({ex.costModifier > 0 ? '+' : ''}{ex.costModifier})</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Button size="sm" className="h-7 text-2xs px-2" onClick={() => {
                                            const val = selectedExtraToAdd[`${index}-${quality.id}`];
                                            onAddExtraOrFlawToCustomArchetypeMandatoryQuality(index, quality.id, 'extra', val === 'custom_extra' ? undefined : val);
                                            setSelectedExtraToAdd(prev => ({...prev, [`${index}-${quality.id}`]: ""}));
                                        }} disabled={!selectedExtraToAdd[`${index}-${quality.id}`]}>Add</Button>
                                      </div>
                                    </div>
                                    {/* Flaws for GM Quality */}
                                    <div className="mt-2 pt-1 border-t border-dashed">
                                      <Label className="text-2xs font-semibold">Flaws</Label>
                                      {quality.flaws.map(flaw => (
                                        <div key={flaw.id} className="my-0.5 text-2xs p-0.5 bg-destructive/5 rounded-md">
                                          <div className="flex items-center space-x-1">
                                            {flaw.isCustom ? (
                                               <>
                                                <Input value={flaw.name} onChange={e => onCustomArchetypeMandatoryExtraOrFlawChange(index, quality.id, 'flaw', flaw.id, 'name', e.target.value)} placeholder="Custom Flaw" className="flex-grow h-6 text-2xs"/>
                                                <Input type="number" value={String(flaw.costModifier)} onChange={e => onCustomArchetypeMandatoryExtraOrFlawChange(index, quality.id, 'flaw', flaw.id, 'costModifier', parseInt(e.target.value) || 0)} className="w-12 h-6 text-2xs" placeholder="Cost"/>
                                               </>
                                            ) : ( <span className="flex-grow">{flaw.name} ({flaw.costModifier})</span>)}
                                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality(index, quality.id, 'flaw', flaw.id)}><Trash2 className="h-2.5 w-2.5 text-destructive"/></Button>
                                          </div>
                                        </div>
                                      ))}
                                      <div className="flex items-end space-x-1 mt-0.5">
                                        <Select value={selectedFlawToAdd[`${index}-${quality.id}`] || ""} onValueChange={val => setSelectedFlawToAdd(prev => ({...prev, [`${index}-${quality.id}`]: val}))}>
                                            <SelectTrigger className="h-7 text-2xs flex-grow" ><SelectValue placeholder="Add Flaw..."/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="custom_flaw" className="text-xs">Custom Flaw</SelectItem>
                                                {PREDEFINED_FLAWS.map(fl => <SelectItem key={fl.id} value={fl.id} className="text-xs">{fl.name} ({fl.costModifier})</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Button size="sm" className="h-7 text-2xs px-2" onClick={() => {
                                            const val = selectedFlawToAdd[`${index}-${quality.id}`];
                                            onAddExtraOrFlawToCustomArchetypeMandatoryQuality(index, quality.id, 'flaw', val === 'custom_flaw' ? undefined : val);
                                            setSelectedFlawToAdd(prev => ({...prev, [`${index}-${quality.id}`]: ""}));
                                        }} disabled={!selectedFlawToAdd[`${index}-${quality.id}`]}>Add</Button>
                                      </div>
                                    </div>
                                </Card>
                                ))}
                            </div>
                        </Card>
                      ))}
                    </div>
                  )}
                  {mq.configKey && mq.id !== 'mandatory_power' && mq.id !== 'inhuman_stats' && (
                    <div className="p-2 border rounded-md bg-muted/30 space-y-2">
                       <h5 className="text-xs font-semibold">Configuration:</h5>
                       {mq.configKey === 'intrinsicAllergyConfig' && (
                         <>
                           <div>
                             <Label htmlFor={`gm-${mq.id}-allergySubstance`} className="text-xs">Allergy Substance</Label>
                             <Select
                               value={customArchetypeData.intrinsicConfigs.intrinsicAllergyConfig[mq.id]?.substance}
                               onValueChange={(val) => onCustomArchetypeIntrinsicConfigChange(mq.id, 'intrinsicAllergyConfig', 'substance', val as AllergySubstanceType)}
                             >
                               <SelectTrigger id={`gm-${mq.id}-allergySubstance`} className="h-8 text-xs"><SelectValue placeholder="Select substance..."/></SelectTrigger>
                               <SelectContent>{ALLERGY_SUBSTANCES.map(s => <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>)}</SelectContent>
                             </Select>
                           </div>
                           <div>
                             <Label htmlFor={`gm-${mq.id}-allergyEffect`} className="text-xs">Allergy Effect</Label>
                             <Select
                               value={customArchetypeData.intrinsicConfigs.intrinsicAllergyConfig[mq.id]?.effect}
                               onValueChange={(val) => onCustomArchetypeIntrinsicConfigChange(mq.id, 'intrinsicAllergyConfig', 'effect', val as AllergyEffectType)}
                             >
                               <SelectTrigger id={`gm-${mq.id}-allergyEffect`} className="h-8 text-xs"><SelectValue placeholder="Select effect..."/></SelectTrigger>
                               <SelectContent>{ALLERGY_EFFECTS.map(e => <SelectItem key={e.value} value={e.value} className="text-xs">{e.label}</SelectItem>)}</SelectContent>
                             </Select>
                           </div>
                         </>
                       )}
                        {mq.configKey === 'intrinsicBruteFrailConfig' && ( <p className="text-xs text-muted-foreground">Brute/Frail config UI placeholder.</p> )}
                        {mq.configKey === 'intrinsicCustomStatsConfig' && ( <p className="text-xs text-muted-foreground">Custom Stats config UI placeholder.</p> )}
                        {mq.configKey === 'intrinsicVulnerableConfig' && ( <p className="text-xs text-muted-foreground">Vulnerable config UI placeholder.</p> )}
                    </div>
                  )}
                   {mq.id === 'inhuman_stats' && mq.configKey === 'inhumanStatsSettings' && (
                    <div className="p-2 border rounded-md bg-muted/30 space-y-3 mt-2">
                        <h5 className="text-xs font-semibold">Inhuman Stats Configuration:</h5>
                        {ALL_STATS_KEYS_GM.map(statKey => (
                            <div key={statKey} className="space-y-1 border-b border-border/50 pb-2 last:border-b-0 last:pb-0">
                                <Label className="text-xs font-medium capitalize">{statKey} Condition:</Label>
                                <Select
                                    value={customArchetypeData.inhumanStatsSettings?.[statKey]?.condition || 'normal'}
                                    onValueChange={(val) => onCustomArchetypeInhumanStatSettingChange(statKey, 'condition', val as AttributeCondition)}
                                >
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal" className="text-xs">Normal (Max 5D)</SelectItem>
                                        <SelectItem value="superior" className="text-xs">Superior (Max 10D)</SelectItem>
                                        <SelectItem value="inferior" className="text-xs">Inferior (Max 1-4D)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {customArchetypeData.inhumanStatsSettings?.[statKey]?.condition === 'inferior' && (
                                    <div className="pl-2 mt-1">
                                        <Label className="text-xs">Inferior Max Dice:</Label>
                                        <Select
                                            value={String(customArchetypeData.inhumanStatsSettings?.[statKey]?.inferiorMaxDice || 4)}
                                            onValueChange={(val) => onCustomArchetypeInhumanStatSettingChange(statKey, 'inferiorMaxDice', parseInt(val))}
                                        >
                                            <SelectTrigger className="h-8 text-xs mt-0.5"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {[1,2,3,4].map(d => <SelectItem key={d} value={String(d)} className="text-xs">{d}D</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        ))}
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


export function GmToolsTabContent({ 
  gmSettings, 
  onPointLimitChange,
  onToggleableItemChange,
  onWillpowerRestrictionChange,
  onMiracleNumericRestrictionChange,
  onExportSettings,
  onExportPower,
  customArchetypeData,
  onCustomArchetypeFieldChange,
  onCustomArchetypeMQSelectionChange,
  onCustomArchetypeMandatoryPowerCountChange,
  onCustomArchetypeMandatoryMiracleChange,
  onCustomArchetypeIntrinsicConfigChange,
  onCustomArchetypeInhumanStatSettingChange,
  onExportCustomArchetype,
  onCustomExtraCreationFieldChange,
  customExtraCreationData,
  onExportCustomExtra,
  onCustomFlawCreationFieldChange,
  customFlawCreationData,
  onExportCustomFlaw,
  onAddCustomArchetypeMandatoryMiracleQuality,
  onRemoveCustomArchetypeMandatoryMiracleQuality,
  onCustomArchetypeMandatoryMiracleQualityChange,
  onAddExtraOrFlawToCustomArchetypeMandatoryQuality,
  onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality,
  onCustomArchetypeMandatoryExtraOrFlawChange,
  allSkills,
} : GmToolsTabContentProps & { allSkills: SkillInstance[] }) { // Destructure allSkills prop


  const handleMiracleChange = (key: keyof MiracleDefinition, value: any) => {
    setCurrentMiracle(prevMiracle => ({
      ...prevMiracle,
      [key]: value
    }));
  };

  const handleRemoveQuality = (qualityIdToRemove: string) => {
    setCurrentMiracle(prevMiracle => ({
      ...prevMiracle,
      qualities: prevMiracle.qualities.filter(quality => quality.id !== qualityIdToRemove)
    }));
  };

  const handleQualityChange = (qualityIdToUpdate: string, field: keyof MiracleQuality, value: any) => {
    setCurrentMiracle(prevMiracle => ({
      ...prevMiracle,
      qualities: prevMiracle.qualities.map(quality => {
        if (quality.id === qualityIdToUpdate) {
          return { ...quality, [field]: value };
        }
        return quality;
      })
    }));
  };
  


  const handleAddQuality = () => {
    const newQuality: MiracleQuality = {
      id: uuidv4(), // Generate unique ID
      type: 'area', // Default type
      capacity: 'mass', // Default capacity
      levels: 0,
      extras: [],
      flaws: []
    };
    setCurrentMiracle(prevMiracle => ({ ...prevMiracle, qualities: [...prevMiracle.qualities, newQuality] }));
  };

  const handleResetMiracleCreator = () => {
 setCurrentMiracle({
 id: '', // This should ideally be a unique ID generator or handled server-side
 definitionId: undefined,
 name: '',
 description: '',
 dice: '0D',
 hardDice: '0HD',
 wiggleDice: '0WD',
 qualities: [],
 isMandatory: false,
 isCustom: true,
    });
  };
  const [currentMiracle, setCurrentMiracle] = React.useState<MiracleDefinition>({
    id: '', // This should ideally be a unique ID generator or handled server-side
    definitionId: undefined,
    name: '',
    description: '',
    dice: '0D',
    hardDice: '0HD',
    wiggleDice: '0WD',
    qualities: [],
    isMandatory: false, // This creator is for non-mandatory powers
 isCustom: true, // This is a custom miracle creator
  });

  const gmPowerQualityDefinitions = React.useMemo(() => getDynamicPowerQualityDefinitions([]), []);

  const calculateGmDisplayedNDFactor = (quality: MiracleQuality) => {
    const qualityDef = gmPowerQualityDefinitions.find(def => def.key === quality.type);
    if (!qualityDef) return 1;

    const baseCostFactor = qualityDef.baseCostFactor;
    const totalExtrasCostModifier = quality.extras.reduce((sum, ex) => sum + ex.costModifier, 0);
    const totalFlawsCostModifier = quality.flaws.reduce((sum, fl) => sum + fl.costModifier, 0);
    const effectiveCostModifier = quality.levels + totalExtrasCostModifier + totalFlawsCostModifier;

    return Math.max(1, baseCostFactor + effectiveCostModifier);
  };

  const renderToggleableList = (
    title: string, 
    items: Array<{id: string; name: string; label?: string}>, 
    checkedItems: {[id: string]: boolean}, 
    categoryKey: keyof Pick<GmSettings, 'sampleArchetypes' | 'metaQualitiesSource' | 'metaQualitiesPermission' | 'metaQualitiesIntrinsic' | 'sampleSkills'> | keyof GmSettings['miracleRestrictions']
  ) => (
    <CollapsibleSectionItem title={title} value={`gm-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <Card>
        <CardContent className="pt-6 space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`gm-${categoryKey}-${item.id}`}
                checked={checkedItems[item.id] === undefined ? true : checkedItems[item.id]}
                onCheckedChange={(checked) => onToggleableItemChange(categoryKey, item.id, !!checked)}
              />
              <Label htmlFor={`gm-${categoryKey}-${item.id}`} className="text-sm font-normal">
                {item.label || item.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </CollapsibleSectionItem>
  );


  return (<Accordion type="multiple" className="w-full space-y-6">
      <CollapsibleSectionItem title="Character Creation Parameters">
        <Card>
          <CardContent className="pt-6">
            <Accordion type="multiple" className="w-full space-y-4">
              <CollapsibleSectionItem title="Point Restrictions" value="gm-point-restrictions">
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    {(Object.keys(gmSettings.pointRestrictions) as Array<keyof GmSettings['pointRestrictions']>).map(key => (
                      <div key={key} className="grid grid-cols-2 items-center gap-2">
                        <Label htmlFor={`gm-${key}`} className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/Limit$/, ' Limit:')}
                        </Label>
                        <Input
                          id={`gm-${key}`}
                          type="number"
                          min="0"
                          placeholder="None"
                          value={gmSettings.pointRestrictions[key] === undefined ? '' : String(gmSettings.pointRestrictions[key])}
                          onChange={(e) => onPointLimitChange(key, e.target.value)}
                          className="w-24"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </CollapsibleSectionItem>
              
              {renderToggleableList(
                "Sample Archetypes Restrictions", 
                ARCHETYPES.filter(a => a.id !== 'custom'), 
                gmSettings.sampleArchetypes, 
                'sampleArchetypes'
              )}
              
              <CollapsibleSectionItem title="Sample Meta-Quality Restrictions" value="gm-meta-quality-restrictions">
                 <Card>
                  <CardContent className="pt-6">
                    <Accordion type="multiple" className="w-full space-y-2">
                        {renderToggleableList("Source Meta-Qualities", SOURCE_META_QUALITIES, gmSettings.metaQualitiesSource, 'metaQualitiesSource')}
                        {renderToggleableList("Permission Meta-Qualities", PERMISSION_META_QUALITIES, gmSettings.metaQualitiesPermission, 'metaQualitiesPermission')}
                        {renderToggleableList("Intrinsic Meta-Qualities", INTRINSIC_META_QUALITIES, gmSettings.metaQualitiesIntrinsic, 'metaQualitiesIntrinsic')}
                    </Accordion>
                  </CardContent>
                </Card>
              </CollapsibleSectionItem>

              {renderToggleableList(
                "Sample Skill Restrictions", 
                SKILL_DEFINITIONS, 
                gmSettings.sampleSkills, 
                'sampleSkills'
              )}

              <CollapsibleSectionItem title="Willpower Restrictions" value="gm-willpower-restrictions">
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="grid grid-cols-2 items-center gap-2">
                      <Label htmlFor="gm-maxBaseWill" className="font-medium">Max Base Will:</Label>
                      <Input
                        id="gm-maxBaseWill" type="number" min="0" placeholder="None"
                        value={gmSettings.willpowerRestrictions.maxBaseWill === undefined ? '' : String(gmSettings.willpowerRestrictions.maxBaseWill)}
                        onChange={(e) => onWillpowerRestrictionChange('maxBaseWill', e.target.value)}
                        className="w-24"
                      />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                      <Label htmlFor="gm-maxTotalWill" className="font-medium">Max Total Will:</Label>
                      <Input
                        id="gm-maxTotalWill" type="number" min="0" placeholder="None"
                        value={gmSettings.willpowerRestrictions.maxTotalWill === undefined ? '' : String(gmSettings.willpowerRestrictions.maxTotalWill)}
                        onChange={(e) => onWillpowerRestrictionChange('maxTotalWill', e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleSectionItem>

              <CollapsibleSectionItem title="Miracle Restrictions" value="gm-miracle-restrictions">
                 <Card>
                  <CardContent className="pt-6">
                    <Accordion type="multiple" className="w-full space-y-2">
                        {renderToggleableList(
                            "Allowed Sample Miracles", 
                            PREDEFINED_MIRACLES_TEMPLATES.filter(m => m.definitionId).map(m => ({id: m.definitionId as string, name: m.name})), 
                            gmSettings.miracleRestrictions.allowedSampleMiracles, 
                            'allowedSampleMiracles'
                        )}
                        {renderToggleableList("Allowed Qualities", POWER_QUALITY_DEFINITIONS.map(q => ({id: q.key, name: q.label})), gmSettings.miracleRestrictions.allowedQualities, 'allowedQualities')}
                        {renderToggleableList("Allowed Capacities", POWER_CAPACITY_OPTIONS.map(c => ({id: c.value, name: c.label})), gmSettings.miracleRestrictions.allowedCapacities, 'allowedCapacities')}
                        {renderToggleableList("Allowed Extras", PREDEFINED_EXTRAS, gmSettings.miracleRestrictions.allowedExtras, 'allowedExtras')}
                        {renderToggleableList("Allowed Flaws", PREDEFINED_FLAWS, gmSettings.miracleRestrictions.allowedFlaws, 'allowedFlaws')}
                       
                        <CollapsibleSectionItem title="Max Power Quality Levels" value="gm-max-pq-levels">
                            <Card><CardContent className="pt-4">
                                <div className="grid grid-cols-2 items-center gap-2">
                                <Label htmlFor="gm-maxPQLevels" className="font-medium">Max Levels:</Label>
                                <Input
                                    id="gm-maxPQLevels" type="number" min="0" placeholder="None"
                                    value={gmSettings.miracleRestrictions.numericRestrictions.maxPowerQualityLevels === undefined ? '' : String(gmSettings.miracleRestrictions.numericRestrictions.maxPowerQualityLevels)}
                                    onChange={(e) => onMiracleNumericRestrictionChange('maxPowerQualityLevels', e.target.value)}
                                    className="w-24"
                                />
                                </div>
                            </CardContent></Card>
                        </CollapsibleSectionItem>
                        <CollapsibleSectionItem title="Max Dice of each type in a Miracle" value="gm-max-dice-miracle">
                             <Card><CardContent className="pt-4">
                                <div className="grid grid-cols-2 items-center gap-2">
                                <Label htmlFor="gm-maxDicePerType" className="font-medium">Max Dice (per type):</Label>
                                <Input
                                    id="gm-maxDicePerType" type="number" min="0" placeholder="None"
                                     value={gmSettings.miracleRestrictions.numericRestrictions.maxDicePerType === undefined ? '' : String(gmSettings.miracleRestrictions.numericRestrictions.maxDicePerType)}
                                    onChange={(e) => onMiracleNumericRestrictionChange('maxDicePerType', e.target.value)}
                                    className="w-24"
                                />
                                </div>
                            </CardContent></Card>
                        </CollapsibleSectionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </CollapsibleSectionItem>
            </Accordion>
            <div className="mt-6 flex justify-end">
              <Button onClick={onExportSettings}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Character Creation Parameters
              </Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="Custom Archetype Creation" value="gm-custom-archetype-creation">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="gm-customArchName" className="font-headline">Archetype Name</Label>
              <Input id="gm-customArchName" value={customArchetypeData.name} onChange={(e) => onCustomArchetypeFieldChange('name', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="gm-customArchDesc" className="font-headline">Archetype Description</Label>
              <Textarea id="gm-customArchDesc" value={customArchetypeData.description} onChange={(e) => onCustomArchetypeFieldChange('description', e.target.value)} />
            </div>
            
            <GmMetaQualityCollapsible
              title="Source Meta-Qualities"
              mqList={SOURCE_META_QUALITIES}
              selectedMQIds={customArchetypeData.sourceMQIds}
              onMQSelectionChange={(mqId, isSelected) => onCustomArchetypeMQSelectionChange('source', mqId, isSelected)}
              customArchetypeData={customArchetypeData}
              onCustomArchetypeIntrinsicConfigChange={onCustomArchetypeIntrinsicConfigChange}
              onCustomArchetypeInhumanStatSettingChange={onCustomArchetypeInhumanStatSettingChange}
              onCustomArchetypeMandatoryPowerCountChange={onCustomArchetypeMandatoryPowerCountChange}
              onCustomArchetypeMandatoryMiracleChange={onCustomArchetypeMandatoryMiracleChange}
              mqType="source"
              onAddCustomArchetypeMandatoryMiracleQuality={onAddCustomArchetypeMandatoryMiracleQuality}
              onRemoveCustomArchetypeMandatoryMiracleQuality={onRemoveCustomArchetypeMandatoryMiracleQuality}
              onCustomArchetypeMandatoryMiracleQualityChange={onCustomArchetypeMandatoryMiracleQualityChange}
              onAddExtraOrFlawToCustomArchetypeMandatoryQuality={onAddExtraOrFlawToCustomArchetypeMandatoryQuality}
              onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality={onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality}
              onCustomArchetypeMandatoryExtraOrFlawChange={onCustomArchetypeMandatoryExtraOrFlawChange}
              allSkills={allSkills}
            />
             <GmMetaQualityCollapsible
              title="Permission Meta-Qualities"
              mqList={PERMISSION_META_QUALITIES}
              selectedMQIds={customArchetypeData.permissionMQIds}
              onMQSelectionChange={(mqId, isSelected) => onCustomArchetypeMQSelectionChange('permission', mqId, isSelected)}
              customArchetypeData={customArchetypeData}
              onCustomArchetypeIntrinsicConfigChange={onCustomArchetypeIntrinsicConfigChange}
              onCustomArchetypeInhumanStatSettingChange={onCustomArchetypeInhumanStatSettingChange}
              onCustomArchetypeMandatoryPowerCountChange={onCustomArchetypeMandatoryPowerCountChange}
              onCustomArchetypeMandatoryMiracleChange={onCustomArchetypeMandatoryMiracleChange}
              mqType="permission"
              onAddCustomArchetypeMandatoryMiracleQuality={onAddCustomArchetypeMandatoryMiracleQuality}
              onRemoveCustomArchetypeMandatoryMiracleQuality={onRemoveCustomArchetypeMandatoryMiracleQuality}
              onCustomArchetypeMandatoryMiracleQualityChange={onCustomArchetypeMandatoryMiracleQualityChange}
              onAddExtraOrFlawToCustomArchetypeMandatoryQuality={onAddExtraOrFlawToCustomArchetypeMandatoryQuality}
              onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality={onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality}
              onCustomArchetypeMandatoryExtraOrFlawChange={onCustomArchetypeMandatoryExtraOrFlawChange}
              allSkills={allSkills}
            />
             <GmMetaQualityCollapsible
              title="Intrinsic Meta-Qualities"
              mqList={INTRINSIC_META_QUALITIES}
              selectedMQIds={customArchetypeData.intrinsicMQIds}
              onMQSelectionChange={(mqId, isSelected) => onCustomArchetypeMQSelectionChange('intrinsic', mqId, isSelected)}
              customArchetypeData={customArchetypeData}
              onCustomArchetypeIntrinsicConfigChange={onCustomArchetypeIntrinsicConfigChange}
              onCustomArchetypeInhumanStatSettingChange={onCustomArchetypeInhumanStatSettingChange}
              onCustomArchetypeMandatoryPowerCountChange={onCustomArchetypeMandatoryPowerCountChange}
              onCustomArchetypeMandatoryMiracleChange={onCustomArchetypeMandatoryMiracleChange}
              mqType="intrinsic"
              onAddCustomArchetypeMandatoryMiracleQuality={onAddCustomArchetypeMandatoryMiracleQuality}
              onRemoveCustomArchetypeMandatoryMiracleQuality={onRemoveCustomArchetypeMandatoryMiracleQuality}
              onCustomArchetypeMandatoryMiracleQualityChange={onCustomArchetypeMandatoryMiracleQualityChange}
              onAddExtraOrFlawToCustomArchetypeMandatoryQuality={onAddExtraOrFlawToCustomArchetypeMandatoryQuality}
              onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality={onRemoveExtraOrFlawFromCustomArchetypeMandatoryQuality}
              onCustomArchetypeMandatoryExtraOrFlawChange={onCustomArchetypeMandatoryExtraOrFlawChange}
              allSkills={allSkills}
            />

            <div className="mt-6 flex justify-end">
              <Button onClick={onExportCustomArchetype}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Custom Archetype
              </Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="Custom Power Creation">
       <Card>
       <CardContent className="pt-6 space-y-4">
 <Accordion type="multiple" className="w-full space-y-4">
        {/* Miracle Creation Section */}
        {/* Miracle Name and Description */}
                <div>
        <Label htmlFor="miracleName" className="font-headline">Miracle Name</Label>
        <Input
        id="miracleName"
        value={currentMiracle.name}
        onChange={(e) => handleMiracleChange('name', e.target.value)}
        placeholder="Enter the name of the Miracle"
        />
                </div>
                <div>
        <Label htmlFor="miracleDescription" className="font-headline">Description</Label>
        <Textarea
        id="miracleDescription"
        value={currentMiracle.description}
        onChange={(e) => handleMiracleChange('description', e.target.value)}
        placeholder="Describe the Miracle's effects"
        />
                </div>

        {/* Dice Pools */}
                <div className="grid grid-cols-3 gap-4">
        <div>
        <Label htmlFor="normalDice">Normal Dice</Label>
        <Select
                         value={currentMiracle.dice}
                        onValueChange={(value) => handleMiracleChange('dice', value)}
        >
        <SelectTrigger id="normalDice"><SelectValue /></SelectTrigger>
        <SelectContent>
        {Array.from({ length: 11 }, (_, i) => `${i}D`).map(d => (
        <SelectItem key={d} value={d}>{d}</SelectItem>
        ))}
        </SelectContent>
        </Select>
        </div>
        <div>
        <Label htmlFor="hardDice">Hard Dice</Label>
        <Select
                         value={currentMiracle.hardDice}
                         onValueChange={(value) => handleMiracleChange('hardDice', value)}
        >
        <SelectTrigger id="hardDice"><SelectValue /></SelectTrigger>
        <SelectContent>
        {Array.from({ length: 11 }, (_, i) => `${i}HD`).map(d => (
        <SelectItem key={d} value={d}>{d}</SelectItem>
        ))}
        </SelectContent>
        </Select>
        </div>
        <div>
        <Label htmlFor="wiggleDice">Wiggle Dice</Label>
        <Select
                         value={currentMiracle.wiggleDice}
                        onValueChange={(value) => handleMiracleChange('wiggleDice', value)}
        >
        <SelectTrigger id="wiggleDice"><SelectValue /></SelectTrigger>
        <SelectContent>
        {Array.from({ length: 11 }, (_, i) => `${i}WD`).map(d => (
        <SelectItem key={d} value={d}>{d}</SelectItem>
        ))}
        </SelectContent>
        </Select>
        </div>
                       </div>
               {/* Miracle Qualities */}
                  <div className="space-y-3 mt-6">
        <div className="flex justify-between items-center">
        <h4 className="text-lg font-headline">Miracle Qualities</h4>
        <Button size="sm" variant="outline" onClick={handleAddQuality}
        >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Quality
        </Button>
        </div>
        {currentMiracle.qualities.length === 0 && (
        <p className="text-sm text-muted-foreground">Add qualities to define the Miracle's nature.</p>
        )}
        {currentMiracle.qualities.map(quality => (
        <Card key={quality.id} className="p-4 space-y-3">
        <div className="flex justify-between items-center">
        <h5 className="text-sm font-semibold">Quality Configuration</h5>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveQuality(quality.id)}>
        <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
        <Label htmlFor={`${quality.id}-type`}>Type</Label>
        <Select value={quality.type} onValueChange={(value) => handleQualityChange(quality.id, 'type', value)}>
        <SelectTrigger id={`${quality.id}-type`}><SelectValue /></SelectTrigger>
        <SelectContent>
        {POWER_QUALITY_DEFINITIONS.map(def => (
        <SelectItem key={def.key} value={def.key}>{def.label}</SelectItem>
        ))}
        </SelectContent>
        </Select>
        </div>
        <div>
        <Label htmlFor={`${quality.id}-capacity`}>Capacity</Label>
        <Select value={quality.capacity} onValueChange={(value) => handleQualityChange(quality.id, 'capacity', value as MiracleCapacityType)}>
        <SelectTrigger id={`${quality.id}-capacity`}><SelectValue /></SelectTrigger>
        <SelectContent>
        {POWER_CAPACITY_OPTIONS.map(cap => (
        <SelectItem key={cap.value} value={cap.value}>{cap.label}</SelectItem>
        ))}
        </SelectContent>
        </Select>
        </div>
        <div>
        <Label htmlFor={`${quality.id}-levels`}>Power Quality Levels</Label>
        <Input
        id={`${quality.id}-levels`}
        type="number"
        min="0"
        value={String(quality.levels)}
        onChange={(e) => handleQualityChange(quality.id, 'levels', parseInt(e.target.value, 10) || 0)}
        placeholder="0"
        />
        </div>
        </div>
        </Card>
        ))}
                        </div>
         {/* Calculated Costs */}
 <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
 <p><strong className="font-semibold">Miracle Quality Cost Factors (per ND):</strong></p>
 {/* Display individual quality costs */}
 {currentMiracle.qualities.length > 0 ? (
 <ul className="list-disc list-inside pl-4 space-y-1"> 
 {currentMiracle.qualities.map(q => {
                                        const qDef = gmPowerQualityDefinitions.find(def => def.key === q.type);
                                        const factor = calculateGmDisplayedNDFactor(q);
 return <li key={`${currentMiracle.id}-${q.id}-factor-display`}>{qDef?.label || q.type}: {factor} points</li>;
                                    })}
         
 </ul>
 ) : (
 <p className="ml-4 text-muted-foreground">No qualities added.</p> )}
 {/* Display total cost per ND */}
 <p><strong className="font-semibold">Miracle Cost Per ND:</strong> {currentMiracle.qualities.reduce((sum, quality) => sum + calculateSingleMiracleQualityCost(quality, currentMiracle, allSkills) / Math.max(1, parseInt(currentMiracle.dice, 10) + parseInt(currentMiracle.hardDice, 10) + parseInt(currentMiracle.wiggleDice, 10)), 0)} points</p> {/* Pass allSkills */}

 {/* Display total miracle cost */}
 <p><strong className="font-semibold">Total Miracle Cost:</strong> {calculateSingleMiracleTotalCost(currentMiracle, allSkills)} points</p>
 </div> {/* Pass allSkills */}
                       {/* Actions */}
        <div className="flex justify-end space-x-2 mt-6">
                         <Button variant="outline" onClick={handleResetMiracleCreator}>Reset</Button>
        <Button onClick={() => onExportPower(currentMiracle)}>  <Download className="mr-2 h-4 w-4" />
        Export Custom power</Button>
                </div>

 </Accordion>
 </CardContent>
 </Card>
      </CollapsibleSectionItem>

   <CollapsibleSectionItem title="Custom Extra Creation" value="gm-custom-extra-creation">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div>
              <Label htmlFor="gm-customExtraName" className="font-headline">Name</Label>
              <Input 
                id="gm-customExtraName" 
                placeholder="e.g., Lingering Damage" 
                value={customExtraCreationData?.name || ''} 
                onChange={(e) => onCustomExtraCreationFieldChange('name', e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="gm-customExtraDesc" className="font-headline">Description</Label>
              <Textarea 
                id="gm-customExtraDesc" 
                placeholder="Describe how this extra modifies a power quality..." 
                value={customExtraCreationData?.description || ''} 
                onChange={(e) => onCustomExtraCreationFieldChange('description', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="gm-customExtraCost" className="font-headline">Cost Modifier (per die)</Label>
 <Input
 id="gm-customExtraCost"
 type="number"
 min="0" // Add min attribute
 placeholder="e.g., 1 or 2"
 value={customExtraCreationData?.costModifier === undefined ? '' : String(customExtraCreationData.costModifier)}
 onChange={(e) => onCustomExtraCreationFieldChange('costModifier', parseInt(e.target.value) || 0)}
 />
            </div>
             <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={onExportCustomExtra}>Export Custom Extra</Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
   <CollapsibleSectionItem title="Custom Flaw Creation" value="gm-custom-flaw-creation">
  <Card>
    <CardContent className="pt-6 space-y-3">
      <div>
        <Label htmlFor="gm-customFlawName" className="font-headline">Name</Label>
        <Input
          id="gm-customFlawName"
          placeholder="e.g., Unreliable Trigger"
          value={customFlawCreationData?.name || ''} // Bind value
          onChange={(e) => onCustomFlawCreationFieldChange('name', e.target.value)} // Bind onChange
        />
      </div>
      <div>
        <Label htmlFor="gm-customFlawDesc" className="font-headline">Description</Label>
        <Textarea
          id="gm-customFlawDesc"
          placeholder="Describe how this flaw restricts a power quality..."
          value={customFlawCreationData?.description || ''} // Bind value
          onChange={(e) => onCustomFlawCreationFieldChange('description', e.target.value)} // Bind onChange
        />
      </div>
      <div>
        <Label htmlFor="gm-customFlawCost" className="font-headline">Cost Modifier (per die)</Label>
        <Input
          id="gm-customFlawCost"
          type="number"
 placeholder="e.g., -1 or -2"
 value={customFlawCreationData?.costModifier === undefined ? '' : String(customFlawCreationData.costModifier)}
 onChange={(e) => {
 const value = parseInt(e.target.value, 10);
 if (isNaN(value)) {
 onCustomFlawCreationFieldChange('costModifier', '');
 } else
 if (isNaN(value) || value >= 0) {
 onCustomFlawCreationFieldChange('costModifier', 0);
 } else {
 onCustomFlawCreationFieldChange('costModifier', value);
 }
          }}
        />
      </div>
      <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onExportCustomFlaw}>Export Custom Flaw</Button>
      </div>
    </CardContent>
  </Card>
</CollapsibleSectionItem>
    </Accordion>
  );
}


