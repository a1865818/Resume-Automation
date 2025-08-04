import { useState } from 'react';
import {
    loadPDFJS,
    testComprehensiveOCR,
    testOCRFunctionality
} from './utils/pdfUtils';

export default function OCRTest() {
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [pdfResult, setPdfResult] = useState(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [importTest, setImportTest] = useState(null);
  const [pdfjsTest, setPdfjsTest] = useState(null);

  const [comprehensiveResult, setComprehensiveResult] = useState(null);
  const [isComprehensiveTesting, setIsComprehensiveTesting] = useState(false);
  const [copyStatus, setCopyStatus] = useState({});

  // Copy to clipboard function
  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [section]: 'Copied!' }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [section]: '' }));
      }, 2000);
    } catch (err) {
      setCopyStatus(prev => ({ ...prev, [section]: 'Failed to copy' }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [section]: '' }));
      }, 2000);
    }
  };

  const testImport = async () => {
    try {
      console.log("Testing Tesseract.js import...");
      const { createWorker } = await import("tesseract.js");
      console.log("✓ Tesseract.js import successful");
      setImportTest({ success: true, message: "Tesseract.js imported successfully" });
    } catch (error) {
      console.error("Tesseract.js import failed:", error);
      setImportTest({ success: false, message: `Import failed: ${error.message}` });
    }
  };

  const testPDFJS = async () => {
    try {
      console.log("Testing PDF.js loading...");
      const pdfjsLib = await loadPDFJS();
      console.log("✓ PDF.js loaded successfully");
      setPdfjsTest({ success: true, message: "PDF.js loaded successfully" });
    } catch (error) {
      console.error("PDF.js loading failed:", error);
      setPdfjsTest({ success: false, message: `Loading failed: ${error.message}` });
    }
  };

  const runOCRTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      console.log("Starting OCR test...");
      const result = await testOCRFunctionality();
      console.log("OCR test result:", result);
      
      setTestResult({
        success: result,
        message: result ? 'OCR test passed successfully!' : 'OCR test failed. Check console for details.'
      });
    } catch (error) {
      console.error("OCR test error:", error);
      setTestResult({
        success: false,
        message: `OCR test failed: ${error.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleComprehensiveOCRTest = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setIsComprehensiveTesting(true);
    setComprehensiveResult(null);

    try {
      console.log("Testing comprehensive OCR...");
      const results = await testComprehensiveOCR(file);
      console.log("Comprehensive OCR test results:", results);
      
      setComprehensiveResult({
        success: true,
        results: results,
        message: 'Comprehensive OCR test completed successfully!'
      });
    } catch (error) {
      console.error("Comprehensive OCR test error:", error);
      setComprehensiveResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsComprehensiveTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">OCR Functionality Test</h1>
        
        {/* Import Test Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tesseract.js Import Test</h2>
          <p className="text-gray-600 mb-4">
            Test if Tesseract.js can be imported successfully.
          </p>
          
          <button
            onClick={testImport}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mr-4"
          >
            Test Import
          </button>
          
          {importTest && (
            <div className={`mt-4 p-4 rounded-md ${
              importTest.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${
                importTest.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {importTest.message}
              </p>
            </div>
          )}
        </div>

        {/* PDF.js Loading Test Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">PDF.js Loading Test</h2>
          <p className="text-gray-600 mb-4">
            Test if PDF.js can be loaded successfully.
          </p>
          
          <button
            onClick={testPDFJS}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Test PDF.js Loading
          </button>
          
          {pdfjsTest && (
            <div className={`mt-4 p-4 rounded-md ${
              pdfjsTest.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${
                pdfjsTest.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {pdfjsTest.message}
              </p>
            </div>
          )}
        </div>

        {/* OCR Test Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic OCR Test</h2>
          <p className="text-gray-600 mb-4">
            This test creates a simple canvas with text and attempts to extract it using OCR.
          </p>
          
          <button
            onClick={runOCRTest}
            disabled={isTesting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isTesting ? 'Running Test...' : 'Run OCR Test'}
          </button>
          
          {testResult && (
            <div className={`mt-4 p-4 rounded-md ${
              testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.message}
              </p>
            </div>
          )}
        </div>


        {/* Comprehensive OCR Test Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Comprehensive OCR Test (Recommended for Resume Generation)</h2>
          <p className="text-gray-600 mb-4">
            Test comprehensive OCR that combines Tesseract text extraction with Gemini skills detection to provide complete content plus skills. Use the "Combined Text (Full Content + Skills)" as input for standard resume generation.
          </p>
          
          <input
            type="file"
            accept=".pdf"
            onChange={handleComprehensiveOCRTest}
            disabled={isComprehensiveTesting}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          
          {isComprehensiveTesting && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-md">
              <p className="text-indigo-800">Testing comprehensive OCR extraction...</p>
            </div>
          )}
          
          {comprehensiveResult && (
            <div className={`mt-4 p-4 rounded-md ${
              comprehensiveResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                comprehensiveResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {comprehensiveResult.success ? 'Comprehensive OCR Results' : 'Comprehensive OCR Failed'}
              </h3>
              
              {comprehensiveResult.success && comprehensiveResult.results && (
                <div className="space-y-4">
                  {/* Summary Statistics */}
                  <div className="bg-indigo-50 p-4 rounded-md">
                    <h4 className="font-semibold text-indigo-800 mb-3">Processing Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-md border">
                        <p className="font-semibold text-gray-700">Total Pages</p>
                        <p className="text-2xl font-bold text-indigo-600">{comprehensiveResult.results.comprehensive.summary.totalPages}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <p className="font-semibold text-gray-700">Pages with Skills</p>
                        <p className="text-2xl font-bold text-green-600">{comprehensiveResult.results.comprehensive.summary.pagesWithSkills}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <p className="font-semibold text-gray-700">Full Text Length</p>
                        <p className="text-2xl font-bold text-blue-600">{comprehensiveResult.results.comprehensive.summary.totalFullTextLength}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border">
                        <p className="font-semibold text-gray-700">Skills Text Length</p>
                        <p className="text-2xl font-bold text-purple-600">{comprehensiveResult.results.comprehensive.summary.totalSkillsLength}</p>
                      </div>
                    </div>
                    <div className="mt-3 bg-white p-3 rounded-md border">
                      <p className="font-semibold text-gray-700">Processing Time</p>
                      <p className="text-lg font-bold text-orange-600">{comprehensiveResult.results.comprehensive.time}ms</p>
                    </div>
                  </div>

                  {/* Combined Text Result */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-800">Combined Text (Full Content + Skills)</h4>
                      <button
                        onClick={() => copyToClipboard(comprehensiveResult.results.comprehensive.result.combinedText || '', 'comprehensive')}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        {copyStatus.comprehensive || 'Copy'}
                      </button>
                    </div>
                    <div className="bg-white p-3 rounded-md max-h-96 overflow-y-auto border">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                        {comprehensiveResult.results.comprehensive.result.combinedText || 'No text extracted'}
                      </pre>
                    </div>
                  </div>

                  {/* Full Text Only */}
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-blue-800">Full Text Only</h4>
                      <button
                        onClick={() => copyToClipboard(comprehensiveResult.results.comprehensive.result.fullText || '', 'fullText')}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        {copyStatus.fullText || 'Copy'}
                      </button>
                    </div>
                    <div className="bg-white p-3 rounded-md max-h-64 overflow-y-auto border">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                        {comprehensiveResult.results.comprehensive.result.fullText || 'No text extracted'}
                      </pre>
                    </div>
                  </div>

                  {/* Skills Sections Only */}
                  {comprehensiveResult.results.comprehensive.summary.pagesWithSkills > 0 && (
                    <div className="bg-purple-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-purple-800">Skills Sections Only</h4>
                        <button
                          onClick={() => {
                            const skillsText = comprehensiveResult.results.comprehensive.result.pages
                              .filter(page => page.hasSkillsSection && page.skillsSection)
                              .map(page => `Page ${page.pageNumber} Skills:\n${page.skillsSection}`)
                              .join('\n\n');
                            copyToClipboard(skillsText, 'skillsOnly');
                          }}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                        >
                          {copyStatus.skillsOnly || 'Copy'}
                        </button>
                      </div>
                      <div className="bg-white p-3 rounded-md max-h-64 overflow-y-auto border">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                          {comprehensiveResult.results.comprehensive.result.pages
                            .filter(page => page.hasSkillsSection && page.skillsSection)
                            .map(page => `Page ${page.pageNumber} Skills:\n${page.skillsSection}`)
                            .join('\n\n') || 'No skills sections found'}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {!comprehensiveResult.success && (
                <p className="text-red-700">{comprehensiveResult.error}</p>
              )}
            </div>
          )}
        </div>


      </div>
    </div>
  );
} 