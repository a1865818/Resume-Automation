using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Repositories;

public interface ICandidateRepository
{
    Task<IEnumerable<Candidate>> GetAllAsync();
    Task<Candidate?> GetByIdAsync(Guid id);
    Task<Candidate?> GetByNameAsync(string name);
    Task<Candidate> CreateAsync(Candidate candidate);
    Task<Candidate> UpdateAsync(Candidate candidate);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> ExistsByNameAsync(string name);
} 