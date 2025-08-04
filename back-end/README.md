# Resume Automation API

A .NET 8 Web API for managing resume automation with Supabase database integration.

## 🔐 Environment Setup

This project uses environment variables to securely manage Supabase credentials.

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Database Configuration
SUPABASE_DB_HOST=your-supabase-db-host.supabase.co
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=your-supabase-db-password
SUPABASE_DB_PORT=5432

# Supabase API Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Application Configuration
ASPNETCORE_ENVIRONMENT=Development
```

### Getting Your Supabase Credentials

1. **Database Host**: Found in Supabase Dashboard → Settings → Database → Connection string
2. **Database Password**: Set when you created your Supabase project
3. **Project URL**: Found in Supabase Dashboard → Settings → API → Project URL
4. **Anon Key**: Found in Supabase Dashboard → Settings → API → Project API keys → anon public
5. **Service Key**: Found in Supabase Dashboard → Settings → API → Project API keys → service_role secret

## 🚀 Running the Application

1. **Install dependencies**:
   ```bash
   dotnet restore
   ```

2. **Build the application**:
   ```bash
   dotnet build
   ```

3. **Run the application**:
   ```bash
   dotnet run
   ```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

## 🔒 Security Notes

- The `.env` file is in `.gitignore` and will NOT be committed to Git
- Never share your service key with anyone
- Use different credentials for development and production
- Rotate your keys regularly for security

## 📚 API Endpoints

- **Candidates**: `/api/candidates`
- **Applications**: `/api/applications`
- **Documents**: `/api/documents`

## 🛠️ Technologies Used

- .NET 8
- Entity Framework Core
- PostgreSQL (via Supabase)
- AutoMapper
- Swagger/OpenAPI 