import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import generatePDF from 'react-to-pdf';
import TemplateToggle from './ResumeTemplate/TemplateToggle';

// Import custom hooks
import { useExperiencePagination } from '../hooks/useExperiencePagination';
import { usePdfSettings } from '../hooks/usePdfSettings';
import { useResumeMeasurement } from '../hooks/useResumeMeasurement';

// Import the new docx hook
import useResumeDocx from '../hooks/ResumeDocxGenerator';

// // Import Word-compatible components
// import ResumeWordCompatible from './ResumeTemplate/ResumeWordCompatible';
// import ResumeWordCompatibleDefault from './ResumeTemplate/ResumeWordCompatibleDefault';


import BackButton from './ResumeTemplate/BackButton';
import ControlButtons from './ResumeTemplate/ControlButtons';
import DimensionsDisplay from './ResumeTemplate/DimensionsDisplay';
import ExperienceLayoutControls from './ResumeTemplate/ExperienceLayoutControls';
import ExperiencePage from './ResumeTemplate/ExperiencePage';
import FirstPage from './ResumeTemplate/FirstPage';

import HiddenMeasurementArea from './ResumeTemplate/HiddenMeasurementArea';
import PdfSettingsModal from './ResumeTemplate/PdfSettingsModal';

const ResumeTemplate = ({ resumeData, onBackToSummary, viewMode = 'generate' }) => {
    
    const [templateType, setTemplateType] = useState('sme-gateway'); // 'sme-gateway' or 'default'

    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [isWordLoading, setIsWordLoading] = useState(false);
    const [showPdfSettings, setShowPdfSettings] = useState(false);
    const [experienceLayout, setExperienceLayout] = useState('summary');
    const [downloadFormat, setDownloadFormat] = useState('web'); // 'web', 'word'
    
    // Use ref to prevent infinite updates
    const updateRef = useRef({ lastWidth: 0, lastHeight: 0 });
    const wordResumeRef = useRef(null);
    
    // Use the new docx hook
    const { downloadSMEGatewayDocx, downloadDefaultDocx } = useResumeDocx();
    
    // Determine if this is history view mode
    const isHistoryView = viewMode === 'history';
    
    // Experience handling logic
    const fullExperience = resumeData.fullExperience || [];
    const mainExperience = resumeData.experience || [];
    
    // Custom hooks
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
  
    // Update PDF settings when dimensions change - with stability check
    useEffect(() => {
      const { width, height } = resumeDimensions;
      const { lastWidth, lastHeight } = updateRef.current;
      
      // Only update if dimensions actually changed
      if ((width > 0 && width !== lastWidth) || (height > 0 && height !== lastHeight)) {
        updateRef.current = { lastWidth: width, lastHeight: height };
        
        setPdfSettings(prev => ({
          ...prev,
          customWidth: width,
          customHeight: height
        }));
      }
    }, [resumeDimensions.width, resumeDimensions.height, setPdfSettings]);
  
    // PDF generation
    const getTargetElement = () => {
      const elementId = downloadFormat === 'word' ? 'resume-word-content' : 'resume-content';
      return document.getElementById(elementId);
    };
  
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
  
        await generatePDF(getTargetElement, options);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsPdfLoading(false);
      }
    };

    // NEW: Enhanced Word download using docx library (NO FOLDERS CREATED)
    const handleDownloadWordDocx = async () => {
      setIsWordLoading(true);
      
      try {
        console.log(`📄 Starting ${templateType} resume docx generation...`);
        
        if (templateType === 'sme-gateway') {
          await downloadSMEGatewayDocx(resumeData, mainExperience, getExperiencePages);
        } else {
          await downloadDefaultDocx(resumeData, mainExperience, getExperiencePages);
        }
        
        console.log(`✅ ${templateType} resume docx generated successfully!`);
      } catch (error) {
        console.error('❌ Error generating docx resume:', error);
        alert('There was an error generating the Word document. Please try again.');
      } finally {
        setIsWordLoading(false);
      }
    };
    
   
  
    // Dynamic container styling
    const containerStyle = {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      paddingTop: '2rem',
      maxWidth: '1512.8000488px',
      margin: '0 auto'
    };
  
    return (
      <div style={containerStyle}>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
        </Head>

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

        {/* Control Buttons */}
        {!isHistoryView && (
          <>
        <ControlButtons
              handleDownloadPDF={handleDownloadPDF}
              handleDownloadWord={handleDownloadWordDocx}
              isPdfLoading={isPdfLoading}
              isWordLoading={isWordLoading}
              setShowPdfSettings={setShowPdfSettings}
              remeasureResume={remeasureResume}
              onBackToSummary={onBackToSummary}
            />

            
            {/* Template Toggle */}
            <TemplateToggle 
              templateType={templateType} 
              setTemplateType={setTemplateType} 
            />
  
            <ExperienceLayoutControls
              experienceLayout={experienceLayout}
              setExperienceLayout={setExperienceLayout}
              mainExperience={mainExperience}
              fullExperience={fullExperience}
              experiencePages={getExperiencePages}
            />
  
            <DimensionsDisplay
              resumeDimensions={resumeDimensions}
              pageHeight={pageHeight}
            />

            {/* Enhanced Document Info Banner */}
            <div style={{
              maxWidth: '1012.8000488px',
              margin: '0 auto 1rem auto',
              padding: '1rem',
              backgroundColor: '#e0f2fe',
              border: '1px solid #0284c7',
              borderRadius: '0.5rem'
            }}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    📋 {templateType === 'sme-gateway' ? 'SME Gateway' : 'Default'} Resume Template
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Professional resume for: <strong>{resumeData.profile?.name || 'Candidate'}</strong>
                  </p>
                  <div className="text-xs mt-2">
                    <span className="text-green-600">
                      ✅ Experience Layout: {experienceLayout} | 
                      Pages: {getExperiencePages.length + 1} | 
                      Template: {templateType === 'sme-gateway' ? 'SME Gateway (with SME logo)' : 'Default (PappsPM only)'}
                    </span>
                  </div>
                  <p className="text-green-600 text-xs mt-1">
                    🚀 <strong>NEW:</strong> Word documents generated using true .docx format with enhanced image validation!
                  </p>
                  <p className="text-amber-600 text-xs mt-1">
                    🔍 <strong>Testing:</strong> Open browser console (F12) when downloading to see detailed image processing logs.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600">
                    Resume: <strong>{resumeData.profile?.title || 'Professional'}</strong>
                  </div>
                  <div className="text-xs text-blue-500">
                    Generated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
  
        <BackButton
          onBackToSummary={onBackToSummary}
          isHistoryView={isHistoryView}
        />
  
        {/* Web Resume Content */}
        <div id="resume-content" style={{ 
          display: downloadFormat === 'web' ? 'flex' : 'none', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <FirstPage
            resumeData={resumeData}
            mainExperience={mainExperience}
            templateType={templateType}
          />
          
          {/* Experience Pages with Consistent Heights */}
          {experienceLayout === 'paginated' && getExperiencePages.map((pageData, pageIndex) => (
            <ExperiencePage
              key={pageIndex}
              experiences={pageData}
              pageNumber={pageIndex + 2}
              resumeData={resumeData}
              pageHeight={pageHeight}
              fullExperience={fullExperience}
              experienceHeights={experienceHeights}
              templateType={templateType} 
            />
          ))}
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
  
  export default ResumeTemplate;