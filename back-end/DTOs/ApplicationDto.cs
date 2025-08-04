using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.DTOs
{
    public class CreateApplicationDto
    {
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CandidateId { get; set; }
    }

    public class UpdateApplicationDto
    {
        public string? RoleName { get; set; }
        public string? Description { get; set; }
    }

    public class ApplicationDto
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CandidateId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<DocumentDto> Documents { get; set; } = new List<DocumentDto>();
    }
} 