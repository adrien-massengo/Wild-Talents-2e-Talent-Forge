
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
            <Accordion type="multiple" className="w-full space-y-4">
              <CollapsibleSectionItem title="Point Restrictions" value="gm-point-restrictions">
                <Card>
                  <CardContent className="pt-6 text-sm">
                    <p>Tools to set default point limits (overall, stats, skills, etc.) for new characters will be available here in a future update.</p>
                  </CardContent>
                </Card>
              </CollapsibleSectionItem>
              <CollapsibleSectionItem title="Sample Archetypes Restrictions" value="gm-archetype-restrictions">
                <Card>
                  <CardContent className="pt-6 text-sm">
                    <p>Tools to allow or disallow specific sample archetypes for character creation will be available here in a future update.</p>
                  </CardContent>
                </Card>
              </CollapsibleSectionItem>
              <CollapsibleSectionItem title="Allowed Sample meta-Qualities" value="gm-meta-quality-restrictions">
                <Card>
                  <CardContent className="pt-6 text-sm">
                    <p>Tools to define which source, permission, or intrinsic meta-qualities are available by default will be available here in a future update.</p>
                  </CardContent>
                </Card>
              </CollapsibleSectionItem>
              <CollapsibleSectionItem title="Sample Skill Restrictions" value="gm-skill-restrictions">
                <Card>
                  <CardContent className="pt-6 text-sm">
                    <p>Tools to manage the list of predefined skills available to characters will be available here in a future update.</p>
                  </CardContent>
                </Card>
              </CollapsibleSectionItem>
              <CollapsibleSectionItem title="Willpower Restrictions" value="gm-willpower-restrictions">
                <Card>
                  <CardContent className="pt-6 text-sm">
                    <p>Tools to set default willpower purchasing rules or limits will be available here in a future update.</p>
                  </CardContent>
                </Card>
              </CollapsibleSectionItem>
              <CollapsibleSectionItem title="Miracle Restrictions" value="gm-miracle-restrictions">
                <Card>
                  <CardContent className="pt-6 text-sm">
                    <p>Tools to manage allowed miracle templates or apply restrictions to custom miracle creation will be available here in a future update.</p>
                  </CardContent>
                </Card>
              </CollapsibleSectionItem>
            </Accordion>
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
    </Accordion>
  );
}

