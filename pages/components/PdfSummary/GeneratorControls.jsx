const GeneratorControls = ({
    resumeData,
    isGenerating,
    useMockData,
    fileName,
    profilePicturePreview,
    isUploadingImage,
    onGenerate,
    onToggleMockData
  }) => {
    if (resumeData || isGenerating) return null;
  
    return (
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Generate a professional resume template from "{fileName}" using Google's Gemini AI.
          {profilePicturePreview && (
            <span className="text-blue-600"> Your uploaded profile picture will be included.</span>
          )}
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          <button
            onClick={onGenerate}
            disabled={isUploadingImage}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            {isUploadingImage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              useMockData ? 'Generate with Mock Data' : 'Generate Resume with AI'
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
      </div>
    );
  };
  
  export default GeneratorControls;