import config from "@/configs";

/**
 * Three-step pipeline for RFQ/Tender-optimized resume generation
 * Step 1: Analyze RFQ/tender requirements and evaluation criteria
 * Step 2: Strategically tailor resume to maximize tender scoring
 * Step 3: Optimize for procurement evaluation and compliance
 */

/**
 * Step 1: Analyze the RFQ/tender document for procurement-specific requirements
 * @param {string} rfqDocument - The complete RFQ/tender document
 * @param {string} [apiKey] - Optional API key
 * @returns {Promise<Object>} - Structured RFQ analysis optimized for tender responses
 */
export async function analyzeRFQRequirements(rfqDocument, apiKey = null) {
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error("Gemini API key is required.");
  }

  if (!rfqDocument || rfqDocument.trim() === "") {
    throw new Error("RFQ document is required for analysis.");
  }

  const prompt = `You are an expert government procurement specialist and tender response strategist. Analyze this RFQ/tender document to extract critical information for creating a winning candidate submission.

Focus on procurement-specific elements that government evaluators will score against. Extract information that will help position the candidate competitively.

Return a JSON object with this exact structure:

{
  "procurementDetails": {
    "buyerOrganization": "Name of the requesting organization",
    "rfqNumber": "RFQ/tender reference number",
    "positionTitle": "Exact job title as stated",
    "contractDuration": "Initial term and extension options",
    "locationRequirements": "Work location and arrangement details",
    "securityClearance": "Required clearance level if specified",
    "startDate": "Expected commencement date"
  },
  "essentialCriteria": [
    {
      "title": "Exact wording of essential requirement" //For example: "Demonstrated Experience in Project Management",
      "weight": "Estimated importance (Critical/High/Medium)",
      "keywords": ["key", "terms", "to", "include"],
      "evidenceRequired": "Type of evidence needed to demonstrate this"
    }
  ],
  "desirableCriteria": [
    {
      "title": "Exact wording of desirable requirement" //For example: "Experience with Agile Methodologies", 
      "competitiveAdvantage": "How this could differentiate the candidate",
      "keywords": ["relevant", "keywords"]
    }
  ],
  "mandatoryRequirements": [
    "Non-negotiable requirements that must be met",
    "Citizenship/residency requirements",
    "Specific certifications or qualifications"
  ],
  "evaluationCriteria": {
    "responseFormat": "Required format (e.g., one-page pitch, character limits)",
    "submissionRequirements": ["CV format", "additional documents needed"],
    "evaluationMethod": "How candidates will be assessed",
    "selectionProcess": "Merit list, interviews, etc."
  },
  "competitiveIntelligence": {
    "experienceLevel": "Required years and seniority level",
    "industrySpecifics": "Government/regulatory experience requirements",
    "technicalSkillPriority": ["most", "important", "technical", "skills"],
    "differentiators": ["factors", "that", "could", "set", "candidate", "apart"]
  },
  "complianceRequirements": {
    "documentationNeeded": ["required", "forms", "and", "attachments"],
    "deadlines": "Submission deadlines and validity periods",
    "pricingRequirements": "How rates should be presented",
    "exclusionCriteria": ["factors", "that", "would", "disqualify"]
  },
  "strategicKeywords": [
    "government-specific terms",
    "regulatory language", 
    "industry terminology",
    "procurement buzzwords",
    "technical terms that must appear"
  ],
  "scoringOptimization": {
    "highImpactAreas": ["areas", "likely", "to", "score", "highest"],
    "commonWeaknesses": ["typical", "gaps", "in", "submissions"],
    "winningFactors": ["elements", "that", "typically", "win", "tenders"]
  }
}

Instructions:
- Extract ONLY information from the provided RFQ document
- Focus on elements government evaluators will score
- Identify both explicit and implicit evaluation criteria
- Note any procurement-specific language or requirements
- Consider compliance and mandatory submission requirements
- Identify competitive positioning opportunities
- Pay attention to character limits, format requirements, and deadlines

RFQ/Tender Document:
${rfqDocument}

Return ONLY the JSON object, no additional text.`;

  try {
    const response = await makeGeminiRequest(
      prompt,
      effectiveApiKey,
      0.15,
      4096
    );
    console.log("RFQ Analysis Result:", response);
    return response;
  } catch (error) {
    console.error("Error in Step 1 - RFQ Analysis:", error);
    throw new Error(`RFQ analysis failed: ${error.message}`);
  }
}

/**
 * Step 2: Strategically tailor resume to maximize tender evaluation scores
 * @param {string} resumeText - Original resume text
 * @param {Object} rfqAnalysis - Output from Step 1
 * @param {string} [apiKey] - Optional API key
 * @returns {Promise<Object>} - Strategically optimized resume for tender submission
 */
