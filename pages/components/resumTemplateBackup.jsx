import { useEffect, useRef, useState } from 'react';
import generatePDF, { Margin, Resolution } from 'react-to-pdf';
import PageHeader from './PageHeader';
import ExperienceItem from './ResumeTemplate/ExperienceItem';

const ResumeTemplate = ({ resumeData, onBackToSummary, viewMode = 'generate' }) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [showPdfSettings, setShowPdfSettings] = useState(false);
  const [resumeDimensions, setResumeDimensions] = useState({ width: 0, height: 0 });
  const [experienceLayout, setExperienceLayout] = useState('summary');
  const [pageHeight, setPageHeight] = useState(null); // Store first page height
  const resumeRef = useRef(null);
  
  // Determine if this is history view mode
  const isHistoryView = viewMode === 'history';
  
  // PDF Settings State
  const [pdfSettings, setPdfSettings] = useState({
    method: 'save',
    resolution: Resolution.HIGH,
    format: 'A4',
    orientation: 'landscape',
    margin: Margin.NONE,
    mimeType: 'image/jpeg',
    qualityRatio: 0.92,
    compress: true,
    useCORS: true,
    customWidth: 0,
    customHeight: 0
  });

  // Experience handling logic
  const fullExperience = resumeData.fullExperience || [];
  const mainExperience = resumeData.experience || [];
  
  // Calculate experience item heights and split for pagination
  const [experienceHeights, setExperienceHeights] = useState({});
  
  // Measure experience item heights
  useEffect(() => {
    const measureExperienceHeights = () => {
      const heights = {};
      fullExperience.forEach((exp, index) => {
        const element = document.getElementById(`exp-measure-${index}`);
        if (element) {
          heights[index] = element.offsetHeight;
        }
      });
      setExperienceHeights(heights);
    };

    if (experienceLayout === 'paginated' && fullExperience.length > 0) {
      // Wait for render then measure
      setTimeout(measureExperienceHeights, 100);
    }
  }, [fullExperience, experienceLayout]);

  // Split experience for different layouts with height-aware pagination
const getExperiencePages = () => {
    if (experienceLayout === 'summary') {
      return [];
    }
    
    if (experienceLayout === 'paginated') {
      const pages = [];
      let currentPage = [];
      
      // Calculate available height for content
      // Subtract header height (80px) and padding (48px top/bottom = 96px)
      const headerHeight = 80;
      const paddingHeight = 96;
      const availableHeight = pageHeight ? pageHeight - headerHeight - paddingHeight : 800;
      
      // For 2-column layout, we need to track both columns separately
      let leftColumnHeight = 0;
      let rightColumnHeight = 0;
      
      fullExperience.forEach((exp, index) => {
        const itemHeight = experienceHeights[index] || 150; // Default height if not measured
        const itemWithGap = itemHeight + 16; // 16px gap between items
        
        // Determine which column would receive this item (alternating or based on height)
        const wouldGoToLeft = leftColumnHeight <= rightColumnHeight;
        
        // Check if item fits in the designated column
        const fitsInDesignatedColumn = wouldGoToLeft 
          ? (leftColumnHeight + itemWithGap <= availableHeight)
          : (rightColumnHeight + itemWithGap <= availableHeight);
        
        // If it doesn't fit in either column, start a new page
        if (!fitsInDesignatedColumn && currentPage.length > 0) {
          pages.push(currentPage);
          currentPage = [exp];
          leftColumnHeight = itemWithGap;
          rightColumnHeight = 0;
        } else {
          // Add to current page and update column heights
          currentPage.push(exp);
          if (wouldGoToLeft) {
            leftColumnHeight += itemWithGap;
          } else {
            rightColumnHeight += itemWithGap;
          }
        }
      });
      
      // Add remaining items
      if (currentPage.length > 0) {
        pages.push(currentPage);
      }
      
      return pages;
    }
    
    return [];
  };

  const experiencePages = getExperiencePages();

