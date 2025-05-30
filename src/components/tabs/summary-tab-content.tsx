
// src/components/tabs/summary-tab-content.tsx
"use client";

import type { CharacterData, StatDetail } from "@/app/page";
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SummaryTabContentProps {
  characterData: CharacterData;
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


export function SummaryTabContent({ characterData }: SummaryTabContentProps) {
  const { basicInfo, stats, willpower } = characterData;

  const charmDiceValue = parseInt(stats?.charm?.dice?.replace('D', '') || '0', 10);
  const commandDiceValue = parseInt(stats?.command?.dice?.replace('D', '') || '0', 10);
  const calculatedCharmPlusCommandBaseWill = charmDiceValue + commandDiceValue;

  const purchasedBaseWill = willpower?.purchasedBaseWill || 0;
  const purchasedWill = willpower?.purchasedWill || 0;

  const totalBaseWill = calculatedCharmPlusCommandBaseWill + purchasedBaseWill;
  const totalWill = totalBaseWill + purchasedWill;

  const totalStatPoints = Object.values(stats || {}).reduce((sum, stat) => sum + calculateStatPoints(stat), 0);
  const totalWillpowerPoints = calculateWillpowerPoints(willpower);
  const grandTotalPoints = totalStatPoints + totalWillpowerPoints;


  return (
    <Accordion type="multiple" className="w-full space-y-6 summary-accordion-wrapper" defaultValue={["point-totals", "basic-info-summary", "abilities-summary", "willpower-summary"]}>
      <CollapsibleSectionItem title="Point Totals" value="point-totals">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Overall Character Cost</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Total Stat Points: {totalStatPoints}</p>
            <p>Total Willpower Points: {totalWillpowerPoints}</p>
            <p className="font-bold text-lg">Grand Total Points: {grandTotalPoints}</p>
            <p className="text-sm text-muted-foreground">Based on 200 point budget for a starting character.</p>
            <p className="text-sm text-muted-foreground">Remaining Points: {200 - grandTotalPoints}</p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Basic Information Summary" value="basic-info-summary">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{basicInfo?.name || "Unnamed Character"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Archetype:</strong> {basicInfo?.archetype || "N/A"}</p>
            <p><strong>Motivation:</strong> {basicInfo?.motivation || "N/A"}</p>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats && Object.entries(stats).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="capitalize font-medium">{key}</TableCell>
                    <TableCell>{formatStatDisplay(value)}</TableCell>
                    <TableCell>{calculateStatPoints(value)}</TableCell>
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
                <p>Base Will (Charm D + Command D): {calculatedCharmPlusCommandBaseWill}</p>
                <p>Purchased Base Will: {purchasedBaseWill}</p>
                <p>Purchased Will: {purchasedWill}</p>
                <p className="font-semibold">Total Base Will: {totalBaseWill}</p>
                <p className="font-bold text-lg">Total Will: {totalWill}</p>
                <p className="text-sm text-muted-foreground">Point Cost for Willpower: {totalWillpowerPoints}</p>
            </CardContent>
        </Card>
      </CollapsibleSectionItem>

      <CollapsibleSectionItem title="Skills Summary" value="skills-summary">
         <p className="text-muted-foreground p-4">Skills summary will appear here once implemented.</p>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="Miracles Summary" value="miracles-summary">
        <p className="text-muted-foreground p-4">Miracles summary will appear here once implemented.</p>
      </CollapsibleSectionItem>
    </Accordion>
  );
}
