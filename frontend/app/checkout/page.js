'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearCart } from '../../store/cartSlice';
import api from '../../lib/axios';
export default function CheckoutPage() {
    const { items, total } = useAppSelector(s => s.cart);
    const user = useAppSelector(s => s.auth.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '' });
    useEffect(() => {
        if (!user)
            router.push('/login?redirect=checkout');
        if (items.length === 0 && !success)
            router.push('/cart');
    }, [user, items, router, success]);
    const gst = Math.round(total * 0.18);
    const grandTotal = total + gst;
    const handleOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderItems = items.map(i => ({ product: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image }));
            const { data } = await api.post('/orders', { items: orderItems, shippingAddress: form, paymentMethod: 'COD' });
            setOrderId(data.data._id);
            setSuccess(true);
            dispatch(clearCart());
        }
        catch (err) {
            alert('Failed to place order. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    if (success)
        return (_jsxs("div", { style: { minHeight: '100vh', background: 'var(--bg)' }, children: [_jsx(Navbar, {}), _jsx("div", { style: { maxWidth: 560, margin: '80px auto', padding: '0 40px', textAlign: 'center' }, children: _jsxs("div", { style: { background: 'var(--bg-card)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 28, padding: '60px 48px', boxShadow: '0 0 60px rgba(74,222,128,0.1)' }, children: [_jsx("div", { style: { fontSize: 72, marginBottom: 20, animation: 'bounce-in 0.6s forwards' }, children: "\uD83C\uDF89" }), _jsx("h1", { style: { fontFamily: 'Syne', fontSize: 32, fontWeight: 800, marginBottom: 12, color: '#4ade80' }, children: "Order Placed!" }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: 8, fontSize: 16 }, children: "Your order has been confirmed." }), _jsxs("p", { style: { color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }, children: ["Order ID: ", _jsx("span", { style: { color: 'var(--accent)', fontFamily: 'Syne' }, children: orderId.slice(-8).toUpperCase() })] }), _jsxs("div", { style: { display: 'flex', gap: 12, justifyContent: 'center' }, children: [_jsx("a", { href: "/orders", className: "btn-primary", style: { padding: '12px 24px', borderRadius: 12, textDecoration: 'none', display: 'inline-block', fontSize: 15 }, children: "View Orders" }), _jsx("a", { href: "/products", style: { padding: '12px 24px', borderRadius: 12, border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 15 }, children: "Continue Shopping" })] })] }) })] }));
    return (_jsxs("div", { style: { minHeight: '100vh', background: 'var(--bg)' }, children: [_jsx(Navbar, {}), _jsxs("div", { style: { maxWidth: 1000, margin: '0 auto', padding: '48px 40px' }, children: [_jsx("h1", { style: { fontFamily: 'Syne', fontSize: 36, fontWeight: 800, marginBottom: 8 }, children: "Checkout" }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: 40 }, children: "Almost there! Fill in your delivery details." }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }, children: [_jsxs("form", { onSubmit: handleOrder, children: [_jsxs("div", { style: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px', marginBottom: 24 }, children: [_jsx("h3", { style: { fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 24 }, children: "Delivery Address" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }, children: [
                                                    { key: 'fullName', label: 'Full Name', placeholder: 'Praveen Kumar', col: 2 },
                                                    { key: 'phone', label: 'Phone Number', placeholder: '+91 9876543210', col: 1 },
                                                    { key: 'pincode', label: 'Pincode', placeholder: '412307', col: 1 },
                                                    { key: 'address', label: 'Address', placeholder: '123, Main Street', col: 2 },
                                                    { key: 'city', label: 'City', placeholder: 'Pune', col: 1 },
                                                    { key: 'state', label: 'State', placeholder: 'Maharashtra', col: 1 },
                                                ].map(field => (_jsxs("div", { style: { gridColumn: `span ${field.col}` }, children: [_jsx("label", { style: { display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }, children: field.label }), _jsx("input", { className: "input-field", placeholder: field.placeholder, value: form[field.key], onChange: e => setForm(Object.assign(Object.assign({}, form), { [field.key]: e.target.value })), required: true })] }, field.key))) })] }), _jsxs("div", { style: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 32px', marginBottom: 24 }, children: [_jsx("h3", { style: { fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 16 }, children: "Payment Method" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }, children: [_jsx("div", { style: { width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', border: '3px solid rgba(108,99,255,0.4)', flexShrink: 0 } }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 600, fontSize: 15 }, children: "Cash on Delivery" }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)' }, children: "Pay when your order arrives" })] })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary", style: { width: '100%', padding: '15px', fontSize: 16, borderRadius: 14 }, children: loading ? 'Placing Order...' : `Place Order · ₹${grandTotal.toLocaleString('en-IN')}` })] }), _jsxs("div", { style: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px', position: 'sticky', top: 80 }, children: [_jsx("h3", { style: { fontFamily: 'Syne', fontWeight: 800, fontSize: 18, marginBottom: 20 }, children: "Order Summary" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }, children: items.map(item => (_jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: [_jsx("div", { style: { width: 44, height: 44, borderRadius: 8, background: 'var(--bg-elevated)', overflow: 'hidden', flexShrink: 0 }, children: item.image ? _jsx("img", { src: item.image, alt: "", style: { width: '100%', height: '100%', objectFit: 'cover' } }) : _jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }, children: "\uD83D\uDECD" }) }), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: item.name }), _jsxs("div", { style: { fontSize: 12, color: 'var(--text-muted)' }, children: ["\u00D7", item.quantity] })] }), _jsxs("div", { style: { fontSize: 14, fontFamily: 'Syne', fontWeight: 700, flexShrink: 0 }, children: ["\u20B9", (item.price * item.quantity).toLocaleString('en-IN')] })] }, item.productId))) }), _jsx("div", { style: { height: 1, background: 'var(--border)', marginBottom: 16 } }), [{ l: 'Subtotal', v: `₹${total.toLocaleString('en-IN')}` }, { l: 'GST (18%)', v: `₹${gst.toLocaleString('en-IN')}` }, { l: 'Shipping', v: 'Free', c: '#4ade80' }].map(row => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10 }, children: [_jsx("span", { children: row.l }), _jsx("span", { style: { color: row.c }, children: row.v })] }, row.l))), _jsx("div", { style: { height: 1, background: 'var(--border)', margin: '12px 0' } }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }, children: [_jsx("span", { children: "Total" }), _jsxs("span", { className: "gradient-text", children: ["\u20B9", grandTotal.toLocaleString('en-IN')] })] })] })] })] })] }));
}
