import { useState } from 'react';
import { testOCRFunctionality, extractTextFromPDF, loadPDFJS } from './utils/pdfUtils';

export default function OCRTest() {
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [pdfResult, setPdfResult] = useState(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [importTest, setImportTest] = useState(null);
  const [pdfjsTest, setPdfjsTest] = useState(null);

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

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setIsProcessingPdf(true);
    setPdfResult(null);

    try {
      const extractedText = await extractTextFromPDF(file, {
        useOCR: true,
        verbose: true,
        progressCallback: (progress) => {
          console.log(`Processing page ${progress.current}/${progress.total} - ${progress.stage}`);
        }
      });

      setPdfResult({
        success: true,
        text: extractedText,
        length: extractedText.length
      });
    } catch (error) {
      setPdfResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsProcessingPdf(false);
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

        {/* PDF Upload Test Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">PDF OCR Test</h2>
          <p className="text-gray-600 mb-4">
            Upload a PDF file to test OCR extraction on actual documents.
          </p>
          
          <input
            type="file"
            accept=".pdf"
            onChange={handlePdfUpload}
            disabled={isProcessingPdf}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          
          {isProcessingPdf && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">Processing PDF with OCR...</p>
            </div>
          )}
          
          {pdfResult && (
            <div className={`mt-4 p-4 rounded-md ${
              pdfResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                pdfResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {pdfResult.success ? 'PDF Processing Successful' : 'PDF Processing Failed'}
              </h3>
              
              {pdfResult.success ? (
                <div>
                  <p className="text-green-700 mb-2">
                    Extracted {pdfResult.length} characters of text
                  </p>
                  <div className="bg-gray-100 p-3 rounded-md max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                      {pdfResult.text.substring(0, 1000)}
                      {pdfResult.text.length > 1000 && '...'}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-red-700">{pdfResult.error}</p>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Instructions</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Run the basic OCR test first to verify Tesseract.js is working</li>
            <li>• Upload an image-based PDF to test actual OCR functionality</li>
            <li>• Check the browser console for detailed logging</li>
            <li>• OCR works best with clear, high-contrast text</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 