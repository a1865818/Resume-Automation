// // // pages/api/listSummaries.js
// // import { promises as fs } from "fs";
// // import path from "path";

// // export default async function handler(req, res) {
// //   if (req.method !== "GET") {
// //     return res.status(405).json({ message: "Method not allowed" });
// //   }

// //   try {
// //     const uploadsDir = path.join(
// //       process.cwd(),
// //       "public",
// //       "uploads",
// //       "summaries"
// //     );

// //     // Check if directory exists
// //     try {
// //       await fs.access(uploadsDir);
// //     } catch (error) {
// //       // Directory doesn't exist yet, return empty array
// //       return res.status(200).json({ summaries: [] });
// //     }

// //     // Get all files in the directory
// //     const files = await fs.readdir(uploadsDir);

// //     // Filter PDF files
// //     const pdfFiles = files.filter((file) =>
// //       file.toLowerCase().endsWith(".pdf")
// //     );

// //     // Get file stats for each file
// //     const summaries = await Promise.all(
// //       pdfFiles.map(async (fileName) => {
// //         const filePath = path.join(uploadsDir, fileName);
// //         const stats = await fs.stat(filePath);

// //         // Try to extract candidate name from filename
// //         let candidateName = "";
// //         const nameMatch = fileName.match(/^([a-zA-Z_]+)_summary_/);
// //         if (nameMatch && nameMatch[1]) {
// //           candidateName = nameMatch[1].replace(/_/g, " ");
// //         }

// //         return {
// //           fileName,
// //           filePath: `/uploads/summaries/${fileName}`,
// //           candidateName,
// //           createdAt: stats.mtime,
// //           size: stats.size,
// //         };
// //       })
// //     );

// //     // Sort by creation date, newest first
// //     summaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// //     return res.status(200).json({ summaries });
// //   } catch (error) {
// //     console.error("Error listing summaries:", error);
// //     return res
// //       .status(500)
// //       .json({ message: "Failed to list summaries", error: error.message });
// //   }
// // }

// // pages/api/listSummaries-alt.js
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
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  console.log("listSummaries-alt API called");

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
    const indexPath = path.join(metadataDir, "index.json");

    try {
      // Check if index exists
      await fs.access(indexPath);
      // Read and return the index
      const indexData = await fs.readFile(indexPath, "utf8");
      const index = JSON.parse(indexData);

      // Apply any filters from query parameters
      let filtered = index;

      const { industry, experience, location, seniority, skill } = req.query;

      if (industry) {
        filtered = filtered.filter(
          (entry) =>
            entry.industries &&
            entry.industries.some((ind) =>
              ind.toLowerCase().includes(industry.toLowerCase())
            )
        );
      }

      if (experience) {
        const minExp = parseInt(experience);
        if (!isNaN(minExp)) {
          filtered = filtered.filter(
            (entry) => entry.yearsOfExperience >= minExp
          );
        }
      }

      if (location) {
        filtered = filtered.filter(
          (entry) =>
            entry.location &&
            entry.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (seniority) {
        filtered = filtered.filter(
          (entry) =>
            entry.seniorityLevel &&
            entry.seniorityLevel.toLowerCase() === seniority.toLowerCase()
        );
      }

      if (skill) {
        filtered = filtered.filter(
          (entry) =>
            entry.topSkills &&
            entry.topSkills.some((s) =>
              s.toLowerCase().includes(skill.toLowerCase())
            )
        );
      }

      return res.status(200).json({
        summaries: filtered,
        totalCount: index.length,
        filteredCount: filtered.length,
      });
    } catch (error) {
      console.log("Metadata index not found, falling back to directory scan");
    }

    // Fallback to directory scan if metadata index doesn't exist
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

    // Filter PDF and TXT files
    const summaryFiles = files.filter(
      (file) =>
        file.toLowerCase().endsWith(".pdf") ||
        file.toLowerCase().endsWith(".txt")
    );

    // Get file stats for each file
    const summaries = await Promise.all(
      summaryFiles.map(async (fileName) => {
        const filePath = path.join(uploadsDir, fileName);
        const stats = await fs.stat(filePath);

        // Try to extract candidate name from filename
        let candidateName = "";
        const nameMatch = fileName.match(/^([a-zA-Z_]+)_summary_/);
        if (nameMatch && nameMatch[1]) {
          candidateName = nameMatch[1].replace(/_/g, " ");
        }

        // Try to load metadata file if it exists
        let metadata = null;
        try {
          const metadataPath = path.join(
            metadataDir,
            fileName.replace(".pdf", ".json").replace(".txt", ".json")
          );
          const metadataContent = await fs.readFile(metadataPath, "utf8");
          metadata = JSON.parse(metadataContent);
        } catch (err) {
          // No metadata available
        }

        return {
          fileName,
          filePath: `/uploads/summaries/${fileName}`,
          candidateName: metadata?.candidateName || candidateName,
          jobTitle: metadata?.jobTitle || "",
          yearsOfExperience: metadata?.yearsOfExperience || 0,
          location: metadata?.location || "",
          industries: metadata?.industries || [],
          educationLevel: metadata?.educationLevel || "",
          seniorityLevel: metadata?.seniorityLevel || "",
          topSkills: metadata?.topSkills || [],
          createdAt: metadata?.createdAt || stats.mtime,
          size: stats.size,
        };
      })
    );

    // Sort by creation date, newest first
    summaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply filters if any
    let filtered = summaries;

    const { industry, experience, location, seniority, skill } = req.query;

    if (industry) {
      filtered = filtered.filter(
        (entry) =>
          entry.industries &&
          entry.industries.some((ind) =>
            ind.toLowerCase().includes(industry.toLowerCase())
          )
      );
    }

    if (experience) {
      const minExp = parseInt(experience);
      if (!isNaN(minExp)) {
        filtered = filtered.filter(
          (entry) => entry.yearsOfExperience >= minExp
        );
      }
    }

    if (location) {
      filtered = filtered.filter(
        (entry) =>
          entry.location &&
          entry.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (seniority) {
      filtered = filtered.filter(
        (entry) =>
          entry.seniorityLevel &&
          entry.seniorityLevel.toLowerCase() === seniority.toLowerCase()
      );
    }

    if (skill) {
      filtered = filtered.filter(
        (entry) =>
          entry.topSkills &&
          entry.topSkills.some((s) =>
            s.toLowerCase().includes(skill.toLowerCase())
          )
      );
    }

    return res.status(200).json({
      summaries: filtered,
      totalCount: summaries.length,
      filteredCount: filtered.length,
    });
  } catch (error) {
    console.error("Error listing summaries:", error);
    return res
      .status(500)
      .json({ message: "Failed to list summaries", error: error.message });
  }
}
