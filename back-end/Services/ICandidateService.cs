using ResumeAutomation.API.DTOs;

namespace ResumeAutomation.API.Services;

public interface ICandidateService
{
    Task<IEnumerable<CandidateDto>> GetAllAsync();
    Task<CandidateDto?> GetByIdAsync(int id);
    Task<CandidateDto?> GetByNameAsync(string name);
    Task<CandidateDto> CreateAsync(CreateCandidateDto createDto);
    Task<CandidateDto> UpdateAsync(int id, UpdateCandidateDto updateDto);
    Task DeleteAsync(int id);
} 