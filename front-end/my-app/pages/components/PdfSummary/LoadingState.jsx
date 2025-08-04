import React from 'react';

const LoadingState = ({ 
  message = "Processing your document...", 
  progress = null,
  isOCR = false 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8">
      <div className="text-center">
        {/* OCR-specific icon */}
        {isOCR && (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        )}
        
        {/* Regular loading icon */}
        {!isOCR && (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isOCR ? "Extracting Text with OCR" : "Processing Document"}
        </h2>
        
        <p className="text-slate-600 mb-4">{message}</p>
        
        {/* Progress indicator */}
        {progress && (
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between text-sm text-slate-500 mb-2">
              <span>
                {progress.stage === 'analyzing' ? 'Analyzing page' : 'Processing page'} {progress.current} of {progress.total}
              </span>
              <span>{Math.round((progress.current / progress.total) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              ></div>
            </div>
            {progress.stage === 'ocr' && (
              <p className="text-xs text-green-600 mt-2">
                Using OCR for image-based content...
              </p>
            )}
          </div>
        )}
        
        {/* OCR-specific tips */}
        {isOCR && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <h4 className="font-semibold mb-2">OCR Processing Tips:</h4>
            <ul className="space-y-1 list-disc ml-5">
              <li>This may take longer for image-based PDFs</li>
              <li>Processing quality depends on image clarity</li>
              <li>Results will be optimized for resume content</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
  