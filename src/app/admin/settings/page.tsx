import { Bell, CreditCard, LockKeyhole, Save, ShieldCheck, Store, Truck, Users } from 'lucide-react';

const settingsSections = [
  {
    title: 'Marketplace',
    description: 'Control storefront defaults and vendor onboarding behavior.',
    icon: Store,
    fields: [
      { label: 'Marketplace Name', value: 'Lumina Marketplace', type: 'text' },
      { label: 'Support Email', value: 'support@lumina.test', type: 'email' },
    ],
    toggles: [
      { label: 'Allow new vendor registrations', checked: true },
      { label: 'Require admin approval for vendors', checked: true },
    ],
  },
  {
    title: 'Payments',
    description: 'Set payout and transaction preferences.',
    icon: CreditCard,
    fields: [
      { label: 'Platform Fee (%)', value: '8', type: 'number' },
      { label: 'Payout Hold Days', value: '7', type: 'number' },
    ],
    toggles: [
      { label: 'Enable Stripe checkout', checked: true },
      { label: 'Auto-release vendor payouts', checked: false },
    ],
  },
  {
    title: 'Orders',
    description: 'Configure fulfillment and customer notification defaults.',
    icon: Truck,
    fields: [
      { label: 'Default Shipping Window', value: '3-5 business days', type: 'text' },
      { label: 'Return Window Days', value: '14', type: 'number' },
    ],
    toggles: [
      { label: 'Notify admins for new orders', checked: true },
      { label: 'Allow customer cancellations before shipment', checked: true },
    ],
  },
  {
    title: 'Security',
    description: 'Protect administrator and vendor access.',
    icon: LockKeyhole,
    fields: [
      { label: 'Session Duration Days', value: '7', type: 'number' },
      { label: 'Minimum Password Length', value: '8', type: 'number' },
    ],
    toggles: [
      { label: 'Block banned accounts at login', checked: true },
      { label: 'Require strong passwords', checked: true },
    ],
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] m-0">Settings</h1>
          <p className="text-muted mt-1 text-sm">Manage marketplace configuration and operational defaults.</p>
        </div>
        <button type="button" className="btn bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] w-full sm:w-auto">
          <Save size={18} />
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {settingsSections.map((section) => (
            <section key={section.title} className="bg-white border border-[var(--border-color)] rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 rounded-lg bg-blue-50 text-[var(--primary-color)] flex items-center justify-center flex-shrink-0">
                  <section.icon size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold m-0">{section.title}</h2>
                  <p className="text-sm text-muted m-0">{section.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <label className="block mb-2 text-sm font-semibold text-[var(--text-main)]">{field.label}</label>
                    <input type={field.type} defaultValue={field.value} />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {section.toggles.map((toggle) => (
                  <label key={toggle.label} className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] px-4 py-3">
                    <span className="text-sm font-semibold text-[var(--text-main)]">{toggle.label}</span>
                    <input type="checkbox" defaultChecked={toggle.checked} className="w-5 h-5" />
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="flex flex-col gap-6">
          <section className="bg-white border border-[var(--border-color)] rounded-lg p-6 shadow-sm">
            <div className="w-11 h-11 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4">
              <ShieldCheck size={22} />
            </div>
            <h2 className="text-lg font-bold mb-2">System Status</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Vendor approvals</span>
                <span className="font-bold text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Checkout</span>
                <span className="font-bold text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Account bans</span>
                <span className="font-bold text-green-600">Enforced</span>
              </div>
            </div>
          </section>

          <section className="bg-white border border-[var(--border-color)] rounded-lg p-6 shadow-sm">
            <div className="w-11 h-11 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
              <Bell size={22} />
            </div>
            <h2 className="text-lg font-bold mb-2">Admin Notifications</h2>
            <label className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] px-4 py-3 mb-3">
              <span className="text-sm font-semibold text-[var(--text-main)]">New vendor requests</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] px-4 py-3">
              <span className="text-sm font-semibold text-[var(--text-main)]">High value orders</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
          </section>

          <section className="bg-white border border-[var(--border-color)] rounded-lg p-6 shadow-sm">
            <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Users size={22} />
            </div>
            <h2 className="text-lg font-bold mb-2">Access Notes</h2>
            <p className="text-sm text-muted m-0">Settings UI is ready for persistence. Current controls are local form fields until a settings model or API is added.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
