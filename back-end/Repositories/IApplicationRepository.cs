using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Repositories
{
    public interface IApplicationRepository
    {
        Task<IEnumerable<Application>> GetAllAsync();
        Task<Application?> GetByIdAsync(int id);
        Task<IEnumerable<Application>> GetByCandidateIdAsync(int candidateId);
        Task<Application?> GetByCandidateAndRoleAsync(int candidateId, string roleName);
        Task<Application> CreateAsync(Application application);
        Task<Application> UpdateAsync(Application application);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByCandidateAndRoleAsync(int candidateId, string roleName);
    }
} 