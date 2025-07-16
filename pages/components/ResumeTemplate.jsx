// import Head from 'next/head';
// import { useEffect, useRef, useState } from 'react';
// import generatePDF from 'react-to-pdf';
// import TemplateToggle from './ResumeTemplate/TemplateToggle';

// // Import custom hooks
// import { useExperiencePagination } from '../hooks/useExperiencePagination';
// import { usePdfSettings } from '../hooks/usePdfSettings';
// import { useResumeMeasurement } from '../hooks/useResumeMeasurement';


// // Import Word-compatible components
// import ResumeWordCompatible from './ResumeTemplate/ResumeWordCompatible';
// import ResumeWordCompatibleDefault from './ResumeTemplate/ResumeWordCompatibleDefault';

// import BackButton from './ResumeTemplate/BackButton';
// import ControlButtons from './ResumeTemplate/ControlButtons';
// import DimensionsDisplay from './ResumeTemplate/DimensionsDisplay';
// import ExperienceLayoutControls from './ResumeTemplate/ExperienceLayoutControls';
// import ExperiencePage from './ResumeTemplate/ExperiencePage';
// import FirstPage from './ResumeTemplate/FirstPage';


// import HiddenMeasurementArea from './ResumeTemplate/HiddenMeasurementArea';
// import PdfSettingsModal from './ResumeTemplate/PdfSettingsModal';

// const ResumeTemplate = ({ resumeData, onBackToSummary, viewMode = 'generate' }) => {
    
//     const [templateType, setTemplateType] = useState('sme-gateway'); // Add this line

//     const [isPdfLoading, setIsPdfLoading] = useState(false);
//     const [isWordLoading, setIsWordLoading] = useState(false);
//     const [showPdfSettings, setShowPdfSettings] = useState(false);
//     const [experienceLayout, setExperienceLayout] = useState('summary');
//     const [downloadFormat, setDownloadFormat] = useState('web'); // 'web', 'word'
    
//     // Use ref to prevent infinite updates
//     const updateRef = useRef({ lastWidth: 0, lastHeight: 0 });
//     const wordResumeRef = useRef(null);
    
//     // Determine if this is history view mode
//     const isHistoryView = viewMode === 'history';
    
//     // Experience handling logic
//     const fullExperience = resumeData.fullExperience || [];
//     const mainExperience = resumeData.experience || [];
    
//     // Custom hooks
//     const {
//       resumeDimensions,
//       pageHeight,
//       measurePageHeight,
//       remeasureResume
//     } = useResumeMeasurement(resumeData, isHistoryView, experienceLayout);
    
//     const {
//       experienceHeights,
//       getExperiencePages
//     } = useExperiencePagination(fullExperience, experienceLayout, pageHeight);
    
//     const {
//       pdfSettings,
//       updatePdfSetting,
//       setPdfSettings
//     } = usePdfSettings();
  
//     // Update PDF settings when dimensions change - with stability check
//     useEffect(() => {
//       const { width, height } = resumeDimensions;
//       const { lastWidth, lastHeight } = updateRef.current;
      
//       // Only update if dimensions actually changed
//       if ((width > 0 && width !== lastWidth) || (height > 0 && height !== lastHeight)) {
//         updateRef.current = { lastWidth: width, lastHeight: height };
        
//         setPdfSettings(prev => ({
//           ...prev,
//           customWidth: width,
//           customHeight: height
//         }));
//       }
//     }, [resumeDimensions.width, resumeDimensions.height, setPdfSettings]);
  
//     // PDF generation
//     const getTargetElement = () => {
//       const elementId = downloadFormat === 'word' ? 'resume-word-content' : 'resume-content';
//       return document.getElementById(elementId);
//     };
  
//     const handleDownloadPDF = async () => {
//       setIsPdfLoading(true);
      
//       const measuredHeight = measurePageHeight();
      
//       if (measuredHeight) {
//         console.log('Using consistent page height for PDF generation:', measuredHeight, 'px');
//       }
      
//       try {
//         const candidateName = resumeData.profile?.name || 'Resume';
//         const sanitizedName = candidateName
//           .replace(/[^a-zA-Z0-9\s]/g, '')
//           .replace(/\s+/g, '_')
//           .trim();
//         const filename = `${sanitizedName}_Resume.pdf`;
  
