# Quick Startup Guide

## Prerequisites Check

Before starting, ensure you have:
- [ ] .NET 8 SDK installed (`dotnet --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Supabase account and project created
- [ ] Gemini AI API key

## Step-by-Step Setup

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd back-end

# Configure Supabase in appsettings.json
# Replace YOUR_SUPABASE_PROJECT_ID, YOUR_SUPABASE_DB_PASSWORD, etc.

# Install dependencies
dotnet restore

# Run the backend
dotnet run
```

**Expected output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7000
```

### 2. Frontend Setup (3 minutes)

```bash
# Navigate to frontend
cd front-end/my-app

# Install dependencies
npm install

# Create environment file
cp env.example .env.local

# Edit .env.local with your API key
# NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here

# Run the frontend
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000
```

### 3. Test the System

1. Open `http://localhost:3000` in your browser
2. Upload a PDF resume
3. Generate a resume
4. Save the document
5. Test the custom URL: `http://localhost:3000/pdf-upload/[candidate-name]/roles/[role]/resume/[id]`

## Troubleshooting

### Backend Issues
- **Port 7000 in use**: Change port in `Properties/launchSettings.json`
- **Database connection failed**: Check Supabase credentials in `appsettings.json`
- **CORS errors**: Verify frontend URL is in CORS configuration

### Frontend Issues
- **Port 3000 in use**: Next.js will automatically use the next available port
- **API connection failed**: Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- **Gemini API errors**: Verify your API key is correct

### Quick Commands

```bash
# Backend
cd back-end
dotnet run

# Frontend (in new terminal)
cd front-end/my-app
npm run dev

# Check if both are running
curl https://localhost:7000/api/candidates
curl http://localhost:3000
```

## Next Steps

1. **Customize Templates**: Modify document templates in `front-end/my-app/components/`
2. **Add Authentication**: Implement user authentication in the backend
3. **Deploy**: Follow deployment instructions in the main README
4. **Scale**: Consider using Supabase Auth and Row Level Security

## Support

- Backend API docs: `https://localhost:7000/swagger`
- Frontend logs: Browser console
- Backend logs: Terminal where `dotnet run` is executed 