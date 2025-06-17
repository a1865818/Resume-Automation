
// Table-based ExperienceHeader component
const ExperienceHeaderTable = ({ exp, content }) => {
    console.log('Rendering ExperienceHeader:', { exp, content });
    return (
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginBottom: '0.5rem',
        border: '1px solid green',
        padding: '4px'
      }}>
        <tbody>
          <tr>
            <td style={{ fontSize: '10px', color: 'green' }}>HEADER</td>
          </tr>
          <tr>
            <td style={{ paddingBottom: '0.25rem' }}>
              <h3 style={{ 
                fontWeight: 'bold', 
                color: '#1e293b', 
                fontSize: '0.875rem', 
                lineHeight: '1.2', 
                marginBottom: '0.25rem',
                margin: '0 0 0.25rem 0'
              }}>
                {content.title}
              </h3>
              {content.company && (
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  margin: '0 0 0.125rem 0',
                  fontStyle: 'italic'
                }}>
                  {content.company}
                </p>
              )}
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#4b5563', 
                margin: 0,
                lineHeight: '1.2'
              }}>
                {content.period}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  export default ExperienceHeaderTable;