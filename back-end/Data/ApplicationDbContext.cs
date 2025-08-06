using Microsoft.EntityFrameworkCore;
using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Candidate> Candidates { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<DocumentVersion> DocumentVersions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Candidate entity
            modelBuilder.Entity<Candidate>(entity =>
            {
                entity.ToTable("Candidates");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("Id").HasDefaultValueSql("gen_random_uuid()");
                entity.Property(e => e.Name).HasColumnName("Name").IsRequired().HasMaxLength(200);
                entity.Property(e => e.Email).HasColumnName("Email").HasMaxLength(255);
                entity.Property(e => e.Phone).HasColumnName("Phone").HasMaxLength(50);
                entity.Property(e => e.DateOfBirth)
        .HasColumnName("DateOfBirth")
        .HasColumnType("date");
                entity.Property(e => e.CSID_Number).HasColumnName("CSID_Number").HasMaxLength(100);
                entity.Property(e => e.CreatedAt).HasColumnName("CreatedAt").HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasColumnName("UpdatedAt").HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Unique constraint on Name
                entity.HasIndex(e => e.Name).IsUnique();
            });

            // Configure Application entity
            modelBuilder.Entity<Application>(entity =>
            {
                entity.ToTable("Applications");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("Id").HasDefaultValueSql("gen_random_uuid()");
                entity.Property(e => e.RoleName).HasColumnName("RoleName").IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasColumnName("Description").HasMaxLength(500);
                entity.Property(e => e.CandidateId).HasColumnName("CandidateId");
                entity.Property(e => e.GenerationMode).HasColumnName("GenerationMode").IsRequired().HasConversion<string>();
                entity.Property(e => e.TemplateType).HasColumnName("TemplateType").IsRequired().HasConversion<string>();
                entity.Property(e => e.JobDescription).HasColumnName("JobDescription");
                entity.Property(e => e.CreatedAt).HasColumnName("CreatedAt").HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasColumnName("UpdatedAt").HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Relationship with Candidate
                entity.HasOne(e => e.Candidate)
                      .WithMany(c => c.Applications)
                      .HasForeignKey(e => e.CandidateId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Document entity
            modelBuilder.Entity<Document>(entity =>
            {
                entity.ToTable("Documents");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("Id").HasDefaultValueSql("gen_random_uuid()");
                entity.Property(e => e.Title).HasColumnName("Title").IsRequired().HasMaxLength(200);
                entity.Property(e => e.DocumentType).HasColumnName("DocumentType").IsRequired().HasConversion<string>();
                entity.Property(e => e.ApplicationId).HasColumnName("ApplicationId");
                entity.Property(e => e.CreatedAt).HasColumnName("CreatedAt").HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasColumnName("UpdatedAt").HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Relationship with Application
                entity.HasOne(e => e.Application)
                      .WithMany(a => a.Documents)
                      .HasForeignKey(e => e.ApplicationId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure DocumentVersion entity
            modelBuilder.Entity<DocumentVersion>(entity =>
            {
                entity.ToTable("DocumentVersions");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("Id").HasDefaultValueSql("gen_random_uuid()");
                entity.Property(e => e.Version).HasColumnName("Version").IsRequired();
                entity.Property(e => e.Content).HasColumnName("Content").IsRequired();
                entity.Property(e => e.DocumentId).HasColumnName("DocumentId");
                entity.Property(e => e.CreatedAt).HasColumnName("CreatedAt").HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasColumnName("UpdatedAt").HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Relationship with Document
                entity.HasOne(e => e.Document)
                      .WithMany(d => d.Versions)
                      .HasForeignKey(e => e.DocumentId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
} 