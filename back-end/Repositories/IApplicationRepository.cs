using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Repositories
{
    public interface IApplicationRepository
    {
        Task<IEnumerable<Application>> GetAllAsync();
        Task<Application?> GetByIdAsync(Guid id);
        Task<IEnumerable<Application>> GetByCandidateIdAsync(Guid candidateId);
        Task<Application?> GetByCandidateAndRoleAsync(Guid candidateId, string roleName);
        Task<Application> CreateAsync(Application application);
        Task<Application> UpdateAsync(Application application);
        Task DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
        Task<bool> ExistsByCandidateAndRoleAsync(Guid candidateId, string roleName);
    }
} 