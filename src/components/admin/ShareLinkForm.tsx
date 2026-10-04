'use client';

import { useActionState } from 'react';
import { createShareLink, type ActionResult } from '@/app/admin/actions';
import { inputClass } from './RowForm';

export default function ShareLinkForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(createShareLink, null);
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Who is it for?</span>
          <input name="label" required maxLength={120} placeholder="e.g. Acme Corp recruiter" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Expires after</span>
          <select name="days" defaultValue="30" className={inputClass}>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="0">Never</option>
          </select>
        </label>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="reveal_phone" className="h-4 w-4" /> Show my phone number on this link
      </label>
      <button type="submit" disabled={pending} className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg disabled:opacity-50">
        {pending ? 'Creating…' : 'Create link'}
      </button>
      {state && <p className={`break-all text-sm ${state.ok ? 'text-accent' : 'text-danger'}`}>{state.message}</p>}
    </form>
  );
}
