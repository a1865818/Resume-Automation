
const EssentialCriteria = ({ criteria }) => {
  if (!criteria || criteria.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem',
        borderBottom: '2px solid #f3f4f6',
        paddingBottom: '0.5rem'
      }}>
        Essential Criteria
      </h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ 
              padding: '0.75rem', 
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              textAlign: 'left',
              width: '25%'
            }}>
              RFQTS
            </th>
            <th style={{ 
              padding: '0.75rem', 
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              textAlign: 'left'
            }}>
              Response
            </th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((item, index) => (
            <tr key={index}>
              <td style={{ 
                padding: '0.75rem', 
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                fontWeight: '500',
                verticalAlign: 'top'
              }}>
                {item.requirement || `[Essential Requirement ${index + 1}]`}
              </td>
              <td style={{ 
                padding: '0.75rem', 
                border: '1px solid #e5e7eb',
                lineHeight: '1.5'
              }}>
                {item.response || 'No response provided'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EssentialCriteria;