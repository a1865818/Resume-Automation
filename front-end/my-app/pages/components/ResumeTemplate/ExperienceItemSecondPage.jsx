
const ExperienceHeader = ({ exp, content }) => {
    console.log('Rendering ExperienceHeader:', { exp, content });
    return (
      <div style={{ marginBottom: '0.5rem', padding: '4px' }}>
        <div style={{ fontSize: '10px', color: 'white' }}>HEADER</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
          <div>
            <h3 style={{ 
              fontWeight: 'bold', 
              color: '#1e293b', 
              fontSize: '0.875rem', 
              lineHeight: '1.2', 
              marginBottom: '0.25rem',
              margin: '0 0 0.25rem 0'
            }}>
              {content.title}
            </h3>
            {content.company && (
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                margin: '0 0 0.125rem 0',
                fontStyle: 'italic'
              }}>
                {content.company}
              </p>
            )}
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#4b5563', 
              margin: 0,
              lineHeight: '1.2'
            }}>
              {content.period}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  const ExperienceBullet = ({ content, expIndex, respIndex }) => {
    console.log('Rendering ExperienceBullet:', { content, expIndex, respIndex });
    return (
      <div style={{ 
        marginLeft: '0.25rem', 
        marginBottom: '0.25rem',
        display: 'flex', 
        alignItems: 'flex-start',
        // border: '1px solid orange',
        padding: '2px'
      }}>
        {/* <div style={{ fontSize: '5px', color: 'white'}}>BULLET</div> */}
        <span style={{ 
          color: '#1e293b', 
          marginRight: '0.5rem', 
          fontSize: '0.875rem',
          lineHeight: '1.25'
        }}>•</span>
        <p style={{ 
          fontSize: '0.885rem', 
          color: '#374151', 
          lineHeight: '1.25', 
          margin: 0 
        }}>
          {content.text}
        </p>
      </div>
    );
  };
  
  const ExperienceSecondPageItem = ({ item }) => {
    console.log('ExperienceSecondPageItem received item:', item);
    
    if (!item) {
      console.warn('ExperienceSecondPageItem: No item provided');
      return <div style={{ color: 'red', fontSize: '12px' }}>NO ITEM</div>;
    }
  
    if (item.type === 'header') {
      return <ExperienceHeader exp={item.exp} content={item.content} />;
    }
  
    if (item.type === 'bullet') {
      return (
        <ExperienceBullet 
          content={item.content} 
          expIndex={item.expIndex}
          respIndex={item.respIndex}
        />
      );
    }
  
    console.warn('ExperienceSecondPageItem: Unknown item type:', item.type);
    return <div style={{ color: 'red', fontSize: '12px' }}>UNKNOWN TYPE: {item.type}</div>;
  };
  
  export default ExperienceSecondPageItem;