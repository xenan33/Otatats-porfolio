import { notFound } from 'next/navigation';
import RowForm from '@/components/admin/RowForm';
import { requireAdmin } from '@/lib/admin/auth';
import { TABLES, type TableConfig } from '@/lib/admin/tables';
import { deleteRow } from '../../actions';

const ROUTES: Record<string, string> = {
  profile: 'profile',
  skills: 'skills',
  experience: 'experience',
  certifications: 'certifications',
  education: 'education',
  projects: 'projects',
  settings: 'site_settings',
};

type Row = Record<string, unknown>;

async function loadRows(config: TableConfig) {
  const { supabase } = await requireAdmin();
  let query = supabase.from(config.table).select('*');
  for (const o of config.order) query = query.order(o.column, { ascending: o.ascending ?? true });
  const { data } = await query;
  return (data ?? []) as Row[];
}

export default async function SectionPage({ params }: PageProps<'/admin/[section]'>) {
  const { section } = await params;
  const table = ROUTES[section];
  if (!table) notFound();
  const config = TABLES[table];
  const rows = await loadRows(config);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{config.title}</h1>
        <p className="mt-1 text-sm text-muted">{config.description}</p>
      </div>

      {config.singleton ? (
        <div className="rounded-xl border border-line bg-surface p-5">
          <RowForm config={config} row={rows[0]} />
        </div>
      ) : (
        <>
          <details className="rounded-xl border border-dashed border-accent/50 bg-surface p-5">
            <summary className="cursor-pointer text-sm font-semibold text-accent">+ Add new</summary>
            <div className="mt-4">
              <RowForm config={config} row={{ is_published: true, sort_order: rows.length + 1 }} submitLabel="Add" />
            </div>
          </details>
          <ul className="space-y-3">
            {rows.map((row) => (
              <li key={String(row[config.key])}>
                <details className="rounded-xl border border-line bg-surface p-5">
                  <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-medium">{String(row[config.titleField] ?? '(untitled)')}</span>
                    {config.subtitleField && row[config.subtitleField] ? (
                      <span className="text-sm text-muted">{String(row[config.subtitleField])}</span>
                    ) : null}
                    {row.is_published === false && <span className="rounded bg-surface-2 px-2 text-xs text-muted">hidden</span>}
                  </summary>
                  <div className="mt-4 space-y-4">
                    <RowForm config={config} row={row} />
                    <form action={deleteRow} className="border-t border-line pt-4">
                      <input type="hidden" name="_table" value={config.table} />
                      <input type="hidden" name="_id" value={String(row[config.key])} />
                      <button type="submit" className="text-sm text-danger hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </>
      )}

      {section === 'profile' && <PrivateContact />}
    </div>
  );
}

async function PrivateContact() {
  const config = TABLES.profile_private;
  const rows = await loadRows(config);
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h2 className="font-semibold">{config.title}</h2>
      <p className="mb-4 mt-1 text-sm text-muted">{config.description}</p>
      <RowForm config={config} row={rows[0]} />
    </div>
  );
}
