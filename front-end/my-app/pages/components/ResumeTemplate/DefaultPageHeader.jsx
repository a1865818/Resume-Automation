const PageHeader = ({ resumeData }) => (
    <div style={{ 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      height: '155px',
    }}>
      {/* Left side - PappsPM logo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10
      }}>
        <div style={{
          position: "relative",
          overflow: "hidden",
          height: "200px",     
          width: "195px",      
          top: "-24.5px"
        }}>
          <div style={{
            background: "url(/assets/images/rectangle.png) 100% / contain no-repeat",
            height: "100.98%",
            width: "100.12%",
          }}></div>
        </div>
      </div>
  
      {/* Center - Name and Title */}
      <div style={{ 
        textAlign: 'center', 
        flex: 1,
        zIndex: 5
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          margin: 0,
          color: 'white',
          letterSpacing: '0.1em'
        }}>
          {resumeData.profile.name}
        </h1>
        <div style={{ 
        //   color: '#fbbf24', 
        color: 'white',
        //   fontSize: '0.875rem', 
          fontSize: '1.25rem', 

          fontWeight: 'normal', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          marginTop: '0.25rem'
        }}>
          {resumeData.profile.title}
        </div>
      </div>
  
      {/* Right side - SME logo */}
      <div style={{
        position: 'absolute',
        top: 3,
        right: 0,
        height: '155px',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '0.55rem'

        // paddingRight: '1.5rem'
      }}>
        <img 
          src="/assets/images/DecorationTopRightWord.jpeg" 
          alt="Second Page Decoration Right" 
          style={{ 
            height: '137px',
            maxWidth: '300px',
            objectFit: 'contain'
          }} 
        />
      </div>
    </div>
  );
  
  export default PageHeader;