//         const options = {
//           method: pdfSettings.method,
//           resolution: pdfSettings.resolution,
//           page: {
//             margin: pdfSettings.margin,
//             format: pdfSettings.format === 'custom' ? [pdfSettings.customWidth, pdfSettings.customHeight] : pdfSettings.format,
//             orientation: pdfSettings.orientation,
//           },
//           canvas: {
//             mimeType: pdfSettings.mimeType,
//             qualityRatio: pdfSettings.qualityRatio
//           },
//           overrides: {
//             pdf: {
//               compress: pdfSettings.compress
//             },
//             canvas: {
//               useCORS: pdfSettings.useCORS
//             }
//           },
//           filename: filename,
//         };
  
//         await generatePDF(getTargetElement, options);
//       } catch (error) {
//         console.error('Error generating PDF:', error);
//       } finally {
//         setIsPdfLoading(false);
//       }
//     };


    
//   // Convert image to base64 for Word compatibility
//   const convertImageToBase64 = async (imgSrc) => {
//     try {
//       // If already base64, return as is
//       if (imgSrc.startsWith('data:')) {
//         return imgSrc;
//       }
      
//       const response = await fetch(imgSrc);
//       const blob = await response.blob();
      
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result);
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//       });
//     } catch (error) {
//       console.warn('Could not convert image to base64:', error);
//       return imgSrc;
//     }
//   };

//   // Enhanced Word download function with better formatting
//   const handleDownloadWord = async () => {
//     setIsPdfLoading(true);
    
//     try {
//       const candidateName = resumeData.profile?.name || 'Resume';
//       const sanitizedName = candidateName
//         .replace(/[^a-zA-Z0-9\s]/g, '')
//         .replace(/\s+/g, '_')
//         .trim();
//       const filename = `${sanitizedName}_Resume.doc`;

//       // Get the Word-compatible content
//       const contentDiv = wordResumeRef.current;
//       if (!contentDiv) {
//         throw new Error('Word content not available');
//       }

//       // Clone the content to avoid modifying the original
//       const clonedContent = contentDiv.cloneNode(true);
      
//       // Convert images to base64
//       const images = clonedContent.querySelectorAll('img');
//       await Promise.all(Array.from(images).map(async (img) => {
//         try {
//           const base64 = await convertImageToBase64(img.src);
//           img.src = base64;
//           // Ensure proper dimensions for Word
//           img.style.width = img.style.width || '100%';
//           img.style.height = img.style.height || 'auto';
//           img.style.display = 'block';
//         } catch (error) {
//           console.warn('Failed to convert image:', error);
//         }
//       }));

//       // Create comprehensive Word-compatible HTML
//       const wordHtml = `
//         <html xmlns:o='urn:schemas-microsoft-com:office:office' 
//               xmlns:w='urn:schemas-microsoft-com:office:word' 
//               xmlns='http://www.w3.org/TR/REC-html40'>
//         <head>
//           <meta charset="utf-8">
//           <title>${candidateName} Resume</title>
//           <!--[if gte mso 9]>
//           <xml>
//             <w:WordDocument>
//               <w:View>Print</w:View>
//               <w:Zoom>90</w:Zoom>
//               <w:DoNotPromptForConvert/>
//               <w:DoNotShowInsertionsAndDeletions/>
//             </w:WordDocument>
//           </xml>
//           <![endif]-->
//           <style>
//             /* Page setup */
//             @page {
//               margin: 0in;
//               size: A4;
//             }
            
//             /* Base styles */
//             body {
//               font-family: 'Montserrat', Arial, sans-serif;
//               font-size: 12px;
//               line-height: 1.2;
//               margin: 0;
//               padding: 0;
//               width: 794px;
//             }
            
//             /* Table styling for consistent layout */
//             table {
//               border-collapse: collapse;
//               width: 100%;
//               mso-table-lspace: 0pt;
//               mso-table-rspace: 0pt;
//             }
            
//             td {
//               vertical-align: top;
//               mso-line-height-rule: exactly;
//             }
            
//             /* Color preservation for Word */
//             .black-bg {
//               background-color: #000000 !important;
//               mso-shading: #000000;
//             }
            
//             .grey-bg {
//               background-color: #ededed !important;
//               mso-shading: #ededed;
//             }
            
//             .dark-grey-bg {
//               background-color: #9e9e9e !important;
//               mso-shading: #9e9e9e;
//             }
            
//             .white-text {
//               color: #ffffff !important;
//             }
            
//             .yellow-text {
//               color: #fbbf24 !important;
//             }
            
//             .black-text {
//               color: #000000 !important;
//             }
            
