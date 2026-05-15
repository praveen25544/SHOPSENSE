'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { style: { position: 'relative', height: 120, overflow: 'hidden', marginBottom: 32 }, children: [_jsx("div", { style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', borderRadius: 1 } }), _jsxs("div", { style: { position: 'absolute', bottom: 2, left: `${pos}%`, transform: 'translateX(-50%)', transition: 'left 0.2s linear' }, children: [_jsx("div", { style: { position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 30, height: 6, background: 'rgba(108,99,255,0.3)', borderRadius: '50%', filter: 'blur(4px)' } }), _jsxs("svg", { width: "48", height: "90", viewBox: "0 0 48 90", fill: "none", children: [_jsx("circle", { cx: "24", cy: "14", r: "12", fill: "var(--accent)", opacity: "0.9" }), _jsx("circle", { cx: "20", cy: "13", r: "2", fill: "white" }), _jsx("circle", { cx: "28", cy: "13", r: "2", fill: "white" }), _jsx("circle", { cx: "21", cy: "13", r: "1", fill: "#0a0a0f" }), _jsx("circle", { cx: "29", cy: "13", r: "1", fill: "#0a0a0f" }), _jsx("path", { d: "M19 18 Q24 22 29 18", stroke: "white", strokeWidth: "1.5", fill: "none", strokeLinecap: "round" }), _jsx("rect", { x: "16", y: "26", width: "16", height: "28", rx: "6", fill: "linear-gradient(180deg, #8b5cf6 0%, var(--accent) 100%)" }), _jsx("rect", { x: "16", y: "26", width: "16", height: "28", rx: "6", fill: "url(#bodyGrad)" }), _jsx("defs", { children: _jsxs("linearGradient", { id: "bodyGrad", x1: "16", y1: "26", x2: "32", y2: "54", gradientUnits: "userSpaceOnUse", children: [_jsx("stop", { stopColor: "#8b5cf6" }), _jsx("stop", { offset: "1", stopColor: "var(--accent)" })] }) }), _jsx("rect", { x: "6", y: "28", width: "8", height: "18", rx: "4", fill: "var(--accent)", transform: `rotate(${lLeg}, 10, 28)` }), _jsx("rect", { x: "34", y: "28", width: "8", height: "18", rx: "4", fill: "var(--accent)", transform: `rotate(${-lLeg}, 38, 28)` }), _jsx("rect", { x: "17", y: "52", width: "8", height: "22", rx: "4", fill: "#6c63ff", transform: `rotate(${rLeg}, 21, 52)` }), _jsx("rect", { x: "23", y: "52", width: "8", height: "22", rx: "4", fill: "#6c63ff", transform: `rotate(${lLeg}, 27, 52)` }), _jsx("rect", { x: "2", y: "34", width: "14", height: "12", rx: "3", fill: "var(--accent-3)", opacity: "0.9" }), _jsx("path", { d: "M5 34 Q5 30 9 30 Q13 30 13 34", stroke: "var(--accent-3)", strokeWidth: "1.5", fill: "none" })] })] }), [15, 35, 55, 75].map((x, i) => (_jsx("div", { style: {
                    position: 'absolute', left: `${x}%`, top: `${20 + (i % 2) * 30}%`,
                    fontSize: 14, animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`, opacity: 0.6
                }, children: ['💰', '⭐', '🎁', '💎'][i] }, i)))] }));
}
export default function LoginPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);
    const handleSubmit = async (e) => {
        var _a, _b;
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', form);
            dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
            router.push('/products');
        }
        catch (err) {
            const error = err;
            setError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Invalid email or password');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { style: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', overflow: 'hidden' }, children: [_jsxs("div", { style: {
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '60px 40px', background: 'linear-gradient(135deg, rgba(108,99,255,0.05) 0%, rgba(255,107,107,0.03) 100%)',
                    borderRight: '1px solid var(--border)', position: 'relative', overflow: 'hidden'
                }, children: [_jsx("div", { className: "pulse-glow", style: { position: 'absolute', top: '15%', left: '20%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)', borderRadius: '50%' } }), _jsx("div", { className: "pulse-glow", style: { position: 'absolute', bottom: '20%', right: '15%', width: 150, height: 150, background: 'radial-gradient(circle, rgba(255,107,107,0.1) 0%, transparent 70%)', borderRadius: '50%', animationDelay: '1.5s' } }), _jsxs("div", { style: { position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 380 }, children: [mounted && _jsx(WalkingCharacter, {}), _jsxs("h2", { style: { fontFamily: 'Syne', fontSize: 32, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }, children: ["Welcome back to", _jsx("br", {}), _jsx("span", { className: "gradient-text", children: "ShopSense" })] }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 40 }, children: "Your AI shopping companion has been busy finding deals just for you. Sign in to see your personalised picks!" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: [
                                    { icon: '🤖', text: 'Groq AI recommendations ready' },
                                    { icon: '🛒', text: 'Cart saved and waiting' },
                                    { icon: '⚡', text: 'Sub-second page loads' },
                                ].map(f => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', textAlign: 'left' }, children: [_jsx("span", { style: { fontSize: 20 }, children: f.icon }), _jsx("span", { style: { color: 'var(--text-secondary)', fontSize: 14 }, children: f.text })] }, f.text))) })] })] }), _jsx("div", { style: { width: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px' }, children: _jsxs("div", { style: { width: '100%', maxWidth: 380, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.2s' }, children: [_jsxs("div", { style: { marginBottom: 40 }, children: [_jsxs(Link, { href: "/", style: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40 }, children: [_jsx("div", { style: { width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }, children: "\uD83D\uDECD" }), _jsx("span", { style: { fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }, children: "ShopSense" })] }), _jsx("h1", { style: { fontFamily: 'Syne', fontSize: 30, fontWeight: 800, marginBottom: 8 }, children: "Sign in" }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 15 }, children: "Welcome back! Enter your details." })] }), error && (_jsxs("div", { style: { background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 12, padding: '13px 16px', marginBottom: 24, color: '#ff6b6b', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("span", { children: "\u26A0\uFE0F" }), " ", error] })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: { marginBottom: 20 }, children: [_jsx("label", { style: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }, children: "Email" }), _jsx("input", { className: "input-field", type: "email", placeholder: "you@example.com", value: form.email, onChange: e => setForm(Object.assign(Object.assign({}, form), { email: e.target.value })), required: true })] }), _jsxs("div", { style: { marginBottom: 28 }, children: [_jsx("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 }, children: _jsx("label", { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }, children: "Password" }) }), _jsx("input", { className: "input-field", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: form.password, onChange: e => setForm(Object.assign(Object.assign({}, form), { password: e.target.value })), required: true })] }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary", style: { width: '100%', padding: '14px', fontSize: 16, borderRadius: 12 }, children: loading ? (_jsxs("span", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }, children: [_jsx("span", { style: { display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' } }), "Signing in..."] })) : 'Sign In →' })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }, children: [_jsx("div", { style: { flex: 1, height: 1, background: 'var(--border)' } }), _jsx("span", { style: { color: 'var(--text-muted)', fontSize: 13 }, children: "or" }), _jsx("div", { style: { flex: 1, height: 1, background: 'var(--border)' } })] }), _jsxs("p", { style: { textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }, children: ["No account yet?", ' ', _jsx(Link, { href: "/register", style: { color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }, children: "Create one free" })] })] }) })] }));
}
