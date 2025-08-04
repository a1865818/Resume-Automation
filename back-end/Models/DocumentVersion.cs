namespace ResumeAutomation.API.Models
{
    public class DocumentVersion : BaseModel
    {
        public int Version { get; set; }
        public string Content { get; set; } = string.Empty; // JSON content
        public int DocumentId { get; set; }
        
        // Navigation properties
        public virtual Document Document { get; set; } = null!;
    }
} 