'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import api from '../../lib/axios';
const BADGE_COLORS = {
    'Best Match': { bg: 'rgba(108,99,255,0.2)', color: '#6c63ff' },
    'Top Rated': { bg: 'rgba(255,217,61,0.2)', color: '#ffd93d' },
    'Great Value': { bg: 'rgba(74,222,128,0.2)', color: '#4ade80' },
    'Trending': { bg: 'rgba(255,107,107,0.2)', color: '#ff6b6b' },
    'Budget Pick': { bg: 'rgba(56,189,248,0.2)', color: '#38bdf8' },
    'Premium': { bg: 'rgba(244,114,182,0.2)', color: '#f472b6' },
};
export default function AiPicksPage() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [budget, setBudget] = useState('50000');
    const [asked, setAsked] = useState(false);
    const [addedIds, setAddedIds] = useState(new Set());
    const [dots, setDots] = useState('');
    const cart = useAppSelector(s => s.cart);
    const user = useAppSelector(s => s.auth.user);
    const dispatch = useAppDispatch();
    // Animate loading dots
    useEffect(() => {
        if (!loading)
            return;
        const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
        return () => clearInterval(interval);
    }, [loading]);
    const getRecommendations = async () => {
        setLoading(true);
        setAsked(true);
        try {
            const cartItems = cart.items.map(i => i.name);
            const { data } = await api.post('/ai/recommendations', {
                budget: parseInt(budget),
                cartItems,
                userName: (user === null || user === void 0 ? void 0 : user.name) || 'Guest'
            });
            setRecommendations(data.recommendations || []);
        }
        catch (_a) {
            setRecommendations([]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAdd = (product) => {
        dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, image: product.images[0] || '', quantity: 1 }));
        setAddedIds(prev => new Set([...prev, product._id]));
        setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product._id); return n; }), 2000);
    };
    return (_jsxs("div", { style: { minHeight: '100vh', background: 'var(--bg)' }, children: [_jsx(Navbar, {}), _jsxs("div", { style: { maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: 60 }, children: [_jsxs("div", { style: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 100, padding: '6px 18px', marginBottom: 24, fontSize: 13, color: 'var(--accent)' }, children: [_jsx("span", { style: { animation: 'spin-slow 2s linear infinite', display: 'inline-block' }, children: "\u26A1" }), "Groq \u00B7 Llama3-8b-8192 \u00B7 Ultra-fast inference"] }), _jsxs("h1", { style: { fontFamily: 'Syne', fontSize: 52, fontWeight: 800, lineHeight: 1.05, marginBottom: 16 }, children: ["AI Picks ", _jsx("span", { className: "gradient-text", children: "Just for You" })] }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 17, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }, children: "Tell Groq your budget and it instantly recommends the best products from our catalogue." }), _jsxs("div", { style: { display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }, children: [_jsx("span", { style: { padding: '13px 16px', color: 'var(--accent)', fontFamily: 'Syne', fontWeight: 700, fontSize: 16, borderRight: '1px solid var(--border)' }, children: "\u20B9" }), _jsx("input", { type: "number", value: budget, onChange: e => setBudget(e.target.value), placeholder: "Budget", style: { background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 16, fontFamily: 'Syne', fontWeight: 600, width: 120, outline: 'none', padding: '13px 16px' } })] }), _jsx("button", { onClick: getRecommendations, disabled: loading, className: "btn-primary", style: { padding: '14px 36px', fontSize: 16, borderRadius: 14 }, children: loading ? (_jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("span", { style: { display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' } }), "Groq thinking", dots] })) : '✨ Get My AI Picks' })] }), !user && (_jsxs("p", { style: { marginTop: 16, color: 'var(--text-muted)', fontSize: 13 }, children: ["No login required \u00B7 ", _jsx("a", { href: "/login", style: { color: 'var(--accent)', textDecoration: 'none' }, children: "Sign in" }), " for personalised results"] }))] }), loading && (_jsxs("div", { style: { textAlign: 'center', padding: '60px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }, children: [_jsx("div", { style: { fontSize: 56, marginBottom: 20, animation: 'spin-slow 2s linear infinite', display: 'inline-block' }, children: "\uD83E\uDD16" }), _jsxs("h3", { style: { fontFamily: 'Syne', fontSize: 24, marginBottom: 10 }, children: ["Groq AI is working", dots] }), _jsxs("p", { style: { color: 'var(--text-secondary)', fontSize: 15 }, children: ["Analysing ", cart.items.length > 0 ? 'your cart and' : '', " finding the best products within \u20B9", parseInt(budget).toLocaleString('en-IN')] }), _jsx("div", { style: { display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }, children: [0, 1, 2].map(i => (_jsx("div", { style: { width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'float 1s ease-in-out infinite', animationDelay: `${i * 0.2}s` } }, i))) })] })), !loading && asked && recommendations.length === 0 && (_jsxs("div", { style: { textAlign: 'center', padding: '60px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }, children: [_jsx("div", { style: { fontSize: 48, marginBottom: 16 }, children: "\uD83E\uDD14" }), _jsx("h3", { style: { fontFamily: 'Syne', fontSize: 22, marginBottom: 8 }, children: "No recommendations returned" }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 14 }, children: "Check your Groq API key in backend .env or try again" })] })), !loading && recommendations.length > 0 && (_jsxs(_Fragment, { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("span", { style: { fontSize: 22 }, children: "\u2728" }), _jsxs("div", { children: [_jsxs("h2", { style: { fontFamily: 'Syne', fontSize: 22, fontWeight: 700 }, children: ["Groq found ", recommendations.length, " picks for you"] }), _jsxs("p", { style: { color: 'var(--text-secondary)', fontSize: 13 }, children: ["Budget: \u20B9", parseInt(budget).toLocaleString('en-IN')] })] })] }), _jsx("button", { onClick: getRecommendations, style: { padding: '9px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }, children: "\uD83D\uDD04 Refresh" })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 24 }, children: recommendations.map((product, i) => {
                                    var _a;
                                    const badge = BADGE_COLORS[product.aiBadge] || BADGE_COLORS['Best Match'];
                                    return (_jsxs("div", { style: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', animation: 'slide-up 0.5s ease forwards', animationDelay: `${i * 0.08}s`, opacity: 0, transition: 'transform 0.3s, border-color 0.3s' }, onMouseEnter: e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; }, onMouseLeave: e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }, children: [_jsxs("div", { style: { height: 180, background: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }, children: [product.images[0]
                                                        ? _jsx("img", { src: product.images[0], alt: product.name, style: { width: '100%', height: '100%', objectFit: 'cover' }, onError: e => { e.target.style.display = 'none'; } })
                                                        : _jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 44 }, children: "\uD83D\uDECD\uFE0F" }), _jsx("div", { style: { position: 'absolute', top: 12, left: 12, background: badge.bg, border: `1px solid ${badge.color}44`, color: badge.color, borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700 }, children: product.aiBadge }), _jsx("div", { style: { position: 'absolute', top: 12, right: 12, background: 'rgba(10,10,15,0.8)', borderRadius: 8, padding: '4px 10px', fontSize: 10, color: 'var(--text-secondary)', border: '1px solid var(--border)' }, children: product.category })] }), _jsxs("div", { style: { padding: '16px 18px 20px' }, children: [_jsx("div", { style: { fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }, children: product.brand }), _jsx("h3", { style: { fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 12, lineHeight: 1.3 }, children: product.name }), _jsxs("div", { style: { background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 10, padding: '10px 12px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }, children: [_jsx("span", { style: { fontSize: 14, flexShrink: 0 }, children: "\uD83E\uDD16" }), _jsx("p", { style: { fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }, children: product.aiReason })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("div", { children: [_jsxs("div", { style: { fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }, children: ["\u20B9", product.price.toLocaleString('en-IN')] }), _jsx("div", { style: { fontSize: 11, color: '#ffd93d', marginTop: 2 }, children: '★'.repeat(Math.round(((_a = product.ratings) === null || _a === void 0 ? void 0 : _a.average) || 4)) })] }), _jsx("button", { onClick: () => handleAdd(product), style: { padding: '10px 20px', borderRadius: 10, border: 'none', background: addedIds.has(product._id) ? '#4ade80' : 'linear-gradient(135deg, var(--accent), #8b5cf6)', color: addedIds.has(product._id) ? '#0a0a0f' : 'white', fontFamily: 'Syne', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)', transform: addedIds.has(product._id) ? 'scale(1.05)' : 'scale(1)' }, children: addedIds.has(product._id) ? '✓ Added!' : '+ Add to Cart' })] })] })] }, product._id));
                                }) }), cart.items.length > 0 && (_jsxs("div", { style: { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-card)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 16, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', animation: 'bounce-in 0.4s forwards', zIndex: 100 }, children: [_jsxs("span", { style: { color: 'var(--text-secondary)', fontSize: 14 }, children: ["\uD83D\uDED2 ", _jsx("span", { style: { color: 'var(--text-primary)', fontWeight: 600 }, children: cart.items.reduce((s, i) => s + i.quantity, 0) }), " items \u00B7 ", _jsxs("span", { style: { color: 'var(--accent)', fontWeight: 700 }, children: ["\u20B9", cart.total.toLocaleString('en-IN')] })] }), _jsx("a", { href: "/cart", className: "btn-primary", style: { padding: '9px 20px', fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' }, children: "View Cart \u2192" })] }))] }))] })] }));
}
