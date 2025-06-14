// // import AdditionalInformation from "./AdditionalInformation";
// // import CandidateDetails from "./CandidateDetails";
// // import DesirableCriteria from "./DesirableCriteria";
// // import EssentialCriteria from "./EssentialCriteria";
// // import Header from "./Header";

// // const TenderResponse = ({ tenderData }) => {
// //   // Check if tenderData exists and has the expected structure
// //   if (!tenderData) {
// //     return (
// //       <div style={{ padding: '2rem', textAlign: 'center' }}>
// //         <h2>Error: No tender data available</h2>
// //         <p>Please go back and regenerate the tender response.</p>
// //       </div>
// //     );
// //   }

// //   const { candidateDetails, essentialCriteria, desirableCriteria, additionalInformation } = tenderData;
  
// //   return (
// //     <div style={{ 
// //       minHeight: '100vh', 
// //       backgroundColor: '#ffffff', 
// //       color: '#000000', 
// //       paddingTop: '2rem',
// //       maxWidth: '1512.8000488px',
// //       margin: '0 auto', 
// //       padding: '2rem',
// //     }}>
// //       <Header candidateName={candidateDetails?.name} jobTitle={candidateDetails?.proposedRole} />
// //       <CandidateDetails candidateDetails={candidateDetails} />
// //       <EssentialCriteria criteria={essentialCriteria} />
// //       {desirableCriteria && desirableCriteria.length > 0 && 
// //         <DesirableCriteria criteria={desirableCriteria} />
// //       }
// //       {additionalInformation && additionalInformation.length > 0 &&
// //         <AdditionalInformation information={additionalInformation} />
// //       }
// //     </div>
// //   );
// // };

// // export default TenderResponse;


// const TenderResponse = ({ tenderData }) => {
//   // Check if tenderData exists and has the expected structure
//   if (!tenderData) {
//     return (
//       <div style={{ padding: '2rem', textAlign: 'center' }}>
//         <h2>Error: No tender data available</h2>
//         <p>Please go back and regenerate the tender response.</p>
//       </div>
//     );
//   }

//   const renderCriteriaRows = (criteriaArray, sectionType) => {
//     if (!criteriaArray || criteriaArray.length === 0) {
//       return (
//         <tr key={`${sectionType}-empty`}>
//           <td colSpan="2" style={{
//             padding: '12px',
//             border: '1px solid #000',
//             textAlign: 'center',
//             fontStyle: 'italic',
//             fontSize: '12px'
//           }}>
//             No {sectionType} criteria available
//           </td>
//         </tr>
//       );
//     }

//     return criteriaArray.map((item, index) => (
//       <tr key={`${sectionType}-${index}`}>
//         <td style={{
//           padding: '12px',
//           border: '1px solid #000',
//           backgroundColor: '#f9f9f9',
//           fontWeight: 'bold',
//           verticalAlign: 'top',
//           width: '25%',
//           fontSize: '12px'
//         }}>
//           {item.requirement || item.criteria || `${sectionType} Requirement ${index + 1}`}
//         </td>
//         <td style={{
//           padding: '12px',
//           border: '1px solid #000',
//           verticalAlign: 'top',
//           fontSize: '12px',
//           lineHeight: '1.5',
//           whiteSpace: 'pre-line'
//         }}>
//           {item.response || 'No response provided'}
//         </td>
//       </tr>
//     ));
//   };

//   // Extract candidate name and application title from tender data
//   const candidateName = tenderData.candidateDetails?.name || 'Candidate Name';
//   const applicationTitle = tenderData.candidateDetails?.proposedRole || 'Application Response';

//   return (
//     <div style={{ 
//       backgroundColor: '#ffffff',
//       minHeight: '100vh',
//       padding: '8px 20px 8px 20px',
//       fontFamily: 'Arial, sans-serif',
//       maxWidth: '1012.8000488px',
//       margin: '0 auto',
//     }}>
    
