using AutoMapper;
using ResumeAutomation.API.DTOs;
using ResumeAutomation.API.Models;
using ResumeAutomation.API.Repositories;

namespace ResumeAutomation.API.Services;

public class DocumentService : IDocumentService
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IApplicationRepository _applicationRepository;
    private readonly IMapper _mapper;

    public DocumentService(IDocumentRepository documentRepository, IApplicationRepository applicationRepository, IMapper mapper)
    {
        _documentRepository = documentRepository;
        _applicationRepository = applicationRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DocumentDto>> GetAllAsync()
    {
        var documents = await _documentRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<DocumentDto>>(documents);
    }

    public async Task<DocumentDto?> GetByIdAsync(Guid id)
    {
        var document = await _documentRepository.GetByIdAsync(id);
        return _mapper.Map<DocumentDto>(document);
    }

    public async Task<IEnumerable<DocumentDto>> GetByApplicationIdAsync(Guid applicationId)
    {
        var documents = await _documentRepository.GetByApplicationIdAsync(applicationId);
        return _mapper.Map<IEnumerable<DocumentDto>>(documents);
    }

    public async Task<DocumentWithContentDto?> GetByApplicationAndTypeAsync(Guid applicationId, DocumentType documentType)
    {
        var document = await _documentRepository.GetByApplicationAndTypeAsync(applicationId, documentType);
        if (document == null) return null;

        var latestVersion = await _documentRepository.GetLatestVersionAsync(document.Id);
        if (latestVersion == null) return null;

        return new DocumentWithContentDto
        {
            Id = document.Id,
            Title = document.Title,
            DocumentType = document.DocumentType,
            ApplicationId = document.ApplicationId,
            CreatedAt = document.CreatedAt,
            UpdatedAt = document.UpdatedAt,
            Content = latestVersion.Content,
            Version = latestVersion.Version
        };
    }

    public async Task<DocumentDto> CreateAsync(CreateDocumentDto createDto)
    {
        // Verify application exists
        if (!await _applicationRepository.ExistsAsync(createDto.ApplicationId))
        {
            throw new ArgumentException($"Application with ID {createDto.ApplicationId} not found.");
        }

        // Check if document of this type already exists for this application
        var existingDocument = await _documentRepository.GetByApplicationAndTypeAsync(createDto.ApplicationId, createDto.DocumentType);
        if (existingDocument != null)
        {
            throw new InvalidOperationException($"A {createDto.DocumentType} document already exists for this application.");
        }

        var document = _mapper.Map<Document>(createDto);
        var createdDocument = await _documentRepository.CreateAsync(document);

        // Add initial version
        if (!string.IsNullOrEmpty(createDto.Content))
        {
            await _documentRepository.AddVersionAsync(createdDocument.Id, createDto.Content);
        }

        // Reload document with versions
        var documentWithVersions = await _documentRepository.GetByIdAsync(createdDocument.Id);
        return _mapper.Map<DocumentDto>(documentWithVersions);
    }

    public async Task<DocumentDto> UpdateAsync(Guid id, UpdateDocumentDto updateDto)
    {
        var document = await _documentRepository.GetByIdAsync(id);
        if (document == null)
        {
            throw new ArgumentException($"Document with ID {id} not found.");
        }

        // Update document properties
        if (!string.IsNullOrEmpty(updateDto.Title))
            document.Title = updateDto.Title;

        var updatedDocument = await _documentRepository.UpdateAsync(document);

        // Add new version if content is provided
        if (!string.IsNullOrEmpty(updateDto.Content))
        {
            await _documentRepository.AddVersionAsync(id, updateDto.Content);
        }

        // Reload document with versions
        var documentWithVersions = await _documentRepository.GetByIdAsync(id);
        return _mapper.Map<DocumentDto>(documentWithVersions);
    }

    public async Task DeleteAsync(Guid id)
    {
        if (!await _documentRepository.ExistsAsync(id))
        {
            throw new ArgumentException($"Document with ID {id} not found.");
        }

        await _documentRepository.DeleteAsync(id);
    }

    public async Task<DocumentVersionDto> AddVersionAsync(Guid documentId, string content)
    {
        if (!await _documentRepository.ExistsAsync(documentId))
        {
            throw new ArgumentException($"Document with ID {documentId} not found.");
        }

        var version = await _documentRepository.AddVersionAsync(documentId, content);
        return _mapper.Map<DocumentVersionDto>(version);
    }

    public async Task<IEnumerable<DocumentVersionDto>> GetVersionsAsync(Guid documentId)
    {
        if (!await _documentRepository.ExistsAsync(documentId))
        {
            throw new ArgumentException($"Document with ID {documentId} not found.");
        }

        var versions = await _documentRepository.GetVersionsAsync(documentId);
        return _mapper.Map<IEnumerable<DocumentVersionDto>>(versions);
    }
} 