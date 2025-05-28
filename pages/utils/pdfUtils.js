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
