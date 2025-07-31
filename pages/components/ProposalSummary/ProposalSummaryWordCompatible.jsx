

import { useEffect, useState } from 'react';

const ProposalSummaryWordFormatted = ({ proposalData, templateType = 'criteria-statement' }) => {
  const [detectedSector, setDetectedSector] = useState('Government');

  // Detect sector
  useEffect(() => {
    if (proposalData) {
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

  if (!proposalData) {
    return (
      <div style={{
        padding: '32px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2 style={{ marginBottom: '16px' }}>Error: No proposal data available</h2>
        <p>Please go back and regenerate the proposal summary.</p>
      </div>
    );
  }

  const candidateName = proposalData.candidateDetails?.name || 'Candidate Name';
  const applicationTitle = proposalData.candidateDetails?.proposedRole || 'Application Response';

  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      padding: '8px 20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1012px',
      margin: '0 auto'
    }}>
      {/* Logos */}
      <table style={{ width: '100%', marginBottom: '8px', borderCollapse: 'collapse', border: 'none' }}>
        <tbody>
          <tr>
            <td style={{ width: '130px', height: '125px', verticalAlign: 'top' }}>
              <img
                src="/PappspmLogo.jpeg"
                alt="Pappspm Logo"
                width="125"
                height="125"
                style={{ objectFit: 'contain', display: 'block', border: 'none' }}
              />
            </td>
            <td style={{ verticalAlign: 'top', paddingTop: '18px' }}>
              <img
                src={templateType === 'consunet' ? "/ConsunetLogo.jpeg" : "/assets/images/SMELogo.jpeg"}
                alt={templateType === 'consunet' ? "Consunet Logo" : "SME Logo"}
                width="175"
                height="125"
                style={{ objectFit: 'contain', display: 'block', border: 'none' }}
              />
            </td>
          </tr>
        </tbody>
      </table>

            {/* Dynamic Sector Header */}
            <table style={{ 
        width: "100%", 
        borderCollapse: "collapse",
        backgroundColor: "#4ECDC4"
      }}>
        <tr>
          <td style={{
            textAlign: 'center',
            padding: '8px 0',        
            backgroundColor: "#4ECDC4",
            border: `1px solid #4ECDC4`
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#000000',
              margin: '0',
              fontFamily: 'Arial, sans-serif'
            }}>
                {detectedSector} Criteria Statement
            </h2>
          </td>
        </tr>
      </table>
      
      {/* Banner */}
      <table style={{ 
        width: "100%", 
        height: "300px",
        borderCollapse: "collapse",
        border: "none",
        marginTop:"8px"
      }}>
        <tr>
          <td style={{ 
            padding: "0", 
            height: "300px",
            textAlign: "center",
            border: "none"
          }}>
            <img 
              src="/assets/images/BannerTenderResponse.jpg" 
              alt="Banner"
              width="623"
              height="300"
              style={{ 
                objectFit: "cover",
                display: "block",
                border: "none"
              }} 
            />
          </td>
        </tr>
      </table>

      {/* Header Section - Following your examples */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
        marginTop: '24px',
      }}>
        <h1 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          margin: '0',
          lineHeight: '1.4',
          color: '#000000'
        }}>
          {candidateName}
        </h1>

        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '5px 0 20px 0',
          lineHeight: '1.4',
          color: '#000000'
        }}>
          {applicationTitle}
        </h3>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '20px 0',
        lineHeight: '1.6'
      }}>
        {/* Proposal Summary Section - Main narrative paragraph */}
        {proposalData.proposalSummary && (
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1e40af',
              marginBottom: '15px',
              textAlign: 'left'
            }}>
              Proposal Summary
            </h3>
            <div style={{
              fontSize: '12px',
              color: 'BLACK',
              lineHeight: '1.6',
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

        {/* Value Proposition Section - if available */}
        {proposalData.valueProposition && (
          <div style={{ marginTop: '20px' }}>
            <div style={{
              fontSize: '11px',
              color: '#374151',
              lineHeight: '1.6',
              textAlign: 'justify',
              whiteSpace: 'pre-line'
            }}>
              {proposalData.valueProposition.content}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        fontSize: '8px',
        color: '#666666'
      }}>
        <p style={{ margin: '0' }}>
          Professional {detectedSector} Sector Proposal Summary | Generated by PappsPM
        </p>
      </div>
    </div>
  );
};

export default ProposalSummaryWordFormatted;