import 'server-only';
import { createServiceClient } from '@/lib/supabase/service';

export async function getPhone(): Promise<string | null> {
  const db = createServiceClient();
  if (!db) return null;
  const { data } = await db.from('profile_private').select('phone').order('profile_id').limit(1).maybeSingle();
  return data?.phone ?? null;
}

// Resolves a recruiter share link and records the view. Returns null when the
// link is unknown, revoked or expired.
export async function openShareLink(token: string) {
  const db = createServiceClient();
  if (!db || !/^[A-Za-z0-9_-]{24,64}$/.test(token)) return null;
  const { data: link } = await db.from('share_links').select('*').eq('token', token).maybeSingle();
  if (!link || link.revoked || (link.expires_at && new Date(link.expires_at) < new Date())) return null;
  await db
    .from('share_links')
    .update({ views: link.views + 1, last_viewed_at: new Date().toISOString() })
    .eq('id', link.id);
  return { label: link.label as string, revealPhone: Boolean(link.reveal_phone) };
}
