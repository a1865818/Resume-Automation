// pages/api/listResume.js
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  console.log("listResumeTemplates API called");

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Try to get from metadata index first (more efficient)
    const metadataDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "metadata"
    );
    const indexPath = path.join(metadataDir, "resume-templates-index.json");

    try {
      // Check if index exists
      await fs.access(indexPath);
      // Read and return the index
      const indexData = await fs.readFile(indexPath, "utf8");
      const index = JSON.parse(indexData);

      // Apply any filters from query parameters
      let filtered = index;
      const { candidateName, location, profileTitle } = req.query;

      if (candidateName) {
        filtered = filtered.filter(
          (entry) =>
            entry.candidateName &&
            entry.candidateName
              .toLowerCase()
              .includes(candidateName.toLowerCase())
        );
      }

      if (location) {
        filtered = filtered.filter(
          (entry) =>
            entry.location &&
            entry.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (profileTitle) {
        filtered = filtered.filter(
          (entry) =>
            entry.profileTitle &&
            entry.profileTitle
              .toLowerCase()
              .includes(profileTitle.toLowerCase())
        );
      }

      return res.status(200).json({
        templates: filtered,
        totalCount: index.length,
        filteredCount: filtered.length,
      });
    } catch (error) {
      console.log(
        "Resume templates index not found, falling back to directory scan"
      );
    }

    // Fallback to directory scan if metadata index doesn't exist
    const templatesDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "resume-templates"
    );

    // Check if directory exists
    try {
      await fs.access(templatesDir);
    } catch (error) {
      // Directory doesn't exist yet, return empty array
      return res.status(200).json({
        templates: [],
        totalCount: 0,
        filteredCount: 0,
      });
    }

    // Get all files in the directory
    const files = await fs.readdir(templatesDir);

    // Filter JSON template files
    const templateFiles = files.filter((file) =>
      file.toLowerCase().endsWith(".json")
    );

    // Get file stats and content for each file
    const templates = await Promise.all(
      templateFiles.map(async (fileName) => {
        const filePath = path.join(templatesDir, fileName);
        const stats = await fs.stat(filePath);

        try {
          // Try to read template content
          const templateContent = await fs.readFile(filePath, "utf8");
          const templateData = JSON.parse(templateContent);

          return {
            id: fileName,
            templateId: fileName,
            candidateName: templateData.candidateName || "Unknown Candidate",
            profileTitle: templateData.profile?.title || "",
            location: templateData.profile?.location || "",
            clearance: templateData.profile?.clearance || "",
            qualificationsCount: templateData.qualifications?.length || 0,
            skillsCount: templateData.skills?.length || 0,
            experienceCount: templateData.experience?.length || 0,
            achievementsCount: templateData.keyAchievements?.length || 0,
            refereesCount: templateData.referees?.length || 0,
            createdAt: templateData.createdAt || stats.mtime,
            originalFileName: templateData.originalFileName || "",
            filePath: `/uploads/resume-templates/${fileName}`,
            isTemplate: true,
            type: "resume-template",
          };
        } catch (err) {
          // If we can't read the template, return basic info
          console.error(`Error reading template ${fileName}:`, err);

          let candidateName = "Unknown Candidate";
          const nameMatch = fileName.match(/^([a-zA-Z_]+)_template_/);
          if (nameMatch && nameMatch[1]) {
            candidateName = nameMatch[1].replace(/_/g, " ");
          }

          return {
            id: fileName,
            templateId: fileName,
            candidateName: candidateName,
            profileTitle: "",
            location: "",
            clearance: "",
            qualificationsCount: 0,
            skillsCount: 0,
            experienceCount: 0,
            achievementsCount: 0,
            refereesCount: 0,
            createdAt: stats.mtime,
            originalFileName: "",
            filePath: `/uploads/resume-templates/${fileName}`,
            isTemplate: true,
            type: "resume-template",
            error: "Could not read template data",
          };
        }
      })
    );

    // Sort by creation date, newest first
    templates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply filters if any
    let filtered = templates;
    const { candidateName, location, profileTitle } = req.query;

    if (candidateName) {
      filtered = filtered.filter(
        (entry) =>
          entry.candidateName &&
          entry.candidateName
            .toLowerCase()
            .includes(candidateName.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(
        (entry) =>
          entry.location &&
          entry.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (profileTitle) {
      filtered = filtered.filter(
        (entry) =>
          entry.profileTitle &&
          entry.profileTitle.toLowerCase().includes(profileTitle.toLowerCase())
      );
    }

    return res.status(200).json({
      templates: filtered,
      totalCount: templates.length,
      filteredCount: filtered.length,
    });
  } catch (error) {
    console.error("Error listing resume templates:", error);
    return res.status(500).json({
      message: "Failed to list resume templates",
      error: error.message,
    });
  }
}
