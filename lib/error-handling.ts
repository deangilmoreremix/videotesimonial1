import { toast } from "@/components/ui/use-toast";

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'error' | 'warning' | 'info' = 'error'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  // Voice-related errors
  VOICE_FETCH_FAILED: 'VOICE_FETCH_FAILED',
  VOICE_GENERATION_FAILED: 'VOICE_GENERATION_FAILED',
  VOICE_CLONE_FAILED: 'VOICE_CLONE_FAILED',
  INVALID_VOICE_SETTINGS: 'INVALID_VOICE_SETTINGS',
  
  // Image-related errors
  IMAGE_PROCESSING_FAILED: 'IMAGE_PROCESSING_FAILED',
  INVALID_IMAGE_FORMAT: 'INVALID_IMAGE_FORMAT',
  IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
  FACE_DETECTION_FAILED: 'FACE_DETECTION_FAILED',
  
  // Video-related errors
  VIDEO_GENERATION_FAILED: 'VIDEO_GENERATION_FAILED',
  INVALID_VIDEO_SETTINGS: 'INVALID_VIDEO_SETTINGS',
  
  // API-related errors
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Authentication/Authorization errors
  AUTH_ERROR: 'AUTH_ERROR',
  INVALID_API_KEY: 'INVALID_API_KEY',
  
  // File-related errors
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE'
} as const;

export function handleError(error: unknown) {
  console.error('Error:', error);

  if (error instanceof AppError) {
    toast({
      title: getErrorTitle(error.code),
      description: error.message,
      variant: error.severity === 'error' ? 'destructive' : 'default',
    });
    return;
  }

  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    toast({
      title: 'Network Error',
      description: 'Please check your internet connection and try again.',
      variant: 'destructive',
    });
    return;
  }

  // Handle other errors
  toast({
    title: 'An error occurred',
    description: error instanceof Error ? error.message : 'Please try again later.',
    variant: 'destructive',
  });
}

function getErrorTitle(code: string): string {
  switch (code) {
    case ErrorCodes.VOICE_FETCH_FAILED:
      return 'Failed to fetch voices';
    case ErrorCodes.VOICE_GENERATION_FAILED:
      return 'Voice generation failed';
    case ErrorCodes.VOICE_CLONE_FAILED:
      return 'Voice cloning failed';
    case ErrorCodes.INVALID_VOICE_SETTINGS:
      return 'Invalid voice settings';
    case ErrorCodes.IMAGE_PROCESSING_FAILED:
      return 'Image processing failed';
    case ErrorCodes.INVALID_IMAGE_FORMAT:
      return 'Invalid image format';
    case ErrorCodes.IMAGE_TOO_LARGE:
      return 'Image too large';
    case ErrorCodes.FACE_DETECTION_FAILED:
      return 'Face detection failed';
    case ErrorCodes.VIDEO_GENERATION_FAILED:
      return 'Video generation failed';
    case ErrorCodes.INVALID_VIDEO_SETTINGS:
      return 'Invalid video settings';
    case ErrorCodes.API_ERROR:
      return 'API Error';
    case ErrorCodes.NETWORK_ERROR:
      return 'Network Error';
    case ErrorCodes.RATE_LIMIT_EXCEEDED:
      return 'Rate limit exceeded';
    case ErrorCodes.AUTH_ERROR:
      return 'Authentication Error';
    case ErrorCodes.INVALID_API_KEY:
      return 'Invalid API Key';
    case ErrorCodes.FILE_UPLOAD_FAILED:
      return 'File upload failed';
    case ErrorCodes.INVALID_FILE_TYPE:
      return 'Invalid file type';
    case ErrorCodes.FILE_TOO_LARGE:
      return 'File too large';
    default:
      return 'Error';
  }
}

export function validateApiKey(key: string | undefined, service: string): void {
  if (!key) {
    throw new AppError(
      `${service} API key is missing. Please check your environment variables.`,
      ErrorCodes.INVALID_API_KEY,
      'error'
    );
  }
}

export function validateFileSize(file: File, maxSize: number): void {
  if (file.size > maxSize) {
    throw new AppError(
      `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
      ErrorCodes.FILE_TOO_LARGE,
      'error'
    );
  }
}

export function validateFileType(file: File, allowedTypes: string[]): void {
  if (!allowedTypes.includes(file.type)) {
    throw new AppError(
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      ErrorCodes.INVALID_FILE_TYPE,
      'error'
    );
  }
}

export function validateSettings<T extends Record<string, any>>(
  settings: T,
  schema: Record<keyof T, { min?: number; max?: number; type: string }>
): void {
  for (const [key, value] of Object.entries(settings)) {
    const validation = schema[key];
    
    if (!validation) continue;

    // Type checking
    if (typeof value !== validation.type) {
      throw new AppError(
        `Invalid type for ${key}. Expected ${validation.type}, got ${typeof value}`,
        ErrorCodes.INVALID_VIDEO_SETTINGS,
        'error'
      );
    }

    // Range checking for numbers
    if (validation.type === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        throw new AppError(
          `${key} must be at least ${validation.min}`,
          ErrorCodes.INVALID_VIDEO_SETTINGS,
          'error'
        );
      }
      if (validation.max !== undefined && value > validation.max) {
        throw new AppError(
          `${key} must be at most ${validation.max}`,
          ErrorCodes.INVALID_VIDEO_SETTINGS,
          'error'
        );
      }
    }
  }
}