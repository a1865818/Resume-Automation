// utils/geminiApi.js
import config from "@/configs";

/**
 * Calls the Gemini API to generate a summary of the provided text
 * @param {string} text - The text content to summarize
 * @param {string} [apiKey] - Optional Google API key for Gemini (overrides config)
 * @returns {Promise<string>} - A promise that resolves to the summary text
 */
export async function generateSummary(text, apiKey = null) {
  // Use provided API key or fall back to environment variable
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error(
      "Gemini API key is required. Please provide an API key or set it in your environment variables."
    );
  }

  // Trim text if it's too long (Gemini has input limits)
  // Max ~30k characters is a safe limit for most LLM APIs
  const trimmedText =
    text.length > 30000 ? text.substring(0, 30000) + "..." : text;

  try {
    // Updated endpoint and request format based on current Gemini API (May 2025)
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": effectiveApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Please provide a concise summary of the following document text. Focus on the main points, key findings, and important details. Format the summary with clear sections and bullet points where appropriate:\n\n${trimmedText}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.error?.message || `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Extract text from the response
    if (data.candidates && data.candidates[0]?.content?.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
