
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
import TenderResponseNew from './TenderResponseNew';
import TenderResponseWordCompatible from './TenderResponseWordCompatible';

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

// Custom hook for tender response docx generation
const useTenderResponseDocx = () => {
  const generateTenderResponseDocx = async (tenderData, detectedSector = 'Government') => {
    try {
      console.log('🚀 Starting tender response docx generation with data:', tenderData);
      
      // Extract data from tenderData (matching your existing structure)
      const candidateName = tenderData.candidateDetails?.name || 'Candidate Name';
      const applicationTitle = tenderData.candidateDetails?.proposedRole || 'Application Response';
      const responseFormat = tenderData.candidateDetails?.responseFormat || '';
      
      // Sector-specific styling and headers (EXACTLY matching WordCompatible version)
      const sectorColors = {
        'ICT': '4ECDC4',
        'Defence': '2C3E50',
        'Maritime': '0077BE',
        'Finance': '27AE60',
        'Health': 'E74C3C',
        'Education': '9B59B6',
        'Infrastructure': 'F39C12',
        'Environment': '16A085',
        'Legal': '34495E',
        'Government': '4ECDC4' // Default
      };

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

      const headerColor = sectorColors[detectedSector] || sectorColors['Government'];
      const headerText = sectorHeaders[detectedSector] || sectorHeaders['Government'];
      
      // Load images
      const pappspmLogoBase64 = await imageToBase64('/PappspmLogo.jpeg');
      const smeLogoBase64 = await imageToBase64('/assets/images/SMELogo.jpeg');
      const bannerImageBase64 = await imageToBase64('/assets/images/BannerTenderResponse.jpg');
      
      // Create document sections
      const documentChildren = [];
      
      // 1. LOGO SECTION (matching your table layout exactly)
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
                      new TableCell({
                        width: { size: 80, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            children: (() => {
                              const logoData = getImageData(smeLogoBase64);
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
                                  text: "[SME Logo]",
                                  italics: true,
                                  color: "666666",
                                })
                              ];
                            })(),
                            alignment: AlignmentType.LEFT,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              });
              documentChildren.push(logoTable);
            }
      
      // 2. SECTOR HEADER (matching your colored header exactly)
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
      
      // 3. BANNER IMAGE (with exact spacing)
      if (bannerImageBase64) {
             const bannerData = getImageData(bannerImageBase64);
             if (bannerData) {
               documentChildren.push(
                 new Paragraph({
                   children: [
                     new ImageRun({
                       data: bannerData.data,
                       transformation: {
                         width: 647, // Matching your banner width
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
           
      
      // 4. CANDIDATE HEADER (matching exact spacing and font sizes)
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

      // Response format (if exists) - matching exact styling
      if (responseFormat) {
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: responseFormat,
                italics: true,
                size: 24, // 12px font size
                color: "666666",
                font: "Arial",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { 
              before: 5 * 20, // 5px margin in twips
              after: 24 * 20  // 24px marginBottom
            },
          })
        );
      }
      
      // 5. MAIN CRITERIA TABLE
      const mainTableRows = [];
      
      // Table Header (matching exact styling)
      mainTableRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Criteria",
                      bold: true,
                      size: 24, // 12px font size
                      font: "Arial",
                    }),
                  ],
                  alignment: AlignmentType.LEFT,
                }),
              ],
              shading: { fill: "f0f0f0" }, // Exact background color
              margins: { 
                top: 12 * 20, 
                bottom: 12 * 20, 
                left: 12 * 20, 
                right: 12 * 20 
              }, // 12px padding in twips
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Candidate response",
                      bold: true,
                      size: 24, // 12px font size
                      font: "Arial",
                    }),
                  ],
                  alignment: AlignmentType.LEFT,
                }),
              ],
              shading: { fill: "f0f0f0" }, // Exact background color
              margins: { 
                top: 12 * 20, 
                bottom: 12 * 20, 
                left: 12 * 20, 
                right: 12 * 20 
              }, // 12px padding in twips
            }),
          ],
        })
      );

      // Helper function to render criteria rows (matching exact styling)
      const renderCriteriaRows = (criteriaArray, sectionType) => {
        if (!criteriaArray || criteriaArray.length === 0) {
          return [
            new TableRow({
              children: [
                new TableCell({
                  columnSpan: 2,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `No ${sectionType} criteria available`,
                          italics: true,
                          size: 24, // 12px font size
                          font: "Arial",
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                  margins: { 
                    top: 12 * 20, 
                    bottom: 12 * 20, 
                    left: 12 * 20, 
                    right: 12 * 20 
                  }, // 12px padding in twips
                }),
              ],
            })
          ];
        }

        return criteriaArray.map((item, index) => {
          const criteriaTitle = item.criteriaTitle || item.criteria || item.requirement || `${sectionType} Requirement ${index + 1}`;
          
          return new TableRow({
            children: [
              new TableCell({
                width: { size: 25, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: criteriaTitle,
                        bold: true,
                        size: 24, // 12px font size
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                shading: { fill: "f9f9f9" }, // Exact background color
                margins: { 
                  top: 12 * 20, 
                  bottom: 12 * 20, 
                  left: 12 * 20, 
                  right: 12 * 20 
                }, // 12px padding in twips
                verticalAlign: "top",
              }),
              new TableCell({
                width: { size: 75, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: item.response || 'No response provided',
                        size: 24, // 12px font size
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                margins: { 
                  top: 12 * 20, 
                  bottom: 12 * 20, 
                  left: 12 * 20, 
                  right: 12 * 20 
                }, // 12px padding in twips
                verticalAlign: "top",
              }),
            ],
          });
        });
      };

      // Essential Section Header (matching exact styling)
      mainTableRows.push(
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Essential",
                      bold: true,
                      size: 24, // 12px font size
                      font: "Arial",
                    }),
                  ],
                  alignment: AlignmentType.LEFT,
                }),
              ],
              shading: { fill: "e0e0e0" }, // Exact background color
              margins: { 
                top: 12 * 20, 
                bottom: 12 * 20, 
                left: 12 * 20, 
                right: 12 * 20 
              }, // 12px padding in twips
            }),
          ],
        })
      );

      // Essential Criteria Rows
      const essentialRows = renderCriteriaRows(tenderData.essentialCriteria, 'essential');
      mainTableRows.push(...essentialRows);

      // Desirable Section (if exists) - matching exact styling
      if (tenderData.desirableCriteria && tenderData.desirableCriteria.length > 0) {
        mainTableRows.push(
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 2,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Desirable",
                        bold: true,
                        size: 24, // 12px font size
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                shading: { fill: "e0e0e0" }, // Exact background color
                margins: { 
                  top: 12 * 20, 
                  bottom: 12 * 20, 
                  left: 12 * 20, 
                  right: 12 * 20 
                }, // 12px padding in twips
              }),
            ],
          })
        );

        const desirableRows = renderCriteriaRows(tenderData.desirableCriteria, 'desirable');
        mainTableRows.push(...desirableRows);
      }

      // Additional Information Section (if exists) - matching exact styling
      if (tenderData.additionalInformation && tenderData.additionalInformation.length > 0) {
        mainTableRows.push(
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 2,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Additional Information",
                        bold: true,
                        size: 24, // 12px font size
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                shading: { fill: "e0e0e0" }, // Exact background color
                margins: { 
                  top: 12 * 20, 
                  bottom: 12 * 20, 
                  left: 12 * 20, 
                  right: 12 * 20 
                }, // 12px padding in twips
              }),
            ],
          })
        );

        const additionalRows = renderCriteriaRows(tenderData.additionalInformation, 'additional');
        mainTableRows.push(...additionalRows);
      }

      // Create the main table
      const mainTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        },
        rows: mainTableRows,
      });

      documentChildren.push(mainTable);
      
      // 6. FOOTER (matching exact styling)
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Professional ${detectedSector} Sector Tender Response | Generated by PappsPM`,
              size: 20, // 10px font size  
              color: "666666",
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 20 * 20 }, // 20px marginTop in twips
        })
      );
      
      // Create the document with exact styling
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
      console.error('Error generating tender response docx:', error);
      throw error;
    }
  };

  const downloadTenderResponseDocx = async (tenderData, detectedSector = 'Government') => {
    try {
      const name = tenderData.candidateDetails?.name || 'Criteria_Statement';
      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      
      const rfqNumber = tenderData?.rfqAnalysis?.procurementDetails?.rfqNumber;
      const rfqSuffix = rfqNumber ? `_${rfqNumber}` : '';
      const filename = `${sanitizedName}_${detectedSector}_Criteria_Statement${rfqSuffix}.docx`;
      
      console.log('📄 Generating true tender response .docx document...');
      
      // Generate the document
      const doc = await generateTenderResponseDocx(tenderData, detectedSector);
      
      // Pack and save
      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename);
      
      console.log(`✅ True tender response .docx document generated successfully! No folders will be created when edited.`);
    } catch (error) {
      console.error('❌ Error generating tender response .docx document:', error);
      throw error;
    }
  };

  return {
    generateTenderResponseDocx,
    downloadTenderResponseDocx
  };
};

const TenderResponseWrapper = ({ 
  tenderData, 
  candidateName, 
  onBackToResume, 
  templateType = "criteria-statement",
  onRegenerateTenderResponse = null,
  isRegenerating = false,
  detectedSector = 'Government',
  // Proposal summary props
  onGenerateProposalSummary = null,
  isGeneratingProposal = false,
  hasProposalSummary = false,
  onBackToProposalSummary = null
}) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isWordLoading, setIsWordLoading] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const [currentDetectedSector, setCurrentDetectedSector] = useState(detectedSector);
  const tenderRef = useRef();
  const wordTenderRef = useRef();
  
  // Use the docx hook
  const { downloadTenderResponseDocx } = useTenderResponseDocx();

  // Detect sector from tender data (matching TenderResponseWordCompatible logic)
  useState(() => {
    if (tenderData) {
      const proposedRole = tenderData.candidateDetails?.proposedRole || '';
      const allText = JSON.stringify(tenderData).toLowerCase();
      
      const sectorKeywords = {
        'ICT': ['ict', 'it', 'information technology', 'digital', 'software', 'systems', 'technology', 'business analyst'],
        'Defence': ['defence', 'defense', 'military', 'security', 'army', 'navy', 'air force'],
        'Maritime': ['maritime', 'marine', 'vessel', 'ship', 'port', 'navigation', 'safety authority'],
        'Finance': ['finance', 'financial', 'accounting', 'treasury', 'budget', 'fiscal'],
        'Health': ['health', 'medical', 'healthcare', 'hospital', 'clinical', 'patient'],
        'Education': ['education', 'school', 'university', 'teaching', 'academic'],
        'Infrastructure': ['infrastructure', 'construction', 'engineering', 'transport'],
        'Environment': ['environment', 'sustainability', 'climate', 'conservation'],
        'Legal': ['legal', 'law', 'judicial', 'court', 'legislation', 'compliance']
      };

      for (const [sector, keywords] of Object.entries(sectorKeywords)) {
        if (keywords.some(keyword => allText.includes(keyword))) {
          setCurrentDetectedSector(sector);
          return;
        }
      }
    }
  }, [tenderData]);

  // Enhanced validation for dynamic tender responses
  const validateTenderData = (data) => {
    if (!data) return { isValid: false, errors: ['No tender data provided'] };
    
    const errors = [];
    const warnings = [];

    // Check for required sections
    if (!data.candidateDetails) {
      errors.push('Missing candidate details');
    }

    if (!data.essentialCriteria || data.essentialCriteria.length === 0) {
      errors.push('Missing essential criteria');
    }

    // Validate essential criteria structure
    if (data.essentialCriteria) {
      data.essentialCriteria.forEach((criterion, index) => {
        if (!criterion.response) {
          errors.push(`Essential criterion ${index + 1} missing response`);
        }
        if (!criterion.criteriaTitle && !criterion.criteria) {
          warnings.push(`Essential criterion ${index + 1} missing title`);
        }
      });
    }

    // Validate desirable criteria structure if present
    if (data.desirableCriteria) {
      data.desirableCriteria.forEach((criterion, index) => {
        if (!criterion.response) {
          warnings.push(`Desirable criterion ${index + 1} missing response`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      criteriaCount: {
        essential: data.essentialCriteria?.length || 0,
        desirable: data.desirableCriteria?.length || 0,
        additional: data.additionalInformation?.length || 0
      }
    };
  };

  // Validate tender data on load
  useState(() => {
    if (tenderData) {
      const validation = validateTenderData(tenderData);
      setValidationResults(validation);
      
      if (!validation.isValid) {
        console.warn('Tender data validation issues:', validation.errors);
      }
    }
  }, [tenderData]);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    
    try {
      const name = candidateName || tenderData?.candidateDetails?.name || 'Criteria_Statement';
      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      
      const rfqNumber = tenderData?.rfqAnalysis?.procurementDetails?.rfqNumber;
      const rfqSuffix = rfqNumber ? `_${rfqNumber}` : '';
      const filename = `${sanitizedName}_${currentDetectedSector}_Criteria_Statement${rfqSuffix}.pdf`;
      
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
      await generatePDF(tenderRef, options);
      
      console.log(`${currentDetectedSector} Criteria Statement PDF generated successfully!`);
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
      await downloadTenderResponseDocx(tenderData, currentDetectedSector);
    } catch (error) {
      alert('There was an error generating the Word document. Please try again.');
    } finally {
      setIsWordLoading(false);
    }
  };

  const handleRegenerateClick = () => {
    const sectorText = currentDetectedSector === 'Government' ? 'Criteria Statement' : `${currentDetectedSector} Criteria Statement`;
    
    if (window.confirm(`Are you sure you want to generate a new ${sectorText}? This will replace the current one.`)) {
      if (onRegenerateTenderResponse) {
        onRegenerateTenderResponse();
      } else {
        console.warn('No regeneration handler provided');
      }
    }
  };

  // Handle generate proposal summary click
  const handleGenerateProposalSummaryClick = () => {
    if (onGenerateProposalSummary) {
      onGenerateProposalSummary();
    } else {
      console.warn('No proposal summary handler provided');
    }
  };

  if (!tenderData) {
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
        <h2>No tender response data available</h2>
        <button
          onClick={onBackToResume}
          className="mt-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
        >
          ← Back to Resume
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
            Regenerating {currentDetectedSector} Criteria Statement
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we generate a new response based on your tailored resume...
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> The new response will use the latest analysis of your resume and RFQ requirements.
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
        {/* Back to Resume Button */}
        <button
          onClick={onBackToResume}
          disabled={isRegenerating}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>←</span>
          Back to Tailored Resume
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

        {/* Generate Proposal Summary Button */}
        {onGenerateProposalSummary && (
          <button
            onClick={handleGenerateProposalSummaryClick}
            disabled={isGeneratingProposal || isRegenerating}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
              isGeneratingProposal || isRegenerating
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isGeneratingProposal ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Summary...
              </>
            ) : (
              <>
                <span>📋</span>
                Generate Proposal Summary
              </>
            )}
          </button>
        )}

        {/* Regenerate Response Button */}
        <button
          onClick={handleRegenerateClick}
          disabled={isRegenerating || !onRegenerateTenderResponse}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 ${
            isRegenerating || !onRegenerateTenderResponse
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
              Regenerate Statement
            </>
          )}
        </button>

        {/* Back to Proposal Summary Button */}
        {hasProposalSummary && onBackToProposalSummary && (
          <button
            onClick={onBackToProposalSummary}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center gap-2"
          >
            <span>📑</span>
            Back to Proposal Summary
          </button>
        )}
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
              📋 {currentDetectedSector} Criteria Statement Generated
            </h3>
            <p className="text-blue-700 text-sm">
              Professional tender response for: <strong>{tenderData.candidateDetails?.proposedRole || `${currentDetectedSector} Government Role`}</strong>
            </p>
            {validationResults && (
              <div className="text-xs mt-2">
                <span className="text-green-600">
                  ✅ {validationResults.criteriaCount?.essential || 0} Essential | 
                  {validationResults.criteriaCount?.desirable || 0} Desirable | 
                  {validationResults.criteriaCount?.additional || 0} Additional
                </span>
                {validationResults.warnings?.length > 0 && (
                  <span className="text-yellow-600 ml-2">
                    ⚠️ {validationResults.warnings.length} warnings
                  </span>
                )}
              </div>
            )}
            <p className="text-blue-600 text-xs mt-1">
              ✨ <strong>Enhanced:</strong> Dynamic criteria extraction and response generation!
            </p>
            <p className="text-green-600 text-xs mt-1">
              🚀 <strong>NEW:</strong> Word documents generated using true .docx format - no companion folders created when editing!
            </p>
            {hasProposalSummary && (
              <p className="text-purple-600 text-xs mt-1">
                📑 <strong>Proposal Summary Available:</strong> Narrative format ready for download!
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-600">
              Candidate: <strong>{candidateName || tenderData.candidateDetails?.name}</strong>
            </div>
            <div className="text-xs text-blue-500">
              Generated: {new Date().toLocaleDateString()}
            </div>
            {tenderData.candidateDetails?.responseFormat && (
              <div className="text-xs text-blue-500">
                Format: {tenderData.candidateDetails.responseFormat}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Next Steps Info Banner */}
      {onGenerateProposalSummary && !hasProposalSummary && (
        <div style={{
          maxWidth: '1012.8000488px',
          margin: '0 auto 1rem auto',
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem'
        }}>
          <div className="flex items-start gap-3">
            <div className="text-purple-600 text-2xl">📋</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Next Step: Generate Proposal Summary</h4>
              <p className="text-gray-700 text-sm mb-2">
                Transform your criteria statement into a compelling 200-250 word narrative proposal summary.
              </p>
              <div className="text-xs text-gray-600">
                <span className="inline-block mr-4">✓ Same professional formatting</span>
                <span className="inline-block mr-4">✓ Flowing paragraph style</span>
                <span className="inline-block">✓ PDF & Word download ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display tender response for PDF generation */}
      <div style={{
        maxWidth: '1012.8000488px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}>
        <div ref={tenderRef}>
          <TenderResponseNew tenderData={tenderData} />
        </div>
      </div>

      {/* Hidden Word-compatible version for legacy Word document generation */}
      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px',
        width: '1012px'
      }}>
        <div ref={wordTenderRef}>
          <TenderResponseWordCompatible tenderData={tenderData} />
        </div>
      </div>
    </div>
  );
};

export default TenderResponseWrapper;