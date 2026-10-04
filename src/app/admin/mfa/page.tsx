import { redirect } from 'next/navigation';
import { getAdminState } from '@/lib/admin/auth';
import MfaForm from './MfaForm';

export default async function MfaPage() {
  const { state, supabase } = await getAdminState();
  if (state === 'signed-out') redirect('/admin/login');
  if (state === 'not-admin') redirect('/admin/login?error=not-admin');
  if (state === 'admin') redirect('/admin');

  const { data } = await supabase.auth.mfa.listFactors();
  const factor = data?.totp?.[0];

  return (
    <main className="dot-grid grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8">
        <p className="font-mono text-sm text-accent">otatats:~$ 2fa --verify</p>
        <h1 className="mt-2 text-2xl font-semibold">{factor ? 'Enter your code' : 'Set up two-factor sign-in'}</h1>
        <p className="mt-2 text-sm text-muted">
          {factor
            ? 'Open your authenticator app and enter the 6-digit code.'
            : 'Editing requires an authenticator app (Microsoft Authenticator, Google Authenticator, 1Password…).'}
        </p>
        <div className="mt-6">
          <MfaForm factorId={factor?.id ?? null} />
        </div>
      </div>
    </main>
  );
}
