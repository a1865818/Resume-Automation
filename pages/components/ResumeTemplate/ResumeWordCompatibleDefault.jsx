import FirstPageWordDefault from "./FirstPageWordDefault";
import SecondPageWordDefault from "./SecondPageWordDefault";
const ResumeWordCompatibleDefault = ({ 
  resumeData, 
  mainExperience, 
  experienceLayout, 
  getExperiencePages, 
  pageHeight,

}) => {
  // Word landscape dimensions (A4 landscape at 96 DPI)
  const wordPageWidth = 1123; // A4 landscape width in pixels
  const wordPageHeight = 794; // A4 landscape height in pixels
  
  // Original web dimensions
  const webPageWidth = 1512.8;
  
  // Calculate scaling factor for landscape orientation
  const scaleFactor = wordPageWidth / webPageWidth; // ≈ 0.74

  return (
    <div style={{
      fontFamily: "'Montserrat', 'Arial', sans-serif",
      '@page': {
        size: 'A4 landscape',
      }
    }}>
      {/* First Page - Profile, Skills, Referees, Main Experience */}
      <FirstPageWordDefault
        resumeData={resumeData}
        mainExperience={mainExperience}
        scaleFactor={scaleFactor}
        wordPageWidth={wordPageWidth}
        wordPageHeight={wordPageHeight}
    
      />
      
      <br />
      
      {/* Additional Experience Pages */}
      <SecondPageWordDefault
        resumeData={resumeData}
        experienceLayout={experienceLayout}
        getExperiencePages={getExperiencePages}
        scaleFactor={scaleFactor}
        wordPageWidth={wordPageWidth}
        wordPageHeight={wordPageHeight}

      />
    </div>
  );
};
export default ResumeWordCompatibleDefault;