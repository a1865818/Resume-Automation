namespace ResumeAutomation.API.Models
{
    public class Candidate : BaseModel
    {
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? CSID_Number { get; set; }
        
        // Navigation properties
        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    }
} 