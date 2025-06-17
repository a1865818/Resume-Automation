
// Table-based ExperienceBullet component
const ExperienceBulletTable = ({ content, expIndex, respIndex }) => {
    console.log('Rendering ExperienceBullet:', { content, expIndex, respIndex });
    return (
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginLeft: '0.25rem', 
        marginBottom: '0.25rem',
        border: '1px solid orange',
        padding: '2px'
      }}>
        <colgroup>
          <col style={{ width: 'auto' }} />
          <col style={{ width: '0.5rem' }} />
          <col style={{ width: '100%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td style={{ fontSize: '10px', color: 'orange', paddingRight: '4px', verticalAlign: 'top' }}>
              BULLET
            </td>
            <td style={{ 
              color: '#1e293b', 
              fontSize: '0.875rem',
              lineHeight: '1.25',
              verticalAlign: 'top',
              textAlign: 'center'
            }}>
              •
            </td>
            <td style={{ verticalAlign: 'top' }}>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#374151', 
                lineHeight: '1.25', 
                margin: 0 
              }}>
                {content.text}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  
export default ExperienceBulletTable;