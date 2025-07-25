// components/pdfSummary/JobDescriptionUpload.js
import { useRef, useState } from 'react';
import { extractWordContent } from '../../utils/wordUtils';
const JobDescriptionUpload = ({
    jobDescription,
    jobFileName,
    jobError,
    isProcessingJob,
    generationMode,
    onJobDescriptionChange,
    onJobFileUpload,
    onRemoveJob,
    onModeChange
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const fileInputRef = useRef(null);
  
    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const allowedTypes = ['application/pdf', 'text/plain'];
      const docTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
  
      if (![...allowedTypes, ...docTypes].includes(file.type) && !file.name.match(/\.(pdf|txt|doc|docx)$/i)) {
        onJobFileUpload(null, '', 'Unsupported file type. Use PDF, DOC, DOCX, or TXT.');
        return;
      }
  
      if (file.size > 10 * 1024 * 1024) {
        onJobFileUpload(null, '', 'File size should be less than 10MB.');
        return;
      }
  
      try {
        let extractedText = '';
  
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          const arrayBuffer = await file.arrayBuffer();
          const pdfjsLib = window?.pdfjsLib;
  
          if (!pdfjsLib) {
            throw new Error('PDF.js is not loaded. Please refresh the page.');
          }
  
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items.map(item => item.str).join(' ') + '\n\n';
          }
        } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
          extractedText = await file.text();
        } else if (
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.name.toLowerCase().endsWith('.docx')
        ) {
          // Only .docx is supported
          const result = await extractWordContent(file);
          if (result.success) {
            extractedText = result.text;
          } else {
            onJobFileUpload(null, '', result.error || 'Failed to extract text from Word document.');
            return;
          }
        } else if (
          file.type === 'application/msword' ||
          file.name.toLowerCase().endsWith('.doc')
        ) {
          onJobFileUpload(null, '', 'Traditional .doc files are not supported. Please upload a .docx, PDF, or TXT file.');
          return;
        } else {
          onJobFileUpload(null, '', 'Please convert DOC/DOCX files to PDF or TXT for best results.');
          return;
        }
  
        onJobFileUpload(file, extractedText, null);
      } catch (err) {
        console.error('File processing error:', err);
        onJobFileUpload(null, '', 'Error reading file. Try again or paste the description manually.');
      }
    };
  
    return (
      <div className="mb-6">
        {/* Mode Selection */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-3">Choose Generation Mode</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {['standard', 'tailored'].map(mode => {
              const isActive = generationMode === mode;
              const border = mode === 'standard' ? 'blue' : 'green';
  
              return (
                <button
                  key={mode}
                  onClick={() => onModeChange(mode)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isActive
                      ? `border-${border}-500 bg-${border}-50 ring-2 ring-${border}-200`
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-4 h-4 rounded-full mr-3 ${
                        isActive ? `bg-${border}-500` : 'bg-gray-300'
                      }`}
                    ></div>
                    <h4 className="font-semibold">
                      {mode === 'standard' ? 'Standard Template' : 'Job-Tailored Resume'}
                    </h4>
                    {mode === 'tailored' && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {mode === 'standard'
                      ? 'Generate a clean, professional resume from your current content.'
                      : 'Tailor your resume to specific job requirements for higher relevance.'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
  
        {/* Job Upload (only for tailored mode) */}
        {generationMode === 'tailored' && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-green-800">
                  Job Description / Tender Requirements
                </h3>
                <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Required
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-green-600 hover:text-green-800"
              >
                <svg
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
  
            {(isExpanded || generationMode === 'tailored') && (
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Job Description</label>
                  <div
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-sm">Click to upload PDF or TXT</p>
                    <p className="text-xs text-gray-500 mt-1">Max 10MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isProcessingJob}
                  />
                </div>
  
                {jobFileName && (
                  <div className="p-2 bg-green-100 border border-green-200 rounded mt-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">{jobFileName}</span>
                    <button onClick={onRemoveJob} className="text-red-500 hover:text-red-700 text-sm">
                      Remove
                    </button>
                  </div>
                )}
  
                {jobError && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded mt-2 text-sm text-red-700 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {jobError}
                  </div>
                )}
  
                {/* Manual Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Or Paste Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => onJobDescriptionChange(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-md resize-vertical focus:ring-green-500"
                    disabled={isProcessingJob}
                  />
                  {jobDescription && (
                    <p className="text-xs text-gray-500 mt-1">
                      {jobDescription.length} characters
                    </p>
                  )}
                </div>
  
                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                  <h4 className="font-semibold mb-2">How Tailoring Works:</h4>
                  <ul className="space-y-1 list-disc ml-5">
                    <li>Reorders skills to match job requirements</li>
                    <li>Emphasizes relevant experience and keywords</li>
                    <li>Highlights tailored achievements</li>
                    <li>Adjusts summary to align with job goals</li>
                    <li>Never adds false experience or claims</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default JobDescriptionUpload;