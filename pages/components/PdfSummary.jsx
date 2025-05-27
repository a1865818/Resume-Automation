// components/PdfSummary.js
import config from '@/configs';
import Avatar from "@/public/image.jpeg";
import { useEffect, useState } from 'react';
import { generateResumeJSON } from '../api/geminiApi';
import ResumeTemplate from './ResumeTemplate'; // Import the resume template



const PdfSummary = ({ pdfText, fileName }) => {
  const [resumeData, setResumeData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [error, setError] = useState('');
  const [useMockData, setUseMockData] = useState(false);
  const [showResumeTemplate, setShowResumeTemplate] = useState(false);
  
  const mockResumeData = {
    profile: {
      name: "Tony Nguyen",
      title: "ICT HEAD OF DELIVERY",
      location: "Canberra",
      clearance: "NV1",
      photo: Avatar.src,
      description: "Tony Nguyen is a highly accomplished ICT Head of Delivery with a distinguished background in project and program management, boasting extensive experience leading complex software asset and lifecycle management initiatives. His career at IBM has spanned various leadership roles, including Senior Project Manager, Senior Program Manager, Transformation Program Lead, and Asia Pacific CIO Program Director. In these roles, he has consistently demonstrated the ability to oversee large-scale IT transformation programs, manage multi-million-dollar portfolios, and successfully deliver complex projects ahead of schedule. His expertise encompasses software procurement, licensing compliance, vendor negotiations, software deployment, governance, and risk mitigation strategies. Tony's proficiency extends to Agile methodologies, stakeholder engagement, and optimizing project processes, driving efficiency and operational excellence across diverse sectors, including government and defense. His proven ability to navigate complex regulatory landscapes while ensuring software efficiency and compliance makes him a strategic asset for organizations requiring meticulous software management and governance oversight.",
      description2: "\Tony's expertise includes software procurement, licensing compliance, vendor negotiations, deployment, governance, and risk mitigation. He is highly skilled in Agile methodologies, stakeholder engagement, and optimizing project processes across government and defense sectors. Known for leading high-performing teams of up to 600 across Asia, he has driven strategic transformations and saved IBM over AUD$1 million annually through operational improvements and new delivery models. Tony is also recognized for innovation, mentoring, and thought leadership in IT transformation."
    },
    qualifications: [
      "Bachelor of Science (Computer Science)",
      "Project Management Professional (PMP)",
      "Professional Scrum Master",
      "Professional Agile Leadership™ (PAL I)",
      "Certified Manager (IBM)",
      "Microsoft Certified: Azure Fundamentals"
    ],
    affiliations: [
      "Project Management Institute",
      "Toastmasters",
      "Association of Information Technology Professionals"
    ],
    skills: [
      "Project Management",
      "Digital Transformation",
      "Agile Methodologies",
      "Change Management",
      "Software Development Life Cycle",
      "Stakeholder Engagement",
      "Team Leadership & Collaboration",
      "IT Infrastructure Management"
    ],
    keyAchievements: [
      "Developed and implemented a new Project Management Framework and Agile Transformation program across Asia Pacific 6 months ahead of schedule",
      "Established IBM delivery centers in India, China, and the Philippines, growing the team from 0 to over 600 practitioners",
      "Created a New Delivery Operating Model that saved IBM over AUD$1 million per year",

    ],
    experience: [
      {
        title: "Senior Project Manager – IBM (NSW Department of Fair Trading)",
        period: "Jul 2022 – Present",
        responsibilities: [
          "Led a team of IT professionals and Project Managers in delivering business transformation programs",
          "Oversaw application support services aligned with SLAs and managed contract performance",
          "Monitored risks and implemented proactive mitigation strategies",
          "Established change management processes for smooth project transitions"
        ]
      },
      {
        title: "Asia Pacific CIO Program Director – IBM",
        period: "Jan 2016 – Jun 2020",
        responsibilities: [
          "Led a team of 500+ IT professionals across the Asia Pacific region",
          "Managed a portfolio exceeding AUD$50 million in projects and support services",
          "Implemented Agile Transformation and New Way of Working initiatives",
          "Built organizational capability in leading-edge skills and delivery excellence"
        ]
      }
    ],
    referees: [
      {
        name: "Siva Rajeswaran",
        title: "IBM",
        email: "srajeswaran@au1.ibm.com",
        phone: "+61 401 145 640"
      },
      {
        name: "Edelize Lipski",
        title: "IBM",
        email: "elipski@au1.ibm.com",
        phone: "+61 403 066 896"
      }
    ]
  };
  
  // Initialize API key from environment variables
  useEffect(() => {
    if (config.geminiApiKey) {
      setApiKey(config.geminiApiKey);
    }
  }, []);
  
  const handleGenerateResume = async () => {
    // If using mock data, just set it and show template
    if (useMockData) {
      setResumeData(mockResumeData);
      setShowResumeTemplate(true);
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
      // Use the new JSON-based API that returns resume-test.jsx compatible format
      const generatedResumeData = await generateResumeJSON(pdfText, apiKey || undefined);
      setResumeData(generatedResumeData);
      setShowResumeTemplate(true);
    } catch (err) {
      console.error('Resume generation error:', err);
      setError(err.message || 'Failed to generate resume. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    setShowApiKeyInput(false);
    handleGenerateResume();
  };
  
  const toggleMockData = () => {
    setUseMockData(!useMockData);
    if (!useMockData) {
      setResumeData(null);
      setShowResumeTemplate(false);
    }
  };

  const handleBackToSummary = () => {
    setShowResumeTemplate(false);
    setResumeData(null);
  };

  // If showing resume template, render it
  if (showResumeTemplate && resumeData) {
    return (
      <div>
        <ResumeTemplate resumeData={resumeData} onBackToSummary={handleBackToSummary} />
      </div>
    );
  }

  if (showApiKeyInput) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Generate Resume with Gemini</h2>
        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            To generate a structured resume, you need to provide your Google API key for the Gemini API.
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
    <div className="w-full px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Professional Resume Generator</h2>
        
        {!resumeData && !isGenerating && (
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Generate a professional resume template from "{fileName}" using Google's Gemini AI.
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleGenerateResume}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {useMockData ? 'Generate with Mock Data' : 'Generate Resume with AI'}
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
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-600">Generating professional resume with Gemini AI...</p>
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

        {(resumeData || error) && (
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
      </div>
    </div>
  );
};

export default PdfSummary;