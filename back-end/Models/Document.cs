namespace ResumeAutomation.API.Models
{
    public class Document : BaseModel
    {
        public string Title { get; set; } = string.Empty;
        public DocumentType DocumentType { get; set; }
        public int ApplicationId { get; set; }
        
        // Navigation properties
        public virtual Application Application { get; set; } = null!;
        public virtual ICollection<DocumentVersion> Versions { get; set; } = new List<DocumentVersion>();
        public virtual DocumentVersion? LatestVersion => Versions.OrderByDescending(v => v.Version).FirstOrDefault();
    }
} 