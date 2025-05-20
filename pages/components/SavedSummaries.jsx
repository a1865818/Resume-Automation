// components/SavedSummaries.js
import { useEffect, useState } from 'react';

const SavedSummaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedSummaries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/listSummaries');
        
        if (!response.ok) {
          throw new Error('Failed to fetch saved summaries');
        }
        
        const data = await response.json();
        setSummaries(data.summaries || []);
      } catch (err) {
        console.error('Error fetching summaries:', err);
        setError(err.message || 'Failed to load saved summaries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedSummaries();
  }, []);

  const deleteSummary = async (fileName) => {
    try {
      const response = await fetch('/api/deleteSummaries', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete summary');
      }

      // Update the list by removing the deleted summary
      setSummaries(summaries.filter(summary => summary.fileName !== fileName));
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Saved Summaries</h2>
      
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No summaries yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Generate and save a summary to see it listed here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {summaries.map((summary) => (
            <div
              key={summary.fileName}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {summary.candidateName || 'Unnamed Candidate'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Saved on {new Date(summary.createdAt).toLocaleString()}
                  </p>
                  {summary.originalFileName && (
                    <p className="text-xs text-gray-500 mt-1">
                      Source: {summary.originalFileName}
                    </p>
                  )}
                </div>
                <div className="flex">
                  <a
                    href={summary.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-3"
                  >
                    View
                  </a>
                  <button
                    onClick={() => deleteSummary(summary.fileName)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSummaries;