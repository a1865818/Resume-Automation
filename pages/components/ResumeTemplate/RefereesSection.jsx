
const RefereesSection = ({ resumeData }) => {
  return (
    <div>

      <div>
        {resumeData.referees && resumeData.referees.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resumeData.referees.map((referee, index) => (
              <div key={index} style={{ fontSize: '14px' }}>
                <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
                  {referee.title}
                </p>
                <p style={{ color: '#374151', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
                  N: {referee.name}
                </p>
                <p style={{ color: '#374151', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
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