import config from "@/configs";

/**
 * Calls the Gemini API to generate a structured JSON summary compatible with resume-test.jsx
 * @param {string} text - The text content to summarize
 * @param {string} [apiKey] - Optional Google API key for Gemini (overrides config)
 * @returns {Promise<Object>} - A promise that resolves to the structured resume data for resume-test.jsx
 */
export async function generateResumeJSON(text, apiKey = null) {
  // Use provided API key or fall back to environment variable
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error(
      "Gemini API key is required. Please provide an API key or set it in your environment variables."
    );
  }

  // Trim text if it's too long (Gemini has input limits)
  const trimmedText =
    text.length > 30000 ? text.substring(0, 30000) + "..." : text;

  try {
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
                  text: `Please analyze the following resume text and return a JSON object with the structured information that matches this exact schema for a professional resume template:

{
  "profile": {
    "name": "Full Name",
    "title": "PROFESSIONAL TITLE IN CAPS",
    "location": "city",
    "clearance": "Security clearance level (e.g., NV1, Baseline) or null if not mentioned",
    "description": "First paragraph of professional summary focusing on background, experience, and key strengths",
    "description2": "Second paragraph of professional summary focusing on additional experience, skills, and suitability for roles"
  },
  "contact": {
    "email": "email@example.com or null if not provided",
    "phone": "+61 XXX XXX XXX or null if not provided", 
    "linkedin": "LinkedIn profile URL or null if not provided"
  },
  "qualifications": [
    "List of degrees, certifications, and professional qualifications"
  ],
  "affiliations": [
    "Professional memberships and associations"
  ],
  "skills": [
    "Key technical and professional skills"
  ],
  "keyAchievements": [
    "Major career achievements and accomplishments with quantifiable results where possible"
  ],
  "experience": [
    {
      "title": "Job Title - Company (Organization if applicable)",
      "period": "Start Date - End Date",
      "responsibilities": [
        "Key responsibility or achievement 1",
        "Key responsibility or achievement 2"
      ]
    }
  ],
  "fullExperience": [
    {
      "title": "Job Title - Company (Organization if applicable)",
      "period": "Start Date - End Date",
      "responsibilities": [
        "Detailed responsibility or achievement 1",
        "Detailed responsibility or achievement 2",
        "Detailed responsibility or achievement 3",
        "Additional detailed responsibilities..."
        "Maximum 6-8 detailed responsibilities per position, grouped where necessary"
      ]
    }
  ],
  "referees": [
    {
      "title": "Job title (Company)",
      "name": "Referee Name",
      "email": "email@example.com",
      "phone": "+61 XXX XXX XXX"
    }
  ]
}

Important instructions:
- Extract actual information from the resume text
- For fullExperience section, include ALL work experiences from the resume. For each position, include 6-8 responsibilities and achievements. Do not exceed the limit by summarizing if neccessary. If the candidate provides too much information, group related details into concise, high-level points to stay within the limit
- For the profile descriptions, write comprehensive paragraphs (150-200 words each) that highlight the candidate's background, experience, and suitability
- Include quantifiable achievements where mentioned
- Format job titles as "Position - Company (Department/Organization)" if applicable
- For security clearance: ONLY include if explicitly mentioned in the resume. Do NOT include words like "NONE", "Unspecified", or any placeholder text. If no clearance is mentioned, return null.
- List qualifications in order of relevance/importance
- Include both technical and soft skills (top 8 skills, if there are skills that are related to each other (e.g., Python and Django, or Java and Spring), list them as one skill - e.g., "Python/Django")
- If referees are not provided, return an empty array[] for the fields like "title", "name", "email", "phone". Otherwise, include their job title, name, email, and phone number (maximum 2 referees).
- For affiliations, if it is not available, return a formal message indicating that the information is not available. Otherwise, list the affiliations in a concise manner.
- Keep formatting professional and consistent
- For experience section, if the resume has a lot of experience, provide only 2 positions that are the most impressive. Moreover, for every position, include only 3-4 main bullet points that are noticeable.
- For Key Achievements, include the most 3 impressive achievements.

Resume text to analyze:
${trimmedText}

Return ONLY the JSON object, no additional text or formatting.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 6048,
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
      const responseText = data.candidates[0].content.parts[0].text;
      console.log("Response text:", responseText);

      // Try to parse the JSON response
      try {
        // Clean the response text (remove markdown formatting if present)
        const cleanedText = responseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        const parsedJSON = JSON.parse(cleanedText);

        // Validate and set defaults for required fields to match resume-test.jsx structure
        return {
          profile: {
            name: parsedJSON.profile?.name || "Unknown Candidate",
            title: parsedJSON.profile?.title || "PROFESSIONAL",
            location: parsedJSON.profile?.location || "",
            clearance: parsedJSON.profile?.clearance || null, // Changed to null instead of empty string
            photo: "/api/placeholder/400/600", // Default placeholder since we don't have actual photos
            description:
              parsedJSON.profile?.description ||
              "Professional with extensive experience in their field.",
            description2:
              parsedJSON.profile?.description2 ||
              "Skilled professional with a strong background in project management and technical expertise.",
          },
          contact: {
            email: parsedJSON.contact?.email || null,
            phone: parsedJSON.contact?.phone || null,
            linkedin: parsedJSON.contact?.linkedin || null,
          },
          qualifications: Array.isArray(parsedJSON.qualifications)
            ? parsedJSON.qualifications
            : [],
          affiliations: Array.isArray(parsedJSON.affiliations)
            ? parsedJSON.affiliations
            : [],
          skills: Array.isArray(parsedJSON.skills) ? parsedJSON.skills : [],
          keyAchievements: Array.isArray(parsedJSON.keyAchievements)
            ? parsedJSON.keyAchievements
            : [],
          experience: Array.isArray(parsedJSON.experience)
            ? parsedJSON.experience.map((exp) => ({
                title: exp.title || "Position",
                period: exp.period || "Date not specified",
                responsibilities: Array.isArray(exp.responsibilities)
                  ? exp.responsibilities
                  : [],
              }))
            : [],
          fullExperience: Array.isArray(parsedJSON.fullExperience)
            ? parsedJSON.fullExperience.map((exp) => ({
                title: exp.title || "Position",
                period: exp.period || "Date not specified",
                responsibilities: Array.isArray(exp.responsibilities)
                  ? exp.responsibilities
                  : [],
              }))
            : [],
          referees:
            Array.isArray(parsedJSON.referees) && parsedJSON.referees.length > 0
              ? parsedJSON.referees.map((ref) => ({
                  name: ref.name,
                  title: ref.title,
                  email: ref.email,
                  phone: ref.phone,
                }))
              : null, // Changed to null when no referees are provided
        };
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error(
          "Failed to parse AI response as JSON. Please try again."
        );
      }
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Keep backward compatibility functions
export async function generateSummary(text, apiKey = null) {
  const resumeData = await generateResumeJSON(text, apiKey);
  return formatResumeDataToText(resumeData);
}

function formatResumeDataToText(resumeData) {
  let summary = `**${resumeData.profile.name}**\n\n`;

  if (resumeData.profile.description) {
    summary += `${resumeData.profile.description}\n\n`;
  }

  if (resumeData.profile.description2) {
    summary += `${resumeData.profile.description2}\n\n`;
  }

  if (resumeData.profile.title) {
    summary += `**Current Role:** ${resumeData.profile.title}\n`;
  }

  if (resumeData.profile.location) {
    summary += `**Location:** ${resumeData.profile.location}\n`;
  }

  if (resumeData.profile.clearance) {
    summary += `**Security Clearance:** ${resumeData.profile.clearance}\n`;
  }

  // Add contact information
  if (
    resumeData.contact?.email ||
    resumeData.contact?.phone ||
    resumeData.contact?.linkedin
  ) {
    summary += `**Contact:**\n`;
    if (resumeData.contact?.email) {
      summary += `* Email: ${resumeData.contact.email}\n`;
    }
    if (resumeData.contact?.phone) {
      summary += `* Phone: ${resumeData.contact.phone}\n`;
    }
    if (resumeData.contact?.linkedin) {
      summary += `* LinkedIn: ${resumeData.contact.linkedin}\n`;
    }
  }

  summary += "\n";

  if (resumeData.skills && resumeData.skills.length > 0) {
    summary += `**Key Skills:**\n`;
    resumeData.skills.forEach((skill) => {
      summary += `* ${skill}\n`;
    });
    summary += "\n";
  }

  if (resumeData.experience && resumeData.experience.length > 0) {
    summary += `**Work Experience:**\n`;
    resumeData.experience.forEach((job) => {
      summary += `* **${job.title}** (${job.period})\n`;
      if (job.responsibilities && job.responsibilities.length > 0) {
        job.responsibilities.forEach((resp) => {
          summary += `  - ${resp}\n`;
        });
      }
    });
    summary += "\n";
  }

  if (resumeData.qualifications && resumeData.qualifications.length > 0) {
    summary += `**Qualifications:**\n`;
    resumeData.qualifications.forEach((qual) => {
      summary += `* ${qual}\n`;
    });
    summary += "\n";
  }

  if (resumeData.keyAchievements && resumeData.keyAchievements.length > 0) {
    summary += `**Key Achievements:**\n`;
    resumeData.keyAchievements.forEach((achievement) => {
      summary += `* ${achievement}\n`;
    });
  }

  return summary;
}
