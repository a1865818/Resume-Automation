namespace ResumeAutomation.API.Models
{
    public class Application : BaseModel
    {
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid CandidateId { get; set; }
        
        // Navigation properties
        public Candidate Candidate { get; set; } = null!;
        public ICollection<Document> Documents { get; set; } = new List<Document>();
    }
} 