// components/SavedResume.jsx
import { useEffect, useState } from "react";
import ResumeTemplate from "./ResumeTemplate";

const SavedResume = () => {

const [templates, setTemplates] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState("");
const [totalCount, setTotalCount] = useState(0);
const [filteredCount, setFilteredCount] = useState(0);
const [selectedTemplate, setSelectedTemplate] = useState(null);
const [showTemplateModal, setShowTemplateModal] = useState(false);
const [filters, setFilters] = useState({
  candidateName: "",
  location: "",
  profileTitle: ""
});

const fetchResumeTemplates = async (filterParams = {}) => {
  try {
    setIsLoading(true);

    const queryParams = new URLSearchParams();
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    console.log(`Fetching templates from endpoint${queryString}`);
    const response = await fetch(`/api/listResume${queryString}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch resume templates: ${response.status}`);
    }

    const data = await response.json();
    setTemplates(data.templates || []);
    setTotalCount(data.totalCount || 0);
    setFilteredCount(data.filteredCount || 0);
  } catch (err) {
    console.error("Error fetching templates:", err);
    setError(err.message || "Failed to load resume templates");
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchResumeTemplates();
}, []);

// Separate function to handle filter changes without immediate API call
const handleInputChange = (field, value) => {
  setFilters(prev => ({
    ...prev,
    [field]: value
  }));
};

// Function to apply filters (can be called on Enter key or button click)
const applyFilters = () => {
  fetchResumeTemplates(filters);
};

// Handle Enter key press to trigger search
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    applyFilters();
  }
};

const deleteTemplate = async (template) => {
  const templateId = template.templateId || template.id;

  if (!templateId) {
    setError("Cannot delete: missing template identifier");
    console.error(
      "Attempted to delete template without templateId or id:",
      template
    );
    return;
  }

  console.log("Attempting to delete template:", templateId);

  try {
    const response = await fetch("/api/deleteResume", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ templateId }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(
          `Failed to delete template: ${response.status} - ${
            errorData.message || errorData.details || "Unknown error"
          }`
        );
      } catch (parseError) {
        throw new Error(`Failed to delete template: ${response.status}`);
      }
    }

    console.log("Successfully deleted template");
    setTemplates(
      templates.filter((t) => t.templateId !== templateId && t.id !== templateId)
    );
    setTotalCount((prev) => prev - 1);
    setFilteredCount((prev) => prev - 1);
  } catch (err) {
    console.error("Error deleting template:", err);
    setError(err.message || "Failed to delete template");
  }
};

const viewTemplate = async (template) => {
  const templateId = template.templateId || template.id;
  if (!templateId) {
    setError("Cannot view template: missing template identifier");
    return;
  }

  try {
    const response = await fetch(`/uploads/resume-templates/${templateId}`);

    if (response.ok) {
      const templateData = await response.json();
      setSelectedTemplate(templateData);
      setShowTemplateModal(true);
    } else {
      setError("Failed to load template data");
    }
  } catch (err) {
    console.error("Error loading template data:", err);
    setError("Failed to load template data");
  }
};

const handleBackToHistory = () => {
  setShowTemplateModal(false);
  setSelectedTemplate(null);
};

const clearFilters = () => {
  const emptyFilters = { candidateName: "", location: "", profileTitle: "" };
  setFilters(emptyFilters);
  fetchResumeTemplates(emptyFilters);
};

// If showing template, render the ResumeTemplate component with history view mode
if (showTemplateModal && selectedTemplate) {
  return (
    <ResumeTemplate 
      resumeData={selectedTemplate} 
      onBackToSummary={handleBackToHistory}
      viewMode="history"
    />
  );
}

if (isLoading) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Resume Templates History</h2>
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  );
}

return (
  <div className="max-w-6xl mx-auto px-4 ">
    {/* Filter Section */}
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Resume Templates</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Candidate Name
          </label>
          <input
            type="text"
            value={filters.candidateName}
            onChange={(e) => handleInputChange('candidateName', e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by location... "
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={filters.profileTitle}
            onChange={(e) => handleInputChange('profileTitle', e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by title... "
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          Search
        </button>
        {Object.values(filters).some((v) => v) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>

    {/* Templates List */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Generated Resume Templates</h2>
        <span className="text-gray-500 text-sm">
          {Object.values(filters).some((v) => v)
            ? `Showing ${filteredCount} of ${totalCount} templates`
            : `${totalCount} ${totalCount === 1 ? "template" : "templates"} generated`}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError("")}
                className="mt-2 text-sm text-red-700 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {templates.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round" 
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No resume templates{" "}
            {Object.values(filters).some((v) => v)
              ? "match your filters"
              : "generated yet"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {Object.values(filters).some((v) => v)
              ? "Try adjusting your filter criteria"
              : "Generate your first resume template using the PDF upload feature."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.templateId || template.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div className="mb-4 md:mb-0 md:mr-4 flex-grow">
                  <div className="flex items-start">
                    <h3 className="text-lg font-medium text-gray-900 mr-2">
                      {template.candidateName || "Unknown Candidate"}
                    </h3>
                    {template.profileTitle && (
                      <span className="text-sm text-gray-600">
                        • {template.profileTitle}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {template.location && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-medium">
                        📍 {template.location}
                      </span>
                    )}

                    {template.clearance && (
                      <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-xs font-medium">
                        🔒 {template.clearance}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {template.qualificationsCount || 0} Quals
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                      </svg>
                      {template.skillsCount || 0} Skills
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      {template.experienceCount || 0} Jobs
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                      </svg>
                      {template.achievementsCount || 0} Achievements
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      {template.refereesCount || 0} Referees
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Generated on {new Date(template.createdAt).toLocaleString()}
                  </p>

                  {template.originalFileName && (
                    <p className="text-xs text-gray-500 mt-1">
                      Source: {template.originalFileName}
                    </p>
                  )}

                  {template.error && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚠️ {template.error}
                    </p>
                  )}
                </div>

                <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                  <button
                    onClick={() => viewTemplate(template)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                    View Template
                  </button>

                  <button
                    onClick={() => deleteTemplate(template)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};

export default SavedResume;