export async function optimizeResumeForTender(
  resumeText,
  rfqAnalysis,
  apiKey = null
) {
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error("Gemini API key is required.");
  }

  const prompt = `You are an elite government tender response specialist with expertise in procurement evaluation. Transform this candidate's resume into a winning tender submission that maximizes evaluation scores.

🎯 RFQ ANALYSIS:
${JSON.stringify(rfqAnalysis, null, 2)}

🏆 TENDER OPTIMIZATION STRATEGY:

1. **ESSENTIAL CRITERIA DOMINANCE**: Address every essential criterion with strong evidence
2. **GOVERNMENT LANGUAGE ALIGNMENT**: Use procurement and regulatory terminology
3. **QUANTIFIED IMPACT**: Provide metrics that demonstrate value to government
4. **COMPLIANCE POSITIONING**: Ensure perfect alignment with mandatory requirements
5. **COMPETITIVE DIFFERENTIATION**: Highlight unique value propositions
6. **EVALUATION SCORING**: Structure content to maximize evaluator scoring

JSON SCHEMA - Optimized for government tender evaluation:

{
  "profile": {
    "name": "Full Name",
    "title": "Professional title using government/RFQ terminology",
    "location": "Candidate's actual location (maintain authenticity)",
    "clearance": "Security clearance level or eligibility status",
    //Using third person view with professional tone and sounds natural.
    "description": "190-220 words directly addressing top 3-4 essential criteria with government-focused language and quantified achievements",
    "description2": "190-220 words showcasing additional essential criteria compliance and competitive advantages for government work"
  },
  "contact": {
    "email": "email@example.com or null if not provided",
    "phone": "+61 XXX XXX XXX or null if not provided", 
    "linkedin": "LinkedIn profile URL or null if not provided"
  },
  "qualifications": ["Qualifications prioritized by RFQ requirements, using exact terminology from tender"],
  "affiliations": ["Professional memberships that demonstrate government/regulatory sector credibility"],
  "skills": ["Top 8 skills ranked by RFQ importance - lead with essential criteria, use government terminology"],
  "keyAchievements": ["3 achievements with quantified outcomes that directly relate to government value delivery"],
  "experience": [
    {
      "title": "Job Title - Organization",
      "period": "Date Range",
      "responsibilities": ["4 strategic bullets demonstrating essential criteria using RFQ language and government impact metrics"]
    }
  ],
  "fullExperience": [
    {
      "title": "Job Title - Organization", 
      "period": "Date Range",
      "responsibilities": ["6-8 bullets per role proving capability against essential and desirable criteria using government terminology"]
    }
  ],
  "referees": [
    {
      "title": "Job title (Organization)" or return empty array if not provided,
      "name": "Referee Name" or return empty array if not provided,
      "email": "email@example.com" or return empty array if not provided, 
      "phone": "+61 XXX XXX XXX" or return empty array if not provided
    }
  ],
  "roleTitle": "Exact job title from RFQ",
  "rfqNumber": "RFQ/tender reference number",
}

🚨 CRITICAL TENDER OPTIMIZATION RULES:
- Use EXACT terminology from the RFQ essential and desirable criteria
- Address every essential criterion with concrete evidence
- Incorporate government/regulatory sector language naturally
- Quantify achievements with metrics relevant to government value
- Prioritize government, regulatory, or public sector experience
- Use procurement terminology where applicable
- Structure content for evaluator scanning and scoring
- Maintain candidate authenticity while maximizing competitive positioning
- Include compliance-related experience prominently
- Demonstrate understanding of what RFTQ's required in processes and requirements
- Location must be based on the RFTQ's requirements, not the candidate's actual location.
- Security clearance: Include current status and eligibility for required level. If not applicable, return null.
- Experience section: Focus on most relevant positions to the RFTQ's requirements. The bullet points should directly relate to the Essential Criteria of the RFTQs using key words that would be pciked up on a search function or ATS system. Moreover, provide 3 most relevant positions with 3-4 main bullet points each with insightful details that directly related to the Essenti. For example if the RFTQ's requires are for a Business Analyst, you would provide the 3 most relevant positions to the requirements.
- Full experience: Include ALL positions but weight relevant work to the RFTQ's requirement more heavily.
- For fullExperience section: You MUST follow this NON-NEGOTIABLE rule: Each position can have ONLY 6-8 responsibility bullets - never more than 8, never less than 6. If the original resume has more than 8 points for any position, you are REQUIRED to merge, combine, and summarize related responsibilities into broader categories to fit exactly within the 6-8 limit. Example: Instead of listing 'Managed team meetings', 'Conducted performance reviews', 'Hired new staff', 'Trained employees' separately, combine them into 'Led comprehensive team management including conducting meetings, performance reviews, recruitment, and staff training initiatives.' This consolidation is MANDATORY - there are no exceptions. COUNT your bullets for each position and ensure you never exceed 8.
- If the experience has no responsibilities, do not add that position to the fullExperience section.
- Skills: Combine technical and regulatory/compliance skills strategically
- Format consistently for professional government submission standards
- If no referees are provided, return an empty array[] for the fields like "title", "name", "email", "phone". Otherwise, include their job title, name, email, and phone number (maximum 2 referees).

CANDIDATE'S RESUME:
${resumeText}

Return ONLY the JSON object, no additional text.`;

  try {
    const response = await makeGeminiRequest(
      prompt,
      effectiveApiKey,
      0.1,
      8192
    );
    return response;
  } catch (error) {
    console.error("Error in Step 2 - Resume Optimization:", error);
    throw new Error(`Resume optimization failed: ${error.message}`);
  }
}

/**
 * Complete 2-step RFQ-optimized pipeline function
 * @param {string} resumeText - Original resume text
 * @param {string} rfqDocument - Complete RFQ/tender document
 * @param {string} [apiKey] - Optional API key
 * @returns {Promise<Object>} - Final tender-optimized resume JSON
 */
export async function generateCompetitiveTenderResume(
  resumeText,
  rfqDocument,
  apiKey = null
) {
  try {
    console.log(
      "🔍 Step 1: Analyzing RFQ requirements and evaluation criteria..."
    );
    const rfqAnalysis = await analyzeRFQRequirements(rfqDocument, apiKey);

    console.log(
      "🎯 Step 2: Optimizing resume for competitive tender positioning..."
    );
    const finalResume = await optimizeResumeForTender(
      resumeText,
      rfqAnalysis,
      apiKey
    );

    console.log("✅ Competitive tender resume optimization complete!");
    return {
      rfqAnalysis,
      finalResume,
      competitiveAdvantages: extractCompetitiveAdvantages(
        rfqAnalysis,
        finalResume
      ),
    };
  } catch (error) {
    console.error("RFQ optimization pipeline error:", error);
    throw error;
  }
}

/**
 * Extract competitive advantages for submission strategy
 * @param {Object} rfqAnalysis - RFQ analysis results
 * @param {Object} finalResume - Final optimized resume
 * @returns {Object} - Competitive positioning insights
 */
function extractCompetitiveAdvantages(rfqAnalysis, finalResume) {
  return {
    essentialCriteriaCoverage: rfqAnalysis.essentialCriteria?.length || 0,
    desirableCriteriaAlignment: rfqAnalysis.desirableCriteria?.length || 0,
    keyDifferentiators:
      rfqAnalysis.competitiveIntelligence?.differentiators || [],
    complianceStatus: "Optimized for government procurement standards",
    submissionReadiness: "Ready for tender submission",
  };
}

