"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Play, Pause, Settings } from "lucide-react";
import WaveSurfer from "wavesurfer.js";
import { VoiceSettingsDialog } from "./voice-settings-dialog";

interface VoicePreviewProps {
  voiceId: string;
  sampleText?: string;
  onSettingsChange?: (settings: any) => void;
}

export function VoicePreview({
  voiceId,
  sampleText = "Hello! This is a preview of how this voice sounds.",
  onSettingsChange,
}: VoicePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [showSettings, setShowSettings] = useState(false);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer>();

  const [settings, setSettings] = useState({
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.5,
    speakingRate: 1,
    useHighestQuality: true,
  });

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4f46e5',
        progressColor: '#818cf8',
        cursorColor: '#4f46e5',
        barWidth: 2,
        barGap: 3,
        height: 60,
      });

      wavesurferRef.current.on('finish', () => setIsPlaying(false));
    }

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  const generatePreview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/elevenlabs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sampleText,
          voiceId,
          settings,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate preview");

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      if (wavesurferRef.current) {
        await wavesurferRef.current.load(url);
      }
    } catch (error) {
      console.error("Error generating preview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSettingsChange = (newSettings: any) => {
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Label>Voice Preview</Label>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div ref={waveformRef} className="w-full" />

      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={generatePreview}
          disabled={isLoading}
        >
          Generate Preview
        </Button>
        {audioUrl && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Play
              </>
            )}
          </Button>
        )}
      </div>

      <VoiceSettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </Card>
  );
}