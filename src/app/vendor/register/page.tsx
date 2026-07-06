import Link from 'next/link';
import { Store, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Globe } from 'lucide-react';

export default function VendorRegistration() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-[var(--bg-color)] animate-fade-in">
      <div className="w-full p-8 md:p-16 lg:p-24 flex items-center justify-center bg-white relative">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">Apply as a Vendor</h2>
            <p className="text-muted">Enter your business details to get started.</p>
          </div>

          <form className="space-y-5" action="/vendor/dashboard">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text-main)]">First Name</label>
                <input type="text" placeholder="John" className="w-full px-4 py-3 bg-gray-50 border border-[var(--border-color)] rounded-xl outline-none focus:border-[var(--primary-color)] focus:bg-white transition-colors" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text-main)]">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full px-4 py-3 bg-gray-50 border border-[var(--border-color)] rounded-xl outline-none focus:border-[var(--primary-color)] focus:bg-white transition-colors" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)]">Business/Store Name</label>
              <input type="text" placeholder="Tech Haven Ltd." className="w-full px-4 py-3 bg-gray-50 border border-[var(--border-color)] rounded-xl outline-none focus:border-[var(--primary-color)] focus:bg-white transition-colors" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)]">Business Email</label>
              <input type="email" placeholder="contact@techhaven.com" className="w-full px-4 py-3 bg-gray-50 border border-[var(--border-color)] rounded-xl outline-none focus:border-[var(--primary-color)] focus:bg-white transition-colors" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)]">Primary Category</label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-gray-50 border border-[var(--border-color)] rounded-xl outline-none focus:border-[var(--primary-color)] focus:bg-white transition-colors appearance-none cursor-pointer" required>
                  <option value="" disabled selected>Select a category...</option>
                  <option value="electronics">Electronics & Tech</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="home">Home & Living</option>
                  <option value="health">Health & Beauty</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-main)]">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-[var(--border-color)] rounded-xl outline-none focus:border-[var(--primary-color)] focus:bg-white transition-colors" required />
            </div>

            <div className="flex items-start gap-3 mt-6">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" required />
              <label htmlFor="terms" className="text-sm text-muted leading-relaxed">
                I agree to the Lumina <a href="#" className="text-[var(--primary-color)] font-semibold hover:underline">Vendor Agreement</a> and <a href="#" className="text-[var(--primary-color)] font-semibold hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button type="submit" className="w-full mt-6 bg-[var(--primary-color)] text-white py-3.5 rounded-xl font-bold text-base hover:bg-[var(--primary-hover)] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 group">
              Create Vendor Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted font-medium">
            Already have a vendor account? <Link href="/auth/login" className="text-[var(--primary-color)] font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
