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
                    .ThenInclude(d => d.Versions)
                .ToListAsync();
        }

        public async Task<Application?> GetByIdAsync(Guid id)
        {
            return await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.Documents)
                    .ThenInclude(d => d.Versions)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Application>> GetByCandidateIdAsync(Guid candidateId)
        {
            return await _context.Applications
                .Include(a => a.Documents)
                    .ThenInclude(d => d.Versions)
                .Where(a => a.CandidateId == candidateId)
                .ToListAsync();
        }

        public async Task<Application?> GetByCandidateAndRoleAsync(Guid candidateId, string roleName)
        {
            return await _context.Applications
                .Include(a => a.Documents)
                    .ThenInclude(d => d.Versions)
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
            
            // Ensure CreatedAt is UTC if it has Unspecified Kind
            if (application.CreatedAt.Kind == DateTimeKind.Unspecified)
            {
                application.CreatedAt = DateTime.SpecifyKind(application.CreatedAt, DateTimeKind.Utc);
            }
            
            _context.Applications.Update(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task DeleteAsync(Guid id)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application != null)
            {
                _context.Applications.Remove(application);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Applications.AnyAsync(a => a.Id == id);
        }

        public async Task<bool> ExistsByCandidateAndRoleAsync(Guid candidateId, string roleName)
        {
            return await _context.Applications.AnyAsync(a => a.CandidateId == candidateId && a.RoleName == roleName);
        }
    }
} 