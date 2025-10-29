import { cookies } from 'next/headers';

export async function GET() {
  const store = await cookies();
  store.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return new Response(null, { status: 302, headers: { Location: '/login' } });
}
