import PageHeader from "../ResumeTemplate/PageHeader";
import ExperienceItemSecondPageTable from "./ExperienceItemSecondPageTable";

const ExperiencePageTable = ({ experiences, pageNumber, resumeData, pageHeight }) => {
  // Group items by column while maintaining order
  const organizeItemsByColumn = () => {
    const leftColumn = [];
    const rightColumn = [];
    
    experiences.forEach((item) => {
      if (item.column === 'left') {
        leftColumn.push(item);
      } else {
        rightColumn.push(item);
      }
    });
    
    return { leftColumn, rightColumn };
  };
  
  const { leftColumn, rightColumn } = organizeItemsByColumn();
  
  return (
    <table style={{ 
      width: '100%', 
      backgroundColor: 'white', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      pageBreakBefore: 'always',
      maxWidth: '1512.8000488px',
      fontFamily: 'Montserrat',
      overflow: 'hidden',
      height: pageHeight ? `${pageHeight}px` : 'auto',
      borderCollapse: 'collapse',
      tableLayout: 'fixed'
    }}>
      <tbody>
        <tr>
          <td style={{ verticalAlign: 'top' }}>
            <PageHeader resumeData={resumeData} />
          </td>
        </tr>
        <tr>
          <td style={{ verticalAlign: 'top', padding: '1.5rem' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              height: pageHeight ? `${pageHeight - 155}px` : 'auto' // Subtract header height
            }}>
              <colgroup>
                <col style={{ width: 'calc(50% - 1.25rem)' }} />
                <col style={{ width: '2.5px' }} />
                <col style={{ width: 'calc(50% - 1.25rem)' }} />
              </colgroup>
              <tbody>
                <tr style={{ height: '100%' }}>
                  {/* Left Column */}
                  <td style={{ 
                    padding: '1.5rem',
                    verticalAlign: 'top',
                    width: 'calc(50% - 1.25rem)'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {leftColumn.map((item, index) => (
                          <tr key={`left-${item.type}-${item.expIndex}-${item.respIndex || 'header'}-${index}`}>
                            <td style={{ verticalAlign: 'top' }}>
                              <ExperienceItemSecondPageTable item={item} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                  
                  {/* Vertical separator line */}
                  <td style={{ 
                    backgroundColor: 'black', 
                    width: '2.5px',
                    padding: 0
                  }}></td>

                  {/* Right Column */}
                  <td style={{ 
                    padding: '1.5rem',
                    verticalAlign: 'top',
                    width: 'calc(50% - 1.25rem)'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {rightColumn.map((item, index) => (
                          <tr key={`right-${item.type}-${item.expIndex}-${item.respIndex || 'header'}-${index}`}>
                            <td style={{ verticalAlign: 'top' }}>
                              <ExperienceItemSecondPageTable item={item} />
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
        </tr>
      </tbody>
    </table>
  );
};

export default ExperiencePageTable;