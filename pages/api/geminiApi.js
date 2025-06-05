import config from "@/configs";

/**
 * Calls the Gemini API to generate a structured JSON summary compatible with resume-test.jsx
 * @param {string} text - The resume text content to analyze
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

  return await callGeminiAPI(trimmedText, null, effectiveApiKey);
}

/**
 * Calls the Gemini API to generate a tailored resume based on job requirements
 * @param {string} resumeText - The original resume text content
 * @param {string} jobDescription - The job description or tender requirements
 * @param {string} [apiKey] - Optional Google API key for Gemini (overrides config)
 * @returns {Promise<Object>} - A promise that resolves to the tailored structured resume data
 */
export async function generateTailoredResumeJSON(
  resumeText,
  jobDescription,
  apiKey = null
) {
  // Use provided API key or fall back to environment variable
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error(
      "Gemini API key is required. Please provide an API key or set it in your environment variables."
    );
  }

  if (!jobDescription || jobDescription.trim() === "") {
    throw new Error(
      "Job description is required for tailored resume generation."
    );
  }

  // Trim texts if they're too long
  const trimmedResumeText =
    resumeText.length > 35000
      ? resumeText.substring(0, 35000) + "..."
      : resumeText;
  const trimmedJobDescription =
    jobDescription.length > 25000
      ? jobDescription.substring(0, 25000) + "..."
      : jobDescription;

  return await callGeminiAPI(
    trimmedResumeText,
    trimmedJobDescription,
    effectiveApiKey
  );
}

/**
 * Core function to call Gemini API with resume and optional job description
 * @param {string} resumeText - The resume text content
 * @param {string|null} jobDescription - Optional job description for tailoring
 * @param {string} apiKey - The API key to use
 * @returns {Promise<Object>} - The structured resume data
 */
