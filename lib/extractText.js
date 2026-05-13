import { PDFParse } from "pdf-parse";

globalThis.pdfjsWorker = null;

export async function extractTextFromPDF(fileBuffer) {
  try {
    const parser = new PDFParse({
      data: new Uint8Array(fileBuffer),
      disableWorker: true,
    });

    const result = await parser.getText();

    return result.text;
  } catch (error) {
    console.error(error);
  }
}
