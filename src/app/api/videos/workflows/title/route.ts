import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to generate a concise, engaging title from the video transcript. Guidelines:
- Keep it under 60 characters.
- Make it catchy and relevant to the main topic.
- Avoid clickbait unless it fits the content.
- ONLY return the title, no other text.`;

export const { POST } = serve(async (context) => {
  const input = (await context.requestPayload) as InputType;
  const { videoId, userId } = input;

  console.log("Looking for video:", { videoId, userId });

  // ✅ Get video with validation
  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Video not found");
    }

    // ✅ Validate video has required fields
    if (!existingVideo.muxPlaybackId || !existingVideo.muxTrackId) {
      throw new Error(
        "Video is not ready for title generation - missing playback or track ID",
      );
    }

    // ✅ Validate track is ready
    if (existingVideo.muxTrackStatus !== "ready") {
      throw new Error(
        `Video track is not ready yet. Current status: ${existingVideo.muxTrackStatus || "unknown"}`,
      );
    }

    console.log("Video found:", {
      id: existingVideo.id,
      muxPlaybackId: existingVideo.muxPlaybackId,
      muxTrackId: existingVideo.muxTrackId,
      muxTrackStatus: existingVideo.muxTrackStatus,
    });

    return existingVideo;
  });

  // ✅ Fetch and parse transcript
  const transcript = await context.run("get-transcript", async () => {
    // ✅ Add .vtt extension - Mux subtitles are in WebVTT format
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.vtt`;

    console.log("Fetching transcript from:", trackUrl);

    const response = await fetch(trackUrl);

    // ✅ Check if fetch was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Transcript fetch failed:", {
        status: response.status,
        statusText: response.statusText,
        url: trackUrl,
        error: errorText,
      });
      throw new Error(
        `Failed to fetch transcript: ${response.status} ${response.statusText}`,
      );
    }

    // ✅ Add await here
    const text = await response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("Transcript is empty");
    }

    console.log("Raw transcript received, length:", text.length);

    // ✅ Parse VTT format - remove timestamps, headers, and metadata
    const lines = text.split("\n");
    const transcriptText = lines
      .filter((line) => {
        // Keep only actual subtitle text
        return (
          line.trim() &&
          !line.startsWith("WEBVTT") &&
          !line.includes("-->") &&
          !line.match(/^\d+$/)
        );
      })
      .join(" ")
      .trim();

    if (!transcriptText) {
      throw new Error("No transcript text found after parsing VTT");
    }

    console.log("Parsed transcript length:", transcriptText.length);
    console.log("First 200 chars:", transcriptText.substring(0, 200));

    return transcriptText;
  });

  // ✅ Generate title with OpenAI
  const { body } = await context.api.openai.call("generate-title", {
    token: process.env.OPENAI_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "gpt-4o",
      messages: [
        { role: "system", content: TITLE_SYSTEM_PROMPT },
        { role: "user", content: transcript },
      ],
    },
  });

  const title = body.choices[0]?.message.content;

  if (!title) {
    throw new Error("Failed to generate title from OpenAI");
  }

  console.log("Generated title:", title);

  // ✅ Update video in database
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ title: title || video.title })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });

  console.log("Title generation completed successfully");
});
