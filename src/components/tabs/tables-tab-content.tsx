
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

interface BodyExtraData {
  bodyExtra: string;
  lift: string;
  throwEffect: string;
  damageEffect: string;
  sprintSpeedJump: string;
}

const bodyExtraData: BodyExtraData[] = [
    { bodyExtra: "Booster", lift: "x10", throwEffect: "x10 weight or +25 yards", damageEffect: "No effect", sprintSpeedJump: "x2"},
    { bodyExtra: "No Upward Limit*", lift: "x2", throwEffect: "x2 weight or +10 yards", damageEffect: "No effect", sprintSpeedJump: "x1.25"},
];

const bodyExtraNote = "* For doublings beyond Body 10d. Use the Body Effects table for increases up to the equivalent of Body 10d.";

interface CoordinationEffectData {
  dice: string;
  notes: string;
}

const coordinationEffectsData: CoordinationEffectData[] = [
  { dice: "1d", notes: "You can cross a room safely if there’s nothing in the way." },
  { dice: "2d", notes: "You play a decent game of darts." },
  { dice: "3d", notes: "You’re a great juggler." },
  { dice: "4d", notes: "You’re nimble as an aikido master." },
  { dice: "5d", notes: "You’re agile as an Olympic gymnast." },
  { dice: "6d", notes: "You can attempt to dodge or block any attack, even gunshots." },
  { dice: "7d", notes: "You can move so fast, you’re a blur." },
  { dice: "8d", notes: "You can catch fast objects such as arrows in flight without rolling—if they’re not aimed at you." },
  { dice: "9d", notes: "You can literally move faster than people can see." },
  { dice: "10d", notes: "Every external muscle in your body is under your conscious control." },
];

interface SenseEffectData {
  dice: string;
  notes: string;
}

const senseEffectsData: SenseEffectData[] = [
  { dice: "1d", notes: "You notice when someone’s talking to you—sometimes." },
  { dice: "2d", notes: "Loud noises wake you up." },
  { dice: "3d", notes: "You’re unusually sharp-eyed." },
  { dice: "4d", notes: "You’re an uncanny tracker." },
  { dice: "5d", notes: "You are one with your environment." },
  { dice: "6d", notes: "You can use your senses to compensate for each other; you can use minute sounds, the touch of air pressure, smells and taste to search a pitch-black room." },
  { dice: "7d", notes: "With a successful roll, you can sense movement up to a quarter mile away." },
  { dice: "8d", notes: "You can differentiate between dozens of sounds amidst a cacophony." },
  { dice: "9d", notes: "You can see in the dark, read by touch, and identify targets by smell." },
  { dice: "10d", notes: "It takes a Miracle (literally) to sneak up on you." },
];

interface MindEffectData {
  dice: string;
  notes: string;
}

const mindEffectsData: MindEffectData[] = [
  { dice: "1d", notes: "When people call you an intellectual, you can’t always tell they’re joking." },
  { dice: "2d", notes: "You can get high grades with a lot of work." },
  { dice: "3d", notes: "You’re notably bright and learning comes easily." },
  { dice: "4d", notes: "You can have your pick of Ivy-league scholarships." },
  { dice: "5d", notes: "You have a photographic memory (sight only) with a successful roll." },
  { dice: "6d", notes: "You have a photographic memory (all senses) with a successful roll. If you need a clue based on something you experienced at any time in the past, it’s yours." },
  { dice: "7d", notes: "Einstein and Hawking seem somewhat childish to you." },
  { dice: "8d", notes: "All modern theory is the equivalent of a monkey banging two stones together." },
  { dice: "9d", notes: "You can recall with perfect clarity anything you previously sensed without rolling." },
  { dice: "10d", notes: "You can consider intellectual problems even while asleep." },
];

interface CharmEffectData {
  dice: string;
  notes: string;
}

const charmEffectsData: CharmEffectData[] = [
  { dice: "1d", notes: "You’re a wallflower." },
  { dice: "2d", notes: "You get along with most people." },
  { dice: "3d", notes: "You often defuse tense situations." },
  { dice: "4d", notes: "Any time there’s a social function, you’re invited." },
  { dice: "5d", notes: "Your élan is legendary, and others struggle to win your favor." },
  { dice: "6d", notes: "With a successful roll you can make someone want to do something otherwise completely unpalatable." },
  { dice: "7d", notes: "You can convince anyone of anything after 5–width days of persuasion." },
  { dice: "8d", notes: "You can convince anyone of anything in 5–width hours of persuasion." },
  { dice: "9d", notes: "You can convince anyone of anything in 5–width minutes of persuasion." },
  { dice: "10d", notes: "You can convince anyone of anything in 5–width rounds of persuasion." },
];

