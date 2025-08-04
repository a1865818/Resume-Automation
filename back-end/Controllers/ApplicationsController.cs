using Microsoft.AspNetCore.Mvc;
using ResumeAutomation.API.DTOs;
using ResumeAutomation.API.Services;

namespace ResumeAutomation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetAll()
        {
            var applications = await _applicationService.GetAllAsync();
            return Ok(applications);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationDto>> GetById(Guid id)
        {
            var application = await _applicationService.GetByIdAsync(id);
            if (application == null)
            {
                return NotFound();
            }
            return Ok(application);
        }

        [HttpGet("candidate/{candidateId}")]
        public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetByCandidateId(Guid candidateId)
        {
            var applications = await _applicationService.GetByCandidateIdAsync(candidateId);
            return Ok(applications);
        }

        [HttpGet("candidate/{candidateId}/role/{roleName}")]
        public async Task<ActionResult<ApplicationDto>> GetByCandidateAndRole(Guid candidateId, string roleName)
        {
            var application = await _applicationService.GetByCandidateAndRoleAsync(candidateId, roleName);
            if (application == null)
            {
                return NotFound();
            }
            return Ok(application);
        }

        [HttpPost]
        public async Task<ActionResult<ApplicationDto>> Create(CreateApplicationDto createDto)
        {
            try
            {
                var application = await _applicationService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApplicationDto>> Update(Guid id, UpdateApplicationDto updateDto)
        {
            try
            {
                var application = await _applicationService.UpdateAsync(id, updateDto);
                return Ok(application);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                await _applicationService.DeleteAsync(id);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
} 