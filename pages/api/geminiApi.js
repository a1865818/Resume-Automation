// import config from "@/configs";

// /**
//  * Three-step pipeline for tailored resume generation
//  * Step 1: Analyze job description
//  * Step 2: Tailor resume based on analysis
//  * Step 3: Refine and optimize the tailored resume
//  */

// /**
//  * Step 1: Analyze the job description or tender request
//  * @param {string} jobDescription - The job description to analyze
//  * @param {string} [apiKey] - Optional API key
//  * @returns {Promise<Object>} - Structured job analysis
//  */
// export async function analyzeJobDescription(jobDescription, apiKey = null) {
//   const effectiveApiKey = apiKey || config.geminiApiKey;

//   if (!effectiveApiKey) {
//     throw new Error("Gemini API key is required.");
//   }

//   if (!jobDescription || jobDescription.trim() === "") {
//     throw new Error("Job description is required for analysis.");
//   }

//   const prompt = `You are an expert HR analyst and recruitment specialist. Analyze the following job description or tender request and provide a comprehensive breakdown that will be used to tailor a candidate's resume.

// Return a JSON object with this exact structure:

// {
//   "jobTitle": "The main job title or position",
//   "industry": "The industry or sector",
//   "companyType": "Type of organization (government, corporate, startup, etc.)",
//   "keyResponsibilities": [
//     "Primary responsibility 1",
//     "Primary responsibility 2",
//     "List 5-8 main responsibilities"
//   ],
//   "requiredTechnicalSkills": [
//     "Technical skill 1",
//     "Technical skill 2",
//     "List all technical skills mentioned"
//   ],
//   "requiredSoftSkills": [
//     "Soft skill 1",
//     "Soft skill 2",
//     "List all soft skills mentioned"
//   ],
//   "preferredQualifications": [
//     "Qualification 1",
//     "Qualification 2",
//     "List degrees, certifications, experience levels"
//   ],
//   "mandatoryRequirements": [
//     "Must-have requirement 1",
//     "Must-have requirement 2",
//     "List non-negotiable requirements"
//   ],
//   "desiredExperience": {
//     "yearsRequired": "Number of years or range",
//     "specificExperience": ["Type of experience 1", "Type of experience 2"],
//     "industryExperience": "Specific industry experience if mentioned"
//   },
//   "keywordsAndPhrases": [
//     "Important keyword 1",
//     "Important phrase 2",
//     "List 15-20 keywords/phrases that should appear in resume"
//   ],
//   "toneAndStyle": {
//     "communicationStyle": "Professional tone expected (formal, collaborative, innovative, etc.)",
//     "culturalFit": "Company culture indicators",
//     "valueAlignment": "Values or principles mentioned"
//   },
//   "assessmentCriteria": [
//     "How candidates will be evaluated - criterion 1",
//     "How candidates will be evaluated - criterion 2"
//   ],
//   "priorityRanking": {
//     "criticalSkills": ["Top 3-5 most important skills"],
//     "niceToHaveSkills": ["Secondary skills that would be beneficial"],
//     "dealBreakers": ["Things that would disqualify a candidate"]
//   }
// }

// Instructions:
// - Extract information ONLY from the provided job description
// - Be comprehensive but accurate - don't invent requirements
// - Focus on actionable insights for resume tailoring
// - Identify both explicit and implicit requirements
// - Consider ATS (Applicant Tracking System) keywords
// - Note any specific formatting or presentation preferences mentioned

// Job Description/Tender Request:
// ${jobDescription}

// Return ONLY the JSON object, no additional text.`;

//   try {
//     const response = await makeGeminiRequest(
//       prompt,
//       effectiveApiKey,
//       0.15,
//       4096
//     );
//     return response;
//   } catch (error) {
//     console.error("Error in Step 1 - Job Analysis:", error);
//     throw new Error(`Job analysis failed: ${error.message}`);
//   }
// }

// /**
//  * Step 2: Tailor resume based on job analysis
//  * @param {string} resumeText - Original resume text
//  * @param {Object} jobAnalysis - Output from Step 1
//  * @param {string} [apiKey] - Optional API key
//  * @returns {Promise<Object>} - Tailored resume JSON
//  */
// export async function tailorResumeToJob(
//   resumeText,
//   jobAnalysis,
//   apiKey = null
// ) {
//   const effectiveApiKey = apiKey || config.geminiApiKey;

//   if (!effectiveApiKey) {
//     throw new Error("Gemini API key is required.");
//   }

//   const prompt = `You are an elite resume strategist specializing in ATS optimization and recruiter psychology. Using the detailed job analysis provided, transform this candidate's resume into a perfectly tailored match for the target position.

// 🎯 JOB ANALYSIS:
// ${JSON.stringify(jobAnalysis, null, 2)}

// 🚀 STRATEGIC TAILORING APPROACH:

// 1. **KEYWORD OPTIMIZATION**: Integrate the identified keywords naturally throughout all sections
// 2. **PRIORITY ALIGNMENT**: Emphasize skills and experiences that match critical requirements
// 3. **NARRATIVE RESTRUCTURING**: Reframe experiences to highlight job-relevant value
// 4. **ATS COMPATIBILITY**: Ensure optimal keyword density and formatting
// 5. **RECRUITER APPEAL**: Create compelling, results-focused content

// JSON SCHEMA - Every field strategically tailored:

// {
//   "profile": {
//     "name": "Full Name",
//     "title": "Professional title that aligns with target role terminology",
//     "location": "Candidate's actual location (DO NOT change to match job location)",
//     "clearance": "Security clearance level or null if not mentioned",
//     "description": "150-200 words addressing top 3-4 job requirements with relevant keywords and proof points",
//     "description2": "150-200 words showcasing additional value propositions and cultural fit indicators"
//   },
//   "contact": {
//     "email": "email@example.com or null if not provided",
//     "phone": "+61 XXX XXX XXX or null if not provided",
//     "linkedin": "LinkedIn profile URL or null if not provided"
//   },
//   "qualifications": ["Education/certifications prioritized by job relevance, using job terminology"],
//   "affiliations": ["Professional memberships that signal industry credibility and alignment"],
//   "skills": ["Top 8 skills in order of job importance - lead with critical requirements, combine related skills"],
//   "keyAchievements": ["3 achievements that prove capability for specific job challenges - quantified and relevant"],
//   "experience": [
//     {
//       "title": "Job Title - Company",
//       "period": "Date Range",
//       "responsibilities": ["4 power bullets showing direct relevance using job keywords and demonstrating required competencies"]
//     },

