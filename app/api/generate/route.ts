import { NextResponse } from "next/server";
import { generateTalkingHeadVideo } from "@/lib/replicate";

export async function POST(req: Request) {
  try {
    const { imageUrl, audioUrl, settings } = await req.json();

    if (!imageUrl || !audioUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const output = await generateTalkingHeadVideo(imageUrl, audioUrl, settings);

    return NextResponse.json({ output });
  } catch (error) {
    console.error("[GENERATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}