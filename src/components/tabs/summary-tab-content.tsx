
// src/components/tabs/summary-tab-content.tsx
"use client";

import type { CharacterData, StatDetail, SkillInstance, BasicInfo } from "@/app/page";
import type { MiracleDefinition } from "@/lib/miracles-definitions";
import { DiscardedAttributeType } from "@/lib/character-definitions";
import { 
  bodyEffectsData, coordinationEffectsData, senseEffectsData, mindEffectsData, charmEffectsData, commandEffectsData, skillExamplesData,
  type BodyEffectData, type CoordinationEffectData, type SenseEffectData, type MindEffectData, type CharmEffectData, type CommandEffectData, type SkillExampleData
} from "@/lib/effects-definitions";
import {
  calculateTotalStatPoints,
  calculateTotalWillpowerPoints,
  calculateTotalSkillPoints,
  calculateTotalMiraclePoints,
  calculateCurrentArchetypeCost,
  calculateSingleStatPoints, // For individual stat cost if needed for display, though total is primary
  calculateSingleSkillPoints, // For individual skill cost if needed
} from "@/lib/cost-calculations";


import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface SummaryTabContentProps {
  characterData: CharacterData;
  onPointLimitChange: (value: number) => void;
  onSubPointLimitChange: (limitType: 'archetype' | 'stat' | 'skill' | 'willpower' | 'miracle', value: string) => void;
  discardedAttribute?: DiscardedAttributeType;
  calculatedBaseWillFromStats: number;
  totalBaseWill: number;
  totalWill: number;
  purchasedBaseWill: number;
  purchasedWill: number;
  hasNoBaseWillIntrinsic: boolean;
  hasNoWillpowerIntrinsic: boolean;
}

const formatStatDisplay = (stat: StatDetail | undefined) => {
  if (!stat) return "N/A";
  let display = stat.dice || "0D";
  if (stat.hardDice && stat.hardDice !== "0HD") {
    display += ` ${stat.hardDice}`;
  }
  if (stat.wiggleDice && stat.wiggleDice !== "0WD") {
    display += ` ${stat.wiggleDice}`;
  }
  return display;
};


const formatSkillDisplay = (skill: SkillInstance | undefined) => {
  if (!skill) return "N/A";
  let display = skill.dice || "0D";
  if (skill.hardDice && skill.hardDice !== "0HD") {
    display += ` ${skill.hardDice}`;
  }
  if (skill.wiggleDice && skill.wiggleDice !== "0WD") {
    display += ` ${skill.wiggleDice}`;
  }
  return display;
}

const getEffectiveNormalDiceForEffects = (item: StatDetail | SkillInstance | undefined): number => {
  if (!item) return 0;
  const normalDice = parseInt(item.dice?.replace('D', '') || '0', 10);
  const hardDice = parseInt(item.hardDice?.replace('HD', '') || '0', 10);
  const wiggleDice = parseInt(item.wiggleDice?.replace('WD', '') || '0', 10);
  return normalDice + hardDice + wiggleDice;
};


