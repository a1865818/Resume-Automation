
const ProfileSection = ({ resumeData }) => {
  return (
    <div style={{ backgroundColor: '#1e293b', color: 'white' }}>
      {/* Profile Photo */}
      <div>
        {resumeData.profile.photo && resumeData.profile.photo !== "/api/placeholder/400/600" ? (
          <img
            src={resumeData.profile.photo}
            alt={`${resumeData.profile.name} profile`}
            style={{ 
              width: '100%', 
              height: '15rem', 
              objectFit: 'cover',
              backgroundColor: '#374151'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          style={{ 
            width: '100%', 
            height: '15rem', 
            backgroundColor: '#374151',
            display: resumeData.profile.photo && resumeData.profile.photo !== "/api/placeholder/400/600" ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            color: '#9CA3AF'
          }}
        >
          Photo Placeholder
        </div>
      </div>
      
      <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Name and Title */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            margin: 0
          }}>
            {resumeData.profile.name.split(' ')[0]}
          </h1>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            marginBottom: '0.75rem',
            margin: '0 0 0.75rem 0'
          }}>
            {resumeData.profile.name.split(' ')[1]}
          </h1>
          <div style={{ 
            color: '#fbbf24', 
            fontSize: '0.75rem', 
            fontWeight: 'bold', 
            marginBottom: '0.25rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em' 
          }}>
            {resumeData.profile.title}
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#d1d5db', 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase' 
          }}>
            {resumeData.profile.location}
            {resumeData.profile.clearance && resumeData.profile.clearance !== 'NONE' && ` | ${resumeData.profile.clearance}`}
          </div>
        </div>

        {/* Qualifications */}
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            color: '#fbbf24', 
            letterSpacing: '0.05em',
          }}>
            QUALIFICATIONS
          </h2>
          <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
            {resumeData.qualifications.map((qual, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                <span style={{ lineHeight: '1.625' }}>{qual}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Affiliations */}
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            color: '#fbbf24', 
            letterSpacing: '0.05em',
          }}>
            AFFILIATIONS
          </h2>
          <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
            {resumeData.affiliations.map((affiliation, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                <span style={{ lineHeight: '1.625' }}>{affiliation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills */}
        <div>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            color: '#fbbf24', 
            letterSpacing: '0.05em',
          }}>
            SKILLS
          </h2>
          <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
            {resumeData.skills.map((skill, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                <span style={{ lineHeight: '1.625' }}>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;