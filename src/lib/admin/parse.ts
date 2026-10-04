import type { TableConfig } from '@/lib/admin/tables';

// Turns a submitted form into a row for the configured table. Only configured
// fields are read, so a crafted form can't write other columns.
export function parseRow(config: TableConfig, form: FormData) {
  const row: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const field of config.fields) {
    const raw = form.get(field.name);
    const text = typeof raw === 'string' ? raw.trim() : '';

    switch (field.type) {
      case 'boolean':
        row[field.name] = raw === 'on';
        continue;
      case 'number':
        if (text === '') row[field.name] = field.name === 'sort_order' ? 0 : null;
        else if (Number.isFinite(Number(text))) row[field.name] = Math.trunc(Number(text));
        else errors.push(`${field.label} must be a number`);
        continue;
      case 'tags':
        row[field.name] = text ? text.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 20) : [];
        continue;
      case 'url':
        if (text && !/^https:\/\/[^\s]+$/i.test(text)) errors.push(`${field.label} must start with https://`);
        break;
      case 'email':
        if (text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) errors.push(`${field.label} is not a valid email`);
        break;
      case 'date':
        if (text && !/^\d{4}-\d{2}-\d{2}$/.test(text)) errors.push(`${field.label} must be a date`);
        break;
      case 'select':
        if (field.options && !field.options.some((o) => o.value === text)) errors.push(`${field.label} has an invalid choice`);
        break;
    }

    if (field.required && !text) errors.push(`${field.label} is required`);
    if (text.length > 10000) errors.push(`${field.label} is too long`);
    row[field.name] = text === '' ? null : text;
  }

  if (config.table === 'projects' && typeof row.slug === 'string' && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(row.slug)) {
    errors.push('URL slug must be lowercase letters, numbers and dashes');
  }
  if (config.table === 'experience' && row.current) row.end_date = null;

  return { row, errors };
}
