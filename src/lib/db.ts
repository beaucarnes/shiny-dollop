// src/lib/db.ts
import { sql } from '@vercel/postgres';

// This function will save or update a website's generated JSON data
export async function saveWebsiteJson(siteId: string, userId: string, jsonData: object) {
  try {
    await sql`
      INSERT INTO websites (id, userId, jsonData)
      VALUES (${siteId}, ${userId}, ${JSON.stringify(jsonData)})
      ON CONFLICT (id) 
      DO UPDATE SET jsonData = ${JSON.stringify(jsonData)};
    `;
    console.log(`Successfully saved data for siteId: ${siteId}`);
  } catch (error) {
    console.error("Failed to save website JSON:", error);
    throw new Error("Database save operation failed.");
  }
}