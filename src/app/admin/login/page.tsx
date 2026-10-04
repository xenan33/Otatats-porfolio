import { redirect } from 'next/navigation';
import { getAdminState } from '@/lib/admin/auth';
import LoginForm from './LoginForm';

const ERRORS: Record<string, string> = {
  link: 'That sign-in link is invalid or has expired. Request a new one.',
  'not-admin': 'This account is not allowed to edit the portfolio.',
};

export default async function LoginPage({ searchParams }: PageProps<'/admin/login'>) {
  const { error } = await searchParams;
  const { state } = await getAdminState();
  if (state === 'admin') redirect('/admin');
  if (state === 'needs-mfa') redirect('/admin/mfa');

  return (
    <main className="dot-grid grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8">
        <p className="font-mono text-sm text-accent">otatats:~$ sudo -i</p>
        <h1 className="mt-2 text-2xl font-semibold">Admin sign-in</h1>
        <p className="mt-2 text-sm text-muted">We&apos;ll email you a one-time sign-in link.</p>
        {typeof error === 'string' && ERRORS[error] && <p className="mt-4 text-sm text-danger">{ERRORS[error]}</p>}
        {state === 'not-admin' && <p className="mt-4 text-sm text-danger">{ERRORS['not-admin']}</p>}
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
