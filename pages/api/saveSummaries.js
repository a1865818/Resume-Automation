// // import { promises as fs } from "fs";
// // import path from "path";
// // import { PDFDocument, rgb } from "pdf-lib";

// // import {
// //   extractCandidateNameFromSummary,
// //   generateUniquePdfFilename,
// // } from "../utils/pdfUtils";

// // // Make sure uploads directory exists
// // const ensureUploadsDirectory = async () => {
// //   const uploadsDir = path.join(process.cwd(), "public", "uploads", "summaries");
// //   try {
// //     await fs.access(uploadsDir);
// //   } catch (error) {
// //     await fs.mkdir(uploadsDir, { recursive: true });
// //   }
// //   return uploadsDir;
// // };

// // export default async function handler(req, res) {
// //   if (req.method !== "POST") {
// //     return res.status(405).json({ message: "Method not allowed" });
// //   }

// //   try {
// //     const { summaryText, originalFileName } = req.body;

// //     if (!summaryText) {
// //       return res.status(400).json({ message: "Summary text is required" });
// //     }

// //     // Extract candidate name if possible
// //     const candidateName = extractCandidateNameFromSummary(summaryText);

// //     // Generate unique filename
// //     const fileName = generateUniquePdfFilename(candidateName);

// //     // Ensure directory exists
// //     const uploadsDir = await ensureUploadsDirectory();
// //     const filePath = path.join(uploadsDir, fileName);

// //     // Create PDF document
// //     const pdfDoc = await PDFDocument.create();
// //     const page = pdfDoc.addPage([595, 842]); // A4 size

// //     // Set font size and add title
// //     const { width, height } = page.getSize();
// //     page.drawText("Resume Summary", {
// //       x: width / 2 - 60,
// //       y: height - 50,
// //       size: 18,
// //     });

// //     if (candidateName) {
// //       page.drawText(`Candidate: ${candidateName}`, {
// //         x: width / 2 - 100,
// //         y: height - 80,
// //         size: 14,
// //       });
// //     }

// //     if (originalFileName) {
// //       page.drawText(`Source: ${originalFileName}`, {
// //         x: width / 2 - 100,
// //         y: height - 100,
// //         size: 10,
// //       });
// //     }

// //     // Process summary text
// //     const margin = 50;
// //     let currentY = height - 130;
// //     const lineHeight = 15;

// //     // Split text into lines
// //     const lines = summaryText.split("\n");

// //     for (let line of lines) {
// //       // Check if we need a new page
// //       if (currentY < margin) {
// //         const newPage = pdfDoc.addPage([595, 842]);
// //         currentY = height - 50;
// //       }

// //       if (line.startsWith("**") && line.includes(":**")) {
// //         // Section header
// //         currentY -= lineHeight + 5;
// //         const cleanHeader = line.replace(/\*\*/g, "");
// //         page.drawText(cleanHeader, {
// //           x: margin,
// //           y: currentY,
// //           size: 12,
// //           color: rgb(0, 0, 0.7),
// //         });
// //         currentY -= lineHeight;
// //       } else if (line.startsWith("* ")) {
// //         // Bullet point
// //         const bulletText = line.substring(2);
// //         page.drawText("•", {
// //           x: margin,
// //           y: currentY,
// //           size: 12,
// //         });

// //         page.drawText(bulletText, {
// //           x: margin + 15,
// //           y: currentY,
// //           size: 12,
// //         });

// //         currentY -= lineHeight;
// //       } else if (line.trim() === "") {
// //         // Empty line
// //         currentY -= lineHeight / 2;
// //       } else {
// //         // Regular text
// //         page.drawText(line, {
// //           x: margin,
// //           y: currentY,
// //           size: 12,
// //         });
// //         currentY -= lineHeight;
// //       }
// //     }

// //     // Save PDF to file
// //     const pdfBytes = await pdfDoc.save();
// //     await fs.writeFile(filePath, pdfBytes);

// //     // Return success with file information
// //     return res.status(200).json({
// //       message: "Summary saved successfully",
// //       fileName,
// //       filePath: `/uploads/summaries/${fileName}`,
// //       candidateName: candidateName || null,
// //     });
// //   } catch (error) {
// //     console.error("Error saving summary PDF:", error);
// //     return res
// //       .status(500)
// //       .json({ message: "Error saving summary", error: error.message });
// //   }
// // }
// // pages/api/saveSummary-alt.js
// import { promises as fs } from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";

