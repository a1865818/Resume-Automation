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

    // Accept .pdf, .txt, and .json files with improved validation
    if (!fileName.match(/\.(pdf|txt|json)$/i)) {
      console.log("Invalid file extension:", fileName);
      return res.status(400).json({
        message: "Invalid file extension",
        details: "File must be a PDF, TXT, or JSON file",
      });
    }

    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "summaries"
    );
    const filePath = path.join(uploadsDir, fileName);

    // Try to find the corresponding files (txt, pdf, json) based on the provided fileName
    const baseFileName = fileName.replace(/\.(pdf|txt|json)$/i, "");
    const possibleExtensions = [".txt", ".pdf", ".json"];
    let fileExists = false;
    let filesDeleted = [];

    // Check for all possible related files and delete them
    for (const ext of possibleExtensions) {
      const currentFileName = `${baseFileName}${ext}`;
      const currentFilePath = path.join(uploadsDir, currentFileName);

      try {
        // Check if this variant exists
        await fs.access(currentFilePath);
        fileExists = true;

        // Delete this variant if it exists
        await fs.unlink(currentFilePath);
        filesDeleted.push(currentFileName);
        console.log(`Deleted file: ${currentFilePath}`);
      } catch (error) {
        // It's okay if this variant doesn't exist
        console.log(`File variant not found (ok): ${currentFilePath}`);
      }
    }

    // If not a single file was found
    if (!fileExists && filesDeleted.length === 0) {
      console.log("No matching files found for:", fileName);
      return res.status(404).json({
        message: "File not found",
        details: "No matching files were found for deletion",
      });
    }

    // Also try to delete the metadata file if it exists
    const metadataDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "metadata"
    );

    // Generate metadata filename (always .json regardless of source file extension)
    const metadataFileName = `${baseFileName}.json`;
    const metadataPath = path.join(metadataDir, metadataFileName);

    try {
      await fs.access(metadataPath);
      await fs.unlink(metadataPath);
      console.log("Deleted metadata file:", metadataPath);
    } catch (error) {
      console.log("Metadata file not found, skipping deletion");
    }

    // Update the metadata index if it exists
    try {
      const indexPath = path.join(metadataDir, "index.json");
      await fs.access(indexPath);

      // Read the index
      const indexData = await fs.readFile(indexPath, "utf8");
      const index = JSON.parse(indexData);

      // Remove entries that match any of our deleted files
      const updatedIndex = index.filter((entry) => {
        // Check if the id or fileName matches any of our deleted files or base filename
        return (
          !filesDeleted.includes(entry.fileName) &&
          !filesDeleted.includes(entry.id) &&
          entry.id !== baseFileName &&
          entry.fileName !== baseFileName
        );
      });

      // Save the updated index
      await fs.writeFile(indexPath, JSON.stringify(updatedIndex, null, 2));
      console.log("Updated metadata index");
    } catch (error) {
      console.log("Could not update metadata index, skipping:", error);
    }

    return res.status(200).json({
      message: "Summary deleted successfully",
      filesDeleted,
    });
  } catch (error) {
    console.error("Error deleting summary:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete summary", error: error.message });
  }
}
