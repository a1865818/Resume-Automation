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
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - The file extension
 */
export function getFileExtension(filename) {
  return filename.slice(filename.lastIndexOf("."));
}

/**
 * Check if file is specifically a .docx file (modern Word format)
 * @param {File} file - File to check
 * @returns {boolean} - True if file is .docx
 */
export function isDocxFile(file) {
  const isDocxType =
    file &&
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isDocxExtension = file && file.name.toLowerCase().endsWith(".docx");

  return isDocxType || isDocxExtension;
}

/**
 * Check if file is a legacy .doc file (older Word format)
 * @param {File} file - File to check
 * @returns {boolean} - True if file is .doc
 */
export function isDocFile(file) {
  const isDocType = file && file.type === "application/msword";
  const isDocExtension = file && file.name.toLowerCase().endsWith(".doc");

  return isDocType || isDocExtension;
}

/**
 * Enhanced text extraction with error handling and format detection
 * @param {File} file - The Word document file
 * @returns {Promise<{success: boolean, text?: string, html?: string, error?: string, format?: string}>}
 */
export async function extractWordContent(file) {
  try {
    // Validate file first
    if (!validateWordFile(file)) {
      return {
        success: false,
        error: "Invalid file format. Please upload a .docx or .doc file.",
      };
    }

    const format = isDocxFile(file) ? "docx" : "doc";

    if (format === "doc") {
      console.warn("Legacy .doc format detected. Extraction may be limited.");
    }

    // Extract content
    const result = await extractFormattedTextFromWord(file);

    return {
      success: true,
      text: result.text,
      html: result.html,
      format: format,
    };
  } catch (error) {
    console.error("Word content extraction failed:", error);

    return {
      success: false,
      error: `Failed to extract content: ${error.message}`,
      format: isDocxFile(file) ? "docx" : "doc",
    };
  }
}

/**
 * Convert Word document content to plain text (strips HTML tags if present)
 * @param {string} content - Content that might contain HTML tags
 * @returns {string} - Plain text content
 */
export function stripHtmlTags(content) {
  if (!content) return "";

  // Create a temporary div element to strip HTML tags
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;

  // Get text content and clean up extra whitespace
  return tempDiv.textContent || tempDiv.innerText || content;
}
