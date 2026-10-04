'use client';

import { useActionState } from 'react';
import { sendContactMessage, type ContactResult } from '@/app/contact-action';

const input =
  'w-full rounded-lg border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactResult | null, FormData>(sendContactMessage, null);
  if (state?.ok) return <p role="status" className="rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm font-medium text-accent-2">{state.message}</p>;

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Name</span>
          <input name="name" required maxLength={200} autoComplete="name" className={input} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
          <input name="email" type="email" required maxLength={320} autoComplete="email" className={input} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Company (optional)</span>
        <input name="company" maxLength={200} autoComplete="organization" className={input} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Message</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} className={input} />
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state && !state.ok && <p className="text-sm text-danger">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-2 disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
