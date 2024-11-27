"use client";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import type { VoiceSettings } from "@/lib/elevenlabs";

interface VoiceSettingsProps {
  onChange: (settings: VoiceSettings) => void;
  defaultSettings?: Partial<VoiceSettings>;
}

export function VoiceSettings({ onChange, defaultSettings }: VoiceSettingsProps) {
  const [settings, setSettings] = useState<VoiceSettings>({
    stability: defaultSettings?.stability ?? 0.5,
    similarityBoost: defaultSettings?.similarityBoost ?? 0.75,
    style: defaultSettings?.style ?? 0.5,
    speakingRate: defaultSettings?.speakingRate ?? 1,
    useHighestQuality: defaultSettings?.useHighestQuality ?? true,
  });

  const updateSettings = (update: Partial<VoiceSettings>) => {
    const newSettings = { ...settings, ...update };
    setSettings(newSettings);
    onChange(newSettings);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Stability ({settings.stability.toFixed(2)})</Label>
          <Slider
            value={[settings.stability]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => updateSettings({ stability: value })}
          />
          <p className="text-sm text-muted-foreground">
            Higher values make the voice more consistent but may lose some expressiveness
          </p>
        </div>

        <div className="space-y-2">
          <Label>Clarity + Similarity ({settings.similarityBoost.toFixed(2)})</Label>
          <Slider
            value={[settings.similarityBoost]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => updateSettings({ similarityBoost: value })}
          />
          <p className="text-sm text-muted-foreground">
            Higher values make the voice clearer and more similar to the original
          </p>
        </div>

        <div className="space-y-2">
          <Label>Style ({settings.style.toFixed(2)})</Label>
          <Slider
            value={[settings.style]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => updateSettings({ style: value })}
          />
          <p className="text-sm text-muted-foreground">
            Adjust the speaking style intensity
          </p>
        </div>

        <div className="space-y-2">
          <Label>Speaking Rate ({settings.speakingRate.toFixed(2)}x)</Label>
          <Slider
            value={[settings.speakingRate]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={([value]) => updateSettings({ speakingRate: value })}
          />
          <p className="text-sm text-muted-foreground">
            Adjust how fast or slow the voice speaks
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Highest Quality</Label>
            <p className="text-sm text-muted-foreground">
              Use 48kHz audio quality
            </p>
          </div>
          <Switch
            checked={settings.useHighestQuality}
            onCheckedChange={(checked) => updateSettings({ useHighestQuality: checked })}
          />
        </div>
      </div>
    </Card>
  );
}