// import {
//   extractResumeMetadata,
//   formatMetadata,
// } from "../utils/resumeMetadataExtractor";

// // Ensure uploads directory exists
// const ensureUploadsDirectory = async () => {
//   const uploadsDir = path.join(process.cwd(), "public", "uploads", "summaries");
//   try {
//     await fs.access(uploadsDir);
//   } catch {
//     await fs.mkdir(uploadsDir, { recursive: true });
//   }
//   return uploadsDir;
// };

// // Ensure metadata directory exists
// const ensureMetadataDirectory = async () => {
//   const metadataDir = path.join(process.cwd(), "public", "uploads", "metadata");
//   try {
//     await fs.access(metadataDir);
//   } catch {
//     await fs.mkdir(metadataDir, { recursive: true });
//   }
//   return metadataDir;
// };

// // Extract candidate name from summary text
// const extractCandidateName = (text) => {
//   const nameMatch = text.match(
//     /^(?:\*\*)?([A-Z][a-z]+(?: [A-Z][a-z]+)+)(?:\*\*)?:/
//   );
//   return nameMatch?.[1] || "";
// };

// // Generate a safe, unique file name
// const generateFileName = (candidateName = "") => {
//   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//   const uuid = uuidv4().substring(0, 8);
//   const sanitizedName =
//     candidateName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30) || "candidate";
//   return `${sanitizedName}_summary_${timestamp}_${uuid}.txt`;
// };

// export default async function handler(req, res) {
//   console.log("saveSummary-alt API route called", {
//     method: req.method,
//     url: req.url,
//     hasBody: !!req.body,
//   });

//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const { summaryText, originalFileName } = req.body;
//     console.log("Request body received:", {
//       hasSummaryText: !!summaryText,
//       originalFileName,
//     });

//     if (!summaryText) {
//       return res.status(400).json({ message: "Summary text is required" });
//     }

//     const candidateName = extractCandidateName(summaryText);
//     const metadata = extractResumeMetadata(summaryText);
//     const formattedMetadata = formatMetadata(metadata);

//     const fileName = generateFileName(candidateName);
//     formattedMetadata.pdfFileName = fileName;
//     formattedMetadata.originalFileName = originalFileName || "";
//     formattedMetadata.createdAt = new Date().toISOString();
//     formattedMetadata.updatedAt = new Date().toISOString();

//     const uploadsDir = await ensureUploadsDirectory();
//     const metadataDir = await ensureMetadataDirectory();
//     const filePath = path.join(uploadsDir, fileName);
//     const metadataPath = path.join(
//       metadataDir,
//       fileName.replace(".txt", ".json")
//     );

//     await fs.writeFile(filePath, summaryText, "utf8");
//     await fs.writeFile(
//       metadataPath,
//       JSON.stringify(formattedMetadata, null, 2)
//     );

//     const indexPath = path.join(metadataDir, "index.json");
//     let index = [];

//     try {
//       const existingIndex = await fs.readFile(indexPath, "utf8");
//       index = JSON.parse(existingIndex);
//     } catch {
//       console.log("Creating new metadata index");
//     }

//     const indexEntry = {
//       id: formattedMetadata.pdfFileName,
//       candidateName: formattedMetadata.candidateName,
//       jobTitle: formattedMetadata.jobTitle,
//       yearsOfExperience: formattedMetadata.yearsOfExperience,
//       seniorityLevel: formattedMetadata.seniorityLevel,
//       location: formattedMetadata.location,
//       industries: formattedMetadata.industries,
//       topSkills: formattedMetadata.topSkills.slice(0, 3),
//       educationLevel: formattedMetadata.educationLevel,
//       createdAt: formattedMetadata.createdAt,
//       filePath: `/uploads/summaries/${fileName}`,
//     };

//     index = index.filter((entry) => entry.id !== indexEntry.id);
//     index.push(indexEntry);
//     index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     await fs.writeFile(indexPath, JSON.stringify(index, null, 2));

//     return res.status(200).json({
//       message: "Summary saved successfully",
//       fileName,
//       filePath: `/uploads/summaries/${fileName}`,
//       candidateName: candidateName || null,
//       metadata: formattedMetadata,
//     });
//   } catch (error) {
//     console.error("Error saving summary:", error);
//     return res
//       .status(500)
//       .json({ message: "Error saving summary", error: error.message });
//   }
// }

