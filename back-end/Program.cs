using Microsoft.EntityFrameworkCore;
using ResumeAutomation.API.Data;
using ResumeAutomation.API.Services;
using ResumeAutomation.API.Repositories;
using Supabase;
using DotNetEnv;

// Load environment variables from .env file
Env.Load(".env");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new string[0])
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// Build connection string from environment variables
var connectionString = $"Host={Environment.GetEnvironmentVariable("SUPABASE_DB_HOST")};" +
                      $"Database={Environment.GetEnvironmentVariable("SUPABASE_DB_NAME")};" +
                      $"Username={Environment.GetEnvironmentVariable("SUPABASE_DB_USERNAME")};" +
                      $"Password={Environment.GetEnvironmentVariable("SUPABASE_DB_PASSWORD")};" +
                      $"Port={Environment.GetEnvironmentVariable("SUPABASE_DB_PORT")};" +
                      $"SSL Mode=Require;Trust Server Certificate=true;";

// Configure Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure Supabase Client (for database operations)
builder.Services.AddScoped<Supabase.Client>(provider =>
{
    var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL");
    var supabaseKey = Environment.GetEnvironmentVariable("SUPABASE_ANON_KEY");
    return new Supabase.Client(supabaseUrl, supabaseKey);
});

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Register services
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<ICandidateService, CandidateService>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddScoped<ISupabaseService, SupabaseService>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<ICandidateRepository, CandidateRepository>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
}

app.Run(); 