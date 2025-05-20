
// components/SavedSummaries.js
import { useEffect, useState } from 'react';
import ResumeFilter from './ResumeFilter';

const SavedSummaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  const fetchSavedSummaries = async (filterParams = {}) => {
    try {
      setIsLoading(true);
      
      // Construct query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      console.log(`Fetching summaries from endpoint${queryString}`);
      const response = await fetch(`/api/listSummaries${queryString}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch saved summaries: ${response.status}`);
      }
      
      const data = await response.json();
      setSummaries(data.summaries || []);
      setTotalCount(data.totalCount || data.summaries.length);
      setFilteredCount(data.filteredCount || data.summaries.length);
    } catch (err) {
      console.error('Error fetching summaries:', err);
      setError(err.message || 'Failed to load saved summaries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedSummaries();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchSavedSummaries(newFilters);
  };

  const deleteSummary = async (summary) => {
    // Get the fileName from either fileName or id property
    const fileName = summary.fileName || summary.id;
    
    if (!fileName) {
      setError("Cannot delete: missing file identifier");
      console.error("Attempted to delete summary without fileName or id:", summary);
      return;
    }
    
    console.log("Attempting to delete file:", fileName);
    
    try {
      const response = await fetch('/api/deleteSummaries', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });
      
      // Log the actual request payload
      console.log("Delete request payload:", JSON.stringify({ fileName }));
      
      if (!response.ok) {
        // Try to get more info about the error
        try {
          const errorData = await response.json();
          throw new Error(`Failed to delete summary: ${response.status} - ${errorData.message || errorData.details || 'Unknown error'}`);
        } catch (parseError) {
          throw new Error(`Failed to delete summary: ${response.status}`);
        }
      }

      // Success - update the UI
      console.log("Successfully deleted summary");
      // Filter using both fileName and id to ensure we remove the item
      setSummaries(summaries.filter(s => (s.fileName !== fileName && s.id !== fileName)));
      setTotalCount(prev => prev - 1);
      setFilteredCount(prev => prev - 1);
    } catch (err) {
      console.error('Error deleting summary:', err);
      setError(err.message || 'Failed to delete summary');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Saved Summaries</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ResumeFilter onFilter={handleFilterChange} />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Saved Summaries</h2>
          <span className="text-gray-500 text-sm">
            {Object.values(filters).some(v => v) 
              ? `Showing ${filteredCount} of ${totalCount} summaries`
              : `${totalCount} ${totalCount === 1 ? 'summary' : 'summaries'}`}
          </span>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => setError('')}
                  className="mt-2 text-sm text-red-700 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {summaries.length === 0 ? (
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
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No summaries {Object.values(filters).some(v => v) ? 'match your filters' : 'yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some(v => v) 
                ? 'Try adjusting your filter criteria' 
                : 'Generate and save a summary to see it listed here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary) => {
              // Debug display of summary object
              console.log("Summary item:", summary);
              
              return (
                <div
                  key={summary.fileName || summary.id || `summary-${summary.createdAt}-${Math.random()}`}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="mb-4 md:mb-0 md:mr-4 flex-grow">
                      <div className="flex items-start">
                        <h3 className="text-lg font-medium text-gray-900 mr-2">
                          {summary.candidateName || 'Unnamed Candidate'}
                        </h3>
                        {summary.jobTitle && summary.jobTitle !== summary.candidateName && (
                          <span className="text-sm text-gray-600">• {summary.jobTitle}</span>
                        )}
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {summary.seniorityLevel && (
                          <span className={`inline-flex items-center rounded-full ${
                            summary.seniorityLevel === 'Senior' ? 'bg-purple-100 text-purple-800' :
                            summary.seniorityLevel === 'Mid-level' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          } px-2.5 py-0.5 text-xs font-medium`}>
                            {summary.seniorityLevel}
                          </span>
                        )}
                        
                        {summary.yearsOfExperience > 0 && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-2.5 py-0.5 text-xs font-medium">
                            {summary.yearsOfExperience} {summary.yearsOfExperience === 1 ? 'year' : 'years'}
                          </span>
                        )}
                        
                        {summary.location && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-2.5 py-0.5 text-xs font-medium">
                            {summary.location}
                          </span>
                        )}
                        
                        {summary.educationLevel && (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-2.5 py-0.5 text-xs font-medium">
                            {summary.educationLevel}
                          </span>
                        )}
                      </div>
                      
                      {summary.industries && summary.industries.length > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-500">Industries: </span>
                          <span className="text-xs text-gray-700">{summary.industries.join(', ')}</span>
                        </div>
                      )}
                      
                      {summary.topSkills && summary.topSkills.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-gray-500">Skills: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {summary.topSkills.map((skill, index) => (
                              <span 
                                key={`skill-${index}-${skill}`}
                                className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Saved on {new Date(summary.createdAt).toLocaleString()}
                      </p>
                      
                      {summary.originalFileName && (
                        <p className="text-xs text-gray-500 mt-1">
                          Source: {summary.originalFileName}
                        </p>
                      )}
                      
                      {/* Debug information - can be commented out in production */}
                      <p className="text-xs text-gray-400 mt-1">
                        ID: {summary.id || summary.fileName || "N/A"}
                      </p>
                    </div>
                    
                    <div className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-2">
                      <a
                        href={summary.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View
                      </a>
                      <button
                        onClick={() => deleteSummary(summary)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSummaries;