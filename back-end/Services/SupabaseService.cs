using Supabase;

namespace ResumeAutomation.API.Services
{
    public class SupabaseService : ISupabaseService
    {
        private readonly Supabase.Client _supabaseClient;

        public SupabaseService(Supabase.Client supabaseClient)
        {
            _supabaseClient = supabaseClient;
        }

        // Basic Supabase client operations for database access
        // Can be extended later when authentication is needed
    }
} 