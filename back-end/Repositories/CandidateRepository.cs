using Microsoft.EntityFrameworkCore;
using ResumeAutomation.API.Data;
using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Repositories;

public class CandidateRepository : ICandidateRepository
{
    private readonly ApplicationDbContext _context;

    public CandidateRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Candidate>> GetAllAsync()
    {
        return await _context.Candidates
            .Include(c => c.Applications)
            .ThenInclude(a => a.Documents)
            .ThenInclude(d => d.Versions)
            .ToListAsync();
    }

    public async Task<Candidate?> GetByIdAsync(Guid id)
    {
        return await _context.Candidates
            .Include(c => c.Applications)
            .ThenInclude(a => a.Documents)
            .ThenInclude(d => d.Versions)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Candidate?> GetByNameAsync(string name)
    {
        return await _context.Candidates
            .Include(c => c.Applications)
            .ThenInclude(a => a.Documents)
            .ThenInclude(d => d.Versions)
            .FirstOrDefaultAsync(c => c.Name == name);
    }

    public async Task<Candidate> CreateAsync(Candidate candidate)
    {
        _context.Candidates.Add(candidate);
        await _context.SaveChangesAsync();
        return candidate;
    }

    public async Task<Candidate> UpdateAsync(Candidate candidate)
    {
        candidate.UpdatedAt = DateTime.UtcNow;
        
        // Ensure CreatedAt is UTC if it has Unspecified Kind
        if (candidate.CreatedAt.Kind == DateTimeKind.Unspecified)
        {
            candidate.CreatedAt = DateTime.SpecifyKind(candidate.CreatedAt, DateTimeKind.Utc);
        }
        
        _context.Candidates.Update(candidate);
        await _context.SaveChangesAsync();
        return candidate;
    }

    public async Task DeleteAsync(Guid id)
    {
        var candidate = await _context.Candidates.FindAsync(id);
        if (candidate != null)
        {
            _context.Candidates.Remove(candidate);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Candidates.AnyAsync(c => c.Id == id);
    }

    public async Task<bool> ExistsByNameAsync(string name)
    {
        return await _context.Candidates.AnyAsync(c => c.Name == name);
    }
} 