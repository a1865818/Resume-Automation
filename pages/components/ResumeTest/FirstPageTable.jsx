import DecorationRight from "../ResumeTemplate/DecorationRight";
import RefereesSection from "../ResumeTemplate/RefereesSection";
import ExperienceItemTable from "./ExperienceItemTable";
import ProfileSectionTable from "./ProfileSectionTable";

const FirstPageTable = ({ resumeData, mainExperience }) => {
    return (
      <table 
        id="first-page"
        style={{ 
          width: '100%', 
          backgroundColor: 'white', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          fontFamily: 'Montserrat',
          borderCollapse: 'collapse',
          tableLayout: 'fixed'
        }}
      >
        <colgroup>
          <col style={{ width: '350px' }} />
          <col style={{ width: 'auto' }} />
          <col style={{ width: '610px' }} />
        </colgroup>
        <tbody>
          <tr>
            {/* Left Column - Profile */}
            <td style={{ backgroundColor: 'black', verticalAlign: 'top', padding: 0, position: 'relative' }}>
              <ProfileSectionTable resumeData={resumeData} />
            </td>

            {/* Middle Column - Profile Description and Skills */}
            <td style={{ backgroundColor: '#9e9e9e', verticalAlign: 'top', padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {/* Profile Description Section */}
                  <tr>
                    <td style={{
                      backgroundColor: '#ededed',
                      padding: '1.5rem',
                      verticalAlign: 'top'
                    }}>
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
                    </td>
                  </tr>
                  {/* Skills Section */}
                  <tr>
                    <td style={{
                      color: 'white',  
                      padding: '0.75rem 1.5rem 0 1.5rem', 
                      backgroundColor: '#9e9e9e',
                      verticalAlign: 'top'
                    }}>
                      <h2 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        letterSpacing: '0.05em',
                        margin: '0 0 0.75rem 0'
                      }}>
                        SKILLS
                      </h2>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          {resumeData.skills.map((skill, index) => (
                            <tr key={index}>
                              <td style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem',
                                fontSize: '14px',
                                lineHeight: '1'
                              }}>
                                <span style={{ marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                                <span>{skill}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
  
            {/* Right Column - References and Experience */}
            <td style={{ backgroundColor: 'white', position: 'relative', verticalAlign: 'top', padding: '1.5rem 2rem 2rem 2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {/* REFEREES Section */}
                  <tr>
                    <td style={{ 
                      verticalAlign: 'top',
                      paddingBottom: '1.5rem'
                    }}>
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
                    </td>
                  </tr>
  
                  {/* Experience Section */}
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>
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
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          {mainExperience.map((exp, index) => (
                            <tr key={index}>
                              <td style={{ verticalAlign: 'top'}}>
                                <ExperienceItemTable exp={exp} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            
              {/* <div style={{ 
                position: 'absolute',
                right: 0,
                bottom: 0,
                transform: 'scale(1.75)',
                transformOrigin: 'bottom right',
              }}>
                <DecorationRight/>
              </div> */}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  export default FirstPageTable;