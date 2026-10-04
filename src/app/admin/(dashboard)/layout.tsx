import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/auth';
import { signOut } from '../actions';

const NAV = [
  ['Dashboard', '/admin'],
  ['Profile', '/admin/profile'],
  ['Skills', '/admin/skills'],
  ['Experience', '/admin/experience'],
  ['Certifications', '/admin/certifications'],
  ['Education', '/admin/education'],
  ['Projects', '/admin/projects'],
  ['Messages', '/admin/messages'],
  ['Share links', '/admin/share-links'],
  ['Public settings', '/admin/settings'],
] as const;

export default async function DashboardLayout({ children }: LayoutProps<'/admin'>) {
  const { user } = await requireAdmin();
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row">
      <aside className="md:w-52 md:shrink-0">
        <p className="font-mono text-sm text-accent">otatats admin</p>
        <p className="mt-1 truncate text-xs text-muted">{user.email}</p>
        <nav className="mt-6 flex flex-wrap gap-2 md:flex-col md:gap-1">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-4 text-sm">
          <Link href="/" target="_blank" className="px-3 text-muted hover:text-ink">
            View public site ↗
          </Link>
          <form action={signOut}>
            <button type="submit" className="px-3 text-left text-muted hover:text-danger">
              Sign out everywhere
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
