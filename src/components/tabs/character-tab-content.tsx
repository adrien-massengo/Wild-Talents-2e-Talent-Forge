
// src/components/tabs/character-tab-content.tsx
"use client";

import type { CharacterData, StatDetail, SkillInstance } from "@/app/page";
import type { AttributeName, SkillDefinition } from "@/lib/skills-definitions";
import { SKILL_DEFINITIONS } from "@/lib/skills-definitions";
import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";

interface CharacterTabContentProps {
  characterData: CharacterData;
  onBasicInfoChange: (field: keyof CharacterData['basicInfo'], value: string) => void;
  onStatChange: (statName: keyof CharacterData['stats'], dieType: keyof StatDetail, value: string) => void;
  onWillpowerChange: (field: keyof CharacterData['willpower'], value: number) => void;
  onAddSkill: (skillDef: SkillDefinition) => void;
  onAddCustomSkill: () => void;
  onRemoveSkill: (skillId: string) => void;
  onSkillChange: (skillId: string, field: keyof SkillInstance, value: string | AttributeName) => void;
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

const normalDiceOptions = Array.from({ length: 5 }, (_, i) => `${i + 1}D`); // 1D to 5D for stats
const hardDiceOptions = Array.from({ length: 11 }, (_, i) => `${i}HD`); // 0HD to 10HD
const wiggleDiceOptions = Array.from({ length: 11 }, (_, i) => `${i}WD`); // 0WD to 10WD

const attributeNames: AttributeName[] = ['body', 'coordination', 'sense', 'mind', 'charm', 'command'];


export function CharacterTabContent({ 
  characterData, 
  onBasicInfoChange, 
  onStatChange, 
  onWillpowerChange,
  onAddSkill,
  onAddCustomSkill,
  onRemoveSkill,
  onSkillChange 
}: CharacterTabContentProps) {
  
  const [selectedSkillToAdd, setSelectedSkillToAdd] = React.useState<string>("");

  const charmDiceValue = parseInt(characterData.stats.charm.dice.replace('D',''), 10) || 0;
  const commandDiceValue = parseInt(characterData.stats.command.dice.replace('D',''), 10) || 0;
  const calculatedCharmPlusCommandBaseWill = charmDiceValue + commandDiceValue;

  const purchasedBaseWill = characterData.willpower.purchasedBaseWill || 0;
  const purchasedWill = characterData.willpower.purchasedWill || 0;

  const totalBaseWill = calculatedCharmPlusCommandBaseWill + purchasedBaseWill;
  const totalWill = totalBaseWill + purchasedWill;

  const getSkillNormalDiceOptions = (_linkedAttribute: AttributeName): string[] => {
    // Skills' normal dice are capped by the maximum possible normal dice for a stat (1D to 5D).
    const maxStatNormalDice = 5; 
    return Array.from({ length: maxStatNormalDice }, (_, i) => `${i + 1}D`);
  };
  
  const handleAddPredefinedSkill = () => {
    if (selectedSkillToAdd) {
      const skillDef = SKILL_DEFINITIONS.find(s => s.id === selectedSkillToAdd);
      if (skillDef) {
        onAddSkill(skillDef);
        setSelectedSkillToAdd(""); // Reset dropdown
      }
    }
  };


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
                      {normalDiceOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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
        <p>Placeholder for defining and managing character Miracles (powers).</p>
        <Textarea placeholder="Describe miracles, their costs, and effects..." />
      </CollapsibleSectionItem>
    </Accordion>
  );
}

