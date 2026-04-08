const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ ' + filePath);
}

// ─── components/Navbar.tsx ────────────────────────────────────────────────────
write('components/Navbar.tsx', `'use client';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';

export default function Navbar() {
  const cart = useAppSelector(s => s.cart);
  const user = useAppSelector(s => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    dispatch(logout());
    router.push('/');
  };

  return (
    <nav className="nav-glass" style={{
      position: 'sticky', top: 0, zIndex: 50,
      padding: '0 40px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 68
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, boxShadow: '0 0 16px rgba(108,99,255,0.35)' }}>🛍</div>
        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 19, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>ShopSense</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/products" style={{ padding: '8px 14px', borderRadius: 10, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}>Products</Link>
        
        <Link href="/ai-picks" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, textDecoration: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
          <span style={{ display: 'inline-block', animation: 'spin-slow 3s linear infinite' }}>✨</span> AI Picks
        </Link>

        {/* Cart — always visible, no login needed */}
        <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, textDecoration: 'none', color: 'var(--text-primary)', fontSize: 14, position: 'relative' }}>
          🛒 Cart
          {cart.items.length > 0 && (
            <span style={{ background: 'var(--accent)', color: 'white', borderRadius: 100, minWidth: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, padding: '0 5px', animation: 'bounce-in 0.3s forwards' }}>
              {cart.items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user.name.split(' ')[0]}</span>
            </div>
            <button onClick={handleLogout} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/login" style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, transition: 'all 0.2s' }}>Sign in</Link>
            <Link href="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
`);

// ─── app/products/page.tsx — no login needed ──────────────────────────────────
write('app/products/page.tsx', `'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import api from '../../lib/axios';

interface Product {
  _id: string; name: string; price: number; category: string;
  brand: string; images: string[]; ratings: { average: number; count: number };
  stock: number; description: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 12, color: i <= Math.round(rating) ? '#ffd93d' : 'var(--text-muted)' }}>★</span>
      ))}
      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function ProductCard({ product, onAdd, added }: { product: Product; onAdd: () => void; added: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: \`1px solid \${hovered ? 'rgba(108,99,255,0.35)' : 'var(--border)'}\`,
        borderRadius: 20, overflow: 'hidden',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 60px rgba(108,99,255,0.15)' : '0 4px 20px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ height: 210, background: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }}>
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.4s ease' }} onError={e => { (e.target as HTMLImageElement).src = 'https://dummyjson.com/image/400x300/008080/ffffff?text=Product'; }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 52 }}>🛍️</div>
        )}
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(10,10,15,0.82)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '3px 10px', fontSize: 11, color: 'var(--text-secondary)', border: '1px solid var(--border)', textTransform: 'capitalize' }}>
          {product.category}
        </div>
        {product.stock > 0 && product.stock < 10 && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,107,107,0.18)', border: '1px solid rgba(255,107,107,0.4)', borderRadius: 8, padding: '3px 10px', fontSize: 11, color: '#ff6b6b' }}>
            Only {product.stock} left!
          </div>
        )}
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#ff6b6b', fontFamily: 'Syne', fontWeight: 700, fontSize: 16 }}>Sold Out</span>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>{product.brand}</div>
        <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.35, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
        <StarRating rating={product.ratings.average} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 21 }}>₹{product.price.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: 11, color: product.stock > 0 ? '#4ade80' : '#ff6b6b', marginTop: 2 }}>
              {product.stock > 0 ? '✓ In stock' : '✗ Out of stock'}
            </div>
          </div>
          <button
            onClick={onAdd}
            disabled={product.stock === 0 || added}
            style={{
              padding: '10px 18px', borderRadius: 10, border: 'none',
              background: added ? '#4ade80' : product.stock === 0 ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              color: added ? '#0a0a0f' : product.stock === 0 ? 'var(--text-muted)' : 'white',
              fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
              cursor: product.stock === 0 || added ? 'not-allowed' : 'pointer',
              transform: added ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              whiteSpace: 'nowrap', minWidth: 80
            }}
          >
            {added ? '✓ Added!' : product.stock === 0 ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [categories, setCategories] = useState<string[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number,number]>([0, 200000]);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(s => s.cart);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const params = new URLSearchParams({ sort, limit: '100' });
        if (category) params.set('category', category);
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?' + params),
          api.get('/products/categories')
        ]);
        setProducts(prodRes.data.data);
        setCategories(catRes.data.data);
      } catch { setProducts([]); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [category, sort]);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchSearch && matchPrice;
  });

  const handleAdd = (product: Product) => {
    dispatch(addToCart({
      productId: product._id, name: product.name,
      price: product.price, image: product.images[0] || '', quantity: 1
    }));
    setAddedIds(prev => new Set([...prev, product._id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product._id); return n; }), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: 38, fontWeight: 800, marginBottom: 6 }}>
            All Products
            {!loading && <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 12 }}>({filtered.length} results)</span>}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Real products · AI-enhanced · No login required to shop
          </p>
        </div>

        {/* Cart summary bar */}
        {cart.items.length > 0 && (
          <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 14, padding: '14px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              🛒 <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cart.items.reduce((s,i) => s+i.quantity, 0)} items</span> in your cart · <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{cart.total.toLocaleString('en-IN')}</span>
            </span>
            <a href="/cart" style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), #8b5cf6)', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              View Cart →
            </a>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15 }}>🔍</span>
            <input className="input-field" type="text" placeholder="Search products, brands..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 14, outline: 'none', cursor: 'pointer', minWidth: 160 }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 14, outline: 'none', cursor: 'pointer', minWidth: 180 }}>
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low → High</option>
            <option value="-price">Price: High → Low</option>
            <option value="-ratings.average">Top Rated</option>
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {['', ...categories].map((c, i) => (
            <button key={i} onClick={() => setCategory(c)} style={{
              padding: '6px 16px', borderRadius: 100, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
              border: \`1px solid \${category === c ? 'var(--accent)' : 'var(--border)'}\`,
              background: category === c ? 'rgba(108,99,255,0.15)' : 'transparent',
              color: category === c ? 'var(--accent)' : 'var(--text-secondary)',
              textTransform: 'capitalize'
            }}>{c || 'All'}</button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 24 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ height: 380, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ height: 210, background: 'var(--bg-elevated)', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%' }} />
                <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ height: 12, background: 'var(--bg-elevated)', borderRadius: 6, width: '50%' }} />
                  <div style={{ height: 18, background: 'var(--bg-elevated)', borderRadius: 6 }} />
                  <div style={{ height: 14, background: 'var(--bg-elevated)', borderRadius: 6, width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🔍</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 22, marginBottom: 8 }}>No products found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Try different search terms or clear filters</p>
            <button onClick={() => { setSearch(''); setCategory(''); }} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', fontSize: 14 }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 24 }}>
            {filtered.map((product, i) => (
              <div key={product._id} style={{ animation: 'slide-up 0.4s ease forwards', animationDelay: \`\${Math.min(i, 12) * 0.05}s\`, opacity: 0 }}>
                <ProductCard product={product} onAdd={() => handleAdd(product)} added={addedIds.has(product._id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`);

