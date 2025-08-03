import { useEffect, useState } from 'react';

const ProposalSummary = ({ proposalData, templateType = 'criteria-statement' }) => {
  const [detectedSector, setDetectedSector] = useState('Government');

  // Detect sector from proposal data
  useEffect(() => {
    if (proposalData) {
      const proposedRole = proposalData.candidateDetails?.proposedRole || '';
      const allText = JSON.stringify(proposalData).toLowerCase();
      
      const sectorKeywords = {
        'ICT': ['ict', 'it', 'information technology', 'digital', 'software', 'systems', 'technology', 'business analyst'],
        'Defence': ['defence', 'defense', 'military', 'security', 'army', 'navy', 'air force'],
        'Maritime': ['maritime', 'marine', 'vessel', 'ship', 'port', 'navigation', 'safety authority'],
        'Finance': ['finance', 'financial', 'accounting', 'treasury', 'budget', 'fiscal'],
        'Health': ['health', 'medical', 'healthcare', 'hospital', 'clinical', 'patient'],
        'Education': ['education', 'school', 'university', 'teaching', 'academic'],
        'Infrastructure': ['infrastructure', 'construction', 'engineering', 'transport'],
        'Environment': ['environment', 'sustainability', 'climate', 'conservation'],
        'Legal': ['legal', 'law', 'judicial', 'court', 'legislation', 'compliance']
      };

      for (const [sector, keywords] of Object.entries(sectorKeywords)) {
        if (keywords.some(keyword => allText.includes(keyword))) {
          setDetectedSector(sector);
          return;
        }
      }
    }
  }, [proposalData]);

  // Check if proposalData exists and has the expected structure
  if (!proposalData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error: No proposal data available</h2>
        <p>Please go back and regenerate the proposal summary.</p>
      </div>
    );
  }

  // Extract candidate name and application title from proposal data
  const candidateName = proposalData.candidateDetails?.name || 'Candidate Name';
  const applicationTitle = proposalData.candidateDetails?.proposedRole || 'Application Response';
  const responseFormat = proposalData.candidateDetails?.responseFormat || '';

  // Sector-specific styling and headers
  const sectorColors = {
    'ICT': '#4ECDC4',
    'Defence': '#4ECDC4',
    'Maritime': '#4ECDC4',
    'Finance': '#4ECDC4',
    'Health': '#4ECDC4',
    'Education': '#4ECDC4',
    'Infrastructure': '#4ECDC4',
    'Environment': '#4ECDC4',
    'Legal': '#4ECDC4',
    'Government': '#4ECDC4' // Default
  };

  const sectorHeaders = {
    'ICT': 'ICT Criteria Statement',
    'Defence': 'Defence Criteria Statement',
    'Maritime': 'Maritime Criteria Statement',
    'Finance': 'Finance Criteria Statement',
    'Health': 'Health Criteria Statement',
    'Education': 'Education Criteria Statement',
    'Infrastructure': 'Infrastructure Criteria Statement',
    'Environment': 'Environment Criteria Statement',
    'Legal': 'Legal Criteria Statement',
    'Government': 'Government Criteria Statement'
  };

  const headerColor = sectorColors[detectedSector] || sectorColors['Government'];
  const headerText = sectorHeaders[detectedSector] || sectorHeaders['Government'];

  console.log("Proposal Summary from AI:", proposalData);

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      padding: '8px 20px 8px 20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1012.8000488px',
      margin: '0 auto',
    }}>
    
      <div>
        {/* Logos Container */}
        <div>
          {/* PappsPM Logo */}
          <div style={{
            height: "200px",     
            width: "195px",
            display: 'inline-block',
            verticalAlign: 'top',
            marginRight: '5px',
            background: "url(/PappspmLogo.jpeg) no-repeat center center",
            backgroundSize: 'contain'
          }}>
          </div>
          
          {/* SME/Consunet Logo - only if not default */}
          {templateType !== 'default' && (
            <div style={{
              height: '170px',
              display: 'inline-block',
              verticalAlign: 'top',
              marginTop: '18.5px',
            }}>
              <img
                src={templateType === 'consunet' ? "/ConsunetLogo.jpeg" : "/assets/images/SMELogo.jpeg"}
                alt={templateType === 'consunet' ? "Consunet Logo" : "SME Logo"}
                style={{
                  height: '170px',
                  maxWidth: '300px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
        </div>
        
        {/* Dynamic Sector Header */}
        <div style={{
          textAlign: 'center', 
          backgroundColor: headerColor, 
          padding: '8px 0',
          marginBottom: '8px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#000',
            margin: '0'
          }}>
            {headerText}
          </h2>
        </div>
        
        {/* Banner */}
        <div style={{
          backgroundImage: "url('/assets/images/BannerTenderResponse.jpg')",
          backgroundSize: "cover", 
          backgroundPosition: "center",
          width: "100%",
          height: "300px", 
        }}>
        </div>
      </div>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
        marginTop: '24px',
      }}>
        <h1 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000',
          margin: '0',
          lineHeight: '1.25'
        }}>
          {candidateName}
        </h1>
        <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#000',
          margin: '5px 0 0 0',
          lineHeight: '1.25'
        }}>
          {applicationTitle}
        </h2>
      </div>

      {/* Main Content */}
      <div style={{

        lineHeight: '1.4'
      }}>
        {/* Proposal Summary Section */}
        {proposalData.proposalSummary && (
          <div >
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1e40af',
              marginBottom: '15px',
              textAlign: 'left',

            }}>
              Proposal Summary
            </h3>
            <div style={{
              fontSize: '14px',
              color: 'black',
              lineHeight: '1.4',
              textAlign: 'justify',
              whiteSpace: 'pre-line'
            }}>
                 {proposalData.proposalSummary.content.split('\n\n').map((paragraph, index) => (
                <p key={index} style={{
                  marginBottom: index < proposalData.proposalSummary.content.split('\n\n').length - 1 ? '15px' : '0',
                  margin: '0 0 15px 0',
                  textAlign: 'justify'
                }}>
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Key Highlights Section */}
        {/* {proposalData.valueProposition && (
          <div >
            <div style={{
              fontSize: '12px',
              color: 'black',
              lineHeight: '1.7',
              textAlign: 'justify',
              whiteSpace: 'pre-line'
            }}>
              {proposalData.valueProposition.content}
            </div>
          </div>
        )} */}

        {/* Value Proposition Section */}
        {/* {proposalData.valueProposition && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '15px',
              borderBottom: '2px solid ' + headerColor,
              paddingBottom: '5px'
            }}>
              {proposalData.valueProposition.title || `Value to ${detectedSector} Department`}
            </h3>
            <div style={{
              fontSize: '12px',
              color: '#374151',
              lineHeight: '1.7',
              textAlign: 'justify',
              whiteSpace: 'pre-line'
            }}>
              {proposalData.valueProposition.content}
            </div>
          </div>
        )} */}


        {/* Value Proposition Section - if available */}
        {proposalData.valueProposition && (
          <div style={{ marginTop: '20px' }}>
            <div style={{
              fontSize: '14px',
              color: 'black',
              lineHeight: '1.4',
              textAlign: 'justify',
              whiteSpace: 'pre-line'
            }}>
              {proposalData.valueProposition.content}
            </div>
          </div>
        )}
      </div>

      {/* Footer with sector information */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '10px',
        color: '#666'
      }}>
        <p>Professional {detectedSector} Sector Proposal Summary | Generated by PappsPM</p>
      </div>
    </div>
  );
};

export default ProposalSummary;