// import { promises as fs } from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";

// // Ensure uploads directory exists
// const ensureUploadsDirectory = async () => {
//   const uploadsDir = path.join(process.cwd(), "public", "uploads", "summaries");
//   try {
//     await fs.access(uploadsDir);
//   } catch {
//     await fs.mkdir(uploadsDir, { recursive: true });
//   }
//   return uploadsDir;
// };

// // Ensure metadata directory exists
// const ensureMetadataDirectory = async () => {
//   const metadataDir = path.join(process.cwd(), "public", "uploads", "metadata");
//   try {
//     await fs.access(metadataDir);
//   } catch {
//     await fs.mkdir(metadataDir, { recursive: true });
//   }
//   return metadataDir;
// };

// // Generate a safe, unique file name
// const generateFileName = (candidateName = "") => {
//   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//   const uuid = uuidv4().substring(0, 8);
//   const sanitizedName =
//     candidateName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30) || "candidate";
//   return `${sanitizedName}_resume_${timestamp}_${uuid}.json`;
// };

// // Convert resume data to text format for backward compatibility
// const convertResumeDataToText = (resumeData) => {
//   let text = `**${resumeData.candidateName}**\n\n`;

//   if (resumeData.summary) {
//     text += `${resumeData.summary}\n\n`;
//   }

//   text += `**Job Title:** ${resumeData.jobTitle || "Not specified"}\n`;
//   text += `**Experience:** ${resumeData.yearsOfExperience} years\n`;
//   text += `**Location:** ${resumeData.location || "Not specified"}\n`;
//   text += `**Seniority Level:** ${
//     resumeData.seniorityLevel || "Not specified"
//   }\n\n`;

//   if (resumeData.industries && resumeData.industries.length > 0) {
//     text += `**Industries:**\n${resumeData.industries
//       .map((industry) => `* ${industry}`)
//       .join("\n")}\n\n`;
//   }

//   if (resumeData.topSkills && resumeData.topSkills.length > 0) {
//     text += `**Key Skills:**\n${resumeData.topSkills
//       .map((skill) => `* ${skill}`)
//       .join("\n")}\n\n`;
//   }

//   if (resumeData.workExperience && resumeData.workExperience.length > 0) {
//     text += `**Work Experience:**\n`;
//     resumeData.workExperience.forEach((job) => {
//       text += `* **${job.jobTitle}** at ${job.company} (${job.duration})\n`;
//       if (job.description) {
//         text += `  ${job.description}\n`;
//       }
//     });
//     text += "\n";
//   }

//   if (resumeData.educationDetails && resumeData.educationDetails.length > 0) {
//     text += `**Education:**\n`;
//     resumeData.educationDetails.forEach((edu) => {
//       text += `* ${edu.degree} - ${edu.institution}`;
//       if (edu.graduationYear && edu.graduationYear !== "N/A") {
//         text += ` (${edu.graduationYear})`;
//       }
//       text += "\n";
//     });
//     text += "\n";
//   }

//   if (resumeData.keyAchievements && resumeData.keyAchievements.length > 0) {
//     text += `**Key Achievements:**\n${resumeData.keyAchievements
//       .map((achievement) => `* ${achievement}`)
//       .join("\n")}\n\n`;
//   }

//   if (resumeData.certifications && resumeData.certifications.length > 0) {
//     text += `**Certifications:**\n${resumeData.certifications
//       .map((cert) => `* ${cert}`)
//       .join("\n")}\n\n`;
//   }

//   return text;
// };

// export default async function handler(req, res) {
//   console.log("saveSummaries API route called", {
//     method: req.method,
//     url: req.url,
//     hasBody: !!req.body,
//   });

//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const { resumeData, summaryText, originalFileName } = req.body;
//     console.log("Request body received:", {
//       hasResumeData: !!resumeData,
//       hasSummaryText: !!summaryText,
//       originalFileName,
//     });

//     // Handle both new resume data format and legacy summary text format
//     let finalResumeData;
//     let finalSummaryText;

//     if (resumeData) {
//       // New workflow: structured resume data
//       finalResumeData = resumeData;
//       finalSummaryText = convertResumeDataToText(resumeData);
//     } else if (summaryText) {
//       // Legacy workflow: extract metadata from summary text
//       const { extractResumeMetadata, formatMetadata } = await import(
//         "../utils/resumeMetadataExtractor"
//       );
//       const metadata = extractResumeMetadata(summaryText);
//       finalResumeData = formatMetadata(metadata);
//       finalSummaryText = summaryText;
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Resume data or summary text is required" });
//     }

