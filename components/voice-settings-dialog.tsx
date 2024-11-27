"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Waveform, Mic2, Volume2, Gauge } from "lucide-react";

interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  speakingRate: number;
  useHighestQuality: boolean;
}

interface VoiceSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onSettingsChange: (settings: VoiceSettings) => void;
}

export function VoiceSettingsDialog({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: VoiceSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const updateSetting = (key: keyof VoiceSettings, value: number | boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Waveform className="h-5 w-5 text-primary" />
              <div className="flex-1 space-y-2">
                <Label>Stability ({localSettings.stability.toFixed(2)})</Label>
                <Slider
                  value={[localSettings.stability]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => updateSetting("stability", value)}
                />
                <p className="text-sm text-muted-foreground">
                  Higher values make the voice more consistent
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mic2 className="h-5 w-5 text-primary" />
              <div className="flex-1 space-y-2">
                <Label>
                  Similarity Boost ({localSettings.similarityBoost.toFixed(2)})
                </Label>
                <Slider
                  value={[localSettings.similarityBoost]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => updateSetting("similarityBoost", value)}
                />
                <p className="text-sm text-muted-foreground">
                  Higher values make the voice more similar to the original
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Volume2 className="h-5 w-5 text-primary" />
              <div className="flex-1 space-y-2">
                <Label>Style ({localSettings.style.toFixed(2)})</Label>
                <Slider
                  value={[localSettings.style]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => updateSetting("style", value)}
                />
                <p className="text-sm text-muted-foreground">
                  Adjust the speaking style intensity
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Gauge className="h-5 w-5 text-primary" />
              <div className="flex-1 space-y-2">
                <Label>
                  Speaking Rate ({localSettings.speakingRate.toFixed(2)}x)
                </Label>
                <Slider
                  value={[localSettings.speakingRate]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={([value]) => updateSetting("speakingRate", value)}
                />
                <p className="text-sm text-muted-foreground">
                  Adjust how fast or slow the voice speaks
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="space-y-1">
                <Label>Highest Quality</Label>
                <p className="text-sm text-muted-foreground">
                  Use 48kHz audio quality
                </p>
              </div>
              <Switch
                checked={localSettings.useHighestQuality}
                onCheckedChange={(checked) =>
                  updateSetting("useHighestQuality", checked)
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}