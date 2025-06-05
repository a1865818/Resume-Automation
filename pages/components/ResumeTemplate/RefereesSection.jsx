
const RefereesSection = ({ resumeData }) => {
  return (
    <div>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 'bold', 
        color: '#1e293b', 
        letterSpacing: '0.05em',
        margin: 0
      }}>
        REFEREES
      </h2>
      <div>
        {resumeData.referees && resumeData.referees.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {resumeData.referees.map((referee, index) => (
              <div key={index} style={{ fontSize: '14px', minWidth: '200px' }}>
                <p style={{ fontWeight: '600', color: '#1e293b', margin: '0 0 0.25rem 0' }}>
                  T: {referee.title}
                </p>
                <p style={{ color: '#374151', margin: '0 0 0.25rem 0' }}>
                  N: {referee.name}
                </p>
                <p style={{ color: '#374151', margin: '0 0 0.25rem 0' }}>
                  E: {referee.email}
                </p>
                <p style={{ color: '#374151', margin: 0 }}>
                  M: {referee.phone}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '14px', color: '#374151', fontStyle: 'italic', marginTop: '0.5rem' }}>
            Available upon request
          </div>
        )}
      </div>
    </div>
  );
};

export default RefereesSection;