// ─── app/cart/page.tsx — checkout requires login ──────────────────────────────
write('app/cart/page.tsx', `'use client';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../store/cartSlice';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, total } = useAppSelector(s => s.cart);
  const user = useAppSelector(s => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=checkout');
    } else {
      alert('🎉 Order placed successfully! (Demo mode)');
    }
  };

  const gst = Math.round(total * 0.18);
  const grandTotal = total + gst;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: 38, fontWeight: 800, marginBottom: 6 }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {items.length === 0 ? 'Your cart is empty' : \`\${items.reduce((s,i) => s+i.quantity, 0)} items · No login required to browse\`}
          </p>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }}>
            <div style={{ fontSize: 72, marginBottom: 20, animation: 'float 3s ease-in-out infinite' }}>🛒</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, marginBottom: 12 }}>Your cart is empty</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: 16 }}>Discover amazing products — no login needed!</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/products" className="btn-primary" style={{ padding: '13px 28px', fontSize: 15, borderRadius: 12, textDecoration: 'none', display: 'inline-block' }}>Browse Products</Link>
              <Link href="/ai-picks" style={{ padding: '13px 28px', fontSize: 15, borderRadius: 12, border: '1px solid rgba(108,99,255,0.3)', color: 'var(--accent)', textDecoration: 'none', background: 'rgba(108,99,255,0.08)' }}>✨ Get AI Picks</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
            {/* Items list */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
                {items.map((item, i) => (
                  <div key={item.productId} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center', animation: 'slide-up 0.35s ease forwards', animationDelay: \`\${i * 0.07}s\`, opacity: 0, transition: 'border-color 0.2s' }}>
                    <div style={{ width: 76, height: 76, borderRadius: 12, background: 'var(--bg-elevated)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                        : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 28 }}>🛍️</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h4>
                      <span style={{ color: 'var(--accent)', fontFamily: 'Syne', fontWeight: 700, fontSize: 17 }}>₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <button onClick={() => item.quantity > 1 ? dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 })) : dispatch(removeFromCart(item.productId))}
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: 36, height: 36, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ fontFamily: 'Syne', fontWeight: 700, minWidth: 28, textAlign: 'center', fontSize: 15 }}>{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: 36, height: 36, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                      <button onClick={() => dispatch(removeFromCart(item.productId))}
                        style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10, color: '#ff6b6b', cursor: 'pointer', width: 36, height: 36, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>✕</button>
                    </div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, minWidth: 90, textAlign: 'right' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => dispatch(clearCart())} style={{ padding: '8px 18px', borderRadius: 10, border: '1px solid rgba(255,107,107,0.3)', background: 'rgba(255,107,107,0.05)', color: '#ff6b6b', fontSize: 13, cursor: 'pointer' }}>
                🗑 Clear Cart
              </button>
            </div>

            {/* Order summary */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px', position: 'sticky', top: 80 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {[
                  { label: \`Subtotal (\${items.reduce((s,i) => s+i.quantity, 0)} items)\`, value: \`₹\${total.toLocaleString('en-IN')}\` },
                  { label: 'Shipping', value: 'Free ✓', color: '#4ade80' },
                  { label: 'GST (18%)', value: \`₹\${gst.toLocaleString('en-IN')}\` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                    <span>{row.label}</span>
                    <span style={{ color: row.color || 'var(--text-secondary)', fontWeight: row.color ? 600 : 400 }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Syne', fontWeight: 800, fontSize: 22 }}>
                  <span>Total</span>
                  <span className="gradient-text">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout button */}
              <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: 16, borderRadius: 14, marginBottom: 12 }}>
                {user ? 'Place Order →' : 'Login to Checkout →'}
              </button>

              {!user && (
                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                  🔓 Sign in to complete your purchase
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['🔐 SSL Encrypted Checkout', '🔄 Easy 30-day Returns', '⚡ Express Delivery Available', '🏷️ Best Price Guaranteed'].map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 12 }}>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`);

