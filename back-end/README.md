# Resume Automation API

A .NET 8 Web API for managing resume automation with Supabase integration.

## Features

- **Candidate Management**: Create, read, update, and delete candidates
- **Application Management**: Create and manage applications for specific roles
- **Document Management**: Store and version different types of documents
- **Document Types**: Resume, Tender Response, and Proposal Summary
- **Version Control**: Track multiple versions of each document
- **Role-based Organization**: Documents are organized by applications/roles
- **RESTful API**: Clean, RESTful endpoints for all operations
- **Supabase Integration**: PostgreSQL database hosted on Supabase
- **Fluent API Configuration**: Entity Framework configuration using Fluent API
- **Base Model Inheritance**: All entities inherit from BaseModel for consistency

## Technology Stack

- **.NET 8**: Latest version of .NET
- **Entity Framework Core**: ORM with Fluent API configuration
- **PostgreSQL**: Database via Supabase
- **AutoMapper**: Object-to-object mapping
- **Swagger**: API documentation
- **CORS**: Cross-origin resource sharing

## API Endpoints

### Candidates

- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/{id}` - Get candidate by ID
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/{id}` - Update candidate
- `DELETE /api/candidates/{id}` - Delete candidate

### Applications

- `GET /api/applications` - Get all applications
- `GET /api/applications/{id}` - Get application by ID
- `GET /api/applications/candidate/{candidateId}` - Get all applications for a candidate
- `GET /api/applications/candidate/{candidateId}/role/{roleName}` - Get application by candidate and role
- `POST /api/applications` - Create new application
- `PUT /api/applications/{id}` - Update application
- `DELETE /api/applications/{id}` - Delete application

### Documents

- `GET /api/documents` - Get all documents
- `GET /api/documents/{id}` - Get document by ID
- `GET /api/documents/application/{applicationId}` - Get all documents for an application
- `GET /api/documents/candidate/{candidateName}/roles/{roleName}/{documentType}/{documentId}` - Get specific document with custom routing
- `POST /api/documents` - Create new document
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document

## Database Schema

### BaseModel (Abstract)
- `Id` (Primary Key)
- `CreatedAt`
- `UpdatedAt`

### Candidates Table
- `Id` (Primary Key)
- `Name` (Required, Unique, Max 200 chars)
- `Email` (Max 255 chars)
- `Phone` (Max 50 chars)
- `DateOfBirth` (Optional, DateTime)
- `CSID_Number` (Optional, Max 100 chars)
- `CreatedAt`
- `UpdatedAt`

### Applications Table
- `Id` (Primary Key)
- `RoleName` (Required, Max 200 chars)
- `Description` (Max 500 chars)
- `CandidateId` (Foreign Key)
- `CreatedAt`
- `UpdatedAt`

### Documents Table
- `Id` (Primary Key)
- `Title` (Required, Max 200 chars)
- `DocumentType` (Resume, TenderResponse, ProposalSummary)
- `ApplicationId` (Foreign Key)
- `CreatedAt`
- `UpdatedAt`

### DocumentVersions Table
- `Id` (Primary Key)
- `Version` (Required)
- `Content` (Required, JSON content)
- `DocumentId` (Foreign Key)
- `CreatedAt`
- `UpdatedAt`

## Entity Framework Configuration

All entities are configured using Fluent API in the `ApplicationDbContext`:

- **Table Names**: Explicitly specified using `ToTable()`
- **Primary Keys**: Configured using `HasKey()`
- **Column Names**: Explicitly specified using `HasColumnName()`
- **Constraints**: Required fields, max lengths, and unique constraints
- **Relationships**: Foreign keys and cascade delete behavior
- **Default Values**: Timestamps with database defaults

## Getting Started

### Prerequisites

- .NET 8 SDK
- PostgreSQL database (via Supabase)

### Installation

1. Clone the repository
2. Navigate to the backend directory: `cd back-end`
3. Install dependencies: `dotnet restore`
4. Update the connection string in `appsettings.json`
5. Run migrations: `dotnet ef database update`
6. Start the application: `dotnet run`

### Configuration

Update `appsettings.json` with your Supabase credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=your-supabase-host;Database=postgres;Username=postgres;Password=your-password;Port=5432;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Supabase": {
    "Url": "https://your-project-id.supabase.co",
    "Key": "your-publishable-key",
    "ServiceKey": "your-service-role-key"
  }
}
```

## Frontend Integration

### Creating a Candidate and Application

```javascript
// Create a candidate
const candidate = await fetch('/api/candidates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    dateOfBirth: '1990-01-15',
    csidNumber: 'CSID123456'
  })
});

// Create an application for a role
const application = await fetch('/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    roleName: 'Senior Software Engineer',
    description: 'Application for senior developer position',
    candidateId: 1
  })
});

// Create a resume document for an application
const resume = await fetch('/api/documents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'John Doe Resume',
    documentType: 'Resume',
    content: JSON.stringify(resumeData),
    applicationId: 1
  })
});

// Get document with custom routing
const document = await fetch('/api/documents/candidate/john-doe/roles/senior-software-engineer/resume/1');
```

## Development

### Running Migrations

```bash
# Create a new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove
```

### Testing

The API includes Swagger documentation available at `/swagger` when running in development mode.

## Architecture

- **Models**: Entity classes inheriting from BaseModel
- **DTOs**: Data Transfer Objects for API requests/responses
- **Repositories**: Data access layer with Entity Framework
- **Services**: Business logic layer
- **Controllers**: API endpoints
- **Mapping**: AutoMapper profiles for object mapping

## Contributing

1. Follow the existing code structure
2. Use Fluent API for Entity Framework configuration
3. Inherit from BaseModel for new entities
4. Add appropriate DTOs and mappings
5. Include proper error handling
6. Update documentation as needed 