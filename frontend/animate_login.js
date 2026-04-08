const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Created: ' + filePath);
}

write('app/login/page.tsx', `'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/authSlice';
import api from '../../lib/axios';

// Walking stick figure SVG frames
const WalkingMan = ({ frame, style }: { frame: number; style?: React.CSSProperties }) => {
  const frames = [
    // Frame 0 - left leg forward
    <svg key={0} width="40" height="60" viewBox="0 0 40 60" fill="none">
      {/* Head */}
      <circle cx="20" cy="8" r="7" stroke="#6c63ff" strokeWidth="2" fill="none"/>
      {/* Body */}
      <line x1="20" y1="15" x2="20" y2="35" stroke="#6c63ff" strokeWidth="2"/>
      {/* Left arm forward */}
      <line x1="20" y1="20" x2="8" y2="28" stroke="#6c63ff" strokeWidth="2"/>
      {/* Right arm back */}
      <line x1="20" y1="20" x2="32" y2="26" stroke="#6c63ff" strokeWidth="2"/>
      {/* Left leg forward */}
      <line x1="20" y1="35" x2="10" y2="50" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="10" y1="50" x2="4" y2="58" stroke="#6c63ff" strokeWidth="2"/>
      {/* Right leg back */}
      <line x1="20" y1="35" x2="28" y2="48" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="28" y1="48" x2="32" y2="58" stroke="#6c63ff" strokeWidth="2"/>
    </svg>,
    // Frame 1 - upright
    <svg key={1} width="40" height="60" viewBox="0 0 40 60" fill="none">
      <circle cx="20" cy="8" r="7" stroke="#6c63ff" strokeWidth="2" fill="none"/>
      <line x1="20" y1="15" x2="20" y2="35" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="20" x2="10" y2="30" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="20" x2="30" y2="30" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="35" x2="16" y2="50" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="16" y1="50" x2="14" y2="58" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="35" x2="24" y2="50" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="24" y1="50" x2="26" y2="58" stroke="#6c63ff" strokeWidth="2"/>
    </svg>,
    // Frame 2 - right leg forward
    <svg key={2} width="40" height="60" viewBox="0 0 40 60" fill="none">
      <circle cx="20" cy="8" r="7" stroke="#6c63ff" strokeWidth="2" fill="none"/>
      <line x1="20" y1="15" x2="20" y2="35" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="20" x2="32" y2="28" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="20" x2="8" y2="26" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="35" x2="30" y2="50" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="30" y1="50" x2="36" y2="58" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="35" x2="12" y2="48" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="12" y1="48" x2="8" y2="58" stroke="#6c63ff" strokeWidth="2"/>
    </svg>,
    // Frame 3 - upright again
    <svg key={3} width="40" height="60" viewBox="0 0 40 60" fill="none">
      <circle cx="20" cy="8" r="7" stroke="#6c63ff" strokeWidth="2" fill="none"/>
      <line x1="20" y1="15" x2="20" y2="35" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="20" x2="10" y2="30" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="20" x2="30" y2="30" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="35" x2="16" y2="50" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="16" y1="50" x2="14" y2="58" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="20" y1="35" x2="24" y2="50" stroke="#6c63ff" strokeWidth="2"/>
      <line x1="24" y1="50" x2="26" y2="58" stroke="#6c63ff" strokeWidth="2"/>
    </svg>,
  ];
  return <div style={style}>{frames[frame % 4]}</div>;
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Animation state
  const [frame, setFrame] = useState(0);
  const [posX, setPosX] = useState(-60); // starts off screen left
  const [opacity, setOpacity] = useState(1);
  const [runAway, setRunAway] = useState(false);

  // Walking animation — cycles frames + moves right
  useEffect(() => {
    if (loggedIn) return;
    const frameTimer = setInterval(() => {
      setFrame(f => (f + 1) % 4);
    }, 180);
    return () => clearInterval(frameTimer);
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) return;
    const moveTimer = setInterval(() => {
      setPosX(x => {
        if (x > window.innerWidth + 60) return -60; // loop back
        return x + 2;
      });
    }, 16);
    return () => clearInterval(moveTimer);
  }, [loggedIn]);

  // Run away animation after login
  useEffect(() => {
    if (!runAway) return;
    let x = posX;
    let op = 1;
    const runTimer = setInterval(() => {
      x += 12;
      op -= 0.03;
      setPosX(x);
      setOpacity(op);
      setFrame(f => (f + 1) % 4);
      if (op <= 0) {
        clearInterval(runTimer);
        setOpacity(0);
      }
    }, 16);
    return () => clearInterval(runTimer);
  }, [runAway]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      setLoggedIn(true);
      setRunAway(true);
      // Navigate after run away animation
      setTimeout(() => router.push('/products'), 1200);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Ground line */}
      <div style={{
        position: 'absolute', bottom: 80, left: 0, right: 0,
        height: 1, background: 'var(--border)'
      }} />

      {/* Walking man */}
      <WalkingMan
        frame={frame}
        style={{
          position: 'absolute',
          bottom: 80,
          left: posX,
          opacity: opacity,
          transition: runAway ? 'none' : 'none',
          filter: 'drop-shadow(0 0 8px rgba(108,99,255,0.4))',
          zIndex: 10
        }}
      />

      {/* Shadow under man */}
      <div style={{
        position: 'absolute',
        bottom: 76,
        left: posX + 8,
        width: 24,
        height: 6,
        background: 'rgba(108,99,255,0.2)',
        borderRadius: '50%',
        filter: 'blur(4px)',
        opacity: opacity,
        transition: 'none'
      }} />

      {/* Small footstep dots */}
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: 78,
          left: posX - 20 - i * 18,
          width: 4,
          height: 2,
          background: 'rgba(108,99,255,0.3)',
          borderRadius: 2,
          opacity: Math.max(0, 0.6 - i * 0.12)
        }} />
      ))}

      {/* Login Card */}
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '48px 40px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 20,
        transform: loggedIn ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            boxShadow: '0 8px 24px rgba(108,99,255,0.3)'
          }}>🛍</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {loggedIn ? 'Welcome back! 👋' : 'Welcome back'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {loggedIn ? 'Redirecting you...' : 'Sign in to your ShopSense account'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 24,
            color: '#ff6b6b', fontSize: 14
          }}>{error}</div>
        )}

        {loggedIn ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <p style={{ color: 'var(--text-secondary)' }}>Taking you to the shop...</p>
            <div style={{
              marginTop: 20, height: 3, borderRadius: 2,
              background: 'var(--bg-elevated)', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', width: '100%',
                background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                animation: 'progress 1.2s ease forwards'
              }} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map((field) => (
              <div key={field.key} style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 500,
                  marginBottom: 8, color: 'var(--text-secondary)'
                }}>
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
              background: loading
                ? 'var(--bg-elevated)'
                : 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              color: loading ? 'var(--text-muted)' : 'white',
              fontFamily: 'Syne', fontWeight: 600, fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', marginTop: 8,
              boxShadow: loading ? 'none' : '0 8px 24px rgba(108,99,255,0.3)'
            }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        )}

        {!loggedIn && (
          <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--text-secondary)', fontSize: 14 }}>
            No account?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Create one free
            </Link>
          </p>
        )}

        {/* Hint about the walking man */}
        <p style={{
          textAlign: 'center', marginTop: 20,
          color: 'var(--text-muted)', fontSize: 11,
          fontStyle: 'italic'
        }}>
          👣 Watch what happens when you sign in...
        </p>
      </div>

      <style>{
        \`@keyframes progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0%); }
        }\`
      }</style>
    </div>
  );
}
`);

console.log('\n🎉 Animated login page created!');
console.log('🚶 Walking man walks across the bottom');
console.log('💨 After login he RUNS off screen and disappears!');
