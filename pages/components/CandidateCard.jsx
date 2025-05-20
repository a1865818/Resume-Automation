// components/CandidateCard.js
const CandidateCard = ({ candidate }) => {
  // Generate a random avatar for demonstration purposes
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    candidate.name
  )}&background=random`;

  // Define all possible skills
  const allSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "SQL",
    "TypeScript",
    "Docker",
    "AWS",
    "UI/UX",
    "Product Strategy",
    "Agile",
    "Machine Learning",
    "Data Analysis",
    "HTML/CSS",
    "PHP",
  ];

  // Generate deterministic skills based on candidate id
  const getCandidateSkills = () => {
    // Use candidate.id as seed
    const seed = candidate.id;
    // Determine how many skills (2-4)
    const numSkills = 2 + (seed % 3);
    const candidateSkills = [];

    // Select skills based on the seed
    for (let i = 0; i < numSkills; i++) {
      const index = (seed * (i + 1)) % allSkills.length;
      candidateSkills.push(allSkills[index]);
    }

    return [...new Set(candidateSkills)]; // Remove any duplicates
  };

  const candidateSkills = getCandidateSkills();

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-24 md:w-32 flex-shrink-0 bg-gray-50 flex items-center justify-center p-4">
          <img
            src={avatarUrl}
            alt={candidate.name}
            className="w-16 h-16 rounded-full"
          />
        </div>

        <div className="flex-1 p-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {candidate.name}
              </h3>
              <p className="text-sm text-gray-600">{candidate.title}</p>
            </div>

            <div className="mt-2 md:mt-0 flex flex-col items-start md:items-end">
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {candidate.location}
              </div>

              <div className="mt-1 flex items-center text-sm text-gray-500">
                <svg
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {candidate.experience}{" "}
                {candidate.experience === 1 ? "year" : "years"} experience
              </div>

              <div className="mt-1 flex items-center text-sm text-gray-500">
                <svg
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                  <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm5.99 7.176A9.026 9.026 0 017 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                {candidate.education}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {candidateSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
              View Profile
            </button>
            <button className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm font-medium">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
