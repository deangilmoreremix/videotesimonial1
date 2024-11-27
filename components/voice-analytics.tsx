"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Volume2, BarChart } from "lucide-react";

interface Analytics {
  characterCount: number;
  characterLimit: number;
  voiceCount: number;
  voiceLimit: number;
  resetDate: string;
}

export function VoiceAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/voice-analytics");
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setAnalytics({
          characterCount: data.character_count,
          characterLimit: data.character_limit,
          voiceCount: data.voice_count,
          voiceLimit: data.voice_limit,
          resetDate: new Date(data.next_reset).toLocaleDateString(),
        });
      } catch (error) {
        toast({
          title: "Error fetching analytics",
          description: "Failed to load voice usage data.",
          variant: "destructive",
        });
      }
    };

    fetchAnalytics();
  }, [toast]);

  if (!analytics) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Character Usage</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round((analytics.characterCount / analytics.characterLimit) * 100)}%
          </span>
        </div>
        <Progress
          value={(analytics.characterCount / analytics.characterLimit) * 100}
        />
        <p className="text-xs text-muted-foreground">
          {analytics.characterCount.toLocaleString()} / {analytics.characterLimit.toLocaleString()} characters
        </p>
      </Card>

      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Custom Voices</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round((analytics.voiceCount / analytics.voiceLimit) * 100)}%
          </span>
        </div>
        <Progress
          value={(analytics.voiceCount / analytics.voiceLimit) * 100}
        />
        <p className="text-xs text-muted-foreground">
          {analytics.voiceCount} / {analytics.voiceLimit} voices
        </p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-medium">Next Reset</h3>
            <p className="text-xs text-muted-foreground">
              {analytics.resetDate}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}