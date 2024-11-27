"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudioInput } from '@/components/audio-input';
import { VideoSettings } from '@/components/video-settings';
import { useToast } from '@/components/ui/use-toast';

export type VideoSettings = {
  enhancer: boolean;
  expressionScale: number;
  poseStyle: number;
};

interface VideoGeneratorProps {
  initialImage?: string;
  initialText?: string;
}

export function VideoGenerator({ initialImage, initialText }: VideoGeneratorProps) {
  const [audioUrl, setAudioUrl] = useState<string>();
  const [activeTab, setActiveTab] = useState('audio');
  const [settings, setSettings] = useState<VideoSettings>({
    enhancer: true,
    expressionScale: 1,
    poseStyle: 0,
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleAudioComplete = (url: string) => {
    setAudioUrl(url);
    toast({
      title: "Audio ready",
      description: "You can now customize settings and generate the video.",
    });
    setActiveTab('settings');
  };

  const handleSettingsComplete = (newSettings: VideoSettings) => {
    setSettings(newSettings);
    if (initialImage && audioUrl) {
      const params = new URLSearchParams({
        image: initialImage,
        audio: audioUrl,
      });
      router.push(`/preview?${params.toString()}`);
    }
  };

  if (!initialImage) {
    return null;
  }

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="audio">1. Audio</TabsTrigger>
          <TabsTrigger value="settings" disabled={!audioUrl}>2. Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="audio">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add Audio</h2>
            <p className="text-sm text-muted-foreground">
              Convert the testimonial text to speech or upload your own audio.
            </p>
            <AudioInput 
              onAudioComplete={handleAudioComplete}
              initialText={initialText}
            />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Customize Settings</h2>
            <p className="text-sm text-muted-foreground">
              Fine-tune the video generation parameters for optimal results.
            </p>
            <VideoSettings
              settings={settings}
              onSettingsComplete={handleSettingsComplete}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}