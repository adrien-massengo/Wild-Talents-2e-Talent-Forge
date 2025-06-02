
// src/components/tabs/gm-tools-tab-content.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";

export function GmToolsTabContent() {
  return (
    <Accordion type="multiple" className="w-full space-y-6">
      <CollapsibleSectionItem title="Character Creation Parameters">
        <Card>
          <CardContent className="pt-6">
            <p>Character Creation Parameters tools will be available here in a future update.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This section could help GMs define or adjust baseline parameters for character creation in their campaigns (e.g., starting points, allowed/disallowed MQs).
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="Custom Archetype Creation">
        <Card>
          <CardContent className="pt-6">
            <p>Custom Archetype Creation tools will be available here in a future update.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This might guide GMs through balancing and defining new archetypes for their game world.
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="Custom Power Creation">
        <Card>
          <CardContent className="pt-6">
            <p>Custom Power Creation tools will be available here in a future update.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This tool could assist GMs in designing and costing new Miracles or power qualities.
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="Custom Extra Creation">
        <Card>
          <CardContent className="pt-6">
            <p>Custom Extra Creation tools will be available here in a future update.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Aids for GMs to create balanced custom Extras for powers.
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="Custom Flaw Creation">
        <Card>
          <CardContent className="pt-6">
            <p>Custom Flaw Creation tools will be available here in a future update.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Aids for GMs to create balanced custom Flaws for powers.
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="NPC Generator">
        <Card>
          <CardContent className="pt-6">
            <p>NPC Generator tools will be available here in a future update.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This section could include options to quickly generate non-player characters
              with varying levels of detail, stats, and simple motivations.
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
      <CollapsibleSectionItem title="Encounter Balancer">
        <Card>
          <CardContent className="pt-6">
            <p>Encounter Balancer tools will be available here in a future update.</p>
             <p className="mt-2 text-sm text-muted-foreground">
              This might help GMs estimate the difficulty of a planned encounter
              based on player character capabilities and selected antagonists.
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
       <CollapsibleSectionItem title="Plot Hook Ideas">
        <Card>
          <CardContent className="pt-6">
            <p>Plot Hook Ideas will be available here in a future update.</p>
             <p className="mt-2 text-sm text-muted-foreground">
              Could provide a list of generic or genre-specific plot hooks
              to inspire GMs for their campaigns.
            </p>
          </CardContent>
        </Card>
      </CollapsibleSectionItem>
    </Accordion>
  );
}

