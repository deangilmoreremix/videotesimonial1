"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

interface VoiceStudioLayoutProps {
  children: React.ReactNode;
}

export function VoiceStudioLayout({ children }: VoiceStudioLayoutProps) {
  return (
    <div className="container py-8">
      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="cloning">Cloning</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="multilingual">Multilingual</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <Card className="p-6">
          {children}
        </Card>
      </Tabs>
    </div>
  );
}