using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.DTOs
{
    public class CreateApplicationDto
    {
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid CandidateId { get; set; }
        public ResumeGenerationMode GenerationMode { get; set; } = ResumeGenerationMode.Standard;
        public TemplateType TemplateType { get; set; } = TemplateType.Papps;
        public string? JobDescription { get; set; }
    }

    public class UpdateApplicationDto
    {
        public string? RoleName { get; set; }
        public string? Description { get; set; }
        public ResumeGenerationMode? GenerationMode { get; set; }
        public TemplateType? TemplateType { get; set; }
        public string? JobDescription { get; set; }
    }

    public class ApplicationDto
    {
        public Guid Id { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid CandidateId { get; set; }
        public ResumeGenerationMode GenerationMode { get; set; }
        public TemplateType TemplateType { get; set; }
        public string? JobDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<DocumentDto> Documents { get; set; } = new List<DocumentDto>();
    }
} 