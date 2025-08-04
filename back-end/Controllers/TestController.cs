using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeAutomation.API.Data;
using ResumeAutomation.API.DTOs;
using ResumeAutomation.API.Services;

namespace ResumeAutomation.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ICandidateService _candidateService;

    public TestController(ApplicationDbContext context, ICandidateService candidateService)
    {
        _context = context;
        _candidateService = candidateService;
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "OK", timestamp = DateTime.UtcNow });
    }

    [HttpGet("db-test")]
    public async Task<IActionResult> TestDatabase()
    {
        try
        {
            // Test if we can connect to the database
            var canConnect = await _context.Database.CanConnectAsync();
            
            if (!canConnect)
            {
                return StatusCode(500, new { error = "Cannot connect to database" });
            }

            // Test if we can query the Candidates table
            var candidateCount = await _context.Candidates.CountAsync();
            
            return Ok(new { 
                status = "OK", 
                canConnect = canConnect,
                candidateCount = candidateCount,
                timestamp = DateTime.UtcNow 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                error = "Database test failed", 
                message = ex.Message,
                stackTrace = ex.StackTrace
            });
        }
    }

    [HttpPost("test-candidate")]
    public async Task<IActionResult> TestCreateCandidate()
    {
        try
        {
            // Test creating a candidate with nullable fields
            var testCandidate = new CreateCandidateDto
            {
                Name = $"Test Candidate {DateTime.UtcNow.Ticks}",
                Email = null,
                Phone = null,
                DateOfBirth = null,
                CSID_Number = null
            };

            var result = await _candidateService.CreateAsync(testCandidate);
            
            return Ok(new { 
                status = "OK", 
                message = "Candidate created successfully with nullable fields",
                candidate = result
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                error = "Candidate creation test failed", 
                message = ex.Message,
                stackTrace = ex.StackTrace
            });
        }
    }
} 