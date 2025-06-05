
const LoadingState = ({ profilePicturePreview, generationMode, jobDescription }) => {
    const isTailoredMode = generationMode === 'tailored';
    const hasJobDescription = jobDescription && jobDescription.trim().length > 50;
    
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4 ${
          isTailoredMode ? 'border-green-500' : 'border-indigo-500'
        }`}></div>
        
        <p className="text-gray-600 text-center font-medium">
          {isTailoredMode && hasJobDescription
            ? '🎯 Generating job-tailored resume with advanced matching...' 
            : '📄 Generating professional resume with Gemini AI...'
          }
        </p>
        
        <p className="text-gray-500 text-sm mt-1 text-center">
          {isTailoredMode && hasJobDescription
            ? 'Analyzing job requirements and optimizing your resume...'
            : 'Processing your resume and creating professional template...'
          }
        </p>
        
        {profilePicturePreview && (
          <p className="text-gray-500 text-sm mt-2">✓ Including your uploaded profile picture</p>
        )}
        
        {isTailoredMode && hasJobDescription && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-600 text-sm">
              <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Job tailoring active</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">This may take a bit longer for optimal results</p>
          </div>
        )}
      </div>
    );
  };

export default LoadingState;
  