//   ],
//   "fullExperience": [
//     {
//       "title": "Job Title - Company",
//       "period": "Date Range",
//       "responsibilities": ["6-8 strategic bullets per role proving value for target position using job terminology and STAR method"]
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

// 🔥 CRITICAL TAILORING RULES:
// - Use EXACT keywords and phrases from the job analysis
// - For experience section, provide 2 most relevant positions to the requirements with 3-4 main bullet points each
// - Prioritize experiences that match key responsibilities
// - Quantify achievements relevant to the role
// - Mirror the communication style and tone identified
// - Address mandatory requirements prominently
// - Emphasize critical skills in multiple sections
// - Maintain authenticity - enhance, don't fabricate
// - Location should remain candidate's actual location
// - Include ALL work experiences in fullExperience
// - For each position, include 6-8 responsibilities maximum
// - Format job titles as "Position - Company (Department)" if applicable
// - Security clearance: ONLY include if explicitly mentioned in original resume
// - List qualifications in order of job relevance
// - Include both technical and soft skills (top 8 skills)
// - If referees not provided, return empty arrays for fields
// - Keep formatting professional and consistent
// - For experience section, provide 2 most impressive positions with 3-4 bullets each
// - Include 3 most impressive and relevant achievements.
// - For affiliations, must return professional message ("No information given") if not available, otherwise list concisely

// CANDIDATE'S RESUME:
// ${resumeText}

// Return ONLY the JSON object, no additional text.`;

//   try {
//     const response = await makeGeminiRequest(
//       prompt,
//       effectiveApiKey,
//       0.15,
//       8192
//     );
//     return response;
//   } catch (error) {
//     console.error("Error in Step 2 - Resume Tailoring:", error);
//     throw new Error(`Resume tailoring failed: ${error.message}`);
//   }
// }

// /**
//  * Step 3: Refine and optimize the tailored resume
//  * @param {Object} tailoredResume - Output from Step 2
//  * @param {Object} jobAnalysis - Output from Step 1
//  * @param {string} [apiKey] - Optional API key
//  * @returns {Promise<Object>} - Refined resume JSON
//  */
// export async function refineeTailoredResume(
//   tailoredResume,
//   jobAnalysis,
//   apiKey = null
// ) {
//   const effectiveApiKey = apiKey || config.geminiApiKey;

//   if (!effectiveApiKey) {
//     throw new Error("Gemini API key is required.");
//   }

//   const prompt = `You are a senior resume optimization specialist conducting a final quality review. Analyze the tailored resume against the job requirements and make strategic refinements for maximum impact.

// 🎯 ORIGINAL JOB ANALYSIS:
// ${JSON.stringify(jobAnalysis, null, 2)}

// 📄 CURRENT TAILORED RESUME:
// ${JSON.stringify(tailoredResume, null, 2)}

// 🔍 OPTIMIZATION REVIEW CRITERIA:

// 1. **KEYWORD COVERAGE**: Ensure all critical keywords are naturally integrated
// 2. **PRIORITY ALIGNMENT**: Verify critical skills are prominently featured
// 3. **QUANTIFICATION**: Add specific metrics where possible
// 4. **FLOW & READABILITY**: Optimize for recruiter scanning patterns
// 5. **ATS OPTIMIZATION**: Perfect keyword density and formatting
// 6. **IMPACT AMPLIFICATION**: Strengthen weak bullets with action verbs and results
// 7. **GAP ANALYSIS**: Address any missing mandatory requirements
// 8. **CONSISTENCY**: Ensure terminology matches job description throughout

// REFINEMENT FOCUS AREAS:
// - Strengthen profile descriptions with more compelling value propositions
// - Enhance bullet points with stronger action verbs and quantified results
// - Optimize keyword placement and density
// - Improve readability and recruiter appeal
// - Address any gaps in addressing key requirements
// - Ensure perfect alignment with assessment criteria

// Return the refined resume using the SAME JSON structure as provided, with improvements made throughout:

// {
//   "profile": {
//     "name": "Full Name (unchanged)",
//     "title": "Optimized professional title",
//     "location": "Candidate's actual location (DO NOT CHANGE)",
//     "clearance": "Security clearance or null (unchanged from original)",
//     "description": "Enhanced 150-200 word description with stronger value propositions and keyword optimization",
//     "description2": "Refined 150-200 word second paragraph with improved flow and impact"
//   },
//   "contact": {
//     "email": "Unchanged",
//     "phone": "Unchanged",
//     "linkedin": "Unchanged"
//   },
//   "qualifications": ["Refined list optimized for job relevance"],
//   "affiliations": ["Enhanced professional memberships list"] ,
//   "skills": ["Optimized top 8 skills with perfect job alignment"],
//   "keyAchievements": ["Strengthened 3 achievements with better quantification and relevance"],
//   "experience": [
//     {
//       "title": "Unchanged",
//       "period": "Unchanged",
//       "responsibilities": ["Enhanced 4 bullets with stronger action verbs and results"]
//     }
//   ],
//   "fullExperience": [
//     {
//       "title": "Unchanged",
//       "period": "Unchanged",
//       "responsibilities": ["Refined 6-8 bullets with improved impact and keyword optimization"]
//     }
//   ],
//   "referees": ["Unchanged array structure"]
// }

