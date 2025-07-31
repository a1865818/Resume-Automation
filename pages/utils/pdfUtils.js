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
      console.warn(
        "Failed to set OCR parameters, continuing with defaults:",
        paramError
      );
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
      stack: error.stack,
    });
    throw new Error(`OCR failed: ${error.message}`);
  }
}

/**
 * Convert canvas to base64 image data for Gemini API
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {string} - Base64 encoded image data
 */
function canvasToBase64(canvas) {
  return canvas.toDataURL("image/png").split(",")[1];
}

/**
 * Perform OCR using Gemini Vision API
 * @param {HTMLCanvasElement} canvas - Canvas containing the page image
 * @param {Object} options - OCR options
 * @returns {Promise<string>} - Extracted text
 */
async function performGeminiOCR(canvas, options = {}) {
  const {
    verbose = false,
    detectSkillsSection = true,
    apiKey = null,
  } = options;

  console.log("Starting Gemini Vision OCR processing...");
  console.log("Canvas dimensions:", canvas.width, "x", canvas.height);

  try {
    // Import config to get API key
    const config = await import("@/configs");
    const effectiveApiKey = apiKey || config.default.geminiApiKey;

    if (!effectiveApiKey) {
      throw new Error("Gemini API key is required for vision OCR");
    }

    // Convert canvas to base64
    const base64Image = canvasToBase64(canvas);

    // Create the prompt for Gemini
    const prompt = `You are an expert document text extraction specialist. Extract ALL text from this image with maximum accuracy and completeness.

CRITICAL REQUIREMENTS:
1. Extract EVERY piece of text visible in the image
2. Pay special attention to:
   - White text on colored backgrounds
   - Small or stylized text
   - Text in different colors or fonts
   - Text in headers, sections, and body content
   - Skills sections, qualifications, and experience details
   - Contact information and personal details
   - Any text that might be in tables, lists, or special formatting

3. For skills sections specifically:
   - Look for technical skills, programming languages, frameworks
   - Include certifications, tools, and technologies
   - Capture both hard and soft skills
   - Pay attention to skills listed with bullet points or special formatting
   - Look for sections titled "SKILLS"
   - Include any technology names, programming languages, frameworks, tools
   - Look for skills in columns, lists, or special layouts
   - Pay attention to skills that might be in different colors or backgrounds

4. Maintain the original structure and formatting where possible
5. Include all headers, section titles, and content
6. Do not skip any text, even if it seems like background or decorative text
7. If you see a skills section, extract it completely and clearly

TEXT EXTRACTION INSTRUCTIONS:
- Extract text exactly as it appears
- Preserve line breaks and paragraph structure
- Include all punctuation and special characters
- Do not summarize or paraphrase - extract verbatim
- If text appears in multiple colors or styles, extract all of it
- For lists or bullet points, maintain the list structure
- Include any text that might be in headers, footers, or margins
- Pay special attention to any section that looks like it contains skills or technologies

SKILLS DETECTION FOCUS:
- Look for sections with bullet points or lists of technologies
- Check for skills in different colored backgrounds or special formatting

Return ONLY the extracted text, no additional commentary or formatting.`;

    // Make request to Gemini Vision API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": effectiveApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inline_data: {
                    mime_type: "image/png",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.error?.message || `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts) {
      const extractedText = data.candidates[0].content.parts[0].text;

      console.log(
        `Gemini Vision OCR completed. Extracted ${extractedText.length} characters`
      );

      if (verbose) {
        console.log(
          "Extracted text preview:",
          extractedText.substring(0, 200) + "..."
        );
      }

      return extractedText;
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Gemini Vision OCR processing failed:", error);
    throw new Error(`Gemini Vision OCR failed: ${error.message}`);
  }
}

/**
 * Enhanced OCR function that combines Gemini OCR with focused skills extraction
 * @param {HTMLCanvasElement} canvas - Canvas containing the page image
 * @param {Object} options - OCR options
 * @returns {Promise<string>} - Extracted text with skills
 */
async function performEnhancedOCR(canvas, options = {}) {
  const {
    verbose = false,
    preferGemini = true,
    fallbackToTesseract = true,
    detectSkillsSection = true,
    apiKey = null,
  } = options;

  console.log("Starting enhanced OCR processing with skills extraction...");
  console.log("Canvas dimensions:", canvas.width, "x", canvas.height);

  try {
    // Use Tesseract for main text extraction (exact content)
    console.log("Using Tesseract for main text extraction...");
    const tesseractResult = await performOCR(canvas, { verbose });
    console.log(`Tesseract extracted ${tesseractResult.length} characters`);

    // Use Gemini only for skills detection if preferred
    if (preferGemini) {
      try {
        console.log("Attempting Gemini skills detection...");
        const skillsResult = await performFocusedSkillsOCR(canvas, {
          verbose,
          detectSkillsSection,
          apiKey,
        });

        // Combine Tesseract result with Gemini skills
        let combinedText = tesseractResult;

        // Check if skills were found and add them to the result
        if (
          skillsResult &&
          !skillsResult.includes("No skills section found") &&
          skillsResult.trim().length > 0
        ) {
          // Check if the skills section is already in the Tesseract result
          const skillsInTesseract =
            tesseractResult.toLowerCase().includes("skills") ||
            tesseractResult.toLowerCase().includes("technical skills") ||
            tesseractResult.toLowerCase().includes("competencies");

          if (!skillsInTesseract) {
            // Add skills section to the Tesseract result
            combinedText = `${tesseractResult}\n\n${skillsResult}`;
            console.log("Added Gemini skills section to Tesseract result");
          } else {
            console.log("Skills section already found in Tesseract result");
          }
        } else {
          console.log("No skills section found or skills extraction failed");
        }

        // Check if combined result has meaningful content
        if (combinedText && combinedText.trim().length > 50) {
          console.log(
            "Tesseract + Gemini skills detection successful, using result"
          );
          return combinedText;
        } else {
          console.log(
            "Combined extraction yielded little content, using Tesseract only"
          );
        }
      } catch (skillsError) {
        console.warn(
          "Gemini skills detection failed, using Tesseract only:",
          skillsError.message
        );
      }
    }

    // Return Tesseract result if no Gemini or if Gemini failed
    console.log("Using Tesseract result only");
    return tesseractResult;
  } catch (error) {
    console.error("Enhanced OCR processing failed:", error);
    throw new Error(`Enhanced OCR failed: ${error.message}`);
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
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    script.onload = () => {
      // Set worker source
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    script.onerror = () => {
      reject(new Error("Failed to load PDF.js library"));
    };
    document.head.appendChild(script);
  });
}

/**
 * Enhanced text extraction with OCR fallback for image-based PDFs
 * Uses the same proven approach as extractComprehensiveTextFromPDF for OCR processing
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
    preferGemini = true, // Use Gemini Vision OCR as primary method
    fallbackToTesseract = true, // Fallback to Tesseract if Gemini fails
    useComprehensiveOCR = true, // Use the same approach as extractComprehensiveTextFromPDF for OCR
  } = options;

  // If comprehensive OCR is preferred and OCR is needed, use the comprehensive approach
  if (useComprehensiveOCR && useOCR) {
    console.log(
      "Using comprehensive OCR approach for optimal skills extraction..."
    );
    try {
      const comprehensiveResult = await extractComprehensiveTextFromPDF(file, {
        ocrScale,
        verbose,
        maxPages,
        progressCallback,
        apiKey: options.apiKey,
      });

      // Return the combined text which includes both full text and skills sections
      let extractedText = comprehensiveResult.combinedText || comprehensiveResult.fullText || "";

      // Apply overlapping prevention to prevent duplicate experience sections
      console.log("Applying overlapping content prevention...");
      extractedText = removeOverlappingExperienceSections(extractedText);

      return extractedText;
    } catch (comprehensiveError) {
      console.warn(
        "Comprehensive OCR failed, falling back to standard extraction:",
        comprehensiveError.message
      );
      // Fall through to standard extraction
    }
  }

  console.log(`Starting PDF extraction with options:`, {
    useOCR,
    ocrScale,
    verbose,
    forceOCR,
    maxPages,
  });

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
              const hasResumeKeywords =
                /(experience|education|skills|work|job|resume|cv|employment|position|role)/i.test(
                  meaningfulText
                );
              const hasEnoughText = meaningfulText.length > 20;

              console.log(
                `Page ${i}: Text extraction results - Length: ${meaningfulText.length}, Has keywords: ${hasResumeKeywords}, Has enough text: ${hasEnoughText}`
              );

              if (hasEnoughText || hasResumeKeywords) {
                pageText = extractedText;
                method = "text";
                textPagesCount++;
                console.log(
                  `Page ${i}: Extracted ${meaningfulText.length} characters via text extraction (has keywords: ${hasResumeKeywords})`
                );

                // Log the text extraction content for comparison
                console.log(`\n=== PAGE ${i} EXTRACTED TEXT (DIRECT) ===`);
                console.log(
                  pageText.substring(0, 500) +
                  (pageText.length > 500 ? "..." : "")
                );
                console.log(`=== END PAGE ${i} DIRECT TEXT ===\n`);
              } else if (useOCR) {
                // Text extraction didn't yield enough content, try OCR
                console.log(
                  `Page ${i}: Text extraction yielded only ${meaningfulText.length} characters, switching to OCR`
                );
                method = "ocr";
              }
            } else if (useOCR) {
              method = "ocr";
            }

            // Perform OCR if needed - Use the same proven approach as extractComprehensiveTextFromPDF
            if (method === "ocr" && useOCR) {
              if (progressCallback) {
                progressCallback({
                  current: i,
                  total: totalPages,
                  stage: "tesseract_gemini_ocr",
                  page: i,
                });
              }

              console.log(
                `Page ${i}: Performing Tesseract + Gemini skills detection...`
              );
              try {
                const canvas = await renderPageToCanvas(page, ocrScale);
                console.log(`Page ${i}: Canvas rendered, starting OCR...`);

                // Use Tesseract for main text extraction
                const tesseractResult = await performOCR(canvas, { verbose });
                console.log(
                  `Page ${i}: Tesseract extracted ${tesseractResult ? tesseractResult.length : 0
                  } characters`
                );

                // Ensure tesseractResult is a string
                const tesseractText =
                  typeof tesseractResult === "string" ? tesseractResult : "";

                // Use Gemini focused skills detection (same as extractComprehensiveTextFromPDF)
                let skillsResult = "";
                let hasSkillsSection = false;
                try {
                  console.log(
                    `Page ${i}: Attempting focused Gemini skills detection...`
                  );
                  skillsResult = await performFocusedSkillsOCR(canvas, {
                    verbose,
                    detectSkillsSection: true,
                    apiKey: options.apiKey,
                  });
                  hasSkillsSection =
                    !skillsResult.includes("No skills section found") &&
                    skillsResult.trim().length > 0;
                  console.log(
                    `Page ${i}: Focused skills detection completed: ${skillsResult ? skillsResult.length : 0
                    } characters, hasSkillsSection: ${hasSkillsSection}`
                  );
                } catch (skillsError) {
                  console.warn(
                    `Page ${i}: Focused skills detection failed:`,
                    skillsError.message
                  );
                }

                // Ensure skillsResult is a string
                const skillsText =
                  typeof skillsResult === "string" ? skillsResult : "";

                // Combine results (same logic as extractComprehensiveTextFromPDF)
                pageText = tesseractText;
                if (hasSkillsSection) {
                  // Check if skills are already in Tesseract result
                  const skillsInTesseract =
                    tesseractText.toLowerCase().includes("skills") ||
                    tesseractText.toLowerCase().includes("technical skills") ||
                    tesseractText.toLowerCase().includes("competencies");

                  if (!skillsInTesseract) {
                    pageText = `${tesseractText}\n\n${skillsText}`;
                    console.log(
                      `Page ${i}: Added focused skills section to Tesseract result`
                    );
                  } else {
                    console.log(
                      `Page ${i}: Skills section already found in Tesseract result`
                    );
                  }
                }

                // Ensure pageText is a string
                pageText = typeof pageText === "string" ? pageText : "";
                ocrPagesCount++;
                console.log(
                  `Page ${i}: Tesseract + Focused skills completed - Tesseract: ${tesseractText.length} chars, Skills: ${skillsText.length} chars, hasSkillsSection: ${hasSkillsSection}`
                );

                // Log the extracted text content for debugging
                console.log(`\n=== PAGE ${i} EXTRACTED TEXT (OCR) ===`);
                console.log("--- Tesseract Text ---");
                console.log(
                  tesseractText.substring(0, 500) +
                  (tesseractText.length > 500 ? "..." : "")
                );

                if (hasSkillsSection && skillsText.trim().length > 0) {
                  console.log("--- Focused Skills Text ---");
                  console.log(
                    skillsText.substring(0, 300) +
                    (skillsText.length > 300 ? "..." : "")
                  );
                }

                console.log("--- Combined Final Text ---");
                console.log(
                  pageText.substring(0, 600) +
                  (pageText.length > 600 ? "..." : "")
                );
                console.log(`=== END PAGE ${i} TEXT ===\n`);

                // If still not enough text, try with higher scale
                const pageTextString =
                  typeof pageText === "string" ? pageText : "";
                if (pageTextString.trim().length < 50 && ocrScale < 3.0) {
                  console.log(
                    `Page ${i}: Still little text, trying with higher scale...`
                  );
                  const highResCanvas = await renderPageToCanvas(page, 3.0);
                  const highResText = await performOCR(highResCanvas, {
                    verbose,
                  });
                  const highResTextString =
                    typeof highResText === "string" ? highResText : "";
                  if (
                    highResTextString.trim().length >
                    pageTextString.trim().length
                  ) {
                    pageText = highResTextString;
                    console.log(
                      `Page ${i}: High-res OCR extracted ${pageText ? pageText.length : 0
                      } characters`
                    );
                  }
                }
              } catch (ocrError) {
                console.error(`Combined OCR failed for page ${i}:`, ocrError);
                // Try to extract whatever text we can from the page
                try {
                  const textContent = await page.getTextContent();
                  pageText = textContent.items
                    .map((item) => item.str)
                    .join(" ");
                  console.log(
                    `Page ${i}: Fallback to basic text extraction after OCR failure`
                  );
                } catch (fallbackError) {
                  console.error(
                    `Fallback text extraction also failed for page ${i}:`,
                    fallbackError
                  );
                  pageText = ""; // Empty text for this page
                }
              }
            }

            // Ensure pageText is always a string before concatenating
            const pageTextString = typeof pageText === "string" ? pageText : "";
            fullText += pageTextString + "\n\n";
          } catch (pageError) {
            console.error(`Error processing page ${i}:`, pageError);
            // Continue with next page
          }
        }

        console.log(
          `PDF processing complete: ${textPagesCount} text pages, ${ocrPagesCount} OCR pages`
        );
        console.log(
          `Total extracted text length: ${fullText.length} characters`
        );

        // Log the final combined text for debugging
        console.log(`\n=== FINAL COMBINED TEXT FROM ALL PAGES ===`);
        console.log("First 1000 characters:");
        console.log(
          fullText.substring(0, 1000) + (fullText.length > 1000 ? "..." : "")
        );

        if (fullText.length > 1000) {
          console.log("\nLast 500 characters:");
          console.log("..." + fullText.substring(fullText.length - 500));
        }
        console.log(
          `=== END FINAL TEXT (Total: ${fullText.length} chars) ===\n`
        );

        // Apply overlapping prevention to prevent duplicate experience sections
        console.log("Applying overlapping content prevention to fallback extraction...");
        const cleanedText = removeOverlappingExperienceSections(fullText.trim());
        resolve(cleanedText);
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
 * Extract text from PDF using the comprehensive OCR approach (recommended for image-based PDFs)
 * This function directly uses the same proven approach as testComprehensiveOCR for optimal results
 * @param {File} file - The PDF file to extract text from
 * @param {Object} options - Extraction options
 * @returns {Promise<string>} - The extracted text content with skills properly detected
 */
export async function extractTextFromPDFWithComprehensiveOCR(
  file,
  options = {}
) {
  console.log(
    "Using comprehensive OCR approach for optimal text and skills extraction..."
  );

  try {
    const comprehensiveResult = await extractComprehensiveTextFromPDF(
      file,
      options
    );

    // Return the combined text which includes both full text and skills sections
    const extractedText =
      comprehensiveResult.combinedText || comprehensiveResult.fullText || "";

    console.log("Comprehensive OCR extraction completed:");
    console.log(`- Total text length: ${extractedText.length} characters`);
    console.log(
      `- Pages with skills: ${comprehensiveResult.summary?.pagesWithSkills || 0
      }`
    );
    console.log(
      `- Total pages processed: ${comprehensiveResult.summary?.totalPages || 0}`
    );

    return extractedText;
  } catch (error) {
    console.error("Comprehensive OCR extraction failed:", error);
    throw new Error(`Comprehensive OCR extraction failed: ${error.message}`);
  }
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
        useComprehensiveOCR: true, // Use the comprehensive OCR approach (same as testComprehensiveOCR)
        preferGemini: true, // Use Tesseract + Gemini skills detection
        fallbackToTesseract: true, // Fallback to Tesseract if Gemini fails
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
 * Extract skills section specifically from a PDF page with enhanced preprocessing
 * @param {File} file - PDF file
 * @param {number} pageNumber - Page number (1-based)
 * @returns {Promise<string>} - Extracted skills text
 */
export async function extractSkillsSection(file, pageNumber = 1) {
  try {
    console.log(`Extracting skills section from page ${pageNumber}...`);

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdfjsLib = await loadPDFJS();
          const pdf = await pdfjsLib.getDocument(typedArray).promise;

          if (pageNumber > pdf.numPages) {
            reject(
              new Error(
                `Page ${pageNumber} does not exist. PDF has ${pdf.numPages} pages.`
              )
            );
            return;
          }

          const page = await pdf.getPage(pageNumber);
          const canvas = await renderPageToCanvas(page, 3.0); // Higher scale for better quality

          // Use Gemini Vision OCR specifically for skills detection
          const skillsText = await performFocusedSkillsOCR(canvas, {
            verbose: true,
            detectSkillsSection: true,
          });

          // If focused skills OCR didn't work well, try Tesseract as fallback
          if (
            skillsText.trim().length < 50 ||
            skillsText.includes("No skills section found")
          ) {
            console.log(
              "Focused skills OCR yielded little text or no skills found, trying Tesseract fallback..."
            );
            try {
              const tesseractResult = await performOCR(canvas, {
                verbose: true,
              });

              // Filter for skills-related content - be more restrictive
              const lines = tesseractResult
                .split("\n")
                .filter((line) => line.trim().length > 0);
              const skillsLines = lines.filter((line) => {
                const trimmedLine = line.trim();
                const lowerLine = trimmedLine.toLowerCase();

                // Only include lines that are clearly skills
                // Skip lines that look like they might be inferred or added
                const inferredPatterns = [
                  /various\s+.*\s+strategies/i,
                  /and\s+other\s+.*/i,
                  /including\s+.*/i,
                  /such\s+as\s+.*/i,
                  /experience\s+with\s+.*/i,
                  /knowledge\s+of\s+.*/i,
                  /familiarity\s+with\s+.*/i,
                  /proficiency\s+in\s+.*/i,
                  /expertise\s+in\s+.*/i,
                  /skills\s+include\s+.*/i,
                  /additional\s+skills\s*:?/i,
                  /other\s+technologies\s*:?/i,
                  /related\s+technologies\s*:?/i,
                ];

                const isInferred = inferredPatterns.some((pattern) =>
                  pattern.test(trimmedLine)
                );

                if (isInferred) {
                  return false;
                }

                // Only include if it's clearly a skill or the skills header
                return (
                  /^skills$/i.test(trimmedLine) ||
                  /^technical\s+skills$/i.test(trimmedLine) ||
                  /^competencies$/i.test(trimmedLine) ||
                  /^expertise$/i.test(trimmedLine) ||
                  // Look for specific skill patterns that are likely to be real
                  /^[a-z]+\s*\([^)]+\)$/i.test(trimmedLine) || // e.g., "PROG 5 (Software Development)"
                  /^[a-z]+\s+methodologies?\s*\([^)]+\)$/i.test(trimmedLine) || // e.g., "Agile Methodologies (Scrum, Jira, Confluence)"
                  /^[a-z]+\s+pipelines?\s*\([^)]+\)$/i.test(trimmedLine) || // e.g., "CI/CD Pipelines (GitHub, UrbanCode Deploy)"
                  (/^[a-z]+$/i.test(trimmedLine) &&
                    /^(agile|devsecops|datastage|sql|bash|python|cobol|jcl|rexx|db2|oracle|aws|azure|gcp|react|angular|vue|node|java|javascript|typescript|html|css|docker|kubernetes|terraform|ansible|jenkins|git|scrum|itil|togaf|soa)$/i.test(
                      lowerLine
                    ))
                );
              });

              const result = skillsLines.join("\n");
              console.log(
                `Tesseract fallback skills extraction completed: ${result.length} characters`
              );
              resolve(result);
              return;
            } catch (fallbackError) {
              console.warn("Tesseract fallback failed:", fallbackError);
            }
          }

          // Filter for skills-related content
          const lines = skillsText
            .split("\n")
            .filter((line) => line.trim().length > 0);
          const skillsLines = lines.filter((line) => {
            const lowerLine = line.toLowerCase();
            return (
              /skills|technical|programming|languages|frameworks|tools|technologies|expertise|competencies/i.test(
                lowerLine
              ) ||
              // Look for common skill patterns
              /[a-z]\+|[a-z]\.js|[a-z]\.net|react|angular|vue|node|python|java|c\+\+|sql|html|css|javascript|typescript|aws|cloud|security|database|integration|agile|scrum|itil|togaf|soa/i.test(
                lowerLine
              )
            );
          });

          const result = skillsLines.join("\n");
          console.log(
            `Skills extraction completed: ${result.length} characters`
          );
          resolve(result);
        } catch (error) {
          console.error("Skills extraction failed:", error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read PDF file"));
      };

      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    console.error("Skills section extraction failed:", error);
    throw error;
  }
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
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 100;

    // Set background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add test text
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Test OCR Text Recognition", 10, 50);
    ctx.fillText("This is a test for Tesseract.js", 10, 80);

    console.log("✓ Test canvas created");

    // Test 3: Perform OCR on the test canvas
    const worker = await createWorker("eng", 1);

    const {
      data: { text },
    } = await worker.recognize(canvas);
    await worker.terminate();

    console.log("✓ OCR test completed");
    console.log("Extracted text:", text);

    // Test 4: Verify that some text was extracted
    const hasText = text && text.trim().length > 0;
    console.log(
      `✓ Text extraction verification: ${hasText ? "PASSED" : "FAILED"}`
    );

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

/**
 * Deduplicate skills content to prevent overlapping with existing text
 * @param {string[]} skillsSections - Array of skills sections from different pages
 * @param {string} fullText - The full text extracted from the document
 * @returns {string} - Deduplicated skills content
 */
function deduplicateSkillsContent(skillsSections, fullText) {
  if (!skillsSections || skillsSections.length === 0) {
    return "";
  }

  console.log("Deduplicating skills content to prevent overlapping...");

  // Combine all skills sections
  const combinedSkills = skillsSections.join("\n\n");

  // Clean and validate the skills content
  const cleanedSkills = validateAndCleanSkillsText(combinedSkills);

  if (!cleanedSkills || cleanedSkills.trim().length === 0) {
    console.log("No valid skills content after cleaning");
    return "";
  }

  // Split skills into individual lines for deduplication
  const skillsLines = cleanedSkills.split('\n').filter(line => line.trim().length > 0);
  const fullTextLower = fullText.toLowerCase();

  // Filter out skills that are already present in the full text
  const uniqueSkillsLines = skillsLines.filter(skillLine => {
    const skillLower = skillLine.toLowerCase().trim();

    // Skip empty lines
    if (skillLower.length === 0) {
      return false;
    }

    // Skip if this skill is already present in the full text
    if (fullTextLower.includes(skillLower)) {
      console.log(`Skipping duplicate skill: "${skillLine}"`);
      return false;
    }

    // Skip if this is just a section header that's already present
    if (/^skills$/i.test(skillLower) && fullTextLower.includes('skills')) {
      console.log(`Skipping duplicate skills header: "${skillLine}"`);
      return false;
    }

    // Skip if this is a bullet point that's already present
    if (skillLower.startsWith('•') || skillLower.startsWith('-')) {
      const skillWithoutBullet = skillLower.replace(/^[•\-]\s*/, '').trim();
      if (fullTextLower.includes(skillWithoutBullet)) {
        console.log(`Skipping duplicate bullet skill: "${skillLine}"`);
        return false;
      }
    }

    return true;
  });

  const deduplicatedSkills = uniqueSkillsLines.join('\n');

  console.log(`Skills deduplication: ${skillsLines.length} original lines -> ${uniqueSkillsLines.length} unique lines`);

  return deduplicatedSkills;
}

/**
 * Detect and prevent overlapping experience sections in the extracted text
 * @param {string} text - The full extracted text
 * @returns {string} - Text with overlapping experience sections removed
 */
function removeOverlappingExperienceSections(text) {
  if (!text || text.trim().length === 0) {
    return text;
  }

  console.log("Checking for overlapping experience sections...");

  const lines = text.split('\n');
  const cleanedLines = [];
  let inExperienceSection = false;
  let experienceContent = new Set(); // Track unique experience content
  let relevantExperienceContent = new Set(); // Track relevant experience content specifically

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (line.length === 0) {
      cleanedLines.push(lines[i]); // Keep original line with whitespace
      continue;
    }

    const lowerLine = line.toLowerCase();

    // Check if this line starts an experience section
    const isExperienceHeader = /^(experience|work\s+experience|employment\s+history|professional\s+experience)/i.test(lowerLine);
    const isRelevantExperienceHeader = /^(relevant\s+experience|key\s+experience|selected\s+experience)/i.test(lowerLine);

    if (isRelevantExperienceHeader) {
      // Starting a relevant experience section
      inExperienceSection = true;
      experienceContent.clear(); // Reset for new section
      cleanedLines.push(lines[i]);
      console.log(`Starting relevant experience section: "${line}"`);
    } else if (isExperienceHeader) {
      if (!inExperienceSection) {
        // Starting a new experience section
        inExperienceSection = true;
        experienceContent.clear(); // Reset for new section
        cleanedLines.push(lines[i]);
        console.log(`Starting experience section: "${line}"`);
      } else {
        // Already in an experience section, this might be a duplicate header
        console.log(`Skipping duplicate experience header: "${line}"`);
        continue;
      }
    } else if (inExperienceSection) {
      // Check if this line contains experience content
      const isExperienceContent = /(led|managed|developed|implemented|designed|created|maintained|coordinated|delivered|achieved|increased|improved|reduced|established|provided|ensured|maintained|supported|collaborated|worked|responsible|duties|responsibilities|technical\s+program\s+manager|senior\s+project\s+manager|senior\s+technical\s+project\s+manager)/i.test(lowerLine);

      if (isExperienceContent) {
        // Check if this content is already present
        const normalizedContent = lowerLine.replace(/\s+/g, ' ').trim();

        if (experienceContent.has(normalizedContent)) {
          console.log(`Skipping duplicate experience content: "${line}"`);
          continue;
        } else {
          experienceContent.add(normalizedContent);
          cleanedLines.push(lines[i]);
        }
      } else {
        // Not experience content, keep it
        cleanedLines.push(lines[i]);
      }
    } else {
      // Not in experience section, keep the line
      cleanedLines.push(lines[i]);
    }
  }

  const cleanedText = cleanedLines.join('\n');
  console.log(`Experience deduplication completed`);

  return cleanedText;
}

/**
 * Validate and clean extracted skills text to remove any inferred or added skills
 * @param {string} text - Raw extracted skills text
 * @returns {string} - Cleaned skills text
 */
function validateAndCleanSkillsText(text) {
  if (!text || text.trim().length === 0) {
    return text;
  }

  const lines = text.split("\n");
  const cleanedLines = [];
  let inSkillsSection = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (trimmedLine.length === 0) {
      continue;
    }

    // Check if this is the skills header
    if (/^skills$/i.test(trimmedLine)) {
      inSkillsSection = true;
      cleanedLines.push(trimmedLine);
      continue;
    }

    // If we're in the skills section, validate each line
    if (inSkillsSection) {
      // Skip lines that look like they might be inferred or added
      const lowerLine = trimmedLine.toLowerCase();

      // Skip if line contains common inferred patterns
      const inferredPatterns = [
        /various\s+.*\s+strategies/i,
        /and\s+other\s+.*/i,
        /including\s+.*/i,
        /such\s+as\s+.*/i,
        /experience\s+with\s+.*/i,
        /knowledge\s+of\s+.*/i,
        /familiarity\s+with\s+.*/i,
        /proficiency\s+in\s+.*/i,
        /expertise\s+in\s+.*/i,
        /skills\s+include\s+.*/i,
        /additional\s+skills\s*:?/i,
        /other\s+technologies\s*:?/i,
        /related\s+technologies\s*:?/i,
      ];

      const isInferred = inferredPatterns.some((pattern) =>
        pattern.test(trimmedLine)
      );

      if (!isInferred) {
        cleanedLines.push(trimmedLine);
      } else {
        console.log(`Skipping inferred line: "${trimmedLine}"`);
      }
    } else {
      // If not in skills section, only add if it looks like a skills header
      if (/^(technical\s+)?skills$/i.test(trimmedLine)) {
        inSkillsSection = true;
        cleanedLines.push(trimmedLine);
      }
    }
  }

  return cleanedLines.join("\n");
}

/**
 * Perform focused OCR specifically for skills section extraction
 * @param {HTMLCanvasElement} canvas - Canvas containing the page image
 * @param {Object} options - OCR options
 * @returns {Promise<string>} - Extracted skills text only
 */
async function performFocusedSkillsOCR(canvas, options = {}) {
  const {
    verbose = false,
    detectSkillsSection = true,
    apiKey = null,
  } = options;

  console.log("Starting focused skills OCR processing...");
  console.log("Canvas dimensions:", canvas.width, "x", canvas.height);

  try {
    // Import config to get API key
    const config = await import("@/configs");
    const effectiveApiKey = apiKey || config.default.geminiApiKey;

    if (!effectiveApiKey) {
      throw new Error("Gemini API key is required for vision OCR");
    }

    // Convert canvas to base64
    const base64Image = canvasToBase64(canvas);

    // Create a focused prompt specifically for skills extraction
    const prompt = `You are an expert resume skills extraction specialist. Your task is to extract ONLY the skills section from this resume image.

CRITICAL INSTRUCTIONS:
1. Look for a section titled "SKILLS", "TECHNICAL SKILLS", "COMPETENCIES", "EXPERTISE", or similar
2. Extract ONLY the skills that are VISUALLY PRESENT in the image
3. Do NOT add, create, or infer any skills that are not explicitly shown
4. Do NOT include job responsibilities, work experience, or other content
5. Do NOT include qualifications, certifications, or education details
6. Focus ONLY on the actual skills, technologies, and competencies that are VISIBLE

WHAT TO EXTRACT:
- ONLY skills that are explicitly listed in the skills section
- Technical skills that are VISUALLY PRESENT
- Programming languages that are SHOWN
- Frameworks and tools that are LISTED
- Methodologies that are DISPLAYED
- Technologies and platforms that are VISIBLE

WHAT TO EXCLUDE:
- ANY skills that are not explicitly shown in the image
- Job titles and company names
- Work experience descriptions
- Job responsibilities and achievements
- Education and certifications
- Contact information
- Profile summaries
- Any content that is not a skill or technology
- Any inferred or assumed skills

EXTRACTION FORMAT:
- Extract skills EXACTLY as they appear in the image
- Maintain the original formatting and structure
- Include the "SKILLS" header if present
- List each skill on a separate line if they are listed separately
- Preserve bullet points or special formatting
- Do NOT add any additional skills or technologies

STRICT RULE: If you cannot clearly see a skill in the image, DO NOT include it. Only extract what is VISUALLY PRESENT and CLEARLY READABLE.

Return ONLY the skills section content that is VISUALLY PRESENT in the image, nothing else. If no skills section is found, return "No skills section found."`;

    // Make request to Gemini Vision API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": effectiveApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inline_data: {
                    mime_type: "image/png",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.error?.message || `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts) {
      let extractedText = data.candidates[0].content.parts[0].text;

      console.log(
        `Focused skills OCR completed. Extracted ${extractedText.length} characters`
      );

      // Validate and clean the extracted text to remove any inferred skills
      extractedText = validateAndCleanSkillsText(extractedText);

      if (verbose) {
        console.log("Extracted skills text:", extractedText);
      }

      return extractedText;
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Focused skills OCR processing failed:", error);
    throw new Error(`Focused skills OCR failed: ${error.message}`);
  }
}