//     const candidateName = finalResumeData.candidateName || "Unknown Candidate";
//     const fileName = generateFileName(candidateName);

//     // Ensure resume data has required fields
//     const completeResumeData = {
//       ...finalResumeData,
//       pdfFileName: fileName,
//       originalFileName: originalFileName || "",
//       createdAt: finalResumeData.createdAt || new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     const uploadsDir = await ensureUploadsDirectory();
//     const metadataDir = await ensureMetadataDirectory();

//     // Save both JSON (structured data) and TXT (formatted text) files
//     const jsonFilePath = path.join(uploadsDir, fileName);
//     const txtFileName = fileName.replace(".json", ".txt");
//     const txtFilePath = path.join(uploadsDir, txtFileName);
//     const metadataPath = path.join(metadataDir, fileName);

//     // Save structured JSON data
//     await fs.writeFile(
//       jsonFilePath,
//       JSON.stringify(completeResumeData, null, 2)
//     );

//     // Save formatted text version for backward compatibility
//     await fs.writeFile(txtFilePath, finalSummaryText, "utf8");

//     // Save metadata (duplicate for indexing)
//     await fs.writeFile(
//       metadataPath,
//       JSON.stringify(completeResumeData, null, 2)
//     );

//     // Update the metadata index
//     const indexPath = path.join(metadataDir, "index.json");
//     let index = [];

//     try {
//       const existingIndex = await fs.readFile(indexPath, "utf8");
//       index = JSON.parse(existingIndex);
//     } catch {
//       console.log("Creating new metadata index");
//     }

//     const indexEntry = {
//       id: fileName,
//       fileName: fileName,
//       candidateName: completeResumeData.candidateName,
//       jobTitle: completeResumeData.jobTitle,
//       yearsOfExperience: completeResumeData.yearsOfExperience || 0,
//       seniorityLevel: completeResumeData.seniorityLevel,
//       location: completeResumeData.location,
//       industries: completeResumeData.industries || [],
//       topSkills: completeResumeData.topSkills
//         ? completeResumeData.topSkills.slice(0, 3)
//         : [],
//       educationLevel: completeResumeData.educationLevel,
//       createdAt: completeResumeData.createdAt,
//       filePath: `/uploads/summaries/${txtFileName}`, // Point to text file for backward compatibility
//       jsonFilePath: `/uploads/summaries/${fileName}`, // Also include JSON path
//     };

//     // Remove any existing entry with the same ID and add the new one
//     index = index.filter((entry) => entry.id !== indexEntry.id);
//     index.push(indexEntry);
//     index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     await fs.writeFile(indexPath, JSON.stringify(index, null, 2));

//     return res.status(200).json({
//       message: "Resume saved successfully",
//       fileName: txtFileName, // Return text filename for backward compatibility
//       jsonFileName: fileName, // Also return JSON filename
//       filePath: `/uploads/summaries/${txtFileName}`,
//       jsonFilePath: `/uploads/summaries/${fileName}`,
//       candidateName: candidateName,
//       resumeData: completeResumeData,
//     });
//   } catch (error) {
//     console.error("Error saving resume:", error);
//     return res
//       .status(500)
//       .json({ message: "Error saving resume", error: error.message });
//   }
// }

// pages/api/saveSummaries.js
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

// Generate a safe, unique file name
const generateFileName = (candidateName = "") => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const uuid = uuidv4().substring(0, 8);
  const sanitizedName =
    candidateName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30) || "candidate";
  return `${sanitizedName}_resume_${timestamp}_${uuid}.json`;
};

