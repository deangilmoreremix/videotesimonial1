"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestimonialProcessor } from '@/components/testimonial-processor';

export function AppDemo() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          See It In Action
        </h2>
        <p className="text-muted-foreground mb-8">
          Try our video testimonial generator with a sample image
        </p>
        <Button 
          size="lg" 
          onClick={() => setShowDemo(true)}
          className="mx-auto"
        >
          Try Demo
        </Button>
      </div>

      {showDemo && (
        <Card className="max-w-4xl mx-auto p-6">
          <TestimonialProcessor />
        </Card>
      )}
    </section>
  );
}