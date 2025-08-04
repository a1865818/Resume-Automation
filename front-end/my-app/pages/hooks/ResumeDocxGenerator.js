import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  LevelFormat,
  Packer,
  PageOrientation,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";

// Helper function to convert image to base64 (for embedding)
const imageToBase64 = async (imagePath) => {
  try {
    console.log(`🔄 Loading image: ${imagePath}`);

    const response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }
    const blob = await response.blob();

    // Validate that it's actually an image
    if (!blob.type.startsWith("image/")) {
      throw new Error(`Invalid image type: ${blob.type}`);
    }

    console.log(
      `✅ Image loaded successfully: ${imagePath} (${blob.type}, ${blob.size} bytes)`
    );

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;

        // Additional validation of the result
        if (!result || typeof result !== "string") {
          reject(new Error("FileReader result is invalid"));
          return;
        }

        if (!result.startsWith("data:")) {
          reject(new Error("FileReader result is not a proper data URL"));
          return;
        }

        // Validate base64 structure
        const parts = result.split(",");
        if (parts.length !== 2 || !parts[1]) {
          reject(new Error("Invalid base64 structure"));
          return;
        }

        console.log(
          `✅ Base64 conversion successful: ${imagePath} (${parts[1].length} characters)`
        );
        resolve(result);
      };
      reader.onerror = () => reject(new Error("FileReader error"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("❌ Could not load image:", imagePath, error.message);
    return null;
  }
};

const getImageData = (base64String) => {
  if (!base64String || typeof base64String !== "string") {
    console.warn("getImageData: Invalid input - not a string or null");
    return null;
  }

  try {
    // Check if it's a proper data URL
    if (!base64String.startsWith("data:")) {
      console.warn("getImageData: Invalid format - not a data URL");
      return null;
    }

    const parts = base64String.split(",");
    if (parts.length !== 2) {
      console.warn(
        "getImageData: Invalid base64 format - wrong number of parts"
      );
      return null;
    }

    const header = parts[0];
    const data = parts[1];

    // Validate the header format
    if (!header.includes("data:") || !header.includes("base64")) {
      console.warn("getImageData: Invalid header format");
      return null;
    }

    // Validate base64 data - basic check for valid characters
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(data)) {
      console.warn("getImageData: Invalid base64 data characters");
      return null;
    }

    // Ensure data is not empty
    if (!data || data.length === 0) {
      console.warn("getImageData: Empty base64 data");
      return null;
    }

    // Determine image type from header with better validation
    let type = "png"; // default
    if (header.includes("jpeg") || header.includes("jpg")) {
      type = "jpg";
    } else if (header.includes("png")) {
      type = "png";
    } else if (header.includes("gif")) {
      type = "gif";
    } else if (header.includes("webp")) {
      type = "webp";
    } else if (header.includes("bmp")) {
      type = "bmp";
    }

    console.log(
      `✅ getImageData: Successfully processed ${type} image (${data.length} characters)`
    );
    return { data, type };
  } catch (error) {
    console.error(
      "getImageData: Failed to parse base64 image data:",
      error.message
    );
    return null;
  }
};

// Helper function to create properly formatted ImageRun
const createImageRun = (imageData, transformation, floatingOptions = null) => {
  if (!imageData || !imageData.data) {
    console.warn("createImageRun: Invalid image data");
    return null;
  }

  try {
    console.log(
      `🖼️ Creating ImageRun: ${imageData.type}, data length: ${imageData.data.length}`
    );

    const imageRunConfig = {
      data: Buffer.from(imageData.data, "base64"),
      transformation: transformation,
      type: imageData.type === "jpg" ? "jpg" : "png",
    };

    // Add floating properties if provided
    if (floatingOptions) {
      imageRunConfig.floating = floatingOptions;
    }

    const imageRun = new ImageRun(imageRunConfig);

    console.log(`✅ ImageRun created successfully for ${imageData.type} image`);
    return imageRun;
  } catch (error) {
    console.error(
      "❌ createImageRun: Failed to create ImageRun:",
      error.message
    );
    return null;
  }
};

