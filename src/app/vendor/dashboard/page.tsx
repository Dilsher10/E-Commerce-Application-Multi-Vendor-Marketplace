'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Product Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'vendor') {
      router.push('/');
      return;
    }
    
    setUser(parsedUser);
    fetchMyProducts(parsedUser.id);
  }, [router]);

  const fetchMyProducts = async (vendorId: string) => {
    try {
      const res = await fetch(`/api/products?vendor=${vendorId}`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('stock', stock);
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage('Product added successfully!');
      // Reset form
      setTitle(''); setDescription(''); setPrice(''); setCategory(''); setStock(''); setImage(null);
      // Refresh products
      fetchMyProducts(user.id);
    } catch (err: any) {
      setMessage(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="container py-16 text-center">Loading...</div>;

  return (
    <div className="container py-16">
      <div className="flex justify-between items-center mb-8">
        <h1>Vendor Dashboard</h1>
        <button onClick={() => { localStorage.clear(); router.push('/auth/login'); }} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Product Form */}
        <div className="glass-card lg:col-span-1">
          <h3>Add New Product</h3>
          {message && <div className="mb-4 p-2 bg-primary rounded text-sm text-center" style={{ color: 'white' }}>{message}</div>}
          
          <form onSubmit={handleAddProduct} className="flex flex-col gap-4 mt-4">
            <div>
              <label className="block mb-1 text-muted text-sm">Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 text-muted text-sm">Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-muted text-sm">Price ($)</label>
                <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-muted text-sm">Stock</label>
                <input type="number" required value={stock} onChange={e => setStock(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-muted text-sm">Category</label>
              <select required value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select...</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-muted text-sm">Product Image</label>
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Adding...' : 'Publish Product'}
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2">
          <h3>Your Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {products.length === 0 ? (
              <p className="text-muted">You haven't added any products yet.</p>
            ) : (
              products.map((p: any) => (
                <div key={p._id} className="glass-card flex gap-4" style={{ padding: '1rem' }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="rounded object-cover" style={{ width: '80px', height: '80px' }} />
                  ) : (
                    <div className="rounded bg-surface-hover flex justify-center items-center" style={{ width: '80px', height: '80px' }}>No Img</div>
                  )}
                  <div>
                    <h4 className="mb-1" style={{ fontSize: '1.1rem' }}>{p.title}</h4>
                    <p className="text-primary mb-1 font-bold">${p.price}</p>
                    <span className="badge badge-primary">{p.category}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
