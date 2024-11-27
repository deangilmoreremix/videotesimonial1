export interface TestimonialData {
  imageUrl: string;
  text: string;
  author?: string;
  title?: string;
}

export interface VideoSettings {
  enhancer: boolean;
  expressionScale: number;
  poseStyle: number;
  lipSyncAccuracy: number;
  backgroundStyle: string;
  motionSmoothing: number;
  quality: 'high' | 'medium' | 'low';
  fps: number;
}

export interface ImageSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotation: number;
  zoom: number;
  removeBackground: boolean;
  enhanceFace: boolean;
  smartCrop: boolean;
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

export interface LanguageModel {
  id: string;
  name: string;
  description: string;
  languages: string[];
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