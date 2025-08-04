const Header = ({ candidateName, jobTitle }) => {
  const displayName = candidateName || '[Candidate Name]';
  const displayTitle = jobTitle || '[Job Title]';
  
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      borderBottom: '3px solid #f3f4f6',
      paddingBottom: '1rem'
    }}>
      <div>
        <h1 style={{ 
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          Tender Response – {displayName}
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#4b5563' }}>
          {displayTitle}
        </p>
      </div>
      
      <div >
        <img 
                  src="/PappspmLogo.jpeg" 
                  alt="PappsPM" 
                  style={{ 
                    height: '90px',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
      </div>
    </div>
  );
};

export default Header;