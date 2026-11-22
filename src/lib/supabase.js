import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
// Automatically clean URL (strip /rest/v1 or trailing slashes if user copied from dashboard)
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Check if credentials are valid and not default placeholders
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('your-project.supabase.co') &&
  supabaseAnonKey.length > 20
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

// Helper to check connection health
export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in .env file (using local fallback engine).'
    };
  }

  try {
    const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('schema cache') || error.message.includes('not found')) {
        return {
          connected: false,
          needsSchema: true,
          message: 'Connected to Supabase project, but tables are not created yet! Run supabase_schema.sql in your Supabase SQL Editor.'
        };
      }
      return {
        connected: false,
        message: `Supabase error: ${error.message}`
      };
    }
    return {
      connected: true,
      message: 'Connected to Supabase live database successfully.'
    };
  } catch (err) {
    return {
      connected: false,
      message: `Connection failed: ${err.message}`
    };
  }
}
