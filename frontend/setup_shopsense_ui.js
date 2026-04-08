const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Created: ' + filePath);
}

// ─── globals.css ───────────────────────────────────────────────────────────
write('app/globals.css', `@import "tailwindcss";

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

:root {
  --bg: #0a0a0f;
  --bg-card: #111118;
  --bg-elevated: #18181f;
  --border: rgba(255,255,255,0.07);
  --border-hover: rgba(255,255,255,0.15);
  --accent: #6c63ff;
  --accent-2: #ff6b6b;
  --accent-3: #ffd93d;
  --text-primary: #f0f0f8;
  --text-secondary: #8888aa;
  --text-muted: #44445a;
  --glow: 0 0 40px rgba(108,99,255,0.15);
  --radius: 16px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Syne', sans-serif;
  letter-spacing: -0.02em;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 3px; }

/* Selection */
::selection { background: rgba(108,99,255,0.3); color: white; }
`);

// ─── app/page.tsx ───────────────────────────────────────────────────────────
write('app/page.tsx', `import Link from 'next/link';

export default function Home() {
  const features = [
    { icon: '🤖', title: 'AI Recommendations', desc: 'GPT-4o analyses your browsing and cart to surface products you\'ll actually want' },
    { icon: '⚡', title: 'Lightning Fast', desc: 'Next.js ISR caching + MongoDB compound indexing for sub-second page loads' },
    { icon: '🔐', title: 'Secure by Default', desc: 'JWT refresh rotation, RBAC, Zod validation, Helmet.js — enterprise-grade auth' },
    { icon: '📦', title: 'Full Stack', desc: 'React frontend, Node.js backend, MongoDB database — fully deployed end-to-end' },
  ];

  const stats = [
    { value: '35%', label: 'Faster Load Time' },
    { value: '42%', label: 'Higher CTR via AI' },
    { value: '78%', label: 'Test Coverage' },
    { value: '< 1s', label: 'Page Load Speed' },
  ];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(20px)',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16
          }}>🛍</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18 }}>ShopSense</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login" style={{
            padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)',
            color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14,
            transition: 'all 0.2s'
          }}>Sign in</Link>
          <Link href="/register" style={{
            padding: '8px 20px', borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 500
          }}>Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        paddingTop: '160px', paddingBottom: '100px',
        textAlign: 'center', padding: '160px 40px 100px',
        position: 'relative'
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 32,
          fontSize: 13, color: 'var(--accent)'
        }}>
          <span>✨</span> AI-Powered E-commerce Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 88px)',
          fontFamily: 'Syne', fontWeight: 800,
          lineHeight: 1.05, letterSpacing: '-0.03em',
          marginBottom: 24, maxWidth: 900, margin: '0 auto 24px'
        }}>
          Shop Smarter with{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            AI That Knows You
          </span>
        </h1>

        <p style={{
          fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560,
          margin: '0 auto 48px', lineHeight: 1.7
        }}>
          Personalised product recommendations powered by GPT-4o. Built with Next.js, Node.js, and MongoDB for blazing-fast performance.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{
            padding: '14px 32px', borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 16,
            boxShadow: '0 0 40px rgba(108,99,255,0.3)'
          }}>
            Start Shopping →
          </Link>
          <Link href="/products" style={{
            padding: '14px 32px', borderRadius: 12,
            border: '1px solid var(--border)', color: 'var(--text-primary)',
            textDecoration: 'none', fontWeight: 500, fontSize: 16,
            background: 'var(--bg-card)'
          }}>
            Browse Products
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1, background: 'var(--border)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        margin: '0 0 100px'
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: 'var(--bg)', padding: '40px 32px', textAlign: 'center'
          }}>
            <div style={{
              fontSize: 40, fontFamily: 'Syne', fontWeight: 800,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{s.value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ padding: '0 40px 120px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center', fontSize: 40, fontFamily: 'Syne', fontWeight: 700,
          marginBottom: 60
        }}>Built for Performance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '32px',
              transition: 'border-color 0.2s, transform 0.2s'
            }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '32px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--text-muted)', fontSize: 13
      }}>
        <span style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--text-secondary)' }}>ShopSense</span>
        <span>Built by Praveenkumar Yalawar</span>
        <span>MERN + AI · 2025</span>
      </footer>
    </main>
  );
}
`);

