'use client';
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
                  <div key={field.key} style={{ gridColumn: `span ${field.col}` }}>
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
              {loading ? 'Placing Order...' : `Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}
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
            {[{ l: 'Subtotal', v: `₹${total.toLocaleString('en-IN')}` }, { l: 'GST (18%)', v: `₹${gst.toLocaleString('en-IN')}` }, { l: 'Shipping', v: 'Free', c: '#4ade80' }].map(row => (
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
