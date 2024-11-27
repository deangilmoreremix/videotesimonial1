export interface VoiceOption {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_url: string;
  gender: string;
  age: string;
  accent?: string;
}

export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  speakingRate: number;
  useHighestQuality: boolean;
}

export const voiceCategories = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual', name: 'Casual' },
  { id: 'news', name: 'News' },
  { id: 'storytelling', name: 'Storytelling' }
];

const defaultVoices: VoiceOption[] = [
  {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    category: 'professional',
    description: 'A professional female voice with a warm and engaging tone',
    preview_url: 'https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/preview',
    gender: 'Female',
    age: 'Adult',
    accent: 'American'
  },
  {
    id: 'AZnzlk1XvdvUeBnXmlld',
    name: 'Michael',
    category: 'professional',
    description: 'A confident and authoritative male voice',
    preview_url: 'https://api.elevenlabs.io/v1/voices/AZnzlk1XvdvUeBnXmlld/preview',
    gender: 'Male',
    age: 'Adult',
    accent: 'American'
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    category: 'casual',
    description: 'A friendly and conversational female voice',
    preview_url: 'https://api.elevenlabs.io/v1/voices/EXAVITQu4vr4xnSDxMaL/preview',
    gender: 'Female',
    age: 'Young Adult',
    accent: 'British'
  }
];

export async function fetchAvailableVoices(): Promise<VoiceOption[]> {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY || ''
      }
    });

    if (!response.ok) {
      console.warn('Failed to fetch voices from ElevenLabs API, using default voices');
      return defaultVoices;
    }

    const data = await response.json();
    return data.voices.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
      category: voice.category || 'professional',
      description: voice.description || '',
      preview_url: voice.preview_url,
      gender: voice.labels?.gender || 'Unknown',
      age: voice.labels?.age || 'Adult',
      accent: voice.labels?.accent
    }));
  } catch (error) {
    console.warn('Error fetching voices:', error);
    return defaultVoices;
  }
}