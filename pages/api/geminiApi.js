import config from "@/configs";

/**
 * Three-step pipeline for tailored resume generation
 * Step 1: Analyze job description
 * Step 2: Tailor resume based on analysis
 * Step 3: Refine and optimize the tailored resume
 * Step 4: Final keyword optimization and recruiter impact maximization
 */

/**
 * Step 1: Analyze the job description or tender request
 * @param {string} jobDescription - The job description to analyze
 * @param {string} [apiKey] - Optional API key
 * @returns {Promise<Object>} - Structured job analysis
 */
export async function analyzeJobDescription(jobDescription, apiKey = null) {
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error("Gemini API key is required.");
  }

  if (!jobDescription || jobDescription.trim() === "") {
    throw new Error("Job description is required for analysis.");
  }

  const prompt = `You are an expert HR analyst and recruitment specialist. Analyze the following job description or tender request and provide a comprehensive breakdown that will be used to tailor a candidate's resume.

Return a JSON object with this exact structure:

{
  "jobTitle": "The main job title or position",
  "industry": "The industry or sector",
  "companyType": "Type of organization (government, corporate, startup, etc.)",
  "keyResponsibilities": [
    "Primary responsibility 1",
    "Primary responsibility 2",
    "List 5-8 main responsibilities"
  ],
  "requiredTechnicalSkills": [
    "Technical skill 1",
    "Technical skill 2",
    "List all technical skills mentioned"
  ],
  "requiredSoftSkills": [
    "Soft skill 1",
    "Soft skill 2",
    "List all soft skills mentioned"
  ],
  "preferredQualifications": [
    "Qualification 1",
    "Qualification 2",
    "List degrees, certifications, experience levels"
  ],
  "mandatoryRequirements": [
    "Must-have requirement 1",
    "Must-have requirement 2",
    "List non-negotiable requirements"
  ],
  "desiredExperience": {
    "yearsRequired": "Number of years or range",
    "specificExperience": ["Type of experience 1", "Type of experience 2"],
    "industryExperience": "Specific industry experience if mentioned"
  },
  "keywordsAndPhrases": [
    "Important keyword 1",
    "Important phrase 2",
    "List 15-20 keywords/phrases that should appear in resume"
  ],
  "toneAndStyle": {
    "communicationStyle": "Professional tone expected (formal, collaborative, innovative, etc.)",
    "culturalFit": "Company culture indicators",
    "valueAlignment": "Values or principles mentioned"
  },
  "assessmentCriteria": [
    "How candidates will be evaluated - criterion 1",
    "How candidates will be evaluated - criterion 2"
  ],
  "priorityRanking": {
    "criticalSkills": ["Top 3-5 most important skills"],
    "niceToHaveSkills": ["Secondary skills that would be beneficial"],
    "dealBreakers": ["Things that would disqualify a candidate"]
  }
}

Instructions:
- Extract information ONLY from the provided job description
- Be comprehensive but accurate - don't invent requirements
- Focus on actionable insights for resume tailoring
- Identify both explicit and implicit requirements
- Consider ATS (Applicant Tracking System) keywords
- Note any specific formatting or presentation preferences mentioned


Job Description/Tender Request:
${jobDescription}

Return ONLY the JSON object, no additional text.`;

  try {
    const response = await makeGeminiRequest(
      prompt,
      effectiveApiKey,
      0.2,
      4096
    );
    return response;
  } catch (error) {
    console.error("Error in Step 1 - Job Analysis:", error);
    throw new Error(`Job analysis failed: ${error.message}`);
  }
}

/**
 * Step 2: Tailor resume based on job analysis
 * @param {string} resumeText - Original resume text
 * @param {Object} jobAnalysis - Output from Step 1
 * @param {string} [apiKey] - Optional API key
 * @returns {Promise<Object>} - Tailored resume JSON
 */
