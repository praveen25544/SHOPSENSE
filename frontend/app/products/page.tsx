'use client';
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
        border: `1px solid ${hovered ? 'rgba(108,99,255,0.35)' : 'var(--border)'}`,
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
              border: `1px solid ${category === c ? 'var(--accent)' : 'var(--border)'}`,
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
              <div key={product._id} style={{ animation: 'slide-up 0.4s ease forwards', animationDelay: `${Math.min(i, 12) * 0.05}s`, opacity: 0 }}>
                <ProductCard product={product} onAdd={() => handleAdd(product)} added={addedIds.has(product._id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
