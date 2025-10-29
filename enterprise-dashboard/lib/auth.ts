import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'dev_secret_change_me'
);

export type Role = 'admin' | 'user';
export interface SessionPayload extends JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}

export async function signSession(
  payload: Omit<SessionPayload, 'iat' | 'exp' | 'nbf' | 'iss' | 'aud'>
) {
  const token = await new SignJWT(payload as SessionPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET);
  return token;
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as SessionPayload;
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get('token')?.value;
  if (!token) return null;
  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}
