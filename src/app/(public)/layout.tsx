import CopyGuard from '@/components/site/CopyGuard';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CopyGuard />
      {children}
    </>
  );
}
