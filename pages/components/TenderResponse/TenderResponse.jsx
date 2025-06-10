import AdditionalInformation from "./AdditionalInformation";
import CandidateDetails from "./CandidateDetails";
import DesirableCriteria from "./DesirableCriteria";
import EssentialCriteria from "./EssentialCriteria";
import Header from "./Header";

const TenderResponse = ({ tenderData }) => {
  // Check if tenderData exists and has the expected structure
  if (!tenderData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error: No tender data available</h2>
        <p>Please go back and regenerate the tender response.</p>
      </div>
    );
  }

  const { candidateDetails, essentialCriteria, desirableCriteria, additionalInformation } = tenderData;
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', 
      color: '#000000', 
      paddingTop: '2rem',
      maxWidth: '1512.8000488px',
      margin: '0 auto', 
      padding: '2rem',
    }}>
      <Header candidateName={candidateDetails?.name} jobTitle={candidateDetails?.proposedRole} />
      <CandidateDetails candidateDetails={candidateDetails} />
      <EssentialCriteria criteria={essentialCriteria} />
      {desirableCriteria && desirableCriteria.length > 0 && 
        <DesirableCriteria criteria={desirableCriteria} />
      }
      {additionalInformation && additionalInformation.length > 0 &&
        <AdditionalInformation information={additionalInformation} />
      }
    </div>
  );
};

export default TenderResponse;