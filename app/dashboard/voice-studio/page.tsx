"use client";

import { VoiceStudioLayout } from '@/components/voice-studio/layout';
import { VoiceLibrary } from '@/components/voice-studio/voice-library';
import { VoiceCloning } from '@/components/voice-studio/voice-cloning';
import { VoiceDesign } from '@/components/voice-studio/voice-design';
import { VoiceAnalytics } from '@/components/voice-studio/voice-analytics';
import { MultilingualStudio } from '@/components/voice-studio/multilingual-studio';
import { AdvancedSettings } from '@/components/voice-studio/advanced-settings';

export default function VoiceStudioPage() {
  return (
    <VoiceStudioLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Voice Studio</h2>
          <p className="text-muted-foreground">
            Create, customize, and manage your AI voices
          </p>
        </div>

        <div className="grid gap-6">
          <VoiceLibrary />
          <VoiceCloning />
          <VoiceDesign />
          <MultilingualStudio />
          <VoiceAnalytics />
          <AdvancedSettings />
        </div>
      </div>
    </VoiceStudioLayout>
  );
}