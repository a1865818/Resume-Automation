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

    console.log("Attempting to delete file:", fileName);

    // Accept both .pdf and .txt files with very permissive validation
    // This matches the full filename pattern used by the system (e.g., Andrew_Nguyen_summary_2025-05-20T06-03-55-743Z_989d4be3.txt)
    if (!fileName.match(/\.(pdf|txt)$/i)) {
      console.log("Invalid file extension:", fileName);
      return res.status(400).json({
        message: "Invalid file extension",
        details: "File must be a PDF or TXT file",
      });
    }

    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "summaries"
    );
    const filePath = path.join(uploadsDir, fileName);

    // Also try to delete the metadata file if it exists
    const metadataDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "metadata"
    );
    const metadataPath = path.join(
      metadataDir,
      fileName.replace(".pdf", ".json").replace(".txt", ".json")
    );

    console.log("Checking if file exists:", filePath);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.log("File not found:", filePath);
      return res
        .status(404)
        .json({ message: "File not found", path: filePath });
    }

    // Delete the file
    console.log("Deleting file:", filePath);
    await fs.unlink(filePath);

    // Try to delete metadata file if it exists (don't fail if it doesn't)
    try {
      await fs.access(metadataPath);
      await fs.unlink(metadataPath);
      console.log("Deleted metadata file:", metadataPath);
    } catch (error) {
      console.log("Metadata file not found, skipping deletion");
      // It's okay if the metadata file doesn't exist
    }

    // Update the metadata index if it exists
    try {
      const indexPath = path.join(metadataDir, "index.json");
      await fs.access(indexPath);

      // Read the index
      const indexData = await fs.readFile(indexPath, "utf8");
      const index = JSON.parse(indexData);

      // Remove the entry for the deleted file - matching by either id or fileName
      const updatedIndex = index.filter(
        (entry) => entry.id !== fileName && entry.fileName !== fileName
      );

      // Save the updated index
      await fs.writeFile(indexPath, JSON.stringify(updatedIndex, null, 2));
      console.log("Updated metadata index");
    } catch (error) {
      console.log("Could not update metadata index, skipping");
      // It's okay if we can't update the index
    }

    return res.status(200).json({ message: "Summary deleted successfully" });
  } catch (error) {
    console.error("Error deleting summary:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete summary", error: error.message });
  }
}
