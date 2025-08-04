const CandidateDetails = ({ candidateDetails }) => {
  if (!candidateDetails) return null;

  const { name, proposedRole, clearance, availability } = candidateDetails;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem',
        borderBottom: '2px solid #f3f4f6',
        paddingBottom: '0.5rem'
      }}>
        Candidate Details
      </h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ 
              padding: '0.75rem', 
              border: '1px solid #e5e7eb',
              width: '25%', 
              backgroundColor: '#f9fafb',
              fontWeight: '500'
            }}>
              Candidate Name
            </td>
            <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
              {name || 'Not specified'}
            </td>
          </tr>
          <tr>
            <td style={{ 
              padding: '0.75rem', 
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              fontWeight: '500'
            }}>
              Proposed Role
            </td>
            <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
              {proposedRole || 'Not specified'}
            </td>
          </tr>
          <tr>
            <td style={{ 
              padding: '0.75rem', 
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              fontWeight: '500'
            }}>
              Clearance
            </td>
            <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
              {clearance || 'Not specified'}
            </td>
          </tr>
          <tr>
            <td style={{ 
              padding: '0.75rem', 
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              fontWeight: '500'
            }}>
              Availability
            </td>
            <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
              {availability || 'Not specified'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CandidateDetails;