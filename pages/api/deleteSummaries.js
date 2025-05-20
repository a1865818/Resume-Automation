// pages/api/deleteSummaries.js
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: "File name is required" });
    }

    // Ensure the file name is safe
    if (!fileName.match(/^[a-zA-Z0-9_\-.: ]+\.pdf$/)) {
      return res.status(400).json({ message: "Invalid file name" });
    }

    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "summaries"
    );
    const filePath = path.join(uploadsDir, fileName);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete the file
    await fs.unlink(filePath);

    return res.status(200).json({ message: "Summary deleted successfully" });
  } catch (error) {
    console.error("Error deleting summary:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete summary", error: error.message });
  }
}
