using ResumeAutomation.API.DTOs;

namespace ResumeAutomation.API.Services
{
    public interface IApplicationService
    {
        Task<IEnumerable<ApplicationDto>> GetAllAsync();
        Task<ApplicationDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<ApplicationDto>> GetByCandidateIdAsync(Guid candidateId);
        Task<ApplicationDto?> GetByCandidateAndRoleAsync(Guid candidateId, string roleName);
        Task<ApplicationDto> CreateAsync(CreateApplicationDto createDto);
        Task<ApplicationDto> UpdateAsync(Guid id, UpdateApplicationDto updateDto);
        Task DeleteAsync(Guid id);
    }
} 