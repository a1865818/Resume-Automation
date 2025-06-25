import { useEffect, useRef, useState } from 'react';
import DecorationLeft from "./DecorationLeft";
import PappsLogo from "./PappsLogo";
import PersonalPicture from "./PersonalPicture";

const ProfileSection = ({ resumeData, templateType = 'sme-gateway' }) => {
    const [decorationScale, setDecorationScale] = useState(1.75);
    const contentRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const checkOverlap = () => {
            if (contentRef.current && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const contentRect = contentRef.current.getBoundingClientRect();
                
                // Decoration dimensions with current scale
                const baseWidth = 70;
                const baseHeight = 50;
                const decorationWidth = baseWidth * decorationScale;
                const decorationHeight = baseHeight * decorationScale;
                
                // Get actual content bottom position
                const contentBottom = contentRect.bottom - containerRect.top;
                const containerHeight = containerRect.height;
                
                // Check if content extends into decoration area
                const availableSpace = containerHeight - decorationHeight;
                const hasOverlap = contentBottom > availableSpace;
                
                console.log('Debug overlap detection:', {
                    containerHeight,
                    contentBottom,
                    availableSpace,
                    decorationHeight,
                    hasOverlap,
                    currentScale: decorationScale
                });
                
                if (hasOverlap) {
                    // Scale down decoration to 0.75
                    setDecorationScale(0.75);
                } else {
                    // Keep original scale
                    setDecorationScale(1.75);
                }
            }
        };

        // Check overlap on mount and when window resizes
        const timeoutId = setTimeout(checkOverlap, 100); // Small delay to ensure rendering
        window.addEventListener('resize', checkOverlap);
        
        // Cleanup
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkOverlap);
        };
    }, [resumeData]); // Re-run when resumeData changes

    return (
        <div ref={containerRef} style={{ 
            backgroundColor: 'black', 
            color: 'white'
        }}>

           
               {/* <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 10,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
            }}> */}
                {/* SME Logo on the left */}
                {/* <div style={{
                    marginTop: '0.5rem'
                }}>
                    <img src="/assets/images/SMELogo.jpeg" alt="SME Logo" style={{ height: '80px' }} />
                </div> */}
                
                {/* Papps Logo on the right - made smaller */}
                {/* <div style={{
                    transform: 'scale(0.8)',
                    transformOrigin: 'top right'
                }}>
                    <PappsLogo />
                </div>
            </div>    */}

               {/* Conditional Logo Rendering */}
               {templateType === 'sme-gateway' ? (
                // SME Gateway Template - Two logos
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                }}>
                    {/* SME Logo on the left */}
                    <div style={{
                        marginTop: '0.5rem'
                    }}>
                        <img src="/assets/images/SMELogo.jpeg" alt="SME Logo" style={{ height: '80px' }} />
                    </div>
                    
                    {/* Papps Logo on the right - made smaller */}
                    <div style={{
                        transform: 'scale(0.8)',
                        transformOrigin: 'top right'
                    }}>
                        <PappsLogo />
                    </div>
                </div>
            ) : (
                // Default Template - Only Papps logo, centered
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                }}>
                    <div style={{
                        transform: 'scale(1.25)',
                        transformOrigin: 'top right'
                    }}>
                        <PappsLogo />
                    </div>
                </div>
            )}



                {/* Profile Photo - Only show if photo is provided */}
                {resumeData.profile.photo && resumeData.profile.photo !== "/api/placeholder/400/600" && (
                <div
                    style={{ 
                        width: '100%', 
                        height: '25rem', 
                        backgroundColor: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        color: '#9CA3AF'
                    }}
                >
                    <PersonalPicture PersonalPictureLink={resumeData.profile.photo} />
                </div>
            )}
            
            <div ref={contentRef} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                {/* Name and Title */}
                <div style={{ marginBottom: '0.75rem' }}>
                            <h1 style={{ 
                                fontSize: '2.5rem', 
                                fontWeight: 'bold', 
                                margin: 0
                            }}>
                                {resumeData.profile.name}
                            </h1>
                         
                            <div style={{ 
                                // color: '#fbbf24', 
                                color: 'white',
                                fontSize: '1rem', 
                                fontWeight: 'bold', 
                                marginBottom: '0.25rem', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.05em' 
                            }}>
                                {resumeData.profile.title}
                            </div>
                    <div style={{ 
                     fontSize: '0.9rem', 
                     color: '#d1d5db', 
                     letterSpacing: '0.1em', 
                     textTransform: 'uppercase' 
                    }}>
                        {resumeData.profile.location}
                        {/* {resumeData.profile.clearance && resumeData.profile.clearance !== 'NONE' && ` | ${resumeData.profile.clearance}`} */}
                    </div>
                </div>

                         {/* Security Clearance Section */}
                         <div style={{ marginBottom: '1rem' }}>
                    <h2 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        // color: '#fbbf24', 
                        color: 'white',
                        letterSpacing: '0.05em',
                        margin: '0 0 0.5rem 0'
                    }}>
                        SECURITY CLEARANCE
                    </h2>
                    <div style={{ fontSize: '13px', lineHeight: '1.25' }}>
                        {resumeData.profile.clearance && resumeData.profile.clearance !== 'NONE' ? (
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                {/* <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span> */}
                                <span style={{ color: 'white', marginRight: '0.5rem', fontSize: '12px' }}>•</span>

                                <span>{resumeData.profile.clearance}</span>
                            </div>
                        ) : (
                            <div style={{ 
                                fontStyle: 'italic', 
                                // color: '#9CA3AF',
                                color: 'white',
                                fontSize: '12px'
                            }}>
                                Able to obtain security clearance.
                            </div>
                        )}
                    </div>
                </div>

                {/* Qualifications */}
                <div style={{ marginBottom: '1rem' }}>
                            <h2 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: 'bold', 
                                // color: '#fbbf24', 
                                color: 'white',
                                letterSpacing: '0.05em',
                                margin: '0 0 0.5rem 0'
                            }}>
                                QUALIFICATIONS
                            </h2>
                            <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
                                {resumeData.qualifications.map((qual, index) => (
                                    <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                        {/* <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '12px' }}>•</span> */}
                                        <span style={{ color: 'white', marginRight: '0.5rem', fontSize: '12px' }}>•</span>
                                        <span style={{ lineHeight: '1.25', fontSize:'13px' }}>{qual}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                
                        {/* Affiliations */}
                        <div style={{ marginBottom: '1rem' }}>
                            <h2 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: 'bold', 
                                // color: '#fbbf24', 
                                color: 'white',
                                letterSpacing: '0.05em',
                                margin: '0 0 0.5rem 0'
                            }}>
                                AFFILIATIONS
                            </h2>
                            {resumeData.affiliations && resumeData.affiliations.length > 0 ? (
                                <ul style={{ fontSize: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
                                    {resumeData.affiliations.map((affiliation, index) => (
                                        <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                            {/* <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '10px' }}>•</span> */}
                                            <span style={{ color: 'white', marginRight: '0.5rem', fontSize: '10px' }}>•</span>
                                            <span style={{ lineHeight: '1.25', fontSize:'13px' }}>{affiliation}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div style={{ 
                                lineHeight: '1.25', fontSize:'13px'
                                }}>
                                            {/* <span style={{ color: '#fbbf24', marginRight: '0.5rem', fontSize: '10px' }}>•</span> */}
                                <span style={{ color: 'white', marginRight: '0.5rem', fontSize: '10px' }}>•</span>

                                    No information given
                                </div>
                            )}
                        </div>

                        <div style={{ 
                            position: 'absolute', 
                            left: 0, 
                            bottom: 0,
                            transform: `scale(${decorationScale})`, // Dynamic scale
                            transformOrigin: 'bottom left',
                            transition: 'transform 0.3s ease' // Smooth scaling transition
                        }}>
                            <DecorationLeft/>
                        </div>
            </div>
        </div>
    );
};

export default ProfileSection;