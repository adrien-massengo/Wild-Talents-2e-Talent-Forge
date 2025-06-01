
// src/components/tabs/gm-tools-tab-content.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { CollapsibleSectionItem } from "@/components/shared/collapsible-section-item";

export function GmToolsTabContent() {
  return (
    <Accordion type="multiple" className="w-full space-y-6">
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
