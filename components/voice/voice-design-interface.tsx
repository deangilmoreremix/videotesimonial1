"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoicePreview } from './voice-preview';
import { VOICE_PRESETS } from '@/lib/elevenlabs/constants';
import { Waveform, Volume2, Gauge, Mic2 } from 'lucide-react';

export function VoiceDesignInterface() {
  const [settings, setSettings] = useState({
    stability: 0.5,
    clarity: 0.75,
    style: 0.5,
    emotion: 0.5,
    useEnhancer: true
  });

  const [selectedPreset, setSelectedPreset] = useState('');

  const handlePresetSelect = (presetId: string) => {
    const preset = VOICE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSettings(preset.settings);
      setSelectedPreset(presetId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Voice Design</h2>
        <p className="text-muted-foreground">
          Customize and fine-tune voice parameters
        </p>
      </div>

      <Tabs defaultValue="parameters">
        <TabsList>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Waveform className="h-5 w-5 text-primary" />
                <div className="flex-1 space-y-2">
                  <Label>Stability ({settings.stability.toFixed(2)})</Label>
                  <Slider
                    value={[settings.stability]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([value]) => setSettings(prev => ({ ...prev, stability: value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mic2 className="h-5 w-5 text-primary" />
                <div className="flex-1 space-y-2">
                  <Label>Clarity ({settings.clarity.toFixed(2)})</Label>
                  <Slider
                    value={[settings.clarity]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([value]) => setSettings(prev => ({ ...prev, clarity: value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Volume2 className="h-5 w-5 text-primary" />
                <div className="flex-1 space-y-2">
                  <Label>Style ({settings.style.toFixed(2)})</Label>
                  <Slider
                    value={[settings.style]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([value]) => setSettings(prev => ({ ...prev, style: value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Gauge className="h-5 w-5 text-primary" />
                <div className="flex-1 space-y-2">
                  <Label>Emotion ({settings.emotion.toFixed(2)})</Label>
                  <Slider
                    value={[settings.emotion]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([value]) => setSettings(prev => ({ ...prev, emotion: value }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Voice Enhancer</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply AI enhancement to improve voice quality
                  </p>
                </div>
                <Switch
                  checked={settings.useEnhancer}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, useEnhancer: checked }))}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {VOICE_PRESETS.map(preset => (
            <Card
              key={preset.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedPreset === preset.id ? 'border-primary' : ''
              }`}
              onClick={() => handlePresetSelect(preset.id)}
            >
              <h3 className="font-semibold">{preset.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {preset.description}
              </p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <VoicePreview
            voiceId="demo"
            settings={settings}
            sampleText="This is a preview of how the voice will sound with these settings."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}