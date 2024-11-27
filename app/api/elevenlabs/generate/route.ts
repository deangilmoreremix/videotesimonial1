import { NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(req: Request) {
  if (!ELEVENLABS_API_KEY) {
    return new NextResponse("ElevenLabs API key not configured", { status: 500 });
  }

  try {
    const { text, voiceId, settings } = await req.json();

    if (!text || !voiceId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: settings?.stability ?? 0.5,
            similarity_boost: settings?.similarityBoost ?? 0.75,
            style: settings?.style ?? 0.5,
            use_speaker_boost: settings?.useSpeakerBoost ?? true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate audio");
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("[ELEVENLABS_ERROR]", error);
    return new NextResponse("Failed to generate audio", { status: 500 });
  }
}