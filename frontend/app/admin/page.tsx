'use client';
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
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
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
              <button key={t.key} onClick={() => setTab(t.key as 'products' | 'add')} style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid ${tab === t.key ? 'var(--accent)' : 'var(--border)'}`, background: tab === t.key ? 'rgba(108,99,255,0.15)' : 'transparent', color: tab === t.key ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', fontWeight: tab === t.key ? 600 : 400, transition: 'all 0.2s' }}>
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
              <div style={{ background: message.includes('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,107,0.1)', border: `1px solid ${message.includes('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(255,107,107,0.3)'}`, borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: message.includes('✅') ? '#4ade80' : '#ff6b6b' }}>{message}</div>
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
                  <div key={field.key} style={{ gridColumn: `span ${field.col}` }}>
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
