/**
 * Extract text from PDF file using PDF.js
 * @param {File} file - The PDF file to extract text from
 * @returns {Promise<string>} - The extracted text content
 */
// export async function extractTextFromPDF(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       try {
//         const typedArray = new Uint8Array(e.target.result);

//         // Use PDF.js to extract text
//         const pdfjsLib = window.pdfjsLib;
//         if (!pdfjsLib) {
//           throw new Error("PDF.js library not loaded");
//         }

//         pdfjsLib.GlobalWorkerOptions.workerSrc =
//           "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

//         const pdf = await pdfjsLib.getDocument(typedArray).promise;
//         let fullText = "";

//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const textContent = await page.getTextContent();
//           const pageText = textContent.items.map((item) => item.str).join(" ");
//           fullText += pageText + "\n";
//         }

//         resolve(fullText);
//       } catch (error) {
//         reject(error);
//       }
//     };

//     reader.onerror = () => {
//       reject(new Error("Failed to read PDF file"));
//     };

//     reader.readAsArrayBuffer(file);
//   });
// }

// /**
//  * Convert HTML element to PDF and download
//  * @param {string} elementId - The ID of the HTML element to convert
//  * @param {string} filename - The name of the PDF file
//  */ export function downloadAsPDF(elementId, filename = "resume-summary.pdf") {
//   // Add a check to make sure the element exists before proceeding
//   const element = document.getElementById(elementId);
//   if (!element) {
//     console.error(`Element with ID "${elementId}" not found`);
//     alert("Could not find the resume content for download. Please try again.");
//     return;
//   }

//   // Use a CDN version if the dynamic import fails
//   import("html2pdf.js")
//     .then((html2pdf) => {
//       const opt = {
//         margin: 0.5,
//         filename: filename,
//         html2canvas: {
//           scale: 2,
//           useCORS: true,
//           letterRendering: true,
//         },
//         jsPDF: {
//           unit: "in",
//           format: "a4",
//           orientation: "portrait",
//         },
//       };

//       html2pdf.default().from(element).set(opt).save();
//     })
//     .catch((error) => {
//       console.error("Error loading html2pdf:", error);

//       // As a fallback, try using a CDN version
//       if (window.html2pdf) {
//         const opt = {
//           margin: 0.5,
//           filename: filename,
//           html2canvas: { scale: 2 },
//           jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//         };

//         window.html2pdf().from(element).set(opt).save();
//       } else {
//         // Last resort fallback to browser print
//         window.print();
//       }
//     });
// }

// /**
//  * Validate if uploaded file is a PDF
//  * @param {File} file - File to validate
//  * @returns {boolean} - True if file is PDF
//  */
// export function validatePDFFile(file) {
//   return file && file.type === "application/pdf";
// }

// /**
//  * Format file size for display
//  * @param {number} bytes - File size in bytes
//  * @returns {string} - Formatted file size
//  */
// export function formatFileSize(bytes) {
//   if (bytes === 0) return "0 Bytes";

//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));

//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
// }

/**
 * Enhanced PDF utilities with OCR support for image-based PDFs
 * Combines PDF.js for text-based PDFs and Tesseract.js for image-based PDFs
 *
 * Installation required: npm install tesseract.js
 */

/**
 * Check if a PDF page contains primarily images (needs OCR) or extractable text
 * @param {Object} page - PDF.js page object
 * @returns {Promise<boolean>} - True if page needs OCR
 */
async function pageNeedsOCR(page) {
  try {
    const textContent = await page.getTextContent();
    const textItems = textContent.items;

    // If there are very few text items or they're mostly whitespace, likely needs OCR
    const meaningfulText = textItems
      .map((item) => item.str?.trim() || "")
      .filter((text) => text.length > 0)
      .join(" ");

    // Threshold: if less than 50 characters of text, probably an image-based PDF
    const needsOCR = meaningfulText.length < 50;

    console.log(
      `Page text analysis: "${meaningfulText.substring(0, 100)}..." (${meaningfulText.length
      } chars) - Needs OCR: ${needsOCR}`
    );

    return needsOCR;
  } catch (error) {
    console.warn("Error checking if page needs OCR:", error);
    return true; // Default to OCR if we can't determine
  }
}

/**
 * Convert PDF page to image for OCR processing
 * @param {Object} page - PDF.js page object
 * @param {number} scale - Rendering scale (higher = better quality, slower processing)
 * @returns {Promise<HTMLCanvasElement>} - Canvas with page image
 */
async function renderPageToCanvas(page, scale = 2.0) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
  return canvas;
}

/**
 * Perform OCR on a canvas using Tesseract.js
 * @param {HTMLCanvasElement} canvas - Canvas containing the page image
 * @param {Object} options - OCR options
 * @returns {Promise<string>} - Extracted text
 */
