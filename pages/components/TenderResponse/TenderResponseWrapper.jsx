import { useRef, useState } from 'react';
import generatePDF from 'react-to-pdf';
import TenderResponse from './TenderResponse';

const TenderResponseWrapper = ({ tenderData, candidateName, onBackToResume }) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const tenderRef = useRef();

  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    
    try {
      // Get candidate name for the filename
      const name = candidateName || tenderData?.candidateDetails?.name || 'Tender_Response';
      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      const filename = `${sanitizedName}_Tender_Response.pdf`;
      
      // PDF generation options
      const options = {
        filename: filename,
        page: {
          margin: 20,
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
      
      // Wait for a brief moment to ensure all styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate the PDF from the tender reference
      await generatePDF(tenderRef, options);
      
      console.log('Tender response PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsPdfLoading(false);
    }
  };
  
  // Check if tenderData exists
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
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            marginTop: '1rem'
          }}
        >
          ← Back to Resume
        </button>
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
      {/* Control Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        paddingLeft: '1rem',
        paddingRight: '1rem'
      }}>
        <button
          onClick={onBackToResume}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Resume
        </button>
        
        <button
          onClick={handleDownloadPDF}
          disabled={isPdfLoading}
          style={{
            backgroundColor: isPdfLoading ? '#9ca3af' : '#059669',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: isPdfLoading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isPdfLoading ? (
            <>
              <div style={{
                width: '1rem',
                height: '1rem',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Generating PDF...
            </>
          ) : (
            <>📄 Download PDF</>
          )}
        </button>
      </div>

      {/* Tender Response Content with Shadow */}
      <div style={{
        maxWidth: '1512.8000488px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div ref={tenderRef}>
          <TenderResponse tenderData={tenderData} />
        </div>
      </div>

      {/* Add CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TenderResponseWrapper;