"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useStreamedSpeech } from '@/lib/elevenlabs/hooks';
import WaveSurfer from 'wavesurfer.js';

interface VoicePreviewProps {
  voiceId: string;
  sampleText?: string;
}

export function VoicePreview({ 
  voiceId, 
  sampleText = "Hello! This is a preview of how this voice sounds." 
}: VoicePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer>();
  const audioUrlRef = useRef<string>();

  const { generateSpeech, isGenerating, error } = useStreamedSpeech();

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4f46e5',
        progressColor: '#818cf8',
        cursorColor: '#4f46e5',
        barWidth: 2,
        barGap: 3,
        height: 40,
      });

      wavesurferRef.current.on('finish', () => setIsPlaying(false));
    }

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  const generatePreview = async () => {
    if (audioUrlRef.current) {
      if (wavesurferRef.current) {
        wavesurferRef.current.load(audioUrlRef.current);
      }
      return;
    }

    try {
      const url = await generateSpeech(sampleText, voiceId);
      audioUrlRef.current = url;

      if (wavesurferRef.current) {
        await wavesurferRef.current.load(url);
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const togglePlayback = async () => {
    if (!audioUrlRef.current) {
      await generatePreview();
    }

    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(newVolume);
    }
  };

  return (
    <div className="space-y-2">
      <div ref={waveformRef} />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlayback}
          disabled={isGenerating}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <Volume2 className="h-4 w-4" />
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}