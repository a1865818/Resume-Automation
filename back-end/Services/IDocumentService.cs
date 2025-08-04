using ResumeAutomation.API.DTOs;
using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Services;

public interface IDocumentService
{
    Task<IEnumerable<DocumentDto>> GetAllAsync();
    Task<DocumentDto?> GetByIdAsync(int id);
    Task<IEnumerable<DocumentDto>> GetByApplicationIdAsync(int applicationId);
    Task<DocumentWithContentDto?> GetByApplicationAndTypeAsync(int applicationId, DocumentType documentType);
    Task<DocumentDto> CreateAsync(CreateDocumentDto createDto);
    Task<DocumentDto> UpdateAsync(int id, UpdateDocumentDto updateDto);
    Task DeleteAsync(int id);
    Task<DocumentVersionDto> AddVersionAsync(int documentId, string content);
    Task<IEnumerable<DocumentVersionDto>> GetVersionsAsync(int documentId);
} 