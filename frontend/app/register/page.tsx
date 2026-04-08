'use client';
import { useState, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

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

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Praveen Kumar', icon: '👤' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', icon: '📧' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', icon: '🔒' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div className="pulse-glow" style={{ position: 'absolute', top: '10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="pulse-glow" style={{ position: 'absolute', bottom: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,217,61,0.06) 0%, transparent 70%)', borderRadius: '50%', animationDelay: '2s' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 920, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 }}>

        {/* Left: Visual */}
        <div style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.08), rgba(255,217,61,0.05))', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
          <div className="float" style={{ fontSize: 80, textAlign: 'center', marginBottom: 32 }}>🛒</div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 30, fontWeight: 800, marginBottom: 16, textAlign: 'center' }}>
            Join{' '}<span className="gradient-text">ShopSense</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            Get personalised AI picks the moment you sign up. No credit card needed.
          </p>

          {/* Progress steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Create your account', 'AI analyses your taste', 'Get personalised picks'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: i <= step ? 1 : 0.4, transition: 'opacity 0.4s' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i <= step ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--bg-elevated)', border: i > step ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, transition: 'all 0.4s' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 14, color: i <= step ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Floating emojis */}
          {mounted && ['🎁', '⭐', '💎', '🏷️'].map((e, i) => (
            <div key={i} className="float" style={{ position: 'absolute', fontSize: 20, opacity: 0.4, animationDelay: `${i * 0.6}s`, top: `${20 + i * 18}%`, right: `${10 + (i % 2) * 15}%` }}>{e}</div>
          ))}
        </div>

        {/* Right: Form */}
        <div style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 36 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🛍</div>
            <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>ShopSense</span>
          </Link>

          <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Create account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>Free forever — no credit card required</p>

          {error && (
            <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, color: '#ff6b6b', fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {fields.map((field, i) => (
              <div key={field.key} style={{ marginBottom: 20, opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(20px)', transition: `all 0.5s ease ${i * 0.1 + 0.2}s` }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {field.icon} {field.label}
                </label>
                <input
                  className="input-field"
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => { setForm({ ...form, [field.key]: e.target.value }); setStep(i); }}
                  required
                />
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 16, borderRadius: 12, marginTop: 8, background: loading ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent-2), var(--accent-3))', color: loading ? 'var(--text-muted)' : '#0a0a0f' }}>
              {loading ? 'Creating your account...' : 'Join ShopSense Free →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
