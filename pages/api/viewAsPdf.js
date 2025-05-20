// pages/api/viewAsPdf.js
import { promises as fs } from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";

import { extractCandidateNameFromSummary } from "../utils/pdfUtils";
import {
  extractResumeMetadata,
  formatMetadata,
} from "../utils/resumeMetadataExtractor";

// Helper function to wrap text at specified width
function wrapText(text, maxWidth, font, fontSize) {
  // Split text into words
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    // Try adding the word to the current line
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    // Calculate width of the test line
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width <= maxWidth) {
      // If the line with the new word fits, update the current line
      currentLine = testLine;
    } else {
      // If it doesn't fit, push the current line and start a new one with the current word
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  // Push the last line if there's anything left
  if (currentLine) lines.push(currentLine);

  return lines;
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Get fileName from query parameters
  const { fileName } = req.query;
  if (!fileName) {
    return res.status(400).json({ message: "fileName parameter is required" });
  }

  try {
    // Construct file paths
    const summariesDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "summaries"
    );
    const textFilePath = path.join(summariesDir, fileName);
    const metadataFilePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "metadata",
      fileName.replace(".txt", ".json")
    );

    // Check if the text file exists
    try {
      await fs.access(textFilePath);
    } catch (error) {
      return res.status(404).json({ message: "Summary file not found" });
    }

    // Read the summary text
    const summaryText = await fs.readFile(textFilePath, "utf8");

    // Try to read metadata if it exists
    let metadata = {};
    try {
      const metadataRaw = await fs.readFile(metadataFilePath, "utf8");
      metadata = JSON.parse(metadataRaw);
    } catch (error) {
      // Extract metadata from summary text if metadata file doesn't exist
      const extractedMeta = extractResumeMetadata(summaryText);
      metadata = formatMetadata(extractedMeta);
    }

    // Create PDF document
    const pdfDoc = await PDFDocument.create();

    // Embed fonts
    const helveticaFont = await pdfDoc.embedFont("Helvetica");
    const helveticaBold = await pdfDoc.embedFont("Helvetica-Bold");

    // Add page (A4 size)
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();

    // Set margins
    const margin = 50;
    const contentWidth = width - margin * 2;
    let currentY = height - 50;
    const lineHeight = 14;

    // Colors
    const titleColor = rgb(0.1, 0.1, 0.7);
    const headerColor = rgb(0.2, 0.2, 0.6);
    const textColor = rgb(0, 0, 0);
    const lightGrayColor = rgb(0.5, 0.5, 0.5);

    // Draw title centered
    const titleText = "Resume Summary";
    const titleWidth = helveticaBold.widthOfTextAtSize(titleText, 22);
    page.drawText(titleText, {
      x: (width - titleWidth) / 2,
      y: currentY,
      size: 22,
      font: helveticaBold,
      color: titleColor,
    });
    currentY -= 30;

    // Add candidate name
    if (metadata.candidateName) {
      const candidateText = `Candidate: ${metadata.candidateName}`;
      const candidateWidth = helveticaBold.widthOfTextAtSize(candidateText, 16);
      page.drawText(candidateText, {
        x: (width - candidateWidth) / 2,
        y: currentY,
        size: 16,
        font: helveticaBold,
        color: headerColor,
      });
      currentY -= 40;
    } else {
      // Try to extract name if metadata doesn't have it
      const candidateName = extractCandidateNameFromSummary(summaryText);
      if (candidateName) {
        const candidateText = `Candidate: ${candidateName}`;
        const candidateWidth = helveticaBold.widthOfTextAtSize(
          candidateText,
          16
        );
        page.drawText(candidateText, {
          x: (width - candidateWidth) / 2,
          y: currentY,
          size: 16,
          font: helveticaBold,
          color: headerColor,
        });
        currentY -= 40;
      }
    }

    // Create info boxes in 2-column layout
    const colWidth = (contentWidth - 15) / 2; // 15px gap between columns
    const leftColX = margin;
    const rightColX = margin + colWidth + 15;

    // Left column info
    if (metadata.educationLevel) {
      page.drawText(`Education: ${metadata.educationLevel}`, {
        x: leftColX,
        y: currentY,
        size: 12,
        font: helveticaFont,
      });
    }

    // Right column info
    if (metadata.location) {
      const locationText = `Location: ${metadata.location}`;
      // Check if text needs wrapping
      if (helveticaFont.widthOfTextAtSize(locationText, 12) > colWidth) {
        const wrappedText = wrapText(locationText, colWidth, helveticaFont, 12);
        wrappedText.forEach((line, i) => {
          page.drawText(line, {
            x: rightColX,
            y: currentY - i * lineHeight,
            size: 12,
            font: helveticaFont,
          });
        });
      } else {
        page.drawText(locationText, {
          x: rightColX,
          y: currentY,
          size: 12,
          font: helveticaFont,
        });
      }
    }
    currentY -= lineHeight;

    // Second row - seniority and job title
    if (
      metadata.seniorityLevel &&
      metadata.seniorityLevel !== "Not specified"
    ) {
      page.drawText(`Level: ${metadata.seniorityLevel}`, {
        x: leftColX,
        y: currentY,
        size: 12,
        font: helveticaFont,
      });
    }

    if (metadata.jobTitle && metadata.jobTitle !== metadata.candidateName) {
      const jobText = `Role: ${metadata.jobTitle}`;
      // Check if text needs wrapping
      if (helveticaFont.widthOfTextAtSize(jobText, 12) > colWidth) {
        const wrappedText = wrapText(jobText, colWidth, helveticaFont, 12);
        wrappedText.forEach((line, i) => {
          page.drawText(line, {
            x: rightColX,
            y: currentY - i * lineHeight,
            size: 12,
            font: helveticaFont,
          });
        });
        // If job title wraps to multiple lines, adjust current Y position
        if (wrappedText.length > 1) {
          currentY -= (wrappedText.length - 1) * lineHeight;
        }
      } else {
        page.drawText(jobText, {
          x: rightColX,
          y: currentY,
          size: 12,
          font: helveticaFont,
        });
      }
    }
    currentY -= lineHeight + 5;

    // Industries
    if (metadata.industries && metadata.industries.length > 0) {
      const industriesText = `Industries: ${
        Array.isArray(metadata.industries)
          ? metadata.industries.join(", ")
          : metadata.industries
      }`;
      // Check if text needs wrapping
      if (helveticaFont.widthOfTextAtSize(industriesText, 12) > contentWidth) {
        const wrappedText = wrapText(
          industriesText,
          contentWidth,
          helveticaFont,
          12
        );
        wrappedText.forEach((line, i) => {
          page.drawText(line, {
            x: margin,
            y: currentY - i * lineHeight,
            size: 12,
            font: helveticaFont,
          });
        });
        // Adjust current Y based on number of wrapped lines
        currentY -= (wrappedText.length - 1) * lineHeight;
      } else {
        page.drawText(industriesText, {
          x: margin,
          y: currentY,
          size: 12,
          font: helveticaFont,
        });
      }
      currentY -= lineHeight;
    }

    // Skills
    if (metadata.topSkills && metadata.topSkills.length > 0) {
      const skillsText = `Key Skills: ${metadata.topSkills.join(", ")}`;
      // Check if text needs wrapping
      if (helveticaFont.widthOfTextAtSize(skillsText, 12) > contentWidth) {
        const wrappedText = wrapText(
          skillsText,
          contentWidth,
          helveticaFont,
          12
        );
        wrappedText.forEach((line, i) => {
          page.drawText(line, {
            x: margin,
            y: currentY - i * lineHeight,
            size: 12,
            font: helveticaFont,
          });
        });
        // Adjust current Y based on number of wrapped lines
        currentY -= (wrappedText.length - 1) * lineHeight;
      } else {
        page.drawText(skillsText, {
          x: margin,
          y: currentY,
          size: 12,
          font: helveticaFont,
        });
      }
      currentY -= lineHeight;
    }

    // Source file
    if (metadata.originalFileName) {
      page.drawText(`Source: ${metadata.originalFileName}`, {
        x: margin,
        y: currentY,
        size: 10,
        font: helveticaFont,
        color: lightGrayColor,
      });
      currentY -= lineHeight;
    }

    // Add a line separator
    currentY -= 5;
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: width - margin, y: currentY },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    currentY -= lineHeight;

    // Process summary text
    const lines = summaryText.split("\n");

    for (let line of lines) {
      // Check if we need a new page
      if (currentY < margin) {
        page = pdfDoc.addPage([595, 842]);
        currentY = height - 50;
      }

      if (line.startsWith("**") && line.includes(":**")) {
        // Section header
        currentY -= lineHeight / 2;
        const cleanHeader = line.replace(/\*\*/g, "");
        page.drawText(cleanHeader, {
          x: margin,
          y: currentY,
          size: 14,
          font: helveticaBold,
          color: headerColor,
        });
        currentY -= lineHeight + 2;
      } else if (line.startsWith("* ")) {
        // Bullet point
        const bulletText = line.substring(2);
        page.drawText("•", {
          x: margin,
          y: currentY,
          size: 12,
          font: helveticaFont,
          color: textColor,
        });

        // Check if text needs wrapping
        const bulletIndent = 15;
        const bulletMaxWidth = contentWidth - bulletIndent;

        if (helveticaFont.widthOfTextAtSize(bulletText, 12) > bulletMaxWidth) {
          const wrappedText = wrapText(
            bulletText,
            bulletMaxWidth,
            helveticaFont,
            12
          );
          wrappedText.forEach((wrappedLine, i) => {
            page.drawText(wrappedLine, {
              x: margin + bulletIndent,
              y: currentY - i * lineHeight,
              size: 12,
              font: helveticaFont,
              color: textColor,
            });
          });
          // Adjust current Y based on number of wrapped lines
          currentY -= wrappedText.length * lineHeight;
        } else {
          page.drawText(bulletText, {
            x: margin + bulletIndent,
            y: currentY,
            size: 12,
            font: helveticaFont,
            color: textColor,
          });
          currentY -= lineHeight;
        }
      } else if (line.trim() === "") {
        // Empty line
        currentY -= lineHeight / 2;
      } else {
        // Regular text - check if it needs wrapping
        if (helveticaFont.widthOfTextAtSize(line, 12) > contentWidth) {
          const wrappedText = wrapText(line, contentWidth, helveticaFont, 12);
          wrappedText.forEach((wrappedLine, i) => {
            page.drawText(wrappedLine, {
              x: margin,
              y: currentY - i * lineHeight,
              size: 12,
              font: helveticaFont,
              color: textColor,
            });
          });
          // Adjust current Y based on number of wrapped lines
          currentY -= wrappedText.length * lineHeight;
        } else {
          page.drawText(line, {
            x: margin,
            y: currentY,
            size: 12,
            font: helveticaFont,
            color: textColor,
          });
          currentY -= lineHeight;
        }
      }
    }

    // Add footer with page number and creation date
    const footerText = `Page 1 - Generated on ${new Date().toLocaleDateString()}`;
    const footerWidth = helveticaFont.widthOfTextAtSize(footerText, 10);
    page.drawText(footerText, {
      x: (width - footerWidth) / 2,
      y: 30,
      size: 10,
      font: helveticaFont,
      color: lightGrayColor,
    });

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Set response headers for PDF display
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileName.replace(".txt", ".pdf")}"`
    );
    res.setHeader("Content-Length", pdfBytes.length);

    // Send the PDF
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      message: "Error generating PDF",
      error: error.message,
    });
  }
}