export async function tailorResumeToJob(
  resumeText,
  jobAnalysis,
  apiKey = null
) {
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error("Gemini API key is required.");
  }

  const prompt = `You are an elite resume strategist specializing in ATS optimization and recruiter psychology. Using the detailed job analysis provided, transform this candidate's resume into a perfectly tailored match for the target position.

🎯 JOB ANALYSIS:
${JSON.stringify(jobAnalysis, null, 2)}

🚀 STRATEGIC TAILORING APPROACH:

1. **KEYWORD OPTIMIZATION**: Integrate the identified keywords naturally throughout all sections
2. **PRIORITY ALIGNMENT**: Emphasize skills and experiences that match critical requirements
3. **NARRATIVE RESTRUCTURING**: Reframe experiences to highlight job-relevant value
4. **ATS COMPATIBILITY**: Ensure optimal keyword density and formatting
5. **RECRUITER APPEAL**: Create compelling, results-focused content

JSON SCHEMA - Every field strategically tailored:

{
  "profile": {
    "name": "Full Name",
    "title": "Professional title that aligns with target role terminology",
    "location": "Candidate's actual location (DO NOT change to match job location)",
    "clearance": "Security clearance level or null if not mentioned",
    "description": "150-200 words addressing top 3-4 job requirements with relevant keywords and proof points",
    "description2": "150-200 words showcasing additional value propositions and cultural fit indicators"
  },
  "contact": {
    "email": "email@example.com or null if not provided",
    "phone": "+61 XXX XXX XXX or null if not provided", 
    "linkedin": "LinkedIn profile URL or null if not provided"
  },
  "qualifications": ["Education/certifications prioritized by job relevance, using job terminology"],
  "affiliations": ["Professional memberships that signal industry credibility and alignment"],
  "skills": ["Top 8 skills in order of job importance - lead with critical requirements, combine related skills"],
  "keyAchievements": ["3 achievements that prove capability for specific job challenges - quantified and relevant"],
  "experience": [
    {
      "title": "Job Title - Company",
      "period": "Date Range",
      "responsibilities": ["4 power bullets showing direct relevance using job keywords and demonstrating required competencies"]
    },
      
  ],
  "fullExperience": [
    {
      "title": "Job Title - Company",
      "period": "Date Range", 
      "responsibilities": ["6-8 strategic bullets per role proving value for target position using job terminology and STAR method"]
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

🔥 CRITICAL TAILORING RULES:
- Use EXACT keywords and phrases from the job analysis
- For experience section, provide 2 most relevant positions to the requirements with 3-4 main bullet points each
- Prioritize experiences that match key responsibilities
- Quantify achievements relevant to the role
- Mirror the communication style and tone identified
- Address mandatory requirements prominently
- Emphasize critical skills in multiple sections
- Maintain authenticity - enhance, don't fabricate
- Location should remain candidate's actual location
- Include ALL work experiences in fullExperience
- For each position, include 6-8 responsibilities maximum
- Format job titles as "Position - Company (Department)" if applicable
- Security clearance: ONLY include if explicitly mentioned in original resume
- List qualifications in order of job relevance
- Include both technical and soft skills (top 8 skills)
- If referees not provided, return empty arrays for fields
- Keep formatting professional and consistent
- For experience section, provide 2 most impressive positions with 3-4 bullets each
- Include 3 most impressive and relevant achievements.
- For affiliations, must return professional message ("No information given") if not available, otherwise list concisely


CANDIDATE'S RESUME:
${resumeText}

Return ONLY the JSON object, no additional text.`;

  try {
    const response = await makeGeminiRequest(
      prompt,
      effectiveApiKey,
      0.3,
      8192
    );
    return response;
  } catch (error) {
    console.error("Error in Step 2 - Resume Tailoring:", error);
    throw new Error(`Resume tailoring failed: ${error.message}`);
  }
}

/**
 * Step 3: Refine and optimize the tailored resume
 * @param {Object} tailoredResume - Output from Step 2
 * @param {Object} jobAnalysis - Output from Step 1
 * @param {string} [apiKey] - Optional API key
 * @returns {Promise<Object>} - Refined resume JSON
 */
