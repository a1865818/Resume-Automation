import {
    AlignmentType,
    BorderStyle,
    Document,
    ImageRun,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    WidthType
} from 'docx';
import { saveAs } from 'file-saver';
import { useRef, useState } from 'react';
import generatePDF from 'react-to-pdf';
import ProposalSummary from './ProposalSummary';
import ProposalSummaryWordCompatible from './ProposalSummaryWordCompatible';
import CandidateSelectionModal from '../PdfSummary/CandidateSelectionModal';

// Helper function to convert image to base64 (for embedding)
const imageToBase64 = async (imagePath) => {
  try {
    const response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const blob = await response.blob();
    
    // Validate that it's actually an image
    if (!blob.type.startsWith('image/')) {
      throw new Error(`Invalid image type: ${blob.type}`);
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (result && typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read image as base64'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Could not load image:', imagePath, error.message);
    return null;
  }
};

// Helper function to safely extract base64 data and determine format
const getImageData = (base64String) => {
  if (!base64String || typeof base64String !== 'string') {
    return null;
  }
  
  try {
    const parts = base64String.split(',');
    if (parts.length !== 2) {
      throw new Error('Invalid base64 format');
    }
    
    const header = parts[0];
    const data = parts[1];
    
    // Determine image type from header
    let type = 'png'; // default
    if (header.includes('jpeg') || header.includes('jpg')) {
      type = 'jpg';
    } else if (header.includes('png')) {
      type = 'png';
    } else if (header.includes('gif')) {
      type = 'gif';
    }
    
    return { data, type };
  } catch (error) {
    console.warn('Failed to parse base64 image data:', error.message);
    return null;
  }
};

// Custom hook for docx generation
const useProposalSummaryDocx = () => {
  const generateProposalSummaryDocx = async (proposalData, detectedSector = 'Government', templateType = 'criteria-statement') => {
    try {
      console.log('🚀 Starting docx generation with proposal data:', proposalData);
      
      // Extract data from proposalData (matching your existing structure)
      const candidateName = proposalData.candidateDetails?.name || 'Candidate Name';
      const applicationTitle = proposalData.candidateDetails?.proposedRole || 'Application Response';
      const proposalSummaryContent = proposalData.proposalSummary?.content || '';
      const valuePropositionContent = proposalData.valueProposition?.content || '';
      
      // Sector-specific header text (matching your existing logic)
      const sectorHeaders = {
        'ICT': 'ICT Criteria Statement',
        'Defence': 'Defence Criteria Statement',
        'Maritime': 'Maritime Criteria Statement',
        'Finance': 'Finance Criteria Statement',
        'Health': 'Health Criteria Statement',
        'Education': 'Education Criteria Statement',
        'Infrastructure': 'Infrastructure Criteria Statement',
        'Environment': 'Environment Criteria Statement',
        'Legal': 'Legal Criteria Statement',
        'Government': 'Government Criteria Statement'
      };

      const headerText = sectorHeaders[detectedSector] || sectorHeaders['Government'];
      
      // Load images with better error handling
      let pappspmLogoBase64 = null;
      let smeLogoBase64 = null;
      let consunetLogoBase64 = null;
      let bannerImageBase64 = null;
      
      try {
        pappspmLogoBase64 = await imageToBase64('/PappspmLogo.jpeg');
      } catch (error) {
        console.warn('Failed to load PappsPM logo:', error.message);
      }
      
      try {
        smeLogoBase64 = await imageToBase64('/assets/images/SMELogo.jpeg');
      } catch (error) {
        console.warn('Failed to load SME logo:', error.message);
      }
      
      try {
        consunetLogoBase64 = await imageToBase64('/ConsunetLogo.jpeg');
      } catch (error) {
        console.warn('Failed to load Consunet logo:', error.message);
      }
      
      try {
        bannerImageBase64 = await imageToBase64('/assets/images/BannerTenderResponse.jpg');
      } catch (error) {
        console.warn('Failed to load banner image:', error.message);
      }
      
      // Create document sections
      const documentChildren = [];
      
      // 1. LOGO SECTION (matching your table layout)
      if (pappspmLogoBase64 || smeLogoBase64) {
        const logoTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
            insideHorizontal: { style: BorderStyle.NONE, size: 0 },
            insideVertical: { style: BorderStyle.NONE, size: 0 }, 
          },
                  rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 20, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: (() => {
                      const logoData = getImageData(pappspmLogoBase64);
                      return logoData ? [
                        new ImageRun({
                          data: logoData.data,
                          transformation: {
                            width: 145,
                            height: 130,
                          },
                          type: logoData.type,
                        })
                      ] : [
                        new TextRun({
                          text: "[PappsPM Logo]",
                          italics: true,
                          color: "666666",
                        })
                      ];
                    })(),
                    alignment: AlignmentType.LEFT,
                  }),
                ],
              }),
              // Only include the SME/Consunet logo cell if templateType is not 'default'
              ...(templateType !== 'default' ? [
                new TableCell({
                  width: { size: 80, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: (() => {
                        const logoBase64 = templateType === 'consunet' ? consunetLogoBase64 : smeLogoBase64;
                        const logoData = getImageData(logoBase64);
                        return logoData ? [
                          new ImageRun({
                            data: logoData.data,
                            transformation: {
                              width: 175,
                              height: 130,
                            },
                            type: logoData.type,
                          })
                        ] : [
                          new TextRun({
                            text: templateType === 'consunet' ? "[Consunet Logo]" : "[SME Logo]",
                            italics: true,
                            color: "666666",
                          })
                        ];
                      })(),
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                })
              ] : []),
            ],
          }),
        ],
        });
        documentChildren.push(logoTable);
      }
      
      // 2. SECTOR HEADER (matching your colored header)
      const headerTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE }, 
        borders: {
          top: { style: BorderStyle.NONE, size: 0 },
          bottom: { style: BorderStyle.NONE, size: 0 },
          left: { style: BorderStyle.NONE, size: 0 },
          right: { style: BorderStyle.NONE, size: 0 },
          insideHorizontal: { style: BorderStyle.NONE, size: 0 },
          insideVertical: { style: BorderStyle.NONE, size: 0 },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 100, type: WidthType.PERCENTAGE },
                shading: {
                  fill: "4ECDC4", // Background color
                },
                margins: {
                  top: 150,
                  bottom: 150,
                  left: 300,
                  right: 300,
                },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: headerText,
                        bold: true,
                        size: 40,
                        color: "000000",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      documentChildren.push(
        new Paragraph({
          children: [],
          alignment: AlignmentType.LEFT,
        })
      );
      documentChildren.push(headerTable);
      
      // 3. BANNER IMAGE (matching your banner section)
      if (bannerImageBase64) {
        const bannerData = getImageData(bannerImageBase64);
        if (bannerData) {
          documentChildren.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: bannerData.data,
                  transformation: {
                    width: 642, // Matching your banner width
                    height: 300, // Matching your banner height
                  },
                  type: bannerData.type,
                })
              ],
              alignment: AlignmentType.LEFT,
              spacing: { before: 200, after: 200 },
            })
          );
        } else {
          // Banner placeholder if data is invalid
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "[Professional Banner Image - Invalid Data]",
                  italics: true,
                  color: "666666",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 200 },
            })
          );
        }
      } else {
        // Banner placeholder
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "[Professional Banner Image]",
                italics: true,
                color: "666666",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          })
        );
      }
      
      // 4. CANDIDATE NAME AND TITLE (matching your header section)
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: candidateName,
              bold: true,
              size: 28, // 20pt = 40 half-points
              color: "000000",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 180, after: 100 },
        })
      );
      
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: applicationTitle,
              bold: true,
              size: 28, // 20pt = 40 half-points
              color: "000000",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 280 },
        })
      );
      
      // 5. PROPOSAL SUMMARY SECTION (matching your main content)
      if (proposalSummaryContent && proposalSummaryContent.trim()) {
        // Section header
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Proposal Summary",
                bold: true,
                size: 28,
                color: "1e40af",
              }),
            ],
            spacing: { before: 280, after: 300 },
          })
        );
        
        // Content paragraphs (matching your paragraph structure)
        const paragraphs = proposalSummaryContent.split('\n\n').filter(p => p.trim());
        paragraphs.forEach((paragraph, index) => {
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph.trim(),
                  size: 24,
                  color: "000000",
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { 
                after: index < paragraphs.length - 1 ? 300 : 0,
                line: 276, // 1.4 line spacing (276 = 1.4 * 196)
              },
            })
          );
        });
      }
      
      // 6. VALUE PROPOSITION SECTION (if available, matching your conditional rendering)
      if (valuePropositionContent && valuePropositionContent.trim()) {
        const valueParagraphs = valuePropositionContent.split('\n\n').filter(p => p.trim());
        valueParagraphs.forEach((paragraph, index) => {
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph.trim(),
                  size: 24,
                  color: "000000",
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { 
                before: index === 0 ? 400 : 0,
                after: index < valueParagraphs.length - 1 ? 300 : 0,
                line: 276, // 1.4 line spacing
              },
            })
          );
        });
      }
      
      // 7. FOOTER (matching your footer section)
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Professional ${detectedSector} Sector Proposal Summary | Generated by PappsPM`,
              size: 16, 
              color: "666666",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        })
      );
      
      // Ensure we have at least some content
      if (documentChildren.length === 0) {
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "No content available for proposal summary.",
                size: 24,
                color: "000000",
              }),
            ],
            alignment: AlignmentType.CENTER,
          })
        );
      }

      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Arial",
                size: 24,
              },
            },
          },
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1134,    // 0.79 inches
                right: 1134,  // 0.79 inches  
                bottom: 1134, // 0.79 inches
                left: 1134,   // 0.79 inches
              },
            },
          },
          children: documentChildren,
        }],
      });
      
      return doc;
      
    } catch (error) {
      console.error('Error generating docx proposal summary:', error);
      throw error;
    }
  };

  const downloadProposalSummaryDocx = async (proposalData, detectedSector = 'Government', templateType = 'criteria-statement') => {
    try {
      // Validate input data
      if (!proposalData) {
        throw new Error('No proposal data provided');
      }

      const name = proposalData.candidateDetails?.name || 'Proposal_Summary';
      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      
      if (!sanitizedName) {
        throw new Error('Invalid candidate name');
      }
      
      // Extract RFQ number and role title from proposal data
      // These fields are at the root level of the proposal data
      const rfqNumber = proposalData?.rfqNumber || '';
      const roleTitle = proposalData?.roleTitle || '';
      
      // Debug logging to help identify data structure issues
      console.log('🔍 Proposal Summary Data Structure (DOCX):', {
        hasRfqNumber: !!proposalData?.rfqNumber,
        rfqNumber: proposalData?.rfqNumber,
        hasRoleTitle: !!proposalData?.roleTitle,
        roleTitle: proposalData?.roleTitle,
        proposalDataKeys: Object.keys(proposalData || {})
      });
      
      // Sanitize role title for filename
      const sanitizedRoleTitle = roleTitle
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      
      // Create filename in format: PAPPSPM-RFQnumber-RoleTitle-CandidateName-Proposal
      const filename = `PAPPSPM-${rfqNumber}-${sanitizedRoleTitle}-${sanitizedName}-Proposal.docx`;
      
      console.log('📄 Generating true .docx document...');
      
      // Generate the document
      const doc = await generateProposalSummaryDocx(proposalData, detectedSector, templateType);
      
      if (!doc) {
        throw new Error('Failed to generate document');
      }
      
      // Pack and save
      const blob = await Packer.toBlob(doc);
      
      if (!blob || blob.size === 0) {
        throw new Error('Generated document is empty');
      }
      
      saveAs(blob, filename);
      
      console.log(`✅ True .docx document generated successfully! Size: ${blob.size} bytes`);
      console.log(`✅ No folders will be created when edited.`);
      
    } catch (error) {
      console.error('❌ Error generating .docx document:', error);
      throw new Error(`Failed to generate Word document: ${error.message}`);
    }
  };

  return {
    generateProposalSummaryDocx,
    downloadProposalSummaryDocx
  };
};

const ProposalSummaryWrapper = ({ 
  proposalData, 
  candidateName, 
  onBackToTenderResponse, 
  onRegenerateProposalSummary = null,
  isRegenerating = false,
  detectedSector = 'Government',
  templateType = 'criteria-statement',
  // Save functionality props
  onSaveProposalSummary = null,
  isSaving = false,
  savedDocumentUrl = '',
  saveError = '',
  roleName = ''
}) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isWordLoading, setIsWordLoading] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const proposalRef = useRef();
  const wordProposalRef = useRef();
  
  // Use the docx hook
  const { downloadProposalSummaryDocx } = useProposalSummaryDocx();

  // Enhanced validation for proposal summary
  const validateProposalData = (data) => {
    if (!data) return { isValid: false, errors: ['No proposal data provided'] };
    
    const errors = [];
    const warnings = [];

    // Check for required sections
    if (!data.candidateDetails) {
      errors.push('Missing candidate details');
    }

    if (!data.proposalSummary || !data.proposalSummary.content) {
      errors.push('Missing proposal summary content');
    }

    // Validate proposal summary length
    if (data.proposalSummary && data.proposalSummary.content) {
      const wordCount = data.proposalSummary.content.split(/\s+/).length;
      if (wordCount < 180) {
        warnings.push('Proposal summary may be too short (less than 180 words)');
      } else if (wordCount > 280) {
        warnings.push('Proposal summary may be too long (more than 280 words)');
      }
    }

    // Validate key highlights
    if (!data.keyHighlights || data.keyHighlights.length === 0) {
      warnings.push('No key highlights provided');
    }

    // Validate value proposition
    if (!data.valueProposition || !data.valueProposition.content) {
      warnings.push('Missing value proposition');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sections: {
        summary: !!data.proposalSummary?.content,
        highlights: data.keyHighlights?.length || 0,
        valueProposition: !!data.valueProposition?.content
      }
    };
  };

  // Validate proposal data on load
  useState(() => {
    if (proposalData) {
      const validation = validateProposalData(proposalData);
      setValidationResults(validation);
      
      if (!validation.isValid) {
        console.warn('Proposal data validation issues:', validation.errors);
      }
    }
  }, [proposalData]);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    
    try {
      const name = candidateName || proposalData?.candidateDetails?.name || 'Proposal_Summary';
      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      
      // Extract RFQ number and role title from proposal data
      // These fields are at the root level of the proposal data
      const rfqNumber = proposalData?.rfqNumber || '';
      const roleTitle = proposalData?.roleTitle || '';
      
      // Debug logging to help identify data structure issues
      console.log('🔍 Proposal Summary Data Structure (PDF):', {
        hasRfqNumber: !!proposalData?.rfqNumber,
        rfqNumber: proposalData?.rfqNumber,
        hasRoleTitle: !!proposalData?.roleTitle,
        roleTitle: proposalData?.roleTitle,
        proposalDataKeys: Object.keys(proposalData || {})
      });
      
      // Sanitize role title for filename
      const sanitizedRoleTitle = roleTitle
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      
      // Create filename in format: PAPPSPM-RFQnumber-RoleTitle-CandidateName-Proposal
      const filename = `PAPPSPM-${rfqNumber}-${sanitizedRoleTitle}-${sanitizedName}-Proposal.pdf`;
      
      const options = {
        filename: filename,
        page: {
          margin: 15,
          format: 'a4',
          orientation: 'portrait',
        },
        canvas: {
          mimeType: 'image/png',
          qualityRatio: 1
        },
        overrides: {
          pdf: {
            compress: true,
            fitWindow: true,
          },
          canvas: {
            useCORS: true,
            scale: 2,
          },
        },
      };
      
      await new Promise(resolve => setTimeout(resolve, 200));
      await generatePDF(proposalRef, options);
      
      console.log(`${detectedSector} Proposal Summary PDF generated successfully!`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  // NEW: Handle Word download using docx library (NO FOLDERS CREATED)
  const handleDownloadWordDocx = async () => {
    setIsWordLoading(true);
    
    try {
      await downloadProposalSummaryDocx(proposalData, detectedSector, templateType);
    } catch (error) {
      console.error('Word document generation failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'There was an error generating the Word document. Please try again.';
      
      if (error.message.includes('No proposal data')) {
        errorMessage = 'No proposal data available. Please generate a proposal summary first.';
      } else if (error.message.includes('Invalid candidate name')) {
        errorMessage = 'Invalid candidate name. Please check the proposal data.';
      } else if (error.message.includes('Failed to load image')) {
        errorMessage = 'Warning: Some images could not be loaded, but the document was generated with placeholders.';
      } else if (error.message.includes('Generated document is empty')) {
        errorMessage = 'The generated document appears to be empty. Please check the proposal content.';
      }
      
      alert(errorMessage);
    } finally {
      setIsWordLoading(false);
    }
  };


  const handleRegenerateClick = () => {
    const sectorText = detectedSector === 'Government' ? 'Proposal Summary' : `${detectedSector} Proposal Summary`;
    
    if (window.confirm(`Are you sure you want to generate a new ${sectorText}? This will replace the current one.`)) {
      if (onRegenerateProposalSummary) {
        onRegenerateProposalSummary();
      } else {
        console.warn('No regeneration handler provided');
      }
    }
  };

  // Modal handlers for save functionality
  const handleSaveProposalSummaryClick = () => {
    setShowCandidateModal(true);
  };

  const handleCandidateModalConfirm = (result) => {
    setShowCandidateModal(false);
    if (onSaveProposalSummary) {
      onSaveProposalSummary(result);
    }
  };

  const handleCandidateModalCancel = () => {
    setShowCandidateModal(false);
  };

  if (!proposalData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2>No proposal summary data available</h2>
        <button
          onClick={onBackToTenderResponse}
          className="mt-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
        >
          ← Back to Criteria Statement
        </button>
      </div>
    );
  }

  // Show loading overlay if regenerating
  if (isRegenerating) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Regenerating {detectedSector} Proposal Summary
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we generate a new proposal summary based on your criteria statement...
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> The new proposal summary will synthesize your criteria statement into a compelling narrative format.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      {/* Enhanced Control Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Back to Criteria Statement Button */}
        <button
          onClick={onBackToTenderResponse}
          disabled={isRegenerating}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>←</span>
          Back to Criteria Statement
        </button>
        
        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isPdfLoading || isRegenerating}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
            isPdfLoading || isRegenerating
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isPdfLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <span>📄</span>
              Download PDF
            </>
          )}
        </button>

        {/* NEW: Download Word (.docx) Button - NO FOLDERS */}
        <button
          onClick={handleDownloadWordDocx}
          disabled={isWordLoading || isRegenerating}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
            isWordLoading || isRegenerating
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isWordLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Word...
            </>
          ) : (
            <>
              <span>📝</span>
              Download Word (.docx)
            </>
          )}
        </button>

        {/* Save Proposal Summary Button */}
        {onSaveProposalSummary && (
          <button
            onClick={handleSaveProposalSummaryClick}
            disabled={isSaving || isRegenerating}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
              isSaving || isRegenerating
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Proposal Summary
              </>
            )}
          </button>
        )}

        {/* Regenerate Proposal Summary Button */}
        <button
          onClick={handleRegenerateClick}
          disabled={isRegenerating || !onRegenerateProposalSummary}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
            isRegenerating || !onRegenerateProposalSummary
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          {isRegenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Regenerating...
            </>
          ) : (
            <>
              <span>🔄</span>
              Regenerate Summary
            </>
          )}
        </button>
      </div>

      {/* Enhanced Document Info Banner */}
      <div style={{
        maxWidth: '1012.8000488px',
        margin: '0 auto 1rem auto',
        padding: '1rem',
        backgroundColor: '#e0f2fe',
        border: '1px solid #0284c7',
        borderRadius: '0.5rem'
      }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              📋 {detectedSector} Proposal Summary Generated
            </h3>
            <p className="text-blue-700 text-sm">
              Narrative proposal summary for: <strong>{proposalData.candidateDetails?.proposedRole || `${detectedSector} Government Role`}</strong>
            </p>
            {validationResults && (
              <div className="text-xs mt-2">
                <span className="text-green-600">
                  ✅ Summary: {validationResults.sections?.summary ? 'Complete' : 'Missing'} | 
                  Highlights: {validationResults.sections?.highlights || 0} | 
                  Value Prop: {validationResults.sections?.valueProposition ? 'Complete' : 'Missing'}
                </span>
                {validationResults.warnings?.length > 0 && (
                  <span className="text-yellow-600 ml-2">
                    ⚠️ {validationResults.warnings.length} warnings
                  </span>
                )}
              </div>
            )}
            <p className="text-blue-600 text-xs mt-1">
              ✨ <strong>Narrative Format:</strong> 200-250 word flowing summary instead of table format!
            </p>
            <p className="text-green-600 text-xs mt-1">
              🚀 <strong>NEW:</strong> Word documents generated using true .docx format - no companion folders created when editing!
            </p>
            {/* Save Status Feedback */}
            {savedDocumentUrl && (
              <p className="text-emerald-600 text-xs mt-1">
                ✅ <strong>Saved!</strong> Document saved successfully. 
                <a href={savedDocumentUrl} target="_blank" rel="noopener noreferrer" className="underline ml-1">
                  View saved document
                </a>
              </p>
            )}
            {saveError && (
              <p className="text-red-600 text-xs mt-1">
                ❌ <strong>Save Error:</strong> {saveError}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-600">
              Candidate: <strong>{candidateName || proposalData.candidateDetails?.name}</strong>
            </div>
            <div className="text-xs text-blue-500">
              Generated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Display proposal summary for PDF generation */}
      <div style={{
        maxWidth: '1012.8000488px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div ref={proposalRef}>
          <ProposalSummary proposalData={proposalData} templateType={templateType} />
        </div>
      </div>

      {/* Hidden Word-compatible version for  Word document generation */}
      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px',
        width: '1012px'
      }}>
        <div ref={wordProposalRef}>
          <ProposalSummaryWordCompatible proposalData={proposalData} templateType={templateType} />
        </div>
      </div>

      {/* Candidate Selection Modal */}
      <CandidateSelectionModal
        visible={showCandidateModal}
        onCancel={handleCandidateModalCancel}
        onConfirm={handleCandidateModalConfirm}
        documentData={proposalData}
        documentType="proposalSummary"
        roleName={roleName || 'default'}
      />
    </div>
  );
};

export default ProposalSummaryWrapper;

