'use client';

import { useActionState, useState, useTransition } from 'react';
import { startTotpEnrollment, verifyTotp, type AuthResult } from '@/app/admin/auth-actions';
import { inputClass } from '@/components/admin/RowForm';

export default function MfaForm({ factorId }: { factorId: string | null }) {
  const [enrollment, setEnrollment] = useState<AuthResult | null>(null);
  const [starting, startTransition] = useTransition();
  const [state, action, pending] = useActionState<AuthResult | null, FormData>(verifyTotp, null);
  const activeFactor = factorId ?? enrollment?.factorId ?? null;

  if (!activeFactor) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          disabled={starting}
          onClick={() => startTransition(async () => setEnrollment(await startTotpEnrollment()))}
          className="w-full rounded-md bg-accent py-2 text-sm font-semibold text-bg disabled:opacity-50"
        >
          {starting ? 'Preparing…' : 'Show QR code'}
        </button>
        {enrollment && !enrollment.ok && <p className="text-sm text-danger">{enrollment.message}</p>}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {enrollment?.qr && (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- data: URL SVG from Supabase */}
          <img src={enrollment.qr} alt="Authenticator QR code" className="mx-auto h-48 w-48 rounded-lg bg-white p-2" />
          <p className="break-all text-center font-mono text-[11px] text-muted">Or enter key: {enrollment.secret}</p>
        </div>
      )}
      <input type="hidden" name="factorId" value={activeFactor} />
      <input
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        required
        placeholder="123456"
        className={`${inputClass} text-center font-mono text-lg tracking-[0.4em]`}
      />
      <button type="submit" disabled={pending} className="w-full rounded-md bg-accent py-2 text-sm font-semibold text-bg disabled:opacity-50">
        {pending ? 'Verifying…' : 'Verify'}
      </button>
      {state && !state.ok && <p className="text-sm text-danger">{state.message}</p>}
    </form>
  );
}
