// utils/resumeMetadataExtractor.js
/**
 * Extracts metadata from resume summary content
 * @param {string} summaryText - The text content of the summary
 * @returns {Object} Extracted metadata
 */
export function extractResumeMetadata(summaryText) {
  // Initialize metadata object with default values
  const metadata = {
    candidateName: "",
    yearsOfExperience: 0,
    industries: [],
    location: "",
    topSkills: [],
    educationLevel: "",
    jobTitle: "",
    keyPositions: [],
  };

  // Extract candidate name
  const nameMatch = summaryText.match(
    /^(?:\*\*)?([A-Z][a-z]+(?: [A-Z][a-z]+)+)(?:\*\*)?:/
  );
  if (nameMatch && nameMatch[1]) {
    metadata.candidateName = nameMatch[1];
  }

  // Extract years of experience
  const experienceMatches = [
    // Look for years of experience in various formats
    ...summaryText.matchAll(/(\d+)(?:\+)? years? (?:of )?experience/gi),
    ...summaryText.matchAll(/experience of (\d+)(?:\+)? years?/gi),
    ...summaryText.matchAll(/with (\d+)(?:\+)? years? (?:of )?experience/gi),
  ];

  if (experienceMatches.length > 0) {
    // Get the highest number of years if multiple mentions
    const years = [...experienceMatches].map((match) => parseInt(match[1]));
    metadata.yearsOfExperience = Math.max(...years);
  }

  // Extract location information
  const locationPatterns = [
    // Common location formats
    /(?:based in|located in|from|in) ([A-Z][a-z]+(?: [A-Z][a-z]+)*(?:, [A-Z][a-z]+)?)/i,
    /([A-Z][a-z]+(?: [A-Z][a-z]+)*(?:, [A-Z]{2}))(?:[-\s]based)?/i,
    /location:\s*([A-Z][a-z]+(?: [A-Z][a-z]+)*(?:, [A-Z]{2})?)/i,
  ];

  for (const pattern of locationPatterns) {
    const match = summaryText.match(pattern);
    if (match && match[1]) {
      metadata.location = match[1];
      break;
    }
  }

  // Extract industry information
  const commonIndustries = [
    "Technology",
    "IT",
    "Software",
    "Finance",
    "Banking",
    "Healthcare",
    "Medical",
    "Education",
    "Retail",
    "Manufacturing",
    "Consulting",
    "Marketing",
    "Advertising",
    "Media",
    "Entertainment",
    "Telecom",
    "Hospitality",
    "Tourism",
    "Construction",
    "Engineering",
    "Automotive",
    "Aerospace",
    "Defense",
    "Pharma",
    "Biotech",
    "Energy",
    "Oil & Gas",
    "Real Estate",
    "Agriculture",
    "Food",
    "Beverage",
    "Insurance",
    "E-commerce",
    "Legal",
    "Government",
    "Nonprofit",
    "Transportation",
    "Logistics",
    "Supply Chain",
  ];

  const industryRegexes = commonIndustries.map(
    (industry) => new RegExp(`\\b${industry.replace(/[&]/g, "[&]")}\\b`, "i")
  );

  for (const regex of industryRegexes) {
    const match = summaryText.match(regex);
    if (match) {
      metadata.industries.push(match[0]);
    }
  }

  // Extract job title
  const titlePatterns = [
    /\*\*([^:]+)(?:Summary|Profile)\*\*/i,
    /([A-Z][a-z]+(?: [A-Z][a-z]+)*): (?:Software|Senior|Engineer|Developer|Manager|Director|Analyst|Consultant|Designer)/i,
    /(?:is a|as a|experienced) ([A-Z][a-z]+ [A-Z][a-z]+(?:(?: [A-Z][a-z]+)*)) with/i,
  ];

  for (const pattern of titlePatterns) {
    const match = summaryText.match(pattern);
    if (match && match[1]) {
      metadata.jobTitle = match[1].replace(/\*\*/g, "").trim();
      break;
    }
  }

  // Extract skills (look for bullet points in Skills section)
  const skillsSection = summaryText.match(
    /\*\*(?:Key )?Skills[^:]*:\*\*(.*?)(?:\*\*|$)/s
  );
  if (skillsSection && skillsSection[1]) {
    const skillBullets = skillsSection[1].match(
      /\* (?:\*\*)?([^:*\n]+)(?:\*\*)?/g
    );
    if (skillBullets) {
      const skills = skillBullets.map((bullet) =>
        bullet.replace(/\* (?:\*\*)?([^:*\n]+)(?:\*\*)?/g, "$1").trim()
      );
      metadata.topSkills = skills.slice(0, 5); // Get top 5 skills
    }
  }

  // Extract education level
  const educationLevels = [
    "PhD",
    "Ph.D",
    "Doctorate",
    "Doctoral",
    "Master",
    "MBA",
    "MS",
    "MSc",
    "MA",
    "Bachelor",
    "BS",
    "BSc",
    "BA",
    "Associate",
    "High School",
    "Certificate",
  ];

  const educationPatterns = educationLevels.map(
    (level) => new RegExp(`\\b${level}\\b(?:\\s+(?:in|of|degree))?`, "i")
  );

  for (const pattern of educationPatterns) {
    const match = summaryText.match(pattern);
    if (match) {
      metadata.educationLevel = match[0];
      break;
    }
  }

  // Extract key positions
  const positionSection = summaryText.match(
    /\*\*(?:Professional )?Experience[^:]*:\*\*(.*?)(?:\*\*|$)/s
  );
  if (positionSection && positionSection[1]) {
    const companyMatches = positionSection[1].match(
      /\* \*\*([^:*\n]+)(?:\*\*)/g
    );
    if (companyMatches) {
      metadata.keyPositions = companyMatches.map((company) =>
        company.replace(/\* \*\*([^:*\n]+)(?:\*\*)/g, "$1").trim()
      );
    }
  }

  return metadata;
}

