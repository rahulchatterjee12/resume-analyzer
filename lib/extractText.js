import { PDFExtract } from "pdf.js-extract";

export async function extractTextFromPDF(fileBuffer) {
  const pdfExtract = new PDFExtract();
  const options = {}; // You can specify firstPage, lastPage, etc.

  try {
    // pdf-js-extract works with buffers directly
    const data = await pdfExtract.extractBuffer(fileBuffer, options);

    // The data object contains 'pages', which contain 'content' (lines of text)
    const text = data.pages
      .map((page) => page.content.map((item) => item.str).join(" "))
      .join("\n");

    return text;
  } catch (error) {
    console.error("Extraction Error:", error);
    throw error;
  }
}
