'use client';

import { useActionState } from 'react';
import { uploadAsset, type ActionResult } from '@/app/admin/actions';
import { inputClass } from './RowForm';

export default function UploadForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(uploadAsset, null);
  return (
    <form action={action} className="space-y-3">
      <input type="file" name="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="block text-sm text-muted" />
      <button type="submit" disabled={pending} className="rounded-md border border-accent/60 px-3 py-1.5 text-sm text-accent disabled:opacity-50">
        {pending ? 'Uploading…' : 'Upload'}
      </button>
      {state &&
        (state.ok ? (
          <div>
            <p className="mb-1 text-xs text-muted">Uploaded. Copy this link into a URL field:</p>
            <input readOnly value={state.message} className={inputClass} onFocus={(e) => e.currentTarget.select()} />
          </div>
        ) : (
          <p className="text-sm text-danger">{state.message}</p>
        ))}
    </form>
  );
}
