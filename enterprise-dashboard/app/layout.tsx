import './globals.css';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Enterprise Dashboard',
  description: 'Admin panel demo (EHS-style)',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex">
          {session && <Sidebar role={session.role} />}
          <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl md:text-2xl font-semibold">
                Enterprise Dashboard
              </h1>
              <div className="text-sm text-slate-300">
                {session ? (
                  <div className="flex gap-3 items-center">
                    <span className="hidden sm:inline">
                      Signed in as {session.name} • {session.role}
                    </span>
                    <Link className="btn" href="/api/logout">
                      Logout
                    </Link>
                  </div>
                ) : (
                  <Link className="btn" href="/login">
                    Login
                  </Link>
                )}
              </div>
            </div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
