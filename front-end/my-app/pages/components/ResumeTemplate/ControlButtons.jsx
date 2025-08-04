
const ControlButtons = ({
    handleDownloadPDF,
    handleDownloadWord,
    isPdfLoading,
    isWordLoading,
    setShowPdfSettings,
    remeasureResume,
    onBackToSummary
  }) => {
    return (
      <div className="mx-auto max-w-6xl px-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            {/* Left side - Download buttons */}
            <div className="flex flex-wrap gap-3">
              {/* PDF Download Button */}
              <button
                onClick={handleDownloadPDF}
                disabled={isPdfLoading || isWordLoading}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isPdfLoading || isWordLoading
                    ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 border border-red-600 hover:border-red-700'
                }`}
              >
                {isPdfLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Generating PDF...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </div>
                )}
              </button>
  
              {/* Word Download Button */}
              <button
                onClick={handleDownloadWord}
                disabled={isPdfLoading || isWordLoading}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isPdfLoading || isWordLoading
                    ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 hover:border-blue-700'
                }`}
              >
                {isWordLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Generating Word...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Word
                  </div>
                )}
              </button>
            </div>
  
            {/* Right side - Settings and other controls */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPdfSettings(true)}
                disabled={isPdfLoading || isWordLoading}
                className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  PDF Settings
                </div>
              </button>
  
              <button
                onClick={remeasureResume}
                disabled={isPdfLoading || isWordLoading}
                className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh 
                </div>
              </button>

              
       <button 
        onClick={onBackToSummary}
        style={{
          backgroundColor: '#6B7280',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Back to Summary
      </button>
            </div>
          </div>
  
          {/* Download Format Info */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800 mb-1">Download Options:</p>
                <ul className="space-y-1">
                  <li><strong>PDF:</strong> Standard web layout, optimized for online viewing and printing</li>
                  <li><strong>Word:</strong> Microsoft Word compatible format with landscape orientation and table-based layout</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500">
                  💡 Both formats maintain professional styling and include all resume content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ControlButtons;