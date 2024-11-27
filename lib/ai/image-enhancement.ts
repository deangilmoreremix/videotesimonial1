import { withRetry } from '../retry';
import { AppError, ErrorCodes } from '../error-handling';

const STABILITY_API_KEY = process.env.STABILITY_API_KEY || '';
const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY || '';

export async function enhancePortrait(imageUrl: string): Promise<string> {
  return withRetry(async () => {
    try {
      const response = await fetch('https://api.stability.ai/v1/generation/image-to-image/upscale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          image: imageUrl,
          width: 1024,
          height: 1024,
          enhance_face: true,
        }),
      });

      if (!response.ok) {
        throw new AppError(
          'Failed to enhance portrait',
          ErrorCodes.IMAGE_PROCESSING_FAILED
        );
      }
      
      const data = await response.json();
      return data.output;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        'Failed to enhance portrait',
        ErrorCodes.IMAGE_PROCESSING_FAILED
      );
    }
  }, {
    maxAttempts: 3,
    initialDelay: 1000,
  });
}

export async function removeBackground(imageUrl: string): Promise<string> {
  return withRetry(async () => {
    try {
      const response = await fetch('https://clipdrop-api.co/remove-background/v1', {
        method: 'POST',
        headers: {
          'x-api-key': CLIPDROP_API_KEY,
        },
        body: JSON.stringify({
          image_url: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new AppError(
          'Failed to remove background',
          ErrorCodes.IMAGE_PROCESSING_FAILED
        );
      }
      
      const data = await response.json();
      return data.output_url;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        'Failed to remove background',
        ErrorCodes.IMAGE_PROCESSING_FAILED
      );
    }
  }, {
    maxAttempts: 2,
    initialDelay: 1500,
  });
}