/**
 * Helper function to make Gemini API requests
 * @param {string} prompt - The prompt to send
 * @param {string} apiKey - API key
 * @param {number} temperature - Temperature setting
 * @param {number} maxTokens - Maximum output tokens
 * @returns {Promise<Object>} - Parsed JSON response
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
            maxOutputTokens: maxTokens,
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

    if (data.candidates && data.candidates[0]?.content?.parts) {
      const responseText = data.candidates[0].content.parts[0].text;

      try {
        // Clean the response text
        const cleanedText = responseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        const parsedJSON = JSON.parse(cleanedText);
        return parsedJSON;
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        console.error("Raw response:", responseText);
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

// LEGACY CODE - Standard resume generation (non-tailored)

// /**
//  * Standard resume generation (non-tailored)
//  * @param {string} resumeText - The resume text content to analyze
//  * @param {string} [apiKey] - Optional Google API key for Gemini (overrides config)
//  * @returns {Promise<Object>} - A promise that resolves to the structured resume data
//  */
// export async function generateResumeJSON(resumeText, apiKey = null) {
//   const effectiveApiKey = apiKey || config.geminiApiKey;

//   if (!effectiveApiKey) {
//     throw new Error(
//       "Gemini API key is required. Please provide an API key or set it in your environment variables."
//     );
//   }

//   // Trim text if it's too long (Gemini has input limits)
//   const trimmedText =
//     resumeText.length > 30000
//       ? resumeText.substring(0, 30000) + "..."
//       : resumeText;

//   const standardPrompt = `Please analyze the following resume text and return a JSON object with the structured information that matches this exact schema for a professional resume template:

// {
//   "profile": {
//     "name": "Full Name",
//     "title": "PROFESSIONAL TITLE IN CAPS",
//     "location": "city",
//     "clearance": "Security clearance level (e.g., NV1, Baseline) or null if not mentioned",
//     "description": "First paragraph of professional summary focusing on background, experience, and key strengths",
//     "description2": "Second paragraph of professional summary focusing on additional experience, skills, and suitability for roles"
//   },
//   "contact": {
//     "email": "email@example.com or null if not provided",
//     "phone": "+61 XXX XXX XXX or null if not provided",
//     "linkedin": "LinkedIn profile URL or null if not provided"
//   },
//   "qualifications": ["List of degrees, certifications, and professional qualifications"],
//   "affiliations": ["Professional memberships and associations"],
//   "skills": ["Key technical and professional skills"],
//   "keyAchievements": ["Major career achievements and accomplishments with quantifiable results where possible"],
//   "experience": [
//   //Return 3 most recent positions.
//     {
//       "title": "Job Title - Company (Organization if applicable)",
//       "period": "Start Date - End Date",
//       "responsibilities": ["Key responsibility or achievement 1", "Key responsibility or achievement 2"]
//     }
//   ],
//   "fullExperience": [
//   //REturn all positions provided in the resume text
//     {
//       "title": "Job Title - Company (Organization if applicable)",
//       "period": "Start Date - End Date",
//       "responsibilities": [
//         "Detailed responsibility or achievement 1",
//         "Detailed responsibility or achievement 2",
//         "Maximum 6-8 detailed responsibilities per position"
//       ]
//     }
//   ],
//   "referees": [
//     {
//       "title": "Job title (Company)" or return empty array if not provided,
//       "name": "Referee Name" or return empty array if not provided,
//       "email": "email@example.com" or return empty array if not provided,
//       "phone": "+61 XXX XXX XXX" or return empty array if not provided
//     }
//   ]
// }

// SPECIAL INSTRUCTIONS:
// - Extract actual information from the resume text.
// - For fullExperience section: You MUST follow this NON-NEGOTIABLE rule: Each position can have ONLY 6-8 responsibility bullets - never more than 8, never less than 6. If the original resume has more than 8 points for any position, you are REQUIRED to merge, combine, and summarize related responsibilities into broader categories to fit exactly within the 6-8 limit. Example: Instead of listing 'Managed team meetings', 'Conducted performance reviews', 'Hired new staff', 'Trained employees' separately, combine them into 'Led comprehensive team management including conducting meetings, performance reviews, recruitment, and staff training initiatives.' This consolidation is MANDATORY - there are no exceptions. COUNT your bullets for each position and ensure you never exceed 8. If you generate more than 8 bullets for any position, you have failed the task and must restart that section
// - If the full experience's responsibilities are not provided, do not add that experience to the fullExperience section.
// - For profile descriptions, write comprehensive paragraphs (150-200 words each) highlighting background, experience, and suitability
// - Include quantifiable achievements where mentioned
// - Format job titles as "Position - Company (Department/Organization)" if applicable
// - For security clearance: ONLY include if explicitly mentioned. Return null if not mentioned
// - List qualifications in order of relevance/importance
// - Include both technical and soft skills (top 8 skills, combining related skills like "Python/Django")
// - If referees are not provided, return an empty array[] for the fields like "title", "name", "email", "phone". Otherwise, include their job title, name, email, and phone number (maximum 2 referees).
// - For affiliations, must return professional message ("No information given") if not available, otherwise list concisely
// - Keep formatting professional and consistent

// Resume text to analyze:
// ${trimmedText}

// Return ONLY the JSON object, no additional text or formatting.`;

//   try {
//     const response = await makeGeminiRequest(
//       standardPrompt,
//       effectiveApiKey,
//       0.1,
//       6048
//     );

