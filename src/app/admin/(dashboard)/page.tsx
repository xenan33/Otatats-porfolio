import Link from 'next/link';
import UploadForm from '@/components/admin/UploadForm';
import { requireAdmin } from '@/lib/admin/auth';

const COUNTED = ['skills', 'experience', 'certifications', 'projects'] as const;

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const counts = await Promise.all(
    COUNTED.map(async (t) => [t, (await supabase.from(t).select('id', { count: 'exact', head: true })).count ?? 0] as const),
  );
  const { count: unread } = await supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false);
  const { data: audit } = await supabase.from('audit_log').select('table_name, action, at').order('at', { ascending: false }).limit(8);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {counts.map(([t, n]) => (
          <Link key={t} href={`/admin/${t}`} className="rounded-xl border border-line bg-surface p-4 hover:border-accent/50">
            <p className="font-mono text-2xl text-accent">{n}</p>
            <p className="text-sm capitalize text-muted">{t}</p>
          </Link>
        ))}
        <Link href="/admin/messages" className="rounded-xl border border-line bg-surface p-4 hover:border-accent/50">
          <p className="font-mono text-2xl text-accent">{unread ?? 0}</p>
          <p className="text-sm text-muted">unread messages</p>
        </Link>
      </div>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="font-semibold">Upload a file</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Profile photo, resume PDF or project screenshot (PNG, JPG, WebP, PDF, max 10 MB).</p>
        <UploadForm />
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="font-semibold">Recent changes</h2>
        <ul className="mt-3 space-y-1 font-mono text-xs text-muted">
          {(audit ?? []).map((a, i) => (
            <li key={i}>
              {new Date(a.at).toLocaleString('en-GB', { timeZone: 'Asia/Manila' })} · {a.action.toLowerCase()} · {a.table_name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
