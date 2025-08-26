// src/inngest/functions.ts
import { inngest } from "./client";
import { OpenAI } from "openai";
// You would create these DB functions to interact with Vercel Postgres
// import { saveWebsiteJson, updateJobStatus } from "@/lib/db";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The main function that builds the website
export const generateWebsite = inngest.createFunction(
  { id: "generate-website-from-prompt" },
  { event: "website.generate.requested" },
  async ({ event, step }) => {
    const { userId, prompt, siteId } = event.data;

    // STEP 1: Generate the high-level site structure (pages and sections)
    const structure = await step.run("1-generate-site-structure", async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a website architect. Based on the user's prompt, generate a JSON object representing the site structure. Include a 'pages' array, where each page has a 'name' (e.g., 'Home') and a 'sections' array. Each section should have a 'type' (e.g., 'hero', 'about', 'menu') and a 'prompt' for what content to generate for it.`,
          },
          { role: "user", content: `Prompt: ${prompt}` },
        ],
        response_format: { type: "json_object" },
      });
      return JSON.parse(response.choices[0].message.content || "{}");
    });

    // STEP 2: Generate content for each section of each page
    const finalSiteData = await step.run("2-generate-all-content", async () => {
      let siteWithContent = { ...structure };

      for (const page of siteWithContent.pages) {
        for (const section of page.sections) {
          const contentResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are a website content writer. Based on the user's main goal and the specific section prompt, generate a JSON object with 'title' and 'body' text. Main goal: ${prompt}`,
              },
              { role: "user", content: `Section prompt: ${section.prompt}` },
            ],
            response_format: { type: "json_object" },
          });
          // Attach the generated content to the section
          section.content = JSON.parse(contentResponse.choices[0].message.content || "{}");
        }
      }
      return siteWithContent;
    });

    // STEP 3: Save the final result to the database
    await step.run("3-save-to-database", async () => {
      // await saveWebsiteJson(siteId, finalSiteData);
      // await updateJobStatus(siteId, 'COMPLETED');
      console.log("Pretending to save to DB:", finalSiteData);
    });

    return { message: "Website generated successfully!", siteId };
  }
);