export async function refineeTailoredResume(
  tailoredResume,
  jobAnalysis,
  apiKey = null
) {
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error("Gemini API key is required.");
  }

  const prompt = `You are a senior resume optimization specialist conducting a final quality review. Analyze the tailored resume against the job requirements and make strategic refinements for maximum impact.

🎯 ORIGINAL JOB ANALYSIS:
${JSON.stringify(jobAnalysis, null, 2)}

📄 CURRENT TAILORED RESUME:
${JSON.stringify(tailoredResume, null, 2)}

🔍 OPTIMIZATION REVIEW CRITERIA:

1. **KEYWORD COVERAGE**: Ensure all critical keywords are naturally integrated
2. **PRIORITY ALIGNMENT**: Verify critical skills are prominently featured
3. **QUANTIFICATION**: Add specific metrics where possible
4. **FLOW & READABILITY**: Optimize for recruiter scanning patterns
5. **ATS OPTIMIZATION**: Perfect keyword density and formatting
6. **IMPACT AMPLIFICATION**: Strengthen weak bullets with action verbs and results
7. **GAP ANALYSIS**: Address any missing mandatory requirements
8. **CONSISTENCY**: Ensure terminology matches job description throughout

REFINEMENT FOCUS AREAS:
- Strengthen profile descriptions with more compelling value propositions
- Enhance bullet points with stronger action verbs and quantified results
- Optimize keyword placement and density
- Improve readability and recruiter appeal
- Address any gaps in addressing key requirements
- Ensure perfect alignment with assessment criteria

Return the refined resume using the SAME JSON structure as provided, with improvements made throughout:

{
  "profile": {
    "name": "Full Name (unchanged)",
    "title": "Optimized professional title",
    "location": "Candidate's actual location (DO NOT CHANGE)",
    "clearance": "Security clearance or null (unchanged from original)",
    "description": "Enhanced 150-200 word description with stronger value propositions and keyword optimization",
    "description2": "Refined 150-200 word second paragraph with improved flow and impact"
  },
  "contact": {
    "email": "Unchanged",
    "phone": "Unchanged", 
    "linkedin": "Unchanged"
  },
  "qualifications": ["Refined list optimized for job relevance"],
  "affiliations": ["Enhanced professional memberships list"] ,
  "skills": ["Optimized top 8 skills with perfect job alignment"],
  "keyAchievements": ["Strengthened 3 achievements with better quantification and relevance"],
  "experience": [
    {
      "title": "Unchanged",
      "period": "Unchanged",
      "responsibilities": ["Enhanced 4 bullets with stronger action verbs and results"]
    }
  ],
  "fullExperience": [
    {
      "title": "Unchanged",
      "period": "Unchanged", 
      "responsibilities": ["Refined 6-8 bullets with improved impact and keyword optimization"]
    }
  ],
  "referees": ["Unchanged array structure"]
}

🚨 MAINTAIN ALL ORIGINAL RULES:
- Location must remain candidate's actual location
- For experience section, provide 2 most relevant positions to the requirements with 3-4 main bullet points each
- Include ALL work experiences in fullExperience
- 6-8 responsibilities maximum per position
- Security clearance only if mentioned in original resume
- Professional formatting consistency
- Top 8 skills combining related technologies
- 3 most impressive achievements
- Empty arrays for missing referee information
- APPLY ALL THE JOB ANALYSIS INSIGHTS AND TAILORING STRATEGIES AND CRITICAL TAILORING RULES:

Return ONLY the refined JSON object, no additional text.`;

  try {
    const response = await makeGeminiRequest(
      prompt,
      effectiveApiKey,
      0.2,
      8192
    );
    return response;
  } catch (error) {
    console.error("Error in Step 3 - Resume Refinement:", error);
    throw new Error(`Resume refinement failed: ${error.message}`);
  }
}

/**
 * Step 4: Final keyword optimization and recruiter impact maximization
 * @param {Object} refinedResume - Output from Step 3
 * @param {Object} jobAnalysis - Output from Step 1
 * @param {string} originalJobDescription - Original job description text
 * @param {string} [apiKey] - Optional API key
 * @returns {Promise<Object>} - Final optimized resume JSON
 */
