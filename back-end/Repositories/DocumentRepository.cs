using Microsoft.EntityFrameworkCore;
using ResumeAutomation.API.Data;
using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Repositories;

public class DocumentRepository : IDocumentRepository
{
    private readonly ApplicationDbContext _context;

    public DocumentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Document>> GetAllAsync()
    {
        return await _context.Documents
            .Include(d => d.Application)
                .ThenInclude(a => a.Candidate)
            .Include(d => d.Versions)
            .ToListAsync();
    }

    public async Task<Document?> GetByIdAsync(Guid id)
    {
        return await _context.Documents
            .Include(d => d.Application)
                .ThenInclude(a => a.Candidate)
            .Include(d => d.Versions)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<IEnumerable<Document>> GetByApplicationIdAsync(Guid applicationId)
    {
        return await _context.Documents
            .Include(d => d.Versions)
            .Where(d => d.ApplicationId == applicationId)
            .ToListAsync();
    }

    public async Task<Document?> GetByApplicationAndTypeAsync(Guid applicationId, DocumentType documentType)
    {
        return await _context.Documents
            .Include(d => d.Versions)
            .FirstOrDefaultAsync(d => d.ApplicationId == applicationId && d.DocumentType == documentType);
    }

    public async Task<Document> CreateAsync(Document document)
    {
        _context.Documents.Add(document);
        await _context.SaveChangesAsync();
        return document;
    }

    public async Task<Document> UpdateAsync(Document document)
    {
        document.UpdatedAt = DateTime.UtcNow;
        
        // Ensure CreatedAt is UTC if it has Unspecified Kind
        if (document.CreatedAt.Kind == DateTimeKind.Unspecified)
        {
            document.CreatedAt = DateTime.SpecifyKind(document.CreatedAt, DateTimeKind.Utc);
        }
        
        _context.Documents.Update(document);
        await _context.SaveChangesAsync();
        return document;
    }

    public async Task DeleteAsync(Guid id)
    {
        var document = await _context.Documents.FindAsync(id);
        if (document != null)
        {
            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Documents.AnyAsync(d => d.Id == id);
    }

    public async Task<DocumentVersion> AddVersionAsync(Guid documentId, string content)
    {
        var document = await _context.Documents
            .Include(d => d.Versions)
            .FirstOrDefaultAsync(d => d.Id == documentId);

        if (document == null)
            throw new ArgumentException("Document not found", nameof(documentId));

        var nextVersion = document.Versions.Any() 
            ? document.Versions.Max(v => v.Version) + 1 
            : 1;

        var version = new DocumentVersion
        {
            DocumentId = documentId,
            Version = nextVersion,
            Content = content
        };

        _context.DocumentVersions.Add(version);
        await _context.SaveChangesAsync();
        return version;
    }

    public async Task<DocumentVersion?> GetLatestVersionAsync(Guid documentId)
    {
        return await _context.DocumentVersions
            .Where(v => v.DocumentId == documentId)
            .OrderByDescending(v => v.Version)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<DocumentVersion>> GetVersionsAsync(Guid documentId)
    {
        return await _context.DocumentVersions
            .Where(v => v.DocumentId == documentId)
            .OrderByDescending(v => v.Version)
            .ToListAsync();
    }
} 