//             /* Font size preservation */
//             .name-text {
//               font-size: 40px !important;
//               font-weight: bold !important;
//               line-height: 1.1 !important;
//             }
            
//             .title-text {
//               font-size: 16px !important;
//               font-weight: bold !important;
//               text-transform: uppercase;
//               letter-spacing: 0.8px;
//             }
            
//             .section-header {
//               font-size: 20px !important;
//               font-weight: bold !important;
//               letter-spacing: 0.8px;
//             }

//             section-text {
//             font-size: 14px !important; /* Adjust this to match your scaled font size */
//             }

//             ul li {
//             font-size: 8px !important; /* Make sure bullet points match text */
//             }
            
//             /* Force dimensions */
//             .profile-column {
//               width: 350px !important;
//             }
            
//             .right-column {
//               width: 610px !important;
//             }
            
//             /* Image styling */
//             img {
//               max-width: 100%;
//               height: auto;
//               display: block;
//             }
            
//             /* List styling */
//             ul {
//               list-style: none;
//               padding: 0;
//               margin: 0;
//             }
            
//             /* Page breaks */
//             .page-break {
//               page-break-before: always;
//             }
//           </style>
//         </head>
//         <body>
//           ${clonedContent.innerHTML}
//         </body>
//         </html>
//       `;

//       // Create blob with UTF-8 BOM for better Word compatibility
//       const blob = new Blob(['\ufeff', wordHtml], {
//         type: 'application/msword;charset=utf-8'
//       });

//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
      
//       console.log('Word document generated successfully');

//     } catch (error) {
//       console.error('Error generating Word document:', error);
//       alert(`Failed to generate Word document: ${error.message}. Please try again.`);
//     } finally {
//       setIsPdfLoading(false);
//     }
//   };
  
//     // Dynamic container styling
//     const containerStyle = {
//       minHeight: '100vh',
//       backgroundColor: '#f3f4f6',
//       paddingTop: '2rem',
//       maxWidth: '1512.8000488px',
//       margin: '0 auto'
//     };
  
//     return (
//       <div style={containerStyle}>
//         <Head>
//           <link rel="preconnect" href="https://fonts.googleapis.com"/>
//           <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
//           <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
//         </Head>

//             {/* Critical CSS reset for table layout isolation */}
//             <style jsx global>{`
//           /* Prevent global table style interference */
//           #resume-content table {
//             border-collapse: collapse !important;
//             table-layout: fixed !important;
//             width: 100% !important;
//           }
          
//           #resume-content td, 
//           #resume-content th {
//             box-sizing: border-box !important;
//             vertical-align: top !important;
//           }
          
//           /* Prevent text overflow issues */
//           #resume-content {
//             word-wrap: break-word !important;
//             overflow-wrap: break-word !important;
//           }
          
//           /* Ensure proper font loading */
//           #resume-content * {
//             font-family: 'Montserrat', Arial, sans-serif !important;
//           }
//         `}</style>

// <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
//   <div ref={wordResumeRef}>
//     {templateType === 'sme-gateway' ? (
//       <ResumeWordCompatible
//         resumeData={resumeData}
//         mainExperience={mainExperience}
//         experienceLayout={experienceLayout}
//         getExperiencePages={getExperiencePages}
//         pageHeight={pageHeight}
 
//       />
//     ) : (
//       <ResumeWordCompatibleDefault
//         resumeData={resumeData}
//         mainExperience={mainExperience}
//         experienceLayout={experienceLayout}
//         getExperiencePages={getExperiencePages}
//         pageHeight={pageHeight}

//       />
//     )}
//   </div>
// </div>

        
//         {/* Control Buttons */}
//         {!isHistoryView && (
//           <>
//             <ControlButtons
//               handleDownloadPDF={handleDownloadPDF}
//               handleDownloadWord={handleDownloadWord}
//               isPdfLoading={isPdfLoading}
//               isWordLoading={isWordLoading}
//               setShowPdfSettings={setShowPdfSettings}
//               remeasureResume={remeasureResume}
//               onBackToSummary={onBackToSummary}
//             />

//                {/* Add Template Toggle here */}
//                <TemplateToggle 
//                         templateType={templateType} 
//                         setTemplateType={setTemplateType} 
//                     />
  
//             <ExperienceLayoutControls
//               experienceLayout={experienceLayout}
//               setExperienceLayout={setExperienceLayout}
//               mainExperience={mainExperience}
//               fullExperience={fullExperience}
//               experiencePages={getExperiencePages}
//             />
  