//       <div>
//         {/* Logos Container */}
//         <div>
//           {/* PappsPM Logo */}
//           <div style={{
//             height: "200px",     
//             width: "195px",
//             display: 'inline-block',
//             verticalAlign: 'top',
//             marginRight: '5px',
//             background: "url(/PappspmLogo.jpeg) no-repeat center center",
//             backgroundSize: 'contain'
//           }}>
//           </div>
          
//           {/* SME Logo */}
//           <div style={{
//             height: '170px',
//             display: 'inline-block',
//             verticalAlign: 'top',
//             marginTop: '18.5px',
//           }}>
//             <img 
//               src="/assets/images/SMELogo.jpeg" 
//               alt="SME Logo" 
//               style={{ 
//                 height: '170px',
//                 maxWidth: '300px',
//                 objectFit: 'contain'
//               }} 
//             />
//           </div>
//         </div>
        
//         {/* Department */}
//         <div style={{
//           textAlign: 'center', 
//           backgroundColor: '#4ECDC4', 
//           padding: '8px 0',
//           marginBottom: '8px',
//         }}>
//           <h2 style={{
//             fontSize: '24px',
//             fontWeight: 'bold',
//             color: '#000',
//             margin: '0'
//           }}>
//             ICT Criteria Statement
//           </h2>
//         </div>
        
//         {/* Banner */}
//         <div style={{
//           backgroundImage: "url('/assets/images/BannerTenderResponse.jpg')",
//           backgroundSize: "cover", 
//           backgroundPosition: "center",
//           width: "100%",
//           height: "300px", 
//         }}>
//         </div>
//       </div>

//       {/* Header */}
//       <div style={{
//         textAlign: 'center',
//         marginBottom: '24px',
//         marginTop: '24px',
//       }}>
//         <h1 style={{
//           fontSize: '16px',
//           fontWeight: 'bold',
//           margin: '0',
//           lineHeight: '1.4'
//         }}>
//           {candidateName}
//         </h1>
//         <h2 style={{
//           fontSize: '16px',
//           fontWeight: 'bold',
//           margin: '5px 0 0 0',
//           lineHeight: '1.4'
//         }}>
//           {applicationTitle}
//         </h2>
//       </div>

//       {/* Main Table */}
//       <table style={{ 
//         width: '100%',
//         borderCollapse: 'collapse',
//         border: '1px solid #000'
//       }}>
//         {/* Table Header */}
//         <thead>
//           <tr>
//             <th style={{
//               padding: '12px',
//               border: '1px solid #000',
//               backgroundColor: '#f0f0f0',
//               fontWeight: 'bold',
//               textAlign: 'left',
//               fontSize: '12px',
//               width: '25%'
//             }}>
//               Criteria
//             </th>
//             <th style={{
//               padding: '12px',
//               border: '1px solid #000',
//               backgroundColor: '#f0f0f0',
//               fontWeight: 'bold',
//               textAlign: 'left',
//               fontSize: '12px'
//             }}>
//               Candidate response
//             </th>
//           </tr>
//         </thead>
        
//         <tbody>
//           {/* Essential Section Header */}
//           <tr>
//             <td 
//               colSpan="2" 
//               style={{
//                 padding: '12px',
//                 border: '1px solid #000',
//                 backgroundColor: '#e0e0e0',
//                 fontWeight: 'bold',
//                 textAlign: 'center',
//                 fontSize: '12px'
//               }}
//             >
//               Essential
//             </td>
//           </tr>
          
//           {/* Essential Criteria Rows */}
//           {renderCriteriaRows(tenderData.essentialCriteria, 'essential')}
          
//           {/* Desirable Section Header - Only show if desirable criteria exist */}
//           {tenderData.desirableCriteria && tenderData.desirableCriteria.length > 0 && (
//             <>
//               <tr>
//                 <td 
//                   colSpan="2" 
//                   style={{
//                     padding: '12px',
//                     border: '1px solid #000',
//                     backgroundColor: '#e0e0e0',
//                     fontWeight: 'bold',
//                     textAlign: 'center',
//                     fontSize: '12px'
//                   }}
//                 >
//                   Desirable
//                 </td>
//               </tr>
              
