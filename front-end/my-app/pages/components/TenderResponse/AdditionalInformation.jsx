
const AdditionalInformation = ({ information }) => {
  if (!information || information.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem',
        borderBottom: '2px solid #f3f4f6',
        paddingBottom: '0.5rem'
      }}>
        Additional Information
      </h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {information.map((item, index) => (
            <tr key={index}>
              <td style={{ 
                padding: '0.75rem', 
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                fontWeight: '500',
                width: '25%',
                verticalAlign: 'top'
              }}>
                {item.requirement || `Additional Information ${index + 1}`}
              </td>
              <td style={{ 
                padding: '0.75rem', 
                border: '1px solid #e5e7eb',
                lineHeight: '1.5'
              }}>
                {item.response || 'No information provided'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdditionalInformation;