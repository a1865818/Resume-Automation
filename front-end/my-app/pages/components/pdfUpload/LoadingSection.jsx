const LoadingSection = ({ progress = null, isOCR = false }) => {
    return (
      <div className="flex justify-center my-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600/20 border-t-blue-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {isOCR ? "Extracting Text with OCR" : "Processing Your Resume"}
            </h3>
            <p className="text-slate-600 text-center mb-4">
              {isOCR 
                ? "Our OCR system is analyzing image-based content..."
                : "Our AI is analyzing your document and extracting information..."
              }
            </p>
            
            {/* Progress indicator */}
            {progress && (
              <div className="w-full max-w-md">
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
                  <p className="text-xs text-green-600 mt-2 text-center">
                    Using OCR for image-based content...
                  </p>
                )}
              </div>
            )}
            
            {/* OCR-specific tips */}
            {isOCR && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                <h4 className="font-semibold mb-1">OCR Processing:</h4>
                <ul className="space-y-1 list-disc ml-4">
                  <li>This may take longer for image-based PDFs</li>
                  <li>Processing quality depends on image clarity</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default LoadingSection;