//               {/* Desirable Criteria Rows */}
//               {renderCriteriaRows(tenderData.desirableCriteria, 'desirable')}
//             </>
//           )}

//           {/* Additional Information Section - Only show if it exists */}
//           {tenderData.additionalInformation && tenderData.additionalInformation.length > 0 && (
//             <>
//               <tr>
//                 <td 
//                   colSpan="2" 
//                   style={{
//                     padding: '12px',
//                     border: '1px solid #000',
//                     backgroundColor: '#e0e0e0',
//                     fontWeight: 'bold',
//                     textAlign: 'center',
//                     fontSize: '12px'
//                   }}
//                 >
//                   Additional Information
//                 </td>
//               </tr>
              
//               {/* Additional Information Rows */}
//               {renderCriteriaRows(tenderData.additionalInformation, 'additional')}
//             </>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TenderResponse;

import { useEffect, useState } from 'react';

const TenderResponse = ({ tenderData }) => {
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
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error: No tender data available</h2>
        <p>Please go back and regenerate the tender response.</p>
      </div>
    );
  }

  const renderCriteriaRows = (criteriaArray, sectionType) => {
    if (!criteriaArray || criteriaArray.length === 0) {
      return (
        <tr key={`${sectionType}-empty`}>
          <td colSpan="2" style={{
            padding: '12px',
            border: '1px solid #000',
            textAlign: 'center',
            fontStyle: 'italic',
            fontSize: '12px'
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
          border: '1px solid #000',
          backgroundColor: '#f9f9f9',
          fontWeight: 'bold',
          verticalAlign: 'top',
          width: '25%',
          fontSize: '12px'
        }}>
          {item.requirement || item.criteria || `${sectionType} Requirement ${index + 1}`}
        </td>
        <td style={{
          padding: '12px',
          border: '1px solid #000',
          verticalAlign: 'top',
          fontSize: '12px',
          lineHeight: '1.5',
          whiteSpace: 'pre-line'
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
          
          {/* SME Logo */}
          <div style={{
            height: '170px',
            display: 'inline-block',
            verticalAlign: 'top',
            marginTop: '18.5px',
          }}>
            <img 
              src="/assets/images/SMELogo.jpeg" 
              alt="SME Logo" 
              style={{ 
                height: '170px',
                maxWidth: '300px',
                objectFit: 'contain'
              }} 
            />
          </div>
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
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '0',
          lineHeight: '1.4'
        }}>
          {candidateName}
        </h1>
        <h2 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '5px 0 0 0',
          lineHeight: '1.4'
        }}>
          {applicationTitle}
        </h2>
      </div>
      {/* Main Table */}
      <table style={{ 
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #000'
      }}>
        {/* Table Header */}
        <thead>
          <tr>
            <th style={{
              padding: '12px',
              border: '1px solid #000',
              backgroundColor: '#f0f0f0',
              fontWeight: 'bold',
              textAlign: 'left',
              fontSize: '12px',
              width: '25%'
            }}>
              Criteria
            </th>
            <th style={{
              padding: '12px',
              border: '1px solid #000',
              backgroundColor: '#f0f0f0',
              fontWeight: 'bold',
              textAlign: 'left',
              fontSize: '12px'
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
                border: '1px solid #000',
                backgroundColor: '#e0e0e0',
                fontWeight: 'bold',
                // textAlign: 'center',
                fontSize: '12px'
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
                    border: '1px solid #000',
                    backgroundColor: '#e0e0e0',
                    fontWeight: 'bold',
                    // textAlign: 'center',
                    fontSize: '12px'
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
                    border: '1px solid #000',
                    backgroundColor: '#e0e0e0',
                    fontWeight: 'bold',
                    // textAlign: 'center',
                    fontSize: '12px'
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
        color: '#666'
      }}>
        <p>Professional {detectedSector} Sector Tender Response | Generated by PappsPM</p>
      </div>
    </div>
  );
};

export default TenderResponse;