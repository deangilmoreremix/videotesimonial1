"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart as BarChartIcon,
  Clock,
  Volume2,
  Download,
  Users,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Analytics {
  characterCount: number;
  characterLimit: number;
  voiceCount: number;
  voiceLimit: number;
  resetDate: string;
  usageHistory: {
    date: string;
    characters: number;
    generations: number;
  }[];
}

export function AnalyticsInterface() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/voice-analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Voice Analytics</h2>
        <p className="text-muted-foreground">
          Monitor your voice generation usage and performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            {analytics.characterCount.toLocaleString()} / {analytics.characterLimit.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
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
            {analytics.voiceCount} / {analytics.voiceLimit}
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

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium">Generation Rate</h3>
              <p className="text-xs text-muted-foreground">
                {(analytics.characterCount / 1000).toFixed(1)}k chars/day
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Usage History</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.usageHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="characters" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}