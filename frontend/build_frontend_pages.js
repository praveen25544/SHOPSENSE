const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ ' + filePath);
}

// ─── app/checkout/page.tsx ────────────────────────────────────────────────────
write('app/checkout/page.tsx', `'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearCart } from '../../store/cartSlice';
import api from '../../lib/axios';

export default function CheckoutPage() {
  const { items, total } = useAppSelector(s => s.cart);
  const user = useAppSelector(s => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    if (!user) router.push('/login?redirect=checkout');
    if (items.length === 0 && !success) router.push('/cart');
  }, [user, items, router, success]);

  const gst = Math.round(total * 0.18);
  const grandTotal = total + gst;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderItems = items.map(i => ({ product: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image }));
      const { data } = await api.post('/orders', { items: orderItems, shippingAddress: form, paymentMethod: 'COD' });
      setOrderId(data.data._id);
      setSuccess(true);
      dispatch(clearCart());
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 560, margin: '80px auto', padding: '0 40px', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 28, padding: '60px 48px', boxShadow: '0 0 60px rgba(74,222,128,0.1)' }}>
          <div style={{ fontSize: 72, marginBottom: 20, animation: 'bounce-in 0.6s forwards' }}>🎉</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, marginBottom: 12, color: '#4ade80' }}>Order Placed!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: 16 }}>Your order has been confirmed.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Order ID: <span style={{ color: 'var(--accent)', fontFamily: 'Syne' }}>{orderId.slice(-8).toUpperCase()}</span></p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/orders" className="btn-primary" style={{ padding: '12px 24px', borderRadius: 12, textDecoration: 'none', display: 'inline-block', fontSize: 15 }}>View Orders</a>
            <a href="/products" style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 15 }}>Continue Shopping</a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 40px' }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Checkout</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>Almost there! Fill in your delivery details.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          <form onSubmit={handleOrder}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 24 }}>Delivery Address</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { key: 'fullName', label: 'Full Name', placeholder: 'Praveen Kumar', col: 2 },
                  { key: 'phone', label: 'Phone Number', placeholder: '+91 9876543210', col: 1 },
                  { key: 'pincode', label: 'Pincode', placeholder: '412307', col: 1 },
                  { key: 'address', label: 'Address', placeholder: '123, Main Street', col: 2 },
                  { key: 'city', label: 'City', placeholder: 'Pune', col: 1 },
                  { key: 'state', label: 'State', placeholder: 'Maharashtra', col: 1 },
                ].map(field => (
                  <div key={field.key} style={{ gridColumn: \`span \${field.col}\` }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{field.label}</label>
                    <input className="input-field" placeholder={field.placeholder} value={form[field.key as keyof typeof form]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} required />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 32px', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Payment Method</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', border: '3px solid rgba(108,99,255,0.4)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Cash on Delivery</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pay when your order arrives</div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: 16, borderRadius: 14 }}>
              {loading ? 'Placing Order...' : \`Place Order · ₹\${grandTotal.toLocaleString('en-IN')}\`}
            </button>
          </form>

          {/* Summary */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px', position: 'sticky', top: 80 }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {items.map(item => (
                <div key={item.productId} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--bg-elevated)', overflow: 'hidden', flexShrink: 0 }}>
                    {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🛍</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>×{item.quantity}</div>
                  </div>
                  <div style={{ fontSize: 14, fontFamily: 'Syne', fontWeight: 700, flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }} />
            {[{ l: 'Subtotal', v: \`₹\${total.toLocaleString('en-IN')}\` }, { l: 'GST (18%)', v: \`₹\${gst.toLocaleString('en-IN')}\` }, { l: 'Shipping', v: 'Free', c: '#4ade80' }].map(row => (
              <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10 }}>
                <span>{row.l}</span><span style={{ color: row.c }}>{row.v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }}>
              <span>Total</span><span className="gradient-text">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

// ─── app/orders/page.tsx ──────────────────────────────────────────────────────
write('app/orders/page.tsx', `'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAppSelector } from '../../store/hooks';
import api from '../../lib/axios';

interface Order {
  _id: string;
  items: { name: string; price: number; quantity: number; image: string }[];
  grandTotal: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress: { fullName: string; city: string; state: string };
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  pending:   { color: '#ffd93d', bg: 'rgba(255,217,61,0.1)', icon: '⏳' },
  confirmed: { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', icon: '✓' },
  shipped:   { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', icon: '🚚' },
  delivered: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', icon: '✅' },
  cancelled: { color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', icon: '✕' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAppSelector(s => s.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push('/login?redirect=orders'); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data.data);
      } catch { setOrders([]); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, [user, router]);

  const handleCancel = async (orderId: string) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await api.patch(\`/orders/\${orderId}/cancel\`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch { alert('Failed to cancel order'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: 38, fontWeight: 800, marginBottom: 8 }}>My Orders</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 120, background: 'var(--bg-card)', borderRadius: 16, animation: 'shimmer 1.5s infinite' }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📦</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, marginBottom: 12 }}>No orders yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Start shopping to see your orders here</p>
            <a href="/products" className="btn-primary" style={{ padding: '12px 28px', borderRadius: 12, textDecoration: 'none', display: 'inline-block', fontSize: 15 }}>Shop Now →</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {orders.map((order, i) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <div key={order._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 28px', animation: 'slide-up 0.4s ease forwards', animationDelay: \`\${i * 0.08}s\`, opacity: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {order.shippingAddress?.city && \` · \${order.shippingAddress.city}, \${order.shippingAddress.state}\`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ background: status.bg, color: status.color, borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{status.icon}</span>
                        <span style={{ textTransform: 'capitalize' }}>{order.status}</span>
                      </div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18 }}>₹{order.grandTotal.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                    {order.items.slice(0, 4).map((item, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)', borderRadius: 10, padding: '8px 12px', fontSize: 13 }}>
                        {item.image && <img src={item.image} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />}
                        <span style={{ color: 'var(--text-secondary)' }}>{item.name.substring(0, 20)}{item.name.length > 20 ? '...' : ''}</span>
                        <span style={{ color: 'var(--text-muted)' }}>×{item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 4 && <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 10, fontSize: 13, color: 'var(--text-muted)' }}>+{order.items.length - 4} more</div>}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '6px 12px', background: 'var(--bg-elevated)', borderRadius: 8 }}>💳 {order.paymentMethod}</div>
                    {['pending', 'confirmed'].includes(order.status) && (
                      <button onClick={() => handleCancel(order._id)} style={{ fontSize: 12, color: '#ff6b6b', padding: '6px 12px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 8, cursor: 'pointer' }}>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
`);

// ─── app/admin/page.tsx ───────────────────────────────────────────────────────
write('app/admin/page.tsx', `'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAppSelector } from '../../store/hooks';
import api from '../../lib/axios';

interface Product {
  _id: string; name: string; price: number; category: string;
  brand: string; stock: number; ratings: { average: number }; isActive: boolean;
}

export default function AdminPage() {
  const user = useAppSelector(s => s.auth.user);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'products' | 'add'>('products');
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', brand: '', stock: '', images: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/products'); return; }
    fetchProducts();
  }, [user, router]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.data);
    } catch { } finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMessage('');
    try {
      await api.post('/products', {
        name: form.name, description: form.description,
        price: parseFloat(form.price), category: form.category.toLowerCase(),
        brand: form.brand, stock: parseInt(form.stock),
        images: form.images ? [form.images] : []
      });
      setMessage('✅ Product added successfully!');
      setForm({ name: '', description: '', price: '', category: '', brand: '', stock: '', images: '' });
      fetchProducts();
      setTab('products');
    } catch { setMessage('❌ Failed to add product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(\`Delete "\${name}"?\`)) return;
    try {
      await api.delete(\`/products/\${id}\`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { alert('Failed to delete'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, padding: '3px 10px', fontSize: 11, color: '#ff6b6b', fontWeight: 700 }}>ADMIN</div>
            </div>
            <h1 style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 800 }}>Admin Panel</h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ key: 'products', label: '📦 Products' }, { key: 'add', label: '+ Add Product' }].map(t => (
              <button key={t.key} onClick={() => setTab(t.key as 'products' | 'add')} style={{ padding: '10px 20px', borderRadius: 10, border: \`1px solid \${tab === t.key ? 'var(--accent)' : 'var(--border)'}\`, background: tab === t.key ? 'rgba(108,99,255,0.15)' : 'transparent', color: tab === t.key ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', fontWeight: tab === t.key ? 600 : 400, transition: 'all 0.2s' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Products', value: products.length, icon: '📦', color: 'var(--accent)' },
            { label: 'Active', value: products.filter(p => p.isActive).length, icon: '✅', color: '#4ade80' },
            { label: 'Low Stock', value: products.filter(p => p.stock < 10 && p.stock > 0).length, icon: '⚠️', color: '#ffd93d' },
            { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, icon: '❌', color: '#ff6b6b' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {tab === 'products' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17 }}>All Products ({products.length})</h3>
            </div>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
            ) : (
              <div style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Product', 'Category', 'Brand', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => (
                      <tr key={p._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <td style={{ padding: '14px 20px', fontWeight: 500, fontSize: 14, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</td>
                        <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{p.category}</td>
                        <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.brand}</td>
                        <td style={{ padding: '14px 20px', fontFamily: 'Syne', fontWeight: 700, fontSize: 15 }}>₹{p.price.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ fontSize: 13, color: p.stock === 0 ? '#ff6b6b' : p.stock < 10 ? '#ffd93d' : '#4ade80', fontWeight: 600 }}>{p.stock}</span>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: 13, color: '#ffd93d' }}>★ {p.ratings?.average?.toFixed(1) || '0.0'}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <button onClick={() => handleDelete(p._id, p.name)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,107,107,0.3)', background: 'rgba(255,107,107,0.08)', color: '#ff6b6b', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'add' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px' }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 28 }}>Add New Product</h3>
            {message && (
              <div style={{ background: message.includes('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,107,0.1)', border: \`1px solid \${message.includes('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(255,107,107,0.3)'}\`, borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: message.includes('✅') ? '#4ade80' : '#ff6b6b' }}>{message}</div>
            )}
            <form onSubmit={handleAdd}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  { key: 'name', label: 'Product Name', placeholder: 'iPhone 15 Pro', col: 2 },
                  { key: 'price', label: 'Price (₹)', placeholder: '79999', col: 1 },
                  { key: 'stock', label: 'Stock', placeholder: '50', col: 1 },
                  { key: 'category', label: 'Category', placeholder: 'electronics', col: 1 },
                  { key: 'brand', label: 'Brand', placeholder: 'Apple', col: 1 },
                  { key: 'images', label: 'Image URL', placeholder: 'https://...', col: 2 },
                  { key: 'description', label: 'Description', placeholder: 'Product description...', col: 2, isTextarea: true },
                ].map(field => (
                  <div key={field.key} style={{ gridColumn: \`span \${field.col}\` }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{field.label}</label>
                    {field.isTextarea ? (
                      <textarea className="input-field" placeholder={field.placeholder} value={form[field.key as keyof typeof form]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} required rows={3} style={{ resize: 'vertical', fontFamily: 'DM Sans' }} />
                    ) : (
                      <input className="input-field" placeholder={field.placeholder} value={form[field.key as keyof typeof form]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} required type={['price','stock'].includes(field.key) ? 'number' : 'text'} />
                    )}
                  </div>
                ))}
              </div>
              <button type="submit" disabled={saving} className="btn-primary" style={{ marginTop: 28, padding: '14px 40px', fontSize: 16, borderRadius: 12 }}>
                {saving ? 'Adding...' : '+ Add Product'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
`);

// Update cart to link to checkout
write('components/CartLink.tsx', `'use client';
// Helper: Update cart page checkout button to go to /checkout
// This is already handled in cart/page.tsx
export default function CartLink() { return null; }
`);

console.log('\n🎉 All frontend pages created!');
console.log('  app/products/[id]/page.tsx  → Product detail');
console.log('  app/checkout/page.tsx       → Checkout with address form');
console.log('  app/orders/page.tsx         → Order history');
console.log('  app/admin/page.tsx          → Admin panel');
