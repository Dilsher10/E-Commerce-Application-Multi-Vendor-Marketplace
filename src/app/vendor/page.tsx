import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

export default async function VendorPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const session = token ? verifyToken(token) : null;

  if (session && typeof session !== 'string' && session.role === 'vendor') {
    redirect('/vendor/dashboard');
  }

  redirect('/auth/login');
}
