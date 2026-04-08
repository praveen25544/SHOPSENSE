const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ ' + filePath);
}

// ─── globals.css ─────────────────────────────────────────────────────────────
write('app/globals.css', `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
@import "tailwindcss";

:root {
  --bg: #0a0a0f;
  --bg-card: #111118;
  --bg-elevated: #18181f;
  --border: rgba(255,255,255,0.07);
  --border-hover: rgba(255,255,255,0.15);
  --accent: #6c63ff;
  --accent-2: #ff6b6b;
  --accent-3: #ffd93d;
  --text-primary: #f0f0f8;
  --text-secondary: #8888aa;
  --text-muted: #44445a;
  --radius: 16px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1,h2,h3,h4,h5,h6 { font-family: 'Syne', sans-serif; letter-spacing: -0.02em; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 3px; }
::selection { background: rgba(108,99,255,0.3); color: white; }

@keyframes float {
  0%,100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-12px) rotate(1deg); }
  66% { transform: translateY(-6px) rotate(-1deg); }
}
@keyframes pulse-glow {
  0%,100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes walk {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(4px) rotate(2deg); }
  75% { transform: translateX(-4px) rotate(-2deg); }
}
@keyframes bounce-in {
  0% { transform: scale(0.3) translateY(40px); opacity: 0; }
  60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes slide-up {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes particle {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
  100% { transform: translateY(-80px) translateX(var(--tx, 20px)) scale(0); opacity: 0; }
}

.float { animation: float 4s ease-in-out infinite; }
.float-delay { animation: float 4s ease-in-out infinite 1.5s; }
.pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
.slide-up { animation: slide-up 0.6s ease forwards; }
.bounce-in { animation: bounce-in 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards; }

.card-hover {
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  border-color: rgba(108,99,255,0.3) !important;
  box-shadow: 0 20px 60px rgba(108,99,255,0.15);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent), #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: 0 0 30px rgba(108,99,255,0.3);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(108,99,255,0.4); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.input-field {
  width: 100%;
  padding: 13px 16px;
  border-radius: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: 'DM Sans', sans-serif;
}
.input-field:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(108,99,255,0.15);
}
.input-field::placeholder { color: var(--text-muted); }

.nav-glass {
  background: rgba(10,10,15,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.shimmer-text {
  background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3), var(--accent));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}
`);

// ─── app/layout.tsx ───────────────────────────────────────────────────────────
write('app/layout.tsx', `'use client';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>ShopSense — AI Shopping</title>
        <meta name="description" content="AI-powered e-commerce with personalised recommendations" />
      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
`);

