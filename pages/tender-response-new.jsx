import { useState } from 'react';

const TenderResponse = () => {
  // Data structure matching the Word document
  const [tenderData] = useState({
    candidateName: "Tony Nguyen",
    applicationTitle: "Application Response to National Messaging System (NMS) Project Support Office",
    essentialCriteria: [
      {
        criteria: "Summary",
        response: "Tony Nguyen is an accomplished IT Program Manager with over 20 years of experience in ICT project and program management. His expertise lies in delivering complex business transformation initiatives, optimizing governance structures, and ensuring compliance with industry and government standards. His leadership roles at IBM, Westpac, and Vodafone showcase his ability to manage multimillion-dollar portfolios, engage stakeholders effectively, and implement structured methodologies to drive high-impact outcomes."
      },
      {
        criteria: "Skills, Knowledge, and Experience Relevant to the Role",
        response: `Tony possesses a strong foundation in project governance, risk management, and compliance, essential for the successful delivery of Defence-related initiatives. His ability to navigate intricate government frameworks ensures alignment with Defence priorities, a skill demonstrated in his tenure leading large-scale transformation projects.

• ICT Project Management & Policy Expertise:
Tony's extensive experience managing high-profile ICT programs aligns with the requirements of the NMS Project Support Officer role. His leadership in digital transformation—implementing Agile, DevOps, and AI-driven solutions—demonstrates his ability to drive structured methodologies, optimize resource allocation, and ensure policy compliance.

• Stakeholder Engagement & Communication:
Having led teams of up to 500 IT professionals, Tony has a proven ability to foster collaboration, communicate complex technical concepts, and maintain transparency with stakeholders. His capacity to manage executive relationships and facilitate strategic planning has resulted in high stakeholder satisfaction and project success.

• Strategic & Analytical Thinking:
His expertise in project governance and risk management allows him to analyze critical challenges and implement effective solutions. His work overseeing transformation initiatives for IBM and Westpac highlights his aptitude for applying structured thinking to optimize project outcomes, ensuring alignment with compliance frameworks.`
      },
      {
        criteria: "Interest in the Role & Contributions",
        response: "Tony is eager to contribute his expertise to the NMS project, recognizing the importance of secure and scalable ICT solutions within Defence environments. His ability to drive structured project governance, optimize workflows, and engage stakeholders positions him as an ideal candidate to support the national messaging initiative."
      },
      {
        criteria: "Key Achievements Demonstrating Ability to Perform the Role",
        response: `• Successfully led digital transformation programs, improving process efficiency by over 25%, showcasing his ability to manage high-level operational tasks efficiently.

• Delivered high-stakes ICT projects within government and Defence-related environments, ensuring security compliance and operational alignment.

• Managed complex stakeholder relationships, ensuring seamless collaboration across multi-tiered governance structures and achieving high satisfaction ratings.`
      }
    ],
    desirableCriteria: [
      {
        criteria: "Summary",
        response: "Tony embodies the qualities of an ideal candidate, bringing enthusiasm, extensive experience, and self-driven motivation to deliver high-quality outcomes within structured environments. His leadership experience in managing multimillion-dollar ICT portfolios has equipped him with a solution-focused approach, critical thinking skills, and a collaborative mindset—all essential for the success of the NMS project."
      },
      {
        criteria: "Ability to Apply Judgment & Achieve Critical Outcomes",
        response: "Tony's leadership in overseeing multimillion-dollar ICT programs underscores his ability to assess risks, implement mitigation strategies, and optimize resources. His structured decision-making process ensures project objectives are met efficiently, reducing operational risks and maximizing performance outcomes."
      },
      {
        criteria: "Critical Thinking & Persuasive Communication",
        response: "With expertise in governance frameworks, process optimization, and security compliance, Tony applies critical thinking to streamline ICT project execution. His ability to articulate complex concepts clearly has led to significant process improvements, ensuring high engagement across stakeholders, executives, and cross-functional teams."
      },
      {
        criteria: "Listening & Effective Communication Skill",
        response: "Tony thrives in environments that require strategic communication, evidenced by his role in managing IBM's Asia Pacific CIO team. His experience leading large-scale transformation projects demonstrates his ability to maintain clarity in executive communications, ensuring alignment with Defence objectives."
      },
      {
        criteria: "Ability to Work in a Collaborative Team Environment",
        response: "Leading cross-functional teams of up to 500 IT professionals, Tony has fostered collaboration across international and Defence-related projects. His adaptability in structured and dynamic settings ensures seamless coordination among stakeholders, making him an asset in fast-paced team environments."
      },
      {
        criteria: "Trustworthiness, Transparency & Integrity",
        response: "Tony's dedication to maintaining the highest ethical standards is evident in his commitment to governance and security compliance. His ability to navigate complex regulatory requirements within Defence environments underscores his integrity and professionalism, ensuring operational trustworthiness."
      },
      {
        criteria: "Capability to Deliver High-Quality Outcomes to Tight Deadlines",
        response: "Tony's proven track record in successfully delivering transformation initiatives ahead of schedule exemplifies his ability to manage high-pressure deadlines effectively. His expertise in process optimization and structured workflow management ensures the timely completion of projects aligned with Defence priorities."
      }
    ]
  });

  const renderCriteriaRows = (criteriaArray, sectionType) => {
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
          {item.criteria}
        </td>
        <td style={{
          padding: '12px',
          border: '1px solid #000',
          verticalAlign: 'top',
          fontSize: '12px',
          lineHeight: '1.5',
          whiteSpace: 'pre-line'
        }}>
          {item.response}
        </td>
      </tr>
    ));
  };

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
  <div >
    {/* PappsPM Logo */}
<div style={{
  height: "200px",     
  width: "195px",
  display: 'inline-block',
  verticalAlign: 'top',
  marginRight: '5px',
//   marginTop: '15.5px',
 background: "url(/PappspmLogo.jpeg) no-repeat center center"
}}>
</div>
    
    {/* SME Logo */}
    <div style={{
      height: '170px', // Match the height of first logo
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
   {/* Department */}
   <div style={{
        textAlign: 'center', 
        backgroundColor: '#4ECDC4', 
        padding: '8px 0', // Add padding for better spacing
        marginBottom: '8px',
        }}>
        <h2 style={{
            fontSize: '24px', // Changed from 'size' to 'fontSize'

            fontWeight: 'bold',
            color: '#000' // Ensure text is visible
        }}>
            ICT Criteria Statement
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
          {tenderData.candidateName}
        </h1>
        <h2 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '5px 0 0 0',
          lineHeight: '1.4'
        }}>
          {tenderData.applicationTitle}
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
                textAlign: 'center',
                fontSize: '12px'
              }}
            >
              Essential
            </td>
          </tr>
          
          {/* Essential Criteria Rows */}
          {renderCriteriaRows(tenderData.essentialCriteria, 'essential')}
          
          {/* Desirable Section Header */}
          <tr>
            <td 
              colSpan="2" 
              style={{
                padding: '12px',
                border: '1px solid #000',
                backgroundColor: '#e0e0e0',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '12px'
              }}
            >
              Desirable
            </td>
          </tr>
          
          {/* Desirable Criteria Rows */}
          {renderCriteriaRows(tenderData.desirableCriteria, 'desirable')}
        </tbody>
      </table>
    </div>
  );
};

export default TenderResponse;