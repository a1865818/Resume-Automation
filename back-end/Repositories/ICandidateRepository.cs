using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Repositories;

public interface ICandidateRepository
{
    Task<IEnumerable<Candidate>> GetAllAsync();
    Task<Candidate?> GetByIdAsync(int id);
    Task<Candidate?> GetByNameAsync(string name);
    Task<Candidate> CreateAsync(Candidate candidate);
    Task<Candidate> UpdateAsync(Candidate candidate);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
} 