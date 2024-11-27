"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Waveform, Volume2, Gauge, Mic2 } from 'lucide-react';
import type { VoiceSettings as VoiceSettingsType } from '@/lib/types';

interface VoiceSettingsProps {
  onChange: (settings: VoiceSettingsType) => void;
  defaultSettings?: Partial<VoiceSettingsType>;
}

export function VoiceSettings({ onChange, defaultSettings = {} }: VoiceSettingsProps) {
  // Rest of the component remains unchanged
}