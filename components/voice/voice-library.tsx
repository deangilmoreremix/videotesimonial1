"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Play, Pause, Plus } from 'lucide-react';
import { VoiceOption } from '@/lib/elevenlabs/types';
import { VOICE_CATEGORIES } from '@/lib/elevenlabs/constants';
import { fetchVoices } from '@/lib/elevenlabs/api';
import { VoicePreview } from './voice-preview';
import { VoiceCloneDialog } from './voice-clone-dialog';

export function VoiceLibrary() {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      const availableVoices = await fetchVoices();
      setVoices(availableVoices);
    } catch (error) {
      console.error('Error loading voices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || voice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Voice Library</h2>
          <p className="text-muted-foreground">
            Choose from our collection of high-quality voices
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

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Voices</TabsTrigger>
          {VOICE_CATEGORIES.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
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
        </TabsContent>

        {VOICE_CATEGORIES.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredVoices
                .filter(voice => voice.category === category.id)
                .map(voice => (
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
          </TabsContent>
        ))}
      </Tabs>

      <VoiceCloneDialog
        isOpen={showCloneDialog}
        onClose={() => setShowCloneDialog(false)}
        onVoiceCreated={(voiceId) => {
          loadVoices();
          setShowCloneDialog(false);
        }}
      />
    </div>
  );
}