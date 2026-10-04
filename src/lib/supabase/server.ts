import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { DB_SCHEMA, SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/env';

// Session-aware client for the admin area. Acts as the signed-in user, so RLS applies.
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: DB_SCHEMA },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: the proxy refreshes the session instead.
        }
      },
    },
  });
}
