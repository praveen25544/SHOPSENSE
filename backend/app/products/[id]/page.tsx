'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useAppDispatch } from '../../../store/hooks';
import { addToCart } from '../../../store/cartSlice';
import api from '../../../lib/axios';

interface Product {
  _id: string; name: string; price: number; category: string;
  brand: string; images: string[]; ratings: { average: number; count: number };
  stock: number; description: string; tags: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
      } catch { router.push('/products'); }
      finally { setLoading(false); }
    };
    if (id) fetch();
  }, [id, router]);

  const handleAdd = () => {
    if (!product) return;
    dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, image: product.images[0] || '', quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        {[1,2].map(i => <div key={i} style={{ height: 400, background: 'var(--bg-card)', borderRadius: 20, animation: 'shimmer 1.5s infinite' }} />)}
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 36, fontSize: 13, color: 'var(--text-muted)' }}>
          <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
          <span>›</span>
          <a href="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Products</a>
          <span>›</span>
          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{product.category}</span>
          <span>›</span>
          <span style={{ color: 'var(--text-primary)' }}>{product.name.substring(0, 30)}...</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)', height: 400, marginBottom: 16, position: 'relative' }}>
              {product.images[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = 'https://dummyjson.com/image/400x300/008080/ffffff?text=Product'; }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 72 }}>🛍️</div>
              )}
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '4px 12px', fontSize: 12, color: 'var(--text-secondary)', border: '1px solid var(--border)', textTransform: 'capitalize' }}>
                {product.category}
              </div>
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} onClick={() => setSelectedImage(i)} style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: `2px solid ${selectedImage === i ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{product.brand}</div>
            <h1 style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(product.ratings.average) ? '#ffd93d' : 'var(--text-muted)', fontSize: 16 }}>★</span>)}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 40, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: 13, color: '#4ade80', marginLeft: 14 }}>{product.stock > 0 ? `✓ In Stock (${product.stock} units)` : '✗ Out of Stock'}</span>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 15, marginBottom: 28 }}>{product.description}</p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {product.tags.map(tag => (
                  <span key={tag} style={{ padding: '4px 12px', borderRadius: 100, background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{tag}</span>
                ))}
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: 44, height: 44, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, minWidth: 40, textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: 44, height: 44, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock === 0} className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: 16, borderRadius: 12, background: added ? '#4ade80' : undefined, color: added ? '#0a0a0f' : undefined, transition: 'all 0.3s' }}>
                {added ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
              </button>
            </div>

            {/* Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['🔐', 'Secure Payment'], ['🔄', '30-day Returns'], ['⚡', 'Fast Delivery'], ['✓', 'Genuine Product']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
