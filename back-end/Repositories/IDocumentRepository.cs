using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Repositories;

public interface IDocumentRepository
{
    Task<IEnumerable<Document>> GetAllAsync();
    Task<Document?> GetByIdAsync(int id);
    Task<IEnumerable<Document>> GetByApplicationIdAsync(int applicationId);
    Task<Document?> GetByApplicationAndTypeAsync(int applicationId, DocumentType documentType);
    Task<Document> CreateAsync(Document document);
    Task<Document> UpdateAsync(Document document);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<DocumentVersion> AddVersionAsync(int documentId, string content);
    Task<DocumentVersion?> GetLatestVersionAsync(int documentId);
    Task<IEnumerable<DocumentVersion>> GetVersionsAsync(int documentId);
} 