import AdditionalInformation from './components/TenderResponse/AdditionalInformation';
import CandidateDetails from './components/TenderResponse/CandidateDetails';
import DesirableCriteria from './components/TenderResponse/DesirableCriteria';
import EssentialCriteria from './components/TenderResponse/EssentialCriteria';
import Header from './components/TenderResponse/Header';

const TenderResponse = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', 
      color: '#000000', 
      paddingTop: '2rem',
      maxWidth: '1512.8000488px',
      margin: '0 auto' 
    }}>
      <Header />
      <CandidateDetails />
      <EssentialCriteria />
      <DesirableCriteria />
      <AdditionalInformation />
    </div>
  );
};

export default TenderResponse;