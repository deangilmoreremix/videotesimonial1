import { NextResponse } from "next/server";
import { Voice, VoiceSettings, generateStream } from "elevenlabs-node";

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

    const voiceSettings: VoiceSettings = {
      stability: settings?.stability ?? 0.5,
      similarity_boost: settings?.similarityBoost ?? 0.75,
      style: settings?.style ?? 0.5,
      use_speaker_boost: settings?.useSpeakerBoost ?? true,
    };

    const audioStream = await generateStream(
      text,
      voiceId,
      ELEVENLABS_API_KEY,
      voiceSettings
    );

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Create response with audio content
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("[TTS_ERROR]", error);
    return new NextResponse("Text-to-speech generation failed", { status: 500 });
  }
}