
import config from '@/configs';
import Avatar from "@/public/image.jpeg";
import { useMemo, useState } from 'react';
import { detectSector, generateResumeJSON, generateTailoredResumeJSON, generateTenderResponse, validateTenderResponseFormat } from '../api/geminiApi';
import ErrorMessage from './PdfSummary/ErrorMessage';
import GeneratorControls from './PdfSummary/GeneratorControls';
import JobDescriptionUpload from './PdfSummary/JobDescriptionUpload';
import LoadingState from './PdfSummary/LoadingState';
import ProfilePictureStatus from './PdfSummary/ProfilePictureStatus';
import SaveBanner from './PdfSummary/SaveBanner';
import ResumeTemplate from './ResumeTemplate';
import TenderResponseWrapper from './TenderResponse/TenderResponseWrapper';


const PdfSummary = ({ pdfText, fileName, profilePicture, profilePicturePreview }) => {
    const [resumeData, setResumeData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [useMockData, setUseMockData] = useState(false);
    const [showResumeTemplate, setShowResumeTemplate] = useState(false);
    
    // Add new states for save functionality
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [isSaved, setIsSaved] = useState(false);
  
    // State for uploaded profile picture URL
    const [uploadedProfilePictureUrl, setUploadedProfilePictureUrl] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
  
    // New states for job description/tender
    const [jobDescription, setJobDescription] = useState('');
    const [jobFile, setJobFile] = useState(null);
    const [jobFileName, setJobFileName] = useState('');
    const [isProcessingJob, setIsProcessingJob] = useState(false);
    const [jobError, setJobError] = useState('');
    const [generationMode, setGenerationMode] = useState('standard'); // 'standard' or 'tailored'
    
    // New states for tender response
    const [tenderResponseData, setTenderResponseData] = useState(null);
    const [showTenderResponse, setShowTenderResponse] = useState(false);
    const [isGeneratingTender, setIsGeneratingTender] = useState(false);
    const [jobAnalysisData, setJobAnalysisData] = useState(null);
    const [tenderError, setTenderError] = useState('');
    const [isRegeneratingTender, setIsRegeneratingTender] = useState(false);

    
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
            "Communicated project plans and progress to key stakeholders and project contributors effectively"
          ]
        },
        {
          title: "Asia Pacific CIO Program Director – IBM",
          period: "Jan 2016 – Jun 2020",
          responsibilities: [
            "Led a team of 500+ IT professionals across Asia Pacific region delivering technology solutions",
            "Defined technology strategies and provided comprehensive application services to enterprise clients",
            "Established a centralised shared service as a single IT department improving operational efficiency",
            "Implemented Agile Transformation and New Way of Working for AP region ahead of schedule",
            "Managed and accountable for a portfolio of over AUD$50 million projects and support services",
            "Built organisation capabilities on leading-edge skills and enhanced technical competencies"
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
    if (!config.geminiApiKey) {
      console.warn('NEXT_PUBLIC_GEMINI_API_KEY not found in environment variables');
    }
  
    // Function to upload profile picture to server
    const uploadProfilePicture = async (file) => {
      if (!file) return null;
      
      setIsUploadingImage(true);
      try {
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
            resolve(base64);
          };
          reader.onerror = reject;
        });
        
        reader.readAsDataURL(file);
        const base64Data = await base64Promise;
  
        // Upload to server
        const response = await fetch('/api/uploadImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: base64Data,
            fileName: file.name,
            mimeType: file.type
          })
        });
  
        if (response.ok) {
          const result = await response.json();
          setUploadedProfilePictureUrl(result.url);
          return result.url;
        } else {
          console.error('Failed to upload image:', response.status);
          return null;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        return null;
      } finally {
        setIsUploadingImage(false);
      }
    };
  
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

    // Generate tender response function
    // const handleGenerateTenderResponse = async () => {
    //   setIsGeneratingTender(true);
    //   setTenderError('');
      
    //   try {
    //     // Check if we have the required data
    //     if (!resumeData || !jobDescription || !jobAnalysisData) {
    //       throw new Error('Missing required data for tender response generation. Please ensure you have a tailored resume and job description.');
    //     }

    //     // Generate tender response using the API
    //     const tenderResponse = await generateTenderResponse(
    //       resumeData,
    //       jobDescription,
    //       jobAnalysisData,
    //       config.geminiApiKey
    //     );

    //     setTenderResponseData(tenderResponse);
    //     setShowTenderResponse(true);
    //     setShowResumeTemplate(false);
    //   } catch (err) {
    //     console.error('Tender response generation error:', err);
    //     setTenderError(err.message || 'Failed to generate tender response. Please try again.');
    //   } finally {
    //     setIsGeneratingTender(false);
    //   }
    // };
    
    // Update the existing handleGenerateTenderResponse function
    const handleGenerateTenderResponse = async () => {
        setIsGeneratingTender(true);
        setTenderError('');
        
        try {
        // Check if we have the required data
        if (!resumeData || !jobDescription || !jobAnalysisData) {
            throw new Error('Missing required data for tender response generation. Please ensure you have a tailored resume and job description.');
        }
    
        console.log('🚀 Generating Criteria Statement...');
        
        // Generate the tender response using the generic function
        const rawTenderResponse = await generateTenderResponse(
            resumeData,
            jobDescription,
            jobAnalysisData,
            config.geminiApiKey
        );
    
        console.log('📝 Raw tender response generated:', rawTenderResponse);
    
        // Format the response for the template
        const formattedTenderData = formatForTenderTemplate(rawTenderResponse);
        
        console.log('✅ Formatted tender data:', formattedTenderData);
    
        // Validate the format
        const validation = validateTenderResponseFormat(formattedTenderData);
        if (!validation.isValid) {
            console.warn('⚠️ Validation warnings:', validation.warnings);
            console.error('❌ Validation errors:', validation.missingElements);
        }
    
        // Set the tender response data
        setTenderResponseData(formattedTenderData);
        setShowTenderResponse(true);
        setShowResumeTemplate(false);
        
        console.log('🎉 Criteria Statement generation completed!');
        } catch (err) {
        console.error('Criteria Statement generation error:', err);
        setTenderError(err.message || 'Failed to generate Criteria Statement. Please try again.');
        } finally {
        setIsGeneratingTender(false);
        }
    };


    // Add new regeneration handler
    const handleRegenerateTenderResponse = async () => {
        setIsRegeneratingTender(true);
        setTenderError('');
        
        try {
        // Check if we have the required data
        if (!resumeData || !jobDescription || !jobAnalysisData) {
            throw new Error('Missing required data for tender response regeneration.');
        }
    
        console.log('🔄 Regenerating Criteria Statement...');
        
        // Generate a new tender response
        const rawTenderResponse = await generateTenderResponse(
            resumeData,
            jobDescription,
            jobAnalysisData,
            config.geminiApiKey
        );
    
        console.log('📝 New tender response generated:', rawTenderResponse);
    
        // Format the response for the template
        const formattedTenderData = formatForTenderTemplate(rawTenderResponse);
        
        console.log('✅ New formatted tender data:', formattedTenderData);
    
        // Validate the format
        const validation = validateTenderResponseFormat(formattedTenderData);
        if (!validation.isValid) {
            console.warn('⚠️ Validation warnings:', validation.warnings);
        }
    
        // Update the tender response data
        setTenderResponseData(formattedTenderData);
        
        console.log('🎉 Criteria Statement regeneration completed!');
        } catch (err) {
        console.error('Criteria Statement regeneration error:', err);
        setTenderError(err.message || 'Failed to regenerate Criteria Statement. Please try again.');
        } finally {
        setIsRegeneratingTender(false);
        }
    };
    

    const handleGenerateResume = async () => {
      // Reset save states when generating new resume
      setIsSaved(false);
      setSaveMessage('');
      
      // If using mock data, just set it and show template
      if (useMockData) {
        let mockDataWithPhoto = { ...mockResumeData };
        
        // Upload profile picture if provided
        if (profilePicture) {
          const uploadedUrl = await uploadProfilePicture(profilePicture);
          if (uploadedUrl) {
            mockDataWithPhoto.profile.photo = uploadedUrl;
          }
        } else if (profilePicturePreview) {
          // Use preview URL for mock data if no file to upload
          mockDataWithPhoto.profile.photo = profilePicturePreview;
        }
        
        setResumeData(mockDataWithPhoto);
        setShowResumeTemplate(true);
        return;
      }
      
      // Check if API key is available in environment variables
      if (!config.geminiApiKey) {
        setError('API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.');
        return;
      }
      
      setIsGenerating(true);
      setError('');
      
      try {
        console.log('🚀 Starting resume generation...', { generationMode, hasJobDescription: !!jobDescription });
        
        // Use the environment API key and choose generation method based on mode
        let generatedResumeData;
        let jobAnalysis = null;
       // To these lines
       if (generationMode === 'tailored') {
        console.log('📋 Generating tailored resume...');
        const result = await generateTailoredResumeJSON(pdfText, jobDescription || null);
        console.log('✅ Tailored resume result:', result);
        
        // Extract the actual resume data from the result structure
        generatedResumeData = result.finalResume || result; 
        
        // Store job analysis if available
        jobAnalysis = result.rfqAnalysis || result._jobAnalysis || {
          requirements: [],
          keyPhrases: [],
          skills: [],
          preferredQualifications: []
        };
    } else {
        console.log('📄 Generating standard resume...');
        generatedResumeData = await generateResumeJSON(pdfText, null);
    }
    
    // Make sure generatedResumeData.profile exists before setting photo property
    if (profilePicture && generatedResumeData && generatedResumeData.profile) {
        const uploadedUrl = await uploadProfilePicture(profilePicture);
        if (uploadedUrl) {
            generatedResumeData.profile.photo = uploadedUrl;
        }
    } else if (profilePicturePreview && generatedResumeData) {
        // Create profile object if it doesn't exist
        if (!generatedResumeData.profile) {
            generatedResumeData.profile = {};
        }
        // Use preview URL if available
        generatedResumeData.profile.photo = profilePicturePreview;
    }
        console.log('🎯 Setting resume data and showing template...');
        setResumeData(generatedResumeData);
        setShowResumeTemplate(true);
        
        // Store job analysis for tender response generation if in tailored mode
        if (generationMode === 'tailored' && jobDescription && jobAnalysis) {
          console.log('💾 Storing job analysis data...');
          setJobAnalysisData(jobAnalysis);
        }
        
        console.log('✅ Resume generation completed successfully!');
      } catch (err) {
        console.error('Resume generation error:', err);
        setError(err.message || 'Failed to generate resume. Please check your API configuration and try again.');
      } finally {
        setIsGenerating(false);
      }
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
      setShowTenderResponse(false);
      setResumeData(null);
      setTenderResponseData(null);
      setIsSaved(false);
      setSaveMessage('');
      setTenderError('');
    };

    const handleBackToResume = () => {
      setShowTenderResponse(false);
      setShowResumeTemplate(true);
      setTenderError('');
    };

    const handleBackToTenderResponse = () => {
        if (tenderResponseData) {
          setShowTenderResponse(true);
          setShowResumeTemplate(false);
        }
      };
      
  
    // If showing tender response, render it
    // if (showTenderResponse && tenderResponseData) {
    //   return (
    //     <TenderResponseWrapper
    //       tenderData={tenderResponseData}
    //       candidateName={resumeData?.profile?.name || 'Candidate'}
    //       onBackToResume={handleBackToResume}
    //     />
    //   );
    // }

    
    // Add sector detection in the component
    const detectedSector = useMemo(() => {
        if (jobDescription && jobAnalysisData) {
        return detectSector(jobDescription, jobAnalysisData);
        }
        return 'Government';
    }, [jobDescription, jobAnalysisData]);
  

    const debugTenderData = (data) => {
        console.log('🔍 Debugging tender data structure:');
        console.log('- Candidate Details:', data?.candidateDetails);
        console.log('- Essential Criteria Count:', data?.essentialCriteria?.length || 0);
        console.log('- Desirable Criteria Count:', data?.desirableCriteria?.length || 0);
        console.log('- Additional Information Count:', data?.additionalInformation?.length || 0);
        
        // Check for missing responses
        const missingResponses = [];
        data?.essentialCriteria?.forEach((criteria, index) => {
          if (!criteria.response || criteria.response.trim().length < 50) {
            missingResponses.push(`Essential ${index + 1}: ${criteria.criteria}`);
          }
        });
        
        if (missingResponses.length > 0) {
          console.warn('⚠️ Criteria with insufficient responses:', missingResponses);
        }
        
        return data;
      };
      

      const formatForTenderTemplate = (rawTenderData) => {
        // Ensure the data structure matches exactly what the template expects
        return {
          candidateDetails: {
            name: rawTenderData.candidateDetails?.name || 'Candidate Name',
            proposedRole: rawTenderData.candidateDetails?.proposedRole || 'Application Response',
            clearance: rawTenderData.candidateDetails?.clearance,
            availability: rawTenderData.candidateDetails?.availability
          },
          essentialCriteria: rawTenderData.essentialCriteria?.map(criteria => ({
            criteria: criteria.criteria || criteria.requirement,
            response: criteria.response
          })) || [],
          desirableCriteria: rawTenderData.desirableCriteria?.map(criteria => ({
            criteria: criteria.criteria || criteria.requirement,
            response: criteria.response
          })) || [],
          additionalInformation: rawTenderData.additionalInformation?.map(info => ({
            criteria: info.criteria || info.requirement,
            response: info.response
          })) || []
        };
      };
      // Enhanced error handling for the new format
      const handleTenderGenerationError = (error, isRegeneration = false) => {
        console.error(`Tender ${isRegeneration ? 'regeneration' : 'generation'} failed:`, error);
        
        const errorMessages = {
          'Missing required data': 'Please ensure you have uploaded both a resume and job description, and generated a tailored resume first.',
          'API Error': 'There was an issue with the AI service. Please check your internet connection and try again.',
          'Invalid format': 'The generated response format was invalid. Please try regenerating.',
          'Validation failed': 'The generated response did not meet quality standards. Please try again.'
        };
        
        let userFriendlyMessage = error.message;
        for (const [key, message] of Object.entries(errorMessages)) {
          if (error.message.includes(key)) {
            userFriendlyMessage = message;
            break;
          }
        }
        
        setTenderError(userFriendlyMessage);
        
        // Log detailed error for debugging
        console.error('Detailed error:', {
          originalMessage: error.message,
          userMessage: userFriendlyMessage,
          isRegeneration,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
      };

      if (showTenderResponse && tenderResponseData) {
        return (
          <TenderResponseWrapper
            tenderData={tenderResponseData}
            candidateName={resumeData?.profile?.name || 'Candidate'}
            onBackToResume={handleBackToResume}
            templateType="criteria-statement"
            // New props for regeneration
            onRegenerateTenderResponse={handleRegenerateTenderResponse}
            isRegenerating={isRegeneratingTender}
            detectedSector={detectedSector}
          />
        );
      }
// Update the SaveBanner call to include sector detection
if (showResumeTemplate && resumeData) {
    console.log('🖼️ Rendering resume template with data:', { 
      hasResumeData: !!resumeData, 
      showResumeTemplate,
      generationMode,
      hasJobDescription: !!jobDescription,
      hasTenderResponse: !!tenderResponseData,
      detectedSector
    });
       
  return (
    <div>
      <SaveBanner
        uploadedProfilePictureUrl={uploadedProfilePictureUrl}
        isSaved={isSaved}
        isSaving={isSaving}
        saveMessage={saveMessage}
        isJobTailored={generationMode === 'tailored'}
        showTenderOption={generationMode === 'tailored' && jobDescription && jobDescription.trim().length > 50}
        onSave={() => saveTemplateToHistory(resumeData, fileName)}
        onGenerateTenderResponse={handleGenerateTenderResponse}
        isGeneratingTender={isGeneratingTender}
        // Updated props for tender response navigation
        hasTenderResponse={!!tenderResponseData}
        onBackToTenderResponse={handleBackToTenderResponse}
        detectedSector={detectedSector}
      />
      {tenderError && (
        <div className="mx-4 mb-4">
          <ErrorMessage error={tenderError} />
        </div>
      )}
      <ResumeTemplate resumeData={resumeData} onBackToSummary={handleBackToSummary} />
    </div>
  );
}


    
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Professional Resume Generator</h2>
            
            <ProfilePictureStatus
              profilePicturePreview={profilePicturePreview}
              isUploadingImage={isUploadingImage}
            />
  
            <JobDescriptionUpload
              jobDescription={jobDescription}
              jobFileName={jobFileName}
              jobError={jobError}
              isProcessingJob={isProcessingJob}
              generationMode={generationMode}
              onJobDescriptionChange={setJobDescription}
              onJobFileUpload={(file, text, error) => {
                if (error) {
                  setJobError(error);
                } else {
                  setJobFile(file);
                  setJobFileName(file?.name || '');
                  setJobDescription(text);
                  setJobError('');
                }
              }}
              onRemoveJob={() => {
                setJobFile(null);
                setJobFileName('');
                setJobDescription('');
                setJobError('');
              }}
              onModeChange={setGenerationMode}
            />
            
            <GeneratorControls
              resumeData={resumeData}
              isGenerating={isGenerating}
              useMockData={useMockData}
              fileName={fileName}
              profilePicturePreview={profilePicturePreview}
              isUploadingImage={isUploadingImage}
              generationMode={generationMode}
              jobDescription={jobDescription}
              onGenerate={handleGenerateResume}
              onToggleMockData={toggleMockData}
            />
            
            {isGenerating && (
              <LoadingState
                profilePicturePreview={profilePicturePreview}
                generationMode={generationMode}
                jobDescription={jobDescription}
              />
            )}
            
            {error && (
              <ErrorMessage error={error} />
            )}
          </div>
        </div>
      </div>
    );
  };
  
  
  export default PdfSummary;