/**
 * Perform comprehensive OCR that combines full text extraction with focused skills extraction
 * @param {HTMLCanvasElement} canvas - Canvas containing the page image
 * @param {Object} options - OCR options
 * @returns {Promise<Object>} - Combined result with full text and skills
 */
async function performComprehensiveOCR(canvas, options = {}) {
  const {
    verbose = false,
    detectSkillsSection = true,
    apiKey = null,
  } = options;

  console.log("Starting comprehensive OCR processing...");
  console.log("Canvas dimensions:", canvas.width, "x", canvas.height);

  try {
    // Import config to get API key
    const config = await import("@/configs");
    const effectiveApiKey = apiKey || config.default.geminiApiKey;

    if (!effectiveApiKey) {
      throw new Error("Gemini API key is required for vision OCR");
    }

    // Run both OCR methods in parallel for better performance
    const [fullTextResult, focusedSkillsResult] = await Promise.all([
      performGeminiOCR(canvas, { verbose, detectSkillsSection, apiKey }),
      performFocusedSkillsOCR(canvas, { verbose, detectSkillsSection, apiKey }),
    ]);

    console.log("Comprehensive OCR completed:");
    console.log("- Full text extraction:", fullTextResult.length, "characters");
    console.log(
      "- Focused skills extraction:",
      focusedSkillsResult.length,
      "characters"
    );

    // Create combined result
    const combinedResult = {
      fullText: fullTextResult,
      skillsSection: focusedSkillsResult,
      combinedText: "",
      hasSkillsSection: !focusedSkillsResult.includes(
        "No skills section found"
      ),
      summary: {
        fullTextLength: fullTextResult.length,
        skillsLength: focusedSkillsResult.length,
        totalLength: fullTextResult.length + focusedSkillsResult.length,
      },
    };

    // Create a combined text that includes both full content and skills
    if (combinedResult.hasSkillsSection) {
      // If skills section was found, append it to the full text
      combinedResult.combinedText = `${fullTextResult}\n\n${focusedSkillsResult}`;
      combinedResult.combinedTextWithMarkers = `${fullTextResult}\n\n=== EXTRACTED SKILLS SECTION ===\n${focusedSkillsResult}`;
    } else {
      // If no skills section found, just use the full text
      combinedResult.combinedText = fullTextResult;
      combinedResult.combinedTextWithMarkers = fullTextResult;
    }

    if (verbose) {
      console.log("Combined result summary:", combinedResult.summary);
      console.log("Has skills section:", combinedResult.hasSkillsSection);
    }

    return combinedResult;
  } catch (error) {
    console.error("Comprehensive OCR processing failed:", error);
    throw new Error(`Comprehensive OCR failed: ${error.message}`);
  }
}

