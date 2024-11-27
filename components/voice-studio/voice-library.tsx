"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVoices } from '@/lib/elevenlabs/hooks';
import { VoicePreview } from '@/components/voice/voice-preview';
import { Search, Plus } from 'lucide-react';
import { VoiceCloneDialog } from '@/components/voice/voice-clone-dialog';

export function VoiceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const { voices, isLoading } = useVoices();

  const filteredVoices = voices.filter(voice => 
    voice.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search voices..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowCloneDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Clone New Voice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      </div>

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