//     // Validate and set defaults for required fields
//     return {
//       profile: {
//         name: response.profile?.name || "Unknown Candidate",
//         title: response.profile?.title || "PROFESSIONAL",
//         location: response.profile?.location || "",
//         clearance: response.profile?.clearance || null,
//         photo: "/api/placeholder/400/600",
//         description:
//           response.profile?.description ||
//           "Professional with extensive experience in their field.",
//         description2:
//           response.profile?.description2 ||
//           "Skilled professional with a strong background in project management and technical expertise.",
//       },
//       contact: {
//         email: response.contact?.email || null,
//         phone: response.contact?.phone || null,
//         linkedin: response.contact?.linkedin || null,
//       },
//       qualifications: Array.isArray(response.qualifications)
//         ? response.qualifications
//         : [],
//       affiliations: Array.isArray(response.affiliations)
//         ? response.affiliations
//         : [],
//       skills: Array.isArray(response.skills) ? response.skills : [],
//       keyAchievements: Array.isArray(response.keyAchievements)
//         ? response.keyAchievements
//         : [],
//       experience: Array.isArray(response.experience)
//         ? response.experience.map((exp) => ({
//           title: exp.title || "Position",
//           period: exp.period || "Date not specified",
//           responsibilities: Array.isArray(exp.responsibilities)
//             ? exp.responsibilities
//             : [],
//         }))
//         : [],
//       fullExperience: Array.isArray(response.fullExperience)
//         ? response.fullExperience.map((exp) => ({
//           title: exp.title || "Position",
//           period: exp.period || "Date not specified",
//           responsibilities: Array.isArray(exp.responsibilities)
//             ? exp.responsibilities
//             : [],
//         }))
//         : [],
//       referees:
//         Array.isArray(response.referees) && response.referees.length > 0
//           ? response.referees.map((ref) => ({
//             name: ref?.name,
//             title: ref?.title,
//             email: ref?.email,
//             phone: ref?.phone,
//           }))
//           : null,
//     };
//   } catch (error) {
//     console.error("Error generating standard resume:", error);
//     throw error;
//   }
// }

/**
 * Standard resume generation (non-tailored) - Direct mapping version
 * @param {string} resumeText - The resume text content to map
 * @param {string} [apiKey] - Optional Google API key for Gemini (overrides config)
 * @returns {Promise<Object>} - A promise that resolves to the structured resume data
 */
export async function generateResumeJSON(resumeText, apiKey = null) {
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error(
      "Gemini API key is required. Please provide an API key or set it in your environment variables."
    );
  }

  // Trim text if it's too long (Gemini has input limits)
  const trimmedText =
    resumeText.length > 30000
      ? resumeText.substring(0, 30000) + "..."
      : resumeText;

  const standardPrompt = `Please extract and map the following resume text into a JSON object with the structured information that matches this exact schema. DO NOT summarize, analyze, or rewrite any content - extract the EXACT text as it appears in the original resume:

{
  "profile": {
  //Return all the exact text from the original file for the profile section. 
  //For the description and description2, do not missing any text. Note that the input may have multiple paragraphs. 
  
    "name": "Full Name",
    "title": "PROFESSIONAL TITLE IN CAPS",
    "location": "city",
    "clearance": "Security clearance level (e.g., NV1, Baseline) or null if not mentioned",
    "description": "First paragraph of professional summary - extract exact text, each description around 150-200 words",
    "description2": "Second paragraph of professional summary - extract exact text, each description around 150-200 words"
  },
  "contact": {
    "email": "email@example.com or null if not provided",
    "phone": "+61 XXX XXX XXX or null if not provided", 
    "linkedin": "LinkedIn profile URL or null if not provided"
  },
  "qualifications": ["List of degrees, certifications, and professional qualifications - exact text"],
  "affiliations": ["Professional memberships and associations - exact text"],
  "skills": [
  //Return all the skills in the original file
  "Key technical and professional skills - exact text"],
  "keyAchievements": ["Major career achievements and accomplishments - exact text as listed"],
  "experience": [
  //Return the exact text from the original file for the relevant experience section (this should be the concise/relevant experience section)
  //Return all the relevant experience sections in the original file
    {
      "title": "Job Title - Company (Organization if applicable) - exact text",
      "period": "Start Date - End Date - exact text",
      "responsibilities": ["Exact responsibility text 1", "Exact responsibility text 2"]
    }
  ],
  "fullExperience": [
  //Return all positions provided in the resume text with exact text (this should be the detailed version of the experience section)
    {
      "title": "Job Title - Company (Organization if applicable) - exact text",
      "period": "Start Date - End Date - exact text",
      "responsibilities": [
        "Exact responsibility text 1 as written in original",
        "Exact responsibility text 2 as written in original",
        "Copy ALL responsibility bullets exactly as they appear - do not limit to 6-8"
      ]
    }
  ],
  "referees": [
    {
      "title": "Job title (Company) - exact text" or return empty array if not provided,
      "name": "Referee Name - exact text" or return empty array if not provided, 
      "email": "email@example.com - exact text" or return empty array if not provided,
      "phone": "+61 XXX XXX XXX - exact text" or return empty array if not provided
    }
  ]
}

CRITICAL INSTRUCTIONS - DIRECT MAPPING ONLY:
- DO NOT analyze, summarize, rewrite, or modify ANY text from the original resume.
- If the original text from resume has "-" or "+" or "." as the bullet point, neglect those bullets and only extract the text as it is, not the bullet point.
- Extract and copy the EXACT words, phrases, and sentences as they appear
- DO NOT combine, merge, or consolidate any bullet points or responsibilities.
- For relevant experience, copy the exact text from the original resume.
- DO NOT limit the number of responsibility bullets - include ALL as they appear
- DO NOT paraphrase or reword anything - use the precise original text
- If text spans multiple lines or bullets, copy each one exactly as a separate item
- Maintain original formatting, capitalization, and punctuation where possible
- If a section is not present in the resume, return null or empty array as specified
- For profile descriptions: Copy the exact text of any professional summary/objective sections
- For experience: Copy every single bullet point/responsibility exactly as written
- For skills: Copy the exact skill names/descriptions as listed
- For qualifications: Copy degree names, institution names, and dates exactly
- If referees are not provided, return empty array for the fields. If provided, copy exact details
- For affiliations: Copy exact organization names and membership details, or return "No information given" if not available

Your job is purely extraction and mapping - you are NOT an editor or summarizer.

Resume text to extract from:
${trimmedText}

Return ONLY the JSON object, no additional text or formatting.`;

  try {
    const response = await makeGeminiRequest(
      standardPrompt,
      effectiveApiKey,
      0.1,
      6048
    );

    // Validate and set defaults for required fields
    return {
      profile: {
        name: response.profile?.name || "Unknown Candidate",
        title: response.profile?.title || "PROFESSIONAL",
        location: response.profile?.location || "",
        clearance: response.profile?.clearance || null,
        photo: "/api/placeholder/400/600",
        description:
          response.profile?.description ||
          "Professional with extensive experience in their field.",
        description2:
          response.profile?.description2 ||
          "Skilled professional with a strong background in project management and technical expertise.",
      },
      contact: {
        email: response.contact?.email || null,
        phone: response.contact?.phone || null,
        linkedin: response.contact?.linkedin || null,
      },
      qualifications: Array.isArray(response.qualifications)
        ? response.qualifications
        : [],
      affiliations: Array.isArray(response.affiliations)
        ? response.affiliations
        : [],
      skills: Array.isArray(response.skills) ? response.skills : [],
      keyAchievements: Array.isArray(response.keyAchievements)
        ? response.keyAchievements
        : [],
      experience: Array.isArray(response.experience)
        ? response.experience.map((exp) => ({
            title: exp.title || "Position",
            period: exp.period || "Date not specified",
            responsibilities: Array.isArray(exp.responsibilities)
              ? exp.responsibilities
              : [],
          }))
        : [],
      fullExperience: Array.isArray(response.fullExperience)
        ? response.fullExperience.map((exp) => ({
            title: exp.title || "Position",
            period: exp.period || "Date not specified",
            responsibilities: Array.isArray(exp.responsibilities)
              ? exp.responsibilities
              : [],
          }))
        : [],
      referees:
        Array.isArray(response.referees) && response.referees.length > 0
          ? response.referees.map((ref) => ({
              name: ref?.name,
              title: ref?.title,
              email: ref?.email,
              phone: ref?.phone,
            }))
          : null,
    };
  } catch (error) {
    console.error("Error generating standard resume:", error);
    throw error;
  }
}

