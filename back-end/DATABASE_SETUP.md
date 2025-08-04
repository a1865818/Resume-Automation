# Supabase Integration Guide

## Overview

This guide covers the integration of Supabase with your .NET backend for database operations.

## 1. Database Connection (PostgreSQL)

### ✅ Configured:
- `Npgsql.EntityFrameworkCore.PostgreSQL` package installed
- Entity Framework Core configured with PostgreSQL
- Connection string format: `Host=db.zfsttzvpyncveivfovwy.supabase.co;Database=postgres;Username=postgres;Password=SecureP@ssw0rd123;Port=5432;SSL Mode=Require;Trust Server Certificate=true`

### 🔧 Configuration:
Your `appsettings.json` is already configured with:
- Supabase project URL: `https://zfsttzvpyncveivfovwy.supabase.co`
- Publishable key: `sb_publishable_13M-5Scl14BW1WlQwd-Oqw_7cN8StSV`
- Service role key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Database password: `SecureP@ssw0rd123`

## 2. Supabase C# Client Library

### ✅ Added:
- `Supabase.Client` package installed (v0.13.7)
- Supabase client service registered in DI container
- Basic `SupabaseService` implementation (ready for future use)

### 🔧 How to Use:
```csharp
// Inject in your controllers/services
public class YourController : ControllerBase
{
    private readonly Supabase.Client _supabaseClient;
    
    public YourController(Supabase.Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
    }
}
```

## 3. Configuration

### Current Configuration:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.zfsttzvpyncveivfovwy.supabase.co;Database=postgres;Username=postgres;Password=SecureP@ssw0rd123;Port=5432;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Supabase": {
    "Url": "https://zfsttzvpyncveivfovwy.supabase.co",
    "Key": "sb_publishable_13M-5Scl14BW1WlQwd-Oqw_7cN8StSV",
    "ServiceKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmc3R0enZweW5jdmVpdmZvdnd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDI2MzAzMSwiZXhwIjoyMDY5ODM5MDMxfQ.0jjdVprExmXSjurQz7XcI6UcGtfVyj0zgIfKJc2BEFI"
  }
}
```

## 4. Database Migration

Run the database migrations to create the tables:

```bash
cd back-end
dotnet ef database update
```

## 5. Testing the Integration

### Test Database Connection:
```bash
dotnet run
```

The application should start without database connection errors.

### Test API Endpoints:
1. Start the backend
2. Access Swagger UI at `https://localhost:7000/swagger`
3. Test the candidate, application, and document endpoints

## 6. Available Services

### Core Services:
- `IDocumentService` / `DocumentService`: Document management
- `ICandidateService` / `CandidateService`: Candidate management  
- `IApplicationService` / `ApplicationService`: Application/role management
- `ISupabaseService` / `SupabaseService`: Supabase client (ready for future use)

### Repositories:
- `IDocumentRepository` / `DocumentRepository`
- `ICandidateRepository` / `CandidateRepository`
- `IApplicationRepository` / `ApplicationRepository`

## 7. API Endpoints

### Candidates:
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/{id}` - Get candidate by ID
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/{id}` - Update candidate
- `DELETE /api/candidates/{id}` - Delete candidate

### Applications:
- `GET /api/applications` - Get all applications
- `GET /api/applications/{id}` - Get application by ID
- `GET /api/applications/candidate/{candidateId}` - Get applications for a candidate
- `POST /api/applications` - Create new application
- `PUT /api/applications/{id}` - Update application
- `DELETE /api/applications/{id}` - Delete application

### Documents:
- `GET /api/documents` - Get all documents
- `GET /api/documents/{id}` - Get document by ID
- `GET /api/documents/application/{applicationId}` - Get documents for an application
- `GET /api/documents/candidate/{candidateName}/roles/{roleName}/{documentType}/{documentId}` - Custom routing
- `POST /api/documents` - Create new document
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document

## 8. Security Notes

- **Database Password**: Currently stored in appsettings.json (use environment variables in production)
- **CORS**: Configured for localhost:3000 (frontend)
- **SSL**: Required for Supabase connections

## 9. Troubleshooting

### Common Issues:
1. **Connection Errors**: Verify database password and project ID
2. **CORS Issues**: Check allowed origins in configuration
3. **Package Errors**: Run `dotnet restore` after adding packages

### Next Steps:
1. Run database migrations
2. Test the API endpoints
3. Integrate with your frontend application
4. Add authentication later when needed 