/**
 * Extract comprehensive text from PDF with both full content and skills section
 * @param {File} file - The PDF file to extract text from
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Comprehensive extraction result
 */
export async function extractComprehensiveTextFromPDF(file, options = {}) {
  const {
    ocrScale = 2.0,
    verbose = false,
    maxPages = null, // Limit number of pages to process
    progressCallback = null, // Callback for progress updates
    apiKey = null,
  } = options;

  console.log(`Starting comprehensive PDF extraction with options:`, {
    ocrScale,
    verbose,
    maxPages,
  });

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

        let allResults = {
          pages: [],
          fullText: "",
          skillsSections: [],
          combinedText: "",
          summary: {
            totalPages: totalPages,
            pagesWithSkills: 0,
            totalFullTextLength: 0,
            totalSkillsLength: 0,
          },
        };

        console.log(`Processing PDF: ${totalPages} pages`);

        for (let i = 1; i <= totalPages; i++) {
          if (progressCallback) {
            progressCallback({
              current: i,
              total: totalPages,
              stage: "processing",
              page: i,
            });
          }

          const page = await pdf.getPage(i);
          console.log(`Processing page ${i}...`);

          try {
            // First try to extract text normally
            let pageText = "";
            let method = "text";

            try {
              console.log(`Page ${i}: Attempting text extraction...`);
              const textContent = await page.getTextContent();
              const extractedText = textContent.items
                .map((item) => item.str)
                .join(" ");

              const meaningfulText = extractedText.trim();
              const hasResumeKeywords =
                /(experience|education|skills|work|job|resume|cv|employment|position|role)/i.test(
                  meaningfulText
                );
              const hasEnoughText = meaningfulText.length > 20;

              console.log(
                `Page ${i}: Text extraction results - Length: ${meaningfulText.length}, Has keywords: ${hasResumeKeywords}, Has enough text: ${hasEnoughText}`
              );

              if (hasEnoughText || hasResumeKeywords) {
                pageText = extractedText;
                method = "text";
                console.log(
                  `Page ${i}: Extracted ${meaningfulText.length} characters via text extraction`
                );
              } else {
                method = "ocr";
              }
            } catch (textError) {
              console.log(
                `Page ${i}: Text extraction failed, switching to OCR`
              );
              method = "ocr";
            }

            // Perform Tesseract + Gemini skills detection if needed
            if (method === "ocr") {
              if (progressCallback) {
                progressCallback({
                  current: i,
                  total: totalPages,
                  stage: "tesseract_gemini_ocr",
                  page: i,
                });
              }

              console.log(
                `Page ${i}: Performing Tesseract + Gemini skills detection...`
              );
              const canvas = await renderPageToCanvas(page, ocrScale);

              // Use Tesseract for main text extraction
              const tesseractResult = await performOCR(canvas, { verbose });

              // Use Gemini for skills detection
              let skillsResult = "";
              let hasSkillsSection = false;
              try {
                skillsResult = await performFocusedSkillsOCR(canvas, {
                  verbose,
                  detectSkillsSection: true,
                  apiKey,
                });
                hasSkillsSection =
                  !skillsResult.includes("No skills section found") &&
                  skillsResult.trim().length > 0;
              } catch (skillsError) {
                console.warn(
                  `Page ${i}: Gemini skills detection failed:`,
                  skillsError.message
                );
              }

              // Combine results with intelligent deduplication
              pageText = tesseractResult;
              if (hasSkillsSection) {
                // Check if skills are already in Tesseract result
                const skillsInTesseract =
                  tesseractResult.toLowerCase().includes("skills") ||
                  tesseractResult.toLowerCase().includes("technical skills") ||
                  tesseractResult.toLowerCase().includes("competencies");

                if (!skillsInTesseract) {
                  // Deduplicate skills content at page level
                  const deduplicatedSkills = deduplicateSkillsContent([skillsResult], tesseractResult);
                  if (deduplicatedSkills.trim().length > 0) {
                    pageText = `${tesseractResult}\n\n${deduplicatedSkills}`;
                    console.log(`Page ${i}: Added deduplicated skills section to Tesseract result`);
                  } else {
                    console.log(`Page ${i}: All skills were already present in Tesseract result`);
                  }
                } else {
                  console.log(`Page ${i}: Skills section already found in Tesseract result`);
                }
              }

              // Store page results
              allResults.pages.push({
                pageNumber: i,
                method: "tesseract_gemini_skills",
                fullText: tesseractResult,
                skillsSection: skillsResult,
                hasSkillsSection: hasSkillsSection,
                summary: {
                  fullTextLength: tesseractResult.length,
                  skillsLength: skillsResult.length,
                  totalLength: pageText.length,
                },
              });

              // Update overall summary
              allResults.summary.totalFullTextLength += tesseractResult.length;
              allResults.summary.totalSkillsLength += skillsResult.length;
              if (hasSkillsSection) {
                allResults.summary.pagesWithSkills++;
              }

              console.log(
                `Page ${i}: Tesseract + Gemini skills completed - Tesseract: ${tesseractResult.length} chars, Skills: ${skillsResult.length} chars`
              );
            } else {
              // Store text extraction results
              allResults.pages.push({
                pageNumber: i,
                method: "text_extraction",
                fullText: pageText,
                skillsSection: "",
                hasSkillsSection: false,
                summary: {
                  fullTextLength: pageText.length,
                  skillsLength: 0,
                  totalLength: pageText.length,
                },
              });

              allResults.summary.totalFullTextLength += pageText.length;
            }

            allResults.fullText += pageText + "\n\n";
          } catch (pageError) {
            console.error(`Error processing page ${i}:`, pageError);
            // Continue with next page
          }
        }

        // Combine all results with intelligent deduplication
        allResults.combinedText = allResults.fullText;
        allResults.combinedTextWithMarkers = allResults.fullText;

        // Remove overlapping experience sections from the full text
        allResults.combinedText = removeOverlappingExperienceSections(allResults.combinedText);
        allResults.combinedTextWithMarkers = removeOverlappingExperienceSections(allResults.combinedTextWithMarkers);

        // Add skills sections if found, with deduplication
        const skillsSections = allResults.pages
          .filter((page) => page.hasSkillsSection && page.skillsSection)
          .map((page) => page.skillsSection);

        if (skillsSections.length > 0) {
          // Deduplicate skills content to prevent overlapping
          const deduplicatedSkills = deduplicateSkillsContent(skillsSections, allResults.combinedText);

          if (deduplicatedSkills.trim().length > 0) {
            // Add skills naturally without markers for exact matching
            allResults.combinedText += `\n\n${deduplicatedSkills}`;
            // Add skills with markers for analysis
            allResults.combinedTextWithMarkers += `\n\n=== ALL EXTRACTED SKILLS SECTIONS ===\n${deduplicatedSkills}`;
          }
        }

        console.log("Comprehensive PDF processing complete:");
        console.log(
          `- Total pages processed: ${allResults.summary.totalPages}`
        );
        console.log(
          `- Pages with skills sections: ${allResults.summary.pagesWithSkills}`
        );
        console.log(
          `- Total full text length: ${allResults.summary.totalFullTextLength} characters`
        );
        console.log(
          `- Total skills text length: ${allResults.summary.totalSkillsLength} characters`
        );

        resolve(allResults);
      } catch (error) {
        console.error("Error extracting comprehensive text from PDF:", error);
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
 * Extract text from PDF and parse directly to structured JSON
 * This function combines OCR extraction with JSON parsing in one step
 * @param {File} file - The PDF file to extract and parse
 * @param {Object} options - Extraction and parsing options
 * @returns {Promise<Object>} - Structured resume data in JSON format
 */
export async function extractAndParsePDFToJSON(file, options = {}) {
  const {
    useComprehensiveOCR = true,
    verbose = false,
    apiKey = null,
    progressCallback = null,
  } = options;

  console.log("Extracting PDF and parsing to structured JSON...");

  try {
    // Step 1: Extract text using comprehensive OCR
    let extractedText;
    if (useComprehensiveOCR) {
      console.log("Using comprehensive OCR for text extraction...");
      const comprehensiveResult = await extractComprehensiveTextFromPDF(file, {
        verbose,
        progressCallback,
        apiKey,
      });
      extractedText = comprehensiveResult.combinedText || comprehensiveResult.fullText || "";
    } else {
      console.log("Using standard OCR for text extraction...");
      extractedText = await extractTextFromPDF(file, {
        useOCR: true,
        verbose,
        progressCallback,
        apiKey,
      });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text extracted from PDF");
    }

    console.log(`Text extraction completed: ${extractedText.length} characters`);

    // Step 2: Parse the extracted text to structured JSON
    console.log("Parsing extracted text to structured JSON...");
    const structuredData = await parseOCRTextToJSON(extractedText, {
      verbose,
      apiKey,
    });

    console.log("PDF extraction and parsing completed successfully");
    return structuredData;

  } catch (error) {
    console.error("PDF extraction and parsing failed:", error);
    throw new Error(`PDF extraction and parsing failed: ${error.message}`);
  }
}

/**
 * Parse OCR-extracted text into structured JSON using Gemini
 * This function maps the raw OCR text directly to the resume JSON structure
 * @param {string} ocrText - The text extracted from OCR
 * @param {Object} options - Parsing options
 * @returns {Promise<Object>} - Structured resume data in JSON format
 */
export async function parseOCRTextToJSON(ocrText, options = {}) {
  const {
    verbose = false,
    apiKey = null,
  } = options;

  console.log("Parsing OCR text to structured JSON using Gemini...");
  console.log(`Input text length: ${ocrText.length} characters`);

  try {
    // Import config to get API key
    const config = await import("@/configs");
    const effectiveApiKey = apiKey || config.default.geminiApiKey;

    if (!effectiveApiKey) {
      throw new Error("Gemini API key is required for text parsing");
    }

    // Trim text if it's too long (Gemini has input limits)
    const trimmedText = ocrText.length > 30000
      ? ocrText.substring(0, 30000) + "..."
      : ocrText;

    const parsingPrompt = `You are an expert resume parser. Parse the following OCR-extracted resume text into a structured JSON object. Extract the EXACT text as it appears in the original - do not summarize, rewrite, or modify any content.

CRITICAL PARSING RULES:
- Extract EXACT text as it appears in the OCR output
- Do not add, remove, or modify any content
- Maintain original formatting and structure where possible
- If a section is not present, return null or empty array as specified
- For experience sections, map them correctly to avoid duplication

JSON SCHEMA - Parse into this exact structure:

{
  "profile": {
    "name": "Full Name - extract exact text",
    "title": "PROFESSIONAL TITLE IN CAPS - extract exact text",
    "location": "city - extract exact text",
    "clearance": "Security clearance level (e.g., NV1, Baseline) or null if not mentioned",
    "description": "First paragraph of professional summary - extract exact text",
    "description2": "Second paragraph of professional summary - extract exact text"
  },
  "contact": {
    "email": "email@example.com or null if not provided",
    "phone": "+61 XXX XXX XXX or null if not provided", 
    "linkedin": "LinkedIn profile URL or null if not provided"
  },
  "qualifications": ["List of degrees, certifications, and professional qualifications - exact text"],
  "affiliations": ["Professional memberships and associations - exact text"],
  "skills": ["Key technical and professional skills - exact text"],
  "keyAchievements": ["Major career achievements and accomplishments - exact text as listed"],
  "experience": [
  //Relevant experience section,
    {
      "title": "Job Title - Company (Organization if applicable) - exact text",
      "period": "Start Date - End Date - exact text",
      "responsibilities": ["Exact responsibility text 1", "Exact responsibility text 2"]
    }
  ],
  "fullExperience": [
    {
      "title": "Job Title - Company (Organization if applicable) - exact text",
      "period": "Start Date - End Date - exact text",
      "responsibilities": [
        "Exact responsibility text 1 as written in original",
        "Exact responsibility text 2 as written in original",
        "Copy ALL responsibility bullets exactly as they appear - do not limit to 6-8"
      ]
    }
  ],
  "referees": [
    {
      "title": "Job title (Company) - exact text" or return empty array if not provided,
      "name": "Referee Name - exact text" or return empty array if not provided, 
      "email": "email@example.com - exact text" or return empty array if not provided,
      "phone": "+61 XXX XXX XXX - exact text" or return empty array if not provided
    }
  ]
}

EXPERIENCE SECTION MAPPING RULES:
- Look for sections titled "RELEVANT EXPERIENCE", "KEY EXPERIENCE", or "SELECTED EXPERIENCE" - these go into the "experience" array
- Look for sections titled "EXPERIENCE", "WORK EXPERIENCE", "EMPLOYMENT HISTORY", or "FULL EXPERIENCE" - these go into the "fullExperience" array
- If there's only one experience section, put it in "fullExperience" and leave "experience" empty
- DO NOT duplicate the same job positions between "experience" and "fullExperience" arrays
- If a job appears in both sections in the original text, put it in "fullExperience" only
- The "experience" array should contain only the most relevant/concise experience section
- The "fullExperience" array should contain the complete/detailed experience section

EXTRACTION INSTRUCTIONS:
- Extract and copy the EXACT words, phrases, and sentences as they appear
- DO NOT combine, merge, or consolidate any bullet points or responsibilities
- DO NOT limit the number of responsibility bullets - include ALL as they appear
- DO NOT paraphrase or reword anything - use the precise original text
- If text spans multiple lines or bullets, copy each one exactly as a separate item
- Maintain original formatting, capitalization, and punctuation where possible
- For profile descriptions: Copy the exact text of any professional summary/objective sections
- For skills: Copy the exact skill names/descriptions as listed
- For qualifications: Copy degree names, institution names, and dates exactly
- If referees are not provided, return empty array for the fields. If provided, copy exact details
- For affiliations: Copy exact organization names and membership details, or return "No information given" if not available

Your job is purely extraction and mapping - you are NOT an editor or summarizer.

OCR-extracted resume text to parse:
${trimmedText}

Return ONLY the JSON object, no additional text or formatting.`;

    // Make request to Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": effectiveApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: parsingPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts) {
      const jsonText = data.candidates[0].content.parts[0].text;

      // Parse the JSON response
      let parsedData;
      try {
        parsedData = JSON.parse(jsonText);
      } catch (parseError) {
        console.error("Failed to parse Gemini response as JSON:", parseError);
        throw new Error("Invalid JSON response from Gemini API");
      }

      // Validate and set defaults for required fields
      const result = {
        profile: {
          name: parsedData.profile?.name || "Unknown Candidate",
          title: parsedData.profile?.title || "PROFESSIONAL",
          location: parsedData.profile?.location || "",
          clearance: parsedData.profile?.clearance || null,
          photo: "/api/placeholder/400/600",
          description: parsedData.profile?.description || "Professional with extensive experience in their field.",
          description2: parsedData.profile?.description2 || "Skilled professional with a strong background in project management and technical expertise.",
        },
        contact: {
          email: parsedData.contact?.email || null,
          phone: parsedData.contact?.phone || null,
          linkedin: parsedData.contact?.linkedin || null,
        },
        qualifications: Array.isArray(parsedData.qualifications) ? parsedData.qualifications : [],
        affiliations: Array.isArray(parsedData.affiliations) ? parsedData.affiliations : [],
        skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
        keyAchievements: Array.isArray(parsedData.keyAchievements) ? parsedData.keyAchievements : [],
        experience: Array.isArray(parsedData.experience)
          ? parsedData.experience.map((exp) => ({
            title: exp.title || "Position",
            period: exp.period || "Date not specified",
            responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
          }))
          : [],
        fullExperience: Array.isArray(parsedData.fullExperience)
          ? parsedData.fullExperience.map((exp) => ({
            title: exp.title || "Position",
            period: exp.period || "Date not specified",
            responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
          }))
          : [],
        referees: Array.isArray(parsedData.referees) && parsedData.referees.length > 0
          ? parsedData.referees.map((ref) => ({
            name: ref?.name,
            title: ref?.title,
            email: ref?.email,
            phone: ref?.phone,
          }))
          : null,
      };

      console.log("OCR text parsing completed successfully:");
      console.log(`- Profile: ${result.profile.name} - ${result.profile.title}`);
      console.log(`- Experience sections: ${result.experience.length} relevant, ${result.fullExperience.length} full`);
      console.log(`- Skills: ${result.skills.length} items`);
      console.log(`- Qualifications: ${result.qualifications.length} items`);

      return result;
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("OCR text parsing failed:", error);
    throw new Error(`OCR text parsing failed: ${error.message}`);
  }
}

/**
 * Test PDF extraction and parsing to JSON functionality
 * @param {File} file - PDF file to test
 * @returns {Promise<Object>} - Test results with structured JSON data
 */
export async function testPDFParsingToJSON(file) {
  try {
    console.log("Testing PDF extraction and parsing to JSON...");

    const startTime = Date.now();

    // Test the new combined extraction and parsing function
    const structuredData = await extractAndParsePDFToJSON(file, {
      useComprehensiveOCR: true,
      verbose: true,
    });

    const totalTime = Date.now() - startTime;

    const results = {
      structuredData: structuredData,
      time: totalTime,
      summary: {
        profile: structuredData.profile?.name || "Unknown",
        title: structuredData.profile?.title || "Unknown",
        experienceCount: structuredData.experience?.length || 0,
        fullExperienceCount: structuredData.fullExperience?.length || 0,
        skillsCount: structuredData.skills?.length || 0,
        qualificationsCount: structuredData.qualifications?.length || 0,
      },
    };

    console.log("PDF parsing to JSON test results:");
    console.log("Total processing time:", totalTime, "ms");
    console.log("Profile:", results.summary.profile, "-", results.summary.title);
    console.log("Experience sections:", results.summary.experienceCount, "relevant,", results.summary.fullExperienceCount, "full");
    console.log("Skills:", results.summary.skillsCount, "items");
    console.log("Qualifications:", results.summary.qualificationsCount, "items");

    return results;
  } catch (error) {
    console.error("PDF parsing to JSON test failed:", error);
    throw error;
  }
}

/**
 * Test comprehensive OCR functionality
 * @param {File} file - PDF file to test
 * @returns {Promise<Object>} - Test results with comprehensive extraction
 */
export async function testComprehensiveOCR(file) {
  try {
    console.log("Testing comprehensive OCR functionality...");

    const startTime = Date.now();

    // Test comprehensive extraction
    const comprehensiveResult = await extractComprehensiveTextFromPDF(file, {
      verbose: true,
      ocrScale: 2.0,
    });

    const totalTime = Date.now() - startTime;

    const results = {
      comprehensive: {
        result: comprehensiveResult,
        time: totalTime,
        summary: comprehensiveResult.summary,
      },
    };

    console.log("Comprehensive OCR test results:");
    console.log("Total processing time:", totalTime, "ms");
    console.log(
      "Total pages processed:",
      comprehensiveResult.summary.totalPages
    );
    console.log(
      "Pages with skills sections:",
      comprehensiveResult.summary.pagesWithSkills
    );
    console.log(
      "Total full text length:",
      comprehensiveResult.summary.totalFullTextLength,
      "characters"
    );
    console.log(
      "Total skills text length:",
      comprehensiveResult.summary.totalSkillsLength,
      "characters"
    );

    return results;
  } catch (error) {
    console.error("Comprehensive OCR test failed:", error);
    throw error;
  }
}