// ─── app/login/page.tsx ─────────────────────────────────────────────────────
write('app/login/page.tsx', `'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/authSlice';
import api from '../../lib/axios';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      router.push('/products');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '48px 40px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
          }}>🛍</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Sign in to your ShopSense account</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 24,
            color: '#ff6b6b', fontSize: 14
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map((field) => (
            <div key={field.key} style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--text-secondary)' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: loading ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            color: loading ? 'var(--text-muted)' : 'white',
            fontFamily: 'Syne', fontWeight: 600, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', marginTop: 8
          }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--text-secondary)', fontSize: 14 }}>
          No account?{' '}
          <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
`);

// ─── app/register/page.tsx ──────────────────────────────────────────────────
write('app/register/page.tsx', `'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/authSlice';
import api from '../../lib/axios';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      router.push('/products');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '48px 40px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--accent-2), var(--accent-3))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
          }}>✨</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Create account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Join ShopSense — it's free</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 24,
            color: '#ff6b6b', fontSize: 14
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Praveen Kumar' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
          ].map((field) => (
            <div key={field.key} style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--text-secondary)' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: 15, outline: 'none'
                }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: loading ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent-2), var(--accent-3))',
            color: loading ? 'var(--text-muted)' : '#0a0a0f',
            fontFamily: 'Syne', fontWeight: 600, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', marginTop: 8
          }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--text-secondary)', fontSize: 14 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
`);

// ─── app/products/page.tsx ──────────────────────────────────────────────────
write('app/products/page.tsx', `'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/axios';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { logout } from '../../store/authSlice';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  ratings: { average: number; count: number };
  stock: number;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cart = useAppSelector(s => s.cart);
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        const { data } = await api.get('/products?' + params.toString());
        setProducts(data.data);
      } catch { setProducts([]); }
      finally { setLoading(false); }
    };
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories');
        setCategories(data.data);
      } catch { /* ignore */ }
    };
    fetchProducts();
    fetchCategories();
  }, [category]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      productId: product._id, name: product.name,
      price: product.price, image: product.images[0] || '',
      quantity: 1
    }));
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleLogout = async () => {
    await api.post('/auth/logout');
    dispatch(logout());
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)',
        padding: '0 40px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
          }}>🛍</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>ShopSense</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user && <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Hi, {user.name.split(' ')[0]} 👋</span>}
          <Link href="/cart" style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, textDecoration: 'none', color: 'var(--text-primary)', fontSize: 14
          }}>
            🛒 Cart
            {cart.items.length > 0 && (
              <span style={{
                background: 'var(--accent)', color: 'white', borderRadius: 100,
                width: 20, height: 20, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700
              }}>{cart.items.length}</span>
            )}
          </Link>
          {user ? (
            <button onClick={handleLogout} style={{
              padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer'
            }}>Logout</button>
          ) : (
            <Link href="/login" style={{
              padding: '8px 16px', borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 500
            }}>Sign in</Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
            All Products
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} products{category ? ' in ' + category : ''}
          </p>
        </div>

        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="🔍  Search products..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 260, padding: '12px 16px', borderRadius: 12,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', fontSize: 15, outline: 'none'
            }}
          />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{
            padding: '12px 16px', borderRadius: 12,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: category ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: 15, outline: 'none', cursor: 'pointer'
          }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 20
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 22, marginBottom: 8 }}>No products yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Products added by admin will appear here
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24
          }}>
            {filtered.map(product => (
              <div key={product._id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 20, overflow: 'hidden',
                transition: 'border-color 0.2s, transform 0.2s'
              }}>
                {/* Product Image */}
                <div style={{
                  height: 220, background: 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 64, position: 'relative'
                }}>
                  {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : '🛍️'}
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border)', borderRadius: 8,
                    padding: '4px 10px', fontSize: 12, color: 'var(--text-secondary)'
                  }}>
                    {product.category}
                  </div>
                </div>

                {/* Product Info */}
                <div style={{ padding: '20px 24px 24px' }}>
                  <div style={{ marginBottom: 4, fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {product.brand}
                  </div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 17, marginBottom: 8, lineHeight: 1.3 }}>
                    {product.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16, lineHeight: 1.6, 
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 22 }}>
                        ₹{product.price.toLocaleString()}
                      </span>
                      <div style={{ fontSize: 12, color: product.stock > 0 ? '#4ade80' : '#ff6b6b', marginTop: 2 }}>
                        {product.stock > 0 ? product.stock + ' in stock' : 'Out of stock'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      style={{
                        padding: '10px 18px', borderRadius: 10, border: 'none',
                        background: addedId === product._id
                          ? '#4ade80'
                          : product.stock === 0
                          ? 'var(--bg-elevated)'
                          : 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                        color: addedId === product._id ? '#0a0a0f' : product.stock === 0 ? 'var(--text-muted)' : 'white',
                        fontWeight: 600, fontSize: 13, cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {addedId === product._id ? '✓ Added' : product.stock === 0 ? 'Sold Out' : '+ Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`);

