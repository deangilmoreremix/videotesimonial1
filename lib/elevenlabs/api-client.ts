import { withRetry } from '../retry';
import type { VoiceSettings, VoiceCloneRequest, VoiceCloneResponse } from './types';
import { AppError, ErrorCodes } from '../error-handling';

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
const API_BASE_URL = 'https://api.elevenlabs.io/v1';

class ElevenLabsClient {
  private apiKey: string;

  constructor(apiKey: string = ELEVENLABS_API_KEY) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return withRetry(async () => {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new AppError(
          error.detail?.message || `ElevenLabs API error: ${response.statusText}`,
          ErrorCodes.API_ERROR
        );
      }

      return response.json();
    }, {
      maxAttempts: 3,
      retryableErrors: [ErrorCodes.NETWORK_ERROR, ErrorCodes.API_ERROR],
    });
  }

  async generateSpeech(text: string, voiceId: string, settings?: Partial<VoiceSettings>): Promise<string> {
    const response = await this.request<Blob>(`/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: settings?.stability ?? 0.5,
          similarity_boost: settings?.similarityBoost ?? 0.75,
          style: settings?.style ?? 0.5,
          use_speaker_boost: settings?.useSpeakerBoost ?? true,
        },
      }),
    });

    return URL.createObjectURL(response);
  }

  async cloneVoice(name: string, files: File[], description?: string): Promise<VoiceCloneResponse> {
    const formData = new FormData();
    formData.append('name', name);
    if (description) {
      formData.append('description', description);
    }
    files.forEach(file => formData.append('files', file));

    return this.request<VoiceCloneResponse>('/voices/add', {
      method: 'POST',
      body: formData,
      headers: {
        'xi-api-key': this.apiKey,
      },
    });
  }

  async getVoiceSettings(voiceId: string): Promise<VoiceSettings> {
    return this.request<VoiceSettings>(`/voices/${voiceId}/settings`);
  }

  async getVoiceAnalytics(): Promise<any> {
    return this.request('/user/subscription');
  }
}

// Export singleton instance
export const elevenLabsClient = new ElevenLabsClient();