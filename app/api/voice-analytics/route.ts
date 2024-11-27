import { NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function GET(req: Request) {
  if (!ELEVENLABS_API_KEY) {
    return new NextResponse("ElevenLabs API key not configured", { status: 500 });
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch analytics");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[VOICE_ANALYTICS_ERROR]", error);
    return new NextResponse("Failed to fetch analytics", { status: 500 });
  }
}