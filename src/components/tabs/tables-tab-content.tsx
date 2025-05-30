
// src/components/tabs/tables-tab-content.tsx
"use client";

import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BodyEffectData {
  dice: string;
  lift: string;
  throw10Yds: string;
  baseDamage: string;
  sprint: string;
  jump: string;
}

const bodyEffectsData: BodyEffectData[] = [
  { dice: "1d", lift: "50 lbs", throw10Yds: "6.2 lbs", baseDamage: "Shock", sprint: "8 yards (8 mph)", jump: "2 yards / 0.5 yards" },
  { dice: "2d", lift: "100 lbs", throw10Yds: "12.5 lbs", baseDamage: "Shock", sprint: "10 yards", jump: "3 yards / 1 yard" },
  { dice: "3d", lift: "200 lbs", throw10Yds: "25 lbs", baseDamage: "Shock", sprint: "12 yards", jump: "4 yards / 1 yard" },
  { dice: "4d", lift: "400 lbs", throw10Yds: "50 lbs", baseDamage: "Shock", sprint: "15 yards", jump: "5 yards / 1 yard" },
  { dice: "5d", lift: "800 lbs", throw10Yds: "100 lbs", baseDamage: "Shock", sprint: "20 yards", jump: "6 yards / 1.5 yards" },
  { dice: "6d", lift: "1,600 lbs", throw10Yds: "200 lbs", baseDamage: "Killing", sprint: "25 yards", jump: "8 yards / 2 yards" },
  { dice: "7d", lift: "1.6 tons", throw10Yds: "400 lbs", baseDamage: "Killing", sprint: "30 yards", jump: "10 yards / 2.5 yards" },
  { dice: "8d", lift: "3.2 tons", throw10Yds: "800 lbs", baseDamage: "Shock and Killing", sprint: "40 yards", jump: "12 yards / 3 yards" },
  { dice: "9d", lift: "6.4 tons", throw10Yds: "1,600 lbs", baseDamage: "Shock and Killing", sprint: "50 yards", jump: "15 yards / 4 yards" },
  { dice: "10d", lift: "12.8 tons", throw10Yds: "1.6 tons", baseDamage: "Shock and Killing", sprint: "60 yards", jump: "20 yards / 5 yards" },
];

export function TablesTabContent() {
  const allTables = [
    { title: 'Body Effects', data: bodyEffectsData, description: "Effects are not cumulative for Body; they are cumulative for all other Stats." },
    { title: 'Body Extra', description: "Detailed information and rules for Body Extra." },
    { title: 'Coordination Effects', description: "Detailed information and rules for Coordination Effects." },
    { title: 'Sense Effects', description: "Detailed information and rules for Sense Effects." },
    { title: 'Mind Effects', description: "Detailed information and rules for Mind Effects." },
    { title: 'Charm Effects', description: "Detailed information and rules for Charm Effects." },
    { title: 'Command Effects', description: "Detailed information and rules for Command Effects." },
    { title: 'Skill Examples', description: "Detailed information and rules for Skill Examples." },
    { title: 'Base Will Description', description: "Detailed information and rules for Base Will Description." },
    { title: 'Power Capacities Table', description: "Detailed information and rules for Power Capacities Table." },
    { title: 'Size Modification Tables', description: "Detailed information and rules for Size Modification Tables." },
  ];

  return (
    <Accordion type="multiple" className="w-full space-y-6" defaultValue={["body-effects"]}>
      {allTables.map((table) => (
        <CollapsibleSectionItem key={table.title} title={table.title} value={table.title.toLowerCase().replace(/\s+/g, '-')}>
          <p className="text-muted-foreground mb-2">{table.description}</p>
          <div className="mt-4 p-1 border rounded-md bg-card/50">
            {table.title === 'Body Effects' && table.data ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dice</TableHead>
                    <TableHead>Lift</TableHead>
                    <TableHead>Throw 10 Yds.</TableHead>
                    <TableHead>Base Damage</TableHead>
                    <TableHead>Sprint</TableHead>
                    <TableHead>Jump (L/H)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(table.data as BodyEffectData[]).map((row) => (
                    <TableRow key={row.dice}>
                      <TableCell>{row.dice}</TableCell>
                      <TableCell>{row.lift}</TableCell>
                      <TableCell>{row.throw10Yds}</TableCell>
                      <TableCell>{row.baseDamage}</TableCell>
                      <TableCell>{row.sprint}</TableCell>
                      <TableCell>{row.jump}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-4 min-h-[100px]">
                Content for {table.title} will be displayed here. This could include actual tables, descriptions, or interactive elements in a future version.
              </div>
            )}
          </div>
        </CollapsibleSectionItem>
      ))}
    </Accordion>
  );
}
