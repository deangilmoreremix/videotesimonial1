import { NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(req: Request) {
  if (!ELEVENLABS_API_KEY) {
    return new NextResponse("ElevenLabs API key not configured", { status: 500 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("files") as File[];

    if (!name || files.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create a new FormData instance for the ElevenLabs API
    const apiFormData = new FormData();
    apiFormData.append("name", name);
    if (description) {
      apiFormData.append("description", description);
    }
    files.forEach((file, index) => {
      apiFormData.append(`files`, file);
    });

    const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.message || "Failed to clone voice");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[VOICE_CLONE_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Voice cloning failed",
      { status: 500 }
    );
  }
}