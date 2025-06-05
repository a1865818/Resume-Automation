
const DimensionsDisplay = ({ resumeDimensions, pageHeight }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '1rem',
      gap: '20px'
    }}>
      {resumeDimensions.width > 0 && (
        <div style={{ 
          fontSize: '14px',
          color: '#6B7280',
          backgroundColor: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          📐 Resume Dimensions: {resumeDimensions.width}mm × {resumeDimensions.height}mm
        </div>
      )}
      
      {pageHeight && (
        <div style={{ 
          fontSize: '14px',
          color: '#059669',
          backgroundColor: '#f0fdf4',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #bbf7d0'
        }}>
          📏 Consistent Page Height: {Math.round(pageHeight)}px ({Math.round((pageHeight * 25.4) / 96)}mm)
        </div>
      )}
    </div>
  );
};

export default DimensionsDisplay;