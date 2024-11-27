"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVoices } from '@/lib/elevenlabs/hooks';
import { VoicePreview } from './voice-preview';
import { VoiceCloneDialog } from './voice-clone-dialog';
import { Search, Plus, Loader2 } from 'lucide-react';
import { VOICE_CATEGORIES } from '@/lib/elevenlabs/constants';

export function VoiceLibraryInterface() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const { voices, isLoading } = useVoices();

  const filteredVoices = voices.filter(voice => 
    voice.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Voice Library</h2>
          <p className="text-muted-foreground">
            Browse and manage your voice collection
          </p>
        </div>
        <Button onClick={() => setShowCloneDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Clone New Voice
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search voices..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Voices</TabsTrigger>
          {VOICE_CATEGORIES.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <TabsContent value="all" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVoices.map(voice => (
              <Card key={voice.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{voice.name}</h3>
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                      {voice.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{voice.description}</p>
                  <VoicePreview voiceId={voice.id} />
                </div>
              </Card>
            ))}
          </TabsContent>
        )}
      </Tabs>

      <VoiceCloneDialog
        isOpen={showCloneDialog}
        onClose={() => setShowCloneDialog(false)}
        onVoiceCreated={() => {
          setShowCloneDialog(false);
          // Refresh voice list
        }}
      />
    </div>
  );
}