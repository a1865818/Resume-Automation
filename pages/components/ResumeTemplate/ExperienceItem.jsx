
const ExperienceItem = ({ exp }) => {
    // Don't render anything if there are no responsibilities
    if (!exp.responsibilities || exp.responsibilities.length === 0) {
      return null;
    }
  
    return (
      <div style={{ marginBottom: '1.5rem' }}>
     
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ 
              fontWeight: 'bold', 
              color: '#1e293b', 
              fontSize: '0.875rem', 
              lineHeight: '1.25', 
              marginBottom: '0.25rem',
              margin: '0 0 0.25rem 0'
            }}>
              {exp.title}
            </h3>
            {/* Only show period for original items or first parts, not continued parts */}
            {(!exp.isSecondPart) && (
              <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                {exp.period}
              </p>
            )}
          </div>
        </div>
            {/* Custom timeline with inline styling only */}
            <div style={{ marginLeft: '0.25rem', position: 'relative' }}>
          {exp.responsibilities.map((resp, respIndex) => (
            <div key={respIndex} style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              marginBottom: respIndex === exp.responsibilities.length - 1 ? 0 : '1rem',
              position: 'relative'
            }}>
              {/* Black dot */}
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#000000',
                borderRadius: '50%',
                marginRight: '12px',
                marginTop: '6px',
                flexShrink: 0,
                zIndex: 2,
                position: 'relative'
              }} />
              
              {/* Connecting line (except for last item) */}
              {respIndex < exp.responsibilities.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '3px',
                  top: '14px',
                  width: '2px',
                  height: 'calc(100% + 1rem)',
                  backgroundColor: '#000000',
                  zIndex: 1
                }} />
              )}
              
              {/* Content */}
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'black', 
                lineHeight: '1.25', 
                margin: 0,
                flex: 1,
                
              }}>
                {resp}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default ExperienceItem;