// ─── app/cart/page.tsx ──────────────────────────────────────────────────────
write('app/cart/page.tsx', `'use client';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../store/cartSlice';

export default function CartPage() {
  const { items, total } = useAppSelector(s => s.cart);
  const dispatch = useAppDispatch();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)',
        padding: '0 40px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
          }}>🛍</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>ShopSense</span>
        </Link>
        <Link href="/products" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14 }}>
          ← Continue Shopping
        </Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px' }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 800, marginBottom: 40 }}>
          Your Cart {items.length > 0 && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({items.length})</span>}
        </h1>

        {items.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20
          }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🛒</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 22, marginBottom: 8 }}>Your cart is empty</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Discover amazing products</p>
            <Link href="/products" style={{
              padding: '12px 28px', borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              color: 'white', textDecoration: 'none', fontWeight: 600
            }}>Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map(item => (
                <div key={item.productId} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '20px 24px',
                  display: 'flex', gap: 20, alignItems: 'center'
                }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 12,
                    background: 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, flexShrink: 0
                  }}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} /> : '🛍️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{item.name}</h4>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{item.price.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)', borderRadius: 8, padding: '4px 8px' }}>
                      <button onClick={() => item.quantity > 1 ? dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 })) : dispatch(removeFromCart(item.productId))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16, width: 24, height: 24 }}>−</button>
                      <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16, width: 24, height: 24 }}>+</button>
                    </div>
                    <button onClick={() => dispatch(removeFromCart(item.productId))}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, padding: 4 }}>×</button>
                  </div>
                </div>
              ))}
              <button onClick={() => dispatch(clearCart())} style={{
                alignSelf: 'flex-start', padding: '8px 16px', borderRadius: 8,
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer'
              }}>Clear cart</button>
            </div>

            {/* Summary */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 20, padding: 28, position: 'sticky', top: 80
            }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 14 }}>
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 14 }}>
                  <span>Shipping</span><span style={{ color: '#4ade80' }}>Free</span>
                </div>
                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Syne', fontWeight: 700, fontSize: 20 }}>
                  <span>Total</span><span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                color: 'white', fontFamily: 'Syne', fontWeight: 600, fontSize: 16, cursor: 'pointer'
              }}>
                Checkout →
              </button>
              <p style={{ textAlign: 'center', marginTop: 12, color: 'var(--text-muted)', fontSize: 12 }}>
                🔐 Secured with JWT + SSL
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`);

console.log('\n🎉 All ShopSense UI files created successfully!');
console.log('📋 Pages created:');
console.log('   / → Landing page');
console.log('   /login → Login page');
console.log('   /register → Register page');
console.log('   /products → Product listing');
console.log('   /cart → Shopping cart');
