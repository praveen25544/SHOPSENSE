'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAppSelector } from '../../store/hooks';
import api from '../../lib/axios';
const STATUS_CONFIG = {
    pending: { color: '#ffd93d', bg: 'rgba(255,217,61,0.1)', icon: '⏳' },
    confirmed: { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', icon: '✓' },
    shipped: { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', icon: '🚚' },
    delivered: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', icon: '✅' },
    cancelled: { color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', icon: '✕' },
};
export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useAppSelector(s => s.auth.user);
    const router = useRouter();
    useEffect(() => {
        if (!user) {
            router.push('/login?redirect=orders');
            return;
        }
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/my');
                setOrders(data.data);
            }
            catch (_a) {
                setOrders([]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, router]);
    const handleCancel = async (orderId) => {
        if (!confirm('Cancel this order?'))
            return;
        try {
            await api.patch(`/orders/${orderId}/cancel`);
            setOrders(prev => prev.map(o => o._id === orderId ? Object.assign(Object.assign({}, o), { status: 'cancelled' }) : o));
        }
        catch (_a) {
            alert('Failed to cancel order');
        }
    };
    return (_jsxs("div", { style: { minHeight: '100vh', background: 'var(--bg)' }, children: [_jsx(Navbar, {}), _jsxs("div", { style: { maxWidth: 900, margin: '0 auto', padding: '48px 40px' }, children: [_jsxs("div", { style: { marginBottom: 40 }, children: [_jsx("h1", { style: { fontFamily: 'Syne', fontSize: 38, fontWeight: 800, marginBottom: 8 }, children: "My Orders" }), _jsxs("p", { style: { color: 'var(--text-secondary)' }, children: [orders.length, " order", orders.length !== 1 ? 's' : '', " total"] })] }), loading ? (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 16 }, children: [1, 2, 3].map(i => _jsx("div", { style: { height: 120, background: 'var(--bg-card)', borderRadius: 16, animation: 'shimmer 1.5s infinite' } }, i)) })) : orders.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '80px 0', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24 }, children: [_jsx("div", { style: { fontSize: 64, marginBottom: 20 }, children: "\uD83D\uDCE6" }), _jsx("h3", { style: { fontFamily: 'Syne', fontSize: 24, fontWeight: 800, marginBottom: 12 }, children: "No orders yet" }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: 32 }, children: "Start shopping to see your orders here" }), _jsx("a", { href: "/products", className: "btn-primary", style: { padding: '12px 28px', borderRadius: 12, textDecoration: 'none', display: 'inline-block', fontSize: 15 }, children: "Shop Now \u2192" })] })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: orders.map((order, i) => {
                            var _a;
                            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                            return (_jsxs("div", { style: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 28px', animation: 'slide-up 0.4s ease forwards', animationDelay: `${i * 0.08}s`, opacity: 0 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }, children: [_jsxs("div", { children: [_jsxs("div", { style: { fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 4 }, children: ["Order #", order._id.slice(-8).toUpperCase()] }), _jsxs("div", { style: { fontSize: 13, color: 'var(--text-muted)' }, children: [new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), ((_a = order.shippingAddress) === null || _a === void 0 ? void 0 : _a.city) && ` · ${order.shippingAddress.city}, ${order.shippingAddress.state}`] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsxs("div", { style: { background: status.bg, color: status.color, borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx("span", { children: status.icon }), _jsx("span", { style: { textTransform: 'capitalize' }, children: order.status })] }), _jsxs("div", { style: { fontFamily: 'Syne', fontWeight: 800, fontSize: 18 }, children: ["\u20B9", order.grandTotal.toLocaleString('en-IN')] })] })] }), _jsxs("div", { style: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }, children: [order.items.slice(0, 4).map((item, j) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)', borderRadius: 10, padding: '8px 12px', fontSize: 13 }, children: [item.image && _jsx("img", { src: item.image, alt: "", style: { width: 28, height: 28, borderRadius: 6, objectFit: 'cover' } }), _jsxs("span", { style: { color: 'var(--text-secondary)' }, children: [item.name.substring(0, 20), item.name.length > 20 ? '...' : ''] }), _jsxs("span", { style: { color: 'var(--text-muted)' }, children: ["\u00D7", item.quantity] })] }, j))), order.items.length > 4 && _jsxs("div", { style: { display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 10, fontSize: 13, color: 'var(--text-muted)' }, children: ["+", order.items.length - 4, " more"] })] }), _jsxs("div", { style: { display: 'flex', gap: 10 }, children: [_jsxs("div", { style: { fontSize: 12, color: 'var(--text-muted)', padding: '6px 12px', background: 'var(--bg-elevated)', borderRadius: 8 }, children: ["\uD83D\uDCB3 ", order.paymentMethod] }), ['pending', 'confirmed'].includes(order.status) && (_jsx("button", { onClick: () => handleCancel(order._id), style: { fontSize: 12, color: '#ff6b6b', padding: '6px 12px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 8, cursor: 'pointer' }, children: "Cancel Order" }))] })] }, order._id));
                        }) }))] })] }));
}
