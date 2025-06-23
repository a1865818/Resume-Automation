import { useRef, useState } from 'react';
import generatePDF from 'react-to-pdf';
import ProposalSummary from './ProposalSummary';
import ProposalSummaryWordCompatible from './ProposalSummaryWordCompatible';

const ProposalSummaryWrapper = ({ 
  proposalData, 
  candidateName, 
  onBackToTenderResponse, 
  onRegenerateProposalSummary = null,
  isRegenerating = false,
  detectedSector = 'Government'
}) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isWordLoading, setIsWordLoading] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const proposalRef = useRef();
  const wordProposalRef = useRef();

  // Enhanced validation for proposal summary
  const validateProposalData = (data) => {
    if (!data) return { isValid: false, errors: ['No proposal data provided'] };
    
    const errors = [];
    const warnings = [];

    // Check for required sections
    if (!data.candidateDetails) {
      errors.push('Missing candidate details');
    }

    if (!data.proposalSummary || !data.proposalSummary.content) {
      errors.push('Missing proposal summary content');
    }

    // Validate proposal summary length
    if (data.proposalSummary && data.proposalSummary.content) {
      const wordCount = data.proposalSummary.content.split(/\s+/).length;
      if (wordCount < 180) {
        warnings.push('Proposal summary may be too short (less than 180 words)');
      } else if (wordCount > 280) {
        warnings.push('Proposal summary may be too long (more than 280 words)');
      }
    }

    // Validate key highlights
    if (!data.keyHighlights || data.keyHighlights.length === 0) {
      warnings.push('No key highlights provided');
    }

    // Validate value proposition
    if (!data.valueProposition || !data.valueProposition.content) {
      warnings.push('Missing value proposition');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sections: {
        summary: !!data.proposalSummary?.content,
        highlights: data.keyHighlights?.length || 0,
        valueProposition: !!data.valueProposition?.content
      }
    };
  };

  // Validate proposal data on load
  useState(() => {
    if (proposalData) {
      const validation = validateProposalData(proposalData);
      setValidationResults(validation);
      
      if (!validation.isValid) {
        console.warn('Proposal data validation issues:', validation.errors);
      }
    }
  }, [proposalData]);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    
    try {
      const name = candidateName || proposalData?.candidateDetails?.name || 'Proposal_Summary';
      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      
      // Enhanced filename with RFQ info if available
      const filename = `${sanitizedName}_${detectedSector}_Proposal_Summary.pdf`;
      
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
      await generatePDF(proposalRef, options);
      
      console.log(`${detectedSector} Proposal Summary PDF generated successfully!`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Handle Word download with enhanced metadata
  const handleDownloadWord = async () => {
    setIsWordLoading(true);
    
    try {
      const name = candidateName || proposalData?.candidateDetails?.name || 'Proposal_Summary';
      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      
      // Enhanced filename
      const filename = `${sanitizedName}_${detectedSector}_Proposal_Summary.doc`;
      
      // Clone the HTML content to avoid modifying the original DOM
      const contentDiv = wordProposalRef.current.cloneNode(true);
      
      // Find all images in the content
      const images = contentDiv.querySelectorAll('img');
      
      // Convert each image to base64
      await Promise.all(Array.from(images).map(async (img) => {
        if (img.src.startsWith('data:')) return;
        
        try {
          const response = await fetch(img.src);
          const blob = await response.blob();
          
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              img.src = reader.result;
              resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.warn('Failed to convert image to base64:', err);
        }
      }));
      
      const htmlContent = contentDiv.innerHTML;
      
      // Enhanced Word-compatible HTML with metadata
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${detectedSector} Proposal Summary - ${name}</title>
          <meta name="description" content="Government tender proposal summary generated by PappsPM">
          <meta name="keywords" content="${detectedSector}, proposal, summary, government, RFQ">
          <meta name="author" content="PappsPM">
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
              line-height: 1.4;
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
              font-weight: bold;
              border-bottom: 2px solid #4ECDC4;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .content {
              text-align: justify;
              line-height: 1.7;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;
      
      const blob = new Blob(['\ufeff', wordHtml], {
        type: 'application/msword'
      });
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      
      console.log(`${detectedSector} Proposal Summary Word document generated successfully!`);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('There was an error generating the Word document. Please try again.');
    } finally {
      setIsWordLoading(false);
    }
  };

  const handleRegenerateClick = () => {
    const sectorText = detectedSector === 'Government' ? 'Proposal Summary' : `${detectedSector} Proposal Summary`;
    
    if (window.confirm(`Are you sure you want to generate a new ${sectorText}? This will replace the current one.`)) {
      if (onRegenerateProposalSummary) {
        onRegenerateProposalSummary();
      } else {
        console.warn('No regeneration handler provided');
      }
    }
  };

  if (!proposalData) {
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
        <h2>No proposal summary data available</h2>
        <button
          onClick={onBackToTenderResponse}
          className="mt-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
        >
          ← Back to Criteria Statement
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
            Regenerating {detectedSector} Proposal Summary
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we generate a new proposal summary based on your criteria statement...
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> The new proposal summary will synthesize your criteria statement into a compelling narrative format.
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
        {/* Back to Criteria Statement Button */}
        <button
          onClick={onBackToTenderResponse}
          disabled={isRegenerating}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>←</span>
          Back to Criteria Statement
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

        {/* Regenerate Proposal Summary Button */}
        <button
          onClick={handleRegenerateClick}
          disabled={isRegenerating || !onRegenerateProposalSummary}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
            isRegenerating || !onRegenerateProposalSummary
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
              Regenerate Summary
            </>
          )}
        </button>
      </div>

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
              📋 {detectedSector} Proposal Summary Generated
            </h3>
            <p className="text-blue-700 text-sm">
              Narrative proposal summary for: <strong>{proposalData.candidateDetails?.proposedRole || `${detectedSector} Government Role`}</strong>
            </p>
            {validationResults && (
              <div className="text-xs mt-2">
                <span className="text-green-600">
                  ✅ Summary: {validationResults.sections?.summary ? 'Complete' : 'Missing'} | 
                  Highlights: {validationResults.sections?.highlights || 0} | 
                  Value Prop: {validationResults.sections?.valueProposition ? 'Complete' : 'Missing'}
                </span>
                {validationResults.warnings?.length > 0 && (
                  <span className="text-yellow-600 ml-2">
                    ⚠️ {validationResults.warnings.length} warnings
                  </span>
                )}
              </div>
            )}
            <p className="text-blue-600 text-xs mt-1">
              ✨ <strong>Narrative Format:</strong> 200-250 word flowing summary instead of table format!
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-600">
              Candidate: <strong>{candidateName || proposalData.candidateDetails?.name}</strong>
            </div>
            <div className="text-xs text-blue-500">
              Generated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Display proposal summary for PDF generation */}
      <div style={{
        maxWidth: '1012.8000488px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div ref={proposalRef}>
          <ProposalSummary proposalData={proposalData} />
        </div>
      </div>

      {/* Hidden Word-compatible version for Word document generation */}
      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px',
        width: '1012px'
      }}>
        <div ref={wordProposalRef}>
          <ProposalSummaryWordCompatible proposalData={proposalData} />
        </div>
      </div>
    </div>
  );
};

export default ProposalSummaryWrapper;