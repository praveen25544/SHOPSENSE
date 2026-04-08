'use client';
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
            {items.length === 0 ? 'Your cart is empty' : `${items.reduce((s,i) => s+i.quantity, 0)} items · No login required to browse`}
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
                  <div key={item.productId} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center', animation: 'slide-up 0.35s ease forwards', animationDelay: `${i * 0.07}s`, opacity: 0, transition: 'border-color 0.2s' }}>
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
                  { label: `Subtotal (${items.reduce((s,i) => s+i.quantity, 0)} items)`, value: `₹${total.toLocaleString('en-IN')}` },
                  { label: 'Shipping', value: 'Free ✓', color: '#4ade80' },
                  { label: 'GST (18%)', value: `₹${gst.toLocaleString('en-IN')}` },
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
