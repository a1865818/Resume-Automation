// components/ControlButtons.jsx

const ControlButtons = ({
  handleDownloadPDF,
  isPdfLoading,
  setShowPdfSettings,
  remeasureResume,
  onBackToSummary
}) => {
  return (
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
  );
};

export default ControlButtons;