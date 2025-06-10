import PappsLogo from "./PappsLogo";
const PageHeader = ({ resumeData}) => (
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
      {/* Left side - Logos container */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '12px' // Small gap between logos
      }}>
        {/* Left side - PappsPM logo */}
        <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10
      }}>
        <PappsLogo />
      </div>  
        {/* <img 
          src="/SMELogo.jpeg" 
          alt="SMEGATEway Logo" 
          style={{ 
            height: '70px', 
            width: 'auto',
            objectFit: 'contain'
          }}
        /> */}
      </div>
      
      {/* Center - Name and Title */}
      <div style={{ textAlign: 'center', flex: 1 }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          margin: 0,
          color: 'white',
          letterSpacing: '0.1em'
        }}>
          {resumeData.profile.name}
        </h1>
        <div style={{ 
          color: '#fbbf24', 
          fontSize: '0.875rem', 
          fontWeight: 'normal', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          marginTop: '0.25rem'
        }}>
          {resumeData.profile.title}
        </div>
      </div>
     
    </div>
  );
  
  export default PageHeader;