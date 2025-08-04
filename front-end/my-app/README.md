# Resume Automation Frontend

A Next.js frontend application for managing resume automation with candidate information, applications, and document generation.

## Features

- **Candidate Management**: Create and manage candidates with detailed information
- **Application Management**: Create applications for specific roles
- **Document Generation**: Generate resumes, tender responses, and proposal summaries
- **Document Storage**: Save and retrieve documents with custom URL routing
- **PDF Upload**: Upload and process PDF documents with OCR
- **Modern UI**: Built with Ant Design components

## New Candidate Fields

The candidate management now includes additional fields:
- **Date of Birth**: Optional date field for candidate birth date
- **CSID Number**: Optional field for candidate identification number

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install dayjs for date handling:
```bash
npm install dayjs
```

3. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_API_BASE_URL=https://localhost:7000/api
```

4. Run the development server:
```bash
npm run dev
```

## Usage

### Candidate Management

1. Navigate to `/candidates` to view all candidates
2. Click "Add Candidate" to create a new candidate
3. Fill in the candidate information including:
   - Name (required)
   - Email
   - Phone
   - Date of Birth (optional)
   - CSID Number (optional)
4. Search candidates by name, email, or CSID number

### Document Generation

1. Navigate to `/pdf-upload` to upload and process documents
2. Generate resumes, tender responses, and proposal summaries
3. Save documents with role-based organization
4. Access documents via custom URLs

## API Integration

The frontend integrates with the .NET backend API for:
- Candidate CRUD operations
- Application management
- Document storage and retrieval
- Custom URL routing for documents

## Technologies Used

- **Next.js 15**: React framework
- **React 19**: UI library
- **Ant Design**: UI component library
- **dayjs**: Date handling library
- **Tesseract.js**: OCR processing
- **PDF.js**: PDF processing

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL (default: https://localhost:7000/api)