async function performOCR(canvas, options = {}) {
  try {
    console.log("Starting OCR processing...");
    console.log("Canvas dimensions:", canvas.width, "x", canvas.height);

    // Dynamic import of Tesseract.js
    const { createWorker } = await import("tesseract.js");
    console.log("Tesseract.js imported successfully");

    const worker = await createWorker("eng", 1, {
      logger: (m) => {
        if (options.verbose) {
          console.log("OCR Progress:", m);
        }
      },
    });
    console.log("Tesseract worker created");

    // Configure OCR parameters for better resume text recognition
    console.log("Setting OCR parameters...");
    try {
      await worker.setParameters({
        tessedit_pageseg_mode: "1", // Automatic page segmentation with OSD
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%&*()_+-=[]{}|;:'\"<>?/\\ \n\r\t",
      });
      console.log("OCR parameters set");
    } catch (paramError) {
      console.warn("Failed to set OCR parameters, continuing with defaults:", paramError);
    }

    console.log("Starting text recognition...");
    const {
      data: { text },
    } = await worker.recognize(canvas);
    console.log(`OCR completed, extracted ${text.length} characters`);

    await worker.terminate();
    console.log("Worker terminated");

    return text;
  } catch (error) {
    console.error("OCR processing failed:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw new Error(`OCR failed: ${error.message}`);
  }
}

/**
 * Load PDF.js library dynamically
 * @returns {Promise<Object>} - PDF.js library object
 */
export async function loadPDFJS() {
  // Check if PDF.js is already loaded
  if (window.pdfjsLib) {
    return window.pdfjsLib;
  }

  // Load PDF.js from CDN
  return new Promise((resolve, reject) => {
    // Create script element for PDF.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.onload = () => {
      // Set worker source
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    script.onerror = () => {
      reject(new Error('Failed to load PDF.js library'));
    };
    document.head.appendChild(script);
  });
}

/**
 * Enhanced text extraction with OCR fallback for image-based PDFs
 * @param {File} file - The PDF file to extract text from
 * @param {Object} options - Extraction options
 * @returns {Promise<string>} - The extracted text content
 */
export async function extractTextFromPDF(file, options = {}) {
  const {
    useOCR = true,
    ocrScale = 2.0,
    verbose = false,
    forceOCR = false, // Force OCR even if text is extractable
    maxPages = null, // Limit number of pages to process
    progressCallback = null, // Callback for progress updates
  } = options;

  console.log(`Starting PDF extraction with options:`, { useOCR, ocrScale, verbose, forceOCR, maxPages });

  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);

        // Load PDF.js dynamically
        const pdfjsLib = await loadPDFJS();
        console.log("PDF.js loaded successfully");

        console.log("Loading PDF document...");
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const totalPages = Math.min(pdf.numPages, maxPages || pdf.numPages);

        console.log(`PDF loaded successfully: ${totalPages} pages`);

        let fullText = "";
        let ocrPagesCount = 0;
        let textPagesCount = 0;

        console.log(`Processing PDF: ${totalPages} pages`);

        for (let i = 1; i <= totalPages; i++) {
          if (progressCallback) {
            progressCallback({
              current: i,
              total: totalPages,
              stage: "analyzing",
              page: i,
            });
          }

          const page = await pdf.getPage(i);
          let pageText = "";
          let method = "text";

          try {
            // First try to extract text normally
            if (!forceOCR) {
              console.log(`Page ${i}: Attempting text extraction...`);
              const textContent = await page.getTextContent();
              const extractedText = textContent.items
                .map((item) => item.str)
                .join(" ");

              // Check if extracted text is meaningful
              const meaningfulText = extractedText.trim();

              // Lower threshold to 20 characters and also check for common resume keywords
              const hasResumeKeywords = /(experience|education|skills|work|job|resume|cv|employment|position|role)/i.test(meaningfulText);
              const hasEnoughText = meaningfulText.length > 20;

              console.log(`Page ${i}: Text extraction results - Length: ${meaningfulText.length}, Has keywords: ${hasResumeKeywords}, Has enough text: ${hasEnoughText}`);

              if (hasEnoughText || hasResumeKeywords) {
                pageText = extractedText;
                method = "text";
                textPagesCount++;
                console.log(
                  `Page ${i}: Extracted ${meaningfulText.length} characters via text extraction (has keywords: ${hasResumeKeywords})`
                );
              } else if (useOCR) {
                // Text extraction didn't yield enough content, try OCR
                console.log(`Page ${i}: Text extraction yielded only ${meaningfulText.length} characters, switching to OCR`);
                method = "ocr";
              }
            } else if (useOCR) {
              method = "ocr";
            }

            // Perform OCR if needed
            if (method === "ocr" && useOCR) {
              if (progressCallback) {
                progressCallback({
                  current: i,
                  total: totalPages,
                  stage: "ocr",
                  page: i,
                });
              }

              console.log(`Page ${i}: Performing OCR...`);
              try {
                const canvas = await renderPageToCanvas(page, ocrScale);
                console.log(`Page ${i}: Canvas rendered, starting OCR...`);
                pageText = await performOCR(canvas, { verbose });
                ocrPagesCount++;
                console.log(
                  `Page ${i}: OCR extracted ${pageText.length} characters`
                );

                // If OCR didn't extract much text, try with higher scale
                if (pageText.trim().length < 50 && ocrScale < 3.0) {
                  console.log(`Page ${i}: OCR yielded little text, trying with higher scale...`);
                  const highResCanvas = await renderPageToCanvas(page, 3.0);
                  const highResText = await performOCR(highResCanvas, { verbose });
                  if (highResText.trim().length > pageText.trim().length) {
                    pageText = highResText;
                    console.log(`Page ${i}: High-res OCR extracted ${pageText.length} characters`);
                  }
                }
              } catch (ocrError) {
                console.error(`OCR failed for page ${i}:`, ocrError);
                // Try to extract whatever text we can from the page
                try {
                  const textContent = await page.getTextContent();
                  pageText = textContent.items.map((item) => item.str).join(" ");
                  console.log(`Page ${i}: Fallback to basic text extraction after OCR failure`);
                } catch (fallbackError) {
                  console.error(`Fallback text extraction also failed for page ${i}:`, fallbackError);
                  pageText = ""; // Empty text for this page
                }
              }
            }

            fullText += pageText + "\n\n";
          } catch (pageError) {
            console.error(`Error processing page ${i}:`, pageError);
            // Continue with next page
          }
        }

        console.log(
          `PDF processing complete: ${textPagesCount} text pages, ${ocrPagesCount} OCR pages`
        );
        console.log(`Total extracted text length: ${fullText.length} characters`);
        resolve(fullText.trim());
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
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
 * Extract text from Word document (.docx) using mammoth.js
 * @param {File} file - The Word document file to extract text from
 * @returns {Promise<string>} - The extracted text content
 */
export async function extractTextFromWord(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;

        // Use mammoth.js to extract text from Word document
        const mammoth = await import("mammoth");

        const result = await mammoth.extractRawText({
          arrayBuffer: arrayBuffer,
        });

        if (result.messages && result.messages.length > 0) {
          console.log("Mammoth conversion messages:", result.messages);
        }

        resolve(result.value);
      } catch (error) {
        console.error("Error extracting text from Word document:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read Word document file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extract formatted text from Word document (.docx) with basic HTML formatting
 * @param {File} file - The Word document file to extract text from
 * @returns {Promise<{text: string, html: string}>} - The extracted text and HTML content
 */
export async function extractFormattedTextFromWord(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;

        // Use mammoth.js to extract both raw text and HTML
        const mammoth = await import("mammoth");

        // Extract raw text
        const textResult = await mammoth.extractRawText({
          arrayBuffer: arrayBuffer,
        });

        // Extract HTML with basic formatting
        const htmlResult = await mammoth.convertToHtml({
          arrayBuffer: arrayBuffer,
        });

        if (textResult.messages && textResult.messages.length > 0) {
          console.log("Mammoth text conversion messages:", textResult.messages);
        }

        if (htmlResult.messages && htmlResult.messages.length > 0) {
          console.log("Mammoth HTML conversion messages:", htmlResult.messages);
        }

        resolve({
          text: textResult.value,
          html: htmlResult.value,
        });
      } catch (error) {
        console.error(
          "Error extracting formatted text from Word document:",
          error
        );
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read Word document file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Enhanced document content extraction with OCR support for various file types
 * @param {File} file - The document file (PDF, Word, Image, etc.)
 * @param {Object} options - Processing options
 * @returns {Promise<{success: boolean, text?: string, method?: string, error?: string}>}
 */
export async function extractDocumentContent(file, options = {}) {
  try {
    // Validate file
    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      console.log("Processing PDF with OCR support...");

      const text = await extractTextFromPDF(file, {
        useOCR: true,
        verbose: options.verbose || false,
        forceOCR: options.forceOCR || false,
        maxPages: options.maxPages || null,
        progressCallback: options.progressCallback || null,
      });

      return {
        success: true,
        text: text,
        method: text.length > 1000 ? "pdf-with-ocr" : "pdf-text-extraction",
      };
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      console.log("Processing Word document...");

      const text = await extractTextFromWord(file);

      return {
        success: true,
        text: text,
        method: "word-extraction",
      };
    } else if (fileName.endsWith(".txt")) {
      console.log("Processing text file...");
      const text = await file.text();

      return {
        success: true,
        text: text,
        method: "text-file",
      };
    } else if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      // Handle image files directly with OCR
      console.log("Processing image file with OCR...");

      try {
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker("eng", 1);

        if (options.progressCallback) {
          options.progressCallback({
            stage: "ocr",
            message: "Processing image with OCR...",
          });
        }

        const {
          data: { text },
        } = await worker.recognize(file);
        await worker.terminate();

        return {
          success: true,
          text: text,
          method: "image-ocr",
        };
      } catch (ocrError) {
        return {
          success: false,
          error: `OCR processing failed: ${ocrError.message}`,
        };
      }
    } else {
      return {
        success: false,
        error:
          "Unsupported file format. Please use PDF, Word documents, text files, or images.",
      };
    }
  } catch (error) {
    console.error("Document processing error:", error);
    return {
      success: false,
      error: `Failed to process document: ${error.message}`,
      method: "error",
    };
  }
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
 * Enhanced file validation with OCR support indication
 * @param {File} file - File to validate
 * @returns {Object} - Validation result with OCR capability info
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  const fileName = file.name.toLowerCase();
  const fileSize = file.size;
  const maxSize = 50 * 1024 * 1024; // 50MB limit for OCR files

  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File size (${formatFileSize(fileSize)}) exceeds 50MB limit`,
    };
  }

  if (fileName.endsWith(".pdf")) {
    return {
      valid: true,
      type: "pdf",
      ocrCapable: true,
      message:
        "PDF file - supports both text extraction and OCR for image-based content",
    };
  } else if (fileName.match(/\.(docx|doc)$/)) {
    return {
      valid: true,
      type: "word",
      ocrCapable: false,
      message: "Word document - text extraction only",
    };
  } else if (fileName.endsWith(".txt")) {
    return {
      valid: true,
      type: "text",
      ocrCapable: false,
      message: "Text file - direct reading",
    };
  } else if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
    return {
      valid: true,
      type: "image",
      ocrCapable: true,
      message: "Image file - OCR processing required",
    };
  } else {
    return {
      valid: false,
      error:
        "Unsupported file format. Supported: PDF, Word documents, images, and text files.",
    };
  }
}

/**
 * Validate if uploaded file is a Word document
 * @param {File} file - File to validate
 * @returns {boolean} - True if file is a Word document (.docx)
 */
export function validateWordFile(file) {
  const validTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc (older format, but mammoth may have limited support)
  ];

  const validExtensions = [".docx", ".doc"];

  const hasValidType = file && validTypes.includes(file.type);
  const hasValidExtension =
    file &&
    validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

  return hasValidType || hasValidExtension;
}

/**
 * Convert HTML element to PDF and download
 * @param {string} elementId - The ID of the HTML element to convert
 * @param {string} filename - The name of the PDF file
 */
export function downloadAsPDF(elementId, filename = "resume-summary.pdf") {
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

/**
 * Test function to verify OCR functionality
 * @returns {Promise<boolean>} - True if OCR is working correctly
 */
export async function testOCRFunctionality() {
  try {
    console.log("Testing OCR functionality...");

    // Test 1: Check if Tesseract.js can be imported
    const { createWorker } = await import("tesseract.js");
    console.log("✓ Tesseract.js import successful");

    // Test 2: Create a simple test canvas with text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 100;

    // Set background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add test text
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Test OCR Text Recognition', 10, 50);
    ctx.fillText('This is a test for Tesseract.js', 10, 80);

    console.log("✓ Test canvas created");

    // Test 3: Perform OCR on the test canvas
    const worker = await createWorker("eng", 1);

    const { data: { text } } = await worker.recognize(canvas);
    await worker.terminate();

    console.log("✓ OCR test completed");
    console.log("Extracted text:", text);

    // Test 4: Verify that some text was extracted
    const hasText = text && text.trim().length > 0;
    console.log(`✓ Text extraction verification: ${hasText ? 'PASSED' : 'FAILED'}`);

    return hasText;
  } catch (error) {
    console.error("OCR test failed:", error);
    return false;
  }
}

/**
 * Utility function to check if OCR is supported in current environment
 * @returns {Promise<boolean>} - True if OCR is supported
 */
export async function checkOCRSupport() {
  try {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng", 1);
    await worker.terminate();
    return true;
  } catch (error) {
    console.warn("Tesseract.js not available:", error);
    return false;
  }
}

/**
 * Preload Tesseract.js worker for faster OCR processing
 * @returns {Promise<void>}
 */
export async function preloadOCRWorker() {
  try {
    console.log("Preloading OCR worker...");
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng", 1);
    await worker.terminate();
    console.log("OCR worker preloaded successfully");
  } catch (error) {
    console.warn("Failed to preload OCR worker:", error);
  }
}
