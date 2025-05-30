// src/components/tabs/summary-tab-content.tsx
"use client";

import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CharacterData { // Should match the one in page.tsx eventually
  basicInfo: {
    name: string;
    archetype: string;
    motivation: string;
  };
  // Add other sections later
}

interface SummaryTabContentProps {
  characterData: CharacterData; // Pass the current character data
}

export function SummaryTabContent({ characterData }: SummaryTabContentProps) {
  return (
    <Accordion type="multiple" className="w-full space-y-6" defaultValue={["point-totals", "basic-info-summary"]}>
      <CollapsibleSectionItem title="Point Totals" value="point-totals">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Point Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Stat Points:</strong> [Calculated Value]</p>
            <p><strong>Skill Points:</strong> [Calculated Value]</p>
            <p><strong>Miracle Points:</strong> [Calculated Value]</p>
            <p><strong>Total Points Spent:</strong> [Calculated Value]</p>
            <p className="text-sm text-muted-foreground">Summary of character creation points.</p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Basic Info" value="basic-info-summary">
         <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Character Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Name:</strong> {characterData.basicInfo.name || "N/A"}</p>
            <p><strong>Archetype/Concept:</strong> {characterData.basicInfo.archetype || "N/A"}</p>
            <p><strong>Motivation:</strong> {characterData.basicInfo.motivation || "N/A"}</p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Abilities" value="abilities-summary">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Key Abilities & Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">A consolidated view of the character's stats and most notable skills will appear here.</p>
            {/* Example: Display stats and top skills */}
          </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Powers" value="powers-summary">
         <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Miracles & Powers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">A summary of the character's miracles and special powers will be listed here.</p>
            {/* Example: List key miracles */}
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
    </Accordion>
  );
}
