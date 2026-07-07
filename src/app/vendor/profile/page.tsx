import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Mail, MapPin, Phone, Store, UserRound } from 'lucide-react';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { User } from '@/models/User';

type VendorSession = {
  id: string;
  role: 'vendor';
};

type VendorProfile = {
  name: string;
  email: string;
  vendorDetails?: {
    storeName?: string;
    description?: string;
    phone?: string;
    businessType?: string;
    category?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isApproved?: boolean;
  };
};

function isVendorSession(session: unknown): session is VendorSession {
  if (typeof session !== 'object' || session === null) return false;
  const value = session as Record<string, unknown>;
  return value.role === 'vendor' && typeof value.id === 'string';
}

async function getVendorProfile(vendorId: string) {
  await dbConnect();
  const vendor = await User.findById(vendorId).select('name email vendorDetails').lean();
  return vendor as unknown as VendorProfile | null;
}

export default async function VendorProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const session = token ? verifyToken(token) : null;

  if (!isVendorSession(session)) {
    redirect('/auth/login');
  }

  const vendor = await getVendorProfile(session.id);
  const details = vendor?.vendorDetails;
  const storeName = details?.storeName || vendor?.name || 'Vendor Store';
  const location = [details?.city, details?.state, details?.country].filter(Boolean).join(', ') || 'No location added';

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Profile</h1>
        <p className="text-muted mt-1 text-sm">Review your vendor account and store information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <section className="bg-white rounded-lg border border-[var(--border-color)] p-6 shadow-sm">
          <div className="w-16 h-16 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-extrabold text-xl mb-4">
            {storeName.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold mb-1">{storeName}</h2>
          <p className="text-sm text-muted mb-4">{details?.isApproved ? 'Approved vendor account' : 'Pending approval'}</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <UserRound size={17} className="text-[#2563eb]" />
              <span className="font-semibold text-[var(--text-main)]">{vendor?.name || 'Vendor'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={17} className="text-[#2563eb]" />
              <span className="text-muted">{vendor?.email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={17} className="text-[#2563eb]" />
              <span className="text-muted">{details?.phone || 'No phone added'}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={17} className="text-[#2563eb]" />
              <span className="text-muted">{location}</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-[var(--border-color)] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Store size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold m-0">Store Details</h2>
              <p className="text-sm text-muted m-0">Information submitted during vendor registration.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfileField label="Business Type" value={details?.businessType || 'Not added'} />
            <ProfileField label="Category" value={details?.category || 'Not added'} />
            <ProfileField label="Address" value={details?.address || 'Not added'} />
            <ProfileField label="Postal Code" value={details?.postalCode || 'Not added'} />
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-[var(--text-main)] mb-2">Description</p>
            <p className="text-sm text-muted rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] p-4 m-0">
              {details?.description || 'No store description added yet.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">{label}</p>
      <p className="font-semibold text-[var(--text-main)] m-0">{value}</p>
    </div>
  );
}