// ─── app/ai-picks/page.tsx — works without login ──────────────────────────────
write('app/ai-picks/page.tsx', `'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import api from '../../lib/axios';

interface AiProduct {
  _id: string; name: string; price: number; category: string;
  brand: string; images: string[]; ratings: { average: number; count: number };
  stock: number; aiReason: string; aiBadge: string;
}

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  'Best Match':  { bg: 'rgba(108,99,255,0.2)', color: '#6c63ff' },
  'Top Rated':   { bg: 'rgba(255,217,61,0.2)', color: '#ffd93d' },
  'Great Value': { bg: 'rgba(74,222,128,0.2)', color: '#4ade80' },
  'Trending':    { bg: 'rgba(255,107,107,0.2)', color: '#ff6b6b' },
  'Budget Pick': { bg: 'rgba(56,189,248,0.2)', color: '#38bdf8' },
  'Premium':     { bg: 'rgba(244,114,182,0.2)', color: '#f472b6' },
};

export default function AiPicksPage() {
  const [recommendations, setRecommendations] = useState<AiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState('50000');
  const [asked, setAsked] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [dots, setDots] = useState('');
  const cart = useAppSelector(s => s.cart);
  const user = useAppSelector(s => s.auth.user);
  const dispatch = useAppDispatch();

  // Animate loading dots
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(interval);
  }, [loading]);

  const getRecommendations = async () => {
    setLoading(true); setAsked(true);
    try {
      const cartItems = cart.items.map(i => i.name);
      const { data } = await api.post('/ai/recommendations', {
        budget: parseInt(budget),
        cartItems,
        userName: user?.name || 'Guest'
      });
      setRecommendations(data.recommendations || []);
    } catch { setRecommendations([]); }
    finally { setLoading(false); }
  };

  const handleAdd = (product: AiProduct) => {
    dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, image: product.images[0] || '', quantity: 1 }));
    setAddedIds(prev => new Set([...prev, product._id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product._id); return n; }), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 100, padding: '6px 18px', marginBottom: 24, fontSize: 13, color: 'var(--accent)' }}>
            <span style={{ animation: 'spin-slow 2s linear infinite', display: 'inline-block' }}>⚡</span>
            Groq · Llama3-8b-8192 · Ultra-fast inference
          </div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 52, fontWeight: 800, lineHeight: 1.05, marginBottom: 16 }}>
            AI Picks <span className="gradient-text">Just for You</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Tell Groq your budget and it instantly recommends the best products from our catalogue.
          </p>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <span style={{ padding: '13px 16px', color: 'var(--accent)', fontFamily: 'Syne', fontWeight: 700, fontSize: 16, borderRight: '1px solid var(--border)' }}>₹</span>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="Budget"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 16, fontFamily: 'Syne', fontWeight: 600, width: 120, outline: 'none', padding: '13px 16px' }}
              />
            </div>
            <button onClick={getRecommendations} disabled={loading} className="btn-primary" style={{ padding: '14px 36px', fontSize: 16, borderRadius: 14 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} />
                  Groq thinking{dots}
                </span>
              ) : '✨ Get My AI Picks'}
            </button>
          </div>

          {!user && (
            <p style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 13 }}>
              No login required · <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</a> for personalised results
            </p>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }}>
            <div style={{ fontSize: 56, marginBottom: 20, animation: 'spin-slow 2s linear infinite', display: 'inline-block' }}>🤖</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 24, marginBottom: 10 }}>Groq AI is working{dots}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Analysing {cart.items.length > 0 ? 'your cart and' : ''} finding the best products within ₹{parseInt(budget).toLocaleString('en-IN')}</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'float 1s ease-in-out infinite', animationDelay: \`\${i * 0.2}s\` }} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && asked && recommendations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 22, marginBottom: 8 }}>No recommendations returned</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Check your Groq API key in backend .env or try again</p>
          </div>
        )}

        {/* Results */}
        {!loading && recommendations.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>✨</span>
                <div>
                  <h2 style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 700 }}>Groq found {recommendations.length} picks for you</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Budget: ₹{parseInt(budget).toLocaleString('en-IN')}</p>
                </div>
              </div>
              <button onClick={getRecommendations} style={{ padding: '9px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>
                🔄 Refresh
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 24 }}>
              {recommendations.map((product, i) => {
                const badge = BADGE_COLORS[product.aiBadge] || BADGE_COLORS['Best Match'];
                return (
                  <div key={product._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', animation: 'slide-up 0.5s ease forwards', animationDelay: \`\${i * 0.08}s\`, opacity: 0, transition: 'transform 0.3s, border-color 0.3s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
                    <div style={{ height: 180, background: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }}>
                      {product.images[0]
                        ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                        : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 44 }}>🛍️</div>}
                      <div style={{ position: 'absolute', top: 12, left: 12, background: badge.bg, border: \`1px solid \${badge.color}44\`, color: badge.color, borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>
                        {product.aiBadge}
                      </div>
                      <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(10,10,15,0.8)', borderRadius: 8, padding: '4px 10px', fontSize: 10, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                        {product.category}
                      </div>
                    </div>
                    <div style={{ padding: '16px 18px 20px' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>{product.brand}</div>
                      <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 12, lineHeight: 1.3 }}>{product.name}</h3>
                      <div style={{ background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 10, padding: '10px 12px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>🤖</span>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{product.aiReason}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }}>₹{product.price.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: 11, color: '#ffd93d', marginTop: 2 }}>{'★'.repeat(Math.round(product.ratings?.average || 4))}</div>
                        </div>
                        <button onClick={() => handleAdd(product)} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: addedIds.has(product._id) ? '#4ade80' : 'linear-gradient(135deg, var(--accent), #8b5cf6)', color: addedIds.has(product._id) ? '#0a0a0f' : 'white', fontFamily: 'Syne', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)', transform: addedIds.has(product._id) ? 'scale(1.05)' : 'scale(1)' }}>
                          {addedIds.has(product._id) ? '✓ Added!' : '+ Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart bar */}
            {cart.items.length > 0 && (
              <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-card)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 16, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', animation: 'bounce-in 0.4s forwards', zIndex: 100 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  🛒 <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cart.items.reduce((s,i) => s+i.quantity,0)}</span> items · <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{cart.total.toLocaleString('en-IN')}</span>
                </span>
                <a href="/cart" className="btn-primary" style={{ padding: '9px 20px', fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>View Cart →</a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
`);

console.log('\n🎉 Frontend fully fixed!');
console.log('✓ Cart works without login');
console.log('✓ AI Picks works without login');
console.log('✓ Checkout redirects to login');
console.log('✓ Shared Navbar component');
console.log('✓ Cart summary bar on products page');
console.log('✓ Floating cart bar on AI picks page');
