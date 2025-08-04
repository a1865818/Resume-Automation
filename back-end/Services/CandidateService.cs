using AutoMapper;
using ResumeAutomation.API.DTOs;
using ResumeAutomation.API.Models;
using ResumeAutomation.API.Repositories;

namespace ResumeAutomation.API.Services;

public class CandidateService : ICandidateService
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly IMapper _mapper;

    public CandidateService(ICandidateRepository candidateRepository, IMapper mapper)
    {
        _candidateRepository = candidateRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CandidateDto>> GetAllAsync()
    {
        var candidates = await _candidateRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<CandidateDto>>(candidates);
    }

    public async Task<CandidateDto?> GetByIdAsync(int id)
    {
        var candidate = await _candidateRepository.GetByIdAsync(id);
        return _mapper.Map<CandidateDto>(candidate);
    }

    public async Task<CandidateDto?> GetByNameAsync(string name)
    {
        var candidate = await _candidateRepository.GetByNameAsync(name);
        return _mapper.Map<CandidateDto>(candidate);
    }

    public async Task<CandidateDto> CreateAsync(CreateCandidateDto createDto)
    {
        // Check if candidate with same name already exists
        if (await _candidateRepository.ExistsByNameAsync(createDto.Name))
        {
            throw new InvalidOperationException($"A candidate with the name '{createDto.Name}' already exists.");
        }

        var candidate = _mapper.Map<Candidate>(createDto);
        var createdCandidate = await _candidateRepository.CreateAsync(candidate);
        return _mapper.Map<CandidateDto>(createdCandidate);
    }

    public async Task<CandidateDto> UpdateAsync(int id, UpdateCandidateDto updateDto)
    {
        var candidate = await _candidateRepository.GetByIdAsync(id);
        if (candidate == null)
        {
            throw new ArgumentException($"Candidate with ID {id} not found.");
        }

        // Update only provided fields
        if (!string.IsNullOrEmpty(updateDto.Name))
        {
            // Check if new name conflicts with existing candidate
            if (updateDto.Name != candidate.Name && await _candidateRepository.ExistsByNameAsync(updateDto.Name))
            {
                throw new InvalidOperationException($"A candidate with the name '{updateDto.Name}' already exists.");
            }
            candidate.Name = updateDto.Name;
        }

        if (updateDto.Email != null)
            candidate.Email = updateDto.Email;

        if (updateDto.Phone != null)
            candidate.Phone = updateDto.Phone;

        var updatedCandidate = await _candidateRepository.UpdateAsync(candidate);
        return _mapper.Map<CandidateDto>(updatedCandidate);
    }

    public async Task DeleteAsync(int id)
    {
        if (!await _candidateRepository.ExistsAsync(id))
        {
            throw new ArgumentException($"Candidate with ID {id} not found.");
        }

        await _candidateRepository.DeleteAsync(id);
    }
} 