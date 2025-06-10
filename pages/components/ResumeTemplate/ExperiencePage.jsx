// import ExperienceItem from './ExperienceItem';
// import PageHeader from './PageHeader';

// const ExperiencePage = ({ experiences, pageNumber, resumeData, pageHeight, fullExperience, experienceHeights }) => {
//   const splitExperiences = () => {
//     let leftColumn = [];
//     let rightColumn = [];
//     let leftHeight = 0;
//     let rightHeight = 0;
    
//     experiences.forEach((exp, index) => {
//       const originalIndex = fullExperience.indexOf(exp);
//       const itemHeight = experienceHeights[originalIndex] || 150;
      
//       if (leftHeight <= rightHeight) {
//         leftColumn.push(exp);
//         leftHeight += itemHeight + 16;
//       } else {
//         rightColumn.push(exp);
//         rightHeight += itemHeight + 16;
//       }
//     });
    
//     return { leftColumn, rightColumn };
//   };
  
//   const { leftColumn, rightColumn } = splitExperiences();
  
//   return (
//     <div style={{ 
//       width: '100%', 
//       backgroundColor: 'white', 
//       boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//       height: pageHeight ? `${pageHeight}px` : 'auto',
//       overflow: 'hidden'
//     }}>
//       <PageHeader resumeData={resumeData} />
      
//       <div style={{ padding: '1.5rem', height: 'calc(100% - 80px)' }}>
//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: '1fr 1fr', 
//           gap: '2rem',
//           maxWidth: '100%',
//           height: '100%'
//         }}>
//           <div style={{ overflowY: 'hidden' }}>
//             {leftColumn.map((exp, index) => (
//               <ExperienceItem key={index} exp={exp} />
//             ))}
//           </div>
          
//           <div style={{ overflowY: 'hidden' }}>
//             {rightColumn.map((exp, index) => (
//               <ExperienceItem key={index} exp={exp} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExperiencePage;

import ExperienceItem from './ExperienceItem';
import PageHeader from './PageHeader';

const ExperiencePage = ({ experiences, pageNumber, resumeData, pageHeight, fullExperience, experienceHeights }) => {
  // Group experiences by column
  const organizeExperiencesByColumn = () => {
    const leftColumn = [];
    const rightColumn = [];
    
    // Experiences now contain column information
    experiences.forEach((item) => {
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
      height: pageHeight ? `${pageHeight}px` : 'auto',
      overflow: 'hidden'
    }}>
      <PageHeader resumeData={resumeData} />
      
      <div style={{ padding: '1.5rem', height: 'calc(100% - 80px)' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          maxWidth: '100%',
          height: '100%'
        }}>
          <div style={{ overflowY: 'hidden' }}>
            {leftColumn.map((exp, index) => (
              <ExperienceItem key={index} exp={exp} />
            ))}
          </div>
          
          <div style={{ overflowY: 'hidden' }}>
            {rightColumn.map((exp, index) => (
              <ExperienceItem key={index} exp={exp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;