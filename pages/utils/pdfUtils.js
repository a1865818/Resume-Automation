// utils/pdfUtils.js
import { v4 as uuidv4 } from "uuid";

/**
 * Generate a unique filename for a candidate summary PDF
 * @param {string} candidateName - The name of the candidate (if available)
 * @returns {string} - A unique filename
 */
export function generateUniquePdfFilename(candidateName = "") {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const uuid = uuidv4().substring(0, 8);
  const sanitizedName = candidateName
    ? candidateName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)
    : "candidate";

  return `${sanitizedName}_summary_${timestamp}_${uuid}.pdf`;
}

/**
 * Extract candidate name from summary text if possible
 * @param {string} summaryText - The summary text
 * @returns {string} - Extracted candidate name or empty string
 */
export function extractCandidateNameFromSummary(summaryText) {
  // Try to find a name pattern at the beginning of the summary
  const nameMatch = summaryText.match(
    /^(?:\*\*)?([A-Z][a-z]+(?: [A-Z][a-z]+)+)(?:\*\*)?:/
  );
  if (nameMatch && nameMatch[1]) {
    return nameMatch[1];
  }

  // Alternative pattern matching
  const titleMatch = summaryText.match(
    /^(?:\*\*)?([A-Z][a-z]+(?: [A-Z][a-z]+)+)(?:\*\*)?(?:: | - )/
  );
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1];
  }

  return "";
}

/**
 * Create a PDF from summary text in the browser
 * @param {string} summaryText - The text content for the PDF
 * @param {string} originalFileName - The name of the original PDF file
 * @returns {Blob} - PDF file as a Blob
 */
export function createSummaryPdf(summaryText, originalFileName = "") {
  // This function would use jsPDF in the browser
  // For server-side we use pdf-lib instead
  const pdfDoc = new window.jspdf.jsPDF();

  // Extract file name without extension
  const fileBaseName = originalFileName
    ? originalFileName.replace(/\.[^/.]+$/, "")
    : "Resume";

  // Extract candidate name if possible
  const candidateName = extractCandidateNameFromSummary(summaryText);

  // Set document title and metadata
  pdfDoc.setProperties({
    title: `${candidateName || fileBaseName} Resume Summary`,
    subject: "AI-Generated Resume Summary",
    creator: "CandidateFinder App",
    keywords: "resume, summary, candidate",
  });

  // Add title
  pdfDoc.setFontSize(18);
  pdfDoc.setFont("helvetica", "bold");
  pdfDoc.text("Resume Summary", 105, 20, { align: "center" });

  if (candidateName) {
    pdfDoc.setFontSize(16);
    pdfDoc.text(`Candidate: ${candidateName}`, 105, 30, { align: "center" });
  }

  if (originalFileName) {
    pdfDoc.setFontSize(10);
    pdfDoc.setFont("helvetica", "italic");
    pdfDoc.text(`Source: ${originalFileName}`, 105, 38, { align: "center" });
  }

  pdfDoc.setFont("helvetica", "normal");
  pdfDoc.setFontSize(12);

  // Process summary text for markdown-like formatting
  const lines = summaryText.split("\n");
  let yPosition = 50;
  const margin = 20;
  const pageWidth = pdfDoc.internal.pageSize.width - margin * 2;

  lines.forEach((line) => {
    if (line.startsWith("**") && line.includes(":**")) {
      // Handle section headers
      yPosition += 5;
      pdfDoc.setFont("helvetica", "bold");
      const cleanHeader = line.replace(/\*\*/g, "");
      pdfDoc.text(cleanHeader, margin, yPosition);
      pdfDoc.setFont("helvetica", "normal");
      yPosition += 7;
    } else if (line.startsWith("* ")) {
      // Handle bullet points
      const bulletText = line.substring(2);
      const bulletIndent = 5;

      // Add bullet point
      pdfDoc.text("•", margin, yPosition);

      // Split text to fit within page width with proper indentation
      const textLines = pdfDoc.splitTextToSize(
        bulletText,
        pageWidth - bulletIndent
      );
      pdfDoc.text(textLines, margin + bulletIndent, yPosition);

      // Move position based on number of wrapped lines
      yPosition += 7 * textLines.length;
    } else if (line.trim() === "") {
      // Handle empty lines
      yPosition += 5;
    } else {
      // Handle regular text
      // Split text to fit within page width
      const textLines = pdfDoc.splitTextToSize(line, pageWidth);

      // Check if we need a new page
      if (
        yPosition + textLines.length * 7 >
        pdfDoc.internal.pageSize.height - margin
      ) {
        pdfDoc.addPage();
        yPosition = 20;
      }

      pdfDoc.text(textLines, margin, yPosition);
      yPosition += 7 * textLines.length;
    }

    // Add a new page if needed
    if (yPosition > pdfDoc.internal.pageSize.height - margin) {
      pdfDoc.addPage();
      yPosition = 20;
    }
  });

  return pdfDoc.output("blob");
}

/**
 * Client-side function to download a PDF
 * @param {Blob} pdfBlob - The PDF blob to download
 * @param {string} fileName - The file name to use
 */
export function downloadPdf(pdfBlob, fileName) {
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(pdfBlob);
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadLink.href);
}
