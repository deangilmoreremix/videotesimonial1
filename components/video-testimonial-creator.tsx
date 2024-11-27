"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Video } from "lucide-react";
import Link from "next/link";

export function VideoTestimonialCreator() {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="bg-primary/10 p-4 rounded-full">
          <Video className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Create Video Testimonial</h2>
          <p className="text-muted-foreground">
            Transform your static testimonials into engaging video content with AI-powered technology
          </p>
        </div>

        <Button asChild size="lg">
          <Link href="/dashboard/create" className="flex items-center">
            Get Started
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}