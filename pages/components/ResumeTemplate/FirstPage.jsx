// import PappsPMLogo from '@/public/PappspmLogo.jpeg';
import ContactSection from './ContactSection';
import ExperienceItem from './ExperienceItem';
import KeyAchievementsSection from './KeyAchievementsSection';
import ProfileSection from './ProfileSection';
import RefereesSection from './RefereesSection';

const FirstPage = ({ resumeData, mainExperience }) => {
  return (
    <div 
      id="first-page"
      style={{ 
        width: '100%', 
        backgroundColor: 'white', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        minHeight: 'fit-content'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr' }}>
      <ProfileSection resumeData={resumeData} />

      
        {/* Right Section */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
            {/* Middle Column - Profile */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.75rem', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: '0 0 0.75rem 0'
                }}>
                  PROFILE
                </h2>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#374151', 
                  lineHeight: '1.625', 
                  textAlign: 'justify', 
                  marginBottom: '0.75rem',
                  margin: '0 0 0.75rem 0'
                }}>
                  {resumeData.profile.description}
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#374151', 
                  lineHeight: '1.625', 
                  textAlign: 'justify',
                  margin: 0
                }}>
                  {resumeData.profile.description2}
                </p>
              </div>
            </div>

            {/* Right Column - References and Experience */}
            <div style={{ width: '650px', padding: '1.5rem', backgroundColor: '#f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: '0 0 0.5rem 0'
                }}>
                  RECENT EXPERIENCE
                </h2>
                <img 
                  src="/PappspmLogo.jpeg" 
                  alt="PappsPM" 
                  style={{ 
                    height: '70px', 
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column'}}>
                {mainExperience.map((exp, index) => (
                  <ExperienceItem key={index} exp={exp} />
                ))}
              </div>

              {/* Contact */}
              <ContactSection resumeData={resumeData} />

              {/* Referees */}
              <RefereesSection resumeData={resumeData} />
            </div>
          </div>

          {/* Key Career Achievements */}
          <KeyAchievementsSection resumeData={resumeData} />
        </div>
      </div>
        </div>  

  );
};

export default FirstPage;