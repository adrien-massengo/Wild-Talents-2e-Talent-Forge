// src/components/tabs/tables-tab-content.tsx
"use client";

import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";

export function TablesTabContent() {
  const tables = [
    'Body Effects', 'Body Extra', 'Coordination Effects', 'Sense Effects', 
    'Mind Effects', 'Charm Effects', 'Command Effects', 'Skill Examples', 
    'Base Will Description', 'Power Capacities Table', 'Size Modification Tables'
  ];

  return (
    <Accordion type="multiple" className="w-full space-y-6">
      {tables.map((tableTitle) => (
        <CollapsibleSectionItem key={tableTitle} title={tableTitle}>
          <p className="text-muted-foreground">Detailed information and rules for {tableTitle}.</p>
          <div className="mt-4 p-4 border rounded-md bg-card/50 min-h-[100px]">
            {/* Placeholder content for table data */}
            Content for {tableTitle} will be displayed here. This could include actual tables, descriptions, or interactive elements in a future version.
          </div>
        </CollapsibleSectionItem>
      ))}
    </Accordion>
  );
}