// ─── app/page.tsx ─────────────────────────────────────────────────────────────
write('app/page.tsx', `'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const FLOATING_PRODUCTS = [
  { emoji: '📱', label: 'iPhone 15', price: '₹79,999', x: '8%', y: '25%', delay: '0s' },
  { emoji: '👟', label: 'Nike Air', price: '₹12,499', x: '82%', y: '20%', delay: '0.5s' },
  { emoji: '⌚', label: 'Apple Watch', price: '₹45,999', x: '5%', y: '65%', delay: '1s' },
  { emoji: '🎧', label: 'AirPods Pro', price: '₹24,999', x: '85%', y: '60%', delay: '1.5s' },
  { emoji: '💻', label: 'MacBook Air', price: '₹1,14,999', x: '15%', y: '82%', delay: '0.8s' },
  { emoji: '📷', label: 'Sony Camera', price: '₹89,999', x: '75%', y: '80%', delay: '1.2s' },
];

const STATS = [
  { value: '50+', label: 'Products', icon: '📦' },
  { value: 'GPT', label: 'AI Powered', icon: '🤖' },
  { value: '< 1s', label: 'Load Time', icon: '⚡' },
  { value: '100%', label: 'Secure', icon: '🔐' },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleMouse = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 20);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Ambient background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '10%', left: '20%', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
          transform: mounted ? \`translate(\${mouseX * 0.5}px, \${mouseY * 0.5}px)\` : 'none',
          transition: 'transform 0.3s ease'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '20%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(255,107,107,0.06) 0%, transparent 70%)',
          transform: mounted ? \`translate(\${-mouseX * 0.3}px, \${-mouseY * 0.3}px)\` : 'none',
          transition: 'transform 0.3s ease'
        }} />
      </div>

      {/* NAV */}
      <nav className="nav-glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 20px rgba(108,99,255,0.4)' }}>🛍</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>ShopSense</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/products" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, padding: '8px 16px' }}>Products</Link>
          <Link href="/login" style={{ padding: '9px 20px', borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, transition: 'all 0.2s' }}>Sign in</Link>
          <Link href="/register" className="btn-primary" style={{ padding: '9px 20px', fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>Get Started →</Link>
        </div>
      </nav>

      {/* Floating product cards */}
      {mounted && FLOATING_PRODUCTS.map((p) => (
        <div key={p.label} className="float" style={{
          position: 'fixed', left: p.x, top: p.y, zIndex: 1,
          animationDelay: p.delay,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          transform: \`translate(\${mouseX * 0.1}px, \${mouseY * 0.1}px)\`,
          transition: 'transform 0.4s ease'
        }}>
          <span style={{ fontSize: 24 }}>{p.emoji}</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{p.label}</div>
            <div style={{ fontSize: 11, color: 'var(--accent)' }}>{p.price}</div>
          </div>
        </div>
      ))}

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 2, paddingTop: 160, textAlign: 'center', padding: '160px 40px 80px' }}>
        <div className="slide-up" style={{ animationDelay: '0.1s', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 100, padding: '6px 18px', marginBottom: 36, fontSize: 13 }}>
          <span style={{ display: 'inline-block', animation: 'spin-slow 3s linear infinite', fontSize: 14 }}>✨</span>
          <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Powered by Groq AI · Llama3</span>
        </div>

        <h1 className="slide-up" style={{
          animationDelay: '0.2s', fontSize: 'clamp(52px, 9vw, 96px)',
          fontFamily: 'Syne', fontWeight: 800, lineHeight: 1.0,
          letterSpacing: '-0.04em', marginBottom: 28, maxWidth: 950, margin: '0 auto 28px'
        }}>
          Shop with an AI
          <br />
          <span className="shimmer-text">that gets you.</span>
        </h1>

        <p className="slide-up" style={{ animationDelay: '0.3s', fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 52px', lineHeight: 1.8 }}>
          Real-time personalised recommendations from Groq AI. Zero wait. Zero guesswork. Just the products you actually want.
        </p>

        <div className="slide-up" style={{ animationDelay: '0.4s', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn-primary" style={{ padding: '15px 36px', fontSize: 16, borderRadius: 14, textDecoration: 'none', display: 'inline-block' }}>
            Start Shopping Free →
          </Link>
          <Link href="/products" style={{ padding: '15px 36px', fontSize: 16, borderRadius: 14, border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none', background: 'var(--bg-card)', fontWeight: 500, transition: 'all 0.2s' }}>
            Browse Products
          </Link>
        </div>

        {/* Trust badges */}
        <div className="slide-up" style={{ animationDelay: '0.5s', display: 'flex', gap: 32, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
          {['🔐 JWT Secured', '⚡ Sub-second loads', '🤖 Groq AI', '📦 50+ Products'].map(badge => (
            <span key={badge} style={{ color: 'var(--text-muted)', fontSize: 13 }}>{badge}</span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ position: 'relative', zIndex: 2, margin: '60px 0 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: 1100, margin: '0 auto' }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: '44px 32px', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 36, fontFamily: 'Syne', fontWeight: 800, marginBottom: 4 }} className="gradient-text">{s.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '100px auto', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 44, fontFamily: 'Syne', fontWeight: 800, marginBottom: 16 }}>Everything you need</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17 }}>Built with production-grade tech stack</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '🤖', title: 'Groq AI Picks', desc: 'Llama3-powered recommendations based on your actual behaviour and preferences', color: 'var(--accent)' },
            { icon: '⚡', title: 'Blazing Fast', desc: 'Next.js ISR + MongoDB compound indexing delivers sub-second page loads every time', color: 'var(--accent-3)' },
            { icon: '🔐', title: 'Fort Knox Auth', desc: 'JWT refresh rotation, RBAC, Zod validation, Helmet.js — enterprise-grade security', color: 'var(--accent-2)' },
            { icon: '📱', title: 'Responsive', desc: 'Pixel-perfect on every device from 320px mobile to 4K desktop monitors', color: '#4ade80' },
            { icon: '🛒', title: 'Smart Cart', desc: 'Redux-powered cart with persistent state, quantity controls, and instant updates', color: '#f472b6' },
            { icon: '📊', title: 'Real Analytics', desc: 'Track browse history, conversion rates, and personalisation effectiveness', color: '#38bdf8' },
          ].map(f => (
            <div key={f.title} className="card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 28px' }}>
              <div style={{ fontSize: 36, marginBottom: 16, filter: 'drop-shadow(0 0 8px currentColor)' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 19, marginBottom: 10, color: f.color }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '80px 40px 120px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: 'var(--bg-card)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 28, padding: '64px 48px', boxShadow: '0 0 80px rgba(108,99,255,0.1)' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontSize: 36, fontFamily: 'Syne', fontWeight: 800, marginBottom: 16 }}>Ready to shop smarter?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 16 }}>Join ShopSense — free forever, powered by AI</p>
          <Link href="/register" className="btn-primary" style={{ padding: '15px 40px', fontSize: 16, borderRadius: 14, textDecoration: 'none', display: 'inline-block' }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 2, borderTop: '1px solid var(--border)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>🛍</span>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--text-secondary)' }}>ShopSense</span>
        </div>
        <span>Built by <span style={{ color: 'var(--accent)' }}>Praveenkumar Yalawar</span> · MERN + Groq AI</span>
        <span>© 2025</span>
      </footer>
    </div>
  );
}
`);

// ─── app/login/page.tsx ───────────────────────────────────────────────────────
write('app/login/page.tsx', `'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/authSlice';
import api from '../../lib/axios';

// Animated walking character using CSS
function WalkingCharacter() {
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 4);
      setPos(p => (p + 2) % 100);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const legs = [
    [0, 20], [10, 0], [0, 20], [-10, 0]
  ];
  const [lLeg, rLeg] = [legs[step][0], legs[step][1]];

  return (
    <div style={{ position: 'relative', height: 120, overflow: 'hidden', marginBottom: 32 }}>
      {/* Ground */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', borderRadius: 1 }} />

      {/* Character */}
      <div style={{ position: 'absolute', bottom: 2, left: \`\${pos}%\`, transform: 'translateX(-50%)', transition: 'left 0.2s linear' }}>
        {/* Shadow */}
        <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 30, height: 6, background: 'rgba(108,99,255,0.3)', borderRadius: '50%', filter: 'blur(4px)' }} />

        <svg width="48" height="90" viewBox="0 0 48 90" fill="none">
          {/* Head */}
          <circle cx="24" cy="14" r="12" fill="var(--accent)" opacity="0.9" />
          {/* Eyes */}
          <circle cx="20" cy="13" r="2" fill="white" />
          <circle cx="28" cy="13" r="2" fill="white" />
          <circle cx="21" cy="13" r="1" fill="#0a0a0f" />
          <circle cx="29" cy="13" r="1" fill="#0a0a0f" />
          {/* Smile */}
          <path d="M19 18 Q24 22 29 18" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Body */}
          <rect x="16" y="26" width="16" height="28" rx="6" fill="linear-gradient(180deg, #8b5cf6 0%, var(--accent) 100%)" />
          <rect x="16" y="26" width="16" height="28" rx="6" fill="url(#bodyGrad)" />
          <defs>
            <linearGradient id="bodyGrad" x1="16" y1="26" x2="32" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          {/* Left arm */}
          <rect x="6" y="28" width="8" height="18" rx="4" fill="var(--accent)" transform={\`rotate(\${lLeg}, 10, 28)\`} />
          {/* Right arm */}
          <rect x="34" y="28" width="8" height="18" rx="4" fill="var(--accent)" transform={\`rotate(\${-lLeg}, 38, 28)\`} />
          {/* Left leg */}
          <rect x="17" y="52" width="8" height="22" rx="4" fill="#6c63ff" transform={\`rotate(\${rLeg}, 21, 52)\`} />
          {/* Right leg */}
          <rect x="23" y="52" width="8" height="22" rx="4" fill="#6c63ff" transform={\`rotate(\${lLeg}, 27, 52)\`} />
          {/* Shopping bag */}
          <rect x="2" y="34" width="14" height="12" rx="3" fill="var(--accent-3)" opacity="0.9" />
          <path d="M5 34 Q5 30 9 30 Q13 30 13 34" stroke="var(--accent-3)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Floating coins */}
      {[15, 35, 55, 75].map((x, i) => (
        <div key={i} style={{
          position: 'absolute', left: \`\${x}%\`, top: \`\${20 + (i % 2) * 30}%\`,
          fontSize: 14, animation: \`float \${2 + i * 0.5}s ease-in-out infinite\`,
          animationDelay: \`\${i * 0.4}s\`, opacity: 0.6
        }}>
          {['💰', '⭐', '🎁', '💎'][i]}
        </div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      router.push('/products');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', overflow: 'hidden' }}>
      {/* Left panel — animated */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px', background: 'linear-gradient(135deg, rgba(108,99,255,0.05) 0%, rgba(255,107,107,0.03) 100%)',
        borderRight: '1px solid var(--border)', position: 'relative', overflow: 'hidden'
      }}>
        {/* Background orbs */}
        <div className="pulse-glow" style={{ position: 'absolute', top: '15%', left: '20%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="pulse-glow" style={{ position: 'absolute', bottom: '20%', right: '15%', width: 150, height: 150, background: 'radial-gradient(circle, rgba(255,107,107,0.1) 0%, transparent 70%)', borderRadius: '50%', animationDelay: '1.5s' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 380 }}>
          {mounted && <WalkingCharacter />}

          <h2 style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            Welcome back to
            <br /><span className="gradient-text">ShopSense</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            Your AI shopping companion has been busy finding deals just for you. Sign in to see your personalised picks!
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🤖', text: 'Groq AI recommendations ready' },
              { icon: '🛒', text: 'Cart saved and waiting' },
              { icon: '⚡', text: 'Sub-second page loads' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', textAlign: 'left' }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ width: '100%', maxWidth: 380, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.2s' }}>
          <div style={{ marginBottom: 40 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛍</div>
              <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>ShopSense</span>
            </Link>
            <h1 style={{ fontFamily: 'Syne', fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Sign in</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Welcome back! Enter your details.</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 12, padding: '13px 16px', marginBottom: 24, color: '#ff6b6b', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              </div>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 16, borderRadius: 12 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
            No account yet?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
`);

// ─── app/register/page.tsx ────────────────────────────────────────────────────
write('app/register/page.tsx', `'use client';
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
            <div key={i} className="float" style={{ position: 'absolute', fontSize: 20, opacity: 0.4, animationDelay: \`\${i * 0.6}s\`, top: \`\${20 + i * 18}%\`, right: \`\${10 + (i % 2) * 15}%\` }}>{e}</div>
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
              <div key={field.key} style={{ marginBottom: 20, opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(20px)', transition: \`all 0.5s ease \${i * 0.1 + 0.2}s\` }}>
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
`);

// ─── app/products/page.tsx ────────────────────────────────────────────────────
write('app/products/page.tsx', `'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { logout } from '../../store/authSlice';
import { useRouter } from 'next/navigation';
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
        <span key={i} style={{ fontSize: 11, color: i <= Math.round(rating) ? '#ffd93d' : 'var(--text-muted)' }}>★</span>
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
        background: 'var(--bg-card)', border: \`1px solid \${hovered ? 'rgba(108,99,255,0.3)' : 'var(--border)'}\`,
        borderRadius: 20, overflow: 'hidden',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 60px rgba(108,99,255,0.15)' : '0 4px 20px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {/* Image */}
      <div style={{ height: 200, background: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }}>
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>🛍️</div>
        )}
        {/* Category badge */}
        <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          {product.category}
        </div>
        {/* Stock badge */}
        {product.stock < 10 && product.stock > 0 && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,107,107,0.2)', border: '1px solid rgba(255,107,107,0.4)', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#ff6b6b' }}>
            Only {product.stock} left!
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{product.brand}</div>
        <h3 style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 15, marginBottom: 8, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
        <StarRating rating={product.ratings.average} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }}>₹{product.price.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: 11, color: product.stock > 0 ? '#4ade80' : '#ff6b6b', marginTop: 2 }}>
              {product.stock > 0 ? '✓ In stock' : '✗ Out of stock'}
            </div>
          </div>
          <button
            onClick={onAdd}
            disabled={product.stock === 0}
            style={{
              padding: '9px 16px', borderRadius: 10, border: 'none',
              background: added ? '#4ade80' : product.stock === 0 ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              color: added ? '#0a0a0f' : product.stock === 0 ? 'var(--text-muted)' : 'white',
              fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              transform: added ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              whiteSpace: 'nowrap'
            }}
          >
            {added ? '✓ Added!' : '+ Cart'}
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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cart = useAppSelector(s => s.cart);
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const params = new URLSearchParams({ sort, limit: '50' });
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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (product: Product) => {
    dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, image: product.images[0] || '', quantity: 1 }));
    setAddedIds(prev => new Set([...prev, product._id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product._id); return n; }), 2000);
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    dispatch(logout());
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* NAV */}
      <nav className="nav-glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛍</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>ShopSense</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/ai-picks" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 10, textDecoration: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
            <span style={{ animation: 'spin-slow 3s linear infinite', display: 'inline-block' }}>✨</span> AI Picks
          </Link>
          {user && <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Hi, {user.name.split(' ')[0]}!</span>}
          <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, textDecoration: 'none', color: 'var(--text-primary)', fontSize: 14, position: 'relative' }}>
            🛒
            {cart.items.length > 0 && (
              <span style={{ background: 'var(--accent)', color: 'white', borderRadius: 100, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, position: 'absolute', top: -6, right: -6, animation: 'bounce-in 0.4s forwards' }}>
                {cart.items.length}
              </span>
            )}
          </Link>
          {user ? (
            <button onClick={handleLogout} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer' }}>Logout</button>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>Sign in</Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: 40, fontWeight: 800, marginBottom: 8 }}>
            All Products
            <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 12 }}>({filtered.length})</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Real products seeded from DummyJSON · AI-enhanced with Groq</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input className="input-field" type="text" placeholder="Search products, brands..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 14, outline: 'none', cursor: 'pointer', minWidth: 160 }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 14, outline: 'none', cursor: 'pointer', minWidth: 160 }}>
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-ratings.average">Top Rated</option>
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
          <button onClick={() => setCategory('')} style={{ padding: '6px 16px', borderRadius: 100, border: \`1px solid \${!category ? 'var(--accent)' : 'var(--border)'}\`, background: !category ? 'rgba(108,99,255,0.15)' : 'transparent', color: !category ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>All</button>
          {categories.slice(0, 8).map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding: '6px 16px', borderRadius: 100, border: \`1px solid \${category === c ? 'var(--accent)' : 'var(--border)'}\`, background: category === c ? 'rgba(108,99,255,0.15)' : 'transparent', color: category === c ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize' }}>{c}</button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ height: 360, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ height: 200, background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-card) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ height: 14, background: 'var(--bg-elevated)', borderRadius: 7, marginBottom: 10, width: '60%' }} />
                  <div style={{ height: 20, background: 'var(--bg-elevated)', borderRadius: 7, marginBottom: 8 }} />
                  <div style={{ height: 14, background: 'var(--bg-elevated)', borderRadius: 7, width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🔍</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 22, marginBottom: 8 }}>No products found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try a different search or category</p>
            <button onClick={() => { setSearch(''); setCategory(''); }} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', fontSize: 14 }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {filtered.map(product => (
              <ProductCard key={product._id} product={product} onAdd={() => handleAdd(product)} added={addedIds.has(product._id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`);

// ─── app/ai-picks/page.tsx ────────────────────────────────────────────────────
write('app/ai-picks/page.tsx', `'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import api from '../../lib/axios';

interface AiProduct {
  _id: string; name: string; price: number; category: string;
  brand: string; images: string[]; ratings: { average: number; count: number };
  stock: number; aiReason: string; aiBadge: string;
}

const BADGE_COLORS: Record<string, string> = {
  'Best Match': '#6c63ff', 'Top Rated': '#ffd93d', 'Great Value': '#4ade80',
  'Trending': '#ff6b6b', 'Budget Pick': '#38bdf8', 'Premium': '#f472b6'
};

export default function AiPicksPage() {
  const [recommendations, setRecommendations] = useState<AiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState('50000');
  const [asked, setAsked] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const cart = useAppSelector(s => s.cart);
  const dispatch = useAppDispatch();

  const getRecommendations = async () => {
    setLoading(true); setAsked(true);
    try {
      const cartItems = cart.items.map(i => i.name);
      const { data } = await api.post('/ai/recommendations', { budget: parseInt(budget), cartItems });
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
      <nav className="nav-glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛍</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>ShopSense</span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/products" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, padding: '8px 16px' }}>← Products</Link>
          <Link href="/cart" style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, textDecoration: 'none', color: 'var(--text-primary)', fontSize: 14 }}>
            🛒 {cart.items.length > 0 ? cart.items.length : ''}
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 64, marginBottom: 20, animation: 'float 3s ease-in-out infinite' }}>🤖</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 48, fontWeight: 800, marginBottom: 16 }}>
            Your <span className="gradient-text">AI Picks</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 520, margin: '0 auto 40px' }}>
            Powered by Groq · Llama3-8b · Ultra-fast inference
          </p>

          {/* Budget input */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 20px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Budget:</span>
              <span style={{ color: 'var(--accent)', fontFamily: 'Syne', fontWeight: 700 }}>₹</span>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 16, fontFamily: 'Syne', fontWeight: 600, width: 100, outline: 'none' }}
              />
            </div>
            <button onClick={getRecommendations} disabled={loading} className="btn-primary" style={{ padding: '14px 32px', fontSize: 16, borderRadius: 14 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />
                  Groq is thinking...
                </span>
              ) : '✨ Get AI Picks'}
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 20, animation: 'spin-slow 2s linear infinite', display: 'inline-block' }}>⚡</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 22, marginBottom: 8 }}>Groq AI is analysing...</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Llama3 is finding the perfect picks for you</p>
          </div>
        )}

        {!loading && asked && recommendations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 22, marginBottom: 8 }}>No recommendations yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Make sure your backend is running and Groq API key is set</p>
          </div>
        )}

        {!loading && recommendations.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <span style={{ fontSize: 20 }}>✨</span>
              <h2 style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 700 }}>Groq picked {recommendations.length} products for you</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {recommendations.map((product, i) => (
                <div key={product._id} className="card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', animation: 'slide-up 0.5s ease forwards', animationDelay: \`\${i * 0.1}s\`, opacity: 0 }}>
                  <div style={{ height: 180, background: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }}>
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 40 }}>🛍️</div>
                    )}
                    {/* AI Badge */}
                    <div style={{ position: 'absolute', top: 12, left: 12, background: BADGE_COLORS[product.aiBadge] || 'var(--accent)', color: ['Top Rated', 'Great Value'].includes(product.aiBadge) ? '#0a0a0f' : 'white', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>
                      {product.aiBadge}
                    </div>
                  </div>
                  <div style={{ padding: '18px 20px 20px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{product.brand}</div>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 10, lineHeight: 1.3 }}>{product.name}</h3>
                    {/* AI reason */}
                    <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, padding: '10px 12px', marginBottom: 16, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      🤖 {product.aiReason}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }}>₹{product.price.toLocaleString('en-IN')}</span>
                      <button onClick={() => handleAdd(product)} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: addedIds.has(product._id) ? '#4ade80' : 'linear-gradient(135deg, var(--accent), #8b5cf6)', color: addedIds.has(product._id) ? '#0a0a0f' : 'white', fontFamily: 'Syne', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
                        {addedIds.has(product._id) ? '✓ Added!' : '+ Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
`);

