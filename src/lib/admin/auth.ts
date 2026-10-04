import 'server-only';
import { redirect } from 'next/navigation';
import { createSessionClient } from '@/lib/supabase/server';

export type AdminState = 'signed-out' | 'not-admin' | 'needs-mfa' | 'admin';

// Works out where the current visitor stands. The auth user pool is shared with
// other apps, so being signed in is not enough: the user must be listed in
// portfolio.admins and have passed MFA (aal2).
export async function getAdminState() {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { state: 'signed-out' as AdminState, supabase, user: null };

  const { data: isAdminUser } = await supabase.rpc('is_admin_user');
  if (!isAdminUser) return { state: 'not-admin' as AdminState, supabase, user };

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel !== 'aal2') return { state: 'needs-mfa' as AdminState, supabase, user };

  return { state: 'admin' as AdminState, supabase, user };
}

export async function requireAdmin() {
  const result = await getAdminState();
  if (result.state === 'signed-out') redirect('/admin/login');
  if (result.state === 'not-admin') redirect('/admin/login?error=not-admin');
  if (result.state === 'needs-mfa') redirect('/admin/mfa');
  return { supabase: result.supabase, user: result.user! };
}
