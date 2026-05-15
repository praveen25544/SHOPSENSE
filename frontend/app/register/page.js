'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const handleSubmit = async (e) => {
        var _a, _b;
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/register', form);
            dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
            router.push('/products');
        }
        catch (err) {
            const error = err;
            setError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };
    const fields = [
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Praveen Kumar', icon: '👤' },
        { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', icon: '📧' },
        { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', icon: '🔒' },
    ];
    return (_jsxs("div", { style: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }, children: [_jsxs("div", { style: { position: 'fixed', inset: 0, pointerEvents: 'none' }, children: [_jsx("div", { className: "pulse-glow", style: { position: 'absolute', top: '10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)', borderRadius: '50%' } }), _jsx("div", { className: "pulse-glow", style: { position: 'absolute', bottom: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,217,61,0.06) 0%, transparent 70%)', borderRadius: '50%', animationDelay: '2s' } })] }), _jsxs("div", { style: { width: '100%', maxWidth: 920, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 }, children: [_jsxs("div", { style: { background: 'linear-gradient(135deg, rgba(255,107,107,0.08), rgba(255,217,61,0.05))', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }, children: [_jsx("div", { className: "float", style: { fontSize: 80, textAlign: 'center', marginBottom: 32 }, children: "\uD83D\uDED2" }), _jsxs("h2", { style: { fontFamily: 'Syne', fontSize: 30, fontWeight: 800, marginBottom: 16, textAlign: 'center' }, children: ["Join", ' ', _jsx("span", { className: "gradient-text", children: "ShopSense" })] }), _jsx("p", { style: { color: 'var(--text-secondary)', textAlign: 'center', fontSize: 15, lineHeight: 1.7, marginBottom: 40 }, children: "Get personalised AI picks the moment you sign up. No credit card needed." }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: ['Create your account', 'AI analyses your taste', 'Get personalised picks'].map((s, i) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, opacity: i <= step ? 1 : 0.4, transition: 'opacity 0.4s' }, children: [_jsx("div", { style: { width: 28, height: 28, borderRadius: '50%', background: i <= step ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--bg-elevated)', border: i > step ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, transition: 'all 0.4s' }, children: i < step ? '✓' : i + 1 }), _jsx("span", { style: { fontSize: 14, color: i <= step ? 'var(--text-primary)' : 'var(--text-secondary)' }, children: s })] }, s))) }), mounted && ['🎁', '⭐', '💎', '🏷️'].map((e, i) => (_jsx("div", { className: "float", style: { position: 'absolute', fontSize: 20, opacity: 0.4, animationDelay: `${i * 0.6}s`, top: `${20 + i * 18}%`, right: `${10 + (i % 2) * 15}%` }, children: e }, i)))] }), _jsxs("div", { style: { padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }, children: [_jsxs(Link, { href: "/", style: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 36 }, children: [_jsx("div", { style: { width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }, children: "\uD83D\uDECD" }), _jsx("span", { style: { fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }, children: "ShopSense" })] }), _jsx("h1", { style: { fontFamily: 'Syne', fontSize: 28, fontWeight: 800, marginBottom: 6 }, children: "Create account" }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }, children: "Free forever \u2014 no credit card required" }), error && (_jsxs("div", { style: { background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, color: '#ff6b6b', fontSize: 14 }, children: ["\u26A0\uFE0F ", error] })), _jsxs("form", { onSubmit: handleSubmit, children: [fields.map((field, i) => (_jsxs("div", { style: { marginBottom: 20, opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(20px)', transition: `all 0.5s ease ${i * 0.1 + 0.2}s` }, children: [_jsxs("label", { style: { display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }, children: [field.icon, " ", field.label] }), _jsx("input", { className: "input-field", type: field.type, placeholder: field.placeholder, value: form[field.key], onChange: e => { setForm(Object.assign(Object.assign({}, form), { [field.key]: e.target.value })); setStep(i); }, required: true })] }, field.key))), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary", style: { width: '100%', padding: '14px', fontSize: 16, borderRadius: 12, marginTop: 8, background: loading ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent-2), var(--accent-3))', color: loading ? 'var(--text-muted)' : '#0a0a0f' }, children: loading ? 'Creating your account...' : 'Join ShopSense Free →' })] }), _jsxs("p", { style: { textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: 14 }, children: ["Already have an account?", ' ', _jsx(Link, { href: "/login", style: { color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }, children: "Sign in" })] })] })] })] }));
}
