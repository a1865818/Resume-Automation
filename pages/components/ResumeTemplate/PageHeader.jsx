const PageHeader = ({ resumeData}) => (
    <div style={{ 
      backgroundColor: '#1e293b', 
      color: 'white', 
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Left side - Logos container */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '12px' // Small gap between logos
      }}>
        <img 
          src="/PappspmLogo.jpeg" 
          alt="PappsPM" 
          style={{ 
            height: '70px', 
            width: 'auto',
            objectFit: 'contain'
          }}
        />
        <img 
          src="/SMELogo.jpeg" 
          alt="SMEGATEway Logo" 
          style={{ 
            height: '70px', 
            width: 'auto',
            objectFit: 'contain'
          }}
        />
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
      
      {/* Right side - empty for balance */}
      <div style={{ width: '120px' }}></div>
    </div>
  );
  
  export default PageHeader;