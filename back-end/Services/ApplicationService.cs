using AutoMapper;
using ResumeAutomation.API.DTOs;
using ResumeAutomation.API.Models;
using ResumeAutomation.API.Repositories;

namespace ResumeAutomation.API.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly ICandidateRepository _candidateRepository;
        private readonly IMapper _mapper;

        public ApplicationService(
            IApplicationRepository applicationRepository,
            ICandidateRepository candidateRepository,
            IMapper mapper)
        {
            _applicationRepository = applicationRepository;
            _candidateRepository = candidateRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ApplicationDto>> GetAllAsync()
        {
            var applications = await _applicationRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ApplicationDto>>(applications);
        }

        public async Task<ApplicationDto?> GetByIdAsync(int id)
        {
            var application = await _applicationRepository.GetByIdAsync(id);
            return _mapper.Map<ApplicationDto?>(application);
        }

        public async Task<IEnumerable<ApplicationDto>> GetByCandidateIdAsync(int candidateId)
        {
            var applications = await _applicationRepository.GetByCandidateIdAsync(candidateId);
            return _mapper.Map<IEnumerable<ApplicationDto>>(applications);
        }

        public async Task<ApplicationDto?> GetByCandidateAndRoleAsync(int candidateId, string roleName)
        {
            var application = await _applicationRepository.GetByCandidateAndRoleAsync(candidateId, roleName);
            return _mapper.Map<ApplicationDto?>(application);
        }

        public async Task<ApplicationDto> CreateAsync(CreateApplicationDto createDto)
        {
            // Verify candidate exists
            var candidate = await _candidateRepository.GetByIdAsync(createDto.CandidateId);
            if (candidate == null)
            {
                throw new ArgumentException($"Candidate with ID {createDto.CandidateId} not found.");
            }

            // Check if application already exists for this candidate and role
            if (await _applicationRepository.ExistsByCandidateAndRoleAsync(createDto.CandidateId, createDto.RoleName))
            {
                throw new InvalidOperationException($"Application for role '{createDto.RoleName}' already exists for this candidate.");
            }

            var application = _mapper.Map<Application>(createDto);
            var createdApplication = await _applicationRepository.CreateAsync(application);
            return _mapper.Map<ApplicationDto>(createdApplication);
        }

        public async Task<ApplicationDto> UpdateAsync(int id, UpdateApplicationDto updateDto)
        {
            var application = await _applicationRepository.GetByIdAsync(id);
            if (application == null)
            {
                throw new ArgumentException($"Application with ID {id} not found.");
            }

            // If role name is being updated, check for duplicates
            if (!string.IsNullOrEmpty(updateDto.RoleName) && updateDto.RoleName != application.RoleName)
            {
                if (await _applicationRepository.ExistsByCandidateAndRoleAsync(application.CandidateId, updateDto.RoleName))
                {
                    throw new InvalidOperationException($"Application for role '{updateDto.RoleName}' already exists for this candidate.");
                }
            }

            _mapper.Map(updateDto, application);
            var updatedApplication = await _applicationRepository.UpdateAsync(application);
            return _mapper.Map<ApplicationDto>(updatedApplication);
        }

        public async Task DeleteAsync(int id)
        {
            if (!await _applicationRepository.ExistsAsync(id))
            {
                throw new ArgumentException($"Application with ID {id} not found.");
            }

            await _applicationRepository.DeleteAsync(id);
        }
    }
} 