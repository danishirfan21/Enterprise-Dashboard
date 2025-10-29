import { NextRequest } from 'next/server';
import { z } from 'zod';
import { signSession } from '@/lib/auth';
import { cookies } from 'next/headers';

const users = [
  {
    email: 'admin@acme.com',
    password: 'admin123',
    name: 'Alex Admin',
    role: 'admin' as const,
  },
  {
    email: 'user@acme.com',
    password: 'user123',
    name: 'Uma User',
    role: 'user' as const,
  },
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = z
    .object({ email: z.string().email(), password: z.string().min(3) })
    .safeParse(body);
  if (!parsed.success)
    return Response.json({ message: 'Invalid payload' }, { status: 400 });
  const match = users.find(
    (u) => u.email === parsed.data.email && u.password === parsed.data.password
  );
  if (!match)
    return Response.json({ message: 'Invalid credentials' }, { status: 401 });
  const token = await signSession({
    sub: match.email,
    email: match.email,
    name: match.name,
    role: match.role,
  });
  const store = await cookies();
  store.set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2,
  });
  return Response.json({
    ok: true,
    user: { email: match.email, name: match.name, role: match.role },
  });
}
