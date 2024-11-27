"use client";

import { AppLayout } from '@/components/layout/app-layout';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Video, Mic, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <AppLayout>
      <AppHeader />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Create AI Video Testimonials
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform static testimonials into engaging talking head videos powered by AI
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard/create">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">View Demo</Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="p-6 space-y-4">
            <Video className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">AI Video Generation</h3>
            <p className="text-muted-foreground">
              Create lifelike talking head videos from any portrait image and text
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <Mic className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">Voice Cloning</h3>
            <p className="text-muted-foreground">
              Clone and customize voices for authentic testimonial delivery
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <Sparkles className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">Enhanced Quality</h3>
            <p className="text-muted-foreground">
              Professional-grade video and audio output with AI enhancement
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Upload Image",
                description: "Upload a portrait photo of your testimonial subject"
              },
              {
                step: "2",
                title: "Add Voice",
                description: "Choose from our voice library or clone a custom voice"
              },
              {
                step: "3",
                title: "Enter Text",
                description: "Input your testimonial text or upload audio"
              },
              {
                step: "4",
                title: "Generate",
                description: "Create your AI-powered video testimonial"
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Video Testimonial?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using AI-powered video testimonials to boost credibility and engagement.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard/create">
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </AppLayout>
  );
}