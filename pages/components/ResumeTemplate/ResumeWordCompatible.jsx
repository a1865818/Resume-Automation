


import FirstPageWord from './FirstPageWord';
import SecondPageWord from './SecondPageWord';

const ResumeWordCompatible = ({ resumeData, mainExperience, experienceLayout, getExperiencePages, pageHeight }) => {
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
      marginBottom: '50px',
      // Add Word-specific styles for document generation
      '@page': {
        size: 'A4 landscape',
        // margin: '0.5in'
      }
    }}>
      {/* First Page - Profile, Skills, Referees, Main Experience */}
      <FirstPageWord 
        resumeData={resumeData}
        mainExperience={mainExperience}
        scaleFactor={scaleFactor}
        wordPageWidth={wordPageWidth}
        wordPageHeight={wordPageHeight}
      />
      
    <br />


      
      {/* Additional Experience Pages - Will start on new page in Word */}
      <SecondPageWord 
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

export default ResumeWordCompatible;