import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Mail, ShieldCheck, UserRound } from 'lucide-react';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { User } from '@/models/User';

type AdminSession = {
  id: string;
  role: 'admin';
};

type AdminProfile = {
  name: string;
  email: string;
  accountStatus?: 'active' | 'banned';
  createdAt?: Date;
};

function isAdminSession(session: unknown): session is AdminSession {
  if (typeof session !== 'object' || session === null) return false;
  const value = session as Record<string, unknown>;
  return value.role === 'admin' && typeof value.id === 'string';
}

async function getAdminProfile(adminId: string) {
  await dbConnect();
  const admin = await User.findById(adminId).select('name email accountStatus createdAt').lean();
  return admin as unknown as AdminProfile | null;
}

function formatDate(date?: Date) {
  if (!date) return 'No date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const session = token ? verifyToken(token) : null;

  if (!isAdminSession(session)) {
    redirect('/auth/login');
  }

  const admin = await getAdminProfile(session.id);
  const adminName = admin?.name || 'Admin';
  const adminEmail = admin?.email || 'No email';
  const accountStatus = admin?.accountStatus || 'active';

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Profile</h1>
        <p className="text-muted mt-1 text-sm">Review your administrator account details.</p>
      </div>

      <section className="bg-white rounded-lg border border-[var(--border-color)] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-extrabold text-xl">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">{adminName}</h2>
            <p className="text-sm text-muted m-0">Administrator account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ProfileField icon={Mail} label="Email" value={adminEmail} />
          <ProfileField icon={ShieldCheck} label="Status" value={accountStatus} />
          <ProfileField icon={UserRound} label="Joined" value={formatDate(admin?.createdAt)} />
        </div>
      </section>
    </div>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] p-4">
      <Icon size={18} className="text-[#2563eb] mb-3" />
      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">{label}</p>
      <p className="font-semibold text-[var(--text-main)] m-0">{value}</p>
    </div>
  );
}
