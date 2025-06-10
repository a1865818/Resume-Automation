
const ExperienceItem = ({ exp }) => (
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
      <div style={{ 
        marginLeft: '0.25rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.25rem'
      }}>
        {exp.responsibilities.map((resp, respIndex) => (
          <div key={respIndex} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ 
              color: '#1e293b', 
              marginRight: '0.5rem', 
              marginTop: '0.125rem', 
              fontSize: '0.875rem' 
            }}>•</span>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#374151', 
              lineHeight: '1.625', 
              margin: 0 
            }}>
              {resp}
            </p>
          </div>
        ))}
       
      </div>
    </div>
  );
  
  export default ExperienceItem;