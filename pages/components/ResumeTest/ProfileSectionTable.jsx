import DecorationLeft from "../ResumeTemplate/DecorationLeft";


// Table-based ProfileSection component
const ProfileSectionTable = ({ resumeData }) => {
  return (
    <div style={{ color: 'white', position: 'relative' }}>
      {/* Logos positioned absolutely */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
        display: 'table'
      }}>
        {/* <div style={{ display: 'table-cell', verticalAlign: 'top', paddingTop: '0.5rem' }}>
          <img 
          height={80}
          src="/assets/images/SMELogo.jpeg" alt="SME Logo" />
        </div> */}
        <div style={{ 
          display: 'table-cell', 
          verticalAlign: 'top',
          transform: 'scale(0.8)',
          transformOrigin: 'top right'
        }}>
          {/* PappsLogo component here */}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {/* Profile Photo */}
          {resumeData.profile.photo && resumeData.profile.photo !== "/api/placeholder/400/600" && (
            <tr>
              <td style={{ 
                width: '100%', 
                height: '25rem', 
                backgroundColor: '#374151',
                textAlign: 'center',
                verticalAlign: 'middle',
                fontSize: '0.875rem',
                color: '#9CA3AF',
                padding: 0
              }}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${resumeData.profile.photo})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}></div>
              </td>
            </tr>
          )}
          
          {/* Content Section */}
          <tr>
            <td style={{ padding: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {/* Name and Title */}
                  <tr>
                    <td style={{ paddingBottom: '0.75rem' }}>
                      <h1 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 'bold', 
                        margin: 0
                      }}>
                        {resumeData.profile.name}
                      </h1>
                      <div style={{ 
                        color: '#fbbf24', 
                        fontSize: '1rem', 
                        fontWeight: 'bold', 
                        marginBottom: '0.25rem', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em' 
                      }}>
                        {resumeData.profile.title}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#d1d5db', 
                        letterSpacing: '0.1em', 
                        textTransform: 'uppercase' 
                      }}>
                        {resumeData.profile.location}
                      </div>
                    </td>
                  </tr>

                  {/* Security Clearance */}
                  <tr>
                    <td style={{ paddingBottom: '1rem' }}>
                      <h2 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        color: '#fbbf24', 
                        letterSpacing: '0.05em',
                        margin: '0 0 0.5rem 0'
                      }}>
                        SECURITY CLEARANCE
                      </h2>
                      <div style={{ fontSize: '13px', lineHeight: '1.25' }}>
                        {resumeData.profile.clearance && resumeData.profile.clearance !== 'NONE' ? (
                          <div>
                            <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                            <span>{resumeData.profile.clearance}</span>
                          </div>
                        ) : (
                          <div style={{ 
                            fontStyle: 'italic', 
                            color: '#9CA3AF',
                            fontSize: '12px'
                          }}>
                            Able to obtain security clearance.
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Qualifications */}
                  <tr>
                    <td style={{ paddingBottom: '1rem' }}>
                      <h2 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        color: '#fbbf24', 
                        letterSpacing: '0.05em',
                        margin: '0 0 0.5rem 0'
                      }}>
                        QUALIFICATIONS
                      </h2>
                      <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
                        {resumeData.qualifications.map((qual, index) => (
                          <li key={index} style={{ marginBottom: '0.25rem' }}>
                            <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                            <span style={{ lineHeight: '1.25', fontSize: '13px' }}>{qual}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  
                  {/* Affiliations */}
                  <tr>
                    <td style={{ paddingBottom: '1rem' }}>
                      <h2 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        color: '#fbbf24', 
                        letterSpacing: '0.05em',
                        margin: '0 0 0.5rem 0'
                      }}>
                        AFFILIATIONS
                      </h2>
                      {resumeData.affiliations && resumeData.affiliations.length > 0 ? (
                        <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
                          {resumeData.affiliations.map((affiliation, index) => (
                            <li key={index} style={{ marginBottom: '0.25rem' }}>
                              <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '10px' }}>•</span>
                              <span style={{ lineHeight: '1.25', fontSize: '13px' }}>{affiliation}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div style={{ lineHeight: '1.25', fontSize: '13px' }}>
                          <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '10px' }}>•</span>
                          No information given
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Decoration - positioned absolutely */}
      {/* <div style={{ 
        position: 'absolute', 
        left: 0, 
        bottom: 0,
        transform: 'scale(1.75)',
        transformOrigin: 'bottom left',
      }}>
        <DecorationLeft />
      </div> */}
    </div>
  );
};
export default ProfileSectionTable;