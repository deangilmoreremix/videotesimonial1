import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, ArrowRight, Mic, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
              <Link to="/dashboard/create">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">View Demo</Link>
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
    </div>
  );
}