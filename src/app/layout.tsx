
// src/app/layout.tsx
"use client"; // Required for the useTheme hook to work correctly at the root

import type { Metadata } from 'next'; // Keep for server-side metadata generation if needed
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { useTheme } from "@/hooks/use-theme";
import { useEffect } from 'react';

// Metadata can still be defined for static export or initial server render
export const metadataObject: Metadata = {
  title: 'Wild Talents 2e: Talent Forge',
  description: 'Character creator for Wild Talents 2nd Edition.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useTheme hook will manage the theme state and apply it to the HTML element
  // It needs to be called within a client component or a component marked "use client"
  const { theme, setTheme } = useTheme(); // Initialize theme

  useEffect(() => {
    // This is a bit of a trick to set metadata title if needed, but primarily we use the hook for class changes
    if (typeof document !== "undefined") {
      document.title = metadataObject.title as string;
    }
  }, []);


  return (
    <html lang="en" className={theme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