/**
 * Estimates seniority level based on extracted metadata
 * @param {Object} metadata - The extracted resume metadata
 * @returns {string} - Estimated seniority level
 */
export function estimateSeniorityLevel(metadata) {
  const { yearsOfExperience, jobTitle, educationLevel } = metadata;

  // Seniority based on job title
  const titleLower = jobTitle.toLowerCase();
  if (
    titleLower.includes("senior") ||
    titleLower.includes("lead") ||
    titleLower.includes("manager") ||
    titleLower.includes("director") ||
    titleLower.includes("head") ||
    titleLower.includes("chief") ||
    titleLower.includes("principal")
  ) {
    return "Senior";
  }

  if (
    titleLower.includes("junior") ||
    titleLower.includes("associate") ||
    titleLower.includes("assistant") ||
    titleLower.includes("intern")
  ) {
    return "Junior";
  }

  // Seniority based on years of experience
  if (yearsOfExperience >= 8) {
    return "Senior";
  } else if (yearsOfExperience >= 3) {
    return "Mid-level";
  } else if (yearsOfExperience > 0) {
    return "Junior";
  }

  // Seniority based on education if no experience info
  if (yearsOfExperience === 0) {
    const eduLower = educationLevel.toLowerCase();
    if (eduLower.includes("phd") || eduLower.includes("doctorate")) {
      return "Mid-level";
    }
  }

  return "Not specified";
}

/**
 * Formats metadata for display or storage
 * @param {Object} metadata - The extracted resume metadata
 * @returns {Object} - Formatted metadata with additional derived fields
 */
export function formatMetadata(metadata) {
  const formatted = { ...metadata };

  // Add seniority level
  formatted.seniorityLevel = estimateSeniorityLevel(metadata);

  // Format industries
  formatted.industryText = metadata.industries.join(", ");

  // Format skills
  formatted.skillsText = metadata.topSkills.join(", ");

  // Format key positions
  formatted.positionsText = metadata.keyPositions.join(", ");

  return formatted;
}
