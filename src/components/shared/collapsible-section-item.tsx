// src/components/shared/collapsible-section-item.tsx
"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

interface CollapsibleSectionItemProps {
  title: string;
  children: React.ReactNode;
  value?: string; // Optional explicit value for AccordionItem
}

export function CollapsibleSectionItem({ title, children, value }: CollapsibleSectionItemProps) {
  const itemValue = value || title.toLowerCase().replace(/\s+/g, '-');
  return (
    <AccordionItem value={itemValue} className="border-none">
        <AccordionTrigger className="font-headline text-xl hover:no-underline bg-card px-4 py-3 rounded-t-md data-[state=open]:rounded-b-none data-[state=open]:border-b-0 border border-border shadow-sm hover:bg-accent/10 transition-colors">
          {title}
        </AccordionTrigger>
        <AccordionContent className="p-6 border border-t-0 border-border rounded-b-md bg-background shadow-sm">
          <div className="space-y-4">
            {children}
          </div>
        </AccordionContent>
    </AccordionItem>
  );
}
