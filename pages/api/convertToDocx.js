// pages/api/convertToDocxEnhanced.js
import {
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { resumeData, filename } = req.body;

    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    // Create the Word document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720, // 0.5 inch
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: await createResumeContent(resumeData),
        },
      ],
    });

    // Generate the document buffer
    const buffer = await Packer.toBuffer(doc);

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename || "resume.docx"}"`
    );
    res.setHeader("Content-Length", buffer.length);

    // Send the buffer
    res.end(buffer);
  } catch (error) {
    console.error("Error generating DOCX:", error);
    res
      .status(500)
      .json({ message: "Failed to generate DOCX", error: error.message });
  }
}

async function createResumeContent(resumeData) {
  const content = [];

  // Create main table structure matching the original layout
  const mainTable = new Table({
    rows: [
      new TableRow({
        children: [
          // Left column - Profile Section (Black background)
          new TableCell({
            children: await createProfileSection(resumeData),
            width: { size: 350 * 20, type: WidthType.DXA }, // Convert px to DXA
            shading: { fill: "000000" }, // Black background
            margins: { top: 200, right: 200, bottom: 200, left: 200 },
          }),
          // Middle column - Profile Description and Skills
          new TableCell({
            children: await createMiddleSection(resumeData),
            width: { size: 400 * 20, type: WidthType.DXA },
            margins: { top: 200, right: 200, bottom: 200, left: 200 },
          }),
          // Right column - References and Experience
          new TableCell({
            children: await createRightSection(resumeData),
            width: { size: 610 * 20, type: WidthType.DXA },
            margins: { top: 200, right: 200, bottom: 200, left: 200 },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
  });

  content.push(mainTable);
  return content;
}

async function createProfileSection(resumeData) {
  const content = [];

  // Profile photo
  if (
    resumeData.profile.photo &&
    resumeData.profile.photo !== "/api/placeholder/400/600"
  ) {
    try {
      const imageBuffer = await downloadImage(resumeData.profile.photo);
      if (imageBuffer) {
        content.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: 300,
                  height: 400,
                },
              }),
            ],
            alignment: "center",
          })
        );
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  }

  // Name and title
  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.profile.name,
          bold: true,
          size: 48, // 24pt
          color: "FFFFFF",
        }),
      ],
      spacing: { after: 200 },
    })
  );

  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.profile.title,
          bold: true,
          size: 20, // 10pt
          color: "FBBF24", // Yellow color
        }),
      ],
      spacing: { after: 100 },
    })
  );

  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.profile.location,
          size: 18, // 9pt
          color: "D1D5DB", // Light gray
        }),
      ],
      spacing: { after: 300 },
    })
  );

  // Security Clearance
  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "SECURITY CLEARANCE",
          bold: true,
          size: 24, // 12pt
          color: "FBBF24",
        }),
      ],
      spacing: { after: 100 },
    })
  );

  const clearanceText =
    resumeData.profile.clearance && resumeData.profile.clearance !== "NONE"
      ? resumeData.profile.clearance
      : "Able to obtain security clearance.";

  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `• ${clearanceText}`,
          size: 16, // 8pt
          color: "FFFFFF",
        }),
      ],
      spacing: { after: 300 },
    })
  );

  // Qualifications
  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "QUALIFICATIONS",
          bold: true,
          size: 24, // 12pt
          color: "FBBF24",
        }),
      ],
      spacing: { after: 100 },
    })
  );

  resumeData.qualifications.forEach((qual) => {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `• ${qual}`,
            size: 16, // 8pt
            color: "FFFFFF",
          }),
        ],
        spacing: { after: 50 },
      })
    );
  });

  // Affiliations
  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "AFFILIATIONS",
          bold: true,
          size: 24, // 12pt
          color: "FBBF24",
        }),
      ],
      spacing: { after: 100, before: 300 },
    })
  );

  if (resumeData.affiliations && resumeData.affiliations.length > 0) {
    resumeData.affiliations.forEach((affiliation) => {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${affiliation}`,
              size: 16, // 8pt
              color: "FFFFFF",
            }),
          ],
          spacing: { after: 50 },
        })
      );
    });
  } else {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "• No information given",
            size: 16, // 8pt
            color: "FFFFFF",
          }),
        ],
      })
    );
  }

  return content;
}

async function createMiddleSection(resumeData) {
  const content = [];

  // Profile Description Section
  const profileTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "PROFILE",
                    bold: true,
                    size: 24, // 12pt
                    color: "000000",
                  }),
                ],
                spacing: { after: 150 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.profile.description,
                    size: 18, // 9pt
                    color: "374151",
                  }),
                ],
                spacing: { after: 150 },
                alignment: "justified",
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.profile.description2,
                    size: 18, // 9pt
                    color: "374151",
                  }),
                ],
                alignment: "justified",
              }),
            ],
            shading: { fill: "EDEDED" }, // Light gray background
            margins: { top: 300, right: 300, bottom: 300, left: 300 },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "SKILLS",
                    bold: true,
                    size: 24, // 12pt
                    color: "FFFFFF",
                  }),
                ],
                spacing: { after: 150 },
              }),
              ...resumeData.skills.map(
                (skill) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `• ${skill}`,
                        size: 18, // 9pt
                        color: "FFFFFF",
                      }),
                    ],
                    spacing: { after: 100 },
                  })
              ),
            ],
            shading: { fill: "9E9E9E" }, // Gray background
            margins: { top: 150, right: 300, bottom: 0, left: 300 },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
  });

  content.push(profileTable);
  return content;
}

async function createRightSection(resumeData) {
  const content = [];

  // Referees Section
  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "REFEREES",
          bold: true,
          size: 24, // 12pt
          color: "1E293B",
        }),
      ],
      spacing: { after: 150 },
    })
  );

  if (resumeData.referees && resumeData.referees.length > 0) {
    resumeData.referees.forEach((referee) => {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: referee.name,
              bold: true,
              size: 16,
              color: "1E293B",
            }),
          ],
          spacing: { after: 50 },
        })
      );

      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: referee.title,
              size: 14,
              color: "6B7280",
            }),
          ],
          spacing: { after: 25 },
        })
      );

      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Email: ${referee.email}`,
              size: 14,
              color: "374151",
            }),
          ],
          spacing: { after: 25 },
        })
      );

      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Phone: ${referee.phone}`,
              size: 14,
              color: "374151",
            }),
          ],
          spacing: { after: 200 },
        })
      );
    });
  }

  // Experience Section
  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "RELEVANT EXPERIENCE",
          bold: true,
          size: 24, // 12pt
          color: "1E293B",
        }),
      ],
      spacing: { after: 100, before: 300 },
    })
  );

  const mainExperience = resumeData.experience || [];
  mainExperience.forEach((exp, expIndex) => {
    if (!exp.responsibilities || exp.responsibilities.length === 0) return;

    // Job title and period
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: exp.title,
            bold: true,
            size: 18,
            color: "1E293B",
          }),
        ],
        spacing: { after: 50 },
      })
    );

    if (!exp.isSecondPart) {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.period,
              size: 18,
              color: "4B5563",
            }),
          ],
          spacing: { after: 150 },
        })
      );
    }

    // Responsibilities with bullet points
    exp.responsibilities.forEach((resp, respIndex) => {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${resp}`,
              size: 18,
              color: "000000",
            }),
          ],
          spacing: {
            after: respIndex === exp.responsibilities.length - 1 ? 300 : 200,
          },
        })
      );
    });
  });

  return content;
}

async function downloadImage(url) {
  try {
    // Handle different URL types
    let imageUrl = url;

    if (url.startsWith("/")) {
      // Relative URL - you might need to adjust this based on your deployment
      imageUrl = `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }${url}`;
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    return await response.buffer();
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
}
