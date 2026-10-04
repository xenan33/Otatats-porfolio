'use client';

import { useActionState } from 'react';
import { sendContactMessage, type ContactResult } from '@/app/contact-action';

const input =
  'w-full rounded-lg border border-line bg-bg/80 px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none';

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactResult | null, FormData>(sendContactMessage, null);
  if (state?.ok) return <p className="rounded-lg border border-accent/40 bg-accent/10 p-4 font-mono text-sm text-accent">[ OK ] {state.message}</p>;

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Name</span>
          <input name="name" required maxLength={200} autoComplete="name" className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Email</span>
          <input name="email" type="email" required maxLength={320} autoComplete="email" className={input} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs text-muted">Company (optional)</span>
        <input name="company" maxLength={200} autoComplete="organization" className={input} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-muted">Message</span>
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
        className="cursor-target rounded-lg bg-accent px-5 py-2.5 font-mono text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'sending…' : './send_message'}
      </button>
    </form>
  );
}
