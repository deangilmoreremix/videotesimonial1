"use client";

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Camera,
  Smile,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';

interface VideoPreviewProps {
  videoUrl?: string;
  isGenerating?: boolean;
  progress?: number;
  onRegenerate?: () => void;
  onSettingsChange?: (settings: any) => void;
}

export function VideoPreview({
  videoUrl,
  isGenerating,
  progress = 0,
  onRegenerate,
  onSettingsChange
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [cameraAngle, setCameraAngle] = useState('front');
  const [settings, setSettings] = useState({
    expressionIntensity: 1,
    headMovement: 1,
    lipSync: 1,
    motionSmoothing: 0.5,
    quality: 'high',
    fps: 30
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cameraAngles = [
    { id: 'front', label: 'Front' },
    { id: 'threequarter', label: '¾ View' },
    { id: 'side', label: 'Side' }
  ];

  const qualityPresets = [
    { id: 'high', label: 'High Quality', fps: 30 },
    { id: 'medium', label: 'Medium Quality', fps: 24 },
    { id: 'low', label: 'Low Quality', fps: 15 }
  ];

  const updateSettings = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="camera">Camera</TabsTrigger>
          <TabsTrigger value="motion">Motion</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="space-y-4">
            <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  {isGenerating ? (
                    <div className="space-y-4 text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
                      <p className="text-sm">Generating video... {progress}%</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No video generated yet
                    </p>
                  )}
                </div>
              )}
            </div>

            {videoUrl && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={([value]) => handleSeek(value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSeek(Math.max(0, currentTime - 5))}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={togglePlayback}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSeek(Math.min(duration, currentTime + 5))}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
                    >
                      {volume === 0 ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Slider
                      value={[volume]}
                      max={1}
                      step={0.1}
                      className="w-24"
                      onValueChange={([value]) => handleVolumeChange(value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="camera" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Camera Angle</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {cameraAngles.map(angle => (
                  <Button
                    key={angle.id}
                    variant={cameraAngle === angle.id ? "default" : "outline"}
                    onClick={() => {
                      setCameraAngle(angle.id);
                      onSettingsChange?.({ cameraAngle: angle.id });
                    }}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {angle.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Expression Intensity</Label>
              <Slider
                value={[settings.expressionIntensity]}
                min={0}
                max={2}
                step={0.1}
                onValueChange={([value]) => updateSettings('expressionIntensity', value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Head Movement</Label>
              <Slider
                value={[settings.headMovement]}
                min={0}
                max={2}
                step={0.1}
                onValueChange={([value]) => updateSettings('headMovement', value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="motion" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Lip Sync Accuracy</Label>
              <Slider
                value={[settings.lipSync]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => updateSettings('lipSync', value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Motion Smoothing</Label>
              <Slider
                value={[settings.motionSmoothing]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => updateSettings('motionSmoothing', value)}
              />
            </div>

            <div>
              <Label>Quality Preset</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {qualityPresets.map(preset => (
                  <Button
                    key={preset.id}
                    variant={settings.quality === preset.id ? "default" : "outline"}
                    onClick={() => {
                      updateSettings('quality', preset.id);
                      updateSettings('fps', preset.fps);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  // Export as MP4
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export MP4
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Export as GIF
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export GIF
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Frame Rate</Label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 24, 30, 60].map(fps => (
                  <Button
                    key={fps}
                    variant={settings.fps === fps ? "default" : "outline"}
                    onClick={() => updateSettings('fps', fps)}
                  >
                    {fps} FPS
                  </Button>
                ))}
              </div>
            </div>

            {onRegenerate && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onRegenerate}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Video
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}