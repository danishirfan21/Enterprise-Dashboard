'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Sidebar({ role }: { role: 'admin' | 'user' }) {
  const pathname = usePathname();
  const Item = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={clsx(
        'block px-4 py-2 rounded hover:bg-slate-700/40',
        pathname === href && 'bg-slate-700/50'
      )}
    >
      {label}
    </Link>
  );
  return (
    <aside className="hidden md:block w-60 p-4 border-r border-slate-800">
      <div className="font-semibold mb-2 text-slate-300">Navigation</div>
      <nav className="space-y-1">
        <Item href="/dashboard" label="Dashboard" />
        <Item href="/incidents" label="Incidents" />
        {role === 'admin' && <Item href="/admin/users" label="Users (Admin)" />}
      </nav>
      <div className="mt-6 text-xs text-slate-400">v1.0 • App Router • JWT</div>
    </aside>
  );
}
