import ExperienceItem from './ExperienceItem';

const HiddenMeasurementArea = ({ experienceLayout, fullExperience }) => {
  if (experienceLayout !== 'paginated') return null;

  return (
    <div style={{ 
      position: 'absolute', 
      visibility: 'hidden', 
      width: '650px',
      left: '-9999px'
    }}>
      {fullExperience.map((exp, index) => (
        <div key={index} id={`exp-measure-${index}`} style={{ marginBottom: '1rem' }}>
          <ExperienceItem exp={exp} />
        </div>
      ))}
    </div>
  );
};

export default HiddenMeasurementArea;