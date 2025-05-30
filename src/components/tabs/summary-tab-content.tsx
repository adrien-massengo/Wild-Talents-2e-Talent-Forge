// src/components/tabs/summary-tab-content.tsx
"use client";

import type { CharacterData } from "@/app/page";
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
// Card imports are temporarily removed for simplification
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryTabContentProps {
  characterData: CharacterData;
}

// const formatStatDisplay = (stat: CharacterData['stats'][keyof CharacterData['stats']]) => {
//   if (!stat) return "N/A";
//   let display = stat.dice;
//   if (stat.hardDice && stat.hardDice !== "0HD") {
//     display += ` ${stat.hardDice}`;
//   }
//   if (stat.wiggleDice && stat.wiggleDice !== "0WD") {
//     display += ` ${stat.wiggleDice}`;
//   }
//   return display;
// };

export function SummaryTabContent({ characterData }: SummaryTabContentProps) {
  // Temporarily commenting out characterData destructuring and calculations
  // const { basicInfo, stats, willpower } = characterData;

  // const charmDiceValue = parseInt(stats?.charm?.dice || '0', 10);
  // const commandDiceValue = parseInt(stats?.command?.dice || '0', 10);
  // const calculatedCharmPlusCommandBaseWill = charmDiceValue + commandDiceValue;

  // const purchasedBaseWill = willpower?.purchasedBaseWill || 0;
  // const purchasedWill = willpower?.purchasedWill || 0;

  // const totalBaseWill = calculatedCharmPlusCommandBaseWill + purchasedBaseWill;
  // const totalWill = totalBaseWill + purchasedWill;

  return (
    <Accordion type="multiple" className="w-full space-y-6 summary-accordion-wrapper" defaultValue={["test-section"]}>
      <CollapsibleSectionItem title="Test Section" value="test-section">
        <p>This is a test section. If this renders, the Accordion itself is likely not the direct cause of the parsing error in its simplest form.</p>
        <p>Character Name (for testing data flow): {characterData?.basicInfo?.name || "N/A"}</p>
      </CollapsibleSectionItem>
      {/* All other CollapsibleSectionItems are temporarily removed for debugging */}
    </Accordion>
  );
}
