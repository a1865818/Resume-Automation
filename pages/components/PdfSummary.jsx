// import config from '@/configs';
// import { useEffect, useState } from 'react';
// import { generateSummary } from '../api/geminiApi';

// const PdfSummary = ({ pdfText, fileName }) => {
//   const [summary, setSummary] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [apiKey, setApiKey] = useState('');
//   const [showApiKeyInput, setShowApiKeyInput] = useState(false);
//   const [error, setError] = useState('');
  
//   // Initialize API key from environment variables
//   useEffect(() => {
//     if (config.geminiApiKey) {
//       setApiKey(config.geminiApiKey);
//     }
//   }, []);
  
//   const handleGenerateSummary = async () => {
//     // If no API key is set in env vars and no custom key provided, show input
//     if (!config.geminiApiKey && !apiKey) {
//       setShowApiKeyInput(true);
//       return;
//     }
    
//     setIsGenerating(true);
//     setError('');
    
//     try {
//       // Use custom API key if provided, otherwise use env var (handled in the API utility)
//       const generatedSummary = await generateSummary(pdfText, apiKey || undefined);
//       setSummary(generatedSummary);
//     } catch (err) {
//       console.error('Summary generation error:', err);
//       setError(err.message || 'Failed to generate summary. Please check your API key and try again.');
//     } finally {
//       setIsGenerating(false);
//     }
//   };
  
//   const handleApiKeySubmit = (e) => {
//     e.preventDefault();
//     setShowApiKeyInput(false);
//     handleGenerateSummary();
//   };
  
//   if (showApiKeyInput) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-semibold mb-4">Generate Summary with Gemini</h2>
//         <div className="mb-4">
//           <p className="text-gray-600 mb-4">
//             To generate a summary, you need to provide your Google API key for the Gemini API.
//             You can get a key from the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Google AI Studio</a>.
//           </p>
//           <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-amber-700">
//                   You can also set your API key in the .env.local file using the NEXT_PUBLIC_GEMINI_API_KEY variable.
//                 </p>
//               </div>
//             </div>
//           </div>
//           <form onSubmit={handleApiKeySubmit}>
//             <div className="mb-4">
//               <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
//                 Google API Key (Gemini)
//               </label>
//               <input
//                 type="text"
//                 id="apiKey"
//                 value={apiKey}
//                 onChange={(e) => setApiKey(e.target.value)}
//                 placeholder="Enter your Google API key"
//                 className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2 text-sm"
//                 required
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 Your API key is used only in your browser and is not stored on any server.
//               </p>
//             </div>
//             <div className="flex space-x-4">
//               <button
//                 type="submit"
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
//               >
//                 Continue
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowApiKeyInput(false)}
//                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-xl font-semibold mb-4">Document Summary</h2>
      
//       {!summary && !isGenerating && (
//         <div className="mb-6">
//           <p className="text-gray-600 mb-4">
//             Generate an AI-powered summary of "{fileName}" using Google's Gemini API.
//           </p>
//           <button
//             onClick={handleGenerateSummary}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
//           >
//             Generate Summary
//           </button>
//         </div>
//       )}
      
