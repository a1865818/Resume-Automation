
const ExperienceLayoutControls = ({
  experienceLayout,
  setExperienceLayout,
  mainExperience,
  fullExperience,
  experiencePages
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', gap: '10px' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '10px 15px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
          Experience Layout:
        </span>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input 
            type="radio" 
            name="experienceLayout" 
            value="summary"
            checked={experienceLayout === 'summary'}
            onChange={(e) => setExperienceLayout(e.target.value)}
          />
          <span style={{ fontSize: '14px' }}>Summary Only</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input 
            type="radio" 
            name="experienceLayout" 
            value="paginated"
            checked={experienceLayout === 'paginated'}
            onChange={(e) => setExperienceLayout(e.target.value)}
          />
          <span style={{ fontSize: '14px' }}>Full Experience (Paginated)</span>
        </label>
      </div>
      
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        color: '#0369a1',
        padding: '10px 15px', 
        borderRadius: '8px',
        fontSize: '14px',
        border: '1px solid #bae6fd'
      }}>
        {experienceLayout === 'summary' 
          ? `${mainExperience.length} recent positions • 1 page`
          : `${fullExperience.length} total positions • ${experiencePages.length + 1} page${experiencePages.length !== 0 ? 's' : ''} • Height-aware pagination`
        }
      </div>
    </div>
  );
};

export default ExperienceLayoutControls;