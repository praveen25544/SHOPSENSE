'use client';
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
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'float 1s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
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
                  <div key={product._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', animation: 'slide-up 0.5s ease forwards', animationDelay: `${i * 0.08}s`, opacity: 0, transition: 'transform 0.3s, border-color 0.3s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
                    <div style={{ height: 180, background: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }}>
                      {product.images[0]
                        ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                        : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 44 }}>🛍️</div>}
                      <div style={{ position: 'absolute', top: 12, left: 12, background: badge.bg, border: `1px solid ${badge.color}44`, color: badge.color, borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>
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
