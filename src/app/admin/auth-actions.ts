'use server';

import { redirect } from 'next/navigation';
import { SITE_URL } from '@/lib/env';
import { createSessionClient } from '@/lib/supabase/server';

export type AuthResult = { ok: boolean; message: string; qr?: string; secret?: string; factorId?: string };

export async function sendMagicLink(_prev: AuthResult | null, form: FormData): Promise<AuthResult> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: 'Enter a valid email.' };
  const supabase = await createSessionClient();
  // shouldCreateUser: false — the auth pool is shared, so the portfolio never creates accounts.
  await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: `${SITE_URL}/admin/auth/callback` },
  });
  // Same answer either way, so the form can't be used to find out which emails have accounts.
  return { ok: true, message: 'If that email belongs to the site owner, a sign-in link is on its way.' };
}

export async function startTotpEnrollment(): Promise<AuthResult> {
  const supabase = await createSessionClient();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  // Clear abandoned, unverified enrollments so a fresh QR code can be issued.
  for (const f of factors?.all ?? []) {
    if (f.factor_type === 'totp' && f.status !== 'verified') await supabase.auth.mfa.unenroll({ factorId: f.id });
  }
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Portfolio admin' });
  if (error || !data) return { ok: false, message: 'Could not start authenticator setup.' };
  return { ok: true, message: '', qr: data.totp.qr_code, secret: data.totp.secret, factorId: data.id };
}

export async function verifyTotp(_prev: AuthResult | null, form: FormData): Promise<AuthResult> {
  const code = String(form.get('code') ?? '').replace(/\s/g, '');
  const factorId = String(form.get('factorId') ?? '');
  if (!/^\d{6}$/.test(code)) return { ok: false, message: 'Enter the 6-digit code from your authenticator app.', factorId };
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) return { ok: false, message: 'That code did not work. Try the next one.', factorId };
  redirect('/admin');
}
