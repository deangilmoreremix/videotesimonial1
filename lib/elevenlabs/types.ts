export interface VoiceOption {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_url: string;
  gender: string;
  age: string;
  accent?: string;
  useCase?: string;
  labels?: {
    accent?: string;
    age?: string;
    gender?: string;
    [key: string]: string | undefined;
  };
}

export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  speakingRate: number;
  useHighestQuality: boolean;
}

export interface VoicePreset {
  id: string;
  name: string;
  description: string;
  settings: VoiceSettings;
}

export interface VoiceAnalytics {
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

export interface VoiceCloneRequest {
  name: string;
  description?: string;
  files: File[];
}

export interface VoiceCloneResponse {
  voice_id: string;
  name: string;
  status: 'processing' | 'ready' | 'failed';
  error?: string;
}

export interface TTSRequest {
  text: string;
  voiceId: string;
  settings?: Partial<VoiceSettings>;
}

export interface TTSResponse {
  audio_url: string;
  character_count: number;
  duration: number;
}

export interface LanguageModel {
  id: string;
  name: string;
  description: string;
  languages: string[];
}