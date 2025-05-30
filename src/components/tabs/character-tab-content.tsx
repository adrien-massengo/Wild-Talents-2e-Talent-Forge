
// src/components/tabs/character-tab-content.tsx
"use client";

import type { CharacterData, StatDetail, SkillInstance } from "@/app/page";
import type { AttributeName, SkillDefinition as PredefinedSkillDef } from "@/lib/skills-definitions";
import { SKILL_DEFINITIONS } from "@/lib/skills-definitions";
import type { MiracleDefinition, MiracleQuality, AppliedExtraOrFlaw, MiracleQualityType, MiracleCapacityType, PowerQualityDefinition } from "@/lib/miracles-definitions";
import { PREDEFINED_MIRACLES_TEMPLATES, POWER_QUALITY_DEFINITIONS, POWER_CAPACITY_OPTIONS, PREDEFINED_EXTRAS, PREDEFINED_FLAWS, getDynamicPowerQualityDefinitions } from "@/lib/miracles-definitions";

import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle, Cog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CharacterTabContentProps {
  characterData: CharacterData;
  onBasicInfoChange: (field: keyof CharacterData['basicInfo'], value: string) => void;
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

const normalDiceOptions = Array.from({ length: 10 }, (_, i) => `${i + 1}D`); // 1D to 10D for miracle/quality dice
const hardDiceOptions = Array.from({ length: 11 }, (_, i) => `${i}HD`); // 0HD to 10HD
const wiggleDiceOptions = Array.from({ length: 11 }, (_, i) => `${i}WD`); // 0WD to 10WD

const attributeNames: AttributeName[] = ['body', 'coordination', 'sense', 'mind', 'charm', 'command'];

// Calculate points for a single Miracle Quality
export const calculateMiracleQualityCost = (quality: MiracleQuality, miracle: MiracleDefinition, allPowerQualityDefinitions: PowerQualityDefinition[]): number => {
  const NDice = parseInt(miracle.dice.replace('D', '')) || 0;
  const HDice = parseInt(miracle.hardDice.replace('HD', '')) || 0;
  const WDice = parseInt(miracle.wiggleDice.replace('WD', '')) || 0;

  const qualityDef = allPowerQualityDefinitions.find(def => def.key === quality.type);
  if (!qualityDef) return 0;

  const baseCostFactor = qualityDef.baseCostFactor;

  let totalExtrasCostModifier = quality.extras.reduce((sum, ex) => sum + ex.costModifier, 0);
  let totalFlawsCostModifier = quality.flaws.reduce((sum, fl) => sum + fl.costModifier, 0); // Flaw costs are negative

  const effectiveCostModifier = quality.levels + totalExtrasCostModifier + totalFlawsCostModifier;

  const costND = NDice * Math.max(0, baseCostFactor + effectiveCostModifier);
  const costHD = HDice * Math.max(0, (baseCostFactor * 2) + effectiveCostModifier);
  const costWD = WDice * Math.max(0, (baseCostFactor * 4) + effectiveCostModifier);

  return costND + costHD + costWD;
};

// Calculate total points for a Miracle
export const calculateMiracleTotalCost = (miracle: MiracleDefinition, skills: SkillInstance[]): number => {
  const dynamicPqDefs = getDynamicPowerQualityDefinitions(skills);
  return miracle.qualities.reduce((sum, quality) => sum + calculateMiracleQualityCost(quality, miracle, dynamicPqDefs), 0);
};


export function CharacterTabContent({
  characterData,
  onBasicInfoChange,
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
}: CharacterTabContentProps) {

  const [selectedSkillToAdd, setSelectedSkillToAdd] = React.useState<string>("");
  const [selectedMiracleToAdd, setSelectedMiracleToAdd] = React.useState<string>("");
  const [selectedExtraToAdd, setSelectedExtraToAdd] = React.useState<{ [qualityId: string]: string }>({});
  const [selectedFlawToAdd, setSelectedFlawToAdd] = React.useState<{ [qualityId: string]: string }>({});

  const dynamicPqDefs = React.useMemo(() => getDynamicPowerQualityDefinitions(characterData.skills), [characterData.skills]);

  const charmDiceValue = parseInt(characterData.stats.charm.dice.replace('D',''), 10) || 0;
  const commandDiceValue = parseInt(characterData.stats.command.dice.replace('D',''), 10) || 0;
  const calculatedCharmPlusCommandBaseWill = charmDiceValue + commandDiceValue;

  const purchasedBaseWill = characterData.willpower.purchasedBaseWill || 0;
  const purchasedWill = characterData.willpower.purchasedWill || 0;

  const totalBaseWill = calculatedCharmPlusCommandBaseWill + purchasedBaseWill;
  const totalWill = totalBaseWill + purchasedWill;

  const getSkillNormalDiceOptions = (_linkedAttribute: AttributeName): string[] => {
    const maxStatNormalDice = 5;
    return Array.from({ length: maxStatNormalDice }, (_, i) => `${i + 1}D`);
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
    if (selectedMiracleToAdd) {
      onAddMiracle(selectedMiracleToAdd);
      setSelectedMiracleToAdd("");
    }
  };

  const mandatoryMiracles = characterData.miracles.filter(m => m.isMandatory);
  const regularMiracles = characterData.miracles.filter(m => !m.isMandatory);

  return (
    <Accordion type="multiple" className="w-full space-y-6" defaultValue={["basic-information", "stats", "skills", "willpower", "miracles"]}>
      <CollapsibleSectionItem title="Basic Information" value="basic-information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="charName" className="font-headline">Name</Label>
            <Input id="charName" placeholder="e.g., John Doe" value={characterData.basicInfo.name} onChange={(e) => onBasicInfoChange('name', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="charArchetype" className="font-headline">Archetype / Concept</Label>
            <Input id="charArchetype" placeholder="e.g., Gritty Detective, Star-crossed Inventor" value={characterData.basicInfo.archetype} onChange={(e) => onBasicInfoChange('archetype', e.target.value)} />
          </div>
        </div>
        <div>
            <Label htmlFor="charMotivation" className="font-headline">Motivation / Goals</Label>
            <Textarea id="charMotivation" placeholder="What drives your character?" value={characterData.basicInfo.motivation} onChange={(e) => onBasicInfoChange('motivation', e.target.value)} />
        </div>
        <p className="text-sm text-muted-foreground">Fill in the core details of your character.</p>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Stats" value="stats">
        <p className="text-sm text-muted-foreground mb-4">
          Costs: Normal Dice: 5 points per die. Hard Dice: 10 points per die. Wiggle Dice: 20 points per die.
        </p>
        <div className="space-y-6">
          {statsDefinitions.map((stat) => (
            <div key={stat.name} className="p-4 border rounded-lg bg-card/50 shadow-sm">
              <h4 className="text-xl font-headline mb-2 text-primary">{stat.label}</h4>
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
                      {Array.from({ length: 5 }, (_, i) => `${i + 1}D`).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
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
                      {hardDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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
                      {wiggleDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
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
          {characterData.skills.map((skill) => (
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
                      {hardDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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
                      {wiggleDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
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
          ))}
        </div>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Willpower" value="willpower">
        <div className="space-y-3">
          <p><strong className="font-headline">Base Will (Charm D + Command D):</strong> {calculatedCharmPlusCommandBaseWill}</p>
          <div className="space-y-1">
            <Label htmlFor="purchasedBaseWill" className="font-headline">Purchased Base Will (3pts/pt)</Label>
            <Input
              id="purchasedBaseWill"
              type="number"
              min="0"
              placeholder="0"
              className="w-24"
              value={characterData.willpower.purchasedBaseWill}
              onChange={(e) => onWillpowerChange('purchasedBaseWill', parseInt(e.target.value, 10))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="purchasedWill" className="font-headline">Purchased Will (1pt/pt)</Label>
            <Input
              id="purchasedWill"
              type="number"
              min="0"
              placeholder="0"
              className="w-24"
              value={characterData.willpower.purchasedWill}
              onChange={(e) => onWillpowerChange('purchasedWill', parseInt(e.target.value, 10))}
            />
          </div>
          <p><strong className="font-headline">Total Base Will:</strong> {totalBaseWill}</p>
          <p><strong className="font-headline">Total Will:</strong> {totalWill}</p>
        </div>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Miracles" value="miracles">
        <p className="text-sm text-muted-foreground mb-1">Miracle Dice represent the raw power of the miracle.</p>
        <p className="text-sm text-muted-foreground mb-1">Qualities determine how these dice are applied and costed.</p>
        <p className="text-sm text-muted-foreground mb-1">Power Quality (Attacks, Defends, Useful) costs 2 points per Normal Die.</p>
        <p className="text-sm text-muted-foreground mb-1">Hyperstat qualities cost 4 points per Normal Die.</p>
        <p className="text-sm text-muted-foreground mb-4">Hyperskill qualities cost 1 point per Normal Die. (Hard/Wiggle dice cost 2x/4x respectively for all types). Levels, Extras, and Flaws modify these costs.</p>

        <div className="mb-6 p-4 border rounded-lg bg-card/50 shadow-sm">
          <h4 className="text-lg font-headline mb-3">Add Miracle</h4>
          <div className="flex items-end space-x-2 mb-4">
            <div className="flex-grow">
              <Label htmlFor="add-miracle-select">Select Miracle Template or Custom</Label>
              <Select value={selectedMiracleToAdd} onValueChange={setSelectedMiracleToAdd}>
                <SelectTrigger id="add-miracle-select">
                  <SelectValue placeholder="Choose a miracle..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Add Custom Miracle</SelectItem>
                  {PREDEFINED_MIRACLES_TEMPLATES.map(def => (
                    <SelectItem key={def.definitionId} value={def.definitionId!}>{def.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddSelectedMiracle} disabled={!selectedMiracleToAdd}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Selected
            </Button>
          </div>
        </div>

        {mandatoryMiracles.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xl font-headline text-accent mb-3">Mandatory Miracles</h4>
            {mandatoryMiracles.map(miracle => (
              <Card key={miracle.id} className="mb-4 bg-accent/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {miracle.name}
                    <Button variant="ghost" size="sm" onClick={() => onRemoveMiracle(miracle.id)} aria-label={`Remove ${miracle.name}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Simplified view for mandatory, details in regular list if needed or edit there */}
                  <p className="text-sm text-muted-foreground">Base Dice: {miracle.dice} {miracle.hardDice} {miracle.wiggleDice}</p>
                  <p className="text-sm">Total Cost: {calculateMiracleTotalCost(miracle, characterData.skills)} points</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <h4 className="text-xl font-headline mb-3 mt-6">{mandatoryMiracles.length > 0 ? 'Regular Miracles' : 'Miracles'}</h4>
        {regularMiracles.length === 0 && mandatoryMiracles.length === 0 && (
          <p className="text-muted-foreground">No miracles added yet.</p>
        )}

        <div className="space-y-6">
          {regularMiracles.map((miracle) => (
            <Card key={miracle.id} className="bg-card/70 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  {miracle.isCustom || !miracle.definitionId ? (
                    <Input
                      value={miracle.name}
                      onChange={(e) => onMiracleChange(miracle.id, 'name', e.target.value)}
                      className="text-xl font-headline mr-2 flex-grow"
                      placeholder="Miracle Name"
                    />
                  ) : (
                    <h3 className="text-xl font-headline text-primary">{miracle.name}</h3>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => onRemoveMiracle(miracle.id)} aria-label="Remove miracle">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
                 <div className="flex items-center space-x-1 mt-1">
                    <input
                        type="checkbox"
                        id={`${miracle.id}-mandatory`}
                        checked={miracle.isMandatory}
                        onChange={(e) => onMiracleChange(miracle.id, 'isMandatory', e.target.checked)}
                        className="form-checkbox h-4 w-4 text-primary rounded"
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
                      <SelectContent>{normalDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={miracle.hardDice} onValueChange={(v) => onMiracleChange(miracle.id, 'hardDice', v)}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>{hardDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={miracle.wiggleDice} onValueChange={(v) => onMiracleChange(miracle.id, 'wiggleDice', v)}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>{wiggleDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
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

                <p className="font-semibold">Total Miracle Cost: {calculateMiracleTotalCost(miracle, characterData.skills)} points</p>

                <div className="space-y-3 mt-3">
                  <div className="flex justify-between items-center">
                    <h5 className="text-md font-semibold text-accent">Power Qualities</h5>
                    <Button size="sm" variant="outline" onClick={() => onAddMiracleQuality(miracle.id)}>
                      <PlusCircle className="mr-2 h-4 w-4"/> Add Quality
                    </Button>
                  </div>
                  {miracle.qualities.length === 0 && <p className="text-xs text-muted-foreground">No qualities added yet.</p>}
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
                              {dynamicPqDefs.map(def => <SelectItem key={def.key} value={def.key}>{def.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`${quality.id}-capacity`} className="text-xs">Capacity</Label>
                          <Select value={quality.capacity} onValueChange={(v) => onMiracleQualityChange(miracle.id, quality.id, 'capacity', v)}>
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
                            value={quality.levels}
                            onChange={(e) => onMiracleQualityChange(miracle.id, quality.id, 'levels', parseInt(e.target.value, 10) || 0)}
                            className="text-sm"
                            placeholder="0"
                          />
                        </div>
                         <div>
                            <Label className="text-xs block">Quality Cost (Points)</Label>
                            <Input
                                type="text"
                                readOnly
                                value={calculateMiracleQualityCost(quality, miracle, dynamicPqDefs)}
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
                                  value={extra.isCustom && isNaN(extra.costModifier) ? '' : extra.costModifier}
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
                                <SelectTrigger className="h-8 text-xs flex-grow" placeholder="Add Extra..."><SelectValue /></SelectTrigger>
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
                                  value={flaw.isCustom && isNaN(flaw.costModifier) ? '' : flaw.costModifier}
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
                                <SelectTrigger className="h-8 text-xs flex-grow" placeholder="Add Flaw..."><SelectValue /></SelectTrigger>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleSectionItem>
    </Accordion>
  );
}
