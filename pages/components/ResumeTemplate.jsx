
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import generatePDF from 'react-to-pdf';

// Import custom hooks
import { useExperiencePagination } from '../hooks/useExperiencePagination';
import { usePdfSettings } from '../hooks/usePdfSettings';
import { useResumeMeasurement } from '../hooks/useResumeMeasurement';


import BackButton from './ResumeTemplate/BackButton';
import ControlButtons from './ResumeTemplate/ControlButtons';
import DimensionsDisplay from './ResumeTemplate/DimensionsDisplay';
import ExperienceLayoutControls from './ResumeTemplate/ExperienceLayoutControls';
import ExperiencePage from './ResumeTemplate/ExperiencePage';
import FirstPage from './ResumeTemplate/FirstPage';
import HiddenMeasurementArea from './ResumeTemplate/HiddenMeasurementArea';
import PdfSettingsModal from './ResumeTemplate/PdfSettingsModal';

const ResumeTemplate = ({ resumeData, onBackToSummary, viewMode = 'generate' }) => {
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [showPdfSettings, setShowPdfSettings] = useState(false);
    const [experienceLayout, setExperienceLayout] = useState('summary');
    
    // Use ref to prevent infinite updates
    const updateRef = useRef({ lastWidth: 0, lastHeight: 0 });
    
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
    const getTargetElement = () => document.getElementById('resume-content');
  
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
        
        </Head>

        {/* Control Buttons */}
        {!isHistoryView && (
          <>
            <ControlButtons
              handleDownloadPDF={handleDownloadPDF}
              isPdfLoading={isPdfLoading}
              setShowPdfSettings={setShowPdfSettings}
              remeasureResume={remeasureResume}
              onBackToSummary={onBackToSummary}
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
          </>
        )}
  
        <BackButton
          onBackToSummary={onBackToSummary}
          isHistoryView={isHistoryView}
        />
  
        {/* Resume Content */}
        <div id="resume-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FirstPage
            resumeData={resumeData}
            mainExperience={mainExperience}
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