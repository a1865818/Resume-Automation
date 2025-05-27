import { promises as fs } from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Helper function to wrap text at specified width
function wrapText(text, maxWidth, font, fontSize) {
  if (!text) return [];

  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

// Helper function to create PDF from structured resume data
async function createPdfFromResumeData(resumeData, pdfDoc) {
  try {
    // Use standard fonts to avoid compatibility issues
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();

    const margin = 50;
    const contentWidth = width - margin * 2;
    let currentY = height - 50;
    const lineHeight = 14;

    // Colors - use simple rgb values to avoid compatibility issues
    const headerColor = rgb(0.1, 0.1, 0.7);
    const sectionColor = rgb(0.2, 0.2, 0.6);
    const textColor = rgb(0, 0, 0);
    const lightGrayColor = rgb(0.5, 0.5, 0.5);

    // Draw header section with simple background
    page.drawRectangle({
      x: margin,
      y: currentY - 80,
      width: contentWidth,
      height: 80,
      color: rgb(0.95, 0.95, 1),
    });

    // Candidate name
    page.drawText(resumeData.candidateName || "Unnamed Candidate", {
      x: margin + 20,
      y: currentY - 30,
      size: 24,
      font: helveticaBold,
      color: headerColor,
    });

    // Job title
    if (resumeData.jobTitle) {
      page.drawText(resumeData.jobTitle, {
        x: margin + 20,
        y: currentY - 50,
        size: 16,
        font: helveticaFont,
        color: sectionColor,
      });
    }

    // Contact info
    let contactY = currentY - 70;
    const contactInfo = [];
    if (resumeData.location)
      contactInfo.push(`Location: ${resumeData.location}`);
    if (resumeData.email) contactInfo.push(`Email: ${resumeData.email}`);
    if (resumeData.phone) contactInfo.push(`Phone: ${resumeData.phone}`);

    if (contactInfo.length > 0) {
      page.drawText(contactInfo.join(" | "), {
        x: margin + 20,
        y: contactY,
        size: 10,
        font: helveticaFont,
        color: lightGrayColor,
      });
    }

    currentY -= 100;

    // Professional Summary
    if (resumeData.summary) {
      page.drawText("Professional Summary", {
        x: margin,
        y: currentY,
        size: 16,
        font: helveticaBold,
        color: sectionColor,
      });
      currentY -= 20;

      const summaryLines = wrapText(
        resumeData.summary,
        contentWidth,
        helveticaFont,
        12
      );

      for (const line of summaryLines) {
        if (currentY < margin) {
          // Create a new page if we've reached the bottom margin
          const newPage = pdfDoc.addPage([595, 842]);
          currentY = height - 50;
        }

        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 12,
          font: helveticaFont,
          color: textColor,
        });
        currentY -= lineHeight;
      }
      currentY -= 10;
    }

    // Skills section
    if (
      resumeData.topSkills &&
      Array.isArray(resumeData.topSkills) &&
      resumeData.topSkills.length > 0
    ) {
      if (currentY < margin + 60) {
        // Create a new page if we don't have enough room
        const newPage = pdfDoc.addPage([595, 842]);
        currentY = height - 50;
      }

      page.drawText("Key Skills", {
        x: margin,
        y: currentY,
        size: 16,
        font: helveticaBold,
        color: sectionColor,
      });
      currentY -= 20;

      const skillsText = resumeData.topSkills.join(" • ");
      const skillsLines = wrapText(skillsText, contentWidth, helveticaFont, 12);

      for (const line of skillsLines) {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 12,
          font: helveticaFont,
          color: textColor,
        });
        currentY -= lineHeight;
      }
      currentY -= 10;
    }

    // Work Experience
    if (
      resumeData.workExperience &&
      Array.isArray(resumeData.workExperience) &&
      resumeData.workExperience.length > 0
    ) {
      if (currentY < margin + 100) {
        // Create a new page if we don't have enough room
        const newPage = pdfDoc.addPage([595, 842]);
        currentY = height - 50;
      }

      page.drawText("Work Experience", {
        x: margin,
        y: currentY,
        size: 16,
        font: helveticaBold,
        color: sectionColor,
      });
      currentY -= 20;

      for (const job of resumeData.workExperience) {
        if (currentY < margin + 100) {
          // Create a new page if we don't have enough room
          const newPage = pdfDoc.addPage([595, 842]);
          currentY = height - 50;
        }

        // Job title
        page.drawText(job.jobTitle || "Position", {
          x: margin,
          y: currentY,
          size: 14,
          font: helveticaBold,
          color: textColor,
        });
        currentY -= 16;

        // Company and duration
        const companyText = `${job.company || "Company"}${
          job.duration ? ` | ${job.duration}` : ""
        }`;
        page.drawText(companyText, {
          x: margin,
          y: currentY,
          size: 12,
          font: helveticaFont,
          color: sectionColor,
        });
        currentY -= 16;

        // Job description
        if (job.description) {
          const descLines = wrapText(
            job.description,
            contentWidth - 20,
            helveticaFont,
            11
          );

          for (const line of descLines) {
            if (currentY < margin) {
              // Create a new page if we've reached the bottom margin
              const newPage = pdfDoc.addPage([595, 842]);
              currentY = height - 50;
            }

            page.drawText(line, {
              x: margin + 20,
              y: currentY,
              size: 11,
              font: helveticaFont,
              color: textColor,
            });
            currentY -= 14;
          }
        }
        currentY -= 10;
      }
    }

    // Education
    if (
      resumeData.educationDetails &&
      Array.isArray(resumeData.educationDetails) &&
      resumeData.educationDetails.length > 0
    ) {
      if (currentY < margin + 100) {
        // Create a new page if we don't have enough room
        const newPage = pdfDoc.addPage([595, 842]);
        currentY = height - 50;
      }

      page.drawText("Education", {
        x: margin,
        y: currentY,
        size: 16,
        font: helveticaBold,
        color: sectionColor,
      });
      currentY -= 20;

      for (const edu of resumeData.educationDetails) {
        if (currentY < margin + 60) {
          // Create a new page if we don't have enough room
          const newPage = pdfDoc.addPage([595, 842]);
          currentY = height - 50;
        }

        // Degree
        page.drawText(edu.degree || "Degree", {
          x: margin,
          y: currentY,
          size: 12,
          font: helveticaBold,
          color: textColor,
        });
        currentY -= 14;

        // Institution and graduation year
        let eduInfo = edu.institution || "Institution";
        if (edu.graduationYear && edu.graduationYear !== "N/A") {
          eduInfo += ` (${edu.graduationYear})`;
        }

        page.drawText(eduInfo, {
          x: margin,
          y: currentY,
          size: 11,
          font: helveticaFont,
          color: sectionColor,
        });
        currentY -= 16;
      }
    }

    // Key Achievements
    if (
      resumeData.keyAchievements &&
      Array.isArray(resumeData.keyAchievements) &&
      resumeData.keyAchievements.length > 0
    ) {
      if (currentY < margin + 100) {
        // Create a new page if we don't have enough room
        const newPage = pdfDoc.addPage([595, 842]);
        currentY = height - 50;
      }

      page.drawText("Key Achievements", {
        x: margin,
        y: currentY,
        size: 16,
        font: helveticaBold,
        color: sectionColor,
      });
      currentY -= 20;

      for (const achievement of resumeData.keyAchievements) {
        if (currentY < margin + 40) {
          // Create a new page if we don't have enough room
          const newPage = pdfDoc.addPage([595, 842]);
          currentY = height - 50;
        }

        page.drawText("•", {
          x: margin,
          y: currentY,
          size: 12,
          font: helveticaFont,
          color: textColor,
        });

        const achievementLines = wrapText(
          achievement,
          contentWidth - 20,
          helveticaFont,
          11
        );

        for (let i = 0; i < achievementLines.length; i++) {
          if (currentY - i * 14 < margin) {
            // Create a new page if we've reached the bottom margin
            const newPage = pdfDoc.addPage([595, 842]);
            currentY = height - 50;
            i = 0; // Reset the counter
          }

          page.drawText(achievementLines[i], {
            x: margin + 15,
            y: currentY - i * 14,
            size: 11,
            font: helveticaFont,
            color: textColor,
          });
        }
        currentY -= achievementLines.length * 14 + 5;
      }
    }

    return pdfDoc;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fileName } = req.query;
  if (!fileName) {
    return res.status(400).json({ message: "fileName parameter is required" });
  }

  try {
    console.log(`Generating PDF for file: ${fileName}`);
    const summariesDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "summaries"
    );

    // Try to load structured JSON data first
    const jsonFileName = fileName.replace(".txt", ".json");
    const jsonFilePath = path.join(summariesDir, jsonFileName);
    const txtFilePath = path.join(summariesDir, fileName);

    let resumeData = null;
    let summaryText = "";

    // Try to read JSON file first (new format)
    try {
      await fs.access(jsonFilePath);
      console.log(`JSON file found: ${jsonFilePath}`);
      const jsonContent = await fs.readFile(jsonFilePath, "utf8");
      resumeData = JSON.parse(jsonContent);
    } catch (error) {
      console.log(`JSON file not found (${jsonFilePath}), trying text file`);
    }

    // If no JSON file, try text file (legacy format)
    if (!resumeData) {
      try {
        await fs.access(txtFilePath);
        console.log(`Text file found: ${txtFilePath}`);
        summaryText = await fs.readFile(txtFilePath, "utf8");

        // Extract basic info from text for legacy support
        const nameMatch = summaryText.match(/\*\*([^*]+)\*\*/);
        resumeData = {
          candidateName: nameMatch ? nameMatch[1] : "Unknown Candidate",
          jobTitle: "",
          summary: summaryText,
          workExperience: [],
          educationDetails: [],
          topSkills: [],
          keyAchievements: [],
          location: "",
          email: "",
          phone: "",
        };
      } catch (error) {
        console.error(`Text file not found: ${txtFilePath}`);
        return res.status(404).json({ message: "Resume file not found" });
      }
    }

    // Create PDF document
    const pdfDoc = await PDFDocument.create();

    // Generate PDF with proper error handling
    try {
      await createPdfFromResumeData(resumeData, pdfDoc);
    } catch (error) {
      console.error("Error in PDF generation:", error);

      // Create a simple fallback PDF if advanced generation fails
      const page = pdfDoc.addPage();
      const { height } = page.getSize();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText("Resume Summary", {
        x: 50,
        y: height - 50,
        font: helvetica,
        size: 24,
      });

      page.drawText(resumeData.candidateName || "Unknown Candidate", {
        x: 50,
        y: height - 100,
        font: helvetica,
        size: 16,
      });

      if (summaryText) {
        const lines = summaryText.split("\n");
        let y = height - 150;

        for (let i = 0; i < Math.min(lines.length, 30); i++) {
          page.drawText(lines[i].substring(0, 80), {
            x: 50,
            y,
            font: helvetica,
            size: 10,
          });
          y -= 15;
        }
      }
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Set response headers for PDF display
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${resumeData.candidateName.replace(
        /\s+/g,
        "_"
      )}_Resume.pdf"`
    );
    res.setHeader("Content-Length", pdfBytes.length);

    // Send the PDF
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error in viewAsPdf handler:", error);
    res.status(500).json({
      message: "Error generating PDF",
      error: error.message,
    });
  }
}
