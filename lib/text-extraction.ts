export async function extractTextFromImage(imageUrl: string): Promise<{
  text: string;
  author?: string;
  title?: string;
}> {
  // For now, return placeholder data since we removed Tesseract
  // In a production environment, you would use a server-side OCR service
  return {
    text: "Sample testimonial text",
    author: "John Doe",
    title: "CEO"
  };
}