// Update your existing generateTailoredResumeJSON function to use the new pipeline
export async function generateTailoredResumeJSON(
  resumeText,
  jobDescription,
  apiKey = null
) {
  if (!jobDescription || jobDescription.trim() === "") {
    throw new Error(
      "Job description is required for tailored resume generation."
    );
  }

  // Use the new three-step pipeline
  return await generateCompetitiveTenderResume(
    resumeText,
    jobDescription,
    apiKey
  );
}

export async function generateTenderResponse(
  tailoredResume,
  jobDescription,
  jobAnalysis,
  apiKey = null
) {
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error("Gemini API key is required.");
  }

  // Detect sector from job description and analysis
  const sectorKeywords = {
    ICT: [
      "ICT",
      "IT",
      "information technology",
      "digital",
      "software",
      "systems",
      "technology",
    ],
    Defence: [
      "defence",
      "defense",
      "military",
      "security",
      "army",
      "navy",
      "air force",
      "ADF",
    ],
    Finance: [
      "finance",
      "financial",
      "accounting",
      "treasury",
      "budget",
      "fiscal",
      "economic",
    ],
    Health: [
      "health",
      "medical",
      "healthcare",
      "hospital",
      "clinical",
      "patient",
    ],
    Education: [
      "education",
      "school",
      "university",
      "teaching",
      "academic",
      "student",
    ],
    Infrastructure: [
      "infrastructure",
      "construction",
      "engineering",
      "transport",
      "roads",
    ],
    Environment: [
      "environment",
      "sustainability",
      "climate",
      "conservation",
      "renewable",
    ],
    Legal: [
      "legal",
      "law",
      "judicial",
      "court",
      "legislation",
      "compliance",
      "regulatory",
    ],
  };

  const jobText = (jobDescription + JSON.stringify(jobAnalysis)).toLowerCase();
  let detectedSector = "Government";
  let sectorTerminology = "professional";

  for (const [sector, keywords] of Object.entries(sectorKeywords)) {
    if (keywords.some((keyword) => jobText.includes(keyword))) {
      detectedSector = sector;
      sectorTerminology = sector.toLowerCase();
      break;
    }
  }

  // Check if RFQ analysis has desirable criteria
  const hasDesirableCriteria =
    jobAnalysis?.desirableCriteria &&
    Array.isArray(jobAnalysis.desirableCriteria) &&
    jobAnalysis.desirableCriteria.length > 0;

  const prompt = `You are an expert government tender response specialist creating a comprehensive Criteria Statement for ${detectedSector} sector procurement. Using the provided tailored resume and RFQ requirements, create a professional tender response that demonstrates how the candidate meets each criterion with specific examples and evidence. . Create a comprehensive tender response that addresses each criterion EXACTLY as specified in the RFQ analysis. Use the dynamic criteria structure provided to create responses that match the specific requirements.
  
  🎯 ORIGINAL JOB DESCRIPTION/RFQ:
  ${jobDescription}
  
  📊 RFQ ANALYSIS:
  ${JSON.stringify(jobAnalysis, null, 2)}
  
  👤 TAILORED RESUME DATA:
  ${JSON.stringify(tailoredResume, null, 2)}
  
  🏆 CRITERIA STATEMENT STRUCTURE:
  
  Create a JSON object that follows this exact structure for a ${detectedSector} Criteria Statement:
  
  {
    "candidateDetails": {
      "name": "Candidate's full name from resume",
      "proposedRole": "Application Response to [specific role/project name from RFQ]",
      "clearance": "Security clearance level or eligibility status (if applicable to sector)",
      "availability": "Availability statement"
    },
      "essentialCriteria": [
    {
      "criteriaTitle": "Summary",
      "criteriaDescription": "Overall summary of the candidate's qualifications relevant to the essential criteria",
      "response": "Summary response (100–200 words) focusing on overall qualifications, strengths, and alignment with the role"
    },
    {
      "criteriaTitle": "Exact title from RFQ analysis. For example: if the RFQ has a title like 'Demonstrated Experience in Project Management', use that exact title",
      "criteriaDescription": "Full criteria text from RFQ (for reference)",
      "response": "Detailed response (150-300 words) directly addressing this specific criterion using candidate's experience and RFQ keywords"
    // Repeat for each essential criterion from RFQ analysis
    }
    ],
     "desirableCriteria": [
        ${
          hasDesirableCriteria
            ? `
        {
        "criteriaTitle": "Summary",
        "criteriaDescription": "Overall summary of the candidate's qualifications relevant to the desirable criteria",
        "response": "Summary response (100–200 words) highlighting how the candidate exceeds desirable expectations and offers added value"
        },
        {
        "criteriaTitle": "Exact title from RFQ analysis. For example: if the RFQ has a title like 'Experience with Agile Methodologies', use that exact title", 
        "criteriaDescription": "Full criteria text from RFQ (for reference)",
        "response": "Detailed response (100-200 words) addressing this specific criterion"
        }
        // Repeat for each desirable criterion from RFQ analysis
        `
            : `
        // CRITICAL: If RFQ analysis shows NO desirable criteria, return EMPTY ARRAY []
        // DO NOT CREATE desirable criteria if none exist in the RFQ analysis
        `
        }
    ],
    "additionalInformation": [
      {
        "criteria": "Security Clearance Status${
          detectedSector === "Defence"
            ? " (Essential for Defence roles)"
            : detectedSector === "ICT"
            ? " (Often required for government ICT)"
            : " (If applicable)"
        }",
        "response": "Clear statement about current clearance level and ability to obtain/maintain required clearance${
          detectedSector === "Defence"
            ? ", including any special defence clearances"
            : ""
        }"
      },
      {
        "criteria": "Availability and Start Date",
        "response": "Specific availability information and earliest possible start date for this ${detectedSector} role"
      },
      {
        "criteria": "Previous Experience with ${
          detectedSector === "Defence"
            ? "Defence/Military Projects"
            : detectedSector === "ICT"
            ? "Government/Defence ICT Projects"
            : detectedSector === "Finance"
            ? "Government/Public Sector Finance"
            : `Government/${detectedSector} Projects`
        }",
        "response": "Details of any previous ${sectorTerminology} work with government or relevant organizations, including duration and nature of projects"
      }
    ],
        "roleTitle": "Exact job title from RFQ",
        "rfqNumber": "RFQ/tender reference number"
  }
  
  🔥 CRITICAL WRITING GUIDELINES:

  🚨 CRITICAL DESIRABLE CRITERIA RULES:
    1. IF NO DESIRABLE CRITERIA IN RFQ ANALYSIS: Return desirableCriteria as an empty array []
    2. IF DESIRABLE CRITERIA EXIST IN RFQ ANALYSIS: Create detailed responses for each one
    3. NEVER CREATE FICTIONAL DESIRABLE CRITERIA: Only use what's explicitly in the RFQ analysis
    4. CONDITIONAL LOGIC: Check jobAnalysis.desirableCriteria array length before creating responses
  
  **CONTENT REQUIREMENTS:**
  - Write exclusively in third-person perspective using the candidate's full name
  - Never use "I", "my", "me" - always use "[Name] has...", "They demonstrate...", etc.
  - Provide specific examples from the candidate's actual experience
  - Include quantifiable achievements and metrics where possible
  - Use professional, confident language appropriate for government evaluation
  - Reference specific technologies, methodologies, and frameworks from their background
  - Tailor language to ${detectedSector} sector terminology and requirements
  
  **RESPONSE STRUCTURE:**
  - Essential "Skills, Knowledge, and Experience" should be the longest and most detailed response
  - Use bullet points with headers for key competency areas in the skills section
  - Each desirable criteria response should be substantial but concise
  - Include specific project names, organizations, and outcomes from their resume
  - Demonstrate clear understanding of the role and ${detectedSector} sector requirements
  
  **QUALITY STANDARDS:**
  - Summary responses: 100-200 words focusing on overall qualifications
  - Skills response: 400-500 words with detailed competency breakdowns
  - Achievement responses: Include 3-4 specific, quantifiable accomplishments
  - Desirable responses: 120-150 words each with concrete examples
  - All responses must be grounded in actual resume content
  - Remove any markdown formatting like "**text**" - use plain text only
  
  **GOVERNMENT TENDER OPTIMIZATION:**
  - Use terminology from the RFQ and job analysis
  - Address evaluation criteria systematically
  - Demonstrate value to government/${detectedSector} objectives
  - Show compliance and governance awareness
  - Highlight relevant ${detectedSector} sector experience and understanding
  - Reference industry standards and frameworks relevant to ${detectedSector}
  
  **FORMATTING REQUIREMENTS:**
  - Professional language suitable for ${detectedSector} procurement evaluation
  - Use bullet points strategically in the skills section
  - Include specific timeframes, project scales, and team sizes
  - Reference leadership experience with team size numbers
  - Maintain consistent professional tone throughout
  - Use ${detectedSector}-specific terminology where appropriate
  
  🚨 MANDATORY RULES:
  - All content must be truthful and based on actual resume information
  - Use exact project names, companies, and roles from the resume
  - Include specific years of experience and quantifiable metrics
  - Reference security clearance accurately as stated in resume (especially important for ${
    detectedSector === "Defence" ? "Defence roles" : "government roles"
  })
  - Maintain professional government tender standards
  - Every response must demonstrate specific competency for the role
  - Adapt examples to highlight ${detectedSector} sector relevance
  
  🎯 EXTRACTION STRATEGY:
  1. Map resume experience to each essential and desirable criterion
  2. Extract specific achievements that demonstrate required competencies
  3. Use quantifiable results and project outcomes as evidence
  4. Reference multiple roles if they provide supporting evidence
  5. Demonstrate progression and growth in capabilities
  6. Emphasize ${detectedSector} sector knowledge and experience where available
  7. Highlight transferable skills for cross-sector applications
  
  Return ONLY the JSON object, no additional text.`;

  try {
    const response = await makeGeminiRequest(
      prompt,
      effectiveApiKey,
      0.15,
      8192
    );
    return response;
  } catch (error) {
    console.error("Error generating Tender Response:", error);
    throw new Error(`Tender Response generation failed: ${error.message}`);
  }
}

