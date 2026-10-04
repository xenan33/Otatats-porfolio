'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/auth';
import { parseRow } from '@/lib/admin/parse';
import { TABLES } from '@/lib/admin/tables';
import { SITE_URL } from '@/lib/env';
import { createSessionClient } from '@/lib/supabase/server';

export type ActionResult = { ok: boolean; message: string };

function configFor(tableName: unknown) {
  const config = typeof tableName === 'string' ? TABLES[tableName] : undefined;
  if (!config) throw new Error('Unknown table');
  return config;
}

function refreshPublicPages() {
  revalidatePath('/', 'layout');
}

// ── Generic content editing ────────────────────────────────────────────────
export async function saveRow(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const config = configFor(form.get('_table'));
  const { row, errors } = parseRow(config, form);
  if (errors.length) return { ok: false, message: errors.join('. ') };

  const id = form.get('_id');
  let error;
  if (typeof id === 'string' && id !== '') {
    ({ error } = await supabase.from(config.table).update(row).eq(config.key, id));
  } else if (config.table === 'profile_private') {
    const { data: profile } = await supabase.from('profile').select('id').order('id').limit(1).single();
    if (!profile) return { ok: false, message: 'Create the profile first.' };
    ({ error } = await supabase.from(config.table).upsert({ ...row, profile_id: profile.id }));
  } else {
    ({ error } = await supabase.from(config.table).insert(row));
  }
  if (error) return { ok: false, message: friendlyError(error.message) };

  refreshPublicPages();
  return { ok: true, message: 'Saved.' };
}

export async function deleteRow(form: FormData) {
  const { supabase } = await requireAdmin();
  const config = configFor(form.get('_table'));
  if (config.singleton) throw new Error('This item cannot be deleted');
  const id = String(form.get('_id') ?? '');
  if (!id) return;
  await supabase.from(config.table).delete().eq(config.key, id);
  refreshPublicPages();
}

function friendlyError(message: string) {
  if (message.includes('duplicate key')) return 'That already exists.';
  if (message.includes('row-level security')) return 'Not allowed. Sign in again with your authenticator code.';
  if (message.includes('experience_current_ck')) return 'A current role cannot have an end date.';
  if (message.includes('_dates_ck')) return 'The end date must be after the start date.';
  return 'Could not save. Check the fields and try again.';
}

// ── Contact messages ───────────────────────────────────────────────────────
export async function setMessageRead(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = Number(form.get('id'));
  await supabase.from('contact_messages').update({ is_read: form.get('read') === 'true' }).eq('id', id);
  revalidatePath('/admin/messages');
}

export async function deleteMessage(form: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('contact_messages').delete().eq('id', Number(form.get('id')));
  revalidatePath('/admin/messages');
}

// ── Recruiter share links ──────────────────────────────────────────────────
export async function createShareLink(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const label = String(form.get('label') ?? '').trim().slice(0, 120);
  if (!label) return { ok: false, message: 'Give the link a name, e.g. the company or recruiter.' };
  const days = Number(form.get('days') ?? 30);
  const expires_at = days > 0 ? new Date(Date.now() + days * 86_400_000).toISOString() : null;
  const token = randomBytes(24).toString('base64url');
  const { error } = await supabase
    .from('share_links')
    .insert({ label, token, reveal_phone: form.get('reveal_phone') === 'on', expires_at });
  if (error) return { ok: false, message: 'Could not create the link.' };
  revalidatePath('/admin/share-links');
  return { ok: true, message: `Created: ${SITE_URL}/r/${token}` };
}

export async function revokeShareLink(form: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('share_links').update({ revoked: true }).eq('id', String(form.get('id')));
  revalidatePath('/admin/share-links');
}

// ── File uploads (profile photo, resume, screenshots) ──────────────────────
const UPLOAD_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

export async function uploadAsset(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: 'Choose a file first.' };
  const ext = UPLOAD_TYPES[file.type];
  if (!ext) return { ok: false, message: 'Only PNG, JPG, WebP or PDF files.' };
  if (file.size > 10 * 1024 * 1024) return { ok: false, message: 'Files must be under 10 MB.' };

  const path = `${new Date().toISOString().slice(0, 10)}/${randomBytes(8).toString('hex')}.${ext}`;
  const { error } = await supabase.storage.from('portfolio-assets').upload(path, file, { contentType: file.type });
  if (error) return { ok: false, message: 'Upload failed.' };
  const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
  return { ok: true, message: data.publicUrl };
}

// ── Auth ───────────────────────────────────────────────────────────────────
export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut({ scope: 'global' });
  redirect('/admin/login');
}
