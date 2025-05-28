// pages/pdf-upload.js
import { useState } from "react";
import Layout from "./components/Layout";
import PdfSummary from "./components/PdfSummary";

export default function PdfUpload() {
  const [pdfText, setPdfText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setError("");
    setPdfText("");

    try {
      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Use pdf.js to parse the PDF and extract text
      const pdfjsLib = window.pdfjsLib;
      // Set workerSrc to cdn
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      // Extract text from all pages
      let extractedText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        extractedText += `Page ${i}:\n${pageText}\n\n`;
      }
      
      setPdfText(extractedText);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError("Error processing PDF. Please try again with a different file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Header and Upload Section - Constrained Width */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">PDF Resume Generator</h1>
        
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload PDF Resume</h2>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="pdf-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF files only</p>
                </div>
                <input 
                  id="pdf-upload" 
                  type="file" 
                  className="hidden" 
                  accept="application/pdf" 
                  onChange={handleFileUpload} 
                />
              </label>
            </div>
            {fileName && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: <span className="font-medium">{fileName}</span>
              </p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>

      {/* PdfSummary Component - Full Width */}
      {pdfText && (
        <div className="w-full">
          <PdfSummary pdfText={pdfText} fileName={fileName} />
        </div>
      )}
    </Layout>
  );
}