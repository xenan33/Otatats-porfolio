import { createClient } from '@supabase/supabase-js';
import { DB_SCHEMA, SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/env';

// Anonymous, cookie-less client for public pages. RLS limits it to published rows.
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: DB_SCHEMA },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
