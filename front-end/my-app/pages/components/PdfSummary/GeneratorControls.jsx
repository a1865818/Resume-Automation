
const GeneratorControls = ({
    resumeData,
    isGenerating,
    useMockData,
    fileName,
    profilePicturePreview,
    isUploadingImage,
    generationMode,
    jobDescription,
    onGenerate,
    onToggleMockData
  }) => {
    if (resumeData || isGenerating) return null;
  
    const isTailoredMode = generationMode === 'tailored';
    const hasJobDescription = jobDescription && jobDescription.trim().length > 50;
    
    // Check if tailored mode is selected but no job description provided
    const isTailoredModeIncomplete = isTailoredMode && !hasJobDescription;
  
    return (
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {isTailoredMode ? '🎯 Job-Tailored Resume Generation' : '📄 Standard Resume Generation'}
          </h3>
          <p className="text-gray-600">
            {isTailoredMode 
              ? `Generate a resume specifically tailored to match job requirements from "${fileName}".`
              : `Generate a clean, professional resume template from "${fileName}".`
            }
            {profilePicturePreview && (
              <span className="text-blue-600"> Your uploaded profile picture will be included.</span>
            )}
          </p>
        </div>
        
        {isTailoredModeIncomplete && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800">Job Description Required</p>
                <p className="text-xs text-amber-700">Please upload or paste a job description above to enable tailored generation.</p>
              </div>
            </div>
          </div>
        )}
  
        {isTailoredMode && hasJobDescription && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-sm font-semibold text-green-800">Ready for Job Tailoring</p>
                <p className="text-xs text-green-700">Your resume will be customized to match the job requirements for better selection chances.</p>
              </div>
            </div>
          </div>
        )}
  
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          <button
            onClick={onGenerate}
            disabled={isUploadingImage || isTailoredModeIncomplete}
            className={`px-6 py-3 rounded-md text-sm font-medium flex items-center justify-center transition-all ${
              isUploadingImage || isTailoredModeIncomplete
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : isTailoredMode
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
            }`}
          >
            {isUploadingImage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                {useMockData 
                  ? 'Generate with Mock Data' 
                  : isTailoredMode 
                    ? 'Generate Tailored Resume'
                    : 'Generate Standard Resume'
                }
              </>
            )}
          </button>
          
          <div className="flex items-center mt-4 sm:mt-0">
            <input
              type="checkbox"
              id="useMockData"
              checked={useMockData}
              onChange={onToggleMockData}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="useMockData" className="ml-2 block text-sm text-gray-700">
              Use mock data (save API credits)
            </label>
          </div>
        </div>
        
        {isTailoredMode && hasJobDescription && !useMockData && (
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Job tailoring uses advanced AI analysis and may take slightly longer to generate.
          </p>
        )}
      </div>
    );
  };
  
  export default GeneratorControls;