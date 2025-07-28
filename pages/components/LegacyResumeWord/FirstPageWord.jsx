const FirstPageWord = ({ resumeData, mainExperience, scaleFactor, wordPageWidth, wordPageHeight }) => {
    // Scaled dimensions for landscape layout
    const scaledProfileWidth = Math.round(250 * scaleFactor);
    const scaledRightWidth = Math.round(750 * scaleFactor);
    const scaledMiddleWidth = wordPageWidth - scaledProfileWidth - scaledRightWidth;
    
    const styles = {
      wordDocument: {
        margin: '0',
        padding: '0',
        boxSizing: 'border-box',
        fontFamily: "'Montserrat', 'Arial', sans-serif",
        width: `${wordPageWidth}px`,
        height: `${wordPageHeight}px`,
        maxWidth: `${wordPageWidth}px`,
        maxHeight: `${wordPageHeight}px`,
        backgroundColor: '#ffffff',
        display: 'block'
      },
      
      mainTable: {
        width: '100%',
        height: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        border: 'none',
        margin: '0',
        padding: '0',
        // backgroundColor: 'blue'
      },
      
      profileColumn: {
        width: `${scaledProfileWidth}px`,
        color: '#ffffff',
        backgroundColor: 'black',
        padding: '0',
        position: 'relative',
        height: '100%',
        border: 'none'
      },
      
      middleColumn: {
        width: `${scaledMiddleWidth}px`,
        verticalAlign: 'top',
        backgroundColor: '#9e9e9e',
        padding: '0',
        height: '100%',
        border: 'none',
      },
      
      rightColumn: {
        width: `${scaledRightWidth}px`,
        backgroundColor: '#ffffff',
        verticalAlign: 'top',
        position: 'relative',
        height: '100%',
        border: 'none',
      }
    };
  
    return (
      <div style={styles.wordDocument}>
        {/* First Page */}
        <table style={styles.mainTable}>
          <colgroup>
            <col style={{ width: `${scaledProfileWidth}px` }} />
            <col style={{ width: `${scaledMiddleWidth}px` }} />
            <col style={{ width: `${scaledRightWidth}px` }} />
          </colgroup>
          <tbody>
            <tr style={{ height: '100%' }}>
              {/* Left Column - Profile Section */}
              <td style={styles.profileColumn}>
                {/* Profile Photo */}
                {resumeData.profile.photo && resumeData.profile.photo !== "/api/placeholder/400/600" && (
                  <div style={{
                    width: '200px',
                    maxWidth: '200px',
                    height: `${Math.round(300 * scaleFactor)}px`,
                    backgroundColor: '#374151',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginTop: 0,
                    paddingTop: 0
                  }}>
                    <img 
                      src={resumeData.profile.photo} 
                      alt="Profile"
                      width={200}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        marginTop: 0,
                        paddingTop: 0
                      }}
                    />
                  </div>
                )}
                
                {/* Profile Content - Word Compatible */}
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: 'none',
                //   backgroundColor:'pink',
                
                }}>
                  <tbody>
                    <tr>
                      <td style={{
                        padding: '0',
                        border: 'none',
                        width: `${Math.round(18 * scaleFactor)}px`
                      }}></td>
                      <td style={{
                        padding: '0',
                        border: 'none',
                        paddingTop: `${Math.round(18 * scaleFactor)}px`,
                        paddingBottom: `${Math.round(18 * scaleFactor)}px`
                      }}>
                        {/* Name and Title */}
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          marginBottom: `${Math.round(12 * scaleFactor)}px`,
                          border: 'none',
                        //   backgroundColor: 'purple',
                        }}>
                          <tbody>
                            <tr>
                              <td style={{
                                padding: '0',
                                border: 'none'
                              }}>
                                <h1 style={{
                                  fontSize: `${Math.round(30 * scaleFactor)}px`,
                                  fontWeight: 'bold',
                                  color: '#ffffff',
                                  margin: '0',
                                  lineHeight: '1.1',
                                  fontFamily: "'Montserrat', Arial, sans-serif"
                                }}>{resumeData.profile.name}</h1>
                                
                                <div style={{
                                //   color: '#fbbf24',
                                color:'white',
                                  fontSize: `${Math.round(12 * scaleFactor)}px`,
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  letterSpacing: `${0.8 * scaleFactor}px`,
                                  margin: `${Math.round(4 * scaleFactor)}px 0`,
                                  fontFamily: "'Montserrat', Arial, sans-serif"
                                }}>{resumeData.profile.title}</div>
                                
                                <div style={{
                                  fontSize: `${Math.round(11 * scaleFactor)}px`,
                                  color: '#d1d5db',
                                  letterSpacing: `${1.2 * scaleFactor}px`,
                                  textTransform: 'uppercase',
                                  fontFamily: "'Montserrat', Arial, sans-serif"
                                }}>{resumeData.profile.location}</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        {/* Security Clearance */}
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          marginBottom: `${Math.round(16 * scaleFactor)}px`,
                          border: 'none',
                        //   backgroundColor:'orange',
                        }}>
                          <tbody>
                            <tr>
                              <td style={{
                                padding: '0',
                                paddingTop: `${Math.round(12 * scaleFactor)}px`,
                                border: 'none'
                              }}>
                                <h2 style={{
                                  fontSize: `${Math.round(15 * scaleFactor)}px`,
                                  fontWeight: 'bold',
                                //   color: '#fbbf24',
                                color:'white',

                                  letterSpacing: `${0.6 * scaleFactor}px`,
                                  margin: `0 0 ${Math.round(6 * scaleFactor)}px 0`,
                                  fontFamily: "'Montserrat', Arial, sans-serif",
                                  paddingTop: '1.5rem'
                                }}>SECURITY CLEARANCE</h2>
  
                                <table style={{
                                  width: '100%',
                                  borderCollapse: 'collapse',
                                  border: 'none',

                                }}>
                                  <tbody>
                                    <tr>
                                      <td style={{
                                        padding: '0',
                                        border: 'none',
                                        marginLeft: `${Math.round(-32 * scaleFactor)}px` // Match margin control as in qualifications
                                      }}>
                                        <ul style={{
                                          margin: '0',
                                          listStyleType: 'disc',
                                          color: 'white',
                                          lineHeight: '1.25',
                                        }}>
                                          {resumeData.profile.clearance && resumeData.profile.clearance !== 'NONE' ? (
                                            <li
                                              style={{
                                                // display: 'table-cell',
                                                width: '100%',
                                                marginBottom: `${Math.round(4 * scaleFactor)}px`,
                                                color: 'white',
                                                lineHeight: '1.25',
                                                fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                                fontFamily: "'Montserrat', Arial, sans-serif",
                                                padding: '0',
                                                border: 'none',
                                                verticalAlign: 'middle',
                                                textAlign: 'left',
                                              }}
                                            >
                                              {resumeData.profile.clearance}
                                            </li>
                                          ) : (
                                            <li
                                              style={{
                                                display: 'table-cell',
                                                width: '100%',
                                                marginBottom: `${Math.round(4 * scaleFactor)}px`,
                                                color: 'white',
                                                lineHeight: '1.25',
                                                fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                                fontFamily: "'Montserrat', Arial, sans-serif",
                                                padding: '0',
                                                border: 'none',
                                                verticalAlign: 'middle',
                                                textAlign: 'left',
                                                color: 'white',
                                              }}
                                            >
                                              Able to obtain security clearance.
                                            </li>
                                          )}
                                        </ul>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        {/* Qualifications */}
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          marginBottom: `${Math.round(16 * scaleFactor)}px`,
                          border: 'none',
                        //   backgroundColor:'gray',

                        }}>
                          <tbody>
                            <tr>
                              <td style={{
                                padding: '0',
                                paddingTop: `${Math.round(12 * scaleFactor)}px`,
                                border: 'none'
                              }}>
                                <h2 style={{
                                  fontSize: `${Math.round(15 * scaleFactor)}px`,
                                  fontWeight: 'bold',
                                //   color: '#fbbf24',
                                color:'white',

                                  letterSpacing: `${0.6 * scaleFactor}px`,
                                  margin: `0 0 ${Math.round(6 * scaleFactor)}px 0`,
                                  fontFamily: "'Montserrat', Arial, sans-serif",
                                  paddingTop: '1.5rem'
                                }}>QUALIFICATIONS</h2>
  
                                  <table style={{
                                  width: '100%',
                                  borderCollapse: 'collapse',
                                  border: 'none'
                                  }}>
                                  <tbody>
                                      <tr>
                                      <td style={{
                                          padding: '0',
                                          border: 'none',
                                          marginLeft: `${Math.round(-32 * scaleFactor)}px` // Your margin control like in experience section
                                      }}>
                                          <ul style={{
                                          margin: '0',
                                       
                                          listStyleType: 'disc',
                                        //   color: '#fbbf24',
                                          lineHeight: '1.25',
                                          }}>
                                          {resumeData.qualifications.map((qual, index) => (
                                              <li
                                                  key={index}
                                                  style={{
                                                      display: 'table-cell',
                                                      width: '100%',
                                                      marginBottom: `${Math.round(4 * scaleFactor)}px`,
                                                      color: 'white',
                                                      lineHeight: '1.25',
                                                      fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                                      fontFamily: "'Montserrat', Arial, sans-serif",
                                                      padding: '0',
                                                      border: 'none',
                                                      verticalAlign: 'middle',
                                                      textAlign: 'left',
                                                  }}
                                                  >
                                                  {qual}
                                              </li>
  
                                          ))}
                                          </ul>
                                      </td>
                                      </tr>
                                  </tbody>
                                  </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        {/* Affiliations */}
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          marginBottom: `${Math.round(16 * scaleFactor)}px`,
                          border: 'none',
                        //   backgroundColor:"yellow",
                        }}>
                          <tbody>
                            <tr>
                              <td style={{
                                padding: '0',
                                paddingTop: `${Math.round(12 * scaleFactor)}px`,
                                border: 'none'
                              }}>
                                <h2 style={{
                                  fontSize: `${Math.round(15 * scaleFactor)}px`,
                                  fontWeight: 'bold',
                                //   color: '#fbbf24',
                                color:'white',

                                  letterSpacing: `${0.6 * scaleFactor}px`,
                                  margin: `0 0 ${Math.round(6 * scaleFactor)}px 0`,
                                  fontFamily: "'Montserrat', Arial, sans-serif",
                                  paddingTop: '1.5rem'
                                }}>AFFILIATIONS</h2>
  
                                <table style={{
                                  width: '100%',
                                  borderCollapse: 'collapse',
                                //   backgroundColor:'red',
                                  border: 'none'
                                }}>
                                  <tbody>
                                    <tr>
                                      <td style={{
                                        padding: '0',
                                        border: 'none',
                                        marginLeft: `${Math.round(-32 * scaleFactor)}px` // Match margin control as in qualifications
                                      }}>
                                        <ul style={{
                                          margin: '0',
                                          listStyleType: 'disc',
                                        //   color: '#fbbf24',
                                          lineHeight: '1.25',
                                        }}>
                                          {(resumeData.affiliations && resumeData.affiliations.length > 0) ? (
                                            resumeData.affiliations.map((affiliation, index) => (
                                              <li
                                                key={index}
                                                style={{
                                                  display: 'table-cell',
                                                  width: '100%',
                                                  marginBottom: `${Math.round(4 * scaleFactor)}px`,
                                                  color: 'white',
                                                  lineHeight: '1.25',
                                                  fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                                  fontFamily: "'Montserrat', Arial, sans-serif",
                                                  padding: '0',
                                                  border: 'none',
                                                  verticalAlign: 'middle',
                                                  textAlign: 'left',
                                                }}
                                              >
                                                {affiliation}
                                              </li>
                                            ))
                                          ) : (
                                            <li
                                              style={{
                                                display: 'table-cell',
                                                width: '100%',
                                                marginBottom: `${Math.round(4 * scaleFactor)}px`,
                                                color: 'white',
                                                lineHeight: '1.25',
                                                fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                                fontFamily: "'Montserrat', Arial, sans-serif",
                                                padding: '0',
                                                border: 'none',
                                                verticalAlign: 'middle',
                                                textAlign: 'justify',
                                                color: 'white',
                                              }}
                                            >
                                              No information given
                                            </li>
                                          )}
                                        </ul>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td style={{
                        padding: '0',
                        border: 'none',
                        width: `${Math.round(18 * scaleFactor)}px`
                      }}></td>
                    </tr>
                  </tbody>
                </table>
              </td>
              
              {/* Middle Column - Profile & Skills */}
              <td style={{ ...styles.middleColumn, height: '100%' }}>
                <table style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderCollapse: 'collapse', 
                  border: 'none',
                  tableLayout: 'fixed'
                }}>
                  <tbody>
                    {/* Profile Description */}
                    <tr>
                      <td style={{
                        backgroundColor: '#ededed',
                        padding: `${Math.round(18 * scaleFactor)}px`,
                        verticalAlign: 'top',
                        border: 'none',
                        height: '1px'
                      }}>
                        <h2 style={{
                          fontSize: `${Math.round(15 * scaleFactor)}px`,
                          fontWeight: 'bold',
                          color: '#1e293b',
                          letterSpacing: `${0.6 * scaleFactor}px`,
                          margin: `0 0 ${Math.round(9 * scaleFactor)}px 0`,
                          fontFamily: "'Montserrat', Arial, sans-serif"
                        }}>PROFILE</h2>
                        <p style={{
                          fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                          color: '#374151',
                          lineHeight: '1.625',
                          textAlign: 'justify',
                          margin: `0 0 ${Math.round(9 * scaleFactor)}px 0`,
                          fontFamily: "'Montserrat', Arial, sans-serif"
                        }}>{resumeData.profile.description}</p>
                        <p style={{
                          fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                          color: '#374151',
                          lineHeight: '1.625',
                          textAlign: 'justify',
                          margin: '0',
                          fontFamily: "'Montserrat', Arial, sans-serif"
                        }}>{resumeData.profile.description2}</p>
                      </td>
                    </tr>
                    
                    {/* Skills - Fill Remaining Space */}
                    <tr style={{ height: '100%' }}>
                      <td style={{
                        backgroundColor: '#9e9e9e',
                        color: '#ffffff',
                        padding: `${Math.round(18 * scaleFactor)}px`,
                        verticalAlign: 'top',
                        border: 'none',
                        height: '100%'
                      }}>
                        <table style={{
                          width: '100%',
                          height: '100%',
                          borderCollapse: 'collapse',
                          border: 'none'
                        }}>
                          <tbody>
                      
                            <tr>
                              <td style={{
                                padding: '0',
                                border: 'none',
                                height: 'auto'
                              }}>
                                <h2 style={{
                                  fontSize: `${Math.round(15 * scaleFactor)}px`,
                                  fontWeight: 'bold',
                                  color: '#ffffff',
                                  letterSpacing: `${0.6 * scaleFactor}px`,
                                  margin: `0 0 ${Math.round(9 * scaleFactor)}px 0`,
                                  fontFamily: "'Montserrat', Arial, sans-serif"
                                }}>SKILLS</h2>
                              </td>
                            </tr>
                            <tr style={{ height: '100%' }}>
                              <td style={{
                                  padding: '0',
                                  border: 'none',
                                  verticalAlign: 'top',
                                  height: '100%'
                              }}>
                                  {/* Wrap the ul/li in a table for positioning control */}
                                  <table style={{
                                  width: '100%',
                                  borderCollapse: 'collapse',
                                  border: 'none',
                                  }}>
                                  <tbody>
                                      <tr>
                                      <td style={{
                                          padding: '0',
                                          border: 'none',
                                          marginLeft: `${Math.round(-32 * scaleFactor)}px`, // Control left spacing
                                          marginTop: '2px',
  
  
                                      }}>
                                          <ul style={{
                                          listStyleType: 'disc',
                                          lineHeight: '1.25',
                                          }}>
                                          {resumeData.skills.map((skill, index) => (
                                              <li key={index} style={{
                                              fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                              lineHeight: '1.25',
                                              fontFamily: "'Montserrat', Arial, sans-serif",
                                              color: '#ffffff',
                                              marginBottom: `${Math.round(4 * scaleFactor)}px`, // Same spacing as original paddingBottom
                                              textAlign: 'justify',
                                              verticalAlign: 'middle',
                                              }}>
                                              {skill}
                                              </li>
                                          ))}
                                          </ul>
                                      </td>
                                      </tr>
                                  </tbody>
                                  </table>
                              </td>
                              </tr>        
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              {/* Right Column - Referees & Experience */}
              <td style={styles.rightColumn}>
                <table style={{
                  width: '100%',
                  height: '100%',
                  borderCollapse: 'collapse',
                  border: 'none',
                    // backgroundColor:'green'
                }}>
                  <tbody>
                    <tr>
                      <td style={{
                        padding: `${Math.round(18 * scaleFactor)}px`,
                        border: 'none',
                        verticalAlign: 'top'
                      }}>
                   
  
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginBottom: `${Math.round(18 * scaleFactor)}px`,
                  border: 'none'
                }}>
                <tbody>
                  <tr>
                    {/* Left column - Referees content */}
                    <td style={{
                      padding: '0',
                      border: 'none',
                      verticalAlign: 'top',
                      width: 'auto'
                    }}>
                      <h2 style={{
                        fontSize: `${Math.round(15 * scaleFactor)}px`,
                        fontWeight: 'bold',
                        color: '#1e293b',
                        letterSpacing: `${0.6 * scaleFactor}px`,
                        margin: `0 0 ${Math.round(9 * scaleFactor)}px 0`,
                        fontFamily: "'Montserrat', Arial, sans-serif"
                      }}>REFEREES</h2>
                      
                      {resumeData.referees && resumeData.referees.length > 0 ? (
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          border: 'none'
                        }}>
              <tbody>
                {resumeData.referees.map((referee, index) => (
                  <tr key={index}>
                    <td style={{
                      fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                      fontFamily: "'Montserrat', Arial, sans-serif",
                      padding: '0',
                      paddingBottom: `${Math.round(12 * scaleFactor)}px`,
                      border: 'none',
                      verticalAlign: 'top'
                    }}>
                      <p style={{
                        fontWeight: '600',
                        color: '#1e293b',
                        margin: `0 0 ${Math.round(3 * scaleFactor)}px 0`
                      }}>{referee.title}</p>
                      <p style={{
                        color: '#374151',
                        margin: `0 0 ${Math.round(3 * scaleFactor)}px 0`
                      }}>N: {referee.name}</p>
                      <p style={{
                        color: '#374151',
                        margin: `0 0 ${Math.round(3 * scaleFactor)}px 0`
                      }}>E: {referee.email}</p>
                      <p style={{
                        color: '#374151',
                        margin: '0'
                      }}>M: {referee.phone}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{
              fontSize: `${Math.round(10.5 * scaleFactor)}px`,
              color: '#374151',
              fontStyle: 'italic',
              marginTop: `${Math.round(6 * scaleFactor)}px`,
              fontFamily: "'Montserrat', Arial, sans-serif"
            }}>
              Available upon request
            </div>
          )}


        </td>


        
        {/* Right column - Logos */}
        <td style={{
          padding: `0 0 0 ${Math.round(20 * scaleFactor)}px`,
          border: 'none',
          verticalAlign: 'top',
          textAlign: 'right',
          width: 'auto'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: `${Math.round(10 * scaleFactor)}px`
          }}>
            <img
              // height={Math.round(60 * scaleFactor)}
              height={60}
              src="/assets/images/SMELogo.jpeg" 
              alt="SME Gateway"
              style={{
                objectFit: 'contain',
                border: 'none'
              }}
            />
            <img 
              // height={Math.round(60 * scaleFactor)} 
              height={60}
              src="/PappspmLogo.jpeg" 
              alt="PappsPM"
              style={{
                objectFit: 'contain',
                border: 'none'
              }}
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
      
      {/* Experience */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: 'none'
      }}>
        <tbody>
          <tr>
            <td style={{
              paddingTop: `${Math.round(18 * scaleFactor)}px`,
              border: 'none'
            }}>
              <h2 style={{
                fontSize: `${Math.round(15 * scaleFactor)}px`,
                fontWeight: 'bold',
                color: '#1e293b',
                letterSpacing: `${0.6 * scaleFactor}px`,
                margin: `0 0 ${Math.round(6 * scaleFactor)}px 0`,
                fontFamily: "'Montserrat', Arial, sans-serif"
              }}>RELEVANT EXPERIENCE</h2>
              
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: 'none',
                marginTop: `${Math.round(9 * scaleFactor)}px`
              }}>
                <tbody>
                  {mainExperience.map((exp, index) => {
                    if (!exp.responsibilities || exp.responsibilities.length === 0) {
                      return null;
                    }
                    return (
                      <tr key={index}>
                        <td style={{
                          padding: '0',
                          paddingBottom: `${Math.round(8 * scaleFactor)}px`,
                          verticalAlign: 'top',
                          
                        }}>
                          {/* Experience Header */}
                          <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginBottom: `${Math.round(9 * scaleFactor)}px`,
                            border: 'none'
                          }}>
                            <tbody>
                              <tr>
                                <td style={{
                                  padding: '0',
                                  border: 'none'
                                }}>
                                  <h3 style={{
                                    fontWeight: 'bold',
                                    color: '#1e293b',
                                    fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                    lineHeight: '1.25',
                                    margin: `0 0 ${Math.round(3 * scaleFactor)}px 0`,
                                    fontFamily: "'Montserrat', Arial, sans-serif"
                                  }}>{exp.title}</h3>
                                  {!exp.isSecondPart && (
                                    <p style={{
                                      fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                      color: '#4b5563',
                                      margin: '0',
                                      fontFamily: "'Montserrat', Arial, sans-serif"
                                    }}>{exp.period}</p>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                            <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            border: 'none',
                            marginTop: `${Math.round(-4 * scaleFactor)}px`, // Control top spacing - negative to pull closer
                      
                            }}>
                            <tbody>
                                <tr>
                                <td style={{
                                    padding: '0',
                                    border: 'none',
                                    marginLeft: `${Math.round(-32* scaleFactor)}px`,
                                    fontSize: `${Math.round(10.5 * scaleFactor)}px`,
  
                                
                                }}>
                                    <ul style={{
                                    paddingLeft: `${Math.round(8 * scaleFactor)}px`, // Reduced from 16px
                                    margin: '0',
                                    listStyleType: 'disc',
                                    
                                    }}
                                    className="body-text">
                                    {exp.responsibilities.map((resp, respIndex) => (
                                        <li key={respIndex} style={{
                                        lineHeight: '1.25',
                                        color: '#000000',
                                        fontFamily: "'Montserrat', Arial, sans-serif",
                                        marginBottom: `${Math.round(4 * scaleFactor)}px`, // Reduced spacing between items
                                        textAlign: 'justify',
                                        verticalAlign: 'middle',
                                        fontSize: `${Math.round(10.5 * scaleFactor)}px`,

                                        }}>
                                        {resp}
                                        
                                        </li>
                                    ))}
                                    </ul>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>


                        
                      </td>
                    </tr>
                  </tbody>
                </table>
       
              </td>
            </tr>


              {/* Decorations Row */}
    <tr>
      {/* Decoration Left */}
      <td style={{
        padding: 0,
        border: 'none',
        verticalAlign: 'bottom',
        textAlign: 'left',
        width: `${scaledProfileWidth}px`,
        backgroundColor:'black',
        height: `${Math.round(40 * scaleFactor)}px`
      }}>
        <img
          src="/assets/images/DecorationLeft.jpeg"
          alt="Decoration Left"
          width={150}
          style={{
            height: `${Math.round(30 * scaleFactor)}px`,
            objectFit: 'contain',
            display: 'inline-block',
            margin: 0,
            padding: 0
          }}
        />
      </td>
      {/* Empty cell for middle column */}
      <td style={{ padding: 0, border: 'none',
        width: `${scaledMiddleWidth}px`,
        backgroundColor: '#9e9e9e',
        
       }}></td>
      {/* Decoration Right */}
      <td style={{
        padding: 0,
        border: 'none',
        verticalAlign: 'bottom',
        textAlign: 'right',
        width: `${scaledRightWidth}px`,
        backgroundColor: '#ffffff',

        height: `${Math.round(40 * scaleFactor)}px`
      }}>
        <img
          src="/assets/images/DecorationRight.jpeg"
          alt="Decoration Right"
          width={150}
          style={{
            height: `${Math.round(30 * scaleFactor)}px`,
            objectFit: 'contain',
            display: 'inline-block',
            margin: 0,
            padding: 0
          }}
        />
      </td>
    </tr>
          </tbody>
        </table>
        
      </div>
      
    );
  };
  
  export default FirstPageWord;