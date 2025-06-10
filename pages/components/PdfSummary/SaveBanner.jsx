
// const SaveBanner = ({ uploadedProfilePictureUrl, isSaved, isSaving, saveMessage, onSave, isJobTailored = false }) => {
//     return (
//       <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 mx-4">
//         <div className="flex items-center justify-between">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-green-800">
//                 {isJobTailored ? 'Tailored Resume Generated Successfully!' : 'Resume Template Generated Successfully!'}
//               </h3>
//               <div className="mt-1 text-sm text-green-700">
//                 <p>
//                   Your professional resume template is ready to view and download.
//                   {isJobTailored && (
//                     <span className="font-medium"> This resume has been tailored to match the job requirements.</span>
//                   )}
//                 </p>
//                 {uploadedProfilePictureUrl && (
//                   <p>✓ Profile picture has been uploaded and included.</p>
//                 )}
//                 {isJobTailored && (
//                   <p>🎯 Resume optimized for the specific job opportunity.</p>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-3">
//             {!isSaved && (
//               <button
//                 onClick={onSave}
//                 disabled={isSaving}
//                 className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
//               >
//                 {isSaving ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
//                     </svg>
//                     Save to History
//                   </>
//                 )}
//               </button>
//             )}
            
//             {isSaved && (
//               <div className="flex items-center text-green-600">
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                 </svg>
//                 <span className="text-sm font-medium">Saved to History</span>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Save status message */}
//         {saveMessage && (
//           <div className="mt-3 text-sm">
//             {saveMessage}
//           </div>
//         )}
//       </div>
//     );
//   };
  
//   export default SaveBanner;

const SaveBanner = ({ 
    uploadedProfilePictureUrl, 
    isSaved, 
    isSaving, 
    saveMessage, 
    onSave, 
    isJobTailored = false,
    onGenerateTenderResponse,
    isGeneratingTender = false,
    showTenderOption = false
  }) => {
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
                {showTenderOption && isJobTailored && (
                  <p className="mt-2 font-medium text-green-800">
                    💡 Ready to generate a professional tender response based on this tailored resume!
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Tender Response Generation Button */}
            {showTenderOption && isJobTailored && (
              <button
                onClick={onGenerateTenderResponse}
                disabled={isGeneratingTender}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                {isGeneratingTender ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Generate Tender Response
                  </>
                )}
              </button>
            )}
  
            {/* Save to History Button */}
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
            
            {/* Saved Indicator */}
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
  
        {/* Tender Generation Info */}
        {showTenderOption && isJobTailored && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">🎯 Tender Response Generation</h4>
            <div className="text-sm text-blue-700">
              <p className="mb-2">Generate a comprehensive tender response that:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Addresses all essential and desirable criteria</li>
                <li>Uses specific examples from your tailored resume</li>
                <li>Provides detailed responses with quantifiable achievements</li>
                <li>Includes clearance status and conflict of interest declarations</li>
                <li>Ready for submission in professional tender format</li>
              </ul>
              <p className="mt-2 text-xs text-blue-600">
                💡 The tender response will be generated using advanced AI analysis to match your experience with job requirements.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default SaveBanner;