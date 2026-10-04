import { requireAdmin } from '@/lib/admin/auth';
import { deleteMessage, setMessageRead } from '../../actions';

export default async function MessagesPage() {
  const { supabase } = await requireAdmin();
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('id, name, email, company, message, is_read, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Messages</h1>
      {!messages?.length && <p className="text-sm text-muted">No messages yet.</p>}
      <ul className="space-y-3">
        {messages?.map((m) => (
          <li key={m.id} className={`rounded-xl border bg-surface p-5 ${m.is_read ? 'border-line' : 'border-accent/50'}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium">
                {m.name} <span className="text-sm font-normal text-muted">&lt;{m.email}&gt;</span>
                {m.company && <span className="text-sm font-normal text-muted"> · {m.company}</span>}
              </p>
              <p className="font-mono text-xs text-muted">{new Date(m.created_at).toLocaleString('en-GB', { timeZone: 'Asia/Manila' })}</p>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-ink/90">{m.message}</p>
            <div className="mt-4 flex gap-4 text-sm">
              <a href={`mailto:${m.email}`} className="text-accent hover:underline">
                Reply
              </a>
              <form action={setMessageRead}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="read" value={String(!m.is_read)} />
                <button type="submit" className="text-muted hover:text-ink">
                  Mark as {m.is_read ? 'unread' : 'read'}
                </button>
              </form>
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={m.id} />
                <button type="submit" className="text-danger hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
