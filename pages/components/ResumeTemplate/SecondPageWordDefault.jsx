

const SecondPageWordDefault = ({ resumeData, experienceLayout, getExperiencePages, scaleFactor, wordPageWidth, wordPageHeight }) => {
    // If no experience pages, don't render anything
    if (!experienceLayout || experienceLayout !== 'paginated' || !getExperiencePages || getExperiencePages.length === 0) {
      return null;
    }
  
    const logoWidth = Math.round(175 * scaleFactor);
    const logoHeight = Math.round(125 * scaleFactor);
  
    // Helper function to group consecutive bullets by experience within a column
    const groupConsecutiveBullets = (items) => {
      const result = [];
      let currentGroup = null;
  
      items.forEach((item, index) => {
        if (item.type === 'header') {
          // If we have a previous group, add it to result
          if (currentGroup) {
            result.push(currentGroup);
          }
          // Start a new group
          currentGroup = {
            type: 'experience',
            header: item,
            bullets: []
          };
        } else if (item.type === 'bullet') {
          if (currentGroup && currentGroup.header.expIndex === item.expIndex) {
            // This bullet belongs to the current experience
            currentGroup.bullets.push(item);
          } else {
            // This bullet belongs to a different experience
            // First, close the current group if it exists
            if (currentGroup) {
              result.push(currentGroup);
            }
            
            // Check if this is a continuation of a previous experience
            // Look for a header with the same expIndex earlier in the result
            let foundPreviousGroup = false;
            for (let i = result.length - 1; i >= 0; i--) {
              if (result[i].type === 'experience' && result[i].header.expIndex === item.expIndex) {
                // Found the previous part of this experience, add bullet to it
                result[i].bullets.push(item);
                foundPreviousGroup = true;
                break;
              }
            }
            
            if (!foundPreviousGroup) {
              // This is an orphaned bullet (header is in different column/page)
              // Render it individually to preserve the flow
              result.push({
                type: 'orphan_bullet',
                bullet: item
              });
            }
            
            currentGroup = null;
          }
        }
      });
  
      // Don't forget the last group
      if (currentGroup) {
        result.push(currentGroup);
      }
  
      return result;
    };
  
    const renderGroupedItems = (groupedItems, columnKey) => {
      return groupedItems.map((group, groupIndex) => {
        if (group.type === 'experience') {
          return (
            <div key={`${columnKey}-group-${group.header.expIndex}-${groupIndex}`}>
              {/* Experience Header */}
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
                      fontSize: `${Math.round(12.5 * scaleFactor)}px`,
                      lineHeight: '1.2',
                      margin: `4px 0 ${Math.round(3 * scaleFactor)}px 0`,
                      fontFamily: "'Montserrat', Arial, sans-serif"
                    }}>{group.header.content.title}</h3>
                    {group.header.content.company && (
                      <p style={{
                        fontSize: `${Math.round(12.5 * scaleFactor)}px`,
                        color: '#6b7280',
                        fontStyle: 'italic',
                        margin: `0 0 ${Math.round(1.5 * scaleFactor)}px 0`,
                        fontFamily: "'Montserrat', Arial, sans-serif"
                      }}>{group.header.content.company}</p>
                    )}
                    <p style={{
                      fontSize: `${Math.round(12.5 * scaleFactor)}px`,
                      color: '#4b5563',
                      lineHeight: '1.2',
                      margin: '0',
                      fontFamily: "'Montserrat', Arial, sans-serif",
                    }}>{group.header.content.period}</p>
                  </div>
                </div>
              </div>
  
              {/* Grouped Bullets for this experience */}
              {group.bullets.length > 0 && (
                <table style={{ width: '100%', border: 'none', borderCollapse: 'collapse', margin: 0, padding: 0 }}>
                  <tbody>
                    <tr>
                      <td style={{
                        padding: '0',
                        border: 'none',
                        marginLeft: `${Math.round(-32 * scaleFactor)}px`,
                      }}>
                        <ul style={{
                          paddingLeft: `${Math.round(8 * scaleFactor)}px`,
                          margin: '0',
                          listStyleType: 'disc',
                        }}>
                          {group.bullets.map((bullet, bulletIndex) => (
                            <li key={`${columnKey}-${bullet.expIndex}-${bullet.respIndex}-${bulletIndex}`} style={{
                              lineHeight: '1.75',
                              color: '#374151',
                              fontFamily: "'Montserrat', Arial, sans-serif",
                              fontSize: `${Math.round(7.5 * scaleFactor)}px`,
                              marginBottom: `${Math.round(2 * scaleFactor)}px`,
                              textAlign: 'justify',
                              verticalAlign: 'middle',
                            }}>
                                <span style={{fontSize: `${Math.round(11 * scaleFactor)}px`}} >{bullet.content.text}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          );
        } else if (group.type === 'orphan_bullet') {
          // Render orphan bullets individually (these are continuation bullets from previous column/page)
          return (
            <div key={`${columnKey}-orphan-${group.bullet.expIndex}-${group.bullet.respIndex}-${groupIndex}`}>
              <table style={{ width: '100%', border: 'none', borderCollapse: 'collapse', margin: 0, padding: 0 }}>
                <tbody>
                  <tr>
                    <td style={{
                      padding: '0',
                      border: 'none',
                      marginLeft: `${Math.round(-32 * scaleFactor)}px`,
                    }}>
                      <ul style={{
                        paddingLeft: `${Math.round(8 * scaleFactor)}px`,
                        margin: '0',
                        listStyleType: 'disc',
                      }}>
                        <li style={{
                          lineHeight: '1.75',
                          color: '#374151',
                          fontFamily: "'Montserrat', Arial, sans-serif",
                          marginBottom: `${Math.round(2 * scaleFactor)}px`,
                          textAlign: 'justify',
                          verticalAlign: 'middle',
                        }}>
                            <span style={{fontSize: `${Math.round(11 * scaleFactor)}px`}} >{group.bullet.content.text}</span>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      });
    };
  
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
            fontFamily: "'Montserrat', Arial, sans-serif",
            display: 'flex',
            flexDirection: 'column'
          }}>
      
            {/* Page Header - Table Layout for Better Word Compatibility */}
            <div style={{
              color: '#fff',
              padding: 0,
              margin: 0,
              height: `${Math.round(116 * scaleFactor)}px`,
              width: '100%',
              border: 'none',
              flexShrink: 0
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
                        fontSize: `${Math.round(28 * scaleFactor)}px`,
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
                        // color: '#fbbf24',
                        color:'white',

                        fontSize: `${Math.round(15.5 * scaleFactor)}px`,
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
                      backgroundColor: 'black',
                      padding: 0,
                      width:'45px',
                      border: '1px solid black',
                    }}>
                      <img 
                        src="/assets/images/DecorationTopRightWord.jpeg" 
                        alt="Decoration Right Logo SecondPage" 
                        width={logoWidth}
                        height={logoHeight}
                        style={{
                          width: '80px',
                          height: `${logoHeight}px`,
                          objectFit: 'contain',
                          display: 'block',
                          border: 'none',
                          margin: 0,
                          padding: 0,
                           transform: 'rotate(90deg)'
                        }} 
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            {/* Two Column Layout for Experience Pages - Flexible content area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                tableLayout: 'fixed',
                border: 'none',
                height: '100%'
              }}>
                <colgroup>
                  <col style={{ width: `calc(50% - ${Math.round(1 * scaleFactor)}px)` }} />
                  <col style={{ width: `calc(50% - ${Math.round(1 * scaleFactor)}px)` }} />
                </colgroup>
                <tbody>
                  <tr style={{ height: '100%' }}>
                    {/* Left Column */}
                    <td style={{
                      width: `calc(50% - ${Math.round(1 * scaleFactor)}px)`,
                      padding: `${Math.round(12 * scaleFactor)}px`,
                      verticalAlign: 'top',
                      border: 'none',
                      borderRightStyle: 'solid',
                      borderRightColor: 'black',
                      borderRightWidth: '1.5px',
                      height: '100%',
                    }}>
                      {(() => {
                        const leftItems = pageData.filter(item => item.column === 'left');
                        const groupedItems = groupConsecutiveBullets(leftItems);
                        return renderGroupedItems(groupedItems, 'left');
                         })()}
                          
                      <img
                        src="/assets/images/DecorationLeftSecondPage.jpeg"
                        alt="Decoration Left Second Page"
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
                    
                    {/* Right Column */}
                    <td style={{
                      width: `calc(50% - ${Math.round(1 * scaleFactor)}px)`,
                      padding: `${Math.round(12 * scaleFactor)}px`,
                      verticalAlign: 'top',
                      border: 'none',
                      height: '100%'
                    }}>
                      {(() => {
                        const rightItems = pageData.filter(item => item.column === 'right');
                        const groupedItems = groupConsecutiveBullets(rightItems);
                        return renderGroupedItems(groupedItems, 'right');
                      })()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            {/* Bottom Decorations Row - Added to second page */}
            {/* <div style={{
              height: `${Math.round(40 * scaleFactor)}px`,
              flexShrink: 0
            }}>
              <table style={{
                width: '100%',
                height: '100%',
                borderCollapse: 'collapse',
                border: 'none',
                // backgroundColor:'green',
                margin: 0,
                padding: 0
              }}>
                <colgroup>
                  <col style={{ width: '50%' }} />
                  <col style={{ width: '50%' }} />
                </colgroup>
                <tbody>
                  <tr>
            
                    <td style={{
                      padding: 0,
                      border: 'none',
                      verticalAlign: 'bottom',
                      textAlign: 'left',
                      
                      height: `${Math.round(40 * scaleFactor)}px`
                    }}>
                      <img
                        src="/assets/images/DecorationLeftSecondPage.jpeg"
                        alt="Decoration Left Second Page"
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
            </div> */}
          </div>
        ))}
      </>
    );
  };
  
  export default SecondPageWordDefault;