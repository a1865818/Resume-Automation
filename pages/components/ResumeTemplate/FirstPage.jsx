import DecorationRight from './DecorationRight';
import ExperienceItem from './ExperienceItem';
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
        minHeight: 'fit-content',
           position: 'relative',
      fontFamily: 'Montserrat'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr' }}>
        <ProfileSection resumeData={resumeData} />
      
        {/* Right Section */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 650px', height: '100%' }}>
             {/* Middle Column - Profile and Skills */}
             <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ededed' }}>
              {/* Profile Section */}
              <div style={{ padding: '1.5rem', flex: '0 0 auto' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.75rem', 
                  color: 'black', 
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
              
              {/* Skill Section */}
            <div style={{color: 'white',  padding: '0.75rem 1.5rem 0 1.5rem', flex: '1 1 auto', backgroundColor: '#9e9e9e'  }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  letterSpacing: '0.05em',
                  margin: '0 0 0.75rem 0'
                }}>
                  SKILLS
                </h2>
                <ul style={{ fontSize: '14px', margin: 0, padding: 0, listStyle: 'none' }}>
                  {resumeData.skills.map((skill, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{  marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                      <span style={{ lineHeight: '1'}}>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            

            {/* Right Column - References and Experience */}
            {/* <div style={{ width: '650px', padding: '1.5rem', backgroundColor: '#f3f4f6' }}> */}

            <div style={{ padding: '1.5rem', backgroundColor: 'white', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {/* REFEREES Section */}
              <div style={{ marginBottom: '1.5rem', flex: '0 0 auto' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: '0 0 0.75rem 0'
                }}>
                  REFEREES
                </h2>
              <RefereesSection resumeData={resumeData} />
            </div>

        <div style={{ flex: '1 1 auto' }}>
            <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem', 
                color: '#1e293b', 
                letterSpacing: '0.05em',
                margin: '0 0 0.5rem 0'
            }}>
                RELEVANT EXPERIENCE
            </h2>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.75rem' }}>
                {mainExperience.map((exp, index) => (
                  <ExperienceItem key={index} exp={exp} />
                ))}
              </div>
            </div>

            <div style={{ 
                position: 'absolute',
                right: 0,
                bottom: 0
              }}>
                <DecorationRight/>
              </div>

          </div>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default FirstPage;