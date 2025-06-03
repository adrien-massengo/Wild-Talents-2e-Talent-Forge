
// src/components/tabs/gm-tools-tab-content.tsx
"use client";

import * as React from "react";
import type { GmSettings } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Download, PlusCircle, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MiracleDefinition } from "@/lib/miracles-definitions";


import { 
  ARCHETYPES, SOURCE_META_QUALITIES, PERMISSION_META_QUALITIES, INTRINSIC_META_QUALITIES,
  ALLERGY_SUBSTANCES, ALLERGY_EFFECTS, type AllergySubstanceType, type AllergyEffectType,
  type BruteFrailType, type DiscardedAttributeType, type InhumanStatsSettings, type InhumanStatSetting, type AttributeCondition
} from "@/lib/character-definitions";
import { SKILL_DEFINITIONS } from "@/lib/skills-definitions";
import { PREDEFINED_MIRACLES_TEMPLATES, POWER_QUALITY_DEFINITIONS, POWER_CAPACITY_OPTIONS, PREDEFINED_EXTRAS, PREDEFINED_FLAWS } from "@/lib/miracles-definitions";

const ALL_STATS_KEYS_GM = ['body', 'coordination', 'sense', 'mind', 'charm', 'command'] as const;


// Interface for the data structure of the custom archetype being created
export interface CustomArchetypeCreationData {
  name: string;
  description: string;
  sourceMQIds: string[];
  permissionMQIds: string[];
  intrinsicMQIds: string[];
  intrinsicConfigs: { // For intrinsics other than mandatory power
    intrinsicAllergyConfig: { [mqId: string]: { substance?: AllergySubstanceType; effect?: AllergyEffectType } };
    intrinsicBruteFrailConfig: { [mqId: string]: { type?: BruteFrailType } };
    intrinsicCustomStatsConfig: { [mqId: string]: { discardedAttribute?: DiscardedAttributeType } };
    intrinsicVulnerableConfig: { [mqId: string]: { extraBoxes?: number } };
  };
  mandatoryPowerDetails: { // Specific for 'mandatory_power' intrinsic
    count: number;
    miracles: MiracleDefinition[]; // Full MiracleDefinition for flexibility, though GM tool might only edit basics
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

  // Props for Custom Archetype Creation
  customArchetypeData: CustomArchetypeCreationData;
  onCustomArchetypeFieldChange: (field: keyof Omit<CustomArchetypeCreationData, 'sourceMQIds' | 'permissionMQIds' | 'intrinsicMQIds' | 'intrinsicConfigs' | 'mandatoryPowerDetails' | 'inhumanStatsSettings'>, value: string) => void;
  onCustomArchetypeMQSelectionChange: (mqType: 'source' | 'permission' | 'intrinsic', mqId: string, isSelected: boolean) => void;
  onCustomArchetypeMandatoryPowerCountChange: (newCount: string) => void;
  onCustomArchetypeMandatoryMiracleChange: (miracleIndex: number, field: keyof Pick<MiracleDefinition, 'name' | 'description' | 'dice' | 'hardDice' | 'wiggleDice'>, value: string) => void;
  onCustomArchetypeIntrinsicConfigChange: (metaQualityId: string, configKey: keyof CustomArchetypeCreationData['intrinsicConfigs'], field: string, value: any) => void;
  onCustomArchetypeInhumanStatSettingChange: (statName: keyof InhumanStatsSettings, field: keyof InhumanStatSetting, value: any) => void;
  onExportCustomArchetype: () => void;
}

const GmMetaQualityCollapsible: React.FC<{
  title: string;
  mqList: typeof SOURCE_META_QUALITIES | typeof PERMISSION_META_QUALITIES | typeof INTRINSIC_META_QUALITIES;
  selectedMQIds: string[];
  onMQSelectionChange: (mqId: string, isSelected: boolean) => void;
  customArchetypeData: CustomArchetypeCreationData;
  onCustomArchetypeIntrinsicConfigChange: GmToolsTabContentProps['onCustomArchetypeIntrinsicConfigChange'];
  onCustomArchetypeInhumanStatSettingChange: GmToolsTabContentProps['onCustomArchetypeInhumanStatSettingChange'];
  onCustomArchetypeMandatoryPowerCountChange: GmToolsTabContentProps['onCustomArchetypeMandatoryPowerCountChange'];
  onCustomArchetypeMandatoryMiracleChange: GmToolsTabContentProps['onCustomArchetypeMandatoryMiracleChange'];
  mqType: 'source' | 'permission' | 'intrinsic';
}> = ({
  title, mqList, selectedMQIds, onMQSelectionChange,
  customArchetypeData, onCustomArchetypeIntrinsicConfigChange, onCustomArchetypeInhumanStatSettingChange,
  onCustomArchetypeMandatoryPowerCountChange, onCustomArchetypeMandatoryMiracleChange,
  mqType
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
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
                        <Card key={miracle.id} className="p-2 my-2 bg-background/80">
                          <Label className="text-xs font-semibold block mb-1">Mandatory Power {index + 1}</Label>
                          <Input
                            placeholder="Miracle Name"
                            value={miracle.name}
                            onChange={e => onCustomArchetypeMandatoryMiracleChange(index, 'name', e.target.value)}
                            className="h-8 text-xs mb-1"
                          />
                          <Textarea
                            placeholder="Miracle Description"
                            value={miracle.description}
                            onChange={e => onCustomArchetypeMandatoryMiracleChange(index, 'description', e.target.value)}
                            className="text-xs mb-1 min-h-[40px]"
                          />
                           <div className="grid grid-cols-3 gap-1">
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
                          {/* Full quality editing UI for GM-defined miracles is omitted for brevity here but could be added */}
                        </Card>
                      ))}
                    </div>
                  )}
                  {mq.configKey && mq.id !== 'mandatory_power' && mq.id !== 'inhuman_stats' && ( // Standard config for other intrinsics
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
                        {mq.configKey === 'intrinsicBruteFrailConfig' && ( /* Similar structure for Brute/Frail */ )}
                        {mq.configKey === 'intrinsicCustomStatsConfig' && ( /* Similar structure for Custom Stats */ )}
                        {mq.configKey === 'intrinsicVulnerableConfig' && ( /* Similar structure for Vulnerable */ )}
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
  customArchetypeData,
  onCustomArchetypeFieldChange,
  onCustomArchetypeMQSelectionChange,
  onCustomArchetypeMandatoryPowerCountChange,
  onCustomArchetypeMandatoryMiracleChange,
  onCustomArchetypeIntrinsicConfigChange,
  onCustomArchetypeInhumanStatSettingChange,
  onExportCustomArchetype
}: GmToolsTabContentProps) {

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
                checked={checkedItems[item.id] === undefined ? true : checkedItems[item.id]} // Default to true if undefined
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


  return (
    <Accordion type="multiple" className="w-full space-y-6">
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
                        {renderToggleableList("Allowed Sample Miracles", PREDEFINED_MIRACLES_TEMPLATES.map(m => ({id: m.definitionId!, name: m.name})).filter(m => m.id), gmSettings.miracleRestrictions.allowedSampleMiracles, 'allowedSampleMiracles')}
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
          <CardContent className="pt-6 text-sm">
            <p>Custom Power Creation tools will be available here in a future update.</p>
            <p className="mt-2 text-muted-foreground">
              This tool could assist GMs in designing and costing new Miracles or power qualities.
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="Custom Extra Creation">
        <Card>
          <CardContent className="pt-6 text-sm">
            <p>Custom Extra Creation tools will be available here in a future update.</p>
            <p className="mt-2 text-muted-foreground">
              Aids for GMs to create balanced custom Extras for powers.
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="Custom Flaw Creation">
        <Card>
          <CardContent className="pt-6 text-sm">
            <p>Custom Flaw Creation tools will be available here in a future update.</p>
            <p className="mt-2 text-muted-foreground">
              Aids for GMs to create balanced custom Flaws for powers.
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
    </Accordion>
  );
}

    