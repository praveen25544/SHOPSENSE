'use client';
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
