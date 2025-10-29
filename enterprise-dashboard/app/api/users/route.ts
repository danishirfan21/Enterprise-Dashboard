import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'dev_secret_change_me'
);

export async function GET() {
  const store = await cookies();
  const token = store.get('token')?.value;
  if (!token) return new Response('Unauthorized', { status: 401 });
  const { payload } = await jwtVerify(token, SECRET);
  if ((payload as any).role !== 'admin')
    return new Response('Forbidden', { status: 403 });

  const users = [
    { name: 'Alex Admin', email: 'admin@acme.com', role: 'admin' },
    { name: 'Uma User', email: 'user@acme.com', role: 'user' },
    { name: 'Evan Engineer', email: 'evan@acme.com', role: 'user' },
  ];
  return Response.json({ users });
}
