// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { generateWebsite } from "@/inngest/functions"; // We will create this next

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateWebsite, // Register your generation function here
  ],
});