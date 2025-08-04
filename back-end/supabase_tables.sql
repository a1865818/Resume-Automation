-- Resume Automation Database Tables for Supabase
-- Based on Entity Framework Fluent API Configuration

-- Enable UUID extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create function to automatically update UpdatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update UpdatedAt
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON "Candidates" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON "Applications" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON "Documents" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_versions_updated_at 
    BEFORE UPDATE ON "DocumentVersions" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
-- INSERT INTO "Candidates" ("Name", "Email", "Phone", "DateOfBirth", "CSID_Number") 
-- VALUES 
--     ('John Doe', 'john.doe@example.com', '+1234567890', '1990-01-15', 'CSID123456'),
--     ('Jane Smith', 'jane.smith@example.com', '+0987654321', '1985-05-20', 'CSID789012');

-- Grant permissions (adjust as needed for your Supabase setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres; 