//       {isGenerating && (
//         <div className="flex flex-col items-center justify-center py-6">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
//           <p className="text-gray-600">Generating summary with Gemini AI...</p>
//         </div>
//       )}
      
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">
//                 {error}
//               </p>
//               <button 
//                 onClick={() => setShowApiKeyInput(true)}
//                 className="mt-2 text-sm text-red-700 underline"
//               >
//                 Update API Key
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {summary && (
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium text-gray-900">Summary</h3>
//             <button
//               onClick={handleGenerateSummary}
//               className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
//             >
//               Regenerate
//             </button>
//           </div>
//           <div className="prose prose-indigo max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200">
//             <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
//           </div>
//         </div>
//       )}

//       {(summary || error) && (
//         <div className="mt-4 text-right">
//           <button
//             onClick={() => setShowApiKeyInput(true)}
//             className="text-gray-500 hover:text-gray-700 text-sm"
//           >
//             Change API Key
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PdfSummary;

// components/PdfSummary.js
import config from '@/configs';
import { useEffect, useState } from 'react';
import { generateSummary } from '../api/geminiApi';
import { createSummaryPdf, downloadPdf, generateUniquePdfFilename } from '../utils/pdfUtils';

const PdfSummary = ({ pdfText, fileName }) => {
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // Mock data for testing
  const mockSummary = `**Andrew Nguyen: Software Engineer Summary**
Andrew Nguyen is a highly skilled and motivated full-stack software developer specializing in JavaScript and TypeScript. His resume highlights significant experience in various roles, showcasing strong problem-solving abilities and a collaborative work ethic. He is proficient in numerous programming languages, frameworks, databases, and cloud platforms.
**Key Skills & Technologies:**
* **Programming Languages:** C++, Python, JavaScript, TypeScript, HTML, CSS, MATLAB, SQL
* **Frameworks & Tools:** NodeJS, Next.js, Vue.js, React.js, Express.js, Docker, Git, GitLab (CI/CD), Bash, Jira, Confluence
* **Databases & Cloud:** MySQL, PostgreSQL, SQLite, MongoDB, Microsoft Azure, AWS (S3, Elastic Beanstalk, EC2)
* **Architecture:** Microservices, Serverless, Parallel & Distributed Computing
**Professional Experience Highlights:**
* **Deloitte (Summer Intern):** Improved data query efficiency by 30% using OpenStreetMap's Overpass Turbo API; optimized database queries and data accuracy; boosted data processing speed by 40% through efficient handling of REST API data; created interactive map visualizations enhancing user engagement by 35%.
* **University of Adelaide (Research Assistant):** Developed a cut tree representation for meat production, improving efficiency and boosting profits by at least 25%; implemented an algorithm to optimize meat production using Python and Integer Linear Programming (ILP).
* **VNPT (Data Engineer):** Increased data processing efficiency by 20% using Apache Spark; developed predictive models using machine learning techniques; created dynamic dashboards and interactive visualizations.
**Personal Projects Highlights:**
* **ImaGIaI:** A full-stack AI-powered image generator using JavaScript, Node.js, Express.js, MongoDB, and React.js.
* **Blogify:** A full-stack blogging platform with user authentication (Google OAuth), CRUD operations, and file uploads.
* **InsightFactoryAI:** A predictive maintenance model for rail break detection using Australian Rail Track Corporation data, achieving an F1 score of 0.7.
* **CryptoVerse:** A cryptocurrency web app with real-time stats, crypto details, and news updates.
* **Universe:** A student club platform with social media login, user authentication, and a chat feature.
**Education:**
* **Bachelor of Computer Science (Artificial Intelligence), University of Adelaide (expected graduation Dec 2024)**
**Overall:** Andrew Nguyen possesses a strong technical skillset, proven experience in various development roles, and a portfolio of impressive personal projects, making him a strong candidate for software engineering positions.`;
  
  // Initialize API key from environment variables
  useEffect(() => {
    if (config.geminiApiKey) {
      setApiKey(config.geminiApiKey);
    }
  }, []);
  
  const handleGenerateSummary = async () => {
    // If using mock data, just set it and return
    if (useMockData) {
      setSummary(mockSummary);
      return;
    }
    
    // If no API key is set in env vars and no custom key provided, show input
    if (!config.geminiApiKey && !apiKey) {
      setShowApiKeyInput(true);
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      // Use custom API key if provided, otherwise use env var (handled in the API utility)
      const generatedSummary = await generateSummary(pdfText, apiKey || undefined);
      setSummary(generatedSummary);
    } catch (err) {
      console.error('Summary generation error:', err);
      setError(err.message || 'Failed to generate summary. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    setShowApiKeyInput(false);
    handleGenerateSummary();
  };
  
  const toggleMockData = () => {
    setUseMockData(!useMockData);
    if (!useMockData) {
      // If disabling mock data, clear the summary
      setSummary('');
    }
  };
  
  // Download the summary as a PDF
  const handleDownloadPdf = () => {
    try {
      const pdfBlob = createSummaryPdf(summary, fileName);
      const pdfFileName = generateUniquePdfFilename();
      downloadPdf(pdfBlob, pdfFileName);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF. Please try again.');
    }
  };
  
  // Save the summary to the server
  const handleSavePdf = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    setError('');
    
    try {
      const response = await fetch('/api/saveSummaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summaryText: summary,
          originalFileName: fileName,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save summary');
      }
      
      setSaveSuccess({
        message: 'Resume summary saved successfully',
        filePath: data.filePath,
        fileName: data.fileName,
      });
    } catch (err) {
      console.error('Error saving PDF:', err);
      setError(err.message || 'Failed to save PDF. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  if (showApiKeyInput) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Generate Summary with Gemini</h2>
        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            To generate a summary, you need to provide your Google API key for the Gemini API.
            You can get a key from the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Google AI Studio</a>.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  You can also set your API key in the .env.local file using the NEXT_PUBLIC_GEMINI_API_KEY variable.
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleApiKeySubmit}>
            <div className="mb-4">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                Google API Key (Gemini)
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google API key"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2 text-sm"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Your API key is used only in your browser and is not stored on any server.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => setShowApiKeyInput(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Document Summary</h2>
      
      {!summary && !isGenerating && (
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Generate an AI-powered summary of "{fileName}" using Google's Gemini API.
          </p>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleGenerateSummary}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Generate Summary
            </button>
            
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="checkbox"
                id="useMockData"
                checked={useMockData}
                onChange={toggleMockData}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="useMockData" className="ml-2 block text-sm text-gray-700">
                Use mock data (save API credits)
              </label>
            </div>
          </div>
        </div>
      )}
      
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Generating summary with Gemini AI...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
              <button 
                onClick={() => setShowApiKeyInput(true)}
                className="mt-2 text-sm text-red-700 underline"
              >
                Update API Key
              </button>
            </div>
          </div>
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                {saveSuccess.message}
              </p>
              <a 
                href={saveSuccess.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm text-green-700 underline"
              >
                View Saved PDF
              </a>
            </div>
          </div>
        </div>
      )}
      
      {summary && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Summary</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSummary('')}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Clear
              </button>
              <button
                onClick={handleGenerateSummary}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Regenerate
              </button>
            </div>
          </div>
          
          <div className="prose prose-indigo max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download as PDF
            </button>
            
            <button
              onClick={handleSavePdf}
              disabled={isSaving}
              className={`flex items-center justify-center ${
                isSaving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white px-4 py-2 rounded-md text-sm font-medium`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save to Server
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {(summary || error) && (
        <div className="mt-4 text-right">
          <button
            onClick={() => setShowApiKeyInput(true)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Change API Key
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfSummary;