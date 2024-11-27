import type {
  VoiceOption,
  VoiceSettings,
  VoiceCloneRequest,
  VoiceCloneResponse,
  TTSRequest,
  TTSResponse,
} from './types';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const API_BASE_URL = 'https://api.elevenlabs.io/v1';

export async function fetchVoices(): Promise<VoiceOption[]> {
  const response = await fetch(`${API_BASE_URL}/voices`, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY || '',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch voices');
  }

  const data = await response.json();
  return data.voices;
}

export async function generateSpeech(request: TTSRequest): Promise<TTSResponse> {
  const response = await fetch(
    `${API_BASE_URL}/text-to-speech/${request.voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: request.text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: request.settings,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to generate speech');
  }

  const audioBlob = await response.blob();
  const audio_url = URL.createObjectURL(audioBlob);

  return {
    audio_url,
    character_count: request.text.length,
    duration: 0, // Duration will be available when audio is loaded
  };
}

export async function cloneVoice(request: VoiceCloneRequest): Promise<VoiceCloneResponse> {
  const formData = new FormData();
  formData.append('name', request.name);
  if (request.description) {
    formData.append('description', request.description);
  }
  request.files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/voices/add`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY || '',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to clone voice');
  }

  return response.json();
}

export async function getVoiceAnalytics() {
  const response = await fetch(`${API_BASE_URL}/user/subscription`, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY || '',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }

  return response.json();
}