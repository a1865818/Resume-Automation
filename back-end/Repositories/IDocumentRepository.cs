using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Repositories;

public interface IDocumentRepository
{
    Task<IEnumerable<Document>> GetAllAsync();
    Task<Document?> GetByIdAsync(Guid id);
    Task<IEnumerable<Document>> GetByApplicationIdAsync(Guid applicationId);
    Task<Document?> GetByApplicationAndTypeAsync(Guid applicationId, DocumentType documentType);
    Task<Document> CreateAsync(Document document);
    Task<Document> UpdateAsync(Document document);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<DocumentVersion> AddVersionAsync(Guid documentId, string content);
    Task<DocumentVersion?> GetLatestVersionAsync(Guid documentId);
    Task<IEnumerable<DocumentVersion>> GetVersionsAsync(Guid documentId);
} 