// Helper function to create image paragraph with no spacing/margins
const createImageParagraph = (imageRun, alignment = AlignmentType.CENTER) => {
  return new Paragraph({
    children: [imageRun],
    alignment: alignment,
    spacing: { before: 0, after: 0 },
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
};

// Helper function to create TableCell with no internal padding/margins
const createNoPaddingTableCell = (children, options = {}) => {
  const { width, rowSpan, shading, verticalAlign, borders } = options;

  return new TableCell({
    children: children,
    width: width,
    ...(rowSpan && { rowSpan }),
    ...(shading && { shading }),
    ...(verticalAlign && { verticalAlign }),
    ...(borders && { borders }),
    margins: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
};

// Helper function to validate document structure
const validateDocumentStructure = (documentChildren) => {
  try {
    console.log("🔍 Validating document structure...");

    if (!Array.isArray(documentChildren)) {
      console.warn("⚠️ Document children is not an array");
      return false;
    }

    if (documentChildren.length === 0) {
      console.warn("⚠️ Document has no children");
      return false;
    }

    let tableCount = 0;
    let paragraphCount = 0;

    documentChildren.forEach((child, index) => {
      if (child && typeof child === "object") {
        if (child.constructor.name === "Table") {
          tableCount++;
          console.log(`✅ Found Table at index ${index}`);
        } else if (child.constructor.name === "Paragraph") {
          paragraphCount++;
          console.log(`✅ Found Paragraph at index ${index}`);
        } else {
          console.log(`ℹ️ Found ${child.constructor.name} at index ${index}`);
        }
      } else {
        console.warn(`⚠️ Invalid child at index ${index}:`, child);
      }
    });

    console.log(
      `✅ Document structure validation complete: ${tableCount} tables, ${paragraphCount} paragraphs, ${documentChildren.length} total children`
    );
    return true;
  } catch (error) {
    console.error("❌ Document structure validation failed:", error.message);
    return false;
  }
};

// Custom hook for resume docx generation
const useResumeDocx = () => {
  // Generate SME Gateway template docx
  const generateSMEGatewayDocx = async (
    resumeData,
    mainExperience,
    getExperiencePages
  ) => {
    try {
      console.log("🚀 Starting SME Gateway resume docx generation...");

      // Load images
      const pappspmLogoBase64 = await imageToBase64("/PappspmLogo.jpeg");
      const smeLogoBase64 = await imageToBase64("/assets/images/SMELogo.jpeg");
      const decorationLeftBase64 = await imageToBase64(
        "/assets/images/DecorationLeft.jpeg"
      );
      const decorationRightBase64 = await imageToBase64(
        "/assets/images/DecorationRight.jpeg"
      );

      const documentChildren = [];

      // Calculate scaling for landscape A4 (matching your scaleFactor)
      const scaleFactor = 0.74; // 1123 / 1512.8

      // Main table structure for the three-column layout (now with two rows for split backgrounds)
      const mainTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          // First row: Profile Photo (left, no padding), Profile (middle, light gray), Referees/Experience (right)
          new TableRow({
            children: [
              // LEFT COLUMN - Profile Photo + Details (Black background, spans two rows)
              (() => {
                // Build children starting with photo (if present)
                const leftChildren = [];

                if (resumeData.profile.photo) {
                  const imageData = resumeData.profile.photo.includes("data:")
                    ? getImageData(resumeData.profile.photo)
                    : null;

                  if (imageData) {
                    const floatingOptions = {
                      horizontalPosition: {
                        // relative: "column", // Relative to table column
                        // relative: "cell",
                        // align: "left",
                        offset: 0, // 500,000 twips = 34.7 cm
                      },
                      verticalPosition: {
                        relative: "paragraph", // Relative to the current paragraph
                        // align: "top",
                        offset: -170000, // 100,000 twips = ~7 cm
                      },
                      allowOverlap: false,
                      lockAnchor: true,
                      behindText: false,
                      layoutInCell: true,
                      wrap: {
                        type: "square",
                        side: "bothSides",
                      },
                    };

                    const imageRun = createImageRun(
                      imageData,
                      {
                        width: Math.round(311 * scaleFactor),
                        height: Math.round(385 * scaleFactor),
                      },
                      floatingOptions // Pass floating options as third parameter
                    );

                    if (imageRun) {
                      leftChildren.push(
                        new Paragraph({
                          children: [imageRun],
                          spacing: { before: 0, after: 0 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "" })],
                          spacing: {
                            before: 0,
                            after: Math.round(250 * scaleFactor * 20), // Roughly image height
                          },
                        })
                      );
                    }
                  }
                }

                // Add Profile details directly under the image
                leftChildren.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.name,
                        bold: true,
                        size: Math.round(30 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(4 * scaleFactor * 20),
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.title,
                        bold: true,
                        size: Math.round(12 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: { after: Math.round(4 * scaleFactor * 20) },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.location,
                        size: Math.round(11 * scaleFactor * 2),
                        color: "D1D5DB",
                        font: "Montserrat",
                        allCaps: true,
                      }),
                    ],
                    spacing: { after: Math.round(12 * scaleFactor * 20) },
                  }),

                  // SECURITY CLEARANCE
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "SECURITY CLEARANCE",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),
                  createWhiteBulletParagraph(
                    resumeData.profile.clearance &&
                      resumeData.profile.clearance !== "NONE"
                      ? resumeData.profile.clearance
                      : "Able to obtain security clearance.",
                    {
                      size: Math.round(10.5 * scaleFactor * 2),
                      color: "FFFFFF",
                      font: "Montserrat",
                      spacing: { after: Math.round(16 * scaleFactor * 20) },
                    }
                  ),

                  // QUALIFICATIONS
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "QUALIFICATIONS",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),
                  ...resumeData.qualifications.map((qual) =>
                    createWhiteBulletParagraph(qual, {
                      size: Math.round(10.5 * scaleFactor * 2),
                      color: "FFFFFF",
                      font: "Montserrat",
                      spacing: { after: Math.round(4 * scaleFactor * 20) },
                    })
                  ),

                  // AFFILIATIONS
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "AFFILIATIONS",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),
                  ...(resumeData.affiliations &&
                    resumeData.affiliations.length > 0
                    ? resumeData.affiliations.map((aff) =>
                      createWhiteBulletParagraph(aff, {
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                        spacing: { after: Math.round(4 * scaleFactor * 20) },
                      })
                    )
                    : [
                      createWhiteBulletParagraph("No information given", {
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ])
                );

                // if (decorationLeftBase64) {
                //   const imageData = getImageData(decorationLeftBase64);
                //   if (imageData) {
                //     const floatingOptions = {
                //       horizontalPosition: {
                //         relative: "column",
                //         // align: "left",
                //         offset: 0,
                //       },
                //       verticalPosition: {
                //         relative: "column",
                //         // align: "bottom",
                //         offset: 0,
                //       },
                //       allowOverlap: false,
                //       lockAnchor: true,
                //       behindText: false,
                //       layoutInCell: true,
                //       wrap: {
                //         type: "square",
                //         side: "bothSides",
                //       },
                //     };
                //     const imageRun = createImageRun(
                //       imageData,
                //       {
                //         width: Math.round(270 * scaleFactor),
                //         height: Math.round(150 * scaleFactor),
                //       },
                //       floatingOptions
                //     );
                //     if (imageRun) {
                //       leftChildren.push(
                //         new Paragraph({
                //           children: [imageRun],
                //           alignment: AlignmentType.LEFT,
                //           spacing: { before: Math.round(12 * scaleFactor * 20) },
                //         })
                //       );
                //     }
                //   }
                // }

                return new TableCell({
                  rowSpan: 2,
                  width: { size: 22, type: WidthType.PERCENTAGE },
                  shading: { fill: "000000" },
                  margins: {
                    top: 0,
                    bottom: Math.round(18 * scaleFactor * 20),
                    left: Math.round(18 * scaleFactor * 20),
                    right: Math.round(18 * scaleFactor * 20),
                  },
                  children: leftChildren,
                  verticalAlign: VerticalAlign.TOP,
                });
              })(),
              // MIDDLE COLUMN - Profile Section (Light gray)
              new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "PROFILE",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "1E293B",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: 0,
                      after: Math.round(9 * scaleFactor * 20),
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.description,
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "374151",
                        font: "Montserrat",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                      after: Math.round(9 * scaleFactor * 20),
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.description2,
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "374151",
                        font: "Montserrat",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                  }),
                ],
                shading: { fill: "EDEDED" },
                margins: {
                  top: 0,
                  bottom: 0,
                  left: Math.round(18 * scaleFactor * 20),
                  right: Math.round(18 * scaleFactor * 20),
                },
                verticalAlign: VerticalAlign.TOP,
              }),
              // RIGHT COLUMN - Referees & Experience (White background, rowSpan: 2)
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                rowSpan: 2,
                children: [
                  // Referees and Logos Section
                  new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                      insideHorizontal: { style: BorderStyle.NONE },
                      insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                      new TableRow({
                        children: [
                          // Referees
                          new TableCell({
                            width: { size: 60, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "REFEREES",
                                    bold: true,
                                    size: Math.round(15 * scaleFactor * 2),
                                    color: "1E293B",
                                    font: "Montserrat",
                                  }),
                                ],
                                spacing: {
                                  after: Math.round(9 * scaleFactor * 20),
                                },
                              }),

                              ...(resumeData.referees &&
                                resumeData.referees.length > 0
                                ? resumeData.referees.flatMap((referee) => [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: referee.title,
                                        bold: true,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "1E293B",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(3 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: `N: ${referee.name}`,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(3 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: `E: ${referee.email}`,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(3 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: `M: ${referee.phone}`,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(
                                        12 * scaleFactor * 20
                                      ),
                                    },
                                  }),
                                ])
                                : [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: "Available upon request",
                                        italics: true,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                  }),
                                ]),
                            ],
                            borders: {
                              top: { style: BorderStyle.NONE },
                              bottom: { style: BorderStyle.NONE },
                              left: { style: BorderStyle.NONE },
                              right: { style: BorderStyle.NONE },
                            },
                          }),

                          // Logos (SME + PappsPM) - align horizontally
                          new TableCell({
                            width: { size: 40, type: WidthType.PERCENTAGE },
                            children: (() => {
                              const logoRuns = [];
                              if (smeLogoBase64) {
                                const smeData = getImageData(smeLogoBase64);
                                if (smeData) {
                                  const smeRun = createImageRun(smeData, {
                                    width: 80,
                                    height: 60,
                                  });
                                  if (smeRun) logoRuns.push(smeRun);
                                }
                              }
                              if (pappspmLogoBase64) {
                                const pappsData =
                                  getImageData(pappspmLogoBase64);
                                if (pappsData) {
                                  const pappsRun = createImageRun(pappsData, {
                                    width: 70,
                                    height: 60,
                                  });
                                  if (pappsRun) {
                                    logoRuns.push(pappsRun);
                                  }
                                }
                              }
                              return logoRuns.length
                                ? [
                                  new Paragraph({
                                    children: logoRuns,
                                    alignment: AlignmentType.RIGHT,
                                    spacing: {
                                      after: Math.round(
                                        10 * scaleFactor * 20
                                      ),
                                    },
                                  }),
                                ]
                                : [];
                            })(),
                            borders: {
                              top: { style: BorderStyle.NONE },
                              bottom: { style: BorderStyle.NONE },
                              left: { style: BorderStyle.NONE },
                              right: { style: BorderStyle.NONE },
                            },
                          }),
                        ],
                      }),
                    ],
                  }),

                  // Experience Section
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "RELEVANT EXPERIENCE",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "1E293B",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(18 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),

                  ...mainExperience.flatMap((exp) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: exp.title,
                          bold: true,
                          size: Math.round(10.5 * scaleFactor * 2),
                          color: "1E293B",
                          font: "Montserrat",
                        }),
                      ],
                      spacing: {
                        before: Math.round(9 * scaleFactor * 20),
                        after: Math.round(3 * scaleFactor * 20),
                      },
                    }),

                    ...(exp.period
                      ? [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: exp.period,
                              size: Math.round(10.5 * scaleFactor * 2),
                              color: "4B5563",
                              font: "Montserrat",
                            }),
                          ],
                          spacing: {
                            after: Math.round(9 * scaleFactor * 20),
                          },
                        }),
                      ]
                      : []),

                    ...(exp.responsibilities
                      ? exp.responsibilities.map((resp) =>
                        createBulletParagraph(resp, {
                          size: Math.round(10.5 * scaleFactor * 2),
                          color: "000000",
                          font: "Montserrat",
                          alignment: AlignmentType.JUSTIFIED,
                          spacing: {
                            after: Math.round(4 * scaleFactor * 20),
                          },
                        })
                      )
                      : []),
                  ]),
                ],
                margins: {
                  top: Math.round(18 * scaleFactor * 20),
                  bottom: Math.round(18 * scaleFactor * 20),
                  left: Math.round(18 * scaleFactor * 20),
                  right: Math.round(18 * scaleFactor * 20),
                },
              }),
            ],
          }),
          // Second row: only Middle Skills cell (left & right columns are spanned)
          new TableRow({
            children: [
              // MIDDLE COLUMN - Skills Section (Dark gray)
              new TableCell({
                width: { size: 33, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "SKILLS",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(18 * scaleFactor * 20),
                      after: Math.round(9 * scaleFactor * 20),
                    },
                  }),
                  ...resumeData.skills.map((skill) =>
                    createWhiteBulletParagraph(skill, {
                      size: Math.round(10.5 * scaleFactor * 2),
                      color: "FFFFFF",
                      font: "Montserrat",
                      spacing: {
                        after: Math.round(4 * scaleFactor * 20),
                      },
                    })
                  ),
                ],
                shading: { fill: "9E9E9E" },
                margins: {
                  top: 0,
                  bottom: 0,
                  left: Math.round(18 * scaleFactor * 20),
                  right: Math.round(18 * scaleFactor * 20),
                },
              }),
            ],
          }),
        ],
      });

      documentChildren.push(mainTable);

      // Decoration Table (same columns as mainTable, no margin/padding)
      const decorationTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              // LEFT COLUMN - decorationLeft
              new TableCell({
                width: { size: 22, type: WidthType.PERCENTAGE },
                shading: { fill: "000000" },
                children: decorationLeftBase64
                  ? [
                    (() => {
                      const imageData = getImageData(decorationLeftBase64);
                      if (imageData) {
                        const imageRun = createImageRun(imageData, {
                          width: Math.round(270 * scaleFactor),
                          height: Math.round(150 * scaleFactor),
                        });
                        if (imageRun) {
                          return new Paragraph({
                            children: [imageRun],
                            alignment: AlignmentType.LEFT,
                          });
                        }
                      }
                      return new Paragraph({ children: [] });
                    })(),
                  ]
                  : [new Paragraph({ children: [] })],
                verticalAlign: VerticalAlign.BOTTOM,
              }),
              // MIDDLE COLUMN - empty
              new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                shading: { fill: "9E9E9E" },
                children: [new Paragraph({ children: [] })],
              }),
              // RIGHT COLUMN - decorationRight
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: decorationRightBase64
                  ? [
                    (() => {
                      const imageData = getImageData(decorationRightBase64);
                      if (imageData) {
                        const imageRun = createImageRun(imageData, {
                          width: Math.round(250 * scaleFactor),
                          height: Math.round(135 * scaleFactor),
                        });
                        if (imageRun) {
                          return new Paragraph({
                            children: [imageRun],
                            alignment: AlignmentType.RIGHT,
                          });
                        }
                      }
                      return new Paragraph({ children: [] });
                    })(),
                  ]
                  : [new Paragraph({ children: [] })],
                verticalAlign: VerticalAlign.BOTTOM,
              }),
            ],
          }),
        ],
      });
      documentChildren.push(decorationTable);

      // Validate document structure before creating Document
      validateDocumentStructure(documentChildren);

      // ADDITIONAL EXPERIENCE PAGES (with unified table structure)
      if (getExperiencePages && getExperiencePages.length > 0) {
        getExperiencePages.forEach((pageData, pageIndex) => {
          // Page break
          documentChildren.push(new Paragraph({ pageBreakBefore: true }));

          const leftColumnItems = pageData.filter(
            (item) => item.column === "left"
          );
          const rightColumnItems = pageData.filter(
            (item) => item.column === "right"
          );

          console.log(
            `SME Gateway Page ${pageIndex + 1} - Left column items:`,
            leftColumnItems.length
          );
          console.log(
            `SME Gateway Page ${pageIndex + 1} - Right column items:`,
            rightColumnItems.length
          );

          // Helper function to render experience items
          const renderExperienceItems = (items) => {
            return items.flatMap((item) => {
              if (item.type === "header") {
                return [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: item.content.title,
                        bold: true,
                        size: Math.round(11 * scaleFactor * 2),
                        color: "1E293B",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(6 * scaleFactor * 20),
                      after: Math.round(3 * scaleFactor * 20),
                    },
                  }),
                  ...(item.content.company
                    ? [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.content.company,
                            italics: true,
                            size: Math.round(11 * scaleFactor * 2),
                            color: "6B7280",
                            font: "Montserrat",
                          }),
                        ],
                        spacing: {
                          after: Math.round(1.5 * scaleFactor * 20),
                        },
                      }),
                    ]
                    : []),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: item.content.period,
                        size: Math.round(11 * scaleFactor * 2),
                        color: "4B5563",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: { after: Math.round(9 * scaleFactor * 20) },
                  }),
                ];
              } else if (item.type === "bullet") {
                return [
                  createBulletParagraph(item.content.text, {
                    size: Math.round(11 * scaleFactor * 2),
                    color: "374151",
                    font: "Montserrat",
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: Math.round(2 * scaleFactor * 20) },
                  }),
                ];
              }
              return [];
            });
          };

          // second page unified table structure
          const unifiedTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              // HEADER ROW (spans all columns)
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 3, // Span across all 3 columns
                    children: [
                      // Header content in a nested table
                      new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                          insideHorizontal: { style: BorderStyle.NONE },
                          insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: [
                          new TableRow({
                            children: [
                              new TableCell({
                                width: { size: 10, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                                children: pappspmLogoBase64
                                  ? (() => {
                                    const imageData =
                                      getImageData(pappspmLogoBase64);
                                    if (imageData) {
                                      const imageRun = createImageRun(
                                        imageData,
                                        {
                                          width: Math.round(
                                            160 * scaleFactor
                                          ),
                                          height: Math.round(
                                            125 * scaleFactor
                                          ),
                                        }
                                      );

                                      return imageRun
                                        ? [
                                          new Paragraph({
                                            children: [imageRun],
                                            alignment: AlignmentType.LEFT,
                                          }),
                                        ]
                                        : [];
                                    }
                                    return [];
                                  })()
                                  : [],
                                shading: { fill: "000000" },
                              }),
                              new TableCell({
                                width: { size: 80, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: resumeData.profile.name,
                                        bold: true,
                                        size: Math.round(28 * scaleFactor * 2),
                                        color: "FFFFFF",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    alignment: AlignmentType.CENTER,
                                    spacing: {
                                      after: Math.round(4 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: resumeData.profile.title,
                                        size: Math.round(
                                          15.5 * scaleFactor * 2
                                        ),
                                        color: "FFFFFF",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    alignment: AlignmentType.CENTER,
                                  }),
                                ],
                                shading: { fill: "000000" },
                              }),
                              new TableCell({
                                width: { size: 10, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                                children: smeLogoBase64
                                  ? (() => {
                                    const imageData =
                                      getImageData(smeLogoBase64);
                                    if (imageData) {
                                      const imageRun = createImageRun(
                                        imageData,
                                        {
                                          width: Math.round(
                                            175 * scaleFactor
                                          ),
                                          height: Math.round(
                                            125 * scaleFactor
                                          ),
                                        }
                                      );

                                      return imageRun
                                        ? [
                                          new Paragraph({
                                            children: [imageRun],
                                            alignment: AlignmentType.RIGHT,
                                          }),
                                        ]
                                        : [];
                                    }
                                    return [];
                                  })()
                                  : [],
                                shading: { fill: "FFFFFF" },
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                ],
              }),

              // CONTENT ROW (3 columns: left content, vertical line, right content)
              new TableRow({
                children: [
                  // LEFT COLUMN
                  new TableCell({
                    width: { size: 49.75, type: WidthType.PERCENTAGE }, // Slightly less than 50% to account for line
                    children: [
                      ...renderExperienceItems(leftColumnItems),
                      // Add empty paragraph if no content to ensure column structure
                      ...(leftColumnItems.length === 0
                        ? [
                          new Paragraph({
                            children: [new TextRun({ text: "" })],
                          }),
                        ]
                        : []),
                    ],
                    margins: {
                      top: Math.round(12 * scaleFactor * 20),
                      bottom: Math.round(12 * scaleFactor * 20),
                      left: Math.round(12 * scaleFactor * 20),
                      right: Math.round(6 * scaleFactor * 20), // Reduced right margin
                    },
                    verticalAlign: VerticalAlign.TOP,
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                  // VERTICAL LINE COLUMN (separate column, not a border)
                  new TableCell({
                    width: { size: 0.2, type: WidthType.PERCENTAGE }, // Very thin column for the line
                    children: [], // No content, just the line
                    shading: { fill: "000000" }, // Black background creates the line
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                  // RIGHT COLUMN
                  new TableCell({
                    width: { size: 49.75, type: WidthType.PERCENTAGE }, // Slightly less than 50% to account for line
                    children: [
                      ...renderExperienceItems(rightColumnItems),
                      // Add empty paragraph if no content to ensure column structure
                      ...(rightColumnItems.length === 0
                        ? [
                          new Paragraph({
                            children: [new TextRun({ text: "" })],
                          }),
                        ]
                        : []),
                    ],
                    margins: {
                      top: Math.round(12 * scaleFactor * 20),
                      bottom: Math.round(12 * scaleFactor * 20),
                      left: Math.round(12 * scaleFactor * 20), // Reduced left margin
                      right: Math.round(12 * scaleFactor * 20),
                    },
                    verticalAlign: VerticalAlign.TOP,
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                ],
              }),
            ],
          });

          documentChildren.push(unifiedTable);
        });
      }

      // Create the document
      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "bullet-numbering",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.BULLET,
                  text: "•",
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: {
                      indent: {
                        left: convertInchesToTwip(0.25),
                        hanging: convertInchesToTwip(0.25),
                      },
                    },
                  },
                },
              ],
            },
            {
              reference: "white-bullet-numbering",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.BULLET,
                  text: "•",
                  alignment: AlignmentType.LEFT,
                  style: {
                    run: {
                      color: "FFFFFF",
                      font: "Montserrat",
                    },
                    paragraph: {
                      indent: {
                        left: convertInchesToTwip(0.25),
                        hanging: convertInchesToTwip(0.25),
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
        styles: {
          default: {
            document: {
              run: {
                font: "Montserrat",
              },
            },
          },
        },
        sections: [
          {
            properties: {
              page: {
                size: {
                  orientation: PageOrientation.LANDSCAPE,
                  width: 16838, // A4 landscape width in twips
                  height: 11906, // A4 landscape height in twips
                },
                margin: {
                  top: 567, // 0.4 inch
                  right: 567,
                  bottom: 567,
                  left: 567,
                },
              },
            },
            children: documentChildren,
          },
        ],
      });

      // Validate document structure
      validateDocumentStructure(documentChildren);

      return doc;
    } catch (error) {
      console.error("Error generating SME Gateway resume docx:", error);
      throw error;
    }
  };

  // Generate Default template docx (without SME logo)
  const generateDefaultDocx = async (
    resumeData,
    mainExperience,
    getExperiencePages
  ) => {
    try {
      console.log("🚀 Starting Default resume docx generation...");

      // Load images (no SME logo for default)
      const pappspmLogoBase64 = await imageToBase64("/PappspmLogo.jpeg");
      const decorationLeftBase64 = await imageToBase64(
        "/assets/images/DecorationLeft.jpeg"
      );
      const decorationRightBase64 = await imageToBase64(
        "/assets/images/DecorationRight.jpeg"
      );
      const decorationLeftSecondPageBase64 = await imageToBase64(
        "/assets/images/DecorationLeftSecondPage.jpeg"
      );
      const decorationTopRightWordBase64 = await imageToBase64(
        "/assets/images/DecorationTopRightWord.jpeg"
      );

      const documentChildren = [];

      // Calculate scaling for landscape A4
      const scaleFactor = 0.74;

      // FIRST PAGE - Three column layout (similar to SME Gateway but without SME logo)
      const mainTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          // First row: Profile Photo (left, no padding), Profile (middle, light gray), Referees/Experience (right)
          new TableRow({
            children: [
              // LEFT COLUMN - Profile Photo + Details (Black background, spans two rows)
              (() => {
                const leftChildren = [];

                if (resumeData.profile.photo) {
                  const imageData = resumeData.profile.photo.includes("data:")
                    ? getImageData(resumeData.profile.photo)
                    : null;

                  if (imageData) {
                    const floatingOptions = {
                      horizontalPosition: {
                        // relative: "column", // Relative to table column
                        // relative: "cell",
                        // align: "left",
                        offset: 0, // 500,000 twips = 34.7 cm
                      },
                      verticalPosition: {
                        relative: "paragraph", // Relative to the current paragraph
                        // align: "top",
                        offset: -170000, // 100,000 twips = ~7 cm
                      },
                      allowOverlap: false,
                      lockAnchor: true,
                      behindText: false,
                      layoutInCell: true,
                      wrap: {
                        type: "square",
                        side: "bothSides",
                      },
                    };

                    const imageRun = createImageRun(
                      imageData,
                      {
                        width: Math.round(311 * scaleFactor),
                        height: Math.round(385 * scaleFactor),
                      },
                      floatingOptions // Pass floating options as third parameter
                    );

                    if (imageRun) {
                      leftChildren.push(
                        new Paragraph({
                          children: [imageRun],
                          spacing: { before: 0, after: 0 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "" })],
                          spacing: {
                            before: 0,
                            after: Math.round(250 * scaleFactor * 20), // Roughly image height
                          },
                        })
                      );
                    }
                  }
                }

                // Add details paragraphs identical to SME section
                leftChildren.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.name,
                        bold: true,
                        size: Math.round(30 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(4 * scaleFactor * 20),
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.title,
                        bold: true,
                        size: Math.round(12 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: { after: Math.round(4 * scaleFactor * 20) },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.location,
                        size: Math.round(11 * scaleFactor * 2),
                        color: "D1D5DB",
                        font: "Montserrat",
                        allCaps: true,
                      }),
                    ],
                    spacing: { after: Math.round(12 * scaleFactor * 20) },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "SECURITY CLEARANCE",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),
                  createWhiteBulletParagraph(
                    resumeData.profile.clearance &&
                      resumeData.profile.clearance !== "NONE"
                      ? resumeData.profile.clearance
                      : "Able to obtain security clearance.",
                    {
                      size: Math.round(10.5 * scaleFactor * 2),
                      color: "FFFFFF",
                      font: "Montserrat",
                      spacing: { after: Math.round(16 * scaleFactor * 20) },
                    }
                  ),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "QUALIFICATIONS",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),
                  ...resumeData.qualifications.map((qual) =>
                    createWhiteBulletParagraph(qual, {
                      size: Math.round(10.5 * scaleFactor * 2),
                      color: "FFFFFF",
                      font: "Montserrat",
                      spacing: { after: Math.round(4 * scaleFactor * 20) },
                    })
                  ),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "AFFILIATIONS",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),
                  ...(resumeData.affiliations &&
                    resumeData.affiliations.length > 0
                    ? resumeData.affiliations.map((aff) =>
                      createWhiteBulletParagraph(aff, {
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                        spacing: { after: Math.round(4 * scaleFactor * 20) },
                      })
                    )
                    : [
                      createWhiteBulletParagraph("No information given", {
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ])
                );

                return new TableCell({
                  rowSpan: 2,
                  width: { size: 22, type: WidthType.PERCENTAGE },
                  shading: { fill: "000000" },
                  margins: {
                    top: 0,
                    bottom: Math.round(18 * scaleFactor * 20),
                    left: Math.round(18 * scaleFactor * 20),
                    right: Math.round(18 * scaleFactor * 20),
                  },
                  children: leftChildren,
                  verticalAlign: VerticalAlign.TOP,
                });
              })(),
              // MIDDLE COLUMN - Profile Section (Light gray)
              new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "PROFILE",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "1E293B",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: 0,
                      after: Math.round(9 * scaleFactor * 20),
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.description,
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "374151",
                        font: "Montserrat",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                      after: Math.round(9 * scaleFactor * 20),
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.description2,
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "374151",
                        font: "Montserrat",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                  }),
                ],
                shading: { fill: "EDEDED" },
                margins: {
                  top: 0,
                  bottom: 0,
                  left: Math.round(18 * scaleFactor * 20),
                  right: Math.round(18 * scaleFactor * 20),
                },
                verticalAlign: VerticalAlign.TOP,
              }),

              // RIGHT COLUMN - Referees & Experience (White background)
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE }, // ~750px of 1123px
                rowSpan: 2,
                children: [
                  // Referees and Logo Section (only PappsPM logo for default)
                  new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                      insideHorizontal: { style: BorderStyle.NONE },
                      insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                      new TableRow({
                        children: [
                          // Referees
                          new TableCell({
                            width: { size: 70, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "REFEREES",
                                    bold: true,
                                    size: Math.round(15 * scaleFactor * 2),
                                    color: "1E293B",
                                    font: "Montserrat",
                                  }),
                                ],
                                spacing: {
                                  after: Math.round(9 * scaleFactor * 20),
                                },
                              }),

                              ...(resumeData.referees &&
                                resumeData.referees.length > 0
                                ? resumeData.referees.flatMap((referee) => [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: referee.title || "",
                                        bold: true,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "1E293B",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(3 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: `N: ${referee.name} `,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(3 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: `E: ${referee.email}`,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(3 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: `M: ${referee.phone}`,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(
                                        12 * scaleFactor * 20
                                      ),
                                    },
                                  }),
                                ])
                                : [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: "Available upon request",
                                        italics: true,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                  }),
                                ]),
                            ],
                            borders: {
                              top: { style: BorderStyle.NONE },
                              bottom: { style: BorderStyle.NONE },
                              left: { style: BorderStyle.NONE },
                              right: { style: BorderStyle.NONE },
                            },
                          }),

                          // Only PappsPM Logo for default template
                          new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            children: pappspmLogoBase64
                              ? (() => {
                                const imageData =
                                  getImageData(pappspmLogoBase64);
                                if (imageData) {
                                  const imageRun = createImageRun(imageData, {
                                    width: 80,
                                    height: 80,
                                  });

                                  return imageRun
                                    ? [
                                      new Paragraph({
                                        children: [imageRun],
                                        alignment: AlignmentType.RIGHT,
                                      }),
                                    ]
                                    : [];
                                }
                                return [];
                              })()
                              : [],
                            borders: {
                              top: { style: BorderStyle.NONE },
                              bottom: { style: BorderStyle.NONE },
                              left: { style: BorderStyle.NONE },
                              right: { style: BorderStyle.NONE },
                            },
                          }),
                        ],
                      }),
                    ],
                  }),

                  // Experience Section (same as SME Gateway)
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "RELEVANT EXPERIENCE",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "1E293B",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(18 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),

                  ...mainExperience.flatMap((exp) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: exp.title,
                          bold: true,
                          size: Math.round(10.5 * scaleFactor * 2),
                          color: "1E293B",
                          font: "Montserrat",
                        }),
                      ],
                      spacing: {
                        before: Math.round(9 * scaleFactor * 20),
                        after: Math.round(3 * scaleFactor * 20),
                      },
                    }),

                    ...(exp.period
                      ? [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: exp.period,
                              size: Math.round(10.5 * scaleFactor * 2),
                              color: "4B5563",
                              font: "Montserrat",
                            }),
                          ],
                          spacing: {
                            after: Math.round(9 * scaleFactor * 20),
                          },
                        }),
                      ]
                      : []),

                    ...(exp.responsibilities
                      ? exp.responsibilities.map((resp) =>
                        createBulletParagraph(resp, {
                          size: Math.round(10.5 * scaleFactor * 2),
                          color: "000000",
                          font: "Montserrat",
                          alignment: AlignmentType.JUSTIFIED,
                          spacing: {
                            after: Math.round(4 * scaleFactor * 20),
                          },
                        })
                      )
                      : []),
                  ]),
                ],
                margins: {
                  top: Math.round(18 * scaleFactor * 20),
                  bottom: Math.round(18 * scaleFactor * 20),
                  left: Math.round(18 * scaleFactor * 20),
                  right: Math.round(18 * scaleFactor * 20),
                },
              }),
            ],
          }),

          // Second row: only Skills cell (left & right columns spanned)
          new TableRow({
            children: [
              new TableCell({
                width: { size: 33, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "SKILLS",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(18 * scaleFactor * 20),
                      after: Math.round(9 * scaleFactor * 20),
                    },
                  }),
                  ...resumeData.skills.map((skill) =>
                    createWhiteBulletParagraph(skill, {
                      size: Math.round(10.5 * scaleFactor * 2),
                      color: "FFFFFF",
                      font: "Montserrat",
                      spacing: { after: Math.round(4 * scaleFactor * 20) },
                    })
                  ),
                ],
                shading: { fill: "9E9E9E" },
                margins: {
                  top: 0,
                  bottom: 0,
                  left: Math.round(18 * scaleFactor * 20),
                  right: Math.round(18 * scaleFactor * 20),
                },
              }),
            ],
          }),
        ],
      });

      documentChildren.push(mainTable);

      // Decoration Table (same columns as mainTable, no margin/padding)
      const decorationTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              // LEFT COLUMN - decorationLeft
              new TableCell({
                width: { size: 22, type: WidthType.PERCENTAGE },
                shading: { fill: "000000" },
                children: decorationLeftBase64
                  ? [
                    (() => {
                      const imageData = getImageData(decorationLeftBase64);
                      if (imageData) {
                        const imageRun = createImageRun(imageData, {
                          width: Math.round(270 * scaleFactor),
                          height: Math.round(150 * scaleFactor),
                        });
                        if (imageRun) {
                          return new Paragraph({
                            children: [imageRun],
                            alignment: AlignmentType.LEFT,
                          });
                        }
                      }
                      return new Paragraph({ children: [] });
                    })(),
                  ]
                  : [new Paragraph({ children: [] })],
                verticalAlign: VerticalAlign.BOTTOM,
              }),
              // MIDDLE COLUMN - empty
              new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                shading: { fill: "9E9E9E" },
                children: [new Paragraph({ children: [] })],
              }),
              // RIGHT COLUMN - decorationRight
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: decorationRightBase64
                  ? [
                    (() => {
                      const imageData = getImageData(decorationRightBase64);
                      if (imageData) {
                        const imageRun = createImageRun(imageData, {
                          width: Math.round(250 * scaleFactor),
                          height: Math.round(135 * scaleFactor),
                        });
                        if (imageRun) {
                          return new Paragraph({
                            children: [imageRun],
                            alignment: AlignmentType.RIGHT,
                          });
                        }
                      }
                      return new Paragraph({ children: [] });
                    })(),
                  ]
                  : [new Paragraph({ children: [] })],
                verticalAlign: VerticalAlign.BOTTOM,
              }),
            ],
          }),
        ],
      });
      documentChildren.push(decorationTable);

      // Validate document structure before creating Document
      validateDocumentStructure(documentChildren);

      // ADDITIONAL EXPERIENCE PAGES (with unified table structure for default template)
      if (getExperiencePages && getExperiencePages.length > 0) {
        getExperiencePages.forEach((pageData, pageIndex) => {
          // Page break
          documentChildren.push(new Paragraph({ pageBreakBefore: true }));

          const leftColumnItems = pageData.filter(
            (item) => item.column === "left"
          );
          const rightColumnItems = pageData.filter(
            (item) => item.column === "right"
          );

          console.log(
            `Default Template Page ${pageIndex + 1} - Left column items:`,
            leftColumnItems.length
          );
          console.log(
            `Default Template Page ${pageIndex + 1} - Right column items:`,
            rightColumnItems.length
          );

          // Helper function to render experience items
          const renderExperienceItems = (items) => {
            return items.flatMap((item) => {
              if (item.type === "header") {
                return [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: item.content.title,
                        bold: true,
                        size: Math.round(11 * scaleFactor * 2),
                        color: "1E293B",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(6 * scaleFactor * 20),
                      after: Math.round(3 * scaleFactor * 20),
                    },
                  }),
                  ...(item.content.company
                    ? [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.content.company,
                            italics: true,
                            size: Math.round(11 * scaleFactor * 2),
                            color: "6B7280",
                            font: "Montserrat",
                          }),
                        ],
                        spacing: {
                          after: Math.round(1.5 * scaleFactor * 20),
                        },
                      }),
                    ]
                    : []),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: item.content.period,
                        size: Math.round(11 * scaleFactor * 2),
                        color: "4B5563",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: { after: Math.round(9 * scaleFactor * 20) },
                  }),
                ];
              } else if (item.type === "bullet") {
                return [
                  createBulletParagraph(item.content.text, {
                    size: Math.round(11 * scaleFactor * 2),
                    color: "374151",
                    font: "Montserrat",
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: Math.round(2 * scaleFactor * 20) },
                  }),
                ];
              }
              return [];
            });
          };
          // second page unified table structure
          const unifiedTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              // HEADER ROW (spans all columns)
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 3, // Span across all 3 columns
                    children: [
                      // Header content in a nested table
                      new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                          insideHorizontal: { style: BorderStyle.NONE },
                          insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: [
                          new TableRow({
                            children: [
                              new TableCell({
                                width: { size: 15, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                                children: pappspmLogoBase64
                                  ? (() => {
                                    const imageData =
                                      getImageData(pappspmLogoBase64);
                                    if (imageData) {
                                      const imageRun = createImageRun(
                                        imageData,
                                        {
                                          width: Math.round(
                                            160 * scaleFactor
                                          ),
                                          height: Math.round(
                                            125 * scaleFactor
                                          ),
                                        }
                                      );

                                      return imageRun
                                        ? [
                                          new Paragraph({
                                            children: [imageRun],
                                            alignment: AlignmentType.LEFT,
                                          }),
                                        ]
                                        : [];
                                    }
                                    return [];
                                  })()
                                  : [],
                                shading: { fill: "000000" },
                              }),
                              new TableCell({
                                width: { size: 70, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: resumeData.profile.name,
                                        bold: true,
                                        size: Math.round(28 * scaleFactor * 2),
                                        color: "FFFFFF",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    alignment: AlignmentType.CENTER,
                                    spacing: {
                                      after: Math.round(4 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: resumeData.profile.title,
                                        size: Math.round(
                                          15.5 * scaleFactor * 2
                                        ),
                                        color: "FFFFFF",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    alignment: AlignmentType.CENTER,
                                  }),
                                ],
                                shading: { fill: "000000" },
                              }),
                              new TableCell({
                                width: { size: 15, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                                children: decorationTopRightWordBase64
                                  ? (() => {
                                    const imageData = getImageData(
                                      decorationTopRightWordBase64
                                    );
                                    if (imageData) {
                                      const imageRun = createImageRun(
                                        imageData,
                                        {
                                          width: Math.round(
                                            232 * scaleFactor
                                          ),
                                          height: Math.round(
                                            125 * scaleFactor
                                          ),
                                        }
                                      );

                                      return imageRun
                                        ? [
                                          new Paragraph({
                                            children: [imageRun],
                                            alignment: AlignmentType.RIGHT,
                                          }),
                                        ]
                                        : [];
                                    }
                                    return [];
                                  })()
                                  : [],
                                shading: { fill: "000000" },
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                ],
              }),
              // CONTENT ROW (3 columns: left content, vertical line, right content)
              new TableRow({
                children: [
                  // LEFT COLUMN
                  new TableCell({
                    width: { size: 49.75, type: WidthType.PERCENTAGE }, // Slightly less than 50% to account for line
                    children: [
                      ...renderExperienceItems(leftColumnItems),

                      // Add decoration to left column for default template
                      ...(decorationLeftSecondPageBase64
                        ? (() => {
                          const imageData = getImageData(
                            decorationLeftSecondPageBase64
                          );
                          if (imageData) {
                            const imageRun = createImageRun(imageData, {
                              width: 150,
                              height: Math.round(100 * scaleFactor),
                            });

                            return imageRun
                              ? [
                                new Paragraph({
                                  children: [imageRun],
                                  alignment: AlignmentType.LEFT,
                                  spacing: {
                                    before: Math.round(
                                      20 * scaleFactor * 20
                                    ),
                                  },
                                }),
                              ]
                              : [];
                          }
                          return [];
                        })()
                        : []),

                      // Add empty paragraph if no content to ensure column structure
                      ...(leftColumnItems.length === 0
                        ? [
                          new Paragraph({
                            children: [new TextRun({ text: "" })],
                          }),
                        ]
                        : []),
                    ],
                    margins: {
                      top: Math.round(12 * scaleFactor * 20),
                      bottom: Math.round(12 * scaleFactor * 20),
                      left: Math.round(12 * scaleFactor * 20),
                      right: Math.round(6 * scaleFactor * 20), // Reduced right margin
                    },
                    verticalAlign: VerticalAlign.TOP,
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                  // VERTICAL LINE COLUMN (separate column, not a border)
                  new TableCell({
                    width: { size: 0.2, type: WidthType.PERCENTAGE }, // Very thin column for the line
                    children: [], // No content, just the line
                    shading: { fill: "000000" }, // Black background creates the line
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                  // RIGHT COLUMN
                  new TableCell({
                    width: { size: 49.75, type: WidthType.PERCENTAGE }, // Slightly less than 50% to account for line
                    children: [
                      ...renderExperienceItems(rightColumnItems),

                      // Add empty paragraph if no content to ensure column structure
                      ...(rightColumnItems.length === 0
                        ? [
                          new Paragraph({
                            children: [new TextRun({ text: "" })],
                          }),
                        ]
                        : []),
                    ],
                    margins: {
                      top: Math.round(12 * scaleFactor * 20),
                      bottom: Math.round(12 * scaleFactor * 20),
                      left: Math.round(12 * scaleFactor * 20), // Reduced left margin
                      right: Math.round(12 * scaleFactor * 20),
                    },
                    verticalAlign: VerticalAlign.TOP,
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                ],
              }),
            ],
          });

          documentChildren.push(unifiedTable);
        });
      }

      // Create the document
      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "bullet-numbering",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.BULLET,
                  text: "•",
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: {
                      indent: {
                        left: convertInchesToTwip(0.25),
                        hanging: convertInchesToTwip(0.25),
                      },
                    },
                  },
                },
              ],
            },
            {
              reference: "white-bullet-numbering",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.BULLET,
                  text: "•",
                  alignment: AlignmentType.LEFT,
                  style: {
                    run: {
                      color: "FFFFFF",
                      font: "Montserrat",
                    },
                    paragraph: {
                      indent: {
                        left: convertInchesToTwip(0.25),
                        hanging: convertInchesToTwip(0.25),
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
        styles: {
          default: {
            document: {
              run: {
                font: "Montserrat",
              },
            },
          },
        },
        sections: [
          {
            properties: {
              page: {
                size: {
                  orientation: PageOrientation.LANDSCAPE,
                  width: 16838, // A4 landscape width in twips
                  height: 11906, // A4 landscape height in twips
                },
                margin: {
                  top: 567, // 0.4 inch
                  right: 567,
                  bottom: 567,
                  left: 567,
                },
              },
            },
            children: documentChildren,
          },
        ],
      });

      return doc;
    } catch (error) {
      console.error("Error generating Default resume docx:", error);
      throw error;
    }
  };

  // Download function for SME Gateway template
  const downloadSMEGatewayDocx = async (
    resumeData,
    mainExperience,
    getExperiencePages
  ) => {
    try {
      console.log(
        "🔄 STARTING SME GATEWAY DOCX DOWNLOAD WITH ROBUST IMAGE HANDLING"
      );

      const candidateName = resumeData.profile?.name || "Resume";
      const sanitizedName = candidateName
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .trim();

      // Extract RFQ number and role title from resume data (for tailored resumes)
      const rfqNumber = resumeData?.rfqNumber || '';
      const roleTitle = resumeData?.roleTitle || '';

      // Debug logging to track filename generation
      console.log('🔍 SME Gateway DOCX Filename Generation:', {
        hasRfqNumber: !!rfqNumber,
        rfqNumber: rfqNumber,
        hasRoleTitle: !!roleTitle,
        roleTitle: roleTitle,
        sanitizedName: sanitizedName,
        isTailoredResume: !!(rfqNumber && roleTitle)
      });

      // Sanitize role title for filename
      const sanitizedRoleTitle = roleTitle
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();

      // Create filename based on whether it's a tailored resume or not
      const filename = rfqNumber && roleTitle
        ? `PAPPSPM-${rfqNumber}-${sanitizedRoleTitle}-${sanitizedName}-CV.docx`
        : `${sanitizedName}_SME_Gateway_Resume.docx`;

      console.log("📄 Generating SME Gateway .docx document...");
      console.log("✅ Using getImageData for all images - NO .split() method");

      // Generate the document
      const doc = await generateSMEGatewayDocx(
        resumeData,
        mainExperience,
        getExperiencePages
      );

      // Pack and save
      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename);

      console.log(
        `✅ SME Gateway .docx document generated successfully! Filename: ${filename}`
      );
      console.log("🎉 This document should open WITHOUT Word warnings!");
    } catch (error) {
      console.error("❌ Error generating SME Gateway .docx document:", error);
      throw error;
    }
  };

  // Download function for Default template
  const downloadDefaultDocx = async (
    resumeData,
    mainExperience,
    getExperiencePages
  ) => {
    try {
      console.log(
        "🔄 STARTING DEFAULT DOCX DOWNLOAD WITH ROBUST IMAGE HANDLING"
      );

      const candidateName = resumeData.profile?.name || "Resume";
      const sanitizedName = candidateName
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .trim();

      // Extract RFQ number and role title from resume data (for tailored resumes)
      const rfqNumber = resumeData?.rfqNumber || '';
      const roleTitle = resumeData?.roleTitle || '';

      // Sanitize role title for filename
      const sanitizedRoleTitle = roleTitle
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();

      // Create filename based on whether it's a tailored resume or not
      const filename = rfqNumber && roleTitle
        ? `PAPPSPM-${rfqNumber}-${sanitizedRoleTitle}-${sanitizedName}-CV.docx`
        : `${sanitizedName}_Default_Resume.docx`;

      console.log("📄 Generating Default .docx document...");
      console.log("✅ Using getImageData for all images - NO .split() method");

      // Generate the document
      const doc = await generateDefaultDocx(
        resumeData,
        mainExperience,
        getExperiencePages
      );

      // Pack and save
      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename);

      console.log(
        `✅ Default .docx document generated successfully! Filename: ${filename}`
      );
      console.log("🎉 This document should open WITHOUT Word warnings!");
    } catch (error) {
      console.error("❌ Error generating Default .docx document:", error);
      throw error;
    }
  };
  const generateConsunetDocx = async (
    resumeData,
    mainExperience,
    getExperiencePages
  ) => {
    try {
      console.log("🚀 Starting SME Gateway resume docx generation...");

      // Load images
      const pappspmLogoBase64 = await imageToBase64("/PappspmLogo.jpeg");
      const consunetLogoBase64 = await imageToBase64("/ConsunetLogo.jpeg");
      const decorationLeftBase64 = await imageToBase64(
        "/assets/images/DecorationLeft.jpeg"
      );
      const decorationRightBase64 = await imageToBase64(
        "/assets/images/DecorationRight.jpeg"
      );

      const documentChildren = [];

      // Calculate scaling for landscape A4 (matching your scaleFactor)
      const scaleFactor = 0.74; // 1123 / 1512.8

      // Main table structure for the three-column layout (now with two rows for split backgrounds)
      const mainTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          // First row: Profile Photo (left, no padding), Profile (middle, light gray), Referees/Experience (right)
          new TableRow({
            children: [
              // LEFT COLUMN - Profile Photo + Details (Black background, spans two rows)
              (() => {
                // Build children starting with photo (if present)
                const leftChildren = [];

                if (resumeData.profile.photo) {
                  const imageData = resumeData.profile.photo.includes("data:")
                    ? getImageData(resumeData.profile.photo)
                    : null;

                  if (imageData) {
                    const floatingOptions = {
                      horizontalPosition: {
                        // relative: "column", // Relative to table column
                        // relative: "cell",
                        // align: "left",
                        offset: 0, // 500,000 twips = 34.7 cm
                      },
                      verticalPosition: {
                        relative: "paragraph", // Relative to the current paragraph
                        // align: "top",
                        offset: -170000, // 100,000 twips = ~7 cm
                      },
                      allowOverlap: false,
                      lockAnchor: true,
                      behindText: false,
                      layoutInCell: true,
                      wrap: {
                        type: "square",
                        side: "bothSides",
                      },
                    };

                    const imageRun = createImageRun(
                      imageData,
                      {
                        width: Math.round(311 * scaleFactor),
                        height: Math.round(385 * scaleFactor),
                      },
                      floatingOptions // Pass floating options as third parameter
                    );

                    if (imageRun) {
                      leftChildren.push(
                        new Paragraph({
                          children: [imageRun],
                          spacing: { before: 0, after: 0 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "" })],
                          spacing: {
                            before: 0,
                            after: Math.round(250 * scaleFactor * 20), // Roughly image height
                          },
                        })
                      );
                    }
                  }
                }

                // Add Profile details directly under the image
                leftChildren.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.name,
                        bold: true,
                        size: Math.round(30 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(4 * scaleFactor * 20),
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.title,
                        bold: true,
                        size: Math.round(12 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: { after: Math.round(4 * scaleFactor * 20) },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.location,
                        size: Math.round(11 * scaleFactor * 2),
                        color: "D1D5DB",
                        font: "Montserrat",
                        allCaps: true,
                      }),
                    ],
                    spacing: { after: Math.round(12 * scaleFactor * 20) },
                  }),

                  // SECURITY CLEARANCE
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "SECURITY CLEARANCE",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),
                  createWhiteBulletParagraph(
                    resumeData.profile.clearance &&
                      resumeData.profile.clearance !== "NONE"
                      ? resumeData.profile.clearance
                      : "Able to obtain security clearance.",
                    {
                      size: Math.round(10.5 * scaleFactor * 2),
                      color: "FFFFFF",
                      font: "Montserrat",
                      spacing: { after: Math.round(16 * scaleFactor * 20) },
                    }
                  ),

                  // QUALIFICATIONS
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "QUALIFICATIONS",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),
                  ...resumeData.qualifications.map((qual) =>
                    createWhiteBulletParagraph(qual, {
                      size: Math.round(10.5 * scaleFactor * 2),
                      color: "FFFFFF",
                      font: "Montserrat",
                      spacing: { after: Math.round(4 * scaleFactor * 20) },
                    })
                  ),

                  // AFFILIATIONS
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "AFFILIATIONS",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(12 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),
                  ...(resumeData.affiliations &&
                    resumeData.affiliations.length > 0
                    ? resumeData.affiliations.map((aff) =>
                      createWhiteBulletParagraph(aff, {
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                        spacing: { after: Math.round(4 * scaleFactor * 20) },
                      })
                    )
                    : [
                      createWhiteBulletParagraph("No information given", {
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ])
                );

                // if (decorationLeftBase64) {
                //   const imageData = getImageData(decorationLeftBase64);
                //   if (imageData) {
                //     const floatingOptions = {
                //       horizontalPosition: {
                //         relative: "column",
                //         // align: "left",
                //         offset: 0,
                //       },
                //       verticalPosition: {
                //         relative: "column",
                //         // align: "bottom",
                //         offset: 0,
                //       },
                //       allowOverlap: false,
                //       lockAnchor: true,
                //       behindText: false,
                //       layoutInCell: true,
                //       wrap: {
                //         type: "square",
                //         side: "bothSides",
                //       },
                //     };
                //     const imageRun = createImageRun(
                //       imageData,
                //       {
                //         width: Math.round(270 * scaleFactor),
                //         height: Math.round(150 * scaleFactor),
                //       },
                //       floatingOptions
                //     );
                //     if (imageRun) {
                //       leftChildren.push(
                //         new Paragraph({
                //           children: [imageRun],
                //           alignment: AlignmentType.LEFT,
                //           spacing: { before: Math.round(12 * scaleFactor * 20) },
                //         })
                //       );
                //     }
                //   }
                // }

                return new TableCell({
                  rowSpan: 2,
                  width: { size: 22, type: WidthType.PERCENTAGE },
                  shading: { fill: "000000" },
                  margins: {
                    top: 0,
                    bottom: Math.round(18 * scaleFactor * 20),
                    left: Math.round(18 * scaleFactor * 20),
                    right: Math.round(18 * scaleFactor * 20),
                  },
                  children: leftChildren,
                  verticalAlign: VerticalAlign.TOP,
                });
              })(),
              // MIDDLE COLUMN - Profile Section (Light gray)
              new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "PROFILE",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "1E293B",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: 0,
                      after: Math.round(9 * scaleFactor * 20),
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.description,
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "374151",
                        font: "Montserrat",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                      after: Math.round(9 * scaleFactor * 20),
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: resumeData.profile.description2,
                        size: Math.round(10.5 * scaleFactor * 2),
                        color: "374151",
                        font: "Montserrat",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                  }),
                ],
                shading: { fill: "EDEDED" },
                margins: {
                  top: 0,
                  bottom: 0,
                  left: Math.round(18 * scaleFactor * 20),
                  right: Math.round(18 * scaleFactor * 20),
                },
                verticalAlign: VerticalAlign.TOP,
              }),
              // RIGHT COLUMN - Referees & Experience (White background, rowSpan: 2)
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                rowSpan: 2,
                children: [
                  // Referees and Logos Section
                  new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                      insideHorizontal: { style: BorderStyle.NONE },
                      insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                      new TableRow({
                        children: [
                          // Referees
                          new TableCell({
                            width: { size: 60, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "REFEREES",
                                    bold: true,
                                    size: Math.round(15 * scaleFactor * 2),
                                    color: "1E293B",
                                    font: "Montserrat",
                                  }),
                                ],
                                spacing: {
                                  after: Math.round(9 * scaleFactor * 20),
                                },
                              }),

                              ...(resumeData.referees &&
                                resumeData.referees.length > 0
                                ? resumeData.referees.flatMap((referee) => [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: referee.title,
                                        bold: true,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "1E293B",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(3 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: `N: ${referee.name}`,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(3 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: `E: ${referee.email}`,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(3 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: `M: ${referee.phone}`,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    spacing: {
                                      after: Math.round(
                                        12 * scaleFactor * 20
                                      ),
                                    },
                                  }),
                                ])
                                : [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: "Available upon request",
                                        italics: true,
                                        size: Math.round(
                                          10.5 * scaleFactor * 2
                                        ),
                                        color: "374151",
                                        font: "Montserrat",
                                      }),
                                    ],
                                  }),
                                ]),
                            ],
                            borders: {
                              top: { style: BorderStyle.NONE },
                              bottom: { style: BorderStyle.NONE },
                              left: { style: BorderStyle.NONE },
                              right: { style: BorderStyle.NONE },
                            },
                          }),

                          // Logos (SME + PappsPM) - align horizontally
                          new TableCell({
                            width: { size: 40, type: WidthType.PERCENTAGE },
                            children: (() => {
                              const logoRuns = [];
                              if (consunetLogoBase64) {
                                const smeData = getImageData(consunetLogoBase64);
                                if (smeData) {
                                  const smeRun = createImageRun(smeData, {
                                    width: 80,
                                    height: 60,
                                  });
                                  if (smeRun) logoRuns.push(smeRun);
                                }
                              }
                              if (pappspmLogoBase64) {
                                const pappsData =
                                  getImageData(pappspmLogoBase64);
                                if (pappsData) {
                                  const pappsRun = createImageRun(pappsData, {
                                    width: 70,
                                    height: 60,
                                  });
                                  if (pappsRun) {
                                    logoRuns.push(pappsRun);
                                  }
                                }
                              }
                              return logoRuns.length
                                ? [
                                  new Paragraph({
                                    children: logoRuns,
                                    alignment: AlignmentType.RIGHT,
                                    spacing: {
                                      after: Math.round(
                                        10 * scaleFactor * 20
                                      ),
                                    },
                                  }),
                                ]
                                : [];
                            })(),
                            borders: {
                              top: { style: BorderStyle.NONE },
                              bottom: { style: BorderStyle.NONE },
                              left: { style: BorderStyle.NONE },
                              right: { style: BorderStyle.NONE },
                            },
                          }),
                        ],
                      }),
                    ],
                  }),

                  // Experience Section
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "RELEVANT EXPERIENCE",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "1E293B",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(18 * scaleFactor * 20),
                      after: Math.round(6 * scaleFactor * 20),
                    },
                  }),

                  ...mainExperience.flatMap((exp) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: exp.title,
                          bold: true,
                          size: Math.round(10.5 * scaleFactor * 2),
                          color: "1E293B",
                          font: "Montserrat",
                        }),
                      ],
                      spacing: {
                        before: Math.round(9 * scaleFactor * 20),
                        after: Math.round(3 * scaleFactor * 20),
                      },
                    }),

                    ...(exp.period
                      ? [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: exp.period,
                              size: Math.round(10.5 * scaleFactor * 2),
                              color: "4B5563",
                              font: "Montserrat",
                            }),
                          ],
                          spacing: {
                            after: Math.round(9 * scaleFactor * 20),
                          },
                        }),
                      ]
                      : []),

                    ...(exp.responsibilities
                      ? exp.responsibilities.map((resp) =>
                        createBulletParagraph(resp, {
                          size: Math.round(10.5 * scaleFactor * 2),
                          color: "000000",
                          font: "Montserrat",
                          alignment: AlignmentType.JUSTIFIED,
                          spacing: {
                            after: Math.round(4 * scaleFactor * 20),
                          },
                        })
                      )
                      : []),
                  ]),
                ],
                margins: {
                  top: Math.round(18 * scaleFactor * 20),
                  bottom: Math.round(18 * scaleFactor * 20),
                  left: Math.round(18 * scaleFactor * 20),
                  right: Math.round(18 * scaleFactor * 20),
                },
              }),
            ],
          }),
          // Second row: only Middle Skills cell (left & right columns are spanned)
          new TableRow({
            children: [
              // MIDDLE COLUMN - Skills Section (Dark gray)
              new TableCell({
                width: { size: 33, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "SKILLS",
                        bold: true,
                        size: Math.round(15 * scaleFactor * 2),
                        color: "FFFFFF",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(18 * scaleFactor * 20),
                      after: Math.round(9 * scaleFactor * 20),
                    },
                  }),
                  ...resumeData.skills.map((skill) =>
                    createWhiteBulletParagraph(skill, {
                      size: Math.round(10.5 * scaleFactor * 2),
                      color: "FFFFFF",
                      font: "Montserrat",
                      spacing: {
                        after: Math.round(4 * scaleFactor * 20),
                      },
                    })
                  ),
                ],
                shading: { fill: "9E9E9E" },
                margins: {
                  top: 0,
                  bottom: 0,
                  left: Math.round(18 * scaleFactor * 20),
                  right: Math.round(18 * scaleFactor * 20),
                },
              }),
            ],
          }),
        ],
      });

      documentChildren.push(mainTable);

      // Decoration Table (same columns as mainTable, no margin/padding)
      const decorationTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              // LEFT COLUMN - decorationLeft
              new TableCell({
                width: { size: 22, type: WidthType.PERCENTAGE },
                shading: { fill: "000000" },
                children: decorationLeftBase64
                  ? [
                    (() => {
                      const imageData = getImageData(decorationLeftBase64);
                      if (imageData) {
                        const imageRun = createImageRun(imageData, {
                          width: Math.round(270 * scaleFactor),
                          height: Math.round(150 * scaleFactor),
                        });
                        if (imageRun) {
                          return new Paragraph({
                            children: [imageRun],
                            alignment: AlignmentType.LEFT,
                          });
                        }
                      }
                      return new Paragraph({ children: [] });
                    })(),
                  ]
                  : [new Paragraph({ children: [] })],
                verticalAlign: VerticalAlign.BOTTOM,
              }),
              // MIDDLE COLUMN - empty
              new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                shading: { fill: "9E9E9E" },
                children: [new Paragraph({ children: [] })],
              }),
              // RIGHT COLUMN - decorationRight
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: decorationRightBase64
                  ? [
                    (() => {
                      const imageData = getImageData(decorationRightBase64);
                      if (imageData) {
                        const imageRun = createImageRun(imageData, {
                          width: Math.round(250 * scaleFactor),
                          height: Math.round(135 * scaleFactor),
                        });
                        if (imageRun) {
                          return new Paragraph({
                            children: [imageRun],
                            alignment: AlignmentType.RIGHT,
                          });
                        }
                      }
                      return new Paragraph({ children: [] });
                    })(),
                  ]
                  : [new Paragraph({ children: [] })],
                verticalAlign: VerticalAlign.BOTTOM,
              }),
            ],
          }),
        ],
      });
      documentChildren.push(decorationTable);

      // Validate document structure before creating Document
      validateDocumentStructure(documentChildren);

      // ADDITIONAL EXPERIENCE PAGES (with unified table structure)
      if (getExperiencePages && getExperiencePages.length > 0) {
        getExperiencePages.forEach((pageData, pageIndex) => {
          // Page break
          documentChildren.push(new Paragraph({ pageBreakBefore: true }));

          const leftColumnItems = pageData.filter(
            (item) => item.column === "left"
          );
          const rightColumnItems = pageData.filter(
            (item) => item.column === "right"
          );

          console.log(
            `SME Gateway Page ${pageIndex + 1} - Left column items:`,
            leftColumnItems.length
          );
          console.log(
            `SME Gateway Page ${pageIndex + 1} - Right column items:`,
            rightColumnItems.length
          );

          // Helper function to render experience items
          const renderExperienceItems = (items) => {
            return items.flatMap((item) => {
              if (item.type === "header") {
                return [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: item.content.title,
                        bold: true,
                        size: Math.round(11 * scaleFactor * 2),
                        color: "1E293B",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: {
                      before: Math.round(6 * scaleFactor * 20),
                      after: Math.round(3 * scaleFactor * 20),
                    },
                  }),
                  ...(item.content.company
                    ? [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.content.company,
                            italics: true,
                            size: Math.round(11 * scaleFactor * 2),
                            color: "6B7280",
                            font: "Montserrat",
                          }),
                        ],
                        spacing: {
                          after: Math.round(1.5 * scaleFactor * 20),
                        },
                      }),
                    ]
                    : []),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: item.content.period,
                        size: Math.round(11 * scaleFactor * 2),
                        color: "4B5563",
                        font: "Montserrat",
                      }),
                    ],
                    spacing: { after: Math.round(9 * scaleFactor * 20) },
                  }),
                ];
              } else if (item.type === "bullet") {
                return [
                  createBulletParagraph(item.content.text, {
                    size: Math.round(11 * scaleFactor * 2),
                    color: "374151",
                    font: "Montserrat",
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: Math.round(2 * scaleFactor * 20) },
                  }),
                ];
              }
              return [];
            });
          };

          // second page unified table structure
          const unifiedTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              // HEADER ROW (spans all columns)
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 3, // Span across all 3 columns
                    children: [
                      // Header content in a nested table
                      new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                          insideHorizontal: { style: BorderStyle.NONE },
                          insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: [
                          new TableRow({
                            children: [
                              new TableCell({
                                width: { size: 10, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                                children: pappspmLogoBase64
                                  ? (() => {
                                    const imageData =
                                      getImageData(pappspmLogoBase64);
                                    if (imageData) {
                                      const imageRun = createImageRun(
                                        imageData,
                                        {
                                          width: Math.round(
                                            160 * scaleFactor
                                          ),
                                          height: Math.round(
                                            125 * scaleFactor
                                          ),
                                        }
                                      );

                                      return imageRun
                                        ? [
                                          new Paragraph({
                                            children: [imageRun],
                                            alignment: AlignmentType.LEFT,
                                          }),
                                        ]
                                        : [];
                                    }
                                    return [];
                                  })()
                                  : [],
                                shading: { fill: "000000" },
                              }),
                              new TableCell({
                                width: { size: 80, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: resumeData.profile.name,
                                        bold: true,
                                        size: Math.round(28 * scaleFactor * 2),
                                        color: "FFFFFF",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    alignment: AlignmentType.CENTER,
                                    spacing: {
                                      after: Math.round(4 * scaleFactor * 20),
                                    },
                                  }),
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: resumeData.profile.title,
                                        size: Math.round(
                                          15.5 * scaleFactor * 2
                                        ),
                                        color: "FFFFFF",
                                        font: "Montserrat",
                                      }),
                                    ],
                                    alignment: AlignmentType.CENTER,
                                  }),
                                ],
                                shading: { fill: "000000" },
                              }),
                              new TableCell({
                                width: { size: 10, type: WidthType.PERCENTAGE },
                                verticalAlign: VerticalAlign.CENTER,
                                children: consunetLogoBase64
                                  ? (() => {
                                    const imageData =
                                      getImageData(consunetLogoBase64);
                                    if (imageData) {
                                      const imageRun = createImageRun(
                                        imageData,
                                        {
                                          width: Math.round(
                                            175 * scaleFactor
                                          ),
                                          height: Math.round(
                                            125 * scaleFactor
                                          ),
                                        }
                                      );

                                      return imageRun
                                        ? [
                                          new Paragraph({
                                            children: [imageRun],
                                            alignment: AlignmentType.RIGHT,
                                          }),
                                        ]
                                        : [];
                                    }
                                    return [];
                                  })()
                                  : [],
                                shading: { fill: "FFFFFF" },
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                ],
              }),

              // CONTENT ROW (3 columns: left content, vertical line, right content)
              new TableRow({
                children: [
                  // LEFT COLUMN
                  new TableCell({
                    width: { size: 49.75, type: WidthType.PERCENTAGE }, // Slightly less than 50% to account for line
                    children: [
                      ...renderExperienceItems(leftColumnItems),
                      // Add empty paragraph if no content to ensure column structure
                      ...(leftColumnItems.length === 0
                        ? [
                          new Paragraph({
                            children: [new TextRun({ text: "" })],
                          }),
                        ]
                        : []),
                    ],
                    margins: {
                      top: Math.round(12 * scaleFactor * 20),
                      bottom: Math.round(12 * scaleFactor * 20),
                      left: Math.round(12 * scaleFactor * 20),
                      right: Math.round(6 * scaleFactor * 20), // Reduced right margin
                    },
                    verticalAlign: VerticalAlign.TOP,
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                  // VERTICAL LINE COLUMN (separate column, not a border)
                  new TableCell({
                    width: { size: 0.2, type: WidthType.PERCENTAGE }, // Very thin column for the line
                    children: [], // No content, just the line
                    shading: { fill: "000000" }, // Black background creates the line
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                  // RIGHT COLUMN
                  new TableCell({
                    width: { size: 49.75, type: WidthType.PERCENTAGE }, // Slightly less than 50% to account for line
                    children: [
                      ...renderExperienceItems(rightColumnItems),
                      // Add empty paragraph if no content to ensure column structure
                      ...(rightColumnItems.length === 0
                        ? [
                          new Paragraph({
                            children: [new TextRun({ text: "" })],
                          }),
                        ]
                        : []),
                    ],
                    margins: {
                      top: Math.round(12 * scaleFactor * 20),
                      bottom: Math.round(12 * scaleFactor * 20),
                      left: Math.round(12 * scaleFactor * 20), // Reduced left margin
                      right: Math.round(12 * scaleFactor * 20),
                    },
                    verticalAlign: VerticalAlign.TOP,
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  }),
                ],
              }),
            ],
          });

          documentChildren.push(unifiedTable);
        });
      }

      // Create the document
      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "bullet-numbering",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.BULLET,
                  text: "•",
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: {
                      indent: {
                        left: convertInchesToTwip(0.25),
                        hanging: convertInchesToTwip(0.25),
                      },
                    },
                  },
                },
              ],
            },
            {
              reference: "white-bullet-numbering",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.BULLET,
                  text: "•",
                  alignment: AlignmentType.LEFT,
                  style: {
                    run: {
                      color: "FFFFFF",
                      font: "Montserrat",
                    },
                    paragraph: {
                      indent: {
                        left: convertInchesToTwip(0.25),
                        hanging: convertInchesToTwip(0.25),
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
        styles: {
          default: {
            document: {
              run: {
                font: "Montserrat",
              },
            },
          },
        },
        sections: [
          {
            properties: {
              page: {
                size: {
                  orientation: PageOrientation.LANDSCAPE,
                  width: 16838, // A4 landscape width in twips
                  height: 11906, // A4 landscape height in twips
                },
                margin: {
                  top: 567, // 0.4 inch
                  right: 567,
                  bottom: 567,
                  left: 567,
                },
              },
            },
            children: documentChildren,
          },
        ],
      });

      // Validate document structure
      validateDocumentStructure(documentChildren);

      return doc;
    } catch (error) {
      console.error("Error generating SME Gateway resume docx:", error);
      throw error;
    }
  };



  // Download function for Consunet template
  const downloadConsunetDocx = async (
    resumeData,
    mainExperience,
    getExperiencePages
  ) => {
    try {
      console.log(
        "🔄 STARTING CONSUNET DOCX DOWNLOAD WITH ROBUST IMAGE HANDLING"
      );

      const candidateName = resumeData.profile?.name || "Resume";
      const sanitizedName = candidateName
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .trim();

      // Extract RFQ number and role title from resume data (for tailored resumes)
      const rfqNumber = resumeData?.rfqNumber || '';
      const roleTitle = resumeData?.roleTitle || '';

      // Sanitize role title for filename
      const sanitizedRoleTitle = roleTitle
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();

      // Create filename based on whether it's a tailored resume or not
      const filename = rfqNumber && roleTitle
        ? `PAPPSPM-${rfqNumber}-${sanitizedRoleTitle}-${sanitizedName}-CV.docx`
        : `${sanitizedName}_Consunet_Resume.docx`;

      console.log("📄 Generating Consunet .docx document...");
      console.log("✅ Using getImageData for all images - NO .split() method");

      // Generate the document
      const doc = await generateConsunetDocx(
        resumeData,
        mainExperience,
        getExperiencePages
      );

      // Pack and save
      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename);

      console.log(
        `✅ Consunet .docx document generated successfully! Filename: ${filename}`
      );
      console.log("🎉 This document should open WITHOUT Word warnings!");
    } catch (error) {
      console.error("❌ Error generating Consunet .docx document:", error);
      throw error;
    }
  };

  // Helper function to create bullet paragraph with proper Word numbering
  const createBulletParagraph = (text, options = {}) => {
    const {
      size = 21, // 10.5pt in half-points
      color = "000000",
      font = "Montserrat",
      spacing = {},
      alignment = AlignmentType.LEFT,
      shading = null,
      indent = null,
    } = options;

    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          size: size,
          color: color,
          font: font,
        }),
      ],
      numbering: {
        reference: "bullet-numbering",
        level: 0,
      },
      alignment: alignment,
      spacing: spacing,
      ...(indent && { indent: indent }),
      ...(shading && { shading: shading }),
    });
  };

  const createWhiteBulletParagraph = (text, options = {}) => {
    const {
      size = 21, // 10.5pt in half-points
      color = "FFFFFF",
      font = "Montserrat",
      spacing = {},
      alignment = AlignmentType.LEFT,
      shading = null,
    } = options;

    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          size: size,
          color: color,
          font: font,
        }),
      ],
      numbering: {
        reference: "white-bullet-numbering",
        level: 0,
      },
      alignment: alignment,
      spacing: spacing,
      ...(shading && { shading: shading }),
    });
  };

  return {
    generateSMEGatewayDocx,
    generateDefaultDocx,
    downloadSMEGatewayDocx,
    downloadDefaultDocx,
    generateConsunetDocx,
    downloadConsunetDocx,
  };
};

export default useResumeDocx;
