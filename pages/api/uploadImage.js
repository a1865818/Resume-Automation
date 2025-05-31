// pages/api/uploadImage.js
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Helper function to ensure uploads directory exists
const ensureUploadsDirectory = async () => {
  const uploadsDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "profile-pictures"
  );
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// Helper function to get file extension from mime type
const getFileExtension = (mimeType) => {
  const extensions = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return extensions[mimeType] || ".jpg";
};

// Helper function to validate image file
const validateImageFile = (file) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPG, PNG, WebP, and GIF files are allowed."
    );
  }

  if (file.size > maxSize) {
    throw new Error("File size too large. Maximum size is 5MB.");
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb", // Slightly larger than max file size to account for base64 encoding
    },
  },
};

export default async function handler(req, res) {
  console.log("uploadImage API called", {
    method: req.method,
    contentType: req.headers["content-type"],
  });

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { imageData, fileName, mimeType } = req.body;

    if (!imageData || !mimeType) {
      return res.status(400).json({
        message: "Missing required fields: imageData and mimeType are required",
      });
    }

    // Validate file type and create pseudo file object for validation
    const pseudoFile = {
      type: mimeType,
      size: Buffer.byteLength(imageData, "base64") * 0.75, // Approximate size after base64 decode
    };

    validateImageFile(pseudoFile);

    // Generate unique filename
    const fileExtension = getFileExtension(mimeType);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;

    // Ensure uploads directory exists
    const uploadsDir = await ensureUploadsDirectory();
    const filePath = path.join(uploadsDir, uniqueFileName);

    // Convert base64 to buffer and save
    const buffer = Buffer.from(imageData, "base64");
    await fs.writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/profile-pictures/${uniqueFileName}`;

    console.log(`Image uploaded successfully: ${publicUrl}`);

    return res.status(200).json({
      message: "Image uploaded successfully",
      filename: uniqueFileName,
      url: publicUrl,
      size: buffer.length,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      message: "Error uploading image",
      error: error.message,
    });
  }
}
