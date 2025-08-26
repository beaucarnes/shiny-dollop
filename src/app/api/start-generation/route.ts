// src/app/api/start-generation/route.ts
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, userId, siteId } = await req.json(); // In a real app, you'd get userId from auth

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  // Send an event to Inngest. This is fast and doesn't block.
  await inngest.send({
    name: "website.generate.requested",
    data: {
      prompt,
      userId: userId || "user_123", // Placeholder
      siteId: siteId || `site_${Date.now()}`, // Placeholder
    },
  });

  return NextResponse.json({ message: "Website generation process started!" });
}