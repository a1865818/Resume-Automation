namespace ResumeAutomation.API.Models
{
    public class Application : BaseModel
    {
        public string RoleName { get; set; } = string.Empty; // Applied role name (e.g., "Senior Developer")
        public string? Description { get; set; }
        public Guid CandidateId { get; set; }
        public ResumeGenerationMode GenerationMode { get; set; } = ResumeGenerationMode.Standard;
        public TemplateType TemplateType { get; set; } = TemplateType.Papps;
        public string? JobDescription { get; set; } // For tailored mode, store the job description
        
        // Navigation properties
        public Candidate Candidate { get; set; } = null!;
        public ICollection<Document> Documents { get; set; } = new List<Document>();
    }
} 