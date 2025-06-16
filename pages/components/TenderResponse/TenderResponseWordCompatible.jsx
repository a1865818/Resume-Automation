import { useEffect, useState } from 'react';

const TenderResponseWordCompatible = ({ tenderData }) => {
  const [detectedSector, setDetectedSector] = useState('Government');

  // Detect sector from tender data
  useEffect(() => {
    if (tenderData) {
      const proposedRole = tenderData.candidateDetails?.proposedRole || '';
      const allText = JSON.stringify(tenderData).toLowerCase();
      
      const sectorKeywords = {
        'ICT': ['ict', 'it', 'information technology', 'digital', 'software', 'systems', 'technology'],
        'Defence': ['defence', 'defense', 'military', 'security', 'army', 'navy', 'air force'],
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
  }, [tenderData]);

  // Check if tenderData exists and has the expected structure
  if (!tenderData) {
    return (
      <div style={{ 
        padding: '32px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif' 
      }}>
        <h2 style={{ margin: '0 0 16px 0' }}>Error: No tender data available</h2>
        <p style={{ margin: '0' }}>Please go back and regenerate the tender response.</p>
      </div>
    );
  }

  const renderCriteriaRows = (criteriaArray, sectionType) => {
    if (!criteriaArray || criteriaArray.length === 0) {
      return (
        <tr key={`${sectionType}-empty`}>
          <td colSpan="2" style={{
            padding: '12px',
            border: '1px solid #000000',
            textAlign: 'center',
            fontStyle: 'italic',
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif'
          }}>
            No {sectionType} criteria available
          </td>
        </tr>
      );
    }

    return criteriaArray.map((item, index) => (
      <tr key={`${sectionType}-${index}`}>
        <td style={{
          padding: '12px',
          border: '1px solid #000000',
          backgroundColor: '#f9f9f9',
          fontWeight: 'bold',
          verticalAlign: 'top',
          width: '25%',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif'
        }}>
          {item.requirement || item.criteria || `${sectionType} Requirement ${index + 1}`}
        </td>
        <td style={{
          padding: '12px',
          border: '1px solid #000000',
          verticalAlign: 'top',
          fontSize: '12px',
          lineHeight: '1.5',
          whiteSpace: 'pre-line',
          fontFamily: 'Arial, sans-serif'
        }}>
          {item.response || 'No response provided'}
        </td>
      </tr>
    ));
  };

  // Extract candidate name and application title from tender data
  const candidateName = tenderData.candidateDetails?.name || 'Candidate Name';
  const applicationTitle = tenderData.candidateDetails?.proposedRole || 'Application Response';

  // Sector-specific styling and headers
  const sectorColors = {
    'ICT': '#4ECDC4',
    'Defence': '#2C3E50',
    'Finance': '#27AE60',
    'Health': '#E74C3C',
    'Education': '#9B59B6',
    'Infrastructure': '#F39C12',
    'Environment': '#16A085',
    'Legal': '#34495E',
    'Government': '#4ECDC4' // Default
  };

  const sectorHeaders = {
    'ICT': 'ICT Criteria Statement',
    'Defence': 'Defence Criteria Statement',
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

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      padding: '8px 20px 8px 20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1012px',
      margin: '0 auto',
    }}>
      {/* Header section with logos - using table for better Word compatibility */}
        <table style={{ width: '100%', marginBottom: '8px', borderCollapse: 'collapse', border: 'none' }}>
        <tbody>
            <tr>
            <td style={{ 
                width: '130px', 
                height: '125px',
                verticalAlign: 'top',
                // padding: '0 5px 0 0',
                border: 'none'
            }}>
                <img
                src="/PappspmLogo.jpeg"
                alt="Pappspm Logo"
                width="125"
                height="125"
                style={{
                    objectFit: 'contain',
                    display: 'block',
                    border: 'none'
                }}
                />
            </td>
            <td style={{ 
                verticalAlign: 'top',
                paddingTop: '18px',
                border: 'none'
            }}>
              <img 
                src="/assets/images/SMELogo.jpeg" 
                alt="SME Logo" 
                width="175"
                height="125"
                style={{ 
                
                    objectFit: 'contain',
                    display: 'block',
                    border: 'none'
                }} 
                />
            </td>
            </tr>
        </tbody>
        </table>

      
      {/* Dynamic Sector Header */}
      <table style={{ 
  width: "100%", 
  borderCollapse: "collapse",
  backgroundColor: headerColor
}}>
  <tr>
    <td style={{
      textAlign: 'center',
      padding: '8px 0',        
      backgroundColor: headerColor,
      border: `1px solid ${headerColor}`

    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#000000',
        margin: '0',
        fontFamily: 'Arial, sans-serif'
      }}>
        {headerText}
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

      {/* Candidate Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
        marginTop: '24px',
      }}>
        <h1 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '0',
          lineHeight: '1.4',
          fontFamily: 'Arial, sans-serif'
        }}>
          {candidateName}
        </h1>
        <h2 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '5px 0 0 0',
          lineHeight: '1.4',
          fontFamily: 'Arial, sans-serif'
        }}>
          {applicationTitle}
        </h2>
      </div>

      {/* Main Table */}
      <table style={{ 
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #000000'
      }}>
        {/* Table Header */}
        <thead>
          <tr>
            <th style={{
              padding: '12px',
              border: '1px solid #000000',
              backgroundColor: '#f0f0f0',
              fontWeight: 'bold',
              textAlign: 'left',
              fontSize: '12px',
              width: '25%',
              fontFamily: 'Arial, sans-serif'
            }}>
              Criteria
            </th>
            <th style={{
              padding: '12px',
              border: '1px solid #000000',
              backgroundColor: '#f0f0f0',
              fontWeight: 'bold',
              textAlign: 'left',
              fontSize: '12px',
              fontFamily: 'Arial, sans-serif'
            }}>
              Candidate response
            </th>
          </tr>
        </thead>
        
        <tbody>
          {/* Essential Section Header */}
          <tr>
            <td 
              colSpan="2" 
              style={{
                padding: '12px',
                border: '1px solid #000000',
                backgroundColor: '#e0e0e0',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              Essential
            </td>
          </tr>
          
          {/* Essential Criteria Rows */}
          {renderCriteriaRows(tenderData.essentialCriteria, 'essential')}
          
          {/* Desirable Section Header - Only show if desirable criteria exist */}
          {tenderData.desirableCriteria && tenderData.desirableCriteria.length > 0 && (
            <>
              <tr>
                <td 
                  colSpan="2" 
                  style={{
                    padding: '12px',
                    border: '1px solid #000000',
                    backgroundColor: '#e0e0e0',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  Desirable
                </td>
              </tr>
              
              {/* Desirable Criteria Rows */}
              {renderCriteriaRows(tenderData.desirableCriteria, 'desirable')}
            </>
          )}

          {/* Additional Information Section - Only show if it exists */}
          {tenderData.additionalInformation && tenderData.additionalInformation.length > 0 && (
            <>
              <tr>
                <td 
                  colSpan="2" 
                  style={{
                    padding: '12px',
                    border: '1px solid #000000',
                    backgroundColor: '#e0e0e0',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  Additional Information
                </td>
              </tr>
              
              {/* Additional Information Rows */}
              {renderCriteriaRows(tenderData.additionalInformation, 'additional')}
            </>
          )}
        </tbody>
      </table>

      {/* Footer with sector information */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '10px',
        color: '#666666',
        fontFamily: 'Arial, sans-serif'
      }}>
        <p style={{ margin: '0' }}>
          Professional {detectedSector} Sector Tender Response | Generated by PappsPM
        </p>
      </div>
    </div>
  );
};

export default TenderResponseWordCompatible;