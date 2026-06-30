'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth/login';
          return;
        }

        const res = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container py-16">
      <h1 className="mb-8">Order History & Tracking</h1>
      
      {loading ? (
        <div className="flex justify-center py-16"><div className="loader"></div></div>
      ) : orders.length === 0 ? (
        <div className="glass-card text-center py-16">
          <p className="text-muted mb-4">You have no orders yet.</p>
          <Link href="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order: any) => (
            <div key={order._id} className="glass-card">
              <div className="flex justify-between items-center mb-4 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <p className="text-sm text-muted mb-1">Order ID: {order._id}</p>
                  <p className="text-sm text-muted">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${order.status === 'pending' ? 'badge-primary' : 'badge-success'}`}>
                    {order.status.toUpperCase()}
                  </span>
                  <p className="font-bold mt-2">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.title} className="rounded object-cover" style={{ width: '60px', height: '60px' }} />
                    ) : (
                      <div className="rounded bg-surface-hover flex justify-center items-center" style={{ width: '60px', height: '60px' }}>Img</div>
                    )}
                    <div>
                      <h4 style={{ fontSize: '1rem' }}>{item.product?.title || 'Product removed'}</h4>
                      <p className="text-muted text-sm">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
