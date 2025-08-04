import { useState } from 'react';
import { extractWordContent } from '../../utils/wordUtils';

const PdfUploadCard = ({ fileName: parentFileName, error: parentError, onFileUpload, ocrProgress = null, isOCRProcessing = false }) => {
  // Internal state to show file name and error for both PDF and Word
  const [localFileName, setLocalFileName] = useState('');
  const [localError, setLocalError] = useState('');

  // New handler to support PDF and Word
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size check (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setLocalError('File size should be less than 10MB.');
      setLocalFileName('');
      onFileUpload(null, '', 'File size should be less than 10MB.');
      return;
    }

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setLocalFileName(file.name);
      setLocalError('');
      onFileUpload(e);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword' ||
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.doc')
    ) {
      // Use wordUtils.js
      try {
        const result = await extractWordContent(file);
        if (result.success) {
          setLocalFileName(file.name);
          setLocalError('');
          // Pass a synthetic event with extracted text
          onFileUpload({ target: { value: result.text, file } });
        } else {
          setLocalError(result.error || 'Failed to extract text from Word document.');
          setLocalFileName('');
          onFileUpload(null, '', result.error || 'Failed to extract text from Word document.');
        }
      } catch (err) {
        setLocalError('Error extracting text from Word document.');
        setLocalFileName('');
        onFileUpload(null, '', 'Error extracting text from Word document.');
      }
    } else {
      setLocalError('Unsupported file type. Please upload a PDF or Word document.');
      setLocalFileName('');
      onFileUpload(null, '', 'Unsupported file type. Please upload a PDF or Word document.');
    }
  };

  // Prefer local state, fallback to parent props
  const displayFileName = localFileName || parentFileName;
  const displayError = localError || parentError;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8 hover:shadow-2xl transition-all duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6-4h6m2 5l-6 6-6-6m6-6V4a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2h-3"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Your Resume</h2>
        <p className="text-slate-600">Upload your existing PDF or Word resume for AI analysis</p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="pdf-upload"
          className="group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-300"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-12 h-12 mb-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-lg font-semibold text-slate-700 group-hover:text-blue-600 transition-colors duration-300">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-slate-500">PDF, DOC, DOCX files only (Max 10MB)</p>
          </div>
          <input 
            id="pdf-upload" 
            type="file" 
            className="hidden" 
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            onChange={handleFileUpload} 
          />
        </label>
        {displayFileName && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="text-green-800 font-medium">{displayFileName}</span>
            </div>
          </div>
        )}
        {displayError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <span className="text-red-800">{displayError}</span>
            </div>
          </div>
        )}
        
        {/* OCR Progress Indicator */}
        {isOCRProcessing && ocrProgress && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-500 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span className="text-blue-800 font-medium">Processing with OCR...</span>
            </div>
            <div className="flex justify-between text-sm text-blue-600 mb-1">
              <span>Page {ocrProgress.current} of {ocrProgress.total}</span>
              <span>{Math.round((ocrProgress.current / ocrProgress.total) * 100)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(ocrProgress.current / ocrProgress.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {ocrProgress.stage === 'ocr' ? 'Extracting text from image-based content...' : 'Analyzing document...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfUploadCard;