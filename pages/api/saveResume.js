// pages/api/saveResume.js
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Ensure resume templates directory exists
const ensureResumeTemplatesDirectory = async () => {
  const templatesDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "resume-templates"
  );
  try {
    await fs.access(templatesDir);
  } catch {
    await fs.mkdir(templatesDir, { recursive: true });
  }
  return templatesDir;
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

// Generate a safe, unique file name for resume templates
const generateTemplateFileName = (candidateName = "") => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const uuid = uuidv4().substring(0, 8);
  const sanitizedName =
    candidateName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30) || "candidate";
  return `${sanitizedName}_template_${timestamp}_${uuid}.json`;
};

export default async function handler(req, res) {
  console.log("saveResumeTemplate API route called", {
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

    const { resumeData, originalFileName } = body;

    console.log("Request body parsed:", {
      hasResumeData: !!resumeData,
      originalFileName,
      resumeDataType: typeof resumeData,
      resumeDataKeys: resumeData ? Object.keys(resumeData) : null,
    });

    if (!resumeData || typeof resumeData !== "object") {
      return res.status(400).json({
        message: "Resume template data is required",
        receivedData: {
          hasResumeData: !!resumeData,
          resumeDataType: typeof resumeData,
        },
      });
    }

    const candidateName =
      resumeData.profile?.name ||
      resumeData.candidateName ||
      "Unknown Candidate";
    const fileName = generateTemplateFileName(candidateName);

    // Prepare complete template data with all required fields
    const completeTemplateData = {
      // Core profile information for template
      profile: {
        name: resumeData.profile?.name || candidateName,
        title: resumeData.profile?.title || "PROFESSIONAL",
        location: resumeData.profile?.location || "",
        clearance: resumeData.profile?.clearance || "",
        photo: resumeData.profile?.photo || "/api/placeholder/400/600",
        description:
          resumeData.profile?.description ||
          "Professional with extensive experience in their field.",
        description2: resumeData.profile?.description2 || "",
      },

      // Resume template specific arrays
      qualifications: Array.isArray(resumeData.qualifications)
        ? resumeData.qualifications
        : [],
      affiliations: Array.isArray(resumeData.affiliations)
        ? resumeData.affiliations
        : [],
      skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
      keyAchievements: Array.isArray(resumeData.keyAchievements)
        ? resumeData.keyAchievements
        : [],
      experience: Array.isArray(resumeData.experience)
        ? resumeData.experience
        : [],
      fullExperience: Array.isArray(resumeData.fullExperience)
        ? resumeData.fullExperience
        : [],
      referees: Array.isArray(resumeData.referees) ? resumeData.referees : [],

      // Template metadata
      templateId: fileName,
      candidateName: candidateName,
      originalFileName: originalFileName || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemplate: true,
      type: "resume-template",
    };

    const templatesDir = await ensureResumeTemplatesDirectory();
    const metadataDir = await ensureMetadataDirectory();

    // Save template JSON file
    const templateFilePath = path.join(templatesDir, fileName);

    // Save structured template data
    await fs.writeFile(
      templateFilePath,
      JSON.stringify(completeTemplateData, null, 2)
    );

    // Update the templates index
    const indexPath = path.join(metadataDir, "resume-templates-index.json");
    let index = [];

    try {
      const existingIndex = await fs.readFile(indexPath, "utf8");
      index = JSON.parse(existingIndex);
    } catch {
      console.log("Creating new resume templates index");
    }

    const indexEntry = {
      id: fileName,
      templateId: fileName,
      candidateName: completeTemplateData.candidateName,
      profileTitle: completeTemplateData.profile.title,
      location: completeTemplateData.profile.location,
      clearance: completeTemplateData.profile.clearance,
      qualificationsCount: completeTemplateData.qualifications.length,
      skillsCount: completeTemplateData.skills.length,
      experienceCount: completeTemplateData.experience.length,
      achievementsCount: completeTemplateData.keyAchievements.length,
      refereesCount: completeTemplateData.referees.length,
      createdAt: completeTemplateData.createdAt,
      originalFileName: completeTemplateData.originalFileName,
      filePath: `/uploads/resume-templates/${fileName}`,
      isTemplate: true,
      type: "resume-template",
    };

    // Remove any existing entry with the same ID and add the new one
    index = index.filter((entry) => entry.id !== indexEntry.id);
    index.push(indexEntry);
    index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));

    return res.status(200).json({
      message: "Resume template saved successfully",
      templateId: fileName,
      filePath: `/uploads/resume-templates/${fileName}`,
      candidateName: candidateName,
      templateData: completeTemplateData,
      isTemplate: true,
      type: "resume-template",
    });
  } catch (error) {
    console.error("Error saving resume template:", error);
    return res.status(500).json({
      message: "Error saving resume template",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
