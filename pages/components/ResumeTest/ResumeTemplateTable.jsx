import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import generatePDF from 'react-to-pdf';

// Import custom hooks (same as before)
import { useExperiencePagination } from '@/pages/hooks/useExperiencePagination';
import { usePdfSettings } from '@/pages/hooks/usePdfSettings';
import { useResumeMeasurement } from '@/pages/hooks/useResumeMeasurement';

// Import components (same as before)
import BackButton from '../ResumeTemplate/BackButton';
import DimensionsDisplay from '../ResumeTemplate/DimensionsDisplay';
import ExperienceLayoutControls from '../ResumeTemplate/ExperienceLayoutControls';
import HiddenMeasurementArea from '../ResumeTemplate/HiddenMeasurementArea';
import PdfSettingsModal from '../ResumeTemplate/PdfSettingsModal';

// Import the table-based components
import ExperiencePageTable from './ExperiencePageTable';
import FirstPageTable from './FirstPageTable';
import ResumeWordCompatible from './ResumeWordCompatible';


const ResumeTemplateTable = ({ resumeData, onBackToSummary, viewMode = 'generate' }) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [showPdfSettings, setShowPdfSettings] = useState(false);
  const [experienceLayout, setExperienceLayout] = useState('summary');
  
  // Add ref for Word-compatible content
  const wordResumeRef = useRef(null);
  
  // Use ref to prevent infinite updates
  const updateRef = useRef({ lastWidth: 0, lastHeight: 0 });
  
  // Determine if this is history view mode
  const isHistoryView = viewMode === 'history';
  
  // Experience handling logic
  const fullExperience = resumeData.fullExperience || [];
  const mainExperience = resumeData.experience || [];
  
  // Custom hooks (same as before)
  const {
    resumeDimensions,
    pageHeight,
    measurePageHeight,
    remeasureResume
  } = useResumeMeasurement(resumeData, isHistoryView, experienceLayout);
  
  const {
    experienceHeights,
    getExperiencePages
  } = useExperiencePagination(fullExperience, experienceLayout, pageHeight);
  
  const {
    pdfSettings,
    updatePdfSetting,
    setPdfSettings
  } = usePdfSettings();

  // Convert image to base64 for Word compatibility
  const convertImageToBase64 = async (imgSrc) => {
    try {
      // If already base64, return as is
      if (imgSrc.startsWith('data:')) {
        return imgSrc;
      }
      
      const response = await fetch(imgSrc);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Could not convert image to base64:', error);
      return imgSrc;
    }
  };

  // Enhanced Word download function with better formatting
  const handleDownloadWord = async () => {
    setIsPdfLoading(true);
    
    try {
      const candidateName = resumeData.profile?.name || 'Resume';
      const sanitizedName = candidateName
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      const filename = `${sanitizedName}_Resume.doc`;

      // Get the Word-compatible content
      const contentDiv = wordResumeRef.current;
      if (!contentDiv) {
        throw new Error('Word content not available');
      }

      // Clone the content to avoid modifying the original
      const clonedContent = contentDiv.cloneNode(true);
      
      // Convert images to base64
      const images = clonedContent.querySelectorAll('img');
      await Promise.all(Array.from(images).map(async (img) => {
        try {
          const base64 = await convertImageToBase64(img.src);
          img.src = base64;
          // Ensure proper dimensions for Word
          img.style.width = img.style.width || '100%';
          img.style.height = img.style.height || 'auto';
          img.style.display = 'block';
        } catch (error) {
          console.warn('Failed to convert image:', error);
        }
      }));

      // Create comprehensive Word-compatible HTML
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${candidateName} Resume</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>90</w:Zoom>
              <w:DoNotPromptForConvert/>
              <w:DoNotShowInsertionsAndDeletions/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            /* Page setup */
            @page {
              margin: 0in;
              size: A4;
            }
            
            /* Base styles */
            body {
              font-family: 'Montserrat', Arial, sans-serif;
              font-size: 12px;
              line-height: 1.2;
              margin: 0;
              padding: 0;
              width: 794px;
            }
            
            /* Table styling for consistent layout */
            table {
              border-collapse: collapse;
              width: 100%;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
            
            td {
              vertical-align: top;
              mso-line-height-rule: exactly;
            }
            
            /* Color preservation for Word */
            .black-bg {
              background-color: #000000 !important;
              mso-shading: #000000;
            }
            
            .grey-bg {
              background-color: #ededed !important;
              mso-shading: #ededed;
            }
            
            .dark-grey-bg {
              background-color: #9e9e9e !important;
              mso-shading: #9e9e9e;
            }
            
            .white-text {
              color: #ffffff !important;
            }
            
            .yellow-text {
              color: #fbbf24 !important;
            }
            
            .black-text {
              color: #000000 !important;
            }
            
            /* Font size preservation */
            .name-text {
              font-size: 40px !important;
              font-weight: bold !important;
              line-height: 1.1 !important;
            }
            
            .title-text {
              font-size: 16px !important;
              font-weight: bold !important;
              text-transform: uppercase;
              letter-spacing: 0.8px;
            }
            
            .section-header {
              font-size: 20px !important;
              font-weight: bold !important;
              letter-spacing: 0.8px;
            }
            
            /* Force dimensions */
            .profile-column {
              width: 350px !important;
            }
            
            .right-column {
              width: 610px !important;
            }
            
            /* Image styling */
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
            
            /* List styling */
            ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            
            /* Page breaks */
            .page-break {
              page-break-before: always;
            }
          </style>
        </head>
        <body>
          ${clonedContent.innerHTML}
        </body>
        </html>
      `;

      // Create blob with UTF-8 BOM for better Word compatibility
      const blob = new Blob(['\ufeff', wordHtml], {
        type: 'application/msword;charset=utf-8'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Word document generated successfully');

    } catch (error) {
      console.error('Error generating Word document:', error);
      alert(`Failed to generate Word document: ${error.message}. Please try again.`);
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Update PDF settings when dimensions change (same as before)
  useEffect(() => {
    const { width, height } = resumeDimensions;
    const { lastWidth, lastHeight } = updateRef.current;
    
    if ((width > 0 && width !== lastWidth) || (height > 0 && height !== lastHeight)) {
      updateRef.current = { lastWidth: width, lastHeight: height };
      
      setPdfSettings(prev => ({
        ...prev,
        customWidth: width,
        customHeight: height
      }));
    }
  }, [resumeDimensions.width, resumeDimensions.height, setPdfSettings]);

  // PDF generation function (same as before)
  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    
    const measuredHeight = measurePageHeight();
    
    if (measuredHeight) {
      console.log('Using consistent page height for PDF generation:', measuredHeight, 'px');
    }
    
    try {
      const candidateName = resumeData.profile?.name || 'Resume';
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

      await generatePDF(() => document.getElementById('resume-content'), options);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  // CRITICAL FIX: Isolated container styling that won't interfere with parent page
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    paddingTop: '2rem',
    maxWidth: '1512.8000488px',
    margin: '0 auto'
  };

  // Resume content wrapper with proper isolation
  const resumeWrapperStyle = {
    maxWidth: '1512.8px',
    width: '100%',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2
  };

  return (
    <div style={containerStyle}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
        
        {/* Critical CSS reset for table layout isolation */}
        <style jsx global>{`
          /* Prevent global table style interference */
          #resume-content table {
            border-collapse: collapse !important;
            table-layout: fixed !important;
            width: 100% !important;
          }
          
          #resume-content td, 
          #resume-content th {
            box-sizing: border-box !important;
            vertical-align: top !important;
          }
          
          /* Prevent text overflow issues */
          #resume-content {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          
          /* Ensure proper font loading */
          #resume-content * {
            font-family: 'Montserrat', Arial, sans-serif !important;
          }
        `}</style>
      </Head>

      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={wordResumeRef}>
          <ResumeWordCompatible
            resumeData={resumeData}
            mainExperience={mainExperience}
            experienceLayout={experienceLayout}
            getExperiencePages={getExperiencePages}
            pageHeight={pageHeight}
          />
        </div>
      </div>

      {/* Control Buttons - Only show when not in history view */}
      {!isHistoryView && (
        <table style={{ width: '100%', maxWidth: '1512.8px', marginBottom: '1rem', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top' }}>
                <ControlButtonsTable
                  handleDownloadPDF={handleDownloadPDF}
                  handleDownloadWord={handleDownloadWord}
                  isPdfLoading={isPdfLoading}
                  setShowPdfSettings={setShowPdfSettings}
                  remeasureResume={remeasureResume}
                  onBackToSummary={onBackToSummary}
                />
              </td>
              <td style={{ verticalAlign: 'top', paddingLeft: '1rem' }}>
                <ExperienceLayoutControls
                  experienceLayout={experienceLayout}
                  setExperienceLayout={setExperienceLayout}
                  mainExperience={mainExperience}
                  fullExperience={fullExperience}
                  experiencePages={getExperiencePages}
                />
              </td>
              <td style={{ verticalAlign: 'top', paddingLeft: '1rem' }}>
                <DimensionsDisplay
                  resumeDimensions={resumeDimensions}
                  pageHeight={pageHeight}
                />
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <BackButton
        onBackToSummary={onBackToSummary}
        isHistoryView={isHistoryView}
      />

      {/* Resume Content - Properly isolated */}
      <div style={resumeWrapperStyle}>
        <table 
          id="resume-content" 
          style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed'
          }}
        >
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top' }}>
                <FirstPageTable
                  resumeData={resumeData}
                  mainExperience={mainExperience}
                />
              </td>
            </tr>
            {experienceLayout === 'paginated' && getExperiencePages.map((pageData, pageIndex) => (
              <tr key={pageIndex}>
                <td style={{ verticalAlign: 'top' }}>
                  <ExperiencePageTable
                    experiences={pageData}
                    pageNumber={pageIndex + 2}
                    resumeData={resumeData}
                    pageHeight={pageHeight}
                    fullExperience={fullExperience}
                    experienceHeights={experienceHeights}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HiddenMeasurementArea
        experienceLayout={experienceLayout}
        fullExperience={fullExperience}
      />

      <PdfSettingsModal
        showPdfSettings={showPdfSettings}
        setShowPdfSettings={setShowPdfSettings}
        pdfSettings={pdfSettings}
        updatePdfSetting={updatePdfSetting}
        resumeDimensions={resumeDimensions}
        pageHeight={pageHeight}
        remeasureResume={remeasureResume}
        isHistoryView={isHistoryView}
      />
    </div>
  );
};


// Updated ControlButtons component with Word download
const ControlButtonsTable = ({ 
  handleDownloadPDF, 
  handleDownloadWord,
  isPdfLoading, 
  setShowPdfSettings, 
  remeasureResume, 
  onBackToSummary 
}) => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '1rem', 
      right: '1rem', 
      zIndex: 50,
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }}>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ paddingBottom: '0.5rem' }}>
              <button
                onClick={handleDownloadPDF}
                disabled={isPdfLoading}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: isPdfLoading ? 'not-allowed' : 'pointer',
                  opacity: isPdfLoading ? 0.6 : 1,
                  width: '100%'
                }}
              >
                {isPdfLoading ? 'Generating...' : 'Download PDF'}
              </button>
            </td>
          </tr>
          <tr>
            <td style={{ paddingBottom: '0.5rem' }}>
              <button
                onClick={handleDownloadWord}
                disabled={isPdfLoading}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: isPdfLoading ? 'not-allowed' : 'pointer',
                  opacity: isPdfLoading ? 0.6 : 1,
                  width: '100%'
                }}
              >
                {isPdfLoading ? 'Generating...' : 'Download Word'}
              </button>
            </td>
          </tr>
          <tr>
            <td style={{ paddingBottom: '0.5rem' }}>
              <button
                onClick={() => setShowPdfSettings(true)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                PDF Settings
              </button>
            </td>
          </tr>
          <tr>
            <td style={{ paddingBottom: '0.5rem' }}>
              <button
                onClick={remeasureResume}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Remeasure
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button
                onClick={onBackToSummary}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Back to Summary
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      
      
    </div>
  );
};

export default ResumeTemplateTable;