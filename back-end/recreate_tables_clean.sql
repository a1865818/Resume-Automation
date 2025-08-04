-- Clean Recreate Script: Drop All Tables and Recreate with UUID Primary Keys
-- This script will completely remove all existing tables and recreate them with the correct UUID structure

-- Step 1: Drop all existing tables (in correct order due to foreign key dependencies)
DROP TABLE IF EXISTS "DocumentVersions" CASCADE;
DROP TABLE IF EXISTS "Documents" CASCADE;
DROP TABLE IF EXISTS "Applications" CASCADE;
DROP TABLE IF EXISTS "Candidates" CASCADE;

-- Step 2: Drop the trigger function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Step 3: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 4: Create the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 5: Create Candidates table with UUID primary key
CREATE TABLE "Candidates" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" VARCHAR(200) NOT NULL,
    "Email" VARCHAR(255),
    "Phone" VARCHAR(50),
    "DateOfBirth" TIMESTAMP,
    "CSID_Number" VARCHAR(100),
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 6: Create unique index on Name for URL-friendly routing
CREATE UNIQUE INDEX "IX_Candidates_Name" ON "Candidates" ("Name");

-- Step 7: Create Applications table with UUID primary key
CREATE TABLE "Applications" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "RoleName" VARCHAR(200) NOT NULL,
    "Description" VARCHAR(500),
    "CandidateId" UUID NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_Applications_Candidates_CandidateId" 
        FOREIGN KEY ("CandidateId") REFERENCES "Candidates" ("Id") ON DELETE CASCADE
);

-- Step 8: Create Documents table with UUID primary key
CREATE TABLE "Documents" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Title" VARCHAR(200) NOT NULL,
    "DocumentType" INTEGER NOT NULL, -- 0=Resume, 1=TenderResponse, 2=ProposalSummary
    "ApplicationId" UUID NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_Documents_Applications_ApplicationId" 
        FOREIGN KEY ("ApplicationId") REFERENCES "Applications" ("Id") ON DELETE CASCADE
);

-- Step 9: Create DocumentVersions table with UUID primary key
CREATE TABLE "DocumentVersions" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Version" INTEGER NOT NULL,
    "Content" TEXT NOT NULL, -- JSON content
    "DocumentId" UUID NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_DocumentVersions_Documents_DocumentId" 
        FOREIGN KEY ("DocumentId") REFERENCES "Documents" ("Id") ON DELETE CASCADE
);

-- Step 10: Create indexes for better performance
CREATE INDEX "IX_Applications_CandidateId" ON "Applications" ("CandidateId");
CREATE INDEX "IX_Documents_ApplicationId" ON "Documents" ("ApplicationId");
CREATE INDEX "IX_DocumentVersions_DocumentId" ON "DocumentVersions" ("DocumentId");

-- Step 11: Create triggers to automatically update UpdatedAt
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

-- Step 12: Verification queries
SELECT 'Tables created successfully!' as status;

-- Check table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('Candidates', 'Applications', 'Documents', 'DocumentVersions')
ORDER BY table_name, ordinal_position;

-- Check constraints
SELECT 
    table_name,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name IN ('Candidates', 'Applications', 'Documents', 'DocumentVersions')
ORDER BY table_name, constraint_type;

-- Check row counts (should be 0 for all tables)
SELECT 'Candidates' as table_name, COUNT(*) as row_count FROM "Candidates"
UNION ALL
SELECT 'Applications', COUNT(*) FROM "Applications"
UNION ALL
SELECT 'Documents', COUNT(*) FROM "Documents"
UNION ALL
SELECT 'DocumentVersions', COUNT(*) FROM "DocumentVersions";

-- Optional: Insert sample data for testing
-- INSERT INTO "Candidates" ("Name", "Email", "Phone", "DateOfBirth", "CSID_Number") 
-- VALUES 
--     ('John Doe', 'john.doe@example.com', '+1234567890', '1990-01-15', 'CSID123456'),
--     ('Jane Smith', 'jane.smith@example.com', '+0987654321', '1985-05-20', 'CSID789012'); 