/**
 * Updated generateProposalSummary function to match your examples exactly
 */
export async function generateProposalSummary(
  tenderResponseData,
  jobDescription,
  jobAnalysis,
  apiKey = null
) {
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error("Gemini API key is required.");
  }

  // Detect sector from job description and analysis
  const sectorKeywords = {
    ICT: [
      "ICT",
      "IT",
      "information technology",
      "digital",
      "software",
      "systems",
      "technology",
    ],
    Defence: [
      "defence",
      "defense",
      "military",
      "security",
      "army",
      "navy",
      "air force",
      "ADF",
    ],
    Maritime: [
      "maritime",
      "marine",
      "vessel",
      "ship",
      "port",
      "navigation",
      "safety authority",
    ],
    Finance: [
      "finance",
      "financial",
      "accounting",
      "treasury",
      "budget",
      "fiscal",
      "economic",
    ],
    Health: [
      "health",
      "medical",
      "healthcare",
      "hospital",
      "clinical",
      "patient",
    ],
    Education: [
      "education",
      "school",
      "university",
      "teaching",
      "academic",
      "student",
    ],
    Infrastructure: [
      "infrastructure",
      "construction",
      "engineering",
      "transport",
      "roads",
    ],
    Environment: [
      "environment",
      "sustainability",
      "climate",
      "conservation",
      "renewable",
    ],
    Legal: [
      "legal",
      "law",
      "judicial",
      "court",
      "legislation",
      "compliance",
      "regulatory",
    ],
  };

  const jobText = (jobDescription + JSON.stringify(jobAnalysis)).toLowerCase();
  let detectedSector = "Government";

  for (const [sector, keywords] of Object.entries(sectorKeywords)) {
    if (keywords.some((keyword) => jobText.includes(keyword))) {
      detectedSector = sector;
      break;
    }
  }

  const prompt = `You are an expert government tender response specialist creating a comprehensive, executive-level Proposal Summary for ${detectedSector} sector procurement that directly addresses RFQ requirements with detailed professional content.
  
  🎯 ORIGINAL RFQ/JOB DESCRIPTION:
  ${jobDescription}
  
  📊 RFQ ANALYSIS:
  ${JSON.stringify(jobAnalysis, null, 2)}
  
  📋 TENDER RESPONSE DATA:
  ${JSON.stringify(tenderResponseData, null, 2)}
  
  🏆 REQUIRED OUTPUT FORMAT:
  
  Create a JSON object with this exact structure:
  
  {
    "roleTitle": "Exact job title from RFQ",
    "rfqNumber": "RFQ/tender reference number",
    "candidateDetails": {
      "name": "Candidate's full name from tender response",
      "proposedRole": "Application Response to [specific role/project name from RFQ]",
      "clearance": "Security clearance level or eligibility status",
      "availability": "Availability statement from tender response",
      "responseFormat": "Proposal Summary"
    },
    "proposalSummary": {
      "title": "Proposal Summary",
      "content": "A comprehensive 400-500 word professional summary structured as 5-6 distinct paragraphs separated by double line breaks (\\n\\n), each addressing a major aspect of the candidate's suitability for the RFQ requirements. Each paragraph should be 70-90 words and focus on a specific theme directly related to the essential criteria and RFQ needs. Format as: Paragraph1\\n\\nParagraph2\\n\\nParagraph3\\n\\nParagraph4\\n\\nParagraph5\\n\\nParagraph6"
    }
  }
  
  🔥 CRITICAL WRITING GUIDELINES:
  
  **CONTENT STRUCTURE - MANDATORY 5-6 PARAGRAPH FORMAT:**
  
  **Paragraph 1: Company Nomination & Professional Overview (70-90 words)**
  - Open with "PappsPM is pleased to nominate [Name] for the position of [exact role] for [organization] under [RFQ number]"
  - Include total years of experience in relevant field
  - Highlight sector-specific background (government, ${detectedSector}, etc.)
  - Mention key professional strengths that align with RFQ objectives
  - Reference unique value proposition for this specific role
  
  **Paragraph 2: Essential Criteria Compliance & Recent Leadership (70-90 words)**
  - Detail how candidate meets the most critical essential criteria from RFQ analysis
  - Reference specific recent roles and leadership positions
  - Include quantifiable achievements and project outcomes
  - Mention team sizes, project values, and organizational impact
  - Use exact terminology from RFQ essential criteria
  - Highlight ${detectedSector}-specific experience and understanding
  
  **Paragraph 3: Technical Qualifications & Methodological Expertise (70-90 words)**
  - Detail certifications, qualifications, and professional credentials
  - Reference specific methodologies mentioned in RFQ (Agile, PRINCE2, etc.)
  - Include technology platforms and technical frameworks relevant to role
  - Mention compliance frameworks and governance standards experience
  - Highlight training and professional development relevant to ${detectedSector}
  - Connect technical skills directly to RFQ technical requirements
  
  **Paragraph 4: Stakeholder Management & Delivery Excellence (70-90 words)**
  - Demonstrate stakeholder engagement and communication capabilities
  - Reference cross-functional collaboration and matrix management experience
  - Include vendor management, procurement, and contract administration experience
  - Highlight risk management and quality assurance capabilities
  - Mention change management and business transformation experience
  - Connect to RFQ requirements for stakeholder engagement and delivery management
  
  **Paragraph 5: RFQ-Specific Value Delivery & Sector Understanding (70-90 words)**
  - Address desirable criteria and competitive advantages
  - Demonstrate deep understanding of ${detectedSector} sector challenges
  - Reference government processes, compliance requirements, and policy frameworks
  - Include specific outcomes and benefits delivered in similar roles
  - Highlight innovation, efficiency improvements, and strategic contributions
  - Connect candidate's experience to specific project/role objectives from RFQ
  
  **Paragraph 6: Compliance, Availability & Confidence Statement (70-90 words)**
  - Confirm security clearance status and ability to obtain required level
  - State availability and start date alignment with RFQ timeline
  - Reference citizenship requirements and location compliance
  - Include any additional compliance factors (COVID policies, etc.)
  - Express confidence in delivery outcomes and organizational benefits
  - Close with commitment to ${detectedSector} objectives and mission success
  
  **QUALITY STANDARDS:**
  - Each paragraph must be 70-90 words (strict requirement)
  - Address different aspects of candidacy - no repetition between paragraphs
  - Use third-person perspective throughout with candidate's full name
  - Extract specific details from tender response criteria answers
  - Include quantifiable metrics, project names, and organizational achievements
  - Use professional government tender language appropriate for ${detectedSector}
  - Directly reference RFQ essential and desirable criteria terminology
  - Maintain flow between paragraphs while keeping distinct themes
  
  **RFQ ALIGNMENT REQUIREMENTS:**
  - Paragraph themes must directly address the essential criteria from RFQ analysis
  - Use exact terminology and keywords from the RFQ document
  - Reference specific role requirements, responsibilities, and expectations
  - Address evaluation criteria systematically across the paragraphs
  - Demonstrate clear understanding of ${detectedSector} sector priorities
  - Show alignment with project objectives and organizational goals
  
  🚨 MANDATORY RULES:
  - EXACTLY 5-6 paragraphs, each 70-90 words
  - Each paragraph addresses different major competency area
  - Base all content on provided tender response data - no fabrication
  - Use specific achievements, roles, and metrics from criteria responses
  - Reference exact RFQ requirements and compliance statements
  - Include precise clearance status and availability information
  - Use ${detectedSector}-specific terminology and demonstrate sector knowledge
  - Maintain professional executive tone suitable for senior procurement evaluation
  - Ensure each paragraph has distinct focus - avoid overlap or repetition
  
  Return ONLY the JSON object, no additional text.`;

  try {
    const response = await makeGeminiRequest(
      prompt,
      effectiveApiKey,
      0.1,
      8192
    );
    return response;
  } catch (error) {
    console.error("Error generating Proposal Summary:", error);
    throw new Error(`Proposal Summary generation failed: ${error.message}`);
  }
}

