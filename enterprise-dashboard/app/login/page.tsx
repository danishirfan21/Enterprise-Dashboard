'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@acme.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const qp = useSearchParams();
  const forbidden = qp.get('error') === 'forbidden';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-24 card card-pad">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      {forbidden && (
        <div className="mb-3 text-amber-300 text-sm">
          Access denied for that page.
        </div>
      )}
      {error && <div className="mb-3 text-rose-300 text-sm">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        <button disabled={loading} className="btn w-full">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="text-xs text-slate-400">
          Try admin@acme.com / admin123 (admin) or user@acme.com / user123
          (user).
        </p>
      </form>
    </div>
  );
}