export function SummaryTabContent({ 
    characterData, 
    onPointLimitChange, 
    onSubPointLimitChange,
    discardedAttribute,
    calculatedBaseWillFromStats,
    totalBaseWill,
    totalWill,
    purchasedBaseWill,
    purchasedWill,
    hasNoBaseWillIntrinsic,
    hasNoWillpowerIntrinsic,
}: SummaryTabContentProps) {
  const { basicInfo, stats, willpower, skills, miracles, pointLimit, archetypePointLimit, statPointLimit, skillPointLimit, willpowerPointLimit, miraclePointLimit } = characterData;

  const currentTotalStatPoints = calculateTotalStatPoints(stats, discardedAttribute);
  const currentTotalWillpowerPoints = calculateTotalWillpowerPoints(purchasedBaseWill, purchasedWill, hasNoBaseWillIntrinsic, hasNoWillpowerIntrinsic);
  const currentTotalSkillPoints = calculateTotalSkillPoints(skills);
  const currentTotalMiraclePoints = calculateTotalMiraclePoints(miracles, skills);
  const currentArchetypePointCost = calculateCurrentArchetypeCost(basicInfo);
  
  const grandTotalPoints = currentTotalStatPoints + currentTotalWillpowerPoints + currentTotalSkillPoints + currentTotalMiraclePoints + currentArchetypePointCost;
  
  const sumOfSubLimits = 
    (archetypePointLimit || 0) +
    (statPointLimit || 0) +
    (willpowerPointLimit || 0) +
    (skillPointLimit || 0) +
    (miraclePointLimit || 0);

  const getStatEffectDescription = (statName: keyof CharacterData['stats'], statValue: StatDetail) => {
    const effectiveDice = Math.min(getEffectiveNormalDiceForEffects(statValue), 10);
    if (effectiveDice === 0) return "N/A";

    const diceStr = `${effectiveDice}d`;
    let effectEntry;

    switch (statName) {
      case 'body':
        effectEntry = bodyEffectsData.find(e => e.dice === diceStr) as BodyEffectData | undefined;
        return effectEntry ? `Lift: ${effectEntry.lift}, Throw: ${effectEntry.throw10Yds}, Dmg: ${effectEntry.baseDamage}, Sprint: ${effectEntry.sprint}, Jump: ${effectEntry.jump}` : "N/A";
      case 'coordination':
        effectEntry = coordinationEffectsData.find(e => e.dice === diceStr) as CoordinationEffectData | undefined;
        return effectEntry ? effectEntry.notes : "N/A";
      case 'sense':
        effectEntry = senseEffectsData.find(e => e.dice === diceStr) as SenseEffectData | undefined;
        return effectEntry ? effectEntry.notes : "N/A";
      case 'mind':
        effectEntry = mindEffectsData.find(e => e.dice === diceStr) as MindEffectData | undefined;
        return effectEntry ? effectEntry.notes : "N/A";
      case 'charm':
        effectEntry = charmEffectsData.find(e => e.dice === diceStr) as CharmEffectData | undefined;
        return effectEntry ? effectEntry.notes : "N/A";
      case 'command':
        effectEntry = commandEffectsData.find(e => e.dice === diceStr) as CommandEffectData | undefined;
        return effectEntry ? effectEntry.notes : "N/A";
      default:
        return "N/A";
    }
  };

  const getSkillLevelText = (skill: SkillInstance) => {
    const effectiveDice = Math.min(getEffectiveNormalDiceForEffects(skill), 10);
    if (effectiveDice === 0) return "N/A";
    const diceStr = `${effectiveDice}d`;
    const exampleEntry = skillExamplesData.find(e => e.dice === diceStr);
    if (exampleEntry && exampleEntry.skillLevel) {
      return exampleEntry.skillLevel.replace(/\s*\(.*\)\s*/, '').trim();
    }
    return "N/A";
  };
  
  const mandatoryMiraclesList = (miracles || []).filter(m => m.isMandatory);
  const regularMiraclesList = (miracles || []).filter(m => !m.isMandatory);

  return (
    <Accordion type="multiple" className="w-full space-y-6 summary-accordion-wrapper" >
      <CollapsibleSectionItem title="Character Point Summary" value="character-point-summary">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Overall Character Cost</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>Archetype Cost: {currentArchetypePointCost} {archetypePointLimit !== undefined ? `/ ${archetypePointLimit}` : ''} {archetypePointLimit !== undefined && currentArchetypePointCost > archetypePointLimit ? <span className="text-destructive">(Exceeded!)</span> : ''}</p>
            <p>Stat Cost: {currentTotalStatPoints} {statPointLimit !== undefined ? `/ ${statPointLimit}` : ''} {statPointLimit !== undefined && currentTotalStatPoints > statPointLimit ? <span className="text-destructive">(Exceeded!)</span> : ''}</p>
            <p>Willpower Cost: {currentTotalWillpowerPoints} {willpowerPointLimit !== undefined ? `/ ${willpowerPointLimit}` : ''} {willpowerPointLimit !== undefined && currentTotalWillpowerPoints > willpowerPointLimit ? <span className="text-destructive">(Exceeded!)</span> : ''}</p>
            <p>Skill Cost: {currentTotalSkillPoints} {skillPointLimit !== undefined ? `/ ${skillPointLimit}` : ''} {skillPointLimit !== undefined && currentTotalSkillPoints > skillPointLimit ? <span className="text-destructive">(Exceeded!)</span> : ''}</p>
            <p>Miracle Cost: {currentTotalMiraclePoints} {miraclePointLimit !== undefined ? `/ ${miraclePointLimit}` : ''} {miraclePointLimit !== undefined && currentTotalMiraclePoints > miraclePointLimit ? <span className="text-destructive">(Exceeded!)</span> : ''}</p>
            <hr className="my-2" />
            <p className="font-bold text-lg">Current Cost: {grandTotalPoints} / {pointLimit} {grandTotalPoints > pointLimit ? <span className="text-destructive">(Exceeded!)</span> : ''}</p>
             <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="point-limit" className="font-medium">Overall Point Limit:</Label>
              <Input
                id="point-limit"
                type="number"
                min="0"
                value={String(pointLimit)}
                onChange={(e) => onPointLimitChange(parseInt(e.target.value, 10) || 0)}
                className="w-24"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="archetype-point-limit" className="font-medium">Archetype Point Limit:</Label>
              <Input
                id="archetype-point-limit"
                type="number"
                min="0"
                placeholder="None"
                value={archetypePointLimit === undefined ? '' : String(archetypePointLimit)}
                onChange={(e) => onSubPointLimitChange('archetype', e.target.value)}
                className="w-24"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="stat-point-limit" className="font-medium">Stat Point Limit:</Label>
              <Input
                id="stat-point-limit"
                type="number"
                min="0"
                placeholder="None"
                value={statPointLimit === undefined ? '' : String(statPointLimit)}
                onChange={(e) => onSubPointLimitChange('stat', e.target.value)}
                className="w-24"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="willpower-point-limit" className="font-medium">Willpower Point Limit:</Label>
              <Input
                id="willpower-point-limit"
                type="number"
                min="0"
                placeholder="None"
                value={willpowerPointLimit === undefined ? '' : String(willpowerPointLimit)}
                onChange={(e) => onSubPointLimitChange('willpower', e.target.value)}
                className="w-24"
              />
            </div>
             <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="skill-point-limit" className="font-medium">Skill Point Limit:</Label>
              <Input
                id="skill-point-limit"
                type="number"
                min="0"
                placeholder="None"
                value={skillPointLimit === undefined ? '' : String(skillPointLimit)}
                onChange={(e) => onSubPointLimitChange('skill', e.target.value)}
                className="w-24"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="miracle-point-limit" className="font-medium">Miracle Point Limit:</Label>
              <Input
                id="miracle-point-limit"
                type="number"
                min="0"
                placeholder="None"
                value={miraclePointLimit === undefined ? '' : String(miraclePointLimit)}
                onChange={(e) => onSubPointLimitChange('miracle', e.target.value)}
                className="w-24"
              />
            </div>
            {sumOfSubLimits > pointLimit && (
              <p className="text-sm text-destructive mt-2">
                Warning: The sum of category point limits ({sumOfSubLimits}) exceeds the Overall Point Limit ({pointLimit}).
              </p>
            )}
            <p className="text-sm text-muted-foreground">Remaining Points (Overall): {pointLimit - grandTotalPoints}</p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Basic Information Summary" value="basic-info-summary">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{basicInfo?.name || "Unnamed Character"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
             <p><strong>Archetype:</strong> {ARCHETYPES.find(arch => arch.id === basicInfo.selectedArchetypeId)?.name || "Custom"}</p>
             
             <h4 className="font-semibold mt-2">Motivations:</h4>
            {basicInfo.motivations && basicInfo.motivations.length > 0 ? (
              <ul className="list-disc pl-5 text-sm">
                {basicInfo.motivations.map(motivation => (
                  <li key={motivation.id}>
                    {motivation.motivationText || "(Untitled Motivation)"} ({motivation.type}) - Invested Base Will: {motivation.investedBaseWill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No motivations defined.</p>
            )}

             <h4 className="font-semibold mt-2">Selected Meta-Qualities:</h4>
            {basicInfo.selectedSourceMQIds.length > 0 && (
                <div><strong>Source:</strong> {basicInfo.selectedSourceMQIds.map(id => SOURCE_META_QUALITIES.find(mq => mq.id === id)?.label).join(', ')}</div>
            )}
            {basicInfo.selectedPermissionMQIds.length > 0 && (
                <div><strong>Permission:</strong> {basicInfo.selectedPermissionMQIds.map(id => PERMISSION_META_QUALITIES.find(mq => mq.id === id)?.label).join(', ')}</div>
            )}
            {basicInfo.selectedIntrinsicMQIds.length > 0 && (
                <div><strong>Intrinsic:</strong> {basicInfo.selectedIntrinsicMQIds.map(id => INTRINSIC_META_QUALITIES.find(mq => mq.id === id)?.label).join(', ')}</div>
            )}
            {(basicInfo.selectedSourceMQIds.length === 0 && basicInfo.selectedPermissionMQIds.length === 0 && basicInfo.selectedIntrinsicMQIds.length === 0 && basicInfo.selectedArchetypeId === 'custom') && (
                <p className="text-xs text-muted-foreground">No meta-qualities selected for custom archetype.</p>
            )}
          </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Abilities Summary" value="abilities-summary">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Stats Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stat</TableHead>
                  <TableHead>Dice</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Effects</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats && Object.entries(stats).map(([key, value]) => {
                  const statKey = key as keyof CharacterData['stats'];
                  const isDiscarded = discardedAttribute === statKey;
                  const discardedDescription = isDiscarded && INTRINSIC_META_QUALITIES.find(mq => mq.id === 'custom_stats')?.customStatsDiscardOptions?.find(opt => opt.value === statKey)?.description;

                  return (
                    <TableRow key={key}>
                      <TableCell className="capitalize font-medium">{key}</TableCell>
                      {isDiscarded ? (
                        <>
                          <TableCell>N/A</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell className="text-xs whitespace-pre-wrap">{discardedDescription}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{formatStatDisplay(value)}</TableCell>
                          <TableCell>{calculateSingleStatPoints(value, statKey, discardedAttribute)}</TableCell>
                          <TableCell className="text-xs">{getStatEffectDescription(statKey, value)}</TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      
      <CollapsibleSectionItem title="Willpower Summary" value="willpower-summary">
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Willpower Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p><strong>Base Will (from Stats):</strong> {calculatedBaseWillFromStats}</p>
                <p>Purchased Base Will: {purchasedBaseWill}</p>
                <p>Purchased Will: {purchasedWill}</p>
                <p className="font-semibold">Total Base Will: {totalBaseWill}</p>
                <p className="font-bold text-lg">Total Will: {totalWill}</p>
                <p className="text-sm text-muted-foreground">Point Cost for Willpower: {currentTotalWillpowerPoints}</p>
            </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Skills Summary" value="skills-summary">
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Skills Overview</CardTitle>
            </CardHeader>
            <CardContent>
                {(!skills || skills.length === 0) ? (
                    <p className="text-muted-foreground">No skills added yet.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Skill</TableHead>
                                <TableHead>Linked Attribute</TableHead>
                                <TableHead>Dice</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Skill Level</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {skills.map((skill) => (
                                <TableRow key={skill.id}>
                                    <TableCell className="font-medium">{skill.name}</TableCell>
                                    <TableCell className="capitalize">{skill.linkedAttribute}</TableCell>
                                    <TableCell>{formatSkillDisplay(skill)}</TableCell>
                                    <TableCell>{calculateSingleSkillPoints(skill)}</TableCell>
                                    <TableCell className="text-xs">{getSkillLevelText(skill)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Miracles Summary" value="miracles-summary">
         <Card>
            <CardHeader>
                <CardTitle className="text-xl">Miracles Overview</CardTitle>
            </CardHeader>
            <CardContent>
                {(!miracles || miracles.length === 0) ? (
                    <p className="text-muted-foreground">No miracles added yet.</p>
                ) : (
                  <>
                    {mandatoryMiraclesList.length > 0 && (
                      <>
                        <h4 className="font-semibold text-md text-accent mb-2">Mandatory Miracles</h4>
                        <Table className="mb-4">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Miracle</TableHead>
                              <TableHead>Base Dice</TableHead>
                              <TableHead>Total Cost</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mandatoryMiraclesList.map((miracle) => (
                              <TableRow key={miracle.id}>
                                <TableCell className="font-medium">{miracle.name}</TableCell>
                                <TableCell>{miracle.dice} {miracle.hardDice} {miracle.wiggleDice}</TableCell>
                                <TableCell>{miracle.isMandatory ? '0 (Mandatory)' : calculateSingleMiracleTotalCost(miracle, skills)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
                    {regularMiraclesList.length > 0 && (
                       <>
                        <h4 className="font-semibold text-md mb-2">{mandatoryMiraclesList.length > 0 ? 'Regular Miracles' : 'Miracles'}</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Miracle</TableHead>
                              <TableHead>Base Dice</TableHead>
                              <TableHead>Total Cost</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {regularMiraclesList.map((miracle) => (
                              <TableRow key={miracle.id}>
                                <TableCell className="font-medium">{miracle.name}</TableCell>
                                <TableCell>{miracle.dice} {miracle.hardDice} {miracle.wiggleDice}</TableCell>
                                <TableCell>{calculateSingleMiracleTotalCost(miracle, skills)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
                  </>
                )}
                 {miracles.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {miracles.map(miracle => (
                            <div key={`${miracle.id}-detail`} className="p-2 border rounded-md">
                                <h4 className="font-semibold text-md">{miracle.name} - Qualities:</h4>
                                {miracle.qualities.length === 0 && <p className="text-xs text-muted-foreground">No qualities.</p>}
                                <ul className="list-disc pl-5 text-sm">
                                    {miracle.qualities.map(quality => {
                                        const qualityDef = getDynamicPowerQualityDefinitions(skills).find(def => def.key === quality.type);
                                        const qualityCost = calculateSingleMiracleQualityCost(quality, miracle, skills);
                                        return (
                                            <li key={quality.id}>
                                                {qualityDef?.label || quality.type} ({quality.capacity}) - Levels: {quality.levels} - Cost: {qualityCost}pts
                                                {quality.extras.length > 0 && <div className="pl-4 text-xs">Extras: {quality.extras.map(ex => `${ex.name} (${ex.costModifier > 0 ? '+' : ''}${ex.costModifier})`).join(', ')}</div>}
                                                {quality.flaws.length > 0 && <div className="pl-4 text-xs">Flaws: {quality.flaws.map(fl => `${fl.name} (${fl.costModifier})`).join(', ')}</div>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                         <div className="mt-4 pt-2 border-t">
                            <p className="font-bold text-right">Total Miracle Points: {currentTotalMiraclePoints}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </CollapsibleSectionItem>
    </Accordion>
  );
}
  

    



