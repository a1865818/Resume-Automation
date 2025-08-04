using Microsoft.AspNetCore.Mvc;
using ResumeAutomation.API.DTOs;
using ResumeAutomation.API.Models;
using ResumeAutomation.API.Services;

namespace ResumeAutomation.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;
    private readonly IApplicationService _applicationService;
    private readonly ICandidateService _candidateService;

    public DocumentsController(IDocumentService documentService, IApplicationService applicationService, ICandidateService candidateService)
    {
        _documentService = documentService;
        _applicationService = applicationService;
        _candidateService = candidateService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetAll()
    {
        var documents = await _documentService.GetAllAsync();
        return Ok(documents);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DocumentDto>> GetById(Guid id)
    {
        var document = await _documentService.GetByIdAsync(id);
        if (document == null)
            return NotFound();

        return Ok(document);
    }

    [HttpGet("application/{applicationId}")]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetByApplicationId(Guid applicationId)
    {
        var documents = await _documentService.GetByApplicationIdAsync(applicationId);
        return Ok(documents);
    }

    // Custom routing for the specific URL structure requested
    [HttpGet("candidate/{candidateName}/roles/{roleName}/{documentType}/{documentId}")]
    public async Task<ActionResult<DocumentWithContentDto>> GetByCustomRoute(
        string candidateName, 
        string roleName, 
        string documentType, 
        Guid documentId)
    {
        // First, find the candidate by name
        var candidate = await _candidateService.GetByNameAsync(candidateName);
        if (candidate == null)
            return NotFound($"Candidate '{candidateName}' not found.");

        // Find the application for this candidate and role
        var application = await _applicationService.GetByCandidateAndRoleAsync(candidate.Id, roleName);
        if (application == null)
            return NotFound($"No application found for role '{roleName}' for candidate '{candidateName}'.");

        // Parse document type
        if (!Enum.TryParse<DocumentType>(documentType, true, out var docType))
            return BadRequest($"Invalid document type: {documentType}");

        // Get the document with content
        var document = await _documentService.GetByApplicationAndTypeAsync(application.Id, docType);
        if (document == null)
            return NotFound($"No {documentType} document found for candidate '{candidateName}' in role '{roleName}'.");

        // Verify the document ID matches
        if (document.Id != documentId)
            return NotFound($"Document ID mismatch. Expected: {document.Id}, Provided: {documentId}");

        return Ok(document);
    }

    [HttpPost]
    public async Task<ActionResult<DocumentDto>> Create(CreateDocumentDto createDto)
    {
        try
        {
            var document = await _documentService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = document.Id }, document);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DocumentDto>> Update(Guid id, UpdateDocumentDto updateDto)
    {
        try
        {
            var document = await _documentService.UpdateAsync(id, updateDto);
            return Ok(document);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _documentService.DeleteAsync(id);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("{id}/versions")]
    public async Task<ActionResult<DocumentVersionDto>> AddVersion(Guid id, [FromBody] string content)
    {
        try
        {
            var version = await _documentService.AddVersionAsync(id, content);
            return Ok(version);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{id}/versions")]
    public async Task<ActionResult<IEnumerable<DocumentVersionDto>>> GetVersions(Guid id)
    {
        try
        {
            var versions = await _documentService.GetVersionsAsync(id);
            return Ok(versions);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }
} 