const measurePageHeight = () => {
    const firstPageElement = document.getElementById('first-page');
    if (firstPageElement) {
      const rect = firstPageElement.getBoundingClientRect();
      let heightPx = rect.height;
      
      // Add a small buffer (5-10px) to prevent content overflow due to sub-pixel rendering
      const buffer = 10;
      heightPx = Math.ceil(heightPx) + buffer;
      
      const heightMm = Math.round((heightPx * 25.4) / 96);
      
      console.log('First page height measured:', heightPx, 'px =', heightMm, 'mm (includes buffer)');
      setPageHeight(heightPx);
      
      // Update resume dimensions
      setResumeDimensions(prev => ({ ...prev, height: heightMm }));
      
      // Update PDF settings
      setPdfSettings(prev => ({
        ...prev,
        customHeight: heightMm
      }));
      
      return heightPx;
    }
    return null;
  };

  // Measure resume dimensions including consistent height
  // Measure resume dimensions including consistent height
useEffect(() => {
    const measureResume = () => {
      const resumeElement = document.getElementById('resume-content');
      if (resumeElement) {
        const actualContent = resumeElement.querySelector('div[style*="width: 100%"]');
        
        if (actualContent) {
          const contentRect = actualContent.getBoundingClientRect();
          const widthMm = Math.round((contentRect.width * 25.4) / 96);
          
          setResumeDimensions(prev => ({ ...prev, width: widthMm }));
          
          setPdfSettings(prev => ({
            ...prev,
            customWidth: widthMm
          }));
        }
      }
      
      // Measure first page height with longer delay for complete rendering
      setTimeout(() => {
        measurePageHeight();
      }, 500); // Increased from 200ms to 500ms
    };
  
    if (!isHistoryView) {
      const timer = setTimeout(measureResume, 300); // Increased from 100ms
      window.addEventListener('resize', measureResume);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', measureResume);
      };
    }
  }, [resumeData, isHistoryView, experienceLayout]);
//   useEffect(() => {
//     const measureResume = () => {
//       const resumeElement = document.getElementById('resume-content');
//       if (resumeElement) {
//         const actualContent = resumeElement.querySelector('div[style*="width: 100%"]');
        
//         if (actualContent) {
//           const contentRect = actualContent.getBoundingClientRect();
//           const widthMm = Math.round((contentRect.width * 25.4) / 96);
          
//           setResumeDimensions(prev => ({ ...prev, width: widthMm }));
          
//           setPdfSettings(prev => ({
//             ...prev,
//             customWidth: widthMm
//           }));
//         }
//       }
      
//       // Measure first page height
//       setTimeout(() => {
//         measurePageHeight();
//       }, 200);
//     };

//     if (!isHistoryView) {
//       const timer = setTimeout(measureResume, 100);
//       window.addEventListener('resize', measureResume);
      
