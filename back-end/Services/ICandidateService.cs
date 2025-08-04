using ResumeAutomation.API.DTOs;

namespace ResumeAutomation.API.Services;

public interface ICandidateService
{
    Task<IEnumerable<CandidateDto>> GetAllAsync();
    Task<CandidateDto?> GetByIdAsync(Guid id);
    Task<CandidateDto?> GetByNameAsync(string name);
    Task<CandidateDto> CreateAsync(CreateCandidateDto createDto);
    Task<CandidateDto> UpdateAsync(Guid id, UpdateCandidateDto updateDto);
    Task DeleteAsync(Guid id);
} 