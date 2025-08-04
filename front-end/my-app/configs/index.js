import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Environment variables with fallbacks
const config = {
  // API Keys
  geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",

  // API URLs
  geminiApiUrl:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",

  // Feature flags
  enableGeminiSummary:
    process.env.NEXT_PUBLIC_ENABLE_GEMINI_SUMMARY !== "false",
};

export default config;
