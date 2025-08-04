# Resume Automation System

A comprehensive system for generating, managing, and storing professional resumes, tender responses, and proposal summaries with AI-powered content generation and persistent storage.

## Features

### Frontend (Next.js)
- **PDF Upload & OCR**: Extract text from PDF resumes with advanced OCR capabilities
- **AI-Powered Generation**: Generate resumes, tender responses, and proposal summaries using Gemini AI
- **Document Templates**: Professional templates for different document types
- **Real-time Preview**: Live preview of generated documents
- **Word/PDF Export**: Download documents in multiple formats
- **Profile Picture Support**: Upload and integrate profile pictures
- **Job Description Integration**: Tailor resumes based on job descriptions

### Backend (.NET Web API)
- **RESTful API**: Clean, RESTful endpoints for all operations
- **Supabase Integration**: PostgreSQL database hosted on Supabase
- **Document Versioning**: Track multiple versions of each document
- **Candidate Management**: Store and manage candidate information
- **Custom URL Routing**: Support for SEO-friendly document URLs
- **CORS Support**: Configured for frontend integration

## Project Structure

```
Resume_Automation/
├── front-end/
│   └── my-app/                 # Next.js frontend application
│       ├── pages/              # Next.js pages and API routes
│       ├── components/         # React components
│       ├── utils/              # Utility functions and API service
│       └── public/             # Static assets
└── back-end/                   # .NET Web API backend
    ├── Controllers/            # API controllers
    ├── Models/                 # Entity models
    ├── DTOs/                   # Data transfer objects
    ├── Services/               # Business logic services
    ├── Repositories/           # Data access layer
    └── Data/                   # Database context
```

## Prerequisites

- Node.js 18+ and npm
- .NET 8 SDK
- Supabase account and project
- Gemini AI API key

## Quick Start

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd back-end
   ```

2. **Configure Supabase:**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Update `appsettings.json` with your Supabase credentials:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=db.YOUR_SUPABASE_PROJECT_ID.supabase.co;Database=postgres;Username=postgres;Password=YOUR_SUPABASE_DB_PASSWORD;Port=5432;SSL Mode=Require;Trust Server Certificate=true"
     },
     "Supabase": {
       "Url": "https://YOUR_SUPABASE_PROJECT_ID.supabase.co",
       "Key": "YOUR_SUPABASE_ANON_KEY",
       "ServiceKey": "YOUR_SUPABASE_SERVICE_ROLE_KEY"
     }
   }
   ```

3. **Install dependencies and run:**
   ```bash
   dotnet restore
   dotnet run
   ```

   The API will be available at `https://localhost:7000`

### 2. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd front-end/my-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Copy `env.example` to `.env.local`
   - Update the API base URL if needed:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://localhost:7000/api
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## API Endpoints

### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/{id}` - Get candidate by ID
- `GET /api/candidates/name/{name}` - Get candidate by name
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/{id}` - Update candidate
- `DELETE /api/candidates/{id}` - Delete candidate

### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/{id}` - Get document by ID
- `GET /api/documents/candidate/{candidateId}` - Get all documents for a candidate
- `GET /api/documents/candidate/{candidateName}/roles/{roleName}/{documentType}/{documentId}` - Get specific document with custom routing
- `POST /api/documents` - Create new document
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document
- `POST /api/documents/{id}/versions` - Add new version to document
- `GET /api/documents/{id}/versions` - Get all versions of a document

## Custom URL Routing

The system supports custom URL structures for document access:

```
localhost:3000/pdf-upload/{candidate-name}/roles/{role-name}/{document-type}/{document-id}
```

### Example URLs:
- `localhost:3000/pdf-upload/john-doe/roles/software-engineer/resume/1`
- `localhost:3000/pdf-upload/jane-smith/roles/project-manager/tenderresponse/2`
- `localhost:3000/pdf-upload/bob-wilson/roles/consultant/proposalsummary/3`

## Database Schema

### Candidates Table
- `Id` (Primary Key)
- `Name` (Unique)
- `Email`
- `Phone`
- `CreatedAt`
- `UpdatedAt`

### Documents Table
- `Id` (Primary Key)
- `Title`
- `DocumentType` (Resume, TenderResponse, ProposalSummary)
- `CandidateId` (Foreign Key)
- `CreatedAt`
- `UpdatedAt`

### DocumentVersions Table
- `Id` (Primary Key)
- `Version`
- `Content` (JSON)
- `DocumentId` (Foreign Key)
- `CreatedAt`

## Usage Workflow

1. **Upload PDF Resume**: Upload a PDF resume to extract text using OCR
2. **Generate Resume**: Use AI to generate a professional resume
3. **Upload Job Description** (Optional): Upload a job description for tailored resume generation
4. **Generate Tender Response**: Create criteria statements for government tenders
5. **Generate Proposal Summary**: Create narrative proposal summaries
6. **Save Documents**: Save all documents to the database with version control
7. **Access Saved Documents**: Use custom URLs to access saved documents later

## Development

### Backend Development
- The backend uses Entity Framework with `EnsureCreated()` for automatic database schema creation
- Swagger documentation is available at `https://localhost:7000/swagger`
- CORS is configured to allow frontend requests

### Frontend Development
- Next.js with React 19
- Tailwind CSS for styling
- Custom API service for backend communication
- Dynamic routing for document access

### Adding New Features
1. Create models in the backend `Models` folder
2. Add DTOs in the `DTOs` folder
3. Create repository and service layers
4. Add API controllers
5. Update frontend components and API service
6. Test with Swagger and frontend

## Deployment

### Backend Deployment
The .NET backend can be deployed to:
- Azure App Service
- AWS Elastic Beanstalk
- Heroku
- Docker containers

### Frontend Deployment
The Next.js frontend can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Docker containers

### Environment Configuration
Remember to update:
- Database connection strings
- CORS settings
- API base URLs
- Environment variables

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS configuration includes your frontend URL
2. **Database Connection**: Verify Supabase credentials and connection string
3. **API Key Issues**: Check that your Gemini API key is properly configured
4. **Port Conflicts**: Ensure ports 3000 (frontend) and 7000 (backend) are available

### Logs
- Backend logs are available in the console when running `dotnet run`
- Frontend logs are available in the browser console and terminal

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 