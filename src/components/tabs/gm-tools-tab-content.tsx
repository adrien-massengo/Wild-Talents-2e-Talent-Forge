
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
import { Download } from "lucide-react";

import { ARCHETYPES, SOURCE_META_QUALITIES, PERMISSION_META_QUALITIES, INTRINSIC_META_QUALITIES } from "@/lib/character-definitions";
import { SKILL_DEFINITIONS } from "@/lib/skills-definitions";
import { PREDEFINED_MIRACLES_TEMPLATES, POWER_QUALITY_DEFINITIONS, POWER_CAPACITY_OPTIONS, PREDEFINED_EXTRAS, PREDEFINED_FLAWS } from "@/lib/miracles-definitions";


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
}


export function GmToolsTabContent({ 
  gmSettings, 
  onPointLimitChange,
  onToggleableItemChange,
  onWillpowerRestrictionChange,
  onMiracleNumericRestrictionChange,
  onExportSettings 
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
      <CollapsibleSectionItem title="Custom Archetype Creation">
        <Card>
          <CardContent className="pt-6 text-sm">
            <p>Custom Archetype Creation tools will be available here in a future update.</p>
            <p className="mt-2 text-muted-foreground">
              This might guide GMs through balancing and defining new archetypes for their game world.
            </p>
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