// Convert resume data to text format for backward compatibility
const convertResumeDataToText = (resumeData) => {
  let text = `**${resumeData.candidateName || "Unknown Candidate"}**\n\n`;

  if (resumeData.summary) {
    text += `${resumeData.summary}\n\n`;
  }

  text += `**Job Title:** ${resumeData.jobTitle || "Not specified"}\n`;
  text += `**Experience:** ${resumeData.yearsOfExperience || 0} years\n`;
  text += `**Location:** ${resumeData.location || "Not specified"}\n`;
  text += `**Seniority Level:** ${
    resumeData.seniorityLevel || "Not specified"
  }\n\n`;

  if (
    resumeData.industries &&
    Array.isArray(resumeData.industries) &&
    resumeData.industries.length > 0
  ) {
    text += `**Industries:**\n${resumeData.industries
      .map((industry) => `* ${industry}`)
      .join("\n")}\n\n`;
  }

  if (
    resumeData.topSkills &&
    Array.isArray(resumeData.topSkills) &&
    resumeData.topSkills.length > 0
  ) {
    text += `**Key Skills:**\n${resumeData.topSkills
      .map((skill) => `* ${skill}`)
      .join("\n")}\n\n`;
  }

  if (
    resumeData.workExperience &&
    Array.isArray(resumeData.workExperience) &&
    resumeData.workExperience.length > 0
  ) {
    text += `**Work Experience:**\n`;
    resumeData.workExperience.forEach((job) => {
      text += `* **${job.jobTitle || "Position"}** at ${
        job.company || "Company"
      } (${job.duration || "Duration not specified"})\n`;
      if (job.description) {
        text += `  ${job.description}\n`;
      }
    });
    text += "\n";
  }

  if (
    resumeData.educationDetails &&
    Array.isArray(resumeData.educationDetails) &&
    resumeData.educationDetails.length > 0
  ) {
    text += `**Education:**\n`;
    resumeData.educationDetails.forEach((edu) => {
      text += `* ${edu.degree || "Degree"} - ${
        edu.institution || "Institution"
      }`;
      if (edu.graduationYear && edu.graduationYear !== "N/A") {
        text += ` (${edu.graduationYear})`;
      }
      text += "\n";
    });
    text += "\n";
  }

  if (
    resumeData.keyAchievements &&
    Array.isArray(resumeData.keyAchievements) &&
    resumeData.keyAchievements.length > 0
  ) {
    text += `**Key Achievements:**\n${resumeData.keyAchievements
      .map((achievement) => `* ${achievement}`)
      .join("\n")}\n\n`;
  }

  if (
    resumeData.certifications &&
    Array.isArray(resumeData.certifications) &&
    resumeData.certifications.length > 0
  ) {
    text += `**Certifications:**\n${resumeData.certifications
      .map((cert) => `* ${cert}`)
      .join("\n")}\n\n`;
  }

  return text;
};

