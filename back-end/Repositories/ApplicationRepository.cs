using Microsoft.EntityFrameworkCore;
using ResumeAutomation.API.Data;
using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public ApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Application>> GetAllAsync()
        {
            return await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Documents)
                    .ThenInclude(d => d.LatestVersion)
                .ToListAsync();
        }

        public async Task<Application?> GetByIdAsync(int id)
        {
            return await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Documents)
                    .ThenInclude(d => d.LatestVersion)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Application>> GetByCandidateIdAsync(int candidateId)
        {
            return await _context.Applications
                .Include(a => a.Documents)
                    .ThenInclude(d => d.LatestVersion)
                .Where(a => a.CandidateId == candidateId)
                .ToListAsync();
        }

        public async Task<Application?> GetByCandidateAndRoleAsync(int candidateId, string roleName)
        {
            return await _context.Applications
                .Include(a => a.Documents)
                    .ThenInclude(d => d.LatestVersion)
                .FirstOrDefaultAsync(a => a.CandidateId == candidateId && a.RoleName == roleName);
        }

        public async Task<Application> CreateAsync(Application application)
        {
            application.CreatedAt = DateTime.UtcNow;
            application.UpdatedAt = DateTime.UtcNow;
            
            _context.Applications.Add(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<Application> UpdateAsync(Application application)
        {
            application.UpdatedAt = DateTime.UtcNow;
            
            _context.Applications.Update(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task DeleteAsync(int id)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application != null)
            {
                _context.Applications.Remove(application);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Applications.AnyAsync(a => a.Id == id);
        }

        public async Task<bool> ExistsByCandidateAndRoleAsync(int candidateId, string roleName)
        {
            return await _context.Applications.AnyAsync(a => a.CandidateId == candidateId && a.RoleName == roleName);
        }
    }
} 