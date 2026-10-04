'use client';

import { useActionState } from 'react';
import { sendMagicLink, type AuthResult } from '@/app/admin/auth-actions';
import { inputClass } from '@/components/admin/RowForm';

export default function LoginForm() {
  const [state, action, pending] = useActionState<AuthResult | null, FormData>(sendMagicLink, null);
  if (state?.ok) return <p className="text-sm text-accent">{state.message}</p>;
  return (
    <form action={action} className="space-y-4">
      <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
      <button type="submit" disabled={pending} className="w-full rounded-md bg-accent py-2 text-sm font-semibold text-bg disabled:opacity-50">
        {pending ? 'Sending…' : 'Email me a sign-in link'}
      </button>
      {state && !state.ok && <p className="text-sm text-danger">{state.message}</p>}
    </form>
  );
}
