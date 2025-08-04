using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.DTOs;

public class CreateDocumentDto
{
    public string Title { get; set; } = string.Empty;
    public DocumentType DocumentType { get; set; }
    public string Content { get; set; } = string.Empty; // JSON content
    public int ApplicationId { get; set; }
}

public class UpdateDocumentDto
{
    public string? Title { get; set; }
    public string? Content { get; set; } // JSON content for new version
}

public class DocumentDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DocumentType DocumentType { get; set; }
    public int ApplicationId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DocumentVersionDto? LatestVersion { get; set; }
    public List<DocumentVersionDto> Versions { get; set; } = new();
}

public class DocumentVersionDto
{
    public int Id { get; set; }
    public int Version { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class DocumentWithContentDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DocumentType DocumentType { get; set; }
    public int ApplicationId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Content { get; set; } = string.Empty; // Latest version content
    public int Version { get; set; }
} 