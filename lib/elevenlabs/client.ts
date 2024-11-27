"use client";

import { PROFESSIONAL_VOICES } from './constants';
import type { VoiceSettings } from './types';

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
const API_BASE_URL = 'https://api.elevenlabs.io/v1';

export async function generateSpeech(text: string, voiceId: string, settings?: Partial<VoiceSettings>) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: settings?.stability ?? 0.5,
            similarityBoost: settings?.similarityBoost ?? 0.75,
            style: settings?.style ?? 0.5,
            speakingRate: settings?.speakingRate ?? 1,
            useHighestQuality: settings?.useHighestQuality ?? true,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

export async function getVoices() {
  try {
    const response = await fetch(`${API_BASE_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY || '',
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch voices from API, using default voices');
      return PROFESSIONAL_VOICES;
    }

    const data = await response.json();
    return data.voices;
  } catch (error) {
    console.warn('Error fetching voices:', error);
    return PROFESSIONAL_VOICES;
  }
}

export async function getVoiceSettings(voiceId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/voices/${voiceId}/settings`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voice settings');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching voice settings:', error);
    throw error;
  }
}

export async function getVoiceAnalytics() {
  try {
    const response = await fetch(`${API_BASE_URL}/user/subscription`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}