// 🚨 MAINTAIN ALL ORIGINAL RULES:
// - Location must remain candidate's actual location
// - For experience section, provide 2 most relevant positions to the requirements with 3-4 main bullet points each
// - Include ALL work experiences in fullExperience
// - 6-8 responsibilities maximum per position
// - Security clearance only if mentioned in original resume
// - Professional formatting consistency
// - Top 8 skills combining related technologies
// - 3 most impressive achievements
// - Empty arrays for missing referee information
// - APPLY ALL THE JOB ANALYSIS INSIGHTS AND TAILORING STRATEGIES AND CRITICAL TAILORING RULES:

// Return ONLY the refined JSON object, no additional text.`;

//   try {
//     const response = await makeGeminiRequest(
//       prompt,
//       effectiveApiKey,
//       0.15,
//       8192
//     );
//     return response;
//   } catch (error) {
//     console.error("Error in Step 3 - Resume Refinement:", error);
//     throw new Error(`Resume refinement failed: ${error.message}`);
//   }
// }

// /**
//  * Complete 3-step pipeline function
//  * @param {string} resumeText - Original resume text
//  * @param {string} jobDescription - Job description to tailor to
//  * @param {string} [apiKey] - Optional API key
//  * @returns {Promise<Object>} - Final optimized resume JSON
//  */
// export async function generateCompetitiveTenderResume(
//   resumeText,
//   jobDescription,
//   apiKey = null
// ) {
//   try {
//     console.log("🔍 Step 1: Analyzing job description...");
//     const jobAnalysis = await analyzeJobDescription(jobDescription, apiKey);

//     console.log("✏️ Step 2: Tailoring resume...");
//     const tailoredResume = await tailorResumeToJob(
//       resumeText,
//       jobAnalysis,
//       apiKey
//     );

//     console.log("🔧 Step 3: Refining tailored resume...");
//     const refinedResume = await refineeTailoredResume(
//       tailoredResume,
//       jobAnalysis,
//       apiKey
//     );

//     console.log("✅ Three-step tailoring complete!");
//     return refinedResume;
//   } catch (error) {
//     console.error("Three-step pipeline error:", error);
//     throw error;
//   }
// }

// /**
//  * Helper function to make Gemini API requests
//  * @param {string} prompt - The prompt to send
//  * @param {string} apiKey - API key
//  * @param {number} temperature - Temperature setting
//  * @param {number} maxTokens - Maximum output tokens
//  * @returns {Promise<Object>} - Parsed JSON response
//  */
// async function makeGeminiRequest(prompt, apiKey, temperature, maxTokens) {
//   try {
//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": apiKey,
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: prompt,
//                 },
//               ],
//             },
//           ],
//           generationConfig: {
//             temperature: temperature,
//             topK: 20,
//             topP: 0.8,
//             maxOutputTokens: maxTokens,
//           },
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       const errorMessage =
//         errorData.error?.message || `API Error: ${response.status}`;
//       throw new Error(errorMessage);
//     }

//     const data = await response.json();

//     if (data.candidates && data.candidates[0]?.content?.parts) {
//       const responseText = data.candidates[0].content.parts[0].text;

//       try {
//         // Clean the response text
//         const cleanedText = responseText
//           .replace(/```json\n?/g, "")
//           .replace(/```\n?/g, "")
//           .trim();

