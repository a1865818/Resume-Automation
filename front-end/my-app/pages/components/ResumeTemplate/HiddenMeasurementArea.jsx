
const HiddenMeasurementArea = ({ experienceLayout, fullExperience }) => {
    if (experienceLayout !== 'paginated' || !fullExperience?.length) {
      return null;
    }
  
    return (
      <div style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        visibility: 'hidden',
        pointerEvents: 'none',
        // Use exact column width calculation
        width: 'calc((100% - 4rem) / 2)', // Account for padding and gap
        maxWidth: '650px', // Set reasonable max width
        fontFamily: 'Montserrat',
        fontSize: '0.875rem',
        lineHeight: '1.125'
      }}>
        {fullExperience.map((exp, expIndex) => {
          if (!exp.responsibilities || exp.responsibilities.length === 0) {
            return null;
          }
  
          return (
            <div key={expIndex}>
              {/* Measure header (title + period) - EXACT match to ExperienceHeader */}
              <div 
                id={`exp-header-${expIndex}`}
                style={{ 
                  marginBottom: '0.5rem', // Match ExperienceHeader marginBottom exactly
                  padding: '4px' // CRITICAL: Match actual component padding
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <div>
                    <h3 style={{ 
                      fontWeight: 'bold', 
                      color: '#1e293b', 
                      fontSize: '0.875rem', 
                      lineHeight: '1.2', // Different line height for headers
                      marginBottom: '0.25rem',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {exp.title}
                    </h3>
                    {exp.company && (
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        margin: '0 0 0.125rem 0',
                        fontStyle: 'italic',
                        lineHeight: '1.2'
                      }}>
                        {exp.company}
                      </p>
                    )}
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#4b5563', 
                      margin: 0,
                      lineHeight: '1.2' // Header line height
                    }}>
                      {exp.period}
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Measure each responsibility bullet - EXACT match to ExperienceBullet */}
              {exp.responsibilities.map((resp, respIndex) => (
                <div 
                  key={respIndex}
                  id={`exp-bullet-${expIndex}-${respIndex}`}
                  style={{ 
                    marginLeft: '0.25rem', 
                    marginBottom: '0.25rem', // Match ExperienceBullet marginBottom exactly
                    display: 'flex', 
                    alignItems: 'flex-start',
                    padding: '2px' // CRITICAL: Match actual component padding
                  }}
                >
                  <span style={{ 
                    color: '#1e293b', 
                    marginRight: '0.5rem', 
                    fontSize: '0.875rem',
                    lineHeight: '1.25' // Match actual component line height
                  }}>•</span>
                  <p style={{ 
                    fontSize: '0.885rem', // Match actual component font size
                    color: '#374151', 
                    lineHeight: '1.25', // Match actual component line height - CRITICAL
                    margin: 0,
                    flex: 1, // Ensure text takes available width for proper wrapping
                    wordBreak: 'break-word' // Handle long words
                  }}>
                    {resp}
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };
  
  export default HiddenMeasurementArea;