export async function maximizeRecruiterImpact(
  refinedResume,
  jobAnalysis,
  originalJobDescription,
  apiKey = null
) {
  const effectiveApiKey = apiKey || config.geminiApiKey;

  if (!effectiveApiKey) {
    throw new Error("Gemini API key is required.");
  }

  const prompt = `🚀 FINAL STAGE: RECRUITER IMPACT MAXIMIZATION & KEYWORD SATURATION
  
  You are the world's most elite resume strategist conducting the FINAL optimization round. Your mission: Transform this resume into an absolute show-stopper that makes recruiters think "I MUST interview this candidate immediately!"
  
  🎯 ORIGINAL JOB DESCRIPTION (for maximum keyword extraction):
  ${originalJobDescription}
  
  📊 JOB ANALYSIS INSIGHTS:
  ${JSON.stringify(jobAnalysis, null, 2)}
  
  📄 CURRENT REFINED RESUME:
  ${JSON.stringify(refinedResume, null, 2)}
  
  🔥 FINAL OPTIMIZATION PROTOCOL - MAKE THIS RESUME IRRESISTIBLE:
  
  1. **KEYWORD SATURATION ANALYSIS**:
     - Extract EVERY possible relevant keyword from the original job description
     - Integrate them naturally without keyword stuffing
     - Use synonyms and variations of key terms
     - Ensure 95%+ coverage of critical job description keywords
     - Include industry buzzwords and trending terminology
  
  2. **RECRUITER PSYCHOLOGY TRIGGERS**:
     - Create urgency: "This candidate will be snatched up quickly"
     - Show ROI potential: Quantify value in dollars, percentages, time saved
     - Demonstrate thought leadership and innovation
     - Use power words that trigger emotional responses
     - Create a narrative of inevitable success
  
  3. **ATS DOMINATION STRATEGY**:
     - Perfect keyword density (not too sparse, not stuffed)
     - Strategic placement in high-impact sections
     - Use exact phrases from job description where natural
     - Include relevant acronyms and their full forms
     - Optimize for search algorithm ranking
  
  4. **COMPELLING VALUE PROPOSITIONS**:
     - Lead with candidate's unique differentiators
     - Address the company's pain points directly
     - Show competitive advantages over other candidates
     - Demonstrate cultural fit and shared values
     - Create emotional connection through storytelling
  
  5. **IMPACT AMPLIFICATION TECHNIQUES**:
     - Transform passive descriptions into active achievements
     - Add specific numbers, metrics, and timeframes
     - Use powerful action verbs that convey leadership
     - Show progression and growth trajectory
     - Include forward-looking statements about potential contribution
  
  6. **RECRUITER SCANNING OPTIMIZATION**:
     - Front-load the most impressive information
     - Use impactful opening statements
     - Create visual hierarchy with strategic keyword placement
     - Ensure easy skimmability for busy recruiters
     - Make key qualifications jump off the page
  
  🎪 PSYCHOLOGICAL IMPACT STRATEGIES:
  
  **CONFIDENCE BUILDERS**:
  - Use assertive, confident language
  - Show mastery and expertise
  - Demonstrate thought leadership
  - Include recognition and achievements
  
  **CREDIBILITY INDICATORS**:
  - Quantify everything possible
  - Show consistent career progression
  - Include relevant certifications/affiliations
  - Demonstrate industry knowledge
  
  **URGENCY CREATORS**:
  - Show high performance and results
  - Indicate sought-after skills
  - Demonstrate market value
  - Create FOMO (fear of missing out)
  
  🏆 FINAL RESUME OUTPUT - RECRUITER MAGNET VERSION:
  
  {
    "profile": {
      "name": "Full Name (unchanged)",
      "title": "POWER-PACKED title with maximum keyword relevance",
      "location": "Candidate's actual location (DO NOT CHANGE)",
      "clearance": "Security clearance or null (unchanged from original)",
      "description": "HOOK THEM IMMEDIATELY: 150-200 words that scream 'HIRE ME NOW!' - packed with keywords, value propositions, and irresistible selling points",
      "description2": "SEAL THE DEAL: 150-200 words that create urgency, show ROI potential, and make them fear losing this candidate to competitors"
    },
    "contact": {
      "email": "Unchanged",
      "phone": "Unchanged", 
      "linkedin": "Unchanged"
    },
    "qualifications": ["Keyword-optimized qualifications that mirror job requirements exactly"],
    "affiliations": ["Strategic professional memberships that signal industry authority"],
    "skills": ["MAXIMUM IMPACT: Top 8 skills with perfect keyword matching and power combinations"],
    "keyAchievements": ["3 SHOW-STOPPING achievements that prove they're the perfect hire - heavily quantified and keyword-rich"],
    "experience": [
      {
        "title": "Unchanged",
        "period": "Unchanged",
        "responsibilities": ["4 KILLER bullets that make recruiters think 'this is exactly what we need' - maximum keyword density"]
      }
    ],
    "fullExperience": [
      {
        "title": "Unchanged",
        "period": "Unchanged", 
        "responsibilities": ["6-8 RECRUITER-MAGNET bullets per role - each one a mini-sales pitch proving perfect job fit"]
      }
    ],
    "referees": ["Unchanged array structure"]
  }
  
  🚨 CRITICAL SUCCESS FACTORS:
  
  **KEYWORD OPTIMIZATION**:
  - Use EVERY relevant keyword from the original job description
  - Include variations and synonyms naturally
  - Balance density without stuffing
  - Strategic placement for maximum ATS impact
  
  **RECRUITER APPEAL**:
  - Create immediate emotional impact
  - Show clear ROI and value proposition
  - Use power language and confident tone
  - Make them excited to meet this candidate
  
  **AUTHENTICITY PRESERVATION**:
  - Never fabricate experience or skills
  - Enhance presentation, don't invent content
  - Maintain professional credibility
  - Stay true to candidate's actual background
  
  **TECHNICAL COMPLIANCE**:
  - Location must remain candidate's actual location
  - For experience section, provide 2 most relevant positions to the requirements with 3-4 main bullet points each
  - Include ALL work experiences in fullExperience
  - 6-8 responsibilities maximum per position
  - Security clearance only if mentioned in original resume
  - Professional formatting consistency
  - Top 8 skills combining related technologies
  - 3 most impressive achievements
  - Empty arrays for missing referee information
  - For affiliations, must return professional message ("No information given") if not available, otherwise list concisely
  - APPLY ALL THE JOB ANALYSIS INSIGHTS AND TAILORING STRATEGIES AND CRITICAL TAILORING RULES

  🎯 MAKE THIS RESUME IMPOSSIBLE TO IGNORE!
  
  Return ONLY the final optimized JSON object, no additional text.`;

  try {
    const response = await makeGeminiRequest(
      prompt,
      effectiveApiKey,
      0.4,
      8192
    );
    return response;
  } catch (error) {
    console.error("Error in Step 4 - Final Optimization:", error);
    throw new Error(`Final optimization failed: ${error.message}`);
  }
}

