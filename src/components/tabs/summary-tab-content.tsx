
// src/components/tabs/summary-tab-content.tsx
"use client";

import type { CharacterData, StatDetail, SkillInstance, BasicInfo } from "@/app/page";
import type { MiracleDefinition } from "@/lib/miracles-definitions";
import { getDynamicPowerQualityDefinitions } from "@/lib/miracles-definitions";
import { calculateMiracleQualityCost, calculateMiracleTotalCost } from "@/components/tabs/character-tab-content"; 
import { ARCHETYPES, SOURCE_META_QUALITIES, PERMISSION_META_QUALITIES, INTRINSIC_META_QUALITIES, calculateMetaQualitiesPointCost } from "@/lib/character-definitions";
import { 
  bodyEffectsData, coordinationEffectsData, senseEffectsData, mindEffectsData, charmEffectsData, commandEffectsData, skillExamplesData,
  type BodyEffectData, type CoordinationEffectData, type SenseEffectData, type MindEffectData, type CharmEffectData, type CommandEffectData, type SkillExampleData
} from "@/lib/effects-definitions";

import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface SummaryTabContentProps {
  characterData: CharacterData;
  onPointLimitChange: (value: number) => void;
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

const calculateStatPoints = (stat: StatDetail | undefined): number => {
  if (!stat) return 0;
  const normalDice = parseInt(stat.dice?.replace('D', ''), 10) || 0;
  const hardDice = parseInt(stat.hardDice?.replace('HD', ''), 10) || 0;
  const wiggleDice = parseInt(stat.wiggleDice?.replace('WD', ''), 10) || 0;
  return (normalDice * 5) + (hardDice * 10) + (wiggleDice * 20);
};

const calculateWillpowerPoints = (willpower: CharacterData['willpower'] | undefined): number => {
  if (!willpower) return 0;
  const purchasedBaseWillPoints = (willpower.purchasedBaseWill || 0) * 3;
  const purchasedWillPoints = (willpower.purchasedWill || 0) * 1;
  return purchasedBaseWillPoints + purchasedWillPoints;
};

const calculateSkillPoints = (skill: SkillInstance | undefined): number => {
  if (!skill) return 0;
  const normalDice = parseInt(skill.dice?.replace('D', ''), 10) || 0;
  const hardDice = parseInt(skill.hardDice?.replace('HD', ''), 10) || 0;
  const wiggleDice = parseInt(skill.wiggleDice?.replace('WD', ''), 10) || 0;
  return (normalDice * 2) + (hardDice * 4) + (wiggleDice * 8);
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


export function SummaryTabContent({ characterData, onPointLimitChange }: SummaryTabContentProps) {
  const { basicInfo, stats, willpower, skills, miracles, pointLimit } = characterData;
  const dynamicPqDefs = getDynamicPowerQualityDefinitions(skills);


  const charmDiceValue = parseInt(stats?.charm?.dice?.replace('D', '') || '0', 10);
  const commandDiceValue = parseInt(stats?.command?.dice?.replace('D', '') || '0', 10);
  const calculatedCharmPlusCommandBaseWill = charmDiceValue + commandDiceValue;

  const purchasedBaseWill = willpower?.purchasedBaseWill || 0;
  const purchasedWill = willpower?.purchasedWill || 0;

  const totalBaseWill = calculatedCharmPlusCommandBaseWill + purchasedBaseWill;
  const totalWill = totalBaseWill + purchasedWill;

  const totalStatPoints = Object.values(stats || {}).reduce((sum, stat) => sum + calculateStatPoints(stat), 0);
  const totalWillpowerPoints = calculateWillpowerPoints(willpower);
  const totalSkillPoints = (skills || []).reduce((sum, skill) => sum + calculateSkillPoints(skill), 0);
  const totalMiraclePoints = (miracles || []).reduce((sum, miracle) => sum + calculateMiracleTotalCost(miracle, skills), 0);
  
  const selectedArchetypeDef = ARCHETYPES.find(arch => arch.id === basicInfo.selectedArchetypeId);
  const currentArchetypePointCost = selectedArchetypeDef && selectedArchetypeDef.id !== 'custom' 
    ? selectedArchetypeDef.points 
    : calculateMetaQualitiesPointCost(basicInfo);


  const grandTotalPoints = totalStatPoints + totalWillpowerPoints + totalSkillPoints + totalMiraclePoints + currentArchetypePointCost;

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

  return (
    <Accordion type="multiple" className="w-full space-y-6 summary-accordion-wrapper" defaultValue={["character-point-summary", "basic-info-summary", "abilities-summary", "willpower-summary", "skills-summary", "miracles-summary"]}>
      <CollapsibleSectionItem title="Character Point Summary" value="character-point-summary">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Overall Character Cost</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><span className="font-medium">Archetype Point Cost:</span> {currentArchetypePointCost}</p>
            <p>Stat Point Cost: {totalStatPoints}</p>
            <p>Willpower Point Cost: {totalWillpowerPoints}</p>
            <p>Skill Point Cost: {totalSkillPoints}</p>
            <p>Miracle Point Cost: {totalMiraclePoints}</p>
            <hr className="my-2" />
            <p className="font-bold text-lg">Current Point Cost: {grandTotalPoints} / {pointLimit}</p>
             <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="point-limit" className="font-medium">Point Limit:</Label>
              <Input
                id="point-limit"
                type="number"
                min="0"
                value={String(pointLimit)}
                onChange={(e) => onPointLimitChange(parseInt(e.target.value, 10) || 250)}
                className="w-24"
              />
            </div>
            <p className="text-sm text-muted-foreground">Remaining Points: {pointLimit - grandTotalPoints}</p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Basic Information Summary" value="basic-info-summary">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{basicInfo?.name || "Unnamed Character"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
             <p><strong>Archetype:</strong> {selectedArchetypeDef?.name || "Custom"}</p>
             
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
                {stats && Object.entries(stats).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="capitalize font-medium">{key}</TableCell>
                    <TableCell>{formatStatDisplay(value)}</TableCell>
                    <TableCell>{calculateStatPoints(value)}</TableCell>
                    <TableCell className="text-xs">{getStatEffectDescription(key as keyof CharacterData['stats'], value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      
      <CollapsibleSectionItem title="Willpower Details" value="willpower-summary">
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Willpower Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p><strong>Base Will:</strong> {calculatedCharmPlusCommandBaseWill}</p>
                <p>Purchased Base Will: {purchasedBaseWill}</p>
                <p>Purchased Will: {purchasedWill}</p>
                <p className="font-semibold">Total Base Will: {totalBaseWill}</p>
                <p className="font-bold text-lg">Total Will: {totalWill}</p>
                <p className="text-sm text-muted-foreground">Point Cost for Willpower: {totalWillpowerPoints}</p>
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
                                    <TableCell>{calculateSkillPoints(skill)}</TableCell>
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Miracle</TableHead>
                                <TableHead>Base Dice</TableHead>
                                <TableHead>Total Cost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {miracles.map((miracle) => (
                                <TableRow key={miracle.id}>
                                    <TableCell className="font-medium">{miracle.name}</TableCell>
                                    <TableCell>{miracle.dice} {miracle.hardDice} {miracle.wiggleDice}</TableCell>
                                    <TableCell>{calculateMiracleTotalCost(miracle, skills)}</TableCell>
                                </TableRow>
                            ))}
                             <TableRow className="font-bold">
                                <TableCell colSpan={2} className="text-right">Total Miracle Points:</TableCell>
                                <TableCell>{totalMiraclePoints}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
                 {miracles.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {miracles.map(miracle => (
                            <div key={`${miracle.id}-detail`} className="p-2 border rounded-md">
                                <h4 className="font-semibold text-md">{miracle.name} - Qualities:</h4>
                                {miracle.qualities.length === 0 && <p className="text-xs text-muted-foreground">No qualities.</p>}
                                <ul className="list-disc pl-5 text-sm">
                                    {miracle.qualities.map(quality => {
                                        const qualityDef = dynamicPqDefs.find(def => def.key === quality.type);
                                        const qualityCost = calculateMiracleQualityCost(quality, miracle, dynamicPqDefs);
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
                    </div>
                )}
            </CardContent>
        </Card>
      </CollapsibleSectionItem>
    </Accordion>
  );
}
  

    

