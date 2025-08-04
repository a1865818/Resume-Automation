
const ContactSection = ({ resumeData }) => {
  if (!resumeData.contact?.email && !resumeData.contact?.phone && !resumeData.contact?.linkedin) {
    return null;
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 'bold', 
        color: '#1e293b', 
        letterSpacing: '0.01em',
        margin: '0 0 0.5rem 0'
      }}>
        CONTACT
      </h2>
      <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {resumeData.contact?.email && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: '#1e293b', minWidth: '20px' }}>Email:</span>
            <span style={{ color: '#374151', marginLeft: '0.5rem' }}>{resumeData.contact.email}</span>
          </div>
        )}
        {resumeData.contact?.phone && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: '#1e293b', minWidth: '20px' }}>Phone:</span>
            <span style={{ color: '#374151', marginLeft: '0.5rem' }}>{resumeData.contact.phone}</span>
          </div>
        )}
        {resumeData.contact?.linkedin && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: '#1e293b', minWidth: '20px' }}>Linkedin:</span>
            <span style={{ color: '#374151', marginLeft: '0.5rem', wordBreak: 'break-all' }}>{resumeData.contact.linkedin}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
