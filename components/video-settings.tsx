"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Sliders, 
  Wand2, 
  Layout, 
  Smile,
  Movement
} from "lucide-react";

interface VideoSettings {
  enhancer: boolean;
  expressionScale: number;
  poseStyle: number;
  lipSyncAccuracy: number;
  backgroundStyle: string;
  motionSmoothing: number;
}

interface VideoSettingsProps {
  settings: VideoSettings;
  onSettingsComplete: (settings: VideoSettings) => void;
}

export function VideoSettings({ settings, onSettingsComplete }: VideoSettingsProps) {
  return (
    <Tabs defaultValue="style" className="space-y-4">
      <TabsList>
        <TabsTrigger value="style">Style</TabsTrigger>
        <TabsTrigger value="motion">Motion</TabsTrigger>
        <TabsTrigger value="quality">Quality</TabsTrigger>
      </TabsList>

      <TabsContent value="style">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enhancer" className="font-medium">
                AI Enhancement
              </Label>
              <Switch
                id="enhancer"
                checked={settings.enhancer}
                onCheckedChange={(checked) => 
                  onSettingsComplete({ ...settings, enhancer: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expression-scale" className="font-medium">
                Expression Intensity
              </Label>
              <Slider
                id="expression-scale"
                min={0}
                max={2}
                step={0.1}
                value={[settings.expressionScale]}
                onValueChange={([value]) =>
                  onSettingsComplete({ ...settings, expressionScale: value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lip-sync" className="font-medium">
                Lip Sync Accuracy
              </Label>
              <Slider
                id="lip-sync"
                min={0}
                max={1}
                step={0.1}
                value={[settings.lipSyncAccuracy]}
                onValueChange={([value]) =>
                  onSettingsComplete({ ...settings, lipSyncAccuracy: value })
                }
              />
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="motion">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pose-style" className="font-medium">
                Head Movement Style
              </Label>
              <Slider
                id="pose-style"
                min={0}
                max={2}
                step={1}
                value={[settings.poseStyle]}
                onValueChange={([value]) =>
                  onSettingsComplete({ ...settings, poseStyle: value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motion-smoothing" className="font-medium">
                Motion Smoothing
              </Label>
              <Slider
                id="motion-smoothing"
                min={0}
                max={1}
                step={0.1}
                value={[settings.motionSmoothing]}
                onValueChange={([value]) =>
                  onSettingsComplete({ ...settings, motionSmoothing: value })
                }
              />
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="quality">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>High Quality Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable for best visual quality (slower processing)
                </p>
              </div>
              <Switch
                checked={settings.enhancer}
                onCheckedChange={(checked) =>
                  onSettingsComplete({ ...settings, enhancer: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Background Style</Label>
              <div className="grid grid-cols-3 gap-4">
                {['none', 'blur', 'replace'].map((style) => (
                  <Button
                    key={style}
                    variant={settings.backgroundStyle === style ? "default" : "outline"}
                    onClick={() =>
                      onSettingsComplete({ ...settings, backgroundStyle: style })
                    }
                    className="w-full"
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}