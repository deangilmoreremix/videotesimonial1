"use client";

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  Grid,
  SplitSquareVertical,
  Palette,
  Sun,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  onSettingsChange: (settings: any) => void;
}

export function ImagePreview({ imageUrl, onSettingsChange }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showSplitView, setShowSplitView] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('original');
  const [enhancementLevel, setEnhancementLevel] = useState(50);
  const [lightingSettings, setLightingSettings] = useState({
    brightness: 100,
    contrast: 100,
    highlights: 0,
    shadows: 0
  });
  const [colorGrade, setColorGrade] = useState('natural');
  const [backgroundSettings, setBackgroundSettings] = useState({
    blur: 0,
    remove: false,
    replace: false
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const aspectRatios = [
    { id: 'original', label: 'Original' },
    { id: '1:1', label: 'Square' },
    { id: '4:3', label: 'Portrait' },
    { id: '16:9', label: 'Landscape' }
  ];

  const colorGrades = [
    { id: 'natural', label: 'Natural' },
    { id: 'vibrant', label: 'Vibrant' },
    { id: 'warm', label: 'Warm' },
    { id: 'cool', label: 'Cool' },
    { id: 'bw', label: 'B&W' }
  ];

  const handleZoom = (value: number) => {
    setZoom(value);
    onSettingsChange({ zoom: value });
  };

  const handlePan = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return; // Only pan on left click drag
    
    setPan(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const handleAspectRatioChange = (ratio: string) => {
    setSelectedAspectRatio(ratio);
    onSettingsChange({ aspectRatio: ratio });
  };

  const handleEnhancementChange = (level: number) => {
    setEnhancementLevel(level);
    onSettingsChange({ enhancement: level });
  };

  const handleLightingChange = (key: keyof typeof lightingSettings, value: number) => {
    setLightingSettings(prev => ({ ...prev, [key]: value }));
    onSettingsChange({ lighting: { ...lightingSettings, [key]: value } });
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="adjust">Adjust</TabsTrigger>
          <TabsTrigger value="enhance">Enhance</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <div 
            ref={containerRef}
            className="relative aspect-video bg-black rounded-lg overflow-hidden"
            onMouseMove={handlePan}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-contain transition-transform"
              style={{
                transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
                filter: `
                  brightness(${lightingSettings.brightness}%)
                  contrast(${lightingSettings.contrast}%)
                `
              }}
            />
            {showSplitView && (
              <div className="absolute inset-0 w-1/2 overflow-hidden border-r border-white">
                <img
                  src={imageUrl}
                  alt="Original"
                  className="w-[200%] h-full object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom(Math.max(50, zoom - 10))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Slider
              value={[zoom]}
              min={50}
              max={200}
              step={1}
              onValueChange={([value]) => handleZoom(value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom(Math.min(200, zoom + 10))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSplitView(!showSplitView)}
            >
              <SplitSquareVertical className="h-4 w-4 mr-2" />
              Split View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setZoom(100);
                setPan({ x: 0, y: 0 });
              }}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Reset View
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="adjust" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Aspect Ratio</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {aspectRatios.map(ratio => (
                  <Button
                    key={ratio.id}
                    variant={selectedAspectRatio === ratio.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAspectRatioChange(ratio.id)}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    {ratio.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Brightness</Label>
              <Slider
                value={[lightingSettings.brightness]}
                min={0}
                max={200}
                step={1}
                onValueChange={([value]) => handleLightingChange('brightness', value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Contrast</Label>
              <Slider
                value={[lightingSettings.contrast]}
                min={0}
                max={200}
                step={1}
                onValueChange={([value]) => handleLightingChange('contrast', value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Highlights</Label>
              <Slider
                value={[lightingSettings.highlights]}
                min={-100}
                max={100}
                step={1}
                onValueChange={([value]) => handleLightingChange('highlights', value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Shadows</Label>
              <Slider
                value={[lightingSettings.shadows]}
                min={-100}
                max={100}
                step={1}
                onValueChange={([value]) => handleLightingChange('shadows', value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="enhance" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Color Grade</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {colorGrades.map(grade => (
                  <Button
                    key={grade.id}
                    variant={colorGrade === grade.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setColorGrade(grade.id);
                      onSettingsChange({ colorGrade: grade.id });
                    }}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    {grade.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Enhancement Level</Label>
              <Slider
                value={[enhancementLevel]}
                min={0}
                max={100}
                step={1}
                onValueChange={([value]) => handleEnhancementChange(value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Remove Background</Label>
                  <p className="text-sm text-muted-foreground">
                    Isolate the subject
                  </p>
                </div>
                <Switch
                  checked={backgroundSettings.remove}
                  onCheckedChange={(checked) => {
                    setBackgroundSettings(prev => ({ ...prev, remove: checked }));
                    onSettingsChange({ background: { ...backgroundSettings, remove: checked } });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Background Blur</Label>
                <Slider
                  value={[backgroundSettings.blur]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={([value]) => {
                    setBackgroundSettings(prev => ({ ...prev, blur: value }));
                    onSettingsChange({ background: { ...backgroundSettings, blur: value } });
                  }}
                  disabled={backgroundSettings.remove}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}