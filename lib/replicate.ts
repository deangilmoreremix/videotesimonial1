import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "",
});

export async function generateTalkingHeadVideo(
  imageUrl: string,
  audioUrl: string,
  settings: any
) {
  try {
    const output = await replicate.run(
      "vinthony/sadtalker:63c3948abd0a53a4e15f9da8e5b8615a14426ad1e692a5fee66282ee6e4518b7",
      {
        input: {
          source_image: imageUrl,
          driven_audio: audioUrl,
          preprocess_type: "crop",
          still_mode: false,
          use_enhancer: settings?.enhancer ?? true,
          batch_size: 1,
          size: 256,
          expression_scale: settings?.expressionScale ?? 1,
          pose_style: settings?.poseStyle ?? 0,
          crop_ratio: "2.5",
        }
      }
    );

    return output;
  } catch (error) {
    console.error("Error generating video:", error);
    throw error;
  }
}