export interface TestimonialUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    imageUrl: string;
    text: string;
    voiceId?: string;
    voiceSettings?: any;
  }) => void;
}

export interface ImagePreviewProps {
  imageUrl: string;
  settings: ImageSettings;
  onSettingsChange: (settings: ImageSettings) => void;
}

export interface VideoPreviewProps {
  videoUrl?: string;
  isGenerating?: boolean;
  progress?: number;
  settings?: VideoSettings;
  onRegenerate?: () => void;
  onSettingsChange?: (settings: VideoSettings) => void;
}

export interface VoicePreviewProps {
  voiceId: string;
  sampleText?: string;
  settings?: VoiceSettings;
  onSettingsChange?: (settings: VoiceSettings) => void;
}

export interface VoiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export interface VoiceSettingsProps {
  onChange: (settings: VoiceSettings) => void;
  defaultSettings?: Partial<VoiceSettings>;
}

export interface VoiceCloneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceCreated: (voiceId: string) => void;
}

export interface VoiceLibraryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LanguageSelectorProps {
  value?: string;
  onChange: (languageId: string) => void;
  disabled?: boolean;
}