/**
 * Alias for backward compatibility with ICT-specific naming
 */
export async function generateICTCriteriaStatement(
  tailoredResume,
  jobDescription,
  jobAnalysis,
  apiKey = null
) {
  return await generateTenderResponse(
    tailoredResume,
    jobDescription,
    jobAnalysis,
    apiKey
  );
}

/**
 * Utility function to detect the sector from job description
 */
export function detectSector(jobDescription, jobAnalysis) {
  const sectorKeywords = {
    ICT: [
      "ICT",
      "IT",
      "information technology",
      "digital",
      "software",
      "systems",
      "technology",
      "cyber",
    ],
    Defence: [
      "defence",
      "defense",
      "military",
      "security",
      "army",
      "navy",
      "air force",
      "ADF",
      "armed forces",
    ],
    Finance: [
      "finance",
      "financial",
      "accounting",
      "treasury",
      "budget",
      "fiscal",
      "economic",
      "revenue",
    ],
    Health: [
      "health",
      "medical",
      "healthcare",
      "hospital",
      "clinical",
      "patient",
      "nursing",
    ],
    Education: [
      "education",
      "school",
      "university",
      "teaching",
      "academic",
      "student",
      "curriculum",
    ],
    Infrastructure: [
      "infrastructure",
      "construction",
      "engineering",
      "transport",
      "roads",
      "utilities",
    ],
    Environment: [
      "environment",
      "sustainability",
      "climate",
      "conservation",
      "renewable",
      "green",
    ],
    Legal: [
      "legal",
      "law",
      "judicial",
      "court",
      "legislation",
      "compliance",
      "regulatory",
      "attorney",
    ],
  };

  const jobText = (jobDescription + JSON.stringify(jobAnalysis)).toLowerCase();

  for (const [sector, keywords] of Object.entries(sectorKeywords)) {
    if (keywords.some((keyword) => jobText.includes(keyword))) {
      return sector;
    }
  }

  return "Government"; // Default fallback
}

