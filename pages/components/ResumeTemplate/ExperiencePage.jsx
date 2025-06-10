import ExperienceItemSecondPage from './ExperienceItemSecondPage';
import PageHeader from './PageHeader';

const ExperiencePage = ({ experiences, pageNumber, resumeData, pageHeight, fullExperience, experienceHeights }) => {
  // Group experiences by column
  const organizeExperiencesByColumn = () => {
    const leftColumn = [];
    const rightColumn = [];
    
    // Sort experiences to maintain order within columns
    const sortedExperiences = [...experiences].sort((a, b) => {
      // First sort by column (left before right)
      if (a.column !== b.column) {
        return a.column === 'left' ? -1 : 1;
      }
      // Then by original index to maintain order
      return a.index - b.index;
    });
    
    sortedExperiences.forEach((item) => {
      if (item.column === 'left') {
        leftColumn.push(item.exp);
      } else {
        rightColumn.push(item.exp);
      }
    });
    
    return { leftColumn, rightColumn };
  };
  
  const { leftColumn, rightColumn } = organizeExperiencesByColumn();
  
  return (
    <div style={{ 
        width: '100%', 
        backgroundColor: 'white', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        pageBreakBefore: 'always',
        maxWidth: '1512.8000488px',
        fontFamily: 'Montserrat',
        overflow: 'hidden',
        height: pageHeight ? `${pageHeight}px` : 'auto',
        display: 'flex',
        flexDirection: 'column'
    }}>
      <PageHeader resumeData={resumeData} />
      
      <div style={{ 
        padding: '1.5rem', 
        flex: 1,
        display: 'flex',
        gap: '2rem',
        minHeight: 0 // Important for flex children
      }}>
        {/* Left Column */}
        <div style={{ 
          flex: 1,
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {leftColumn.map((exp, index) => (
            <ExperienceItemSecondPage key={`left-${index}`} exp={exp} />
          ))}
        </div>
        
        {/* Vertical separator line */}
        <div style={{ 
          backgroundColor: 'black', 
          width: '2.5px',
          flexShrink: 0
        }}></div>

        {/* Right Column */}
        <div style={{ 
          flex: 1,
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {rightColumn.map((exp, index) => (
            <ExperienceItemSecondPage key={`right-${index}`} exp={exp} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;