interface CommandEffectData {
  dice: string;
  notes: string;
}

const commandEffectsData: CommandEffectData[] = [
  { dice: "1d", notes: "You are easily startled." },
  { dice: "2d", notes: "You’re a regular Joe or Jane." },
  { dice: "3d", notes: "You’re charismatic and graceful under pressure." },
  { dice: "4d", notes: "You’re a born leader and seemingly immune to stress." },
  { dice: "5d", notes: "Your presence commands attention and respect." },
  { dice: "6d", notes: "You don’t suffer the usual penalty die from injury or distraction." },
  { dice: "7d", notes: "You can use the Command Stat instead of Body with the Endurance Skill." },
  { dice: "8d", notes: "You are completely immune to pain and discomfort." },
  { dice: "9d", notes: "All your feelings and autonomic physical responses (breathing, heartbeat) are under your conscious control without a roll. You never need to make Trauma Checks." },
  { dice: "10d", notes: "On a successful roll, you can bark an order in a voice that causes a person to obey before considering the consequences, as long as it takes no more than a single round." },
];


export function TablesTabContent() {
  const allTables = [
    { title: 'Body Effects', data: bodyEffectsData, description: "Effects are not cumulative for Body; they are cumulative for all other Stats." },
    { title: 'Body Extra', data: bodyExtraData, description: "This table details the effects of Body Extras like Booster and No Upward Limit.", note: bodyExtraNote },
    { title: 'Coordination Effects', data: coordinationEffectsData, description: "Detailed information and rules for Coordination Effects." },
    { title: 'Sense Effects', data: senseEffectsData, description: "Detailed information and rules for Sense Effects." },
    { title: 'Mind Effects', data: mindEffectsData, description: "Detailed information and rules for Mind Effects." },
    { title: 'Charm Effects', data: charmEffectsData, description: "Detailed information and rules for Charm Effects." },
    { title: 'Command Effects', data: commandEffectsData, description: "Detailed information and rules for Command Effects." },
    { title: 'Skill Examples', description: "Detailed information and rules for Skill Examples." },
    { title: 'Base Will Description', description: "Detailed information and rules for Base Will Description." },
    { title: 'Power Capacities Table', description: "Detailed information and rules for Power Capacities Table." },
    { title: 'Size Modification Tables', description: "Detailed information and rules for Size Modification Tables." },
  ];

  return (
    <Accordion type="multiple" className="w-full space-y-6" defaultValue={["body-effects", "body-extra", "coordination-effects", "sense-effects", "mind-effects", "charm-effects", "command-effects"]}>
      {allTables.map((tableInfo) => (
        <CollapsibleSectionItem key={tableInfo.title} title={tableInfo.title} value={tableInfo.title.toLowerCase().replace(/\s+/g, '-')}>
          <p className="text-muted-foreground mb-2">{tableInfo.description}</p>
          {tableInfo.note && <p className="text-xs text-muted-foreground mb-2 italic">{tableInfo.note}</p>}
          <div className="mt-4 p-1 border rounded-md bg-card/50">
            {tableInfo.title === 'Body Effects' && tableInfo.data ? (
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
            ) : tableInfo.title === 'Body Extra' && tableInfo.data ? (
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
            ) : tableInfo.title === 'Coordination Effects' && tableInfo.data ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dice</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tableInfo.data as CoordinationEffectData[]).map((row) => (
                      <TableRow key={row.dice}>
                        <TableCell>{row.dice}</TableCell>
                        <TableCell>{row.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            ) : tableInfo.title === 'Sense Effects' && tableInfo.data ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dice</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tableInfo.data as SenseEffectData[]).map((row) => (
                      <TableRow key={row.dice}>
                        <TableCell>{row.dice}</TableCell>
                        <TableCell>{row.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            ) : tableInfo.title === 'Mind Effects' && tableInfo.data ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dice</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tableInfo.data as MindEffectData[]).map((row) => (
                      <TableRow key={row.dice}>
                        <TableCell>{row.dice}</TableCell>
                        <TableCell>{row.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            ) : tableInfo.title === 'Charm Effects' && tableInfo.data ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dice</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tableInfo.data as CharmEffectData[]).map((row) => (
                      <TableRow key={row.dice}>
                        <TableCell>{row.dice}</TableCell>
                        <TableCell>{row.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            ) : tableInfo.title === 'Command Effects' && tableInfo.data ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dice</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tableInfo.data as CommandEffectData[]).map((row) => (
                      <TableRow key={row.dice}>
                        <TableCell>{row.dice}</TableCell>
                        <TableCell>{row.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

