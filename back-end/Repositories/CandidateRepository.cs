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
            .ThenInclude(d => d.Versions.OrderByDescending(v => v.Version).Take(1))
            .ToListAsync();
    }

    public async Task<Candidate?> GetByIdAsync(int id)
    {
        return await _context.Candidates
            .Include(c => c.Applications)
            .ThenInclude(a => a.Documents)
            .ThenInclude(d => d.Versions.OrderByDescending(v => v.Version))
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Candidate?> GetByNameAsync(string name)
    {
        return await _context.Candidates
            .Include(c => c.Applications)
            .ThenInclude(a => a.Documents)
            .ThenInclude(d => d.Versions.OrderByDescending(v => v.Version))
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
        _context.Candidates.Update(candidate);
        await _context.SaveChangesAsync();
        return candidate;
    }

    public async Task DeleteAsync(int id)
    {
        var candidate = await _context.Candidates.FindAsync(id);
        if (candidate != null)
        {
            _context.Candidates.Remove(candidate);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Candidates.AnyAsync(c => c.Id == id);
    }

    public async Task<bool> ExistsByNameAsync(string name)
    {
        return await _context.Candidates.AnyAsync(c => c.Name == name);
    }
} 