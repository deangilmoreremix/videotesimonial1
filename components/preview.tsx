"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PreviewProps {
  imageUrl: string;
  audioUrl: string;
  settings?: {
    enhancer: boolean;
    expressionScale: number;
    poseStyle: number;
  };
}

export function Preview({ imageUrl, audioUrl, settings }: PreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>();
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setProgress(0);

      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 1000);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          audioUrl,
          settings: {
            enhancer: settings?.enhancer ?? true,
            expressionScale: settings?.expressionScale ?? 1,
            poseStyle: settings?.poseStyle ?? 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      clearInterval(progressInterval);
      setProgress(100);
      setVideoUrl(data.output);

      toast({
        title: 'Video generated successfully',
        description: 'Your video is ready to download.',
      });
    } catch (error) {
      toast({
        title: 'Error generating video',
        description: 'Failed to generate video. Please try again.',
        variant: 'destructive',
      });
      console.error('Error generating video:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Clean up video URL when component unmounts
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <Card className="p-6 space-y-6">
      <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
        {videoUrl ? (
          <video
            src={videoUrl}
            className="w-full h-full"
            controls
            controlsList="nodownload"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            Generating video... {progress}%
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={isGenerating || !!videoUrl}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Video
            </>
          )}
        </Button>

        {videoUrl && (
          <Button asChild>
            <a href={videoUrl} download="video-testimonial.mp4">
              <Download className="mr-2 h-4 w-4" />
              Download Video
            </a>
          </Button>
        )}
      </div>
    </Card>
  );
}