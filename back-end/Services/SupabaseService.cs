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
    }
} 