/**
 * Complete four-step pipeline function
 * @param {string} resumeText - Original resume text
 * @param {string} jobDescription - Job description to tailor to
 * @param {string} [apiKey] - Optional API key
 * @returns {Promise<Object>} - Final optimized resume JSON
 */
export async function generateTailoredResumeThreeStep(
  resumeText,
  jobDescription,
  apiKey = null
) {
  try {
    console.log("🔍 Step 1: Analyzing job description...");
    const jobAnalysis = await analyzeJobDescription(jobDescription, apiKey);

    console.log("✏️ Step 2: Tailoring resume...");
    const tailoredResume = await tailorResumeToJob(
      resumeText,
      jobAnalysis,
      apiKey
    );

    console.log("🔧 Step 3: Refining tailored resume...");
    const refinedResume = await refineeTailoredResume(
      tailoredResume,
      jobAnalysis,
      apiKey
    );

    console.log("✅ Three-step tailoring complete!");

    const finalResume = await maximizeRecruiterImpact(
      refinedResume,
      jobAnalysis,
      jobDescription,
      apiKey
    );

    return finalResume;
  } catch (error) {
    console.error("Three-step pipeline error:", error);
    throw error;
  }
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

/**
 * Standard resume generation (non-tailored)
 * @param {string} resumeText - The resume text content to analyze
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
- For affiliations, must return professional message ("No information given") if not available, otherwise list concisely
- Keep formatting professional and consistent
- For experience section, provide 2 most impressive positions with 3-4 main bullet points each
- For keyAchievements, include 3 most impressive achievements

Resume text to analyze:
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
  return await generateTailoredResumeThreeStep(
    resumeText,
    jobDescription,
    apiKey
  );
}
