using ResumeAutomation.API.DTOs;

namespace ResumeAutomation.API.Services
{
    public interface IApplicationService
    {
        Task<IEnumerable<ApplicationDto>> GetAllAsync();
        Task<ApplicationDto?> GetByIdAsync(int id);
        Task<IEnumerable<ApplicationDto>> GetByCandidateIdAsync(int candidateId);
        Task<ApplicationDto?> GetByCandidateAndRoleAsync(int candidateId, string roleName);
        Task<ApplicationDto> CreateAsync(CreateApplicationDto createDto);
        Task<ApplicationDto> UpdateAsync(int id, UpdateApplicationDto updateDto);
        Task DeleteAsync(int id);
    }
} 