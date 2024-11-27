"use client";

import { useEffect, useRef, useState } from 'react';
import { detectFaces } from '@/lib/face-detection';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface FaceDetectionPreviewProps {
  imageUrl: string;
}

export function FaceDetectionPreview({ imageUrl }: FaceDetectionPreviewProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [hasFace, setHasFace] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";

    image.onload = async () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        try {
          const detections = await detectFaces(image);
          
          if (detections.detections.length > 0) {
            setHasFace(true);
            
            detections.detections.forEach((detection) => {
              const bbox = detection.boundingBox;
              ctx.strokeStyle = '#00ff00';
              ctx.lineWidth = 3;
              ctx.strokeRect(
                bbox.originX,
                bbox.originY,
                bbox.width,
                bbox.height
              );
            });
          }
        } catch (error) {
          console.error('Face detection failed:', error);
        }

        setIsProcessing(false);
      }
    };
  }, [imageUrl]);

  if (isProcessing) {
    return (
      <Card className="p-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Processing image...</span>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded-lg border"
      />
      {!hasFace && (
        <p className="text-red-500 text-sm">
          No faces detected. Please upload an image with a clear face.
        </p>
      )}
    </div>
  );
}