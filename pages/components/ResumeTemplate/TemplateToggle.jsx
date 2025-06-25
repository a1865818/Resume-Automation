
const TemplateToggle = ({ templateType, setTemplateType }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '1.5rem', 
      gap: '10px' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '10px 15px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <span style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#374151' 
        }}>
          Resume Template:
        </span>
        
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px', 
          cursor: 'pointer' 
        }}>
          <input 
            type="radio" 
            name="templateType" 
            value="sme-gateway"
            checked={templateType === 'sme-gateway'}
            onChange={(e) => setTemplateType(e.target.value)}
          />
          <span style={{ fontSize: '14px' }}>SME Gateway</span>
        </label>
        
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px', 
          cursor: 'pointer' 
        }}>
          <input 
            type="radio" 
            name="templateType" 
            value="default"
            checked={templateType === 'default'}
            onChange={(e) => setTemplateType(e.target.value)}
          />
          <span style={{ fontSize: '14px' }}>Papps Only</span>
        </label>
      </div>
      
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        color: '#0369a1',
        padding: '10px 15px', 
        borderRadius: '8px',
        fontSize: '14px',
        border: '1px solid #bae6fd',
        display: 'flex',
        alignItems: 'center'
      }}>
        {templateType === 'sme-gateway' 
          ? '🏢 SME Gateway branding with dual logos'
          : '🎯 Clean design with Papps logo only'
        }
      </div>
    </div>
  );
};

export default TemplateToggle;