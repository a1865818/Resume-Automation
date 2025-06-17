
  // Table-based ExperienceItem component
  const ExperienceItemTable = ({ exp }) => {
    if (!exp.responsibilities || exp.responsibilities.length === 0) {
      return null;
    }
  
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {/* Header row */}
            <tr>
              <td style={{ paddingBottom: '0.75rem', verticalAlign: 'top' }}>
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
                {(!exp.isSecondPart) && (
                  <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                    {exp.period}
                  </p>
                )}
              </td>
            </tr>
            
            {/* Responsibilities */}
            {exp.responsibilities.map((resp, respIndex) => (
              <tr key={respIndex}>
                <td style={{ 
                  paddingLeft: '0.25rem',
                  paddingBottom: respIndex === exp.responsibilities.length - 1 ? 0 : '1rem',
                  position: 'relative'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ 
                          width: '20px',
                          verticalAlign: 'top',
                          paddingTop: '6px',
                          position: 'relative'
                        }}>
                          {/* Black dot */}
                          <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#000000',
                            borderRadius: '50%',
                            position: 'relative',
                            zIndex: 2
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
                        </td>
                        
                        <td style={{ 
                          paddingLeft: '12px',
                          verticalAlign: 'top'
                        }}>
                          <p style={{ 
                            fontSize: '0.875rem', 
                            color: 'black', 
                            lineHeight: '1.25', 
                            margin: 0
                          }}>
                            {resp}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

    export default ExperienceItemTable;