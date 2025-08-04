-- Resume Automation Database Tables for Supabase (Simple Version)
-- Based on Entity Framework Fluent API Configuration

-- Create Candidates table
CREATE TABLE "Candidates" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(200) NOT NULL,
    "Email" VARCHAR(255),
    "Phone" VARCHAR(50),
    "DateOfBirth" TIMESTAMP,
    "CSID_Number" VARCHAR(100),
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on Name for URL-friendly routing
CREATE UNIQUE INDEX "IX_Candidates_Name" ON "Candidates" ("Name");

-- Create Applications table
CREATE TABLE "Applications" (
    "Id" SERIAL PRIMARY KEY,
    "RoleName" VARCHAR(200) NOT NULL,
    "Description" VARCHAR(500),
    "CandidateId" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_Applications_Candidates_CandidateId" 
        FOREIGN KEY ("CandidateId") REFERENCES "Candidates" ("Id") ON DELETE CASCADE
);

-- Create Documents table
CREATE TABLE "Documents" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "DocumentType" INTEGER NOT NULL, -- 0=Resume, 1=TenderResponse, 2=ProposalSummary
    "ApplicationId" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_Documents_Applications_ApplicationId" 
        FOREIGN KEY ("ApplicationId") REFERENCES "Applications" ("Id") ON DELETE CASCADE
);

-- Create DocumentVersions table
CREATE TABLE "DocumentVersions" (
    "Id" SERIAL PRIMARY KEY,
    "Version" INTEGER NOT NULL,
    "Content" TEXT NOT NULL, -- JSON content
    "DocumentId" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_DocumentVersions_Documents_DocumentId" 
        FOREIGN KEY ("DocumentId") REFERENCES "Documents" ("Id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX "IX_Applications_CandidateId" ON "Applications" ("CandidateId");
CREATE INDEX "IX_Documents_ApplicationId" ON "Documents" ("ApplicationId");
CREATE INDEX "IX_DocumentVersions_DocumentId" ON "DocumentVersions" ("DocumentId");

-- Optional: Insert sample data
-- INSERT INTO "Candidates" ("Name", "Email", "Phone", "DateOfBirth", "CSID_Number") 
-- VALUES 
--     ('John Doe', 'john.doe@example.com', '+1234567890', '1990-01-15', 'CSID123456'),
--     ('Jane Smith', 'jane.smith@example.com', '+0987654321', '1985-05-20', 'CSID789012'); 