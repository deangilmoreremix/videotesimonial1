"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VideoPreviewProps {
  imageUrl: string;
  audioUrl: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function VideoPreview({
  imageUrl,
  audioUrl,
  isGenerating,
  onGenerate,
}: VideoPreviewProps) {
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>();
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      onGenerate();
      setProgress(0);
      
      // Simulate progress while waiting for the video
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 1000);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          audioUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate video");
      }

      const prediction = await response.json();
      clearInterval(progressInterval);
      setProgress(100);
      setVideoUrl(prediction.output);

      toast({
        title: "Video generated successfully!",
        description: "Your video is ready to download.",
      });
    } catch (error) {
      toast({
        title: "Error generating video",
        description: "Please try again later.",
        variant: "destructive",
      });
      console.error("Error generating video:", error);
    }
  };

  return (
    <div className="space-y-6">
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
            <Image
              src={imageUrl}
              alt="Source image"
              fill
              className="object-cover opacity-50"
            />
          </div>
        )}
      </div>

      {isGenerating && !videoUrl && (
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
            <a href={videoUrl} download="ai-talking-head.mp4">
              <Download className="mr-2 h-4 w-4" />
              Download Video
            </a>
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p className="mt-1">
          The generated video will combine your portrait image with the provided audio
          to create a realistic talking head animation.
        </p>
      </div>
    </div>
  );
}