//             <DimensionsDisplay
//               resumeDimensions={resumeDimensions}
//               pageHeight={pageHeight}
//             />
//           </>
//         )}
  
//         <BackButton
//           onBackToSummary={onBackToSummary}
//           isHistoryView={isHistoryView}
//         />
  
//         {/* Web Resume Content */}
//         <div id="resume-content" style={{ 
//           display: downloadFormat === 'web' ? 'flex' : 'none', 
//           flexDirection: 'column', 
//           alignItems: 'center' 
//         }}>
//           {/* <FirstPage
//             resumeData={resumeData}
//             mainExperience={mainExperience}
//           />
//            */}
//             <FirstPage
//             resumeData={resumeData}
//             mainExperience={mainExperience}
//             templateType={templateType}
//           />
//           {/* Experience Pages with Consistent Heights */}
//           {experienceLayout === 'paginated' && getExperiencePages.map((pageData, pageIndex) => (
//             <ExperiencePage
//               key={pageIndex}
//               experiences={pageData}
//               pageNumber={pageIndex + 2}
//               resumeData={resumeData}
//               pageHeight={pageHeight}
//               fullExperience={fullExperience}
//               experienceHeights={experienceHeights}
//               templateType={templateType} 
//             />
//           ))}
//         </div>

//         {/* Word-Compatible Resume Content */}

          

//         <div id="resume-word-content" style={{ 
//             display: downloadFormat === 'word' ? 'block' : 'none',
//             width: '100%'
//             }}>
//             {templateType === 'sme-gateway' ? (
//                 <ResumeWordCompatible
//                 resumeData={resumeData}
//                 mainExperience={mainExperience}
//                 experienceLayout={experienceLayout}
//                 getExperiencePages={getExperiencePages}
//                 pageHeight={pageHeight}
//                 // templateType={templateType}
//                 />
//             ) : (
//                 <ResumeWordCompatibleDefault
//                 resumeData={resumeData}
//                 mainExperience={mainExperience}
//                 experienceLayout={experienceLayout}
//                 getExperiencePages={getExperiencePages}
//                 pageHeight={pageHeight}
//                 // templateType={templateType}
//                 />
//             )}
//             </div>

//         <HiddenMeasurementArea
//           experienceLayout={experienceLayout}
//           fullExperience={fullExperience}
//         />
  
//         <PdfSettingsModal
//           showPdfSettings={showPdfSettings}
//           setShowPdfSettings={setShowPdfSettings}
//           pdfSettings={pdfSettings}
//           updatePdfSetting={updatePdfSetting}
//           resumeDimensions={resumeDimensions}
//           pageHeight={pageHeight}
//           remeasureResume={remeasureResume}
//           isHistoryView={isHistoryView}
//         />
//       </div>
//     );
//   };
  
//   export default ResumeTemplate;

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

// Import Word-compatible components
import ResumeWordCompatible from './ResumeTemplate/ResumeWordCompatible';
import ResumeWordCompatibleDefault from './ResumeTemplate/ResumeWordCompatibleDefault';

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

        {/* Hidden Word-compatible version for legacy HTML-based Word generation */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div ref={wordResumeRef}>
            {templateType === 'sme-gateway' ? (
              <ResumeWordCompatible
                resumeData={resumeData}
                mainExperience={mainExperience}
                experienceLayout={experienceLayout}
                getExperiencePages={getExperiencePages}
                pageHeight={pageHeight}
              />
            ) : (
              <ResumeWordCompatibleDefault
                resumeData={resumeData}
                mainExperience={mainExperience}
                experienceLayout={experienceLayout}
                getExperiencePages={getExperiencePages}
                pageHeight={pageHeight}
              />
            )}
          </div>
        </div>
        
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

        {/* Word-Compatible Resume Content (for legacy HTML-based Word generation) */}
        <div id="resume-word-content" style={{ 
          display: downloadFormat === 'word' ? 'block' : 'none',
          width: '100%'
        }}>
          {templateType === 'sme-gateway' ? (
            <ResumeWordCompatible
              resumeData={resumeData}
              mainExperience={mainExperience}
              experienceLayout={experienceLayout}
              getExperiencePages={getExperiencePages}
              pageHeight={pageHeight}
            />
          ) : (
            <ResumeWordCompatibleDefault
              resumeData={resumeData}
              mainExperience={mainExperience}
              experienceLayout={experienceLayout}
              getExperiencePages={getExperiencePages}
              pageHeight={pageHeight}
            />
          )}
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