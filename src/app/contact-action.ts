'use server';

import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/service';

export type ContactResult = { ok: boolean; message: string };

const MAX_PER_HOUR = 3;

export async function sendContactMessage(_prev: ContactResult | null, form: FormData): Promise<ContactResult> {
  // Honeypot: real visitors never see or fill this field.
  if (String(form.get('website') ?? '') !== '') return { ok: true, message: 'Thanks! Your message was sent.' };

  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const company = String(form.get('company') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();

  if (!name || name.length > 200) return { ok: false, message: 'Please enter your name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) return { ok: false, message: 'Please enter a valid email.' };
  if (company.length > 200) return { ok: false, message: 'Company name is too long.' };
  if (message.length < 10 || message.length > 5000) return { ok: false, message: 'Message should be 10 to 5000 characters.' };

  const db = createServiceClient();
  if (!db) return { ok: false, message: 'The contact form is not available right now. Please use email or LinkedIn.' };

  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  const ipHash = createHash('sha256').update(`${process.env.IP_HASH_SALT ?? ''}:${ip}`).digest('hex');

  const since = new Date(Date.now() - 3_600_000).toISOString();
  const { count } = await db
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since);
  if ((count ?? 0) >= MAX_PER_HOUR) return { ok: false, message: 'Too many messages. Please try again later.' };

  const { error } = await db
    .from('contact_messages')
    .insert({ name, email, company: company || null, message, ip_hash: ipHash });
  if (error) return { ok: false, message: 'Something went wrong. Please use email or LinkedIn instead.' };

  return { ok: true, message: 'Thanks! Your message was sent.' };
}
