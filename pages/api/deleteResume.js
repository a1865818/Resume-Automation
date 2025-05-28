// pages/api/deleteResumeTemplate.js
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { templateId } = req.body;

    if (!templateId) {
      return res.status(400).json({ message: "Template ID is required" });
    }

    console.log("Attempting to delete resume template:", templateId);

    // Validate template ID format
    if (!templateId.match(/\.json$/i)) {
      console.log("Invalid template ID format:", templateId);
      return res.status(400).json({
        message: "Invalid template ID format",
        details: "Template ID must end with .json",
      });
    }

    const templatesDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "resume-templates"
    );
    const templatePath = path.join(templatesDir, templateId);

    // Check if template file exists
    try {
      await fs.access(templatePath);
    } catch (error) {
      console.log("Template file not found:", templatePath);
      return res.status(404).json({
        message: "Template not found",
        details: "The specified template file does not exist",
      });
    }

    // Delete the template file
    try {
      await fs.unlink(templatePath);
      console.log(`Deleted template file: ${templatePath}`);
    } catch (error) {
      console.error("Error deleting template file:", error);
      return res.status(500).json({
        message: "Failed to delete template file",
        error: error.message,
      });
    }

    // Update the templates index
    const metadataDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "metadata"
    );
    const indexPath = path.join(metadataDir, "resume-templates-index.json");

    try {
      await fs.access(indexPath);

      // Read the index
      const indexData = await fs.readFile(indexPath, "utf8");
      const index = JSON.parse(indexData);

      // Remove the entry that matches our deleted template
      const updatedIndex = index.filter((entry) => {
        return entry.id !== templateId && entry.templateId !== templateId;
      });

      // Save the updated index
      await fs.writeFile(indexPath, JSON.stringify(updatedIndex, null, 2));
      console.log("Updated resume templates index");
    } catch (error) {
      console.log("Could not update resume templates index, skipping:", error);
    }

    return res.status(200).json({
      message: "Resume template deleted successfully",
      templateId: templateId,
    });
  } catch (error) {
    console.error("Error deleting resume template:", error);
    return res.status(500).json({
      message: "Failed to delete resume template",
      error: error.message,
    });
  }
}