// Enhanced formatForTenderTemplate function with better desirable criteria handling
export function formatForTenderTemplate(rawTenderData) {
  // Ensure the data structure matches exactly what the template expects
  return {
    candidateDetails: {
      name: rawTenderData.candidateDetails?.name || "Candidate Name",
      proposedRole:
        rawTenderData.candidateDetails?.proposedRole || "Application Response",
      clearance: rawTenderData.candidateDetails?.clearance,
      availability: rawTenderData.candidateDetails?.availability,
    },
    essentialCriteria:
      rawTenderData.essentialCriteria?.map((criteria) => ({
        criteriaTitle:
          criteria.criteriaTitle ||
          criteria.title ||
          criteria.criteria ||
          criteria.requirement ||
          "",
        criteriaDescription:
          criteria.criteriaDescription || criteria.description || "",
        response: criteria.response,
      })) || [],
    // Enhanced desirable criteria handling - ensure empty array if no criteria
    desirableCriteria:
      rawTenderData.desirableCriteria &&
      Array.isArray(rawTenderData.desirableCriteria) &&
      rawTenderData.desirableCriteria.length > 0
        ? rawTenderData.desirableCriteria.map((criteria) => ({
            criteriaTitle:
              criteria.criteriaTitle ||
              criteria.title ||
              criteria.criteria ||
              criteria.requirement ||
              "",
            criteriaDescription:
              criteria.criteriaDescription || criteria.description || "",
            response: criteria.response,
          }))
        : [], // Explicitly return empty array if no desirable criteria
    additionalInformation:
      rawTenderData.additionalInformation?.map((info) => ({
        criteria: info.criteria || info.requirement,
        response: info.response,
      })) || [],
  };
}
