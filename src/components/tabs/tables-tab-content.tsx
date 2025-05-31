
// src/components/tabs/tables-tab-content.tsx
"use client";

import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  bodyEffectsData,
  type BodyEffectData,
  bodyExtraData,
  type BodyExtraData,
  bodyExtraNote,
  coordinationEffectsData,
  type CoordinationEffectData,
  senseEffectsData,
  type SenseEffectData,
  mindEffectsData,
  type MindEffectData,
  charmEffectsData,
  type CharmEffectData,
  commandEffectsData,
  type CommandEffectData,
  skillExamplesData,
  type SkillExampleData,
  baseWillDescriptionData,
  type BaseWillDescriptionData,
  powerCapacitiesData,
  type PowerCapacityData,
  reducedSizeData,
  increasedSizeData,
  type SizeModificationData,
} from "@/lib/effects-definitions";


export function TablesTabContent() {
  const allTables = [
    { title: 'Body Effects', data: bodyEffectsData, description: "Effects are not cumulative for Body; they are cumulative for all other Stats." },
    { title: 'Body Extra', data: bodyExtraData, description: "This table details the effects of Body Extras like Booster and No Upward Limit.", note: bodyExtraNote },
    { title: 'Coordination Effects', data: coordinationEffectsData, description: "Detailed information and rules for Coordination Effects." },
    { title: 'Sense Effects', data: senseEffectsData, description: "Detailed information and rules for Sense Effects." },
    { title: 'Mind Effects', data: mindEffectsData, description: "Detailed information and rules for Mind Effects." },
    { title: 'Charm Effects', data: charmEffectsData, description: "Detailed information and rules for Charm Effects." },
    { title: 'Command Effects', data: commandEffectsData, description: "Detailed information and rules for Command Effects." },
    { title: 'Skill Examples', data: skillExamplesData, description: "Examples of what different dice pools in skills might represent in terms of proficiency." },
    { title: 'Base Will Description', data: baseWillDescriptionData, description: "Descriptions for different Base Will ranges." },
    { title: 'Power Capacities Table', data: powerCapacitiesData, description: "Detailed information and rules for Power Capacities Table." },
    { title: 'Size Modification Tables', data: { reduced: reducedSizeData, increased: increasedSizeData }, description: "Detailed information and rules for Size Modification Tables." },
  ];

  return (
    <Accordion type="multiple" className="w-full space-y-6">
      {allTables.map((tableInfo) => (
        <CollapsibleSectionItem key={tableInfo.title} title={tableInfo.title} value={tableInfo.title.toLowerCase().replace(/\s+/g, '-')}>
          <p className="text-muted-foreground mb-2">{tableInfo.description}</p>
          {tableInfo.note && <p className="text-xs text-muted-foreground mb-2 italic">{tableInfo.note}</p>}
          <div className="mt-4 p-1 border rounded-md bg-card/50">
            {tableInfo.title === 'Body Effects' && Array.isArray(tableInfo.data) ? (
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
                  {(tableInfo.data as BodyEffectData[]).map((row) => (
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
            ) : tableInfo.title === 'Body Extra' && Array.isArray(tableInfo.data) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Body Extra</TableHead>
                      <TableHead>Lift</TableHead>
                      <TableHead>Throw</TableHead>
                      <TableHead>Damage</TableHead>
                      <TableHead>Sprint Speed/Jump</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tableInfo.data as BodyExtraData[]).map((row) => (
                      <TableRow key={row.bodyExtra}>
                        <TableCell>{row.bodyExtra}</TableCell>
                        <TableCell>{row.lift}</TableCell>
                        <TableCell>{row.throwEffect}</TableCell>
                        <TableCell>{row.damageEffect}</TableCell>
                        <TableCell>{row.sprintSpeedJump}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            ) : (tableInfo.title === 'Coordination Effects' || tableInfo.title === 'Sense Effects' || tableInfo.title === 'Mind Effects' || tableInfo.title === 'Charm Effects' || tableInfo.title === 'Command Effects') && Array.isArray(tableInfo.data) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dice</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tableInfo.data as (CoordinationEffectData | SenseEffectData | MindEffectData | CharmEffectData | CommandEffectData)[]).map((row) => (
                      <TableRow key={row.dice}>
                        <TableCell>{row.dice}</TableCell>
                        <TableCell>{row.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            ) : tableInfo.title === 'Skill Examples' && Array.isArray(tableInfo.data) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dice</TableHead>
                      <TableHead>Skill Level</TableHead>
                      <TableHead>Proficiency Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tableInfo.data as SkillExampleData[]).map((row) => (
                      <TableRow key={row.dice}>
                        <TableCell>{row.dice}</TableCell>
                        <TableCell>{row.skillLevel}</TableCell>
                        <TableCell>{row.proficiencyExample}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            ) : tableInfo.title === 'Base Will Description' && Array.isArray(tableInfo.data) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Range</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tableInfo.data as BaseWillDescriptionData[]).map((row) => (
                      <TableRow key={row.range}>
                        <TableCell>{row.range}</TableCell>
                        <TableCell>{row.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            ) : tableInfo.title === 'Power Capacities Table' && Array.isArray(tableInfo.data) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dicepool</TableHead>
                      <TableHead>Mass</TableHead>
                      <TableHead>Range</TableHead>
                      <TableHead>Speed</TableHead>
                      <TableHead>Radius</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tableInfo.data as PowerCapacityData[]).map((row) => (
                      <TableRow key={row.dicepool}>
                        <TableCell>{row.dicepool}</TableCell>
                        <TableCell>{row.mass}</TableCell>
                        <TableCell>{row.range}</TableCell>
                        <TableCell>{row.speed}</TableCell>
                        <TableCell>{row.radius}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            ) : tableInfo.title === 'Size Modification Tables' && typeof tableInfo.data === 'object' && tableInfo.data && 'reduced' in tableInfo.data && 'increased' in tableInfo.data ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Reduced Size</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Width</TableHead>
                          <TableHead>Mass</TableHead>
                          <TableHead>Height</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(tableInfo.data.reduced as SizeModificationData[]).map((row) => (
                          <TableRow key={`reduced-${row.width}`}>
                            <TableCell>{row.width}</TableCell>
                            <TableCell>{row.mass}</TableCell>
                            <TableCell>{row.height}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <p className="text-xs text-muted-foreground mt-1 italic">And so on. For each 1/8 mass, or each instance of the Booster Extra, halve height.</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Increased Size</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Width</TableHead>
                          <TableHead>Mass</TableHead>
                          <TableHead>Height</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(tableInfo.data.increased as SizeModificationData[]).map((row) => (
                          <TableRow key={`increased-${row.width}`}>
                            <TableCell>{row.width}</TableCell>
                            <TableCell>{row.mass}</TableCell>
                            <TableCell>{row.height}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <p className="text-xs text-muted-foreground mt-1 italic">And so on. For each x8 mass, or each instance of the Booster Extra, double height.</p>
                  </div>
                </div>
            ) : (
              <div className="p-4 min-h-[100px]">
                Content for {tableInfo.title} will be displayed here. This could include actual tables, descriptions, or interactive elements in a future version.
              </div>
            )}
          </div>
        </CollapsibleSectionItem>
      ))}
    </Accordion>
  );
}


    