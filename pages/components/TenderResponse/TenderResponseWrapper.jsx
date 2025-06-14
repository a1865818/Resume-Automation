// // import { useRef, useState } from 'react';
// // import generatePDF from 'react-to-pdf';
// // import TenderResponse from './TenderResponseNew';

// // const TenderResponseWrapper = ({ tenderData, candidateName, onBackToResume }) => {
// //   const [isPdfLoading, setIsPdfLoading] = useState(false);
// //   const tenderRef = useRef();

// //   const handleDownloadPDF = async () => {
// //     setIsPdfLoading(true);
    
// //     try {
// //       // Get candidate name for the filename
// //       const name = candidateName || tenderData?.candidateDetails?.name || 'Tender_Response';
// //       const sanitizedName = name
// //         .replace(/[^a-zA-Z0-9\s]/g, '')
// //         .replace(/\s+/g, '_')
// //         .trim();
// //       const filename = `${sanitizedName}_Tender_Response.pdf`;
      
// //       // PDF generation options
// //       const options = {
// //         filename: filename,
// //         page: {
// //           margin: 20,
// //           format: 'a4',
// //           orientation: 'portrait',
// //         },
// //         canvas: {
// //           mimeType: 'image/png',
// //           qualityRatio: 1
// //         },
// //         overrides: {
// //           pdf: {
// //             compress: true,
// //             fitWindow: true,
// //           },
// //           canvas: {
// //             useCORS: true,
// //             scale: 2,
// //           },
// //         },
// //       };
      
// //       // Wait for a brief moment to ensure all styles are applied
// //       await new Promise(resolve => setTimeout(resolve, 100));
      
// //       // Generate the PDF from the tender reference
// //       await generatePDF(tenderRef, options);
      
// //       console.log('Tender response PDF generated successfully!');
// //     } catch (error) {
// //       console.error('Error generating PDF:', error);
// //     } finally {
// //       setIsPdfLoading(false);
// //     }
// //   };
  