//         const parsedJSON = JSON.parse(cleanedText);
//         return parsedJSON;
//       } catch (parseError) {
//         console.error("Failed to parse JSON response:", parseError);
//         console.error("Raw response:", responseText);
//         throw new Error(
//           "Failed to parse AI response as JSON. Please try again."
//         );
//       }
//     } else {
//       throw new Error("Unexpected API response format");
//     }
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     throw error;
//   }
// }

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
      "criterion": "Exact wording of essential requirement",
      "weight": "Estimated importance (Critical/High/Medium)",
      "keywords": ["key", "terms", "to", "include"],
      "evidenceRequired": "Type of evidence needed to demonstrate this"
    }
  ],
  "desirableCriteria": [
    {
      "criterion": "Exact wording of desirable requirement", 
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
    "description": "180-220 words directly addressing top 3-4 essential criteria with government-focused language and quantified achievements",
    "description2": "180-220 words showcasing additional essential criteria compliance and competitive advantages for government work"
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
  ]
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

// /**
//  * Step 3: Final compliance check and competitive positioning refinement
//  * @param {Object} optimizedResume - Output from Step 2
//  * @param {Object} rfqAnalysis - Output from Step 1
//  * @param {string} [apiKey] - Optional API key
//  * @returns {Promise<Object>} - Final submission-ready resume
//  */
// export async function finalizeCompetitiveTenderResume(
//   optimizedResume,
//   rfqAnalysis,
//   apiKey = null
// ) {
//   const effectiveApiKey = apiKey || config.geminiApiKey;

//   if (!effectiveApiKey) {
//     throw new Error("Gemini API key is required.");
//   }

//   const prompt = `You are a senior government procurement advisor conducting a final competitive review. Analyze this tender-optimized resume against the RFQ requirements and make strategic refinements to maximize evaluation scores and competitive positioning.

// 🎯 ORIGINAL RFQ ANALYSIS:
// ${JSON.stringify(rfqAnalysis, null, 2)}

// 📄 CURRENT OPTIMIZED RESUME:
// ${JSON.stringify(optimizedResume, null, 2)}

// 🔍 FINAL COMPETITIVE OPTIMIZATION:

// 1. **ESSENTIAL CRITERIA COMPLIANCE**: Verify every essential criterion is clearly addressed
// 2. **COMPETITIVE DIFFERENTIATION**: Strengthen unique value propositions
// 3. **GOVERNMENT VALUE DEMONSTRATION**: Enhance public sector impact evidence
// 4. **EVALUATION SCORING OPTIMIZATION**: Perfect content for evaluator assessment
// 5. **COMPLIANCE VERIFICATION**: Ensure all mandatory requirements are met
// 6. **LANGUAGE PRECISION**: Perfect government and regulatory terminology
// 7. **QUANTIFICATION ENHANCEMENT**: Strengthen metrics and outcomes
// 8. **SUBMISSION READINESS**: Final formatting and presentation optimization

// REFINEMENT FOCUS AREAS:
// - Strengthen evidence against essential criteria with specific examples
// - Enhance competitive positioning through unique differentiators
// - Optimize language for government evaluator preferences
// - Improve quantification of government-relevant achievements
// - Perfect compliance with RFQ submission requirements
// - Maximize readability for rapid evaluator assessment
// - Ensure professional government submission standards

// Return the refined resume using the SAME JSON structure, with strategic improvements:

// {
//   "profile": {
//     "name": "Full Name (unchanged)",
//     "title": "Optimized title using exact RFQ terminology",
//     "location": "Candidate's actual location (DO NOT CHANGE)",
//     "clearance": "Enhanced clearance status description",
//     "description": "Refined 180-220 words with stronger essential criteria evidence and government impact focus",
//     "description2": "Enhanced 180-220 words with improved competitive positioning and regulatory experience emphasis"
//   },
//   "contact": {
//     "email": "Unchanged",
//     "phone": "Unchanged",
//     "linkedin": "Unchanged"
//   },
//   "qualifications": ["Refined list with perfect RFQ alignment and government terminology"],
//   "affiliations": ["Enhanced government/regulatory sector memberships"],
//   "skills": ["Optimized top 8 skills with precise RFQ terminology and strategic ordering"],
//   "keyAchievements": ["Strengthened 3 achievements with enhanced government-relevant quantification"],
//   "experience": [
//     {
//       "title": "Unchanged",
//       "period": "Unchanged",
//       "responsibilities": ["Enhanced 4 bullets with stronger government value demonstration and essential criteria evidence"]
//     }
//   ],
//   "fullExperience": [
//     {
//       "title": "Unchanged",
//       "period": "Unchanged",
//       "responsibilities": ["Refined 6-8 bullets with optimized government terminology and compliance focus"]
//     }
//   ],
//   "referees": ["Unchanged array structure"]
// }

// 🚨 MAINTAIN AUTHENTICITY WHILE MAXIMIZING COMPETITIVENESS:
// - Location must remain candidate's actual location
// - All experience must be truthful and verifiable
// - Enhance presentation without fabricating credentials
// - Optimize language while maintaining accuracy
// - Focus on legitimate competitive advantages
// - Ensure submission compliance with all RFQ requirements
// - Perfect professional government standards
// - Maximize evaluation scoring potential through strategic presentation

// Return ONLY the refined JSON object, no additional text.`;

//   try {
//     const response = await makeGeminiRequest(
//       prompt,
//       effectiveApiKey,
//       0.15,
//       8192
//     );
//     return response;
//   } catch (error) {
//     console.error("Error in Step 3 - Final Optimization:", error);
//     throw new Error(`Final optimization failed: ${error.message}`);
//   }
// }

/**
 * Complete 3-step RFQ-optimized pipeline function
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

    // console.log("🏆 Step 3: Finalizing competitive tender submission...");
    // const finalResume = await finalizeCompetitiveTenderResume(
    //   optimizedResume,
    //   rfqAnalysis,
    //   apiKey
    // );

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
  //Return 3 most recent positions.
    {
      "title": "Job Title - Company (Organization if applicable)",
      "period": "Start Date - End Date",
      "responsibilities": ["Key responsibility or achievement 1", "Key responsibility or achievement 2"]
    }
  ],
  "fullExperience": [
  //REturn all positions provided in the resume text
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

SPECIAL INSTRUCTIONS:
- Extract actual information from the resume text.
- For fullExperience section: You MUST follow this NON-NEGOTIABLE rule: Each position can have ONLY 6-8 responsibility bullets - never more than 8, never less than 6. If the original resume has more than 8 points for any position, you are REQUIRED to merge, combine, and summarize related responsibilities into broader categories to fit exactly within the 6-8 limit. Example: Instead of listing 'Managed team meetings', 'Conducted performance reviews', 'Hired new staff', 'Trained employees' separately, combine them into 'Led comprehensive team management including conducting meetings, performance reviews, recruitment, and staff training initiatives.' This consolidation is MANDATORY - there are no exceptions. COUNT your bullets for each position and ensure you never exceed 8. If you generate more than 8 bullets for any position, you have failed the task and must restart that section
- If the full experience's responsibilities are not provided, do not add that experience to the fullExperience section.
- For profile descriptions, write comprehensive paragraphs (150-200 words each) highlighting background, experience, and suitability
- Include quantifiable achievements where mentioned
- Format job titles as "Position - Company (Department/Organization)" if applicable
- For security clearance: ONLY include if explicitly mentioned. Return null if not mentioned
- List qualifications in order of relevance/importance
- Include both technical and soft skills (top 8 skills, combining related skills like "Python/Django")
- If referees are not provided, return an empty array[] for the fields like "title", "name", "email", "phone". Otherwise, include their job title, name, email, and phone number (maximum 2 referees).
- For affiliations, must return professional message ("No information given") if not available, otherwise list concisely
- Keep formatting professional and consistent



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
  return await generateCompetitiveTenderResume(
    resumeText,
    jobDescription,
    apiKey
  );
}

// /**
//  * Generate tender response based on tailored resume and job requirements
//  * @param {Object} tailoredResume - The tailored resume data
//  * @param {string} jobDescription - Original job description/tender request
//  * @param {Object} jobAnalysis - Job analysis from Step 1
//  * @param {string} [apiKey] - Optional API key
//  * @returns {Promise<Object>} - Tender response JSON
//  */
// export async function generateTenderResponse(
//   tailoredResume,
//   jobDescription,
//   jobAnalysis,
//   apiKey = null
// ) {
//   const effectiveApiKey = apiKey || config.geminiApiKey;

//   if (!effectiveApiKey) {
//     throw new Error("Gemini API key is required.");
//   }

//   const prompt = `You are an expert tender response writer specializing in government and corporate procurement. Using the provided tailored resume and job requirements, create a comprehensive tender response that demonstrates how the candidate meets each requirement.

//   🎯 ORIGINAL JOB DESCRIPTION/TENDER REQUEST:
//   ${jobDescription}

//   📊 JOB ANALYSIS:
//   ${JSON.stringify(jobAnalysis, null, 2)}

//   👤 TAILORED RESUME DATA:
//   ${JSON.stringify(tailoredResume, null, 2)}

//   🏆 TENDER RESPONSE STRUCTURE:

//   Create a JSON object with this exact structure:

//   {
//     "candidateDetails": {
//       "name": "Candidate's full name from resume",
//       "proposedRole": "Job title from job description",
//       "clearance": "Security clearance level from resume or 'To be obtained' if required but not held",
//       "availability": "Available immediately" or specific availability from resume context"
//     },
//     "essentialCriteria": [
//       {
//         "requirement": "Essential requirement 1 from job description",
//         "response": "Detailed response explaining how candidate meets this requirement using specific examples from their experience, achievements, and skills. Include quantifiable results and relevant projects."
//       },
//       {
//         "requirement": "Essential requirement 2 from job description",
//         "response": "Detailed response with concrete examples..."
//       }
//       // Continue for all essential requirements
//     ],
//     "desirableCriteria": [
//       {
//         "requirement": "Desirable requirement 1 from job description",
//         "response": "Response explaining relevant experience or skills, or honest statement about learning capability if not fully met"
//       },
//       {
//         "requirement": "Desirable requirement 2 from job description",
//         "response": "Response with examples..."
//       }
//       // Continue for all desirable requirements
//     ],
//     "additionalInformation": [
//       {
//         "requirement": "Does the candidate have the required Clearance, or the ability to obtain and maintain?",
//         "response": "Clear statement about current clearance status and ability to obtain/maintain required level"
//       },
//       {
//         "requirement": "Is the candidate a director/owner/account manager/partner of a Seller registered on BuyICT?",
//         "response": "Yes/No with relevant details if applicable, or 'No conflicts of interest'"
//       },
//       {
//         "requirement": "Previous work history with the Buyer (e.g., DHS, Defence)?",
//         "response": "Details of previous work history including duration, role, and contact information, or 'No previous work history with this organization'"
//       }
//     ]
//   }

//   🔥 CRITICAL RESPONSE WRITING RULES:

//   **CONTENT REQUIREMENTS:**
//   - Extract ALL essential and desirable criteria from the job description
//   - Use specific examples from the candidate's resume
//   - Include quantifiable achievements where possible
//   - Reference specific projects, technologies, and outcomes
//   - Write strictly in third-person perspective. Do NOT use "I", "my", or "I'm confident". Instead, use the candidate’s full name or third-person pronouns like "he/she/they" (e.g., "Tuan Minh has extensive experience in...", "He demonstrated strong analytical skills by...")
//   - Maintain a professional, confident tone
//   - Be truthful — do not fabricate experience

//   **RESPONSE QUALITY STANDARDS:**
//   - Each essential criteria response: 100-150 words with concrete examples
//   - Each desirable criteria response: 80-120 words
//   - Use action verbs and specific technical terminology
//   - Include metrics, timeframes, and business impact
//   - Reference relevant experience from different roles if applicable
//   - Show progression and growth in capabilities

//   **ESSENTIAL CRITERIA FOCUS:**
//   - Must demonstrate clear competency for each requirement
//   - Use STAR method (Situation, Task, Action, Result) where appropriate
//   - Include specific technologies, methodologies, and frameworks mentioned
//   - Reference relevant certifications, training, or qualifications
//   - Show depth of experience with concrete examples

//   **DESIRABLE CRITERIA APPROACH:**
//   - Highlight relevant experience that aligns with requirements
//   - If partially met, show learning capability and relevant transferable skills
//   - Be honest about gaps while emphasizing adaptability
//   - Reference related experience that demonstrates capability to learn

//   **ADDITIONAL INFORMATION PRECISION:**
//   - Clearance: State exact current level and eligibility for required level
//   - Conflicts of interest: Clear yes/no with specifics if applicable
//   - Work history: Include specific roles, dates, managers, and contact details if available

//   **FORMATTING REQUIREMENTS:**
//   - Professional, clear language suitable for government/corporate evaluation
//   - No bullet points in responses - use flowing paragraphs
//   - Include specific company names, project names, and technologies
//   - Reference timeframes and durations
//   - Use industry-standard terminology

//   🎯 EXTRACTION STRATEGY:

//   **From Job Description:**
//   1. Identify all numbered essential criteria
//   2. Identify all numbered desirable criteria
//   3. Extract specific technical requirements
//   4. Note compliance and governance requirements
//   5. Identify key competencies and skill areas

//   **From Resume:**
//   1. Match experience to each requirement
//   2. Find quantifiable achievements that demonstrate competency
//   3. Identify relevant projects and technologies
//   4. Extract leadership and collaboration examples
//   5. Note certifications and qualifications that support requirements

//   **Response Construction:**
//   1. Lead with strongest, most relevant experience
//   2. Include specific examples with measurable outcomes
//   3. Reference multiple roles if they provide supporting evidence
//   4. Use technical terminology from the job description
//   5. Demonstrate understanding of the role and organization

//   🚨 QUALITY ASSURANCE:
//   - Every requirement must have a substantive response
//   - Responses must be grounded in actual resume content
//   - Technical details must be accurate and specific
//   - Professional tone throughout
//   - No generic or template responses

//   Return ONLY the JSON object, no additional text.`;

//   try {
//     const response = await makeGeminiRequest(
//       prompt,
//       effectiveApiKey,
//       0.15,
//       8192
//     );
//     return response;
//   } catch (error) {
//     console.error("Error generating tender response:", error);
//     throw new Error(`Tender response generation failed: ${error.message}`);
//   }
// }

// /**
//  * Enhanced tender response generation for the new ICT Criteria Statement format
//  * @param {Object} tailoredResume - The tailored resume data
//  * @param {string} jobDescription - Original job description/tender request
//  * @param {Object} jobAnalysis - Job analysis from RFQ analysis
//  * @param {string} [apiKey] - Optional API key
//  * @returns {Promise<Object>} - Tender response JSON optimized for ICT Criteria Statement
//  */
// export async function generateICTCriteriaStatement(
//   tailoredResume,
//   jobDescription,
//   jobAnalysis,
//   apiKey = null
// ) {
//   const effectiveApiKey = apiKey || config.geminiApiKey;

//   if (!effectiveApiKey) {
//     throw new Error("Gemini API key is required.");
//   }

//   const prompt = `You are an expert ICT tender response specialist creating a comprehensive ICT Criteria Statement for government procurement. Using the provided tailored resume and RFQ requirements, create a professional tender response that demonstrates how the candidate meets each criterion with specific examples and evidence.

//   🎯 ORIGINAL JOB DESCRIPTION/RFQ:
//   ${jobDescription}

//   📊 RFQ ANALYSIS:
//   ${JSON.stringify(jobAnalysis, null, 2)}

//   👤 TAILORED RESUME DATA:
//   ${JSON.stringify(tailoredResume, null, 2)}

//   🏆 ICT CRITERIA STATEMENT STRUCTURE:

//   Create a JSON object that follows this exact structure for an ICT Criteria Statement:

//   {
//     "candidateDetails": {
//       "name": "Candidate's full name from resume",
//       "proposedRole": "Application Response to [specific role/project name from RFQ]",
//       "clearance": "Security clearance level or eligibility status",
//       "availability": "Availability statement"
//     },
//     "essentialCriteria": [
//       {
//         "criteria": "Summary",
//         "response": "Comprehensive 150-200 word professional summary highlighting the candidate's overall qualifications, years of experience, key expertise areas, and how they align with the role requirements. Focus on their background in ICT, project management, and relevant industry experience."
//       },
//       {
//         "criteria": "Skills, Knowledge, and Experience Relevant to the Role",
//         "response": "Detailed 400-500 word response covering:\n\n• ICT Project Management & Policy Expertise:\n[Specific examples of ICT project management experience with quantifiable results]\n\n• Stakeholder Engagement & Communication:\n[Examples of stakeholder management and communication success]\n\n• Strategic & Analytical Thinking:\n[Evidence of strategic thinking and analytical problem-solving capabilities]\n\nUse bullet points for key competency areas and provide specific examples from their experience."
//       },
//       {
//         "criteria": "Interest in the Role & Contributions",
//         "response": "100-150 word response explaining the candidate's specific interest in this role and how they can contribute to the project's success. Reference the project name and demonstrate understanding of the role's importance."
//       },
//       {
//         "criteria": "Key Achievements Demonstrating Ability to Perform the Role",
//         "response": "3-4 bullet points (150-200 words total) highlighting specific achievements that directly demonstrate their capability to perform this role. Include quantifiable results, project outcomes, and relevant success metrics."
//       }
//     ],
//     "desirableCriteria": [
//       {
//         "criteria": "Summary",
//         "response": "100-150 word summary of desirable qualities the candidate brings, including their enthusiasm, experience level, and self-driven motivation."
//       },
//       {
//         "criteria": "Ability to Apply Judgment & Achieve Critical Outcomes",
//         "response": "120-150 word response with specific examples of decision-making, risk management, and achieving critical project outcomes."
//       },
//       {
//         "criteria": "Critical Thinking & Persuasive Communication",
//         "response": "120-150 word response demonstrating analytical thinking skills and communication effectiveness with examples."
//       },
//       {
//         "criteria": "Listening & Effective Communication Skill",
//         "response": "120-150 word response showing communication skills, stakeholder engagement, and collaboration abilities."
//       },
//       {
//         "criteria": "Ability to Work in a Collaborative Team Environment",
//         "response": "120-150 word response highlighting teamwork experience, cross-functional collaboration, and team leadership examples."
//       },
//       {
//         "criteria": "Trustworthiness, Transparency & Integrity",
//         "response": "120-150 word response demonstrating ethical standards, governance compliance, and professional integrity."
//       },
//       {
//         "criteria": "Capability to Deliver High-Quality Outcomes to Tight Deadlines",
//         "response": "120-150 word response with specific examples of deadline management, project delivery success, and time management skills."
//       }
//     ],
//     "additionalInformation": [
//       {
//         "criteria": "Security Clearance Status",
//         "response": "Clear statement about current clearance level and ability to obtain/maintain required clearance"
//       },
//       {
//         "criteria": "Availability and Start Date",
//         "response": "Specific availability information and earliest possible start date"
//       },
//       {
//         "criteria": "Previous Experience with Government/Defence Projects",
//         "response": "Details of any previous government or defence work, including duration and nature of projects"
//       }
//     ]
//   }

//   🔥 CRITICAL WRITING GUIDELINES:

//   **CONTENT REQUIREMENTS:**
//   - Write exclusively in third-person perspective using the candidate's full name
//   - Never use "I", "my", "me" - always use "Tony has...", "He demonstrates...", etc.
//   - Provide specific examples from the candidate's actual experience
//   - Include quantifiable achievements and metrics where possible
//   - Use professional, confident language appropriate for government evaluation
//   - Reference specific technologies, methodologies, and frameworks from their background

//   **RESPONSE STRUCTURE:**
//   - Essential "Skills, Knowledge, and Experience" should be the longest and most detailed response
//   - Use bullet points with headers for key competency areas in the skills section
//   - Each desirable criteria response should be substantial but concise
//   - Include specific project names, organizations, and outcomes from their resume
//   - Demonstrate clear understanding of the role and project requirements

//   **QUALITY STANDARDS:**
//   - Summary responses: 100-200 words focusing on overall qualifications
//   - Skills response: 400-500 words with detailed competency breakdowns
//   - Achievement responses: Include 3-4 specific, quantifiable accomplishments
//   - Desirable responses: 120-150 words each with concrete examples
//   - All responses must be grounded in actual resume content
//   - For example, do not use something like this: "• **ICT Project Management & Policy Expertise:** ". The "**" should be removed, just use the text after it

//   **GOVERNMENT TENDER OPTIMIZATION:**
//   - Use terminology from the RFQ and job analysis
//   - Address evaluation criteria systematically
//   - Demonstrate value to government/defence objectives
//   - Show compliance and governance awareness
//   - Highlight relevant security and clearance experience

//   **FORMATTING REQUIREMENTS:**
//   - Professional language suitable for ICT procurement evaluation
//   - Use bullet points strategically in the skills section
//   - Include specific timeframes, project scales, and team sizes
//   - Reference leadership experience with team size numbers
//   - Maintain consistent professional tone throughout

//   🚨 MANDATORY RULES:
//   - All content must be truthful and based on actual resume information
//   - Use exact project names, companies, and roles from the resume
//   - Include specific years of experience and quantifiable metrics
//   - Reference security clearance accurately as stated in resume
//   - Maintain professional government tender standards
//   - Every response must demonstrate specific competency for the role

//   🎯 EXTRACTION STRATEGY:
//   1. Map resume experience to each essential and desirable criterion
//   2. Extract specific achievements that demonstrate required competencies
//   3. Use quantifiable results and project outcomes as evidence
//   4. Reference multiple roles if they provide supporting evidence
//   5. Demonstrate progression and growth in capabilities

//   Return ONLY the JSON object, no additional text.`;

//   try {
//     const response = await makeGeminiRequest(
//       prompt,
//       effectiveApiKey,
//       0.15,
//       8192
//     );
//     return response;
//   } catch (error) {
//     console.error("Error generating ICT Criteria Statement:", error);
//     throw new Error(
//       `ICT Criteria Statement generation failed: ${error.message}`
//     );
//   }
// }

// /**
//  * Alternative function name for backward compatibility
//  */
// export async function generateTenderResponse(
//   tailoredResume,
//   jobDescription,
//   jobAnalysis,
//   apiKey = null
// ) {
//   return await generateICTCriteriaStatement(
//     tailoredResume,
//     jobDescription,
//     jobAnalysis,
//     apiKey
//   );
// }

// /**
//  * Utility function to validate the generated tender response format
//  */
// export function validateICTCriteriaFormat(tenderData) {
//   const requiredSections = [
//     "candidateDetails",
//     "essentialCriteria",
//     "desirableCriteria",
//   ];
//   const requiredEssentialCriteria = [
//     "Summary",
//     "Skills, Knowledge, and Experience Relevant to the Role",
//     "Interest in the Role & Contributions",
//     "Key Achievements Demonstrating Ability to Perform the Role",
//   ];

//   const requiredDesirableCriteria = [
//     "Summary",
//     "Ability to Apply Judgment & Achieve Critical Outcomes",
//     "Critical Thinking & Persuasive Communication",
//     "Listening & Effective Communication Skill",
//     "Ability to Work in a Collaborative Team Environment",
//     "Trustworthiness, Transparency & Integrity",
//     "Capability to Deliver High-Quality Outcomes to Tight Deadlines",
//   ];

//   const validation = {
//     isValid: true,
//     missingElements: [],
//     warnings: [],
//   };

//   // Check required sections
//   requiredSections.forEach((section) => {
//     if (!tenderData[section]) {
//       validation.isValid = false;
//       validation.missingElements.push(`Missing section: ${section}`);
//     }
//   });

//   // Check essential criteria
//   if (tenderData.essentialCriteria) {
//     const essentialTitles = tenderData.essentialCriteria.map((c) => c.criteria);
//     requiredEssentialCriteria.forEach((required) => {
//       if (!essentialTitles.includes(required)) {
//         validation.warnings.push(`Missing essential criteria: ${required}`);
//       }
//     });
//   }

//   // Check desirable criteria
//   if (tenderData.desirableCriteria) {
//     const desirableTitles = tenderData.desirableCriteria.map((c) => c.criteria);
//     requiredDesirableCriteria.forEach((required) => {
//       if (!desirableTitles.includes(required)) {
//         validation.warnings.push(`Missing desirable criteria: ${required}`);
//       }
//     });
//   }

//   // Check response quality
//   if (tenderData.essentialCriteria) {
//     tenderData.essentialCriteria.forEach((criteria, index) => {
//       const wordCount = criteria.response?.split(" ").length || 0;
//       if (
//         criteria.criteria ===
//           "Skills, Knowledge, and Experience Relevant to the Role" &&
//         wordCount < 300
//       ) {
//         validation.warnings.push(
//           `Skills section response too brief: ${wordCount} words (minimum 300 recommended)`
//         );
//       } else if (wordCount < 50) {
//         validation.warnings.push(
//           `Essential criteria ${
//             index + 1
//           } response too brief: ${wordCount} words`
//         );
//       }
//     });
//   }

//   return validation;
// }

// /**
//  * Helper function to format the tender response for the new template
//  */
// export function formatForICTTemplate(rawTenderData) {
//   // Ensure the data structure matches exactly what the new template expects
//   return {
//     candidateDetails: {
//       name: rawTenderData.candidateDetails?.name || "Candidate Name",
//       proposedRole:
//         rawTenderData.candidateDetails?.proposedRole || "Application Response",
//       clearance: rawTenderData.candidateDetails?.clearance,
//       availability: rawTenderData.candidateDetails?.availability,
//     },
//     essentialCriteria:
//       rawTenderData.essentialCriteria?.map((criteria) => ({
//         criteria: criteria.criteria || criteria.requirement,
//         response: criteria.response,
//       })) || [],
//     desirableCriteria:
//       rawTenderData.desirableCriteria?.map((criteria) => ({
//         criteria: criteria.criteria || criteria.requirement,
//         response: criteria.response,
//       })) || [],
//     additionalInformation:
//       rawTenderData.additionalInformation?.map((info) => ({
//         criteria: info.criteria || info.requirement,
//         response: info.response,
//       })) || [],
//   };
// }

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

  const prompt = `You are an expert government tender response specialist creating a comprehensive Criteria Statement for ${detectedSector} sector procurement. Using the provided tailored resume and RFQ requirements, create a professional tender response that demonstrates how the candidate meets each criterion with specific examples and evidence.
  
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
        "criteria": "Summary",
        "response": "Comprehensive 150-200 word professional summary highlighting the candidate's overall qualifications, years of experience, key expertise areas, and how they align with the role requirements. Focus on their background in ${sectorTerminology}, project management, and relevant industry experience."
      },
      {
        "criteria": "Skills, Knowledge, and Experience Relevant to the Role",
        "response": "Detailed 400-500 word response covering:\n\n• ${detectedSector} Domain Expertise & Professional Experience:\n[Specific examples of ${sectorTerminology} experience with quantifiable results]\n\n• Stakeholder Engagement & Communication:\n[Examples of stakeholder management and communication success]\n\n• Strategic & Analytical Thinking:\n[Evidence of strategic thinking and analytical problem-solving capabilities]\n\nUse bullet points for key competency areas and provide specific examples from their experience."
      },
      {
        "criteria": "Interest in the Role & Contributions",
        "response": "100-150 word response explaining the candidate's specific interest in this role and how they can contribute to the project's success. Reference the project name and demonstrate understanding of the role's importance within the ${detectedSector} context."
      },
      {
        "criteria": "Key Achievements Demonstrating Ability to Perform the Role",
        "response": "3-4 bullet points (150-200 words total) highlighting specific achievements that directly demonstrate their capability to perform this role. Include quantifiable results, project outcomes, and relevant success metrics from ${sectorTerminology} experience."
      }
    ],
    "desirableCriteria": [
      {
        "criteria": "Summary",
        "response": "100-150 word summary of desirable qualities the candidate brings, including their enthusiasm, experience level, and self-driven motivation within the ${detectedSector} sector."
      },
      {
        "criteria": "Ability to Apply Judgment & Achieve Critical Outcomes",
        "response": "120-150 word response with specific examples of decision-making, risk management, and achieving critical project outcomes in ${sectorTerminology} environments."
      },
      {
        "criteria": "Critical Thinking & Persuasive Communication",
        "response": "120-150 word response demonstrating analytical thinking skills and communication effectiveness with examples relevant to ${detectedSector} stakeholders."
      },
      {
        "criteria": "Listening & Effective Communication Skill",
        "response": "120-150 word response showing communication skills, stakeholder engagement, and collaboration abilities within ${detectedSector} contexts."
      },
      {
        "criteria": "Ability to Work in a Collaborative Team Environment",
        "response": "120-150 word response highlighting teamwork experience, cross-functional collaboration, and team leadership examples in ${sectorTerminology} settings."
      },
      {
        "criteria": "Trustworthiness, Transparency & Integrity",
        "response": "120-150 word response demonstrating ethical standards, governance compliance, and professional integrity relevant to ${detectedSector} sector requirements."
      },
      {
        "criteria": "Capability to Deliver High-Quality Outcomes to Tight Deadlines",
        "response": "120-150 word response with specific examples of deadline management, project delivery success, and time management skills in ${sectorTerminology} projects."
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
    ]
  }
  
  🔥 CRITICAL WRITING GUIDELINES:
  
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
 * Utility function to validate the generated tender response format
 */
export function validateTenderResponseFormat(tenderData) {
  const requiredSections = [
    "candidateDetails",
    "essentialCriteria",
    "desirableCriteria",
  ];
  const requiredEssentialCriteria = [
    "Summary",
    "Skills, Knowledge, and Experience Relevant to the Role",
    "Interest in the Role & Contributions",
    "Key Achievements Demonstrating Ability to Perform the Role",
  ];

  const requiredDesirableCriteria = [
    "Summary",
    "Ability to Apply Judgment & Achieve Critical Outcomes",
    "Critical Thinking & Persuasive Communication",
    "Listening & Effective Communication Skill",
    "Ability to Work in a Collaborative Team Environment",
    "Trustworthiness, Transparency & Integrity",
    "Capability to Deliver High-Quality Outcomes to Tight Deadlines",
  ];

  const validation = {
    isValid: true,
    missingElements: [],
    warnings: [],
  };

  // Check required sections
  requiredSections.forEach((section) => {
    if (!tenderData[section]) {
      validation.isValid = false;
      validation.missingElements.push(`Missing section: ${section}`);
    }
  });

  // Check essential criteria
  if (tenderData.essentialCriteria) {
    const essentialTitles = tenderData.essentialCriteria.map((c) => c.criteria);
    requiredEssentialCriteria.forEach((required) => {
      if (!essentialTitles.includes(required)) {
        validation.warnings.push(`Missing essential criteria: ${required}`);
      }
    });
  }

  // Check desirable criteria
  if (tenderData.desirableCriteria) {
    const desirableTitles = tenderData.desirableCriteria.map((c) => c.criteria);
    requiredDesirableCriteria.forEach((required) => {
      if (!desirableTitles.includes(required)) {
        validation.warnings.push(`Missing desirable criteria: ${required}`);
      }
    });
  }

  // Check response quality
  if (tenderData.essentialCriteria) {
    tenderData.essentialCriteria.forEach((criteria, index) => {
      const wordCount = criteria.response?.split(" ").length || 0;
      if (
        criteria.criteria ===
          "Skills, Knowledge, and Experience Relevant to the Role" &&
        wordCount < 300
      ) {
        validation.warnings.push(
          `Skills section response too brief: ${wordCount} words (minimum 300 recommended)`
        );
      } else if (wordCount < 50) {
        validation.warnings.push(
          `Essential criteria ${
            index + 1
          } response too brief: ${wordCount} words`
        );
      }
    });
  }

  return validation;
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

/**
 * Alias for backward compatibility with ICT-specific validation
 */
export function validateICTCriteriaFormat(tenderData) {
  return validateTenderResponseFormat(tenderData);
}
