// import { promises as fs } from "fs";
// import path from "path";
// import { PDFDocument, rgb } from "pdf-lib";

// import {
//   extractCandidateNameFromSummary,
//   generateUniquePdfFilename,
// } from "../utils/pdfUtils";

// // Make sure uploads directory exists
// const ensureUploadsDirectory = async () => {
//   const uploadsDir = path.join(process.cwd(), "public", "uploads", "summaries");
//   try {
//     await fs.access(uploadsDir);
//   } catch (error) {
//     await fs.mkdir(uploadsDir, { recursive: true });
//   }
//   return uploadsDir;
// };

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const { summaryText, originalFileName } = req.body;

//     if (!summaryText) {
//       return res.status(400).json({ message: "Summary text is required" });
//     }

//     // Extract candidate name if possible
//     const candidateName = extractCandidateNameFromSummary(summaryText);

//     // Generate unique filename
//     const fileName = generateUniquePdfFilename(candidateName);

//     // Ensure directory exists
//     const uploadsDir = await ensureUploadsDirectory();
//     const filePath = path.join(uploadsDir, fileName);

//     // Create PDF document
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([595, 842]); // A4 size

//     // Set font size and add title
//     const { width, height } = page.getSize();
//     page.drawText("Resume Summary", {
//       x: width / 2 - 60,
//       y: height - 50,
//       size: 18,
//     });

//     if (candidateName) {
//       page.drawText(`Candidate: ${candidateName}`, {
//         x: width / 2 - 100,
//         y: height - 80,
//         size: 14,
//       });
//     }

//     if (originalFileName) {
//       page.drawText(`Source: ${originalFileName}`, {
//         x: width / 2 - 100,
//         y: height - 100,
//         size: 10,
//       });
//     }

//     // Process summary text
//     const margin = 50;
//     let currentY = height - 130;
//     const lineHeight = 15;

//     // Split text into lines
//     const lines = summaryText.split("\n");

//     for (let line of lines) {
//       // Check if we need a new page
//       if (currentY < margin) {
//         const newPage = pdfDoc.addPage([595, 842]);
//         currentY = height - 50;
//       }

//       if (line.startsWith("**") && line.includes(":**")) {
//         // Section header
//         currentY -= lineHeight + 5;
//         const cleanHeader = line.replace(/\*\*/g, "");
//         page.drawText(cleanHeader, {
//           x: margin,
//           y: currentY,
//           size: 12,
//           color: rgb(0, 0, 0.7),
//         });
//         currentY -= lineHeight;
//       } else if (line.startsWith("* ")) {
//         // Bullet point
//         const bulletText = line.substring(2);
//         page.drawText("•", {
//           x: margin,
//           y: currentY,
//           size: 12,
//         });

//         page.drawText(bulletText, {
//           x: margin + 15,
//           y: currentY,
//           size: 12,
//         });

//         currentY -= lineHeight;
//       } else if (line.trim() === "") {
//         // Empty line
//         currentY -= lineHeight / 2;
//       } else {
//         // Regular text
//         page.drawText(line, {
//           x: margin,
//           y: currentY,
//           size: 12,
//         });
//         currentY -= lineHeight;
//       }
//     }

//     // Save PDF to file
//     const pdfBytes = await pdfDoc.save();
//     await fs.writeFile(filePath, pdfBytes);

//     // Return success with file information
//     return res.status(200).json({
//       message: "Summary saved successfully",
//       fileName,
//       filePath: `/uploads/summaries/${fileName}`,
//       candidateName: candidateName || null,
//     });
//   } catch (error) {
//     console.error("Error saving summary PDF:", error);
//     return res
//       .status(500)
//       .json({ message: "Error saving summary", error: error.message });
//   }
// }
// pages/api/saveSummary-alt.js
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import {
  extractResumeMetadata,
  formatMetadata,
} from "../utils/resumeMetadataExtractor";

// Ensure uploads directory exists
const ensureUploadsDirectory = async () => {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "summaries");
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// Ensure metadata directory exists
const ensureMetadataDirectory = async () => {
  const metadataDir = path.join(process.cwd(), "public", "uploads", "metadata");
  try {
    await fs.access(metadataDir);
  } catch {
    await fs.mkdir(metadataDir, { recursive: true });
  }
  return metadataDir;
};

// Extract candidate name from summary text
const extractCandidateName = (text) => {
  const nameMatch = text.match(
    /^(?:\*\*)?([A-Z][a-z]+(?: [A-Z][a-z]+)+)(?:\*\*)?:/
  );
  return nameMatch?.[1] || "";
};

// Generate a safe, unique file name
const generateFileName = (candidateName = "") => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const uuid = uuidv4().substring(0, 8);
  const sanitizedName =
    candidateName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30) || "candidate";
  return `${sanitizedName}_summary_${timestamp}_${uuid}.txt`;
};

export default async function handler(req, res) {
  console.log("saveSummary-alt API route called", {
    method: req.method,
    url: req.url,
    hasBody: !!req.body,
  });

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { summaryText, originalFileName } = req.body;
    console.log("Request body received:", {
      hasSummaryText: !!summaryText,
      originalFileName,
    });

    if (!summaryText) {
      return res.status(400).json({ message: "Summary text is required" });
    }

    const candidateName = extractCandidateName(summaryText);
    const metadata = extractResumeMetadata(summaryText);
    const formattedMetadata = formatMetadata(metadata);

    const fileName = generateFileName(candidateName);
    formattedMetadata.pdfFileName = fileName;
    formattedMetadata.originalFileName = originalFileName || "";
    formattedMetadata.createdAt = new Date().toISOString();
    formattedMetadata.updatedAt = new Date().toISOString();

    const uploadsDir = await ensureUploadsDirectory();
    const metadataDir = await ensureMetadataDirectory();
    const filePath = path.join(uploadsDir, fileName);
    const metadataPath = path.join(
      metadataDir,
      fileName.replace(".txt", ".json")
    );

    await fs.writeFile(filePath, summaryText, "utf8");
    await fs.writeFile(
      metadataPath,
      JSON.stringify(formattedMetadata, null, 2)
    );

    const indexPath = path.join(metadataDir, "index.json");
    let index = [];

    try {
      const existingIndex = await fs.readFile(indexPath, "utf8");
      index = JSON.parse(existingIndex);
    } catch {
      console.log("Creating new metadata index");
    }

    const indexEntry = {
      id: formattedMetadata.pdfFileName,
      candidateName: formattedMetadata.candidateName,
      jobTitle: formattedMetadata.jobTitle,
      yearsOfExperience: formattedMetadata.yearsOfExperience,
      seniorityLevel: formattedMetadata.seniorityLevel,
      location: formattedMetadata.location,
      industries: formattedMetadata.industries,
      topSkills: formattedMetadata.topSkills.slice(0, 3),
      educationLevel: formattedMetadata.educationLevel,
      createdAt: formattedMetadata.createdAt,
      filePath: `/uploads/summaries/${fileName}`,
    };

    index = index.filter((entry) => entry.id !== indexEntry.id);
    index.push(indexEntry);
    index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));

    return res.status(200).json({
      message: "Summary saved successfully",
      fileName,
      filePath: `/uploads/summaries/${fileName}`,
      candidateName: candidateName || null,
      metadata: formattedMetadata,
    });
  } catch (error) {
    console.error("Error saving summary:", error);
    return res
      .status(500)
      .json({ message: "Error saving summary", error: error.message });
  }
}