// //   // Check if tenderData exists
// //   if (!tenderData) {
// //     return (
// //       <div style={{ 
// //         minHeight: '100vh', 
// //         backgroundColor: '#f3f4f6',
// //         padding: '2rem',
// //         display: 'flex',
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         justifyContent: 'center'
// //       }}>
// //         <h2>No tender response data available</h2>
// //         <button
// //           onClick={onBackToResume}
// //           style={{
// //             backgroundColor: '#6b7280',
// //             color: 'white',
// //             padding: '0.75rem 1.5rem',
// //             borderRadius: '0.5rem',
// //             border: 'none',
// //             cursor: 'pointer',
// //             fontSize: '1rem',
// //             fontWeight: '500',
// //             marginTop: '1rem'
// //           }}
// //         >
// //           ← Back to Resume
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={{ 
// //       minHeight: '100vh', 
// //       backgroundColor: '#f3f4f6',
// //       paddingTop: '2rem',
// //       paddingBottom: '2rem'
// //     }}>
// //       {/* Control Buttons */}
// //       <div style={{
// //         display: 'flex',
// //         justifyContent: 'center',
// //         gap: '1rem',
// //         marginBottom: '2rem',
// //         paddingLeft: '1rem',
// //         paddingRight: '1rem'
// //       }}>
// //         <button
// //           onClick={onBackToResume}
// //           style={{
// //             backgroundColor: '#6b7280',
// //             color: 'white',
// //             padding: '0.75rem 1.5rem',
// //             borderRadius: '0.5rem',
// //             border: 'none',
// //             cursor: 'pointer',
// //             fontSize: '1rem',
// //             fontWeight: '500',
// //             display: 'flex',
// //             alignItems: 'center',
// //             gap: '0.5rem'
// //           }}
// //         >
// //           ← Back to Resume
// //         </button>
        
// //         <button
// //           onClick={handleDownloadPDF}
// //           disabled={isPdfLoading}
// //           style={{
// //             backgroundColor: isPdfLoading ? '#9ca3af' : '#059669',
// //             color: 'white',
// //             padding: '0.75rem 1.5rem',
// //             borderRadius: '0.5rem',
// //             border: 'none',
// //             cursor: isPdfLoading ? 'not-allowed' : 'pointer',
// //             fontSize: '1rem',
// //             fontWeight: '500',
// //             display: 'flex',
// //             alignItems: 'center',
// //             gap: '0.5rem'
// //           }}
// //         >
// //           {isPdfLoading ? (
// //             <>
// //               <div style={{
// //                 width: '1rem',
// //                 height: '1rem',
// //                 border: '2px solid transparent',
// //                 borderTop: '2px solid white',
// //                 borderRadius: '50%',
// //                 animation: 'spin 1s linear infinite'
// //               }}></div>
// //               Generating PDF...
// //             </>
// //           ) : (
// //             <>📄 Download PDF</>
// //           )}
// //         </button>
// //       </div>

// //       {/* Tender Response Content with Shadow */}
// //       <div style={{
// //         maxWidth: '1512.8000488px',
// //         margin: '0 auto',
// //         backgroundColor: '#ffffff',
// //         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
// //         borderRadius: '0.5rem',
// //         overflow: 'hidden'
// //       }}>
// //         <div ref={tenderRef}>
// //           <TenderResponse tenderData={tenderData} />
// //         </div>
// //       </div>

// //       {/* Add CSS for spinner animation */}
// //       <style jsx>{`
// //         @keyframes spin {
// //           0% { transform: rotate(0deg); }
// //           100% { transform: rotate(360deg); }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default TenderResponseWrapper;



// import { useRef, useState } from 'react';
// import generatePDF from 'react-to-pdf';
// import TenderResponseNew from './TenderResponseNew';

// const TenderResponseWrapper = ({ 
//   tenderData, 
//   candidateName, 
//   onBackToResume, 
//   templateType = "ict-criteria" 
// }) => {
//   const [isPdfLoading, setIsPdfLoading] = useState(false);
//   const [validationResults, setValidationResults] = useState(null);
//   const tenderRef = useRef();

//   // Validate the tender data on component mount
//   useState(() => {
//     if (tenderData && templateType === "ict-criteria") {
//       import('@/pages/api/geminiApi').then(({ validateICTCriteriaFormat }) => {
//         const validation = validateICTCriteriaFormat(tenderData);
//         setValidationResults(validation);
        
//         if (!validation.isValid) {
//           console.warn('Tender data validation issues:', validation);
//         }
//       });
//     }
//   }, [tenderData, templateType]);

//   const handleDownloadPDF = async () => {
//     setIsPdfLoading(true);
    
//     try {
//       const name = candidateName || tenderData?.candidateDetails?.name || 'ICT_Criteria_Statement';
//       const sanitizedName = name
//         .replace(/[^a-zA-Z0-9\s]/g, '')
//         .replace(/\s+/g, '_')
//         .trim();
//       const filename = `${sanitizedName}_ICT_Criteria_Statement.pdf`;
      
//       const options = {
//         filename: filename,
//         page: {
//           margin: 15,
//           format: 'a4',
//           orientation: 'portrait',
//         },
//         canvas: {
//           mimeType: 'image/png',
//           qualityRatio: 1
//         },
//         overrides: {
//           pdf: {
//             compress: true,
//             fitWindow: true,
//           },
//           canvas: {
//             useCORS: true,
//             scale: 2,
//           },
//         },
//       };
      
//       await new Promise(resolve => setTimeout(resolve, 200));
//       await generatePDF(tenderRef, options);
      
//       console.log('ICT Criteria Statement PDF generated successfully!');
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('There was an error generating the PDF. Please try again.');
//     } finally {
//       setIsPdfLoading(false);
//     }
//   };

//   if (!tenderData) {
//     return (
//       <div style={{ 
//         minHeight: '100vh', 
//         backgroundColor: '#f3f4f6',
//         padding: '2rem',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}>
//         <h2>No tender response data available</h2>
//         <button
//           onClick={onBackToResume}
//           className="mt-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
//         >
//           ← Back to Resume
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       minHeight: '100vh', 
//       backgroundColor: '#f3f4f6',
//       paddingTop: '2rem',
//       paddingBottom: '2rem'
//     }}>
//       {/* Enhanced Control Buttons */}
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         gap: '1rem',
//         marginBottom: '2rem',
//         paddingLeft: '1rem',
//         paddingRight: '1rem',
//         flexWrap: 'wrap'
//       }}>
//         {/* Back to Resume Button */}
//         <button
//           onClick={onBackToResume}
//           className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center gap-2"
//         >
//           <span>←</span>
//           Back to Tailored Resume
//         </button>
        
//         {/* Download PDF Button */}
//         <button
//           onClick={handleDownloadPDF}
//           disabled={isPdfLoading}
//           className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
//             isPdfLoading 
//               ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
//               : 'bg-green-600 text-white hover:bg-green-700'
//           }`}
//         >
//           {isPdfLoading ? (
//             <>
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               Generating PDF...
//             </>
//           ) : (
//             <>
//               <span>📄</span>
//               Download ICT Statement
//             </>
//           )}
//         </button>

//         {/* Generate New Response Button */}
//         <button
//           onClick={() => {
//             if (window.confirm('Are you sure you want to generate a new ICT Criteria Statement? This will replace the current one.')) {
//               // This would trigger regeneration - you'll need to pass this function from parent
//               console.log('Regenerate tender response requested');
//             }
//           }}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center gap-2"
//         >
//           <span>🔄</span>
//           Regenerate Statement
//         </button>
//       </div>

//       {/* Document Info Banner */}
//       <div style={{
//         maxWidth: '1012.8000488px',
//         margin: '0 auto 1rem auto',
//         padding: '1rem',
//         backgroundColor: '#e0f2fe',
//         border: '1px solid #0284c7',
//         borderRadius: '0.5rem'
//       }}>
//         <div className="flex items-center justify-between flex-wrap gap-4">
//           <div>
//             <h3 className="font-semibold text-blue-900 mb-1">
//               📋 ICT Criteria Statement Generated
//             </h3>
//             <p className="text-blue-700 text-sm">
//               Professional tender response for: <strong>{tenderData.candidateDetails?.proposedRole || 'Government ICT Role'}</strong>
//             </p>
//           </div>
//           <div className="text-right">
//             <div className="text-sm text-blue-600">
//               Candidate: <strong>{candidateName || tenderData.candidateDetails?.name}</strong>
//             </div>
//             <div className="text-xs text-blue-500">
//               Generated: {new Date().toLocaleDateString()}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Validation Results Display */}
//       {validationResults && (!validationResults.isValid || validationResults.warnings?.length > 0) && (
//         <div style={{
//           maxWidth: '1012.8000488px',
//           margin: '0 auto 1rem auto',
//           padding: '1rem',
//           backgroundColor: validationResults.isValid ? '#fef3c7' : '#fee2e2',
//           border: `1px solid ${validationResults.isValid ? '#f59e0b' : '#ef4444'}`,
//           borderRadius: '0.5rem'
//         }}>
//           <h3 style={{ 
//             margin: '0 0 0.5rem 0', 
//             color: validationResults.isValid ? '#92400e' : '#dc2626',
//             fontSize: '1rem',
//             fontWeight: '600'
//           }}>
//             {validationResults.isValid ? '⚠️ Quality Warnings' : '❌ Validation Issues'}
//           </h3>
//           <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
//             {validationResults.missingElements?.map((issue, index) => (
//               <li key={`error-${index}`} style={{ color: '#dc2626', marginBottom: '0.25rem' }}>
//                 {issue}
//               </li>
//             ))}
//             {validationResults.warnings?.map((warning, index) => (
//               <li key={`warning-${index}`} style={{ color: '#92400e', marginBottom: '0.25rem' }}>
//                 {warning}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Tender Response Content */}
//       <div style={{
//         maxWidth: '1012.8000488px',
//         margin: '0 auto',
//         backgroundColor: '#ffffff',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         borderRadius: '0.5rem',
//         overflow: 'hidden'
//       }}>
//         <div ref={tenderRef}>
//           <TenderResponseNew tenderData={tenderData} />
//         </div>
//       </div>

      
//     </div>
//   );
// };

// export default TenderResponseWrapper;

import { useRef, useState } from 'react';
import generatePDF from 'react-to-pdf';
import TenderResponseNew from './TenderResponseNew';

const TenderResponseWrapper = ({ 
  tenderData, 
  candidateName, 
  onBackToResume, 
  templateType = "criteria-statement",
  // New props for regeneration
  onRegenerateTenderResponse = null,
  isRegenerating = false,
  detectedSector = 'Government'
}) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const tenderRef = useRef();

  // Validate the tender data on component mount
  useState(() => {
    if (tenderData && templateType === "criteria-statement") {
      import('@/pages/api/geminiApi').then(({ validateTenderResponseFormat }) => {
        const validation = validateTenderResponseFormat(tenderData);
        setValidationResults(validation);
        
        if (!validation.isValid) {
          console.warn('Tender data validation issues:', validation);
        }
      });
    }
  }, [tenderData, templateType]);

  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    
    try {
      const name = candidateName || tenderData?.candidateDetails?.name || 'Criteria_Statement';
      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      const filename = `${sanitizedName}_${detectedSector}_Criteria_Statement.pdf`;
      
      const options = {
        filename: filename,
        page: {
          margin: 15,
          format: 'a4',
          orientation: 'portrait',
        },
        canvas: {
          mimeType: 'image/png',
          qualityRatio: 1
        },
        overrides: {
          pdf: {
            compress: true,
            fitWindow: true,
          },
          canvas: {
            useCORS: true,
            scale: 2,
          },
        },
      };
      
      await new Promise(resolve => setTimeout(resolve, 200));
      await generatePDF(tenderRef, options);
      
      console.log(`${detectedSector} Criteria Statement PDF generated successfully!`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleRegenerateClick = () => {
    const sectorText = detectedSector === 'Government' ? 'Criteria Statement' : `${detectedSector} Criteria Statement`;
    
    if (window.confirm(`Are you sure you want to generate a new ${sectorText}? This will replace the current one.`)) {
      if (onRegenerateTenderResponse) {
        onRegenerateTenderResponse();
      } else {
        console.warn('No regeneration handler provided');
      }
    }
  };

  if (!tenderData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2>No tender response data available</h2>
        <button
          onClick={onBackToResume}
          className="mt-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
        >
          ← Back to Resume
        </button>
      </div>
    );
  }

  // Show loading overlay if regenerating
  if (isRegenerating) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Regenerating {detectedSector} Criteria Statement
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we generate a new response based on your tailored resume...
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> The new response will use the latest analysis of your resume and job requirements.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      {/* Enhanced Control Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Back to Resume Button */}
        <button
          onClick={onBackToResume}
          disabled={isRegenerating}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>←</span>
          Back to Tailored Resume
        </button>
        
        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isPdfLoading || isRegenerating}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
            isPdfLoading || isRegenerating
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isPdfLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <span>📄</span>
              Download {detectedSector} Statement
            </>
          )}
        </button>

        {/* Regenerate Response Button */}
        <button
          onClick={handleRegenerateClick}
          disabled={isRegenerating || !onRegenerateTenderResponse}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
            isRegenerating || !onRegenerateTenderResponse
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRegenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Regenerating...
            </>
          ) : (
            <>
              <span>🔄</span>
              Regenerate Statement
            </>
          )}
        </button>
      </div>

      {/* Document Info Banner */}
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
              📋 {detectedSector} Criteria Statement Generated
            </h3>
            <p className="text-blue-700 text-sm">
              Professional tender response for: <strong>{tenderData.candidateDetails?.proposedRole || `${detectedSector} Government Role`}</strong>
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-600">
              Candidate: <strong>{candidateName || tenderData.candidateDetails?.name}</strong>
            </div>
            <div className="text-xs text-blue-500">
              Generated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Results Display
      {validationResults && (!validationResults.isValid || validationResults.warnings?.length > 0) && (
        <div style={{
          maxWidth: '1012.8000488px',
          margin: '0 auto 1rem auto',
          padding: '1rem',
          backgroundColor: validationResults.isValid ? '#fef3c7' : '#fee2e2',
          border: `1px solid ${validationResults.isValid ? '#f59e0b' : '#ef4444'}`,
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ 
            margin: '0 0 0.5rem 0', 
            color: validationResults.isValid ? '#92400e' : '#dc2626',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            {validationResults.isValid ? '⚠️ Quality Warnings' : '❌ Validation Issues'}
          </h3>
          <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
            {validationResults.missingElements?.map((issue, index) => (
              <li key={`error-${index}`} style={{ color: '#dc2626', marginBottom: '0.25rem' }}>
                {issue}
              </li>
            ))}
            {validationResults.warnings?.map((warning, index) => (
              <li key={`warning-${index}`} style={{ color: '#92400e', marginBottom: '0.25rem' }}>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )} */}

      {/* Tender Response Content */}
      <div style={{
        maxWidth: '1012.8000488px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div ref={tenderRef}>
          <TenderResponseNew tenderData={tenderData} />
        </div>
      </div>
    </div>
  );
};

export default TenderResponseWrapper;