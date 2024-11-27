"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fetchAvailableVoices, voiceCategories, type VoiceOption } from '@/lib/elevenlabs';
import { Play, Pause, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VoiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const availableVoices = await fetchAvailableVoices();
        setVoices(availableVoices);
      } catch (error) {
        toast({
          title: "Error loading voices",
          description: "Failed to load available voices. Using default voices instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVoices();
  }, [toast]);

  const filteredVoices = selectedCategory
    ? voices.filter(voice => voice.category === selectedCategory)
    : voices;

  const playPreview = (voice: VoiceOption) => {
    if (playingPreview === voice.id) {
      audioElement?.pause();
      setPlayingPreview(null);
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(voice.preview_url);
    audio.onended = () => setPlayingPreview(null);
    audio.play();
    setAudioElement(audio);
    setPlayingPreview(voice.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All ({voices.length})
        </Button>
        {voiceCategories.map(category => {
          const count = voices.filter(voice => voice.category === category.id).length;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({count})
            </Button>
          );
        })}
      </div>

      <RadioGroup value={value} onValueChange={onChange} className="grid gap-4">
        {filteredVoices.map(voice => (
          <Card key={voice.id} className="relative">
            <label
              htmlFor={voice.id}
              className="flex items-start space-x-4 p-4 cursor-pointer"
            >
              <RadioGroupItem value={voice.id} id={voice.id} className="mt-1" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor={voice.id} className="font-medium">
                    {voice.name}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      playPreview(voice);
                    }}
                  >
                    {playingPreview === voice.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>{voice.gender}</span>
                  <span>•</span>
                  <span>{voice.age}</span>
                  {voice.accent && (
                    <>
                      <span>•</span>
                      <span>{voice.accent}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {voice.description}
                </p>
              </div>
            </label>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}