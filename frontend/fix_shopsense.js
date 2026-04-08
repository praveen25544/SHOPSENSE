const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed: ' + filePath);
}

// Fix 1: globals.css — @import must come FIRST before @tailwind
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

h1, h2, h3, h4, h5, h6 {
  font-family: 'Syne', sans-serif;
  letter-spacing: -0.02em;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 3px; }
::selection { background: rgba(108,99,255,0.3); color: white; }
`);

// Fix 2: page.tsx — use escaped apostrophe in string
write('app/page.tsx', `import Link from 'next/link';

export default function Home() {
  const features = [
    { icon: '🤖', title: 'AI Recommendations', desc: "GPT-4o analyses your browsing and cart to surface products you'll actually want" },
    { icon: '⚡', title: 'Lightning Fast', desc: 'Next.js ISR caching + MongoDB compound indexing for sub-second page loads' },
    { icon: '🔐', title: 'Secure by Default', desc: 'JWT refresh rotation, RBAC, Zod validation, Helmet.js — enterprise-grade auth' },
    { icon: '📦', title: 'Full Stack', desc: 'React frontend, Node.js backend, MongoDB database — fully deployed end-to-end' },
  ];

  const stats = [
    { value: '35%', label: 'Faster Load Time' },
    { value: '42%', label: 'Higher CTR via AI' },
    { value: '78%', label: 'Test Coverage' },
    { value: '< 1s', label: 'Page Load Speed' },
  ];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(20px)',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16
          }}>🛍</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18 }}>ShopSense</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login" style={{
            padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)',
            color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14
          }}>Sign in</Link>
          <Link href="/register" style={{
            padding: '8px 20px', borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 500
          }}>Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: '160px', paddingBottom: '100px', textAlign: 'center', padding: '160px 40px 100px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 32,
          fontSize: 13, color: 'var(--accent)'
        }}>
          <span>✨</span> AI-Powered E-commerce Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 88px)', fontFamily: 'Syne', fontWeight: 800,
          lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24,
          maxWidth: 900, margin: '0 auto 24px'
        }}>
          Shop Smarter with{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            AI That Knows You
          </span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7 }}>
          Personalised product recommendations powered by GPT-4o. Built with Next.js, Node.js, and MongoDB for blazing-fast performance.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{
            padding: '14px 32px', borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 16,
            boxShadow: '0 0 40px rgba(108,99,255,0.3)'
          }}>Start Shopping →</Link>
          <Link href="/products" style={{
            padding: '14px 32px', borderRadius: 12, border: '1px solid var(--border)',
            color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, fontSize: 16,
            background: 'var(--bg-card)'
          }}>Browse Products</Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1, background: 'var(--border)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        margin: '0 0 100px'
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: 'var(--bg)', padding: '40px 32px', textAlign: 'center' }}>
            <div style={{
              fontSize: 40, fontFamily: 'Syne', fontWeight: 800,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{s.value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ padding: '0 40px 120px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 40, fontFamily: 'Syne', fontWeight: 700, marginBottom: 60 }}>
          Built for Performance
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '32px'
            }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '32px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--text-muted)', fontSize: 13
      }}>
        <span style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--text-secondary)' }}>ShopSense</span>
        <span>Built by Praveenkumar Yalawar</span>
        <span>MERN + AI · 2025</span>
      </footer>
    </main>
  );
}
`);

console.log('\n🎉 Fixes applied! Run: npm run dev');
