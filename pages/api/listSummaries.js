// // pages/api/listSummaries.js
// import { promises as fs } from "fs";
// import path from "path";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const uploadsDir = path.join(
//       process.cwd(),
//       "public",
//       "uploads",
//       "summaries"
//     );

//     // Check if directory exists
//     try {
//       await fs.access(uploadsDir);
//     } catch (error) {
//       // Directory doesn't exist yet, return empty array
//       return res.status(200).json({ summaries: [] });
//     }

//     // Get all files in the directory
//     const files = await fs.readdir(uploadsDir);

//     // Filter PDF files
//     const pdfFiles = files.filter((file) =>
//       file.toLowerCase().endsWith(".pdf")
//     );

//     // Get file stats for each file
//     const summaries = await Promise.all(
//       pdfFiles.map(async (fileName) => {
//         const filePath = path.join(uploadsDir, fileName);
//         const stats = await fs.stat(filePath);

//         // Try to extract candidate name from filename
//         let candidateName = "";
//         const nameMatch = fileName.match(/^([a-zA-Z_]+)_summary_/);
//         if (nameMatch && nameMatch[1]) {
//           candidateName = nameMatch[1].replace(/_/g, " ");
//         }

//         return {
//           fileName,
//           filePath: `/uploads/summaries/${fileName}`,
//           candidateName,
//           createdAt: stats.mtime,
//           size: stats.size,
//         };
//       })
//     );

//     // Sort by creation date, newest first
//     summaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     return res.status(200).json({ summaries });
//   } catch (error) {
//     console.error("Error listing summaries:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to list summaries", error: error.message });
//   }
// }

// pages/api/listSummaries-alt.js
// pages/api/listSummaries.js
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "summaries"
    );

    // Check if directory exists
    try {
      await fs.access(uploadsDir);
    } catch (error) {
      // Directory doesn't exist yet, return empty array
      return res.status(200).json({ summaries: [] });
    }

    // Get all files in the directory
    const files = await fs.readdir(uploadsDir);

    // Filter PDF files
    const pdfFiles = files.filter((file) =>
      file.toLowerCase().endsWith(".pdf")
    );

    // Get file stats for each file
    const summaries = await Promise.all(
      pdfFiles.map(async (fileName) => {
        const filePath = path.join(uploadsDir, fileName);
        const stats = await fs.stat(filePath);

        // Try to extract candidate name from filename
        let candidateName = "";
        const nameMatch = fileName.match(/^([a-zA-Z_]+)_summary_/);
        if (nameMatch && nameMatch[1]) {
          candidateName = nameMatch[1].replace(/_/g, " ");
        }

        return {
          fileName,
          filePath: `/uploads/summaries/${fileName}`,
          candidateName,
          createdAt: stats.mtime,
          size: stats.size,
        };
      })
    );

    // Sort by creation date, newest first
    summaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({ summaries });
  } catch (error) {
    console.error("Error listing summaries:", error);
    return res
      .status(500)
      .json({ message: "Failed to list summaries", error: error.message });
  }
}
