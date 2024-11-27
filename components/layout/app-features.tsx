"use client";

import { Card } from '@/components/ui/card';
import { 
  Video,
  Mic,
  Languages,
  Sparkles,
  Wand2,
  BarChart
} from 'lucide-react';

export function AppFeatures() {
  const features = [
    {
      icon: Video,
      title: "AI Video Generation",
      description: "Transform static images into dynamic talking head videos"
    },
    {
      icon: Mic,
      title: "Voice Cloning",
      description: "Create custom voices from audio samples"
    },
    {
      icon: Languages,
      title: "Multilingual Support",
      description: "Generate videos in multiple languages"
    },
    {
      icon: Sparkles,
      title: "Enhanced Quality",
      description: "Professional-grade video and audio output"
    },
    {
      icon: Wand2,
      title: "Easy Customization",
      description: "Fine-tune voice and video parameters"
    },
    {
      icon: BarChart,
      title: "Analytics",
      description: "Track and analyze your video performance"
    }
  ];

  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Powerful Features
        </h2>
        <p className="text-muted-foreground">
          Everything you need to create engaging video testimonials
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="p-6">
            <feature.icon className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}