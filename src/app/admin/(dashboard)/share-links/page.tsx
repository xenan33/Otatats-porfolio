import ShareLinkForm from '@/components/admin/ShareLinkForm';
import { requireAdmin } from '@/lib/admin/auth';
import { SITE_URL } from '@/lib/env';
import { revokeShareLink } from '../../actions';

export default async function ShareLinksPage() {
  const { supabase } = await requireAdmin();
  const { data: links } = await supabase.from('share_links').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Recruiter share links</h1>
        <p className="mt-1 text-sm text-muted">A private link per recruiter or company. You can see how often each one is opened and turn it off any time.</p>
      </div>
      <div className="rounded-xl border border-line bg-surface p-5">
        <ShareLinkForm />
      </div>
      <ul className="space-y-3">
        {links?.map((l) => {
          const expired = l.expires_at && new Date(l.expires_at) < new Date();
          const active = !l.revoked && !expired;
          return (
            <li key={l.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">{l.label}</p>
                <p className={`font-mono text-xs ${active ? 'text-accent' : 'text-muted'}`}>{l.revoked ? 'revoked' : expired ? 'expired' : 'active'}</p>
              </div>
              {active && <p className="mt-2 break-all font-mono text-xs text-muted">{`${SITE_URL}/r/${l.token}`}</p>}
              <p className="mt-2 text-sm text-muted">
                {l.views} view{l.views === 1 ? '' : 's'}
                {l.last_viewed_at && ` · last ${new Date(l.last_viewed_at).toLocaleString('en-GB', { timeZone: 'Asia/Manila' })}`}
                {l.reveal_phone && ' · shows phone'}
                {l.expires_at && ` · expires ${new Date(l.expires_at).toLocaleDateString('en-GB')}`}
              </p>
              {active && (
                <form action={revokeShareLink} className="mt-3">
                  <input type="hidden" name="id" value={l.id} />
                  <button type="submit" className="text-sm text-danger hover:underline">
                    Revoke
                  </button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
