'use client';

import { useActionState } from 'react';
import { saveRow, type ActionResult } from '@/app/admin/actions';
import type { Field, TableConfig } from '@/lib/admin/tables';

export const inputClass =
  'w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none';

type Row = Record<string, unknown>;

function FieldInput({ field, value }: { field: Field; value: unknown }) {
  const str = value === null || value === undefined ? '' : String(value);
  switch (field.type) {
    case 'textarea':
      return <textarea name={field.name} defaultValue={str} rows={field.name === 'description' || field.name === 'bio' ? 6 : 3} className={inputClass} />;
    case 'boolean':
      return <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} className="h-4 w-4 accent-[var(--accent)]" />;
    case 'select':
      return (
        <select name={field.name} defaultValue={str} className={inputClass}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case 'tags':
      return <input name={field.name} defaultValue={Array.isArray(value) ? value.join(', ') : ''} className={inputClass} />;
    case 'date':
      return <input type="date" name={field.name} defaultValue={str} className={inputClass} />;
    case 'number':
      return <input type="number" name={field.name} defaultValue={str} className={inputClass} />;
    default:
      return <input type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'} name={field.name} defaultValue={str} className={inputClass} />;
  }
}

export default function RowForm({ config, row, submitLabel = 'Save' }: { config: TableConfig; row?: Row; submitLabel?: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(saveRow, null);
  const id = row?.[config.key];

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="_table" value={config.table} />
      <input type="hidden" name="_id" value={id === undefined || id === null ? '' : String(id)} />
      <div className="grid gap-4 sm:grid-cols-2">
        {config.fields.map((field) => (
          <label
            key={field.name}
            className={`block ${field.type === 'textarea' ? 'sm:col-span-2' : ''} ${field.type === 'boolean' ? 'flex items-center gap-3' : ''}`}
          >
            {field.type === 'boolean' ? (
              <>
                <FieldInput field={field} value={row?.[field.name]} />
                <span className="text-sm">{field.label}</span>
              </>
            ) : (
              <>
                <span className="mb-1 block text-xs text-muted">
                  {field.label}
                  {field.required && <span className="text-danger"> *</span>}
                </span>
                <FieldInput field={field} value={row?.[field.name]} />
                {field.help && <span className="mt-1 block text-[11px] text-muted/80">{field.help}</span>}
              </>
            )}
          </label>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg disabled:opacity-50">
          {pending ? 'Saving…' : submitLabel}
        </button>
        {state && <p className={`text-sm ${state.ok ? 'text-accent' : 'text-danger'}`}>{state.message}</p>}
      </div>
    </form>
  );
}