// ─── app/cart/page.tsx ────────────────────────────────────────────────────────
write('app/cart/page.tsx', `'use client';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../store/cartSlice';

export default function CartPage() {
  const { items, total } = useAppSelector(s => s.cart);
  const dispatch = useAppDispatch();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="nav-glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛍</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>ShopSense</span>
        </Link>
        <Link href="/products" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 10 }}>
          ← Continue Shopping
        </Link>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 40px' }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 40, fontWeight: 800, marginBottom: 8 }}>Your Cart</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>
          {items.length === 0 ? 'Nothing here yet' : \`\${items.reduce((s, i) => s + i.quantity, 0)} items · ₹\${total.toLocaleString('en-IN')} total\`}
        </p>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }}>
            <div style={{ fontSize: 64, marginBottom: 20, animation: 'float 3s ease-in-out infinite' }}>🛒</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 24, marginBottom: 12 }}>Your cart is empty</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Discover amazing products picked by AI</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/products" className="btn-primary" style={{ padding: '12px 28px', fontSize: 15, borderRadius: 12, textDecoration: 'none', display: 'inline-block' }}>Browse Products</Link>
              <Link href="/ai-picks" style={{ padding: '12px 28px', fontSize: 15, borderRadius: 12, border: '1px solid rgba(108,99,255,0.3)', color: 'var(--accent)', textDecoration: 'none', background: 'rgba(108,99,255,0.08)' }}>✨ AI Picks</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
            {/* Items */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                {items.map((item, i) => (
                  <div key={item.productId} className="card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px', display: 'flex', gap: 16, alignItems: 'center', animation: 'slide-up 0.4s ease forwards', animationDelay: \`\${i * 0.08}s\`, opacity: 0 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 12, background: 'var(--bg-elevated)', overflow: 'hidden', flexShrink: 0 }}>
                      {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 28 }}>🛍️</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.name}</h4>
                      <span style={{ color: 'var(--accent)', fontFamily: 'Syne', fontWeight: 700, fontSize: 18 }}>₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <button onClick={() => item.quantity > 1 ? dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 })) : dispatch(removeFromCart(item.productId))} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: 36, height: 36, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>−</button>
                        <span style={{ fontFamily: 'Syne', fontWeight: 700, minWidth: 28, textAlign: 'center', fontSize: 15 }}>{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: 36, height: 36, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                      <button onClick={() => dispatch(removeFromCart(item.productId))} style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10, color: '#ff6b6b', cursor: 'pointer', width: 36, height: 36, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>✕</button>
                    </div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, minWidth: 80, textAlign: 'right' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => dispatch(clearCart())} style={{ padding: '8px 18px', borderRadius: 10, border: '1px solid rgba(255,107,107,0.3)', background: 'rgba(255,107,107,0.05)', color: '#ff6b6b', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
                Clear all
              </button>
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, position: 'sticky', top: 80 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, marginBottom: 24 }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 14 }}>
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 14 }}>
                  <span>Shipping</span><span style={{ color: '#4ade80', fontWeight: 600 }}>Free ✓</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 14 }}>
                  <span>Tax (18% GST)</span>
                  <span>₹{Math.round(total * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ height: 1, background: 'var(--border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Syne', fontWeight: 800, fontSize: 22 }}>
                  <span>Total</span>
                  <span className="gradient-text">₹{Math.round(total * 1.18).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: 16, borderRadius: 14 }}>
                Proceed to Checkout →
              </button>
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['🔐 SSL Encrypted', '🔄 Free Returns', '⚡ Fast Delivery'].map(badge => (
                  <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 12 }}>
                    <span>{badge}</span>
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

console.log('\n🎉 All ShopSense UI files created!');
console.log('\nPages:');
console.log('  / → Animated landing with floating products + mouse parallax');
console.log('  /login → Walking character animation + smooth form');
console.log('  /register → Split screen with progress steps');
console.log('  /products → Full grid with skeleton loading + hover animations');
console.log('  /ai-picks → Groq AI recommendations page');
console.log('  /cart → Animated cart with GST calculation');
