"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Waveform, Volume2, Gauge, Mic2 } from 'lucide-react';

interface VoiceSettings {
  pitch: number;
  speed: number;
  emotion: number;
  clarity: number;
  useEnhancer: boolean;
}

export function VoiceCustomization() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<VoiceSettings>({
    pitch: 1,
    speed: 1,
    emotion: 0.5,
    clarity: 0.7,
    useEnhancer: true,
  });

  const updateSetting = (key: keyof VoiceSettings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePreview = () => {
    toast({
      title: "Generating preview...",
      description: "Your voice preview will be ready in a moment.",
    });
    // Add preview generation logic here
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Waveform className="h-5 w-5 text-primary" />
          <div className="flex-1 space-y-2">
            <Label>Pitch ({settings.pitch.toFixed(2)})</Label>
            <Slider
              value={[settings.pitch]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={([value]) => updateSetting("pitch", value)}
            />
            <p className="text-sm text-muted-foreground">
              Adjust the voice pitch higher or lower
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Gauge className="h-5 w-5 text-primary" />
          <div className="flex-1 space-y-2">
            <Label>Speed ({settings.speed.toFixed(2)}x)</Label>
            <Slider
              value={[settings.speed]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={([value]) => updateSetting("speed", value)}
            />
            <p className="text-sm text-muted-foreground">
              Control the speaking rate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Volume2 className="h-5 w-5 text-primary" />
          <div className="flex-1 space-y-2">
            <Label>Emotion Intensity ({settings.emotion.toFixed(2)})</Label>
            <Slider
              value={[settings.emotion]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([value]) => updateSetting("emotion", value)}
            />
            <p className="text-sm text-muted-foreground">
              Adjust emotional expression level
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Mic2 className="h-5 w-5 text-primary" />
          <div className="flex-1 space-y-2">
            <Label>Voice Clarity ({settings.clarity.toFixed(2)})</Label>
            <Slider
              value={[settings.clarity]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([value]) => updateSetting("clarity", value)}
            />
            <p className="text-sm text-muted-foreground">
              Enhance voice clarity and definition
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="space-y-1">
            <Label>Voice Enhancer</Label>
            <p className="text-sm text-muted-foreground">
              Apply AI enhancement to improve voice quality
            </p>
          </div>
          <Switch
            checked={settings.useEnhancer}
            onCheckedChange={(checked) => updateSetting("useEnhancer", checked)}
          />
        </div>
      </div>

      <Button onClick={handlePreview} className="w-full">
        Preview Voice
      </Button>
    </Card>
  );
}