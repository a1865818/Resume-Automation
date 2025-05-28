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
  
  // Add new states for save functionality
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  const mockResumeData = {
    profile: {
      name: "Tony Nguyen",
      title: "ICT HEAD OF DELIVERY",
      location: "Canberra",
      clearance: "NV1",
      photo: Avatar.src,
      description: "Tony Nguyen is a highly accomplished ICT Head of Delivery with a distinguished background in project and program management, boasting extensive experience leading complex software asset and lifecycle management initiatives. His career at IBM has spanned various leadership roles, including Senior Project Manager, Senior Program Manager, Transformation Program Lead, and Asia Pacific CIO Program Director. In these roles, he has consistently demonstrated the ability to oversee large-scale IT transformation programs, manage multi-million-dollar portfolios, and successfully deliver complex projects ahead of schedule. His expertise encompasses software procurement, licensing compliance, vendor negotiations, software deployment, governance, and risk mitigation strategies. Tony's proficiency extends to Agile methodologies, stakeholder engagement, and optimizing project processes, driving efficiency and operational excellence across diverse sectors, including government and defense. His proven ability to navigate complex regulatory landscapes while ensuring software efficiency and compliance makes him a strategic asset for organizations requiring meticulous software management and governance oversight.",
      description2: "Tony's expertise includes software procurement, licensing compliance, vendor negotiations, deployment, governance, and risk mitigation. He is highly skilled in Agile methodologies, stakeholder engagement, and optimizing project processes across government and defense sectors. Known for leading high-performing teams of up to 600 across Asia, he has driven strategic transformations and saved IBM over AUD$1 million annually through operational improvements and new delivery models. Tony is also recognized for innovation, mentoring, and thought leadership in IT transformation."
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
      "Created a New Delivery Operating Model that saved IBM over AUD$1 million per year"
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
    fullExperience: [
      {
        title: "Senior Project Manager – IBM (NSW Department of Fair Trading)",
        period: "Jul 2022 – Present",
        responsibilities: [
          "Led a team of IT Professionals and Project Managers in delivering comprehensive business transformation programs",
          "Delivered application support services and business transformation programs aligned with organizational objectives",
          "Partnered with project team members to address problems promptly and maintain project momentum",
          "Monitored contracts and service level agreements, identifying potential risks and implementing mitigation actions",
          "Maintained schedules to meet key milestones at every project phase ensuring timely delivery",
          "Communicated project plans and progress to key stakeholders and project contributors effectively",
          "Monitored project progress, identified risks, and took corrective measures for successful project outcomes",
          "Developed and maintained relationships with key stakeholders across all organizational levels",
          "Established and managed change management processes for successful project transitions",
          "Coordinated cross-functional teams for timely project delivery and compliance, including testing teams, functional teams, and developers"
        ]
      },
      {
        title: "Senior Program Manager | IBM",
        period: "September 2021 - June 2022",
        responsibilities: [
          "Led a team of 34 PeopleSoft consultants in delivering complex enterprise solutions",
          "Delivered the PeopleSoft Time and Labour module across Suncorp organisation successfully",
          "Facilitated requirements gathering workshops and developed comprehensive project plans",
          "Maintained schedules to meet key milestones and ensured project deliverables quality",
          "Partnered with project team members, vendors, and clients to address issues promptly and effectively",
          "Monitored project progress, identified risks, and implemented corrective measures proactively",
          "Developed and maintained relationships with key stakeholders at all organizational levels",
          "Tracked project and team member performance to intervene in mistakes or delays before escalation"
        ]
      },
      {
        title: "Transformation Program Lead | IBM",
        period: "July 2020 - August 2021",
        responsibilities: [
          "Led a comprehensive digital transformation program at Westpac, focusing on Agile, Automation, DevOps, and AI initiatives",
          "Established Vision, Mission, Governance, and Framework for digital transformation across the organization",
          "Provided industry thought leadership, strategic solution advisory, and expert consultation to senior executives",
          "Developed and delivered comprehensive IT and digital transformation strategy aligned with business objectives",
          "Managed and delivered processes, system and cultural change initiatives across multiple business units",
          "Developed and implemented innovation programs to drive competitive advantage and operational efficiency"
        ]
      },
      {
        title: "Asia Pacific CIO Program Director | IBM",
        period: "January 2016 - June 2020",
        responsibilities: [
          "Led a team of 500+ IT professionals across Asia Pacific region delivering technology solutions",
          "Defined technology strategies and provided comprehensive application services to enterprise clients",
          "Established a centralised shared service as a single IT department improving operational efficiency",
          "Implemented Agile Transformation and New Way of Working for AP region ahead of schedule",
          "Managed and accountable for a portfolio of over AUD$50 million projects and support services",
          "Built organisation capabilities on leading-edge skills and enhanced technical competencies",
          "Provided leadership and mentorship to Program Managers and Project Managers across the region"
        ]
      },
      {
        title: "Asia Pacific CIO Delivery Project Executive | IBM",
        period: "January 2010 - December 2015",
        responsibilities: [
          "Led a team of 250 IT professionals across Australia, India, China, and the Philippines",
          "Provided comprehensive application support services and managed extensive project portfolios",
          "Established governance frameworks and relationships with IBM extended teams across multiple countries",
          "Chaired steering committee meetings for key strategic projects ensuring alignment with business objectives",
          "Oversaw project implementation, financial management, and administrative oversight for multiple concurrent projects",
          "Mentored, empowered, and developed careers of Senior Managers across the Asia Pacific region",
          "Provided advisory services to top-tier client executives on strategic technology initiatives"
        ]
      },
      {
        title: "Service Delivery Manager | IBM",
        period: "January 2006 - December 2009",
        responsibilities: [
          "Managed the full project lifecycle for 15 billing Vodafone applications ensuring seamless operations",
          "Ensured compliance with service level agreements and maintained high customer satisfaction scores",
          "Participated in drafting service budgeting and advised on cost reduction opportunities",
          "Maintained proper staffing levels for timely deliveries across multiple concurrent projects",
          "Managed client and supplier contracts ensuring mutually beneficial outcomes",
          "Built strong, lasting client relationships that contributed to long-term business success"
        ]
      }
    ],
    referees: [
      {
        name: "Siva Rajeswaran",
        title: "Business Development Manager (IBM)",
        email: "srajeswaran@au1.ibm.com",
        phone: "+61 401 145 640"
      },
      {
        name: "Edelize Lipski",
        title: "Practice Area Lead (IBM)",
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

  // Add save template function
  const saveTemplateToHistory = async (resumeData, originalFileName) => {
    try {
      setIsSaving(true);
      setSaveMessage('');
      console.log('Saving resume template to history...');
      
      const response = await fetch('/api/saveResume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resumeData,
          originalFileName: originalFileName
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Resume template saved to history successfully:', result);
        setSaveMessage('✅ Resume template saved to history successfully!');
        setIsSaved(true);
        return result;
      } else {
        console.error('Failed to save resume template:', response.status);
        setSaveMessage('❌ Failed to save resume template. Please try again.');
      }
    } catch (error) {
      console.error('Error saving resume template to history:', error);
      setSaveMessage('❌ Error saving resume template. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear message after 5 seconds
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };
  
  const handleGenerateResume = async () => {
    // Reset save states when generating new resume
    setIsSaved(false);
    setSaveMessage('');
    
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
      setIsSaved(false);
      setSaveMessage('');
    }
  };

  const handleBackToSummary = () => {
    setShowResumeTemplate(false);
    setResumeData(null);
    setIsSaved(false);
    setSaveMessage('');
  };

  // If showing resume template, render it
  if (showResumeTemplate && resumeData) {
    return (
      <div>
        {/* Save to History Banner - Shows above the resume template */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 mx-4">
          <div className="flex items-center justify-between">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Resume Template Generated Successfully!
                </h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>Your professional resume template is ready to view and download.</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isSaved && (
                <button
                  onClick={() => saveTemplateToHistory(resumeData, fileName)}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      Save to History
                    </>
                  )}
                </button>
              )}
              
              {isSaved && (
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm font-medium">Saved to History</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Save status message */}
          {saveMessage && (
            <div className="mt-3 text-sm">
              {saveMessage}
            </div>
          )}
        </div>

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