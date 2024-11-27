"use client";

import { useState, useEffect } from 'react';
import { getVoices, generateSpeech } from './client';
import { PROFESSIONAL_VOICES } from './constants';
import type { VoiceOption } from './types';

export function useVoices() {
  const [voices, setVoices] = useState<VoiceOption[]>(PROFESSIONAL_VOICES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadVoices() {
      try {
        const voiceList = await getVoices();
        setVoices(voiceList.length > 0 ? voiceList : PROFESSIONAL_VOICES);
      } catch (err) {
        console.error("Error fetching voices:", err);
        setVoices(PROFESSIONAL_VOICES); // Fallback to predefined voices
      } finally {
        setIsLoading(false);
      }
    }

    loadVoices();
  }, []);

  return { voices, isLoading, error };
}

export function useStreamedSpeech() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const generate = async (text: string, voiceId: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const url = await generateSpeech(text, voiceId);
      setAudioUrl(url);
      return url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate speech');
      setError(error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateSpeech: generate,
    isGenerating,
    audioUrl,
    error,
  };
}