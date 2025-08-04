using Microsoft.AspNetCore.Mvc;
using ResumeAutomation.API.DTOs;
using ResumeAutomation.API.Services;

namespace ResumeAutomation.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CandidatesController : ControllerBase
{
    private readonly ICandidateService _candidateService;

    public CandidatesController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CandidateDto>>> GetAll()
    {
        var candidates = await _candidateService.GetAllAsync();
        return Ok(candidates);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CandidateDto>> GetById(int id)
    {
        var candidate = await _candidateService.GetByIdAsync(id);
        if (candidate == null)
            return NotFound();

        return Ok(candidate);
    }

    [HttpGet("name/{name}")]
    public async Task<ActionResult<CandidateDto>> GetByName(string name)
    {
        var candidate = await _candidateService.GetByNameAsync(name);
        if (candidate == null)
            return NotFound();

        return Ok(candidate);
    }

    [HttpPost]
    public async Task<ActionResult<CandidateDto>> Create(CreateCandidateDto createDto)
    {
        try
        {
            var candidate = await _candidateService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = candidate.Id }, candidate);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CandidateDto>> Update(int id, UpdateCandidateDto updateDto)
    {
        try
        {
            var candidate = await _candidateService.UpdateAsync(id, updateDto);
            return Ok(candidate);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            await _candidateService.DeleteAsync(id);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }
} 