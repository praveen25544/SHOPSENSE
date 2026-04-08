'use client';
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
          transform: mounted ? `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)` : 'none',
          transition: 'transform 0.3s ease'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '20%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(255,107,107,0.06) 0%, transparent 70%)',
          transform: mounted ? `translate(${-mouseX * 0.3}px, ${-mouseY * 0.3}px)` : 'none',
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
          transform: `translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`,
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
