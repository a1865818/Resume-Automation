
const BackButton = ({ onBackToSummary, isHistoryView }) => {
  if (!isHistoryView) return null;

  return (
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
  );
};

export default BackButton;