
const KeyAchievementsSection = ({ resumeData }) => {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem', 
      borderTop: '1px solid #d1d5db', 
      color: 'black' 
    }}>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem', 
        letterSpacing: '0.05em',
      }}>
        KEY CAREER ACHIEVEMENTS
      </h2>
      <ul style={{ display: 'flex', flexDirection: 'column', listStyle: 'none', padding: 0, margin: 0 }}>
        {resumeData.keyAchievements && resumeData.keyAchievements.length > 0 ? (
          resumeData.keyAchievements.map((achievement, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.75rem', marginTop: '0.125rem' }}>•</span>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.625', margin: 0 }}>
                {achievement}
              </p>
            </li>
          ))
        ) : (
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '0.75rem', marginTop: '0.125rem' }}>•</span>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.625', margin: 0, fontStyle: 'italic', color: '#6B7280' }}>
              Information not available.
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default KeyAchievementsSection;