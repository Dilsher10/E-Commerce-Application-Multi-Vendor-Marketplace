'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VendorRegistration() {
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData(formElement);

    if (password !== formData.get('confirmPassword')) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          storeName,
          email,
          password,
          phone: formData.get('phone'),
          businessType: formData.get('businessType'),
          category: formData.get('category'),
          address: formData.get('address'),
          city: formData.get('city'),
          state: formData.get('state'),
          postalCode: formData.get('postalCode'),
          country: formData.get('country'),
          role: 'vendor',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setSuccess('Registration submitted. You can sign in after an admin approves your vendor account.');
      formElement.reset();
      setName('');
      setStoreName('');
      setEmail('');
      setPassword('');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-16 flex justify-center items-center vendorForm" style={{ minHeight: '80vh' }}>
      <div className="glass-card w-full animate-fade-in">
        <h2 className="text-center mb-10">Create a Vendor Account</h2>

        {error && (
          <div className="mb-4 p-3 rounded bg-danger" style={{ color: 'white' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded bg-green-600" style={{ color: 'white' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-muted">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block mb-2 text-muted">Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(event) => setStoreName(event.target.value)}
                placeholder="Tech Haven"
              />
            </div>

            <div>
              <label className="block mb-2 text-muted">Business Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-muted">Phone Number</label>
              <input name="phone" type="tel" autoComplete="tel" placeholder="+92 300 1234567" required />
            </div>

            <div>
              <label className="block mb-2 text-muted">Business Type</label>
              <select name="businessType" defaultValue="" required>
                <option value="" disabled>Select type</option>
                <option value="Individual">Individual</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Company">Company</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-muted">Category</label>
              <select name="category" defaultValue="" required>
                <option value="" disabled>Select category</option>
                <option value="Electronics & Tech">Electronics & Tech</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-muted">Street Address</label>
              <input name="address" type="text" autoComplete="street-address" placeholder="House, street, or building" required />
            </div>

            <div>
              <label className="block mb-2 text-muted">City</label>
              <input name="city" type="text" autoComplete="address-level2" placeholder="Lahore" required />
            </div>
            <div>
              <label className="block mb-2 text-muted">State / Province</label>
              <input name="state" type="text" autoComplete="address-level1" placeholder="Punjab" required />
            </div>

            <div>
              <label className="block mb-2 text-muted">Postal Code</label>
              <input name="postalCode" type="text" autoComplete="postal-code" placeholder="54000" required />
            </div>
            <div>
              <label className="block mb-2 text-muted">Country</label>
              <input name="country" type="text" autoComplete="country-name" placeholder="Pakistan" required />
            </div>

            <div>
              <label className="block mb-2 text-muted">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="block mb-2 text-muted">Confirm Password</label>
              <input name="confirmPassword" type="password" required minLength={8} placeholder="Enter password again" />
            </div>

          </div>

          <label className="flex items-start gap-3 text-sm text-muted checkbox">
            <input name="terms" type="checkbox" required />
            <span>I agree to the Vendor Agreement and Privacy Policy.</span>
          </label>

          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Register as Vendor'}
          </button>
        </form>

        <div className="flex justify-between pt-7">
          <p className="text-muted">
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--primary-color)' }}>
              Sign In
            </Link>
          </p>

          <p className="text-muted text-sm">
            Shopping instead?{' '}
            <Link href="/auth/register" style={{ color: 'var(--secondary-color)' }}>
              Create a User Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
