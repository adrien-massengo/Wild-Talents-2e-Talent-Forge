// src/components/tabs/character-tab-content.tsx
"use client";

import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Dummy character data type, expand as needed
interface CharacterData {
  basicInfo: {
    name: string;
    archetype: string;
    motivation: string;
  };
  // Add other sections later
}

interface CharacterTabContentProps {
  characterData: CharacterData;
  onCharacterDataChange: (field: keyof CharacterData['basicInfo'], value: string) => void; // Simplified for now
}


export function CharacterTabContent({ characterData, onCharacterDataChange }: CharacterTabContentProps) {
  return (
    <Accordion type="multiple" className="w-full space-y-6">
      <CollapsibleSectionItem title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="charName" className="font-headline">Name</Label>
            <Input id="charName" placeholder="e.g., John Doe" value={characterData.basicInfo.name} onChange={(e) => onCharacterDataChange('name', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="charArchetype" className="font-headline">Archetype / Concept</Label>
            <Input id="charArchetype" placeholder="e.g., Gritty Detective, Star-crossed Inventor" value={characterData.basicInfo.archetype} onChange={(e) => onCharacterDataChange('archetype', e.target.value)} />
          </div>
        </div>
        <div>
            <Label htmlFor="charMotivation" className="font-headline">Motivation / Goals</Label>
            <Textarea id="charMotivation" placeholder="What drives your character?" value={characterData.basicInfo.motivation} onChange={(e) => onCharacterDataChange('motivation', e.target.value)} />
        </div>
        <p className="text-sm text-muted-foreground">Fill in the core details of your character.</p>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Stats">
        <p>Placeholder for character statistics (e.g., Body, Coordination, Sense, Mind, Charm, Command). This section will contain input fields for each stat.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div><Label className="font-headline">Body:</Label> <Input type="number" placeholder="0D" /></div>
            <div><Label className="font-headline">Coordination:</Label> <Input type="number" placeholder="0D" /></div>
            <div><Label className="font-headline">Sense:</Label> <Input type="number" placeholder="0D" /></div>
            <div><Label className="font-headline">Mind:</Label> <Input type="number" placeholder="0D" /></div>
            <div><Label className="font-headline">Charm:</Label> <Input type="number" placeholder="0D" /></div>
            <div><Label className="font-headline">Command:</Label> <Input type="number" placeholder="0D" /></div>
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
