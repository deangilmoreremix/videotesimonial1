"use client";

import { useSearchParams } from 'next/navigation';
import { Preview } from '@/components/preview';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('image');
  const audioUrl = searchParams.get('audio');

  if (!imageUrl || !audioUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Missing required parameters</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video Preview</h1>
      <div className="max-w-4xl mx-auto">
        <Preview imageUrl={imageUrl} audioUrl={audioUrl} />
      </div>
    </div>
  );
}