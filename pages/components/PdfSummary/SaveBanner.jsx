
const SaveBanner = ({ uploadedProfilePictureUrl, isSaved, isSaving, saveMessage, onSave, isJobTailored = false }) => {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 mx-4">
        <div className="flex items-center justify-between">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                {isJobTailored ? 'Tailored Resume Generated Successfully!' : 'Resume Template Generated Successfully!'}
              </h3>
              <div className="mt-1 text-sm text-green-700">
                <p>
                  Your professional resume template is ready to view and download.
                  {isJobTailored && (
                    <span className="font-medium"> This resume has been tailored to match the job requirements.</span>
                  )}
                </p>
                {uploadedProfilePictureUrl && (
                  <p>✓ Profile picture has been uploaded and included.</p>
                )}
                {isJobTailored && (
                  <p>🎯 Resume optimized for the specific job opportunity.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isSaved && (
              <button
                onClick={onSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    Save to History
                  </>
                )}
              </button>
            )}
            
            {isSaved && (
              <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm font-medium">Saved to History</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Save status message */}
        {saveMessage && (
          <div className="mt-3 text-sm">
            {saveMessage}
          </div>
        )}
      </div>
    );
  };
  
  export default SaveBanner;