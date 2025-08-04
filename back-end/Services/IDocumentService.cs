using ResumeAutomation.API.DTOs;
using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Services;

public interface IDocumentService
{
    Task<IEnumerable<DocumentDto>> GetAllAsync();
    Task<DocumentDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<DocumentDto>> GetByApplicationIdAsync(Guid applicationId);
    Task<DocumentWithContentDto?> GetByApplicationAndTypeAsync(Guid applicationId, DocumentType documentType);
    Task<DocumentDto> CreateAsync(CreateDocumentDto createDto);
    Task<DocumentDto> UpdateAsync(Guid id, UpdateDocumentDto updateDto);
    Task DeleteAsync(Guid id);
    Task<DocumentVersionDto> AddVersionAsync(Guid documentId, string content);
    Task<IEnumerable<DocumentVersionDto>> GetVersionsAsync(Guid documentId);
} 