
import ExperienceItemSecondPage from './ExperienceItemSecondPage';
import PageHeader from './PageHeader';

const ExperiencePage = ({ experiences, pageNumber, resumeData, pageHeight }) => {
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
        flex: 1,
        display: 'flex',
        gap: '2rem',
        minHeight: 0 // Important for flex children
      }}>
        {/* Left Column */}
        <div style={{ 
        padding: '1.5rem', 

          flex: 1,
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
            position: 'relative',
        }}>
          {leftColumn.map((item, index) => (
            <ExperienceItemSecondPage 
              key={`left-${item.type}-${item.expIndex}-${item.respIndex || 'header'}-${index}`} 
              item={item} 
            />
            
          ))}

            {/* <div style={{ 
                        position: 'absolute', 
                        left: 0, 
                        bottom: 0 ,
                        transform:'scale(1.75)',
                        transformOrigin: 'bottom left',
                    }}>
                        <DecorationLeft/>
                    </div> */}
                   
           
        </div>
        
        {/* Vertical separator line */}
        <div style={{ 
          backgroundColor: 'black', 
          width: '2.5px',
          flexShrink: 0
        }}></div>

        {/* Right Column */}
        <div style={{ 
            paddingTop: '1.5rem',
          flex: 1,
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {rightColumn.map((item, index) => (
            <ExperienceItemSecondPage 
              key={`right-${item.type}-${item.expIndex}-${item.respIndex || 'header'}-${index}`} 
              item={item} 
            />
          ))}
        </div>
      </div>
      {/* <div style={{ 
      backgroundColor: 'black', 
      color: 'white', 
    //   padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    //   position: 'relative',
      height: '5px',
    }}>

    </div> */}
    </div>
  );
};

export default ExperiencePage;