async function callGeminiAPI(resumeText, jobDescription, apiKey) {
  const isTailored = jobDescription !== null;

  if (isTailored) {
    // Tailored resume prompt - focused on job matching
    const tailoredPrompt = `You are an elite resume strategist with 20+ years of experience helping candidates land dream jobs. Your mission: Transform this resume into an irresistible candidate profile that makes recruiters think "This is EXACTLY who we need!"

    🎯 TARGET JOB ANALYSIS:
    ${jobDescription}
    
    🧠 RECRUITER PSYCHOLOGY MASTERY:
    Understand what recruiters are REALLY looking for:
    - Immediate evidence the candidate can solve their specific problems
    - Proof of relevant achievements with quantifiable impact
    - Keywords that match their ATS and mental checklist
    - A narrative that flows logically from their needs to this candidate's value
    - Confidence that this person will hit the ground running
    
    🔥 EXTREME TAILORING PROTOCOL:
    
    1. **PROFESSIONAL SUMMARY WEAPONIZATION**:
       - Open with a power statement that directly addresses their biggest need
       - Use the EXACT terminology from the job posting (mirror their language)
       - Include specific metrics/achievements that prove capability
       - Address 3-4 key requirements in the first paragraph
       - Second paragraph should create urgency - make them fear losing this candidate
       - Use industry buzzwords and trends mentioned in the posting
    
    2. **STRATEGIC KEYWORD INFILTRATION**:
       - Extract every important keyword, skill, and phrase from the job description
       - Weave them naturally throughout ALL sections
       - Professional title should echo the job title if appropriate
       - Skills section must start with their top 3-4 requirements
       - Experience bullets should use their exact terminology
       - Create keyword density without stuffing
    
    3. **EXPERIENCE METAMORPHOSIS**:
       - Rewrite every responsibility to demonstrate job-relevant value
       - Use the STAR method: Situation, Task, Action, Result
       - Lead with action verbs that match the job description's energy
       - Quantify everything possible (percentages, dollar amounts, time saved, team sizes)
       - Focus on OUTCOMES and IMPACT, not just duties
       - Make every bullet point answer: "How does this prove I can do THEIR job?"
    
    4. **ACHIEVEMENT AMPLIFICATION**:
       - Select achievements that directly parallel their challenges
       - Use metrics that matter to their industry/role
       - Show progression and growth trajectory
       - Demonstrate both hard and soft skills they've mentioned
       - Include any achievements that show innovation, leadership, or problem-solving
    
    5. **SKILLS PRECISION TARGETING**:
       - Lead with skills that appear in their "must-have" list
       - Group complementary skills (e.g., "Python/Django/REST APIs")
       - Include both technical and soft skills they've mentioned
       - Use their exact skill terminology, not synonyms
       - Show depth through combined skill sets
    
    6. **PSYCHOLOGICAL TRIGGERS**:
       - Create a narrative of inevitable success
       - Use confident, assertive language
       - Show cultural fit through values alignment
       - Demonstrate thought leadership in relevant areas
       - Include any certifications/education that match their preferences
    
    JSON SCHEMA - Every field must serve the tailoring mission:
    
    {
      "profile": {
        "name": "Full Name",
        "title": "EXACT MATCH TO THEIR IDEAL CANDIDATE TITLE",
        "location": "city",
        "clearance": "Security clearance or null",
        "description": "Hook them in 150-200 words - address their top 3-4 needs with specific proof points and relevant keywords",
        "description2": "Seal the deal in 150-200 words - additional value propositions, cultural fit indicators, and forward-looking vision"
      },
      "contact": {
    "email": "email@example.com or null if not provided",
    "phone": "+61 XXX XXX XXX or null if not provided", 
    "linkedin": "LinkedIn profile URL or null if not provided"
  },
      "qualifications": ["Education/certs prioritized by job relevance, using their preferred terminology"],
      "affiliations": ["Professional memberships that signal industry credibility"],
      "skills": ["8 skills in order of job importance - lead with their must-haves, combine related skills"],
      "keyAchievements": ["3 achievements that prove capability for their specific challenges - quantified and relevant"],
      "experience": [
        {
          "title": "Job Title - Company",
          "period": "Date Range",
          "responsibilities": ["4 power bullets showing direct relevance to target role using their language"]
        }
      ],
      "fullExperience": [
        {
          "title": "Job Title - Company",
          "period": "Date Range", 
          "responsibilities": ["8 strategic bullets per role - each proving value for target position using STAR method and their terminology"]
        }
      ],
      "referees": [
            {
            "title": "Job title (Company)" or return empty array if not provided,
            "name": "Referee Name" or return empty array if not provided, 
            "email": "email@example.com" or return empty array if not provided,
            "phone": "+61 XXX XXX XXX" or return empty array if not provided
            }
        ]
    }
    
    🚨 CRITICAL SUCCESS FACTORS:
    - Make every word count toward getting this specific job
    - Use their language, their priorities, their problems as your framework
    - Create undeniable proof this candidate is the solution they're seeking
    - Build a compelling narrative of perfect fit and inevitable success
    - Balance confidence with authenticity - never fabricate, only optimize presentation
    
    
    IMPORTANT RULES must be followed:
- Extract actual information from the resume text
- Location should not be change to match the job description, it should be the candidate's actual location.
- For fullExperience section, include ALL work experiences. For each position, include 6-8 responsibilities and achievements maximum
- For profile descriptions, write comprehensive paragraphs (150-200 words each) highlighting background, experience, and suitability
- Include quantifiable achievements where mentioned
- Format job titles as "Position - Company (Department/Organization)" if applicable
- For security clearance: ONLY include if explicitly mentioned. Return null if not mentioned
- List qualifications in order of relevance/importance
- Include both technical and soft skills (top 8 skills, combining related skills like "Python/Django")
- If referees are not provided, return an empty array[] for the fields like "title", "name", "email", "phone". Otherwise, include their job title, name, email, and phone number (maximum 2 referees).
- For affiliations, return professional message if not available, otherwise list concisely
- Keep formatting professional and consistent
- For experience section, provide 2 most impressive positions with 3-4 main bullet points each
- For keyAchievements, include 3 most impressive achievements
    

CANDIDATE'S RESUME:
${resumeText}

MAKE SURE to Return ONLY the JSON object, no additional text.`;

    return await makeGeminiRequest(tailoredPrompt, apiKey, 0.3, 8192);
  } else {
    // Standard resume prompt - general processing
    const standardPrompt = `Please analyze the following resume text and return a JSON object with the structured information that matches this exact schema for a professional resume template:

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
  "qualifications": ["List of degrees, certifications, and professional qualifications"],
  "affiliations": ["Professional memberships and associations"],
  "skills": ["Key technical and professional skills"],
  "keyAchievements": ["Major career achievements and accomplishments with quantifiable results where possible"],
  "experience": [
    {
      "title": "Job Title - Company (Organization if applicable)",
      "period": "Start Date - End Date",
      "responsibilities": ["Key responsibility or achievement 1", "Key responsibility or achievement 2"]
    }
  ],
  "fullExperience": [
    {
      "title": "Job Title - Company (Organization if applicable)",
      "period": "Start Date - End Date",
      "responsibilities": [
        "Detailed responsibility or achievement 1",
        "Detailed responsibility or achievement 2",
        "Maximum 6-8 detailed responsibilities per position"
      ]
    }
  ],
  "referees": [
    {
      "title": "Job title (Company)" or return empty array if not provided,
      "name": "Referee Name" or return empty array if not provided, 
      "email": "email@example.com" or return empty array if not provided,
      "phone": "+61 XXX XXX XXX" or return empty array if not provided
    }
  ]
}

Instructions:
- Extract actual information from the resume text
- For fullExperience section, include ALL work experiences. For each position, include 6-8 responsibilities and achievements maximum
- For profile descriptions, write comprehensive paragraphs (150-200 words each) highlighting background, experience, and suitability
- Include quantifiable achievements where mentioned
- Format job titles as "Position - Company (Department/Organization)" if applicable
- For security clearance: ONLY include if explicitly mentioned. Return null if not mentioned
- List qualifications in order of relevance/importance
- Include both technical and soft skills (top 8 skills, combining related skills like "Python/Django")
- If referees are not provided, return an empty array[] for the fields like "title", "name", "email", "phone". Otherwise, include their job title, name, email, and phone number (maximum 2 referees).
- For affiliations, return professional message if not available, otherwise list concisely
- Keep formatting professional and consistent
- For experience section, provide 2 most impressive positions with 3-4 main bullet points each
- For keyAchievements, include 3 most impressive achievements

Resume text to analyze:
${resumeText}

Return ONLY the JSON object, no additional text or formatting.`;

    return await makeGeminiRequest(standardPrompt, apiKey, 0.1, 6048);
  }
}

/**
 * Helper function to make the actual Gemini API request
 * @param {string} prompt - The complete prompt to send
 * @param {string} apiKey - The API key
 * @param {number} temperature - Temperature setting
 * @param {number} maxTokens - Maximum output tokens
 * @returns {Promise<Object>} - The structured resume data
 */
async function makeGeminiRequest(prompt, apiKey, temperature, maxTokens) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: temperature,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 8196,
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
            clearance: parsedJSON.profile?.clearance || null,
            photo: "/api/placeholder/400/600",
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
                  name: ref?.name,
                  title: ref?.title,
                  email: ref?.email,
                  phone: ref?.phone,
                }))
              : null,
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

/**
 * Generate a tailored summary based on job requirements
 * @param {string} resumeText - The original resume text
 * @param {string} jobDescription - The job description or requirements
 * @param {string} [apiKey] - Optional API key
 * @returns {Promise<string>} - Formatted tailored resume summary
 */
export async function generateTailoredSummary(
  resumeText,
  jobDescription,
  apiKey = null
) {
  const resumeData = await generateTailoredResumeJSON(
    resumeText,
    jobDescription,
    apiKey
  );
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