//       return () => {
//         clearTimeout(timer);
//         window.removeEventListener('resize', measureResume);
//       };
//     }
//   }, [resumeData, isHistoryView, experienceLayout]);

  // PDF generation
  const getTargetElement = () => document.getElementById('resume-content');

  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    
    // Ensure we have measured the page height
    const measuredHeight = measurePageHeight();
    
    if (measuredHeight) {
      console.log('Using consistent page height for PDF generation:', measuredHeight, 'px');
    }
    
    try {
      const candidateName = resumeData.profile.name;
      const sanitizedName = candidateName
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
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

  const updatePdfSetting = (key, value) => {
    setPdfSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const remeasureResume = () => {
    const resumeElement = document.getElementById('resume-content');
    if (resumeElement) {
      const actualContent = resumeElement.querySelector('div[style*="width: 100%"]');
      
      if (actualContent) {
        const contentRect = actualContent.getBoundingClientRect();
        const widthMm = (contentRect.width * 25.4) / 96;
        
        setResumeDimensions(prev => ({ ...prev, width: widthMm }));
        
        setPdfSettings(prev => ({
          ...prev,
          customWidth: widthMm
        }));
      }
    }
    
    // Re-measure page height
    measurePageHeight();
  };

  const FirstPage = () => (
    <div 
      id="first-page"
      style={{ 
        width: '100%', 
        backgroundColor: 'white', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        minHeight: 'fit-content'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr' }}>
        <div style={{ backgroundColor: '#1e293b', color: 'white' }}>
          {/* Profile Photo */}
          <div>
            {resumeData.profile.photo && resumeData.profile.photo !== "/api/placeholder/400/600" ? (
              <img
                src={resumeData.profile.photo}
                alt={`${resumeData.profile.name} profile`}
                style={{ 
                  width: '100%', 
                  height: '15rem', 
                  objectFit: 'cover',
                  backgroundColor: '#374151'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              style={{ 
                width: '100%', 
                height: '15rem', 
                backgroundColor: '#374151',
                display: resumeData.profile.photo && resumeData.profile.photo !== "/api/placeholder/400/600" ? 'none' : 'flex',
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
                {resumeData.profile.location}
                {resumeData.profile.clearance && resumeData.profile.clearance !== 'NONE' && ` | ${resumeData.profile.clearance}`}
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

        {/* Right Section */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
            {/* Middle Column - Profile */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb' }}>
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
                  marginBottom: '0.5rem', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: '0 0 0.5rem 0'
                }}>
                  RECENT EXPERIENCE
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
              
              <div style={{ display: 'flex', flexDirection: 'column'}}>
                {mainExperience.map((exp, index) => (
                  <ExperienceItem key={index} exp={exp} />
                ))}
              </div>

              {/* Contact */}
              {(resumeData.contact?.email || resumeData.contact?.phone || resumeData.contact?.linkedin) && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: '#1e293b', 
                    letterSpacing: '0.01em',
                    margin: '0 0 0.5rem 0'
                  }}>
                    CONTACT
                  </h2>
                  <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {resumeData.contact?.email && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#1e293b', minWidth: '20px' }}>Email:</span>
                        <span style={{ color: '#374151', marginLeft: '0.5rem' }}>{resumeData.contact.email}</span>
                      </div>
                    )}
                    {resumeData.contact?.phone && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#1e293b', minWidth: '20px' }}>Phone:</span>
                        <span style={{ color: '#374151', marginLeft: '0.5rem' }}>{resumeData.contact.phone}</span>
                      </div>
                    )}
                    {resumeData.contact?.linkedin && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#1e293b', minWidth: '20px' }}>Linkedin:</span>
                        <span style={{ color: '#374151', marginLeft: '0.5rem', wordBreak: 'break-all' }}>{resumeData.contact.linkedin}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Referees */}
              <div>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: 0
                }}>
                  REFEREES
                </h2>
                <div>
                  {resumeData.referees && resumeData.referees.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                      {resumeData.referees.map((referee, index) => (
                        <div key={index} style={{ fontSize: '14px', minWidth: '200px' }}>
                          <p style={{ fontWeight: '600', color: '#1e293b', margin: '0 0 0.25rem 0' }}>
                            T: {referee.title}
                          </p>
                          <p style={{ color: '#374151', margin: '0 0 0.25rem 0' }}>
                            N: {referee.name}
                          </p>
                          <p style={{ color: '#374151', margin: '0 0 0.25rem 0' }}>
                            E: {referee.email}
                          </p>
                          <p style={{ color: '#374151', margin: 0 }}>
                            M: {referee.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', color: '#374151', fontStyle: 'italic', marginTop: '0.5rem' }}>
                      Available upon request
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Key Career Achievements */}
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

  // Additional Experience Page with consistent height
  const ExperiencePage = ({ experiences, pageNumber }) => {
    // Calculate how to split experiences between columns
    const splitExperiences = () => {
      let leftColumn = [];
      let rightColumn = [];
      let leftHeight = 0;
      let rightHeight = 0;
      
      experiences.forEach((exp, index) => {
        const originalIndex = fullExperience.indexOf(exp);
        const itemHeight = experienceHeights[originalIndex] || 150;
        
        // Add to the column with less height to balance
        if (leftHeight <= rightHeight) {
          leftColumn.push(exp);
          leftHeight += itemHeight + 16; // 16px margin
        } else {
          rightColumn.push(exp);
          rightHeight += itemHeight + 16;
        }
      });
      
      return { leftColumn, rightColumn };
    };
    
    const { leftColumn, rightColumn } = splitExperiences();
    
    return (
      <div style={{ 
        width: '100%', 
        backgroundColor: 'white', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        height: pageHeight ? `${pageHeight}px` : 'auto', // Apply consistent height
        overflow: 'hidden' // Prevent content overflow
      }}>
        <PageHeader resumeData={resumeData} />
        
        <div style={{ padding: '1.5rem', height: 'calc(100% - 80px)' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '2rem',
            maxWidth: '100%',
            height: '100%'
          }}>
            {/* Left Column */}
            <div style={{ overflowY: 'hidden' }}>
              {leftColumn.map((exp, index) => (
                <ExperienceItem key={index} exp={exp} />
              ))}
            </div>
            
            {/* Right Column */}
            <div style={{ overflowY: 'hidden' }}>
              {rightColumn.map((exp, index) => (
                <ExperienceItem key={index} exp={exp} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dynamic container styling
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
        paddingTop: '2rem',
        maxWidth: '1512.8000488px', 
        margin: '0 auto' 
      };

  return (
    <div style={containerStyle}>
      {/* Control Buttons */}
      {!isHistoryView && (
        <>
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
              {isPdfLoading ? 'Generating PDF...' : 'Download PDF '}
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

          {/* Experience Layout Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', gap: '10px' }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '10px 15px', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Experience Layout:
              </span>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="experienceLayout" 
                  value="summary"
                  checked={experienceLayout === 'summary'}
                  onChange={(e) => setExperienceLayout(e.target.value)}
                />
                <span style={{ fontSize: '14px' }}>Summary Only</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="experienceLayout" 
                  value="paginated"
                  checked={experienceLayout === 'paginated'}
                  onChange={(e) => setExperienceLayout(e.target.value)}
                />
                <span style={{ fontSize: '14px' }}>Full Experience (Paginated)</span>
              </label>
            </div>
            
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              color: '#0369a1',
              padding: '10px 15px', 
              borderRadius: '8px',
              fontSize: '14px',
              border: '1px solid #bae6fd'
            }}>
              {experienceLayout === 'summary' 
                ? `${mainExperience.length} recent positions • 1 page`
                : `${fullExperience.length} total positions • ${experiencePages.length + 1} page${experiencePages.length !== 0 ? 's' : ''} • Height-aware pagination`
              }
            </div>
          </div>

          {/* Page Height Display */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '1rem',
            gap: '20px'
          }}>
            {resumeDimensions.width > 0 && (
              <div style={{ 
                fontSize: '14px',
                color: '#6B7280',
                backgroundColor: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                📐 Resume Dimensions: {resumeDimensions.width}mm × {resumeDimensions.height}mm
              </div>
            )}
            
            {pageHeight && (
              <div style={{ 
                fontSize: '14px',
                color: '#059669',
                backgroundColor: '#f0fdf4',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #bbf7d0'
              }}>
                📏 Consistent Page Height: {Math.round(pageHeight)}px ({Math.round((pageHeight * 25.4) / 96)}mm)
              </div>
            )}
          </div>
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
        
        {/* Experience Pages with Consistent Heights */}
        {experienceLayout === 'paginated' && experiencePages.map((pageData, pageIndex) => (
          <ExperiencePage key={pageIndex} experiences={pageData} pageNumber={pageIndex + 2} />
        ))}
      </div>

      {/* Hidden measurement area for experience items */}
      {experienceLayout === 'paginated' && (
        <div style={{ 
          position: 'absolute', 
          visibility: 'hidden', 
          width: '650px', // Match the experience column width
          left: '-9999px'
        }}>
          {fullExperience.map((exp, index) => (
            <div key={index} id={`exp-measure-${index}`} style={{ marginBottom: '1rem' }}>
              <ExperienceItem exp={exp} />
            </div>
          ))}
        </div>
      )}

      {/* PDF Settings Modal */}
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
              PDF Generation Settings (Height Consistency)
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

              {/* Page Height Consistency Info */}
              <div style={{ 
                backgroundColor: '#f0fdf4', 
                padding: '16px', 
                borderRadius: '6px',
                border: '1px solid #16a34a'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#15803d' }}>
                  📏 Page Height Consistency
                </h4>
                <div style={{ fontSize: '12px', color: '#15803d', marginBottom: '8px' }}>
                  {pageHeight 
                    ? `First page height: ${Math.round(pageHeight)}px (${Math.round((pageHeight * 25.4) / 96)}mm)`
                    : 'Measuring first page height...'
                  }
                </div>
                <ul style={{ fontSize: '12px', color: '#15803d', margin: 0, paddingLeft: '16px' }}>
                  <li>All pages will match the first page height exactly</li>
                  <li>Prevents content from being cut off between pages</li>
                  <li>Ensures uniform page breaks and consistent layout</li>
                  <li>Content overflow is controlled to prevent line breaks</li>
                </ul>
              </div>

              {/* Custom Dimensions */}
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
                  
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '8px', 
                    backgroundColor: '#dcfce7', 
                    border: '1px solid #16a34a',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    <strong>✅ Height Consistency Applied:</strong> All pages will use the first page height measurement for uniform layout.
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
                      Re-measure Heights
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
