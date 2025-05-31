
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
  
  // Separate input state from applied filters
  const [inputValues, setInputValues] = useState({
    candidateName: "",
    location: "",
    profileTitle: ""
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
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
    fetchResumeTemplates(appliedFilters);
  }, [appliedFilters]);

  // Apply filters (called by search button or Enter key)
  const applyFilters = () => {
    setAppliedFilters(inputValues);
  };

  // Handle input changes (just update input state, don't trigger API)
  const handleInputChange = (field, value) => {
    setInputValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    const emptyFilters = { candidateName: "", location: "", profileTitle: "" };
    setInputValues(emptyFilters);
    setAppliedFilters(emptyFilters);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8">
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600/20 border-t-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading Templates</h3>
              <p className="text-slate-600">Fetching your saved resume templates...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Filter Templates</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Candidate Name
            </label>
            <input
              type="text"
              value={inputValues.candidateName}
              onChange={(e) => handleInputChange('candidateName', e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by name..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={inputValues.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by location..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={inputValues.profileTitle}
              onChange={(e) => handleInputChange('profileTitle', e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by title..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Actions
            </label>
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
              >
                Search
              </button>
              {Object.values(inputValues).some((v) => v) && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors duration-200"
                  title="Clear filters"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Applied Filters Display */}
        {Object.values(appliedFilters).some((v) => v) && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                <span className="text-blue-800 font-medium">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {appliedFilters.candidateName && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                      Name: {appliedFilters.candidateName}
                    </span>
                  )}
                  {appliedFilters.location && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                      Location: {appliedFilters.location}
                    </span>
                  )}
                  {appliedFilters.profileTitle && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                      Title: {appliedFilters.profileTitle}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Templates Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Resume Templates</h2>
            <p className="text-slate-600">
              {Object.values(appliedFilters).some((v) => v)
                ? `Showing ${filteredCount} of ${totalCount} templates`
                : `${totalCount} ${totalCount === 1 ? "template" : "templates"} available`}
            </p>
          </div>
          
          {totalCount > 0 && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold">
              {totalCount} Total
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Error Loading Templates</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => setError("")}
                  className="mt-2 text-red-600 hover:text-red-800 font-medium underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {templates.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6-4h6m2 5l-6 6-6-6m6-6V4a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2h-3"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {Object.values(appliedFilters).some((v) => v) ? "No matching templates" : "No resume templates yet"}
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              {Object.values(appliedFilters).some((v) => v)
                ? "Try adjusting your search criteria to find more templates."
                : "Create your first professional resume template to get started."}
            </p>
            <a
              href="/pdf-upload"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Resume Template
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div
                key={template.templateId || template.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  {/* Profile Picture or Placeholder */}
                  <div className="flex-shrink-0">
                    {template.profile?.photo && template.profile.photo !== "/api/placeholder/400/600" ? (
                      <img
                        src={template.profile.photo}
                        alt={`${template.candidateName} profile`}
                        className="w-16 h-16 object-cover rounded-xl border-2 border-slate-200 group-hover:border-blue-300 transition-colors duration-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center ${template.profile?.photo && template.profile.photo !== "/api/placeholder/400/600" ? 'hidden' : 'flex'}`}>
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">
                          {template.candidateName || "Unknown Candidate"}
                        </h3>
                        {template.profileTitle && (
                          <p className="text-blue-600 font-medium mb-2 truncate">
                            {template.profileTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.location && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          📍 {template.location}
                        </span>
                      )}
                      {template.clearance && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          🔒 {template.clearance}
                        </span>
                      )}
                      {template.profile?.photo && template.profile.photo !== "/api/placeholder/400/600" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          📷 Photo
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                      <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <div className="font-bold text-slate-900">{template.qualificationsCount}</div>
                        <div className="text-slate-600">Qualifications</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <div className="font-bold text-slate-900">{template.skillsCount}</div>
                        <div className="text-slate-600">Skills</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <div className="font-bold text-slate-900">{template.experienceCount}</div>
                        <div className="text-slate-600">Positions</div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="text-xs text-slate-500 mb-4">
                      <p>Created {new Date(template.createdAt).toLocaleDateString()}</p>
                      {template.originalFileName && (
                        <p>Source: {template.originalFileName}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => viewTemplate(template)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View
                      </button>

                      <button
                        onClick={() => deleteTemplate(template)}
                        className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>

                    {template.error && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600">⚠️ {template.error}</p>
                      </div>
                    )}
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