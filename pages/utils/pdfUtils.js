// // utils/pdfUtils.js
// import { v4 as uuidv4 } from "uuid";

// /**
//  * Generate a unique filename for a candidate summary PDF
//  * @param {string} candidateName - The name of the candidate (if available)
//  * @returns {string} - A unique filename
//  */
// export function generateUniquePdfFilename(candidateName = "") {
//   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//   const uuid = uuidv4().substring(0, 8);
//   const sanitizedName = candidateName
//     ? candidateName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)
//     : "candidate";

//   return `${sanitizedName}_summary_${timestamp}_${uuid}.pdf`;
// }

// /**
//  * Extract candidate name from summary text if possible
//  * @param {string} summaryText - The summary text
//  * @returns {string} - Extracted candidate name or empty string
//  */
// export function extractCandidateNameFromSummary(summaryText) {
//   // Try to find a name pattern at the beginning of the summary
//   const nameMatch = summaryText.match(
//     /^(?:\*\*)?([A-Z][a-z]+(?: [A-Z][a-z]+)+)(?:\*\*)?:/
//   );
//   if (nameMatch && nameMatch[1]) {
//     return nameMatch[1];
//   }

//   // Alternative pattern matching
//   const titleMatch = summaryText.match(
//     /^(?:\*\*)?([A-Z][a-z]+(?: [A-Z][a-z]+)+)(?:\*\*)?(?:: | - )/
//   );
//   if (titleMatch && titleMatch[1]) {
//     return titleMatch[1];
//   }

//   return "";
// }

// /**
//  * Create a PDF from summary text in the browser
//  * @param {string} summaryText - The text content for the PDF
//  * @param {string} originalFileName - The name of the original PDF file
//  * @returns {Blob} - PDF file as a Blob
//  */
// export function createSummaryPdf(summaryText, originalFileName = "") {
//   // This function would use jsPDF in the browser
//   // For server-side we use pdf-lib instead
//   const pdfDoc = new window.jspdf.jsPDF();

//   // Extract file name without extension
//   const fileBaseName = originalFileName
//     ? originalFileName.replace(/\.[^/.]+$/, "")
//     : "Resume";

//   // Extract candidate name if possible
//   const candidateName = extractCandidateNameFromSummary(summaryText);

//   // Set document title and metadata
//   pdfDoc.setProperties({
//     title: `${candidateName || fileBaseName} Resume Summary`,
//     subject: "AI-Generated Resume Summary",
//     creator: "CandidateFinder App",
//     keywords: "resume, summary, candidate",
//   });

//   // Add title
//   pdfDoc.setFontSize(18);
//   pdfDoc.setFont("helvetica", "bold");
//   pdfDoc.text("Resume Summary", 105, 20, { align: "center" });

//   if (candidateName) {
//     pdfDoc.setFontSize(16);
//     pdfDoc.text(`Candidate: ${candidateName}`, 105, 30, { align: "center" });
//   }

//   if (originalFileName) {
//     pdfDoc.setFontSize(10);
//     pdfDoc.setFont("helvetica", "italic");
//     pdfDoc.text(`Source: ${originalFileName}`, 105, 38, { align: "center" });
//   }

//   pdfDoc.setFont("helvetica", "normal");
//   pdfDoc.setFontSize(12);

//   // Process summary text for markdown-like formatting
//   const lines = summaryText.split("\n");
//   let yPosition = 50;
//   const margin = 20;
//   const pageWidth = pdfDoc.internal.pageSize.width - margin * 2;

//   lines.forEach((line) => {
//     if (line.startsWith("**") && line.includes(":**")) {
//       // Handle section headers
//       yPosition += 5;
//       pdfDoc.setFont("helvetica", "bold");
//       const cleanHeader = line.replace(/\*\*/g, "");
//       pdfDoc.text(cleanHeader, margin, yPosition);
//       pdfDoc.setFont("helvetica", "normal");
//       yPosition += 7;
//     } else if (line.startsWith("* ")) {
//       // Handle bullet points
//       const bulletText = line.substring(2);
//       const bulletIndent = 5;

//       // Add bullet point
//       pdfDoc.text("•", margin, yPosition);

//       // Split text to fit within page width with proper indentation
//       const textLines = pdfDoc.splitTextToSize(
//         bulletText,
//         pageWidth - bulletIndent
//       );
//       pdfDoc.text(textLines, margin + bulletIndent, yPosition);

//       // Move position based on number of wrapped lines
//       yPosition += 7 * textLines.length;
//     } else if (line.trim() === "") {
//       // Handle empty lines
//       yPosition += 5;
//     } else {
//       // Handle regular text
//       // Split text to fit within page width
//       const textLines = pdfDoc.splitTextToSize(line, pageWidth);

//       // Check if we need a new page
//       if (
//         yPosition + textLines.length * 7 >
//         pdfDoc.internal.pageSize.height - margin
//       ) {
//         pdfDoc.addPage();
//         yPosition = 20;
//       }

//       pdfDoc.text(textLines, margin, yPosition);
//       yPosition += 7 * textLines.length;
//     }

//     // Add a new page if needed
//     if (yPosition > pdfDoc.internal.pageSize.height - margin) {
//       pdfDoc.addPage();
//       yPosition = 20;
//     }
//   });

//   return pdfDoc.output("blob");
// }

// /**
//  * Client-side function to download a PDF
//  * @param {Blob} pdfBlob - The PDF blob to download
//  * @param {string} fileName - The file name to use
//  */
// export function downloadPdf(pdfBlob, fileName) {
//   const downloadLink = document.createElement("a");
//   downloadLink.href = URL.createObjectURL(pdfBlob);
//   downloadLink.download = fileName;
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);
//   URL.revokeObjectURL(downloadLink.href);
// }

// utils/pdfUtils.js

/**
 * Extract text from PDF file using PDF.js
 * @param {File} file - The PDF file to extract text from
 * @returns {Promise<string>} - The extracted text content
 */
export async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);

        // Use PDF.js to extract text
        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) {
          throw new Error("PDF.js library not loaded");
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          fullText += pageText + "\n";
        }

        resolve(fullText);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read PDF file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convert HTML element to PDF and download
 * @param {string} elementId - The ID of the HTML element to convert
 * @param {string} filename - The name of the PDF file
 */ export function downloadAsPDF(elementId, filename = "resume-summary.pdf") {
  // Add a check to make sure the element exists before proceeding
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found`);
    alert("Could not find the resume content for download. Please try again.");
    return;
  }

  // Use a CDN version if the dynamic import fails
  import("html2pdf.js")
    .then((html2pdf) => {
      const opt = {
        margin: 0.5,
        filename: filename,
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      };

      html2pdf.default().from(element).set(opt).save();
    })
    .catch((error) => {
      console.error("Error loading html2pdf:", error);

      // As a fallback, try using a CDN version
      if (window.html2pdf) {
        const opt = {
          margin: 0.5,
          filename: filename,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        window.html2pdf().from(element).set(opt).save();
      } else {
        // Last resort fallback to browser print
        window.print();
      }
    });
}

/**
 * Validate if uploaded file is a PDF
 * @param {File} file - File to validate
 * @returns {boolean} - True if file is PDF
 */
export function validatePDFFile(file) {
  return file && file.type === "application/pdf";
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
