// src/components/tabs/character-tab-content.tsx
"use client";

import type { CharacterData, StatDetail } from "@/app/page";
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CharacterTabContentProps {
  characterData: CharacterData;
  onBasicInfoChange: (field: keyof CharacterData['basicInfo'], value: string) => void;
  onStatChange: (statName: keyof CharacterData['stats'], dieType: keyof StatDetail, value: string) => void;
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

const normalDiceOptions = Array.from({ length: 5 }, (_, i) => `${i + 1}D`); // 1D to 5D
const hardDiceOptions = Array.from({ length: 11 }, (_, i) => `${i}HD`); // 0HD to 10HD
const wiggleDiceOptions = Array.from({ length: 11 }, (_, i) => `${i}WD`); // 0WD to 10WD

export function CharacterTabContent({ characterData, onBasicInfoChange, onStatChange }: CharacterTabContentProps) {
  return (
    <Accordion type="multiple" className="w-full space-y-6" defaultValue={["basic-information", "stats"]}>
      <CollapsibleSectionItem title="Basic Information">
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

      <CollapsibleSectionItem title="Stats">
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
                    value={characterData.stats[stat.name]?.dice || '1D'}
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

      <CollapsibleSectionItem title="Skills">
        <p>Placeholder for character skills. This section will allow users to add and define skills associated with stats.</p>
         <Textarea placeholder="List skills here, e.g., Athletics (Body) 2D, Persuasion (Charm) 3D+1..." />
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Willpower">
        <p>Placeholder for Willpower calculation and tracking.</p>
        <div className="flex items-center gap-2">
            <Label className="font-headline">Base Willpower:</Label> <Input type="number" placeholder="0" className="w-20" />
        </div>
        <div className="flex items-center gap-2 mt-2">
            <Label className="font-headline">Current Willpower:</Label> <Input type="number" placeholder="0" className="w-20" />
        </div>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Miracles">
        <p>Placeholder for defining and managing character Miracles (powers).</p>
        <Textarea placeholder="Describe miracles, their costs, and effects..." />
      </CollapsibleSectionItem>
    </Accordion>
  );
}
