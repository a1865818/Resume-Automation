const SecondPageWord = ({ resumeData, experienceLayout, getExperiencePages, scaleFactor, wordPageWidth, wordPageHeight }) => {
  // If no experience pages, don't render anything
  if (!experienceLayout || experienceLayout !== 'paginated' || !getExperiencePages || getExperiencePages.length === 0) {
    return null;
  }

  const logoWidth = Math.round(175 * scaleFactor);
  const logoHeight = Math.round(125 * scaleFactor);

  return (
    <>
      {/* Additional Experience Pages */}
      {getExperiencePages.map((pageData, pageIndex) => (
        <div key={pageIndex} style={{
          pageBreakBefore: 'always',
          breakBefore: 'page',
          width: `${wordPageWidth}px`,
          height: `${wordPageHeight}px`,
          
          backgroundColor: '#ffffff',
          boxShadow: `0 ${Math.round(8 * scaleFactor)}px ${Math.round(12 * scaleFactor)}px ${Math.round(-2 * scaleFactor)}px rgba(0,0,0,0.1)`,
          margin: '0 auto',
          fontFamily: "'Montserrat', Arial, sans-serif"
        }}>
    
{/* Page Header - Table Layout for Better Word Compatibility */}

<div style={{
  color: '#fff',
  padding: 0,
  margin: 0,
  height: `${Math.round(116 * scaleFactor)}px`,
  width: '100%',
  // boxSizing: 'border-box',
  border: 'none'
}}>
  <table style={{
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    borderCollapse: 'collapse',
    border: 'none',
    margin: 0,
    padding: 0,
    tableLayout: 'fixed'
  }}>
    <colgroup>
      <col style={{ width: '40px' }} />
      <col style={{ width: 'auto' }} />
      <col style={{ width: '40px' }} />
    </colgroup>
    <tbody>
      <tr>
        {/* Left Logo Cell */}
        <td style={{
          height: '100%',
          verticalAlign: 'middle',
          textAlign: 'left',
          backgroundColor: 'black',
          padding: `${Math.round(8 * scaleFactor)}px`,
          border: 'none',
          width:'45px',
        }}>
          <img
            src="/PappspmLogo.jpeg"
            alt="Pappspm Logo"
            width={logoWidth}
            height={logoHeight}
            style={{
              objectFit: 'contain',
              display: 'block',
              border: 'none',
              maxHeight: `${Math.round(100 * scaleFactor)}px`,
              maxWidth: '100%'
            }}
          />
        </td>

        {/* Center Text Cell */}
        <td style={{
          height: '100%',
          verticalAlign: 'middle',
          textAlign: 'center',
          backgroundColor: 'black',
          padding: `${Math.round(8 * scaleFactor)}px ${Math.round(20 * scaleFactor)}px`,
          border: 'none'
        }}>
          <h1 style={{
            fontSize: `${Math.round(24 * scaleFactor)}px`,
            fontWeight: 'bold',
            margin: `0 0 ${Math.round(4 * scaleFactor)}px 0`,
            padding: 0,
            color: '#fff',
            letterSpacing: `${1.2 * scaleFactor}px`,
            fontFamily: "'Montserrat', Arial, sans-serif",
            border: 'none',
            lineHeight: '1.2'
          }}>{resumeData.profile.name}</h1>
          <div style={{
            color: '#fbbf24',
            fontSize: `${Math.round(10.5 * scaleFactor)}px`,
            fontWeight: 'normal',
            textTransform: 'uppercase',
            letterSpacing: `${0.6 * scaleFactor}px`,
            margin: 0,
            padding: 0,
            fontFamily: "'Montserrat', Arial, sans-serif",
            border: 'none',
            lineHeight: '1.2'
          }}>{resumeData.profile.title}</div>
        </td>

        {/* Right Logo Cell */}
        <td style={{
          height: '100%',
          verticalAlign: 'middle',
          textAlign: 'right',
          backgroundColor: 'white',
          padding: 0,
          width:'45px',
        border: '1px solid black',
        }}>
          <img 
            src="/assets/images/SMELogo.jpeg" 
            alt="SME Logo" 
            width={logoWidth}
            height={logoHeight}
            style={{
              width: '80px',
              height: `${logoHeight}px`,
              objectFit: 'contain',
              display: 'block',
              border: 'none',
              margin: 0,
              padding: 0
            }} 
          />
        </td>
      </tr>
    </tbody>
  </table>
</div>

          
          {/* Two Column Layout for Experience Pages */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            // paddingTop:  '10px',
            border: 'none'
          }}>
            <colgroup>
              <col style={{ width: `calc(50% - ${Math.round(1 * scaleFactor)}px)` }} />
              <col style={{ width: `calc(50% - ${Math.round(1 * scaleFactor)}px)` }} />
            </colgroup>
            <tbody>
              <tr>
                {/* Left Column */}
                <td style={{
                  width: `calc(50% - ${Math.round(1 * scaleFactor)}px)`,
                  padding: `${Math.round(12 * scaleFactor)}px`,
                  verticalAlign: 'top',
                  borderRight: '1px solid #000',
                  border: 'none',
                  borderRightStyle: 'solid',
                  borderRightColor: '#000'
                }}>
                  {pageData
                    .filter(item => item.column === 'left')
                    .map((item, index) => (
                      <div key={`left-${item.type}-${item.expIndex}-${item.respIndex || 'header'}-${index}`}>
                        {item.type === 'header' && (
                          <div style={{
                            marginBottom: `${Math.round(6 * scaleFactor)}px`
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              marginBottom: `${Math.round(3 * scaleFactor)}px`
                            }}>
                              <div>
                                <h3 style={{
                                  fontWeight: 'bold',
                                  color: '#1e293b',
                                  fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                  lineHeight: '1.2',
                                  margin: `4px 0 ${Math.round(3 * scaleFactor)}px 0`,
                                  fontFamily: "'Montserrat', Arial, sans-serif"
                                }}>{item.content.title}</h3>
                                {item.content.company && (
                                  <p style={{
                                    fontSize: `${Math.round(9 * scaleFactor)}px`,
                                    color: '#6b7280',
                                    fontStyle: 'italic',
                                    margin: `0 0 ${Math.round(1.5 * scaleFactor)}px 0`,
                                    fontFamily: "'Montserrat', Arial, sans-serif"
                                  }}>{item.content.company}</p>
                                )}
                                <p style={{
                                  fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                  color: '#4b5563',
                                  lineHeight: '1.2',
                                  margin: '0',
                                  fontFamily: "'Montserrat', Arial, sans-serif",
                                }}>{item.content.period}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {item.type === 'bullet' && (
                          <table style={{ width: '100%', border: 'none', borderCollapse: 'collapse', margin: 0, padding: 0 }}>
                            <tbody>
                              <tr>
                                <td style={{
                                  width: `${Math.round(15 * scaleFactor)}px`,
                                  color: '#1e293b',
                                  fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                  verticalAlign: 'top',
                                  padding: '0',
                                  paddingBottom: `${Math.round(4 * scaleFactor)}px`,
                                  border: 'none'
                                }}>•</td>
                                <td style={{
                                  lineHeight: '1.25',
                                  fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                  color: '#374151',
                                  fontFamily: "'Montserrat', Arial, sans-serif",
                                  padding: '0',
                                  paddingBottom: `${Math.round(4 * scaleFactor)}px`,
                                  border: 'none',
                                  textAlign: 'justify',

                                }}>{item.content.text}</td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
                </td>
                
                {/* Right Column */}
                <td style={{
                  width: `calc(50% - ${Math.round(1 * scaleFactor)}px)`,
                  padding: `${Math.round(12 * scaleFactor)}px`,
                  verticalAlign: 'top',
                  border: 'none'
                }}>
                  {pageData
                    .filter(item => item.column === 'right')
                    .map((item, index) => (
                      <div key={`right-${item.type}-${item.expIndex}-${item.respIndex || 'header'}-${index}`}>
                        {item.type === 'header' && (
                          <div style={{
                            marginBottom: `${Math.round(6 * scaleFactor)}px`
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              marginBottom: `${Math.round(3 * scaleFactor)}px`
                            }}>
                              <div>
                                <h3 style={{
                                  fontWeight: 'bold',
                                  color: '#1e293b',
                                  fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                  lineHeight: '1.2',
                                  margin: `6px 0 ${Math.round(3 * scaleFactor)}px 0`,
                                  fontFamily: "'Montserrat', Arial, sans-serif"
                                }}>{item.content.title}</h3>
                                {item.content.company && (
                                  <p style={{
                                    fontSize: `${Math.round(9 * scaleFactor)}px`,
                                    color: '#6b7280',
                                    fontStyle: 'italic',
                                    margin: `0 0 ${Math.round(1.5 * scaleFactor)}px 0`,
                                    fontFamily: "'Montserrat', Arial, sans-serif"
                                  }}>{item.content.company}</p>
                                )}
                                <p style={{
                                  fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                  color: '#4b5563',
                                  lineHeight: '1.2',
                                  margin: '0',
                                  fontFamily: "'Montserrat', Arial, sans-serif"
                                }}>{item.content.period}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {item.type === 'bullet' && (
                          <table style={{ width: '100%', border: 'none', borderCollapse: 'collapse', margin: 0, padding: 0 }}>
                            <tbody>
                              <tr>
                                <td style={{
                                  width: `${Math.round(15 * scaleFactor)}px`,
                                  color: '#1e293b',
                                  fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                  verticalAlign: 'top',
                                  padding: '0',
                                  paddingBottom: `${Math.round(4 * scaleFactor)}px`,
                                  border: 'none'
                                }}>•</td>
                                <td style={{
                                  lineHeight: '1.25',
                                  fontSize: `${Math.round(10.5 * scaleFactor)}px`,
                                  color: '#374151',
                                  fontFamily: "'Montserrat', Arial, sans-serif",
                                  padding: '0',
                                  paddingBottom: `${Math.round(4 * scaleFactor)}px`,
                                  border: 'none',
                                  textAlign: 'justify',
                                }}>{item.content.text}</td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};

export default SecondPageWord;