'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        try {
            await api.post('/auth/logout');
        }
        catch (_a) { }
        dispatch(logout());
        router.push('/');
    };
    return (_jsxs("nav", { className: "nav-glass", style: {
            position: 'sticky', top: 0, zIndex: 50,
            padding: '0 40px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', height: 68
        }, children: [_jsxs(Link, { href: "/", style: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }, children: [_jsx("div", { style: { width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, boxShadow: '0 0 16px rgba(108,99,255,0.35)' }, children: "\uD83D\uDECD" }), _jsx("span", { style: { fontFamily: 'Syne', fontWeight: 800, fontSize: 19, color: 'var(--text-primary)', letterSpacing: '-0.03em' }, children: "ShopSense" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(Link, { href: "/products", style: { padding: '8px 14px', borderRadius: 10, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }, children: "Products" }), _jsxs(Link, { href: "/ai-picks", style: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, textDecoration: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }, children: [_jsx("span", { style: { display: 'inline-block', animation: 'spin-slow 3s linear infinite' }, children: "\u2728" }), " AI Picks"] }), _jsxs(Link, { href: "/cart", style: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, textDecoration: 'none', color: 'var(--text-primary)', fontSize: 14, position: 'relative' }, children: ["\uD83D\uDED2 Cart", cart.items.length > 0 && (_jsx("span", { style: { background: 'var(--accent)', color: 'white', borderRadius: 100, minWidth: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, padding: '0 5px', animation: 'bounce-in 0.3s forwards' }, children: cart.items.reduce((s, i) => s + i.quantity, 0) }))] }), user ? (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10 }, children: [_jsx("div", { style: { width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }, children: user.name.charAt(0).toUpperCase() }), _jsx("span", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: user.name.split(' ')[0] })] }), _jsx("button", { onClick: handleLogout, style: { padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }, children: "Logout" })] })) : (_jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsx(Link, { href: "/login", style: { padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, transition: 'all 0.2s' }, children: "Sign in" }), _jsx(Link, { href: "/register", className: "btn-primary", style: { padding: '8px 18px', fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' }, children: "Register" })] }))] })] }));
}
