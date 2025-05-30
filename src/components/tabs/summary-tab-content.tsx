
// src/components/tabs/summary-tab-content.tsx
"use client";

import type { CharacterData } from "@/app/page"; 
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryTabContentProps {
  characterData: CharacterData;
}

const formatStatDisplay = (stat: CharacterData['stats'][keyof CharacterData['stats']]) => {
  if (!stat) return "N/A";
  let display = stat.dice;
  if (stat.hardDice && stat.hardDice !== "0HD") {
    display += ` ${stat.hardDice}`;
  }
  if (stat.wiggleDice && stat.wiggleDice !== "0WD") {
    display += ` ${stat.wiggleDice}`;
  }
  return display;
};

export function SummaryTabContent({ characterData }: SummaryTabContentProps) {
  const { basicInfo, stats, willpower } = characterData;

  const charmDiceValue = parseInt(stats?.charm?.dice || '0', 10);
  const commandDiceValue = parseInt(stats?.command?.dice || '0', 10);
  const calculatedCharmPlusCommandBaseWill = charmDiceValue + commandDiceValue;

  const purchasedBaseWill = willpower?.purchasedBaseWill || 0;
  const purchasedWill = willpower?.purchasedWill || 0;

  const totalBaseWill = calculatedCharmPlusCommandBaseWill + purchasedBaseWill;
  const totalWill = totalBaseWill + purchasedWill;

  return (
    <Accordion type="multiple" className="w-full space-y-6" defaultValue={["point-totals", "basic-info-summary", "abilities-summary", "willpower-summary"]}>
      <CollapsibleSectionItem title="Point Totals" value="point-totals">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Point Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Stat Points:</strong> [Calculated Value]</p>
            <p><strong>Skill Points:</strong> [Calculated Value]</p>
            <p><strong>Willpower Points:</strong> [Calculated Value]</p>
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
            <p><strong>Name:</strong> {basicInfo?.name || "N/A"}</p>
            <p><strong>Archetype/Concept:</strong> {basicInfo?.archetype || "N/A"}</p>
            <p><strong>Motivation:</strong> {basicInfo?.motivation || "N/A"}</p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Abilities" value="abilities-summary">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Stats & Key Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <h5 className="font-semibold mb-1">Stats:</h5>
            {stats ? (
              <ul className="list-disc list-inside pl-1 space-y-1">
                <li><strong>Body:</strong> {formatStatDisplay(stats.body)}</li>
                <li><strong>Coordination:</strong> {formatStatDisplay(stats.coordination)}</li>
                <li><strong>Sense:</strong> {formatStatDisplay(stats.sense)}</li>
                <li><strong>Mind:</strong> {formatStatDisplay(stats.mind)}</li>
                <li><strong>Charm:</strong> {formatStatDisplay(stats.charm)}</li>
                <li><strong>Command:</strong> {formatStatDisplay(stats.command)}</li>
              </ul>
            ) : (
              <p className="text-muted-foreground">No stats data available.</p>
            )}
            <p className="mt-3 text-muted-foreground">Most notable skills will appear here once implemented.</p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Willpower" value="willpower-summary">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Willpower Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Base Will (Charm + Command):</strong> {calculatedCharmPlusCommandBaseWill}</p>
            <p><strong>Purchased Base Will:</strong> {purchasedBaseWill}</p>
            <p><strong>Purchased Will:</strong> {purchasedWill}</p>
            <p><strong>Total Base Will:</strong> {totalBaseWill}</p>
            <p><strong>Total Will:</strong> {totalWill}</p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Powers" value="powers-summary">
         <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Miracles & Powers</CardTitle>
          </Header>
          <CardContent>
            <p className="text-muted-foreground">A summary of the character's miracles and special powers will be listed here.</p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
    </Accordion>
  );
}
