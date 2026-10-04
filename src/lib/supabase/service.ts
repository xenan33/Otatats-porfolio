import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { DB_SCHEMA, SUPABASE_URL } from '@/lib/env';

// Service-role client: bypasses RLS. Server-only, used for the contact form and
// recruiter share links, never for anything a visitor controls directly.
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createClient(SUPABASE_URL, key, {
    db: { schema: DB_SCHEMA },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
