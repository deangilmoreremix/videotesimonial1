"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Loader2, Wand2, Play, Pause } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { VoiceSelector } from '@/components/voice-selector';
import WaveSurfer from 'wavesurfer.js';

interface AudioInputProps {
  onAudioComplete: (url: string) => void;
  initialText?: string;
}

export function AudioInput({ onAudioComplete, initialText }: AudioInputProps) {
  const [text, setText] = useState(initialText || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState<File>();
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer>();
  const { toast } = useToast();

  const handleTextToSpeech = async () => {
    if (!text) {
      toast({
        title: "Text required",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: selectedVoice }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      onAudioComplete(url);

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
        await wavesurferRef.current.load(url);
      }

      toast({
        title: "Audio generated",
        description: "Your text has been converted to speech.",
      });
    } catch (error) {
      toast({
        title: "Error generating audio",
        description: "Failed to convert text to speech. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        onAudioComplete(url);
        
        toast({
          title: "Audio uploaded",
          description: "Your audio file has been uploaded successfully.",
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, etc.).",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Tabs defaultValue="text" className="space-y-4">
      <TabsList>
        <TabsTrigger value="text">Text to Speech</TabsTrigger>
        <TabsTrigger value="upload">Upload Audio</TabsTrigger>
      </TabsList>

      <TabsContent value="text" className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Voice</Label>
            <VoiceSelector
              value={selectedVoice}
              onChange={setSelectedVoice}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Enter Text</Label>
            <Textarea
              id="text"
              placeholder="Enter the text you want to convert to speech..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-32"
            />
          </div>

          <Button
            onClick={handleTextToSpeech}
            disabled={isProcessing || !text}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting to Speech...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Convert to Speech
              </>
            )}
          </Button>

          {audioUrl && (
            <div className="space-y-4">
              <div ref={waveformRef} />
              <Button
                variant="outline"
                className="w-full"
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
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="upload" className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="audio">Upload Audio File</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('audio')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Audio File
            </Button>
          </div>
          <input
            id="audio"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          {audioFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {audioFile.name}
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}