import { useEffect, useRef, useState } from 'react';
import generatePDF, { Margin, Resolution } from 'react-to-pdf';

const ResumeTemplate = ({ resumeData, onBackToSummary, viewMode = 'generate' }) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [showPdfSettings, setShowPdfSettings] = useState(false);
  const [resumeDimensions, setResumeDimensions] = useState({ width: 0, height: 0 });
  const resumeRef = useRef(null);
  
  // Determine if this is history view mode
  const isHistoryView = viewMode === 'history';
  
  // PDF Settings State
  const [pdfSettings, setPdfSettings] = useState({
    method: 'save', // 'save' or 'open'
    resolution: Resolution.HIGH,
    format: 'A4', // 'A4', 'letter', 'legal', 'custom', etc.
    orientation: 'landscape', // 'portrait' or 'landscape'
    margin: Margin.NONE,
    mimeType: 'image/jpeg', // 'image/jpeg' or 'image/png'
    qualityRatio: 0.92,
    compress: true,
    useCORS: true,
    customWidth: 0, // Custom dimensions in mm
    customHeight: 0
  });

  // Calculate second page experience distribution
  const secondPageExperience = resumeData.fullExperience || [];
  const totalExperiences = secondPageExperience.length;
  const leftColumnCount = Math.ceil(totalExperiences / 2);
  const leftColumnExperience = secondPageExperience.slice(0, leftColumnCount);
  const rightColumnExperience = secondPageExperience.slice(leftColumnCount);

  // Measure resume dimensions on component mount and when content changes
  useEffect(() => {
    const measureResume = () => {
      const resumeElement = document.getElementById('resume-content');
      if (resumeElement) {
        const rect = resumeElement.getBoundingClientRect();
        const actualContent = resumeElement.querySelector('div[style*="width: 100%"]');
        
        if (actualContent) {
          const contentRect = actualContent.getBoundingClientRect();
          // Convert pixels to millimeters (96 DPI standard: 1 inch = 25.4mm, 96px = 1 inch)
          const widthMm = Math.round((contentRect.width * 25.4) / 96);
          // Reduce height by 5-10mm to account for PDF rendering differences and ensure single page
          const heightMm = Math.round(((contentRect.height * 25.4) / 96) - 8);
          
          setResumeDimensions({ width: widthMm, height: heightMm });
          
          // Update custom dimensions in settings
          setPdfSettings(prev => ({
            ...prev,
            customWidth: widthMm,
            customHeight: heightMm
          }));
        }
      }
    };

    // Only measure if not in history view mode
    if (!isHistoryView) {
      const timer = setTimeout(measureResume, 100);
      window.addEventListener('resize', measureResume);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', measureResume);
      };
    }
  }, [resumeData, isHistoryView]);

  // Get target element for PDF generation
  const getTargetElement = () => document.getElementById('resume-content');

  // Handle PDF generation with custom settings
  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    try {
    // Create filename from candidate's name
      const candidateName = resumeData.profile.name;
      const sanitizedName = candidateName
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .trim();
      const filename = `${sanitizedName}_Resume.pdf`;

      const options = {
        method: pdfSettings.method,
        resolution: pdfSettings.resolution,
        page: {
          margin: pdfSettings.margin,
          format: pdfSettings.format === 'custom' ? [pdfSettings.customWidth, pdfSettings.customHeight] : pdfSettings.format,
          orientation: pdfSettings.orientation,
        },
        canvas: {
          mimeType: pdfSettings.mimeType,
          qualityRatio: pdfSettings.qualityRatio
        },
        overrides: {
          pdf: {
            compress: pdfSettings.compress
          },
          canvas: {
            useCORS: pdfSettings.useCORS
          }
        },
        filename: filename,
      };

      await generatePDF(getTargetElement, options);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Update PDF settings
  const updatePdfSetting = (key, value) => {
    setPdfSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Force remeasure function
  const remeasureResume = () => {
    const resumeElement = document.getElementById('resume-content');
    if (resumeElement) {
      const actualContent = resumeElement.querySelector('div[style*="width: 100%"]');
      
      if (actualContent) {
        const contentRect = actualContent.getBoundingClientRect();
        const widthMm = (contentRect.width * 25.4) / 96;
        const heightMm = ((contentRect.height * 25.4) / 96) - 8;
        
        setResumeDimensions({ width: widthMm, height: heightMm });
        
        setPdfSettings(prev => ({
          ...prev,
          customWidth: widthMm,
          customHeight: heightMm
        }));
      }
    }
  };

  const FirstPage = () => (
    <div style={{ 
      width: '100%', 
      backgroundColor: 'white', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr' }}>
        <div style={{ backgroundColor: '#1e293b', color: 'white' }}>
          {/* Profile Photo */}
          <div>
            <div
              style={{ 
                width: '100%', 
                height: '15rem', 
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                color: '#9CA3AF'
              }}
            >
              Photo Placeholder
            </div>
          </div>
          <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            {/* Name and Title */}
            <div style={{ marginBottom: '0.75rem' }}>
              <h1 style={{ 
                fontSize: '2.25rem', 
                fontWeight: 'bold', 
                margin: 0
              }}>
                {resumeData.profile.name.split(' ')[0]}
              </h1>
              <h1 style={{ 
                fontSize: '2.25rem', 
                fontWeight: 'bold', 
                marginBottom: '0.75rem',
                margin: '0 0 0.75rem 0'
              }}>
                {resumeData.profile.name.split(' ')[1]}
              </h1>
              <div style={{ 
                color: '#fbbf24', 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                marginBottom: '0.25rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                {resumeData.profile.title}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#d1d5db', 
                letterSpacing: '0.1em', 
                textTransform: 'uppercase' 
              }}>
                {resumeData.profile.location} | {resumeData.profile.clearance}
              </div>
            </div>

            {/* Qualifications */}
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: '#fbbf24', 
                letterSpacing: '0.05em',
             
              }}>
                QUALIFICATIONS
              </h2>
              <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
                {resumeData.qualifications.map((qual, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                    <span style={{ lineHeight: '1.625' }}>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Affiliations */}
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: '#fbbf24', 
                letterSpacing: '0.05em',
             
              }}>
                AFFILIATIONS
              </h2>
              <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
                {resumeData.affiliations.map((affiliation, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                    <span style={{ lineHeight: '1.625' }}>{affiliation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div>
              <h2 style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: '#fbbf24', 
                letterSpacing: '0.05em',
              
              }}>
                SKILLS
              </h2>
              <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
                {resumeData.skills.map((skill, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                    <span style={{ lineHeight: '1.625' }}>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section - Two Columns */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Top content area - split into two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
            {/* Middle Column - Profile */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb' }}>
              {/* Profile Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.75rem', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: '0 0 0.75rem 0'
                }}>
                  PROFILE
                </h2>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#374151', 
                  lineHeight: '1.625', 
                  textAlign: 'justify', 
                  marginBottom: '0.75rem',
                  margin: '0 0 0.75rem 0'
                }}>
                  {resumeData.profile.description}
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#374151', 
                  lineHeight: '1.625', 
                  textAlign: 'justify',
                  margin: 0
                }}>
                  {resumeData.profile.description2}
                </p>
              </div>
            </div>

            {/* Right Column - References and Experience */}
            <div style={{ width: '650px', padding: '1.5rem', backgroundColor: '#f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: 0
                }}>
                  REFEREES
                </h2>
                <div style={{ 
                  backgroundColor: '#1e293b', 
                  color: 'white', 
                  paddingLeft: '0.75rem', 
                  paddingRight: '0.75rem', 
                  paddingTop: '0.5rem', 
                  paddingBottom: '0.5rem', 
                  fontSize: '0.875rem', 
                  fontWeight: 'bold' 
                }}>
                  PappsPM
                </div>
              </div>

              {/* Referees List Content */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {resumeData.referees.map((referee, index) => (
                    <div key={index} style={{ fontSize: '14px' }}>
                      <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
                        T: {referee.title}
                      </p>
                      <p style={{ color: '#374151', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
                        N: {referee.name}
                      </p>
                      <p style={{ color: '#374151', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
                        E: {referee.email}
                      </p>
                      <p style={{ color: '#374151', margin: 0 }}>
                        M: {referee.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Experience - First Page */}
              <div>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: '0 0 0.5rem 0'
                }}>
                  RELEVANT EXPERIENCE
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h3 style={{ 
                            fontWeight: 'bold', 
                            color: '#1e293b', 
                            fontSize: '0.875rem', 
                            lineHeight: '1.25', 
                            marginBottom: '0.25rem',
                            margin: '0 0 0.25rem 0'
                          }}>
                            {exp.title}
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                            {exp.period}
                          </p>
                        </div>
                      </div>
                      <div style={{ marginLeft: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {exp.responsibilities.map((resp, respIndex) => (
                          <div key={respIndex} style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <span style={{ color: '#1e293b', marginRight: '0.5rem', marginTop: '0.125rem', fontSize: '0.875rem' }}>•</span>
                            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.625', margin: 0 }}>
                              {resp}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Career Achievements - Full width of right section */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderTop: '1px solid #d1d5db', 
            color: 'black' 
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem', 
              letterSpacing: '0.05em',
            }}>
              KEY CAREER ACHIEVEMENTS
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', listStyle: 'none', padding: 0, margin: 0 }}>
              {resumeData.keyAchievements.map((achievement, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: '0.75rem', marginTop: '0.125rem' }}>•</span>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.625', margin: 0 }}>
                    {achievement}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const SecondPage = () => (
    <div style={{ 
      width: '100%', 
      backgroundColor: 'white', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    //   pageBreakBefore: 'always'
    }}>
      {/* Header with PappsPM branding - matching the first page style */}
      <div style={{ 
        backgroundColor: '#1e293b', 
        color: 'white', 
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Left side - PappsPM logo */}
        <div style={{ 
          backgroundColor: 'transparent', 
          color: 'white', 
          border: '2px solid white',
          paddingLeft: '0.75rem', 
          paddingRight: '0.75rem', 
          paddingTop: '0.5rem', 
          paddingBottom: '0.5rem', 
          fontSize: '0.875rem', 
          fontWeight: 'bold'
        }}>
          PappsPM
        </div>
        
        {/* Center - Name and Title */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold',
            margin: 0,
            color: 'white',
            letterSpacing: '0.1em'
          }}>
            {resumeData.profile.name}
          </h1>
          <div style={{ 
            color: '#fbbf24', 
            fontSize: '0.875rem', 
            fontWeight: 'normal', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            marginTop: '0.25rem'
          }}>
            {resumeData.profile.title}
          </div>
        </div>
        
        {/* Right side - empty for balance */}
        <div style={{ width: '120px' }}></div>
      </div>

      {/* Content in two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '1.5rem', padding: '1.5rem', minHeight: '80vh' }}>
        {/* Left Column */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {leftColumnExperience.map((exp, index) => (
              <div key={index}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ 
                      fontWeight: 'bold', 
                      color: '#1e293b', 
                      fontSize: '0.875rem', 
                      lineHeight: '1.25', 
                      marginBottom: '0.25rem',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {exp.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                      {exp.period}
                    </p>
                  </div>
                </div>
                <div style={{ marginLeft: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  
                  {exp.responsibilities.map((resp, respIndex) => (
                    <div key={respIndex} style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#1e293b', marginRight: '0.5rem', marginTop: '0.125rem', fontSize: '0.875rem' }}>•</span>
                      <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.625', margin: 0 }}>
                        {resp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical separator line */}
        <div style={{ 
          backgroundColor: '#d1d5db', 
          width: '1px',
          height: '100%',
          minHeight: '500px'
        }}></div>

        {/* Right Column */}
        <div>
          {rightColumnExperience.length > 0 && (
            <>
        
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {rightColumnExperience.map((exp, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ 
                          fontWeight: 'bold', 
                          color: '#1e293b', 
                          fontSize: '0.875rem', 
                          lineHeight: '1.25', 
                          marginBottom: '0.25rem',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {exp.title}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                          {exp.period}
                        </p>
                      </div>
                    </div>
                    <div style={{ marginLeft: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                     
                      {exp.responsibilities.map((resp, respIndex) => (
                        <div key={respIndex} style={{ display: 'flex', alignItems: 'flex-start' }}>
                          <span style={{ color: '#1e293b', marginRight: '0.5rem', marginTop: '0.125rem', fontSize: '0.875rem' }}>•</span>
                          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.625', margin: 0 }}>
                            {resp}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Dynamic container styling based on view mode
  const containerStyle = isHistoryView 
    ? { 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6', 
        paddingTop: '2rem', 
        maxWidth: '1512.8000488px', 
        margin: '0 auto' 
      }
    : { 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6', 
        paddingTop: '2rem' ,
        maxWidth: '1512.8000488px', 
        margin: '0 auto' 
      };

  return (
    <div style={containerStyle}>
      {/* Control Buttons - Only show in generate mode */}
      {!isHistoryView && (
        <>
          {/* Button to download as PDF and Settings */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleDownloadPDF}
              disabled={isPdfLoading}
              style={{
                backgroundColor: isPdfLoading ? '#9CA3AF' : '#4F46E5',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: isPdfLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isPdfLoading ? 'Generating PDF...' : 'Download PDF'}
            </button>
            
            <button 
              onClick={() => setShowPdfSettings(true)}
              style={{
                backgroundColor: '#6B7280',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              PDF Settings
            </button>
            
            <button 
              onClick={remeasureResume}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Measure Resume
            </button>

            <button 
              onClick={onBackToSummary}
              style={{
                backgroundColor: '#6B7280',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Back to Summary
            </button>
          </div>

          {/* Dimensions Display */}
          {resumeDimensions.width > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '1rem',
              fontSize: '14px',
              color: '#6B7280'
            }}>
              Resume Dimensions: {resumeDimensions.width}mm × {resumeDimensions.height}mm
            </div>
          )}
        </>
      )}

      {/* Back to History Button - Only show in history mode */}
      {isHistoryView && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button 
            onClick={onBackToSummary}
            style={{
              backgroundColor: '#6B7280',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <svg 
              style={{ width: '16px', height: '16px', marginRight: '8px' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to History
          </button>
        </div>
      )}

      {/* Resume Content */}
      <div id="resume-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FirstPage />
        <SecondPage />
      </div>

      {/* PDF Settings Modal - Only show in generate mode */}
      {!isHistoryView && showPdfSettings && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} 
          onClick={() => setShowPdfSettings(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '24px' }}>
              PDF Generation Settings
            </h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Download Method */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Download Method:
                </label>
                <select 
                  value={pdfSettings.method} 
                  onChange={(e) => updatePdfSetting('method', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="save">Save to Downloads</option>
                  <option value="open">Open in New Tab</option>
                </select>
              </div>

              {/* Resolution */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Resolution:
                </label>
                <select 
                  value={pdfSettings.resolution} 
                  onChange={(e) => updatePdfSetting('resolution', parseInt(e.target.value))}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value={Resolution.LOW}>Low (Fast)</option>
                  <option value={Resolution.NORMAL}>Normal</option>
                  <option value={Resolution.MEDIUM}>Medium</option>
                  <option value={Resolution.HIGH}>High (Recommended)</option>
                </select>
              </div>

              {/* Page Format */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Page Format:
                </label>
                <select 
                  value={pdfSettings.format} 
                  onChange={(e) => updatePdfSetting('format', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="A4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                  <option value="tabloid">Tabloid</option>
                  <option value="custom">
                    Custom ({resumeDimensions.width}mm × {resumeDimensions.height}mm)
                  </option>
                </select>
              </div>

              {/* Custom Dimensions - Show only when custom is selected */}
              {pdfSettings.format === 'custom' && (
                <div style={{ 
                  backgroundColor: '#f9fafb', 
                  padding: '16px', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                    Custom Dimensions
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                        Width (mm):
                      </label>
                      <input 
                        type="number" 
                        value={pdfSettings.customWidth}
                        onChange={(e) => updatePdfSetting('customWidth', parseInt(e.target.value) || 0)}
                        style={{ 
                          width: '100%', 
                          padding: '6px', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                        Height (mm):
                      </label>
                      <input 
                        type="number" 
                        value={pdfSettings.customHeight}
                        onChange={(e) => updatePdfSetting('customHeight', parseInt(e.target.value) || 0)}
                        style={{ 
                          width: '100%', 
                          padding: '6px', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Height Adjustment Helper */}
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '8px', 
                    backgroundColor: '#fef3c7', 
                    border: '1px solid #f59e0b',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    <strong>💡 Tip:</strong> If content spills to a second page, try reducing the height by 5-15mm to ensure everything fits on one page.
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={remeasureResume}
                      style={{
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Auto-detect Size
                    </button>
                    <button
                      onClick={() => {
                        updatePdfSetting('customHeight', pdfSettings.customHeight - 10);
                      }}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      -10mm Height
                    </button>
                    <button
                      onClick={() => {
                        updatePdfSetting('customHeight', pdfSettings.customHeight + 5);
                      }}
                      style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      +5mm Height
                    </button>
                  </div>
                </div>
              )}

              {/* Orientation */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Orientation:
                </label>
                <select 
                  value={pdfSettings.orientation} 
                  onChange={(e) => updatePdfSetting('orientation', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              {/* Margin */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Margin:
                </label>
                <select 
                  value={pdfSettings.margin} 
                  onChange={(e) => updatePdfSetting('margin', parseInt(e.target.value))}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value={Margin.NONE}>None</option>
                  <option value={Margin.SMALL}>Small</option>
                  <option value={Margin.MEDIUM}>Medium</option>
                  <option value={Margin.LARGE}>Large</option>
                </select>
              </div>

              {/* Image Type */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Image Type:
                </label>
                <select 
                  value={pdfSettings.mimeType} 
                  onChange={(e) => updatePdfSetting('mimeType', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="image/jpeg">JPEG (Smaller file)</option>
                  <option value="image/png">PNG (Better quality)</option>
                </select>
              </div>

              {/* Quality Ratio */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Quality: {Math.round(pdfSettings.qualityRatio * 100)}%
                </label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.1" 
                  value={pdfSettings.qualityRatio}
                  onChange={(e) => updatePdfSetting('qualityRatio', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Compression */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={pdfSettings.compress}
                  onChange={(e) => updatePdfSetting('compress', e.target.checked)}
                />
                <label style={{ fontSize: '14px' }}>
                  Enable PDF compression
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setShowPdfSettings(false)}
                style={{
                  backgroundColor: '#6B7280',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPdfSettings(false)}
                style={{
                  backgroundColor: '#4F46E5',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeTemplate;