import { useEffect, useState } from 'react';
import { usePDF } from 'react-to-pdf';

const ResumeTemplate = () => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [showSecondPage, setShowSecondPage] = useState(false);
  
  // Create filename from candidate's name
  const candidateName = "Tony Nguyen";
  const sanitizedName = candidateName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .trim();
  const filename = `${sanitizedName}_Resume.pdf`;
  
  const { toPDF, targetRef } = usePDF({filename: filename});

  // Sample JSON data structure with separated experience fields
  const resumeData = {
    profile: {
      name: "Tony Nguyen",
      title: "ICT HEAD OF DELIVERY",
      location: "Canberra",
      clearance: "NV1",
      description: "Tony Nguyen has a distinguished background in project and program management, with extensive experience leading complex software asset and lifecycle management initiatives. In his role as Senior Project Manager at IBM, Tony has demonstrated his ability to oversee software procurement, licensing compliance, and vendor negotiations while ensuring adherence to regulatory frameworks. His leadership in managing large-scale IT transformation programs at NSW Dept. Fair Trading and Westpac Bank has strengthened his expertise in software deployment, governance, and risk mitigation strategies, making him well-suited for the Software Asset Officer role. His ability to engage stakeholders, optimize project processes, and leverage Agile methodologies has been instrumental in driving efficiency and operational excellence across government and Defence-related projects.",
      description2: "Beyond his project leadership, Tony has successfully managed multi-million-dollar portfolios in his tenure as Asia Pacific CIO Program Director at IBM, where he established governance frameworks for software procurement and asset management across various regions. His experience in integrated logistics support (ILS), compliance assurance, and risk assessment aligns closely with the key responsibilities outlined in this opportunity. His proficiency with software asset management tools, including JIRA, SharePoint, and Tivoli Asset Manager, ensures he can effectively manage licensing, audits, and software tracking functions. Tony's ability to navigate complex regulatory landscapes while driving software efficiency and compliance reinforces his suitability for this role, making him a strategic asset for Defence projects requiring meticulous software management and governance oversight."
    },
    qualifications: [
      "Bachelor of Science (Computer Science)",
      "Project Management Professional (PMP)",
      "Professional Scrum Master",
      "Professional Agile Leadership™ (PAL I)",
      "Trustworthy AI & AI Ethics (IBM)",
      "Microsoft Certified: Azure Fundamentals",
      "Certified Manager (IBM)",
      "Cognitive Practitioner",
      "Blockchain Foundation Consulting",
      "Enterprise Design Thinking Practitioner",
      "Financial Markets Insights & Solutions (Silver)"
    ],
    affiliations: [
      "Project Management Institute",
      "Toastmasters",
      "Association of Information Technology Professionals"
    ],
    skills: [
      "Project Management",
      "Complex IT Program Delivery",
      "Digital Transformation",
      "Change Management",
      "Software Development Life Cycle",
      "Strategic Planning",
      "Advanced Problem Solving",
      "Stakeholder Engagement",
      "Team Leadership & Collaboration",
      "Training & Development"
    ],
    keyAchievements: [
      "In his role as the Program Director for Asia - Pacific CIO, he developed a new Project Management Framework and adequately led and implemented Agile Transformation program across Asia Pacific 6 months ahead of schedule.",
      "As the Delivery Project Executive for Asia - Pacific for CIO, he set up and established Delivery centres across India, China, and the Philippines. He was also instrumental in growing delivery team from 0 to over 600 practitioners. Strengthened IBM delivery capabilities and competitiveness in Asia Pacific markets. Developed a New Delivery Operating Model, saving IBM over AUD$1 million per year."
    ],
    // Recent 2 experiences for first page
    experience: [
      {
        title: "Senior Project Manager - IBM (NSW Department of Fair trading)",
        period: "July 2022 - Present",
        responsibilities: [
          "Led the modernisation of the organisation's IT infrastructure by transitioning from on-premises systems to a cloud environment, including facilitating numerous testing environments e.g., UAT, SIT etc.",
          "Led the project encompassing assessment, planning, provider selection, execution, testing, training, and optimisation phases.",
          "Managed stakeholder expectations and communication throughout the project lifecycle.",
          "Implemented risk management strategies to ensure project success and minimize potential issues."
        ]
      },
      {
        title: "Senior Program Manager | IBM",
        period: "September 2021 - June 2022",
        responsibilities: [
          "Led a team of 34 PeopleSoft consultants.",
          "Delivered the PeopleSoft Time and Labour module across Suncorp organisation.",
          "Facilitated requirements gathering workshops and developed project plans.",
          "Maintained schedules to meet key milestones.",
          "Partnered with project team members, vendors, and clients to address issues promptly.",
          "Monitored project progress, identified risks, and implemented corrective measures.",
          "Developed and maintained relationships with key stakeholders.",
          "Tracked project and team member performance to intervene in mistakes or delays."
        ]
      }
    ],
    // All experiences including the recent 2 for second page
    fullExperience: [
      {
        title: "Senior Project Manager - IBM (NSW Department of Fair trading)",
        period: "July 2022 - Present",
        responsibilities: [
          "Led a team of IT Professionals and Project Managers.",
          "Delivered application support services and business transformation programs.",
          "Partnered with project team members to address problems promptly.",
          "Monitored contracts and service level agreements, identifying potential risks and implementing mitigation actions.",
          "Maintained schedules to meet key milestones at every project phase.",
          "Communicated project plans and progress to key stakeholders and project contributors.",
          "Monitored project progress, identified risks, and took corrective measures for success.",
          "Developed and maintained relationships with key stakeholders.",
          "Established and managed change management processes for successful project transitions.",
          "Coordinated cross-functional teams for timely project delivery and compliance, including testing teams, functional teams, and developers."
        ]
      },
      {
        title: "Senior Program Manager | IBM",
        period: "September 2021 - June 2022",
        responsibilities: [
          "Led a team of 34 PeopleSoft consultants.",
          "Delivered the PeopleSoft Time and Labour module across Suncorp organisation.",
          "Facilitated requirements gathering workshops and developed project plans.",
          "Maintained schedules to meet key milestones.",
          "Partnered with project team members, vendors, and clients to address issues promptly.",
          "Monitored project progress, identified risks, and implemented corrective measures.",
          "Developed and maintained relationships with key stakeholders.",
          "Tracked project and team member performance to intervene in mistakes or delays."
        ]
      },
      {
        title: "Transformation Program Lead | IBM",
        period: "July 2020 - August 2021",
        responsibilities: [
          "Led a digital transformation program at Westpac, focusing on Agile, Automation, DevOps, and AI.",
          "Established Vision, Mission, Governance, and Framework.",
          "Provided industry thought leadership, strategic solution advisory, and expert consultation.",
          "Developed and delivered IT and digital transformation strategy.",
          "Managed and delivered processes, system and cultural change.",
          "Developed and implemented innovation programs."
        ]
      },
      {
        title: "Asia Pacific CIO Program Director | IBM",
        period: "January 2016 - June 2020",
        responsibilities: [
          "Led a team of 500+ IT professionals across Asia Pacific.",
          "Defined technology strategies and provided application services.",
          "Established a centralised shared service as a single IT department.",
          "Implemented Agile Transformation and New Way of Working for AP region.",
          "Managed and accountable for a portfolio of over AUD$50 million projects and support services.",
          "Built organisation capabilities on leading-edge skills.",
          "Provided leadership and mentorship to Program Managers and Project Managers."
        ]
      },
      {
        title: "Asia Pacific CIO Delivery Project Executive | IBM",
        period: "January 2010 - December 2015",
        responsibilities: [
          "Led a team of 250 IT professionals across Australia, India, China, and the Philippines.",
          "Provided application support services and managed a portfolio.",
          "Established governance and relationships with IBM extended teams.",
          "Chaired steering committee meetings for key projects.",
          "Oversaw project implementation, financial, and administrative oversight.",
          "Mentored, empowered, and developed careers of Senior Managers.",
          "Provided advisory services to top-tier client executives."
        ]
      },
      {
        title: "Service Delivery Manager | IBM",
        period: "January 2006 - December 2009",
        responsibilities: [
          "Managed the full project lifecycle for 15 billing Vodafone applications.",
          "Ensured compliance with service level agreements.",
          "Participated in drafting service budgeting and advised on cost reduction opportunities.",
          "Maintained proper staffing levels for timely deliveries.",
          "Managed client and supplier contracts.",
          "Built strong, lasting client relationships."
        ]
      }
    ],
    referees: [
      {
        name: "Siva Rajeswaran",
        title: "Business Development Manager (IBM)",
        email: "srajeswaran@au1.ibm.com",
        phone: "+61 401 145 640"
      },
      {
        name: "Edelize Lipski",
        title: "Practice Area Lead (IBM)",
        email: "elipski@au1.ibm.com",
        phone: "+61 403 066 896"
      }
    ]
  };

  // Use ALL fullExperience for second page (including the first 2 that were on first page)
  const secondPageExperience = resumeData.fullExperience;
  
  // Split second page experience into left and right columns
  // Calculate better distribution - fill left column first, then right
  const totalExperiences = secondPageExperience.length;
  const leftColumnCount = Math.ceil(totalExperiences / 2); // This ensures left gets more if odd number
  const leftColumnExperience = secondPageExperience.slice(0, leftColumnCount);
  const rightColumnExperience = secondPageExperience.slice(leftColumnCount);

  // Check if second page is needed (always show if we have any experiences)
  useEffect(() => {
    setShowSecondPage(resumeData.fullExperience.length > 0);
  }, [resumeData.fullExperience.length]);

  const FirstPage = () => (
    <div style={{ 
      width: '100%', 
      backgroundColor: 'white', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      marginBottom: showSecondPage ? '2rem' : '0',
      pageBreakAfter: showSecondPage ? 'always' : 'auto'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr' }}>
        <div style={{ backgroundColor: '#1e293b', color: 'white' }}>
          {/* Profile Photo */}
          <div>
            <div
              style={{ 
                width: '100%', 
                height: '15rem', 
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                color: '#9CA3AF'
              }}
            >
              Photo Placeholder
            </div>
          </div>
          <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            {/* Name and Title */}
            <div style={{ marginBottom: '0.75rem' }}>
              <h1 style={{ 
                fontSize: '2.25rem', 
                fontWeight: 'bold', 
                margin: 0
              }}>
                {resumeData.profile.name.split(' ')[0]}
              </h1>
              <h1 style={{ 
                fontSize: '2.25rem', 
                fontWeight: 'bold', 
                marginBottom: '0.75rem',
                margin: '0 0 0.75rem 0'
              }}>
                {resumeData.profile.name.split(' ')[1]}
              </h1>
              <div style={{ 
                color: '#fbbf24', 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                marginBottom: '0.25rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                {resumeData.profile.title}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#d1d5db', 
                letterSpacing: '0.1em', 
                textTransform: 'uppercase' 
              }}>
                {resumeData.profile.location} | {resumeData.profile.clearance}
              </div>
            </div>

            {/* Qualifications */}
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: '#fbbf24', 
                letterSpacing: '0.05em',
                margin: '0 0 0.5rem 0'
              }}>
                QUALIFICATIONS
              </h2>
              <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
                {resumeData.qualifications.map((qual, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                    <span style={{ lineHeight: '1.625' }}>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Affiliations */}
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: '#fbbf24', 
                letterSpacing: '0.05em',
                margin: '0 0 0.5rem 0'
              }}>
                AFFILIATIONS
              </h2>
              <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
                {resumeData.affiliations.map((affiliation, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                    <span style={{ lineHeight: '1.625' }}>{affiliation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div>
              <h2 style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: '#fbbf24', 
                letterSpacing: '0.05em',
                margin: '0 0 0.5rem 0'
              }}>
                SKILLS
              </h2>
              <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
                {resumeData.skills.map((skill, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                    <span style={{ lineHeight: '1.625' }}>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section - Two Columns */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Top content area - split into two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
            {/* Middle Column - Profile */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb' }}>
              {/* Profile Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.75rem', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: '0 0 0.75rem 0'
                }}>
                  PROFILE
                </h2>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#374151', 
                  lineHeight: '1.625', 
                  textAlign: 'justify', 
                  marginBottom: '0.75rem',
                  margin: '0 0 0.75rem 0'
                }}>
                  {resumeData.profile.description}
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#374151', 
                  lineHeight: '1.625', 
                  textAlign: 'justify',
                  margin: 0
                }}>
                  {resumeData.profile.description2}
                </p>
              </div>
            </div>

            {/* Right Column - References and Experience */}
            <div style={{ width: '650px', padding: '1.5rem', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: 0
                }}>
                  REFEREES
                </h2>
                <div style={{ 
                  backgroundColor: '#1e293b', 
                  color: 'white', 
                  paddingLeft: '0.75rem', 
                  paddingRight: '0.75rem', 
                  paddingTop: '0.5rem', 
                  paddingBottom: '0.5rem', 
                  fontSize: '0.875rem', 
                  fontWeight: 'bold' 
                }}>
                  PappsPM
                </div>
              </div>

              {/* Referees List Content */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {resumeData.referees.map((referee, index) => (
                    <div key={index} style={{ fontSize: '14px' }}>
                      <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
                        {referee.title}
                      </p>
                      <p style={{ color: '#374151', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
                        N: {referee.name}
                      </p>
                      <p style={{ color: '#374151', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
                        E: {referee.email}
                      </p>
                      <p style={{ color: '#374151', margin: 0 }}>
                        M: {referee.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Experience - First Page */}
              <div>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem', 
                  color: '#1e293b', 
                  letterSpacing: '0.05em',
                  margin: '0 0 0.5rem 0'
                }}>
                  RELEVANT EXPERIENCE
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h3 style={{ 
                            fontWeight: 'bold', 
                            color: '#1e293b', 
                            fontSize: '0.875rem', 
                            lineHeight: '1.25', 
                            marginBottom: '0.25rem',
                            margin: '0 0 0.25rem 0'
                          }}>
                            {exp.title}
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                            {exp.period}
                          </p>
                        </div>
                      </div>
                      <div style={{ marginLeft: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {exp.responsibilities.map((resp, respIndex) => (
                          <div key={respIndex} style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <span style={{ color: '#1e293b', marginRight: '0.5rem', marginTop: '0.125rem', fontSize: '0.875rem' }}>•</span>
                            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.625', margin: 0 }}>
                              {resp}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Career Achievements - Full width of right section */}
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '1.5rem', 
            borderTop: '1px solid #d1d5db', 
            color: 'black' 
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem', 
              letterSpacing: '0.05em',
              margin: '0 0 1rem 0'
            }}>
              KEY CAREER ACHIEVEMENTS
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {resumeData.keyAchievements.map((achievement, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: '0.75rem', marginTop: '0.125rem' }}>•</span>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.625', margin: 0 }}>
                    {achievement}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const SecondPage = () => (
    <div style={{ 
      width: '100%', 
      backgroundColor: 'white', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      pageBreakBefore: 'always'
    }}>
      {/* Header with PappsPM branding - matching the image */}
      <div style={{ 
        backgroundColor: '#1e293b', 
        color: 'white', 
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Left side - PappsPM logo */}
        <div style={{ 
          backgroundColor: 'transparent', 
          color: 'white', 
          border: '2px solid white',
          paddingLeft: '0.75rem', 
          paddingRight: '0.75rem', 
          paddingTop: '0.5rem', 
          paddingBottom: '0.5rem', 
          fontSize: '0.875rem', 
          fontWeight: 'bold'
        }}>
          PappsPM
        </div>
        
        {/* Center - Name and Title */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold',
            margin: 0,
            color: 'white',
            letterSpacing: '0.1em'
          }}>
            {resumeData.profile.name}
          </h1>
          <div style={{ 
            color: '#fbbf24', 
            fontSize: '0.875rem', 
            fontWeight: 'normal', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            marginTop: '0.25rem'
          }}>
            {resumeData.profile.title}
          </div>
        </div>
        
        {/* Right side - empty for balance */}
        <div style={{ width: '120px' }}></div>
      </div>

      {/* Content in two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '1.5rem', padding: '1.5rem' }}>
        {/* Left Column */}
        <div>
         
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {leftColumnExperience.map((exp, index) => (
              <div key={index}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ 
                      fontWeight: 'bold', 
                      color: '#1e293b', 
                      fontSize: '0.875rem', 
                      lineHeight: '1.25', 
                      marginBottom: '0.25rem',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {exp.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                      {exp.period}
                    </p>
                  </div>
                </div>
                <div style={{ marginLeft: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  
                  {exp.responsibilities.map((resp, respIndex) => (
                    <div key={respIndex} style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#1e293b', marginRight: '0.5rem', marginTop: '0.125rem', fontSize: '0.875rem' }}>•</span>
                      <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.625', margin: 0 }}>
                        {resp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical separator line */}
        <div style={{ 
          backgroundColor: '#d1d5db', 
          width: '1px',
          height: '100%',
          minHeight: '500px'
        }}></div>

        {/* Right Column */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {rightColumnExperience.map((exp, index) => (
              <div key={index}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ 
                      fontWeight: 'bold', 
                      color: '#1e293b', 
                      fontSize: '0.875rem', 
                      lineHeight: '1.25', 
                      marginBottom: '0.25rem',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {exp.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                      {exp.period}
                    </p>
                  </div>
                </div>
                <div style={{ marginLeft: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  
                  {exp.responsibilities.map((resp, respIndex) => (
                    <div key={respIndex} style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#1e293b', marginRight: '0.5rem', marginTop: '0.125rem', fontSize: '0.875rem' }}>•</span>
                      <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.625', margin: 0 }}>
                        {resp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Button to download as PDF */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
        <button 
          onClick={() => toPDF()}
          style={{
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Download PDF
        </button>
        <button 
          onClick={() => setShowSecondPage(!showSecondPage)}
          style={{
            backgroundColor: '#6B7280',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showSecondPage ? 'Hide' : 'Show'} Second Page
        </button>
      </div>

      {/* Resume Content */}
      <div ref={targetRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#e5e7eb', padding: '1rem' }}>
        <FirstPage />
        {showSecondPage && <SecondPage />}
      </div>
    </div>
  );
};

export default ResumeTemplate;