import { useRef, useState } from 'react';
import generatePDF from 'react-to-pdf';
import TenderResponseNew from './TenderResponseNew';
import TenderResponseWordCompatible from './TenderResponseWordCompatible';

const TenderResponseWrapperWithWord = ({ 
  tenderData, 
  candidateName, 
  onBackToResume, 
  templateType = "criteria-statement",
  onRegenerateTenderResponse = null,
  isRegenerating = false,
  detectedSector = 'Government'
}) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isWordLoading, setIsWordLoading] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const tenderRef = useRef();
  const wordTenderRef = useRef();

   // Convert image to base64
   const convertImageToBase64 = (imageSrc) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        try {
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  };

  // Handle PDF download (existing functionality)
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

 // Replace the handleDownloadWord and handleDownloadWordSimple functions with this version
 const handleDownloadWord = async () => {
    setIsWordLoading(true);
    
    try {
      const name = candidateName || tenderData?.candidateDetails?.name || 'Criteria_Statement';
      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      const filename = `${sanitizedName}_${detectedSector}_Criteria_Statement.doc`;
      
      // Clone the HTML content to avoid modifying the original DOM
      const contentDiv = wordTenderRef.current.cloneNode(true);
      
      // Find all images in the content
      const images = contentDiv.querySelectorAll('img');
      
      // Convert each image to base64
      await Promise.all(Array.from(images).map(async (img) => {
        // Skip images that are already data URLs
        if (img.src.startsWith('data:')) return;
        
        try {
          // Fetch the image and convert to base64
          const response = await fetch(img.src);
          const blob = await response.blob();
          
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              img.src = reader.result; // Replace src with base64 data
              resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.warn('Failed to convert image to base64:', err);
          // Keep the original src if conversion fails
        }
      }));
      
      // Get the updated HTML content with base64 images
      const htmlContent = contentDiv.innerHTML;
      
      // Create a Word-compatible HTML document
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${detectedSector} Criteria Statement</title>
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
            @page {
              margin: 1in;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.3;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            td, th {
              border: 1px solid black;
              padding: 8px;
              vertical-align: top;
            }
            .header {
              text-align: center;
              font-weight: bold;
              font-size: 18pt;
              margin-bottom: 12pt;
            }
            .candidate-name {
              text-align: center;
              font-weight: bold;
              font-size: 14pt;
              margin: 12pt 0;
            }
            .section-header {
              background-color: #e0e0e0;
              font-weight: bold;
              text-align: left;
            }
            .criteria-cell {
              background-color: #f9f9f9;
              font-weight: bold;
              width: 25%;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;
      
      // Create blob with Word MIME type
      const blob = new Blob(['\ufeff', wordHtml], {
        type: 'application/msword'
      });
      
      // Create download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL
      window.URL.revokeObjectURL(link.href);
      
      console.log(`${detectedSector} Criteria Statement Word document generated successfully!`);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('There was an error generating the Word document. Please try again.');
    } finally {
      setIsWordLoading(false);
    }
  };

  // Alternative Word download method using simple HTML export
  const handleDownloadWordSimple = () => {
    setIsWordLoading(true);
    
    try {
      const name = candidateName || tenderData?.candidateDetails?.name || 'Criteria_Statement';
      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      const filename = `${sanitizedName}_${detectedSector}_Criteria_Statement.doc`;
      
      // Get the HTML content
      const htmlContent = wordTenderRef.current.innerHTML;
      
      // Create a simple Word-compatible HTML document
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${detectedSector} Criteria Statement</title>
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
            @page {
              margin: 1in;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.3;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            td, th {
              border: 1px solid black;
              padding: 8px;
              vertical-align: top;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;
      
      // Create blob with Word MIME type
      const blob = new Blob(['\ufeff', wordHtml], {
        type: 'application/msword'
      });
      
      // Create download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL
      window.URL.revokeObjectURL(link.href);
      
      console.log(`${detectedSector} Criteria Statement Word document (HTML format) generated successfully!`);
    } catch (error) {
      console.error('Error generating simple Word document:', error);
      alert('There was an error generating the Word document. Please try again.');
    } finally {
      setIsWordLoading(false);
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
              Download PDF
            </>
          )}
        </button>

        {/* Download Word Button */}
        <button
          onClick={handleDownloadWord}
          disabled={isWordLoading || isRegenerating}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
            isWordLoading || isRegenerating
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isWordLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Word...
            </>
          ) : (
            <>
              <span>📝</span>
              Download Word (.docx)
            </>
          )}
        </button>

        {/* Alternative Simple Word Button */}
        <button
          onClick={handleDownloadWordSimple}
          disabled={isWordLoading || isRegenerating}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
            isWordLoading || isRegenerating
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isWordLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Word...
            </>
          ) : (
            <>
              <span>📄</span>
              Download Word (.doc)
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
              : 'bg-orange-600 text-white hover:bg-orange-700'
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
            <p className="text-blue-600 text-xs mt-1">
              ✨ <strong>New:</strong> Now available in both PDF and Word formats!
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

      {/* Display tender response for PDF generation */}
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

      {/* Hidden Word-compatible version for Word document generation */}
      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px',
        width: '1012px'
      }}>
        <div ref={wordTenderRef}>
          <TenderResponseWordCompatible tenderData={tenderData} />
        </div>
      </div>
    </div>
  );
};

export default TenderResponseWrapperWithWord;