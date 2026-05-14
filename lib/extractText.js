import { extractText } from "unpdf";

export async function extractTextFromPDF(fileBuffer) {
  try {
    // We convert the buffer to an ArrayBuffer/Uint8Array for unpdf
    const { text } = await extractText(new Uint8Array(fileBuffer));

    return text;
  } catch (error) {
    console.error("Vercel Extraction Error:", error);
    throw error;
  }
}
