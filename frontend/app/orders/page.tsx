'use client';
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
      await api.patch(`/orders/${orderId}/cancel`);
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
                <div key={order._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 28px', animation: 'slide-up 0.4s ease forwards', animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {order.shippingAddress?.city && ` · ${order.shippingAddress.city}, ${order.shippingAddress.state}`}
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