export default async function handler(req, res) {
  console.log("saveSummaries API route called", {
    method: req.method,
    url: req.url,
    hasBody: !!req.body,
  });

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let body;

    // Handle both JSON and string bodies
    if (typeof req.body === "string") {
      try {
        body = JSON.parse(req.body);
      } catch (parseError) {
        console.error("Failed to parse request body as JSON:", parseError);
        return res.status(400).json({
          message: "Invalid JSON in request body",
          error: parseError.message,
        });
      }
    } else {
      body = req.body;
    }

    const { resumeData, summaryText, originalFileName } = body;

    console.log("Request body parsed:", {
      hasResumeData: !!resumeData,
      hasSummaryText: !!summaryText,
      originalFileName,
      resumeDataType: typeof resumeData,
      resumeDataKeys: resumeData ? Object.keys(resumeData) : null,
    });

    // Handle both new resume data format and legacy summary text format
    let finalResumeData;
    let finalSummaryText;

    if (resumeData && typeof resumeData === "object") {
      // New workflow: structured resume data
      finalResumeData = resumeData;
      finalSummaryText = convertResumeDataToText(resumeData);
    } else if (summaryText && typeof summaryText === "string") {
      // Legacy workflow: extract metadata from summary text
      try {
        const { extractResumeMetadata, formatMetadata } = await import(
          "../utils/resumeMetadataExtractor"
        );
        const metadata = extractResumeMetadata(summaryText);
        finalResumeData = formatMetadata(metadata);
        finalSummaryText = summaryText;
      } catch (importError) {
        console.error("Failed to import metadata extractor:", importError);
        // Fallback to basic structure
        finalResumeData = {
          candidateName: "Unknown Candidate",
          jobTitle: "",
          yearsOfExperience: 0,
          location: "",
          industries: [],
          topSkills: [],
          educationLevel: "",
          seniorityLevel: "Not specified",
          summary: summaryText.substring(0, 200) + "...",
          workExperience: [],
          educationDetails: [],
          keyAchievements: [],
          certifications: [],
          languages: ["English"],
        };
        finalSummaryText = summaryText;
      }
    } else {
      return res.status(400).json({
        message: "Resume data or summary text is required",
        receivedData: {
          hasResumeData: !!resumeData,
          hasSummaryText: !!summaryText,
          resumeDataType: typeof resumeData,
          summaryTextType: typeof summaryText,
        },
      });
    }

    const candidateName = finalResumeData.candidateName || "Unknown Candidate";
    const fileName = generateFileName(candidateName);

    // Ensure resume data has required fields with safe defaults
    const completeResumeData = {
      candidateName: finalResumeData.candidateName || "Unknown Candidate",
      jobTitle: finalResumeData.jobTitle || "",
      yearsOfExperience: parseInt(finalResumeData.yearsOfExperience) || 0,
      location: finalResumeData.location || "",
      email: finalResumeData.email || "",
      phone: finalResumeData.phone || "",
      industries: Array.isArray(finalResumeData.industries)
        ? finalResumeData.industries
        : [],
      topSkills: Array.isArray(finalResumeData.topSkills)
        ? finalResumeData.topSkills
        : [],
      educationLevel: finalResumeData.educationLevel || "",
      educationDetails: Array.isArray(finalResumeData.educationDetails)
        ? finalResumeData.educationDetails
        : [],
      workExperience: Array.isArray(finalResumeData.workExperience)
        ? finalResumeData.workExperience
        : [],
      keyAchievements: Array.isArray(finalResumeData.keyAchievements)
        ? finalResumeData.keyAchievements
        : [],
      certifications: Array.isArray(finalResumeData.certifications)
        ? finalResumeData.certifications
        : [],
      languages: Array.isArray(finalResumeData.languages)
        ? finalResumeData.languages
        : ["English"],
      summary: finalResumeData.summary || "",
      seniorityLevel: finalResumeData.seniorityLevel || "Not specified",
      pdfFileName: fileName,
      originalFileName: originalFileName || "",
      createdAt: finalResumeData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const uploadsDir = await ensureUploadsDirectory();
    const metadataDir = await ensureMetadataDirectory();

    // Save both JSON (structured data) and TXT (formatted text) files
    const jsonFilePath = path.join(uploadsDir, fileName);
    const txtFileName = fileName.replace(".json", ".txt");
    const txtFilePath = path.join(uploadsDir, txtFileName);
    const metadataPath = path.join(metadataDir, fileName);

    // Save structured JSON data
    await fs.writeFile(
      jsonFilePath,
      JSON.stringify(completeResumeData, null, 2)
    );

    // Save formatted text version for backward compatibility
    await fs.writeFile(txtFilePath, finalSummaryText, "utf8");

    // Save metadata (duplicate for indexing)
    await fs.writeFile(
      metadataPath,
      JSON.stringify(completeResumeData, null, 2)
    );

    // Update the metadata index
    const indexPath = path.join(metadataDir, "index.json");
    let index = [];

    try {
      const existingIndex = await fs.readFile(indexPath, "utf8");
      index = JSON.parse(existingIndex);
    } catch {
      console.log("Creating new metadata index");
    }

    const indexEntry = {
      id: fileName,
      fileName: fileName,
      candidateName: completeResumeData.candidateName,
      jobTitle: completeResumeData.jobTitle,
      yearsOfExperience: completeResumeData.yearsOfExperience,
      seniorityLevel: completeResumeData.seniorityLevel,
      location: completeResumeData.location,
      industries: completeResumeData.industries,
      topSkills: completeResumeData.topSkills.slice(0, 3),
      educationLevel: completeResumeData.educationLevel,
      createdAt: completeResumeData.createdAt,
      filePath: `/uploads/summaries/${txtFileName}`, // Point to text file for backward compatibility
      jsonFilePath: `/uploads/summaries/${fileName}`, // Also include JSON path
    };

    // Remove any existing entry with the same ID and add the new one
    index = index.filter((entry) => entry.id !== indexEntry.id);
    index.push(indexEntry);
    index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));

    return res.status(200).json({
      message: "Resume saved successfully",
      fileName: txtFileName, // Return text filename for backward compatibility
      jsonFileName: fileName, // Also return JSON filename
      filePath: `/uploads/summaries/${txtFileName}`,
      jsonFilePath: `/uploads/summaries/${fileName}`,
      candidateName: candidateName,
      resumeData: completeResumeData,
    });
  } catch (error) {
    console.error("Error saving resume:", error);
    return res.status(500).json({
      message: "Error saving resume",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
