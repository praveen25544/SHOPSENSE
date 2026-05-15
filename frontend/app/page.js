'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        const handleMouse = (e) => {
            setMouseX((e.clientX / window.innerWidth - 0.5) * 20);
            setMouseY((e.clientY / window.innerHeight - 0.5) * 20);
        };
        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, []);
    return (_jsxs("div", { style: { minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }, children: [_jsxs("div", { style: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }, children: [_jsx("div", { style: {
                            position: 'absolute', top: '10%', left: '20%', width: 600, height: 600,
                            background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
                            transform: mounted ? `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)` : 'none',
                            transition: 'transform 0.3s ease'
                        } }), _jsx("div", { style: {
                            position: 'absolute', bottom: '10%', right: '20%', width: 500, height: 500,
                            background: 'radial-gradient(circle, rgba(255,107,107,0.06) 0%, transparent 70%)',
                            transform: mounted ? `translate(${-mouseX * 0.3}px, ${-mouseY * 0.3}px)` : 'none',
                            transition: 'transform 0.3s ease'
                        } })] }), _jsxs("nav", { className: "nav-glass", style: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsx("div", { style: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 20px rgba(108,99,255,0.4)' }, children: "\uD83D\uDECD" }), _jsx("span", { style: { fontFamily: 'Syne', fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }, children: "ShopSense" })] }), _jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: [_jsx(Link, { href: "/products", style: { color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, padding: '8px 16px' }, children: "Products" }), _jsx(Link, { href: "/login", style: { padding: '9px 20px', borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, transition: 'all 0.2s' }, children: "Sign in" }), _jsx(Link, { href: "/register", className: "btn-primary", style: { padding: '9px 20px', fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' }, children: "Get Started \u2192" })] })] }), mounted && FLOATING_PRODUCTS.map((p) => (_jsxs("div", { className: "float", style: {
                    position: 'fixed', left: p.x, top: p.y, zIndex: 1,
                    animationDelay: p.delay,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 16, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)',
                    transform: `translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`,
                    transition: 'transform 0.4s ease'
                }, children: [_jsx("span", { style: { fontSize: 24 }, children: p.emoji }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }, children: p.label }), _jsx("div", { style: { fontSize: 11, color: 'var(--accent)' }, children: p.price })] })] }, p.label))), _jsxs("section", { style: { position: 'relative', zIndex: 2, paddingTop: 160, textAlign: 'center', padding: '160px 40px 80px' }, children: [_jsxs("div", { className: "slide-up", style: { animationDelay: '0.1s', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 100, padding: '6px 18px', marginBottom: 36, fontSize: 13 }, children: [_jsx("span", { style: { display: 'inline-block', animation: 'spin-slow 3s linear infinite', fontSize: 14 }, children: "\u2728" }), _jsx("span", { style: { color: 'var(--accent)', fontWeight: 500 }, children: "Powered by Groq AI \u00B7 Llama3" })] }), _jsxs("h1", { className: "slide-up", style: {
                            animationDelay: '0.2s', fontSize: 'clamp(52px, 9vw, 96px)',
                            fontFamily: 'Syne', fontWeight: 800, lineHeight: 1.0,
                            letterSpacing: '-0.04em', marginBottom: 28, maxWidth: 950, margin: '0 auto 28px'
                        }, children: ["Shop with an AI", _jsx("br", {}), _jsx("span", { className: "shimmer-text", children: "that gets you." })] }), _jsx("p", { className: "slide-up", style: { animationDelay: '0.3s', fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 52px', lineHeight: 1.8 }, children: "Real-time personalised recommendations from Groq AI. Zero wait. Zero guesswork. Just the products you actually want." }), _jsxs("div", { className: "slide-up", style: { animationDelay: '0.4s', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }, children: [_jsx(Link, { href: "/register", className: "btn-primary", style: { padding: '15px 36px', fontSize: 16, borderRadius: 14, textDecoration: 'none', display: 'inline-block' }, children: "Start Shopping Free \u2192" }), _jsx(Link, { href: "/products", style: { padding: '15px 36px', fontSize: 16, borderRadius: 14, border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none', background: 'var(--bg-card)', fontWeight: 500, transition: 'all 0.2s' }, children: "Browse Products" })] }), _jsx("div", { className: "slide-up", style: { animationDelay: '0.5s', display: 'flex', gap: 32, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }, children: ['🔐 JWT Secured', '⚡ Sub-second loads', '🤖 Groq AI', '📦 50+ Products'].map(badge => (_jsx("span", { style: { color: 'var(--text-muted)', fontSize: 13 }, children: badge }, badge))) })] }), _jsx("section", { style: { position: 'relative', zIndex: 2, margin: '60px 0 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }, children: _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: 1100, margin: '0 auto' }, children: STATS.map((s, i) => (_jsxs("div", { style: { padding: '44px 32px', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }, children: [_jsx("div", { style: { fontSize: 28, marginBottom: 8 }, children: s.icon }), _jsx("div", { style: { fontSize: 36, fontFamily: 'Syne', fontWeight: 800, marginBottom: 4 }, className: "gradient-text", children: s.value }), _jsx("div", { style: { color: 'var(--text-secondary)', fontSize: 13 }, children: s.label })] }, s.label))) }) }), _jsxs("section", { style: { position: 'relative', zIndex: 2, maxWidth: 1100, margin: '100px auto', padding: '0 40px' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: 64 }, children: [_jsx("h2", { style: { fontSize: 44, fontFamily: 'Syne', fontWeight: 800, marginBottom: 16 }, children: "Everything you need" }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 17 }, children: "Built with production-grade tech stack" })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }, children: [
                            { icon: '🤖', title: 'Groq AI Picks', desc: 'Llama3-powered recommendations based on your actual behaviour and preferences', color: 'var(--accent)' },
                            { icon: '⚡', title: 'Blazing Fast', desc: 'Next.js ISR + MongoDB compound indexing delivers sub-second page loads every time', color: 'var(--accent-3)' },
                            { icon: '🔐', title: 'Fort Knox Auth', desc: 'JWT refresh rotation, RBAC, Zod validation, Helmet.js — enterprise-grade security', color: 'var(--accent-2)' },
                            { icon: '📱', title: 'Responsive', desc: 'Pixel-perfect on every device from 320px mobile to 4K desktop monitors', color: '#4ade80' },
                            { icon: '🛒', title: 'Smart Cart', desc: 'Redux-powered cart with persistent state, quantity controls, and instant updates', color: '#f472b6' },
                            { icon: '📊', title: 'Real Analytics', desc: 'Track browse history, conversion rates, and personalisation effectiveness', color: '#38bdf8' },
                        ].map(f => (_jsxs("div", { className: "card-hover", style: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 28px' }, children: [_jsx("div", { style: { fontSize: 36, marginBottom: 16, filter: 'drop-shadow(0 0 8px currentColor)' }, children: f.icon }), _jsx("h3", { style: { fontFamily: 'Syne', fontWeight: 700, fontSize: 19, marginBottom: 10, color: f.color }, children: f.title }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }, children: f.desc })] }, f.title))) })] }), _jsx("section", { style: { position: 'relative', zIndex: 2, textAlign: 'center', padding: '80px 40px 120px' }, children: _jsxs("div", { style: { maxWidth: 600, margin: '0 auto', background: 'var(--bg-card)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 28, padding: '64px 48px', boxShadow: '0 0 80px rgba(108,99,255,0.1)' }, children: [_jsx("div", { style: { fontSize: 48, marginBottom: 20 }, children: "\uD83D\uDE80" }), _jsx("h2", { style: { fontSize: 36, fontFamily: 'Syne', fontWeight: 800, marginBottom: 16 }, children: "Ready to shop smarter?" }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: 32, fontSize: 16 }, children: "Join ShopSense \u2014 free forever, powered by AI" }), _jsx(Link, { href: "/register", className: "btn-primary", style: { padding: '15px 40px', fontSize: 16, borderRadius: 14, textDecoration: 'none', display: 'inline-block' }, children: "Create Free Account \u2192" })] }) }), _jsxs("footer", { style: { position: 'relative', zIndex: 2, borderTop: '1px solid var(--border)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: 13 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("span", { style: { fontSize: 16 }, children: "\uD83D\uDECD" }), _jsx("span", { style: { fontFamily: 'Syne', fontWeight: 700, color: 'var(--text-secondary)' }, children: "ShopSense" })] }), _jsxs("span", { children: ["Built by ", _jsx("span", { style: { color: 'var(--accent)' }, children: "Praveenkumar Yalawar" }), " \u00B7 MERN + Groq AI"] }), _jsx("span", { children: "\u00A9 2025" })] })] }));
}
