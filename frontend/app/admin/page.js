'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAppSelector } from '../../store/hooks';
import api from '../../lib/axios';
export default function AdminPage() {
    const user = useAppSelector(s => s.auth.user);
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('products');
    const [form, setForm] = useState({ name: '', description: '', price: '', category: '', brand: '', stock: '', images: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (user.role !== 'admin') {
            router.push('/products');
            return;
        }
        fetchProducts();
    }, [user, router]);
    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products?limit=100');
            setProducts(data.data);
        }
        catch (_a) { }
        finally {
            setLoading(false);
        }
    };
    const handleAdd = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await api.post('/products', {
                name: form.name, description: form.description,
                price: parseFloat(form.price), category: form.category.toLowerCase(),
                brand: form.brand, stock: parseInt(form.stock),
                images: form.images ? [form.images] : []
            });
            setMessage('✅ Product added successfully!');
            setForm({ name: '', description: '', price: '', category: '', brand: '', stock: '', images: '' });
            fetchProducts();
            setTab('products');
        }
        catch (_a) {
            setMessage('❌ Failed to add product');
        }
        finally {
            setSaving(false);
        }
    };
    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"?`))
            return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p._id !== id));
        }
        catch (_a) {
            alert('Failed to delete');
        }
    };
    return (_jsxs("div", { style: { minHeight: '100vh', background: 'var(--bg)' }, children: [_jsx(Navbar, {}), _jsxs("div", { style: { maxWidth: 1200, margin: '0 auto', padding: '40px 40px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }, children: [_jsxs("div", { children: [_jsx("div", { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }, children: _jsx("div", { style: { background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, padding: '3px 10px', fontSize: 11, color: '#ff6b6b', fontWeight: 700 }, children: "ADMIN" }) }), _jsx("h1", { style: { fontFamily: 'Syne', fontSize: 36, fontWeight: 800 }, children: "Admin Panel" })] }), _jsx("div", { style: { display: 'flex', gap: 8 }, children: [{ key: 'products', label: '📦 Products' }, { key: 'add', label: '+ Add Product' }].map(t => (_jsx("button", { onClick: () => setTab(t.key), style: { padding: '10px 20px', borderRadius: 10, border: `1px solid ${tab === t.key ? 'var(--accent)' : 'var(--border)'}`, background: tab === t.key ? 'rgba(108,99,255,0.15)' : 'transparent', color: tab === t.key ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', fontWeight: tab === t.key ? 600 : 400, transition: 'all 0.2s' }, children: t.label }, t.key))) })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }, children: [
                            { label: 'Total Products', value: products.length, icon: '📦', color: 'var(--accent)' },
                            { label: 'Active', value: products.filter(p => p.isActive).length, icon: '✅', color: '#4ade80' },
                            { label: 'Low Stock', value: products.filter(p => p.stock < 10 && p.stock > 0).length, icon: '⚠️', color: '#ffd93d' },
                            { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, icon: '❌', color: '#ff6b6b' },
                        ].map(stat => (_jsxs("div", { style: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px' }, children: [_jsx("div", { style: { fontSize: 24, marginBottom: 8 }, children: stat.icon }), _jsx("div", { style: { fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: stat.color }, children: stat.value }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }, children: stat.label })] }, stat.label))) }), tab === 'products' && (_jsxs("div", { style: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }, children: [_jsx("div", { style: { padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: _jsxs("h3", { style: { fontFamily: 'Syne', fontWeight: 700, fontSize: 17 }, children: ["All Products (", products.length, ")"] }) }), loading ? (_jsx("div", { style: { padding: 40, textAlign: 'center', color: 'var(--text-muted)' }, children: "Loading..." })) : (_jsx("div", { style: { overflow: 'auto' }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsx("tr", { style: { borderBottom: '1px solid var(--border)' }, children: ['Product', 'Category', 'Brand', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (_jsx("th", { style: { padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }, children: h }, h))) }) }), _jsx("tbody", { children: products.map((p, i) => {
                                                var _a, _b;
                                                return (_jsxs("tr", { style: { borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }, onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-elevated)', onMouseLeave: e => e.currentTarget.style.background = 'transparent', children: [_jsx("td", { style: { padding: '14px 20px', fontWeight: 500, fontSize: 14, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: p.name }), _jsx("td", { style: { padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)', textTransform: 'capitalize' }, children: p.category }), _jsx("td", { style: { padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)' }, children: p.brand }), _jsxs("td", { style: { padding: '14px 20px', fontFamily: 'Syne', fontWeight: 700, fontSize: 15 }, children: ["\u20B9", p.price.toLocaleString('en-IN')] }), _jsx("td", { style: { padding: '14px 20px' }, children: _jsx("span", { style: { fontSize: 13, color: p.stock === 0 ? '#ff6b6b' : p.stock < 10 ? '#ffd93d' : '#4ade80', fontWeight: 600 }, children: p.stock }) }), _jsxs("td", { style: { padding: '14px 20px', fontSize: 13, color: '#ffd93d' }, children: ["\u2605 ", ((_b = (_a = p.ratings) === null || _a === void 0 ? void 0 : _a.average) === null || _b === void 0 ? void 0 : _b.toFixed(1)) || '0.0'] }), _jsx("td", { style: { padding: '14px 20px' }, children: _jsx("button", { onClick: () => handleDelete(p._id, p.name), style: { padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,107,107,0.3)', background: 'rgba(255,107,107,0.08)', color: '#ff6b6b', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }, children: "Delete" }) })] }, p._id));
                                            }) })] }) }))] })), tab === 'add' && (_jsxs("div", { style: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px' }, children: [_jsx("h3", { style: { fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 28 }, children: "Add New Product" }), message && (_jsx("div", { style: { background: message.includes('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,107,0.1)', border: `1px solid ${message.includes('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(255,107,107,0.3)'}`, borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: message.includes('✅') ? '#4ade80' : '#ff6b6b' }, children: message })), _jsxs("form", { onSubmit: handleAdd, children: [_jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }, children: [
                                            { key: 'name', label: 'Product Name', placeholder: 'iPhone 15 Pro', col: 2 },
                                            { key: 'price', label: 'Price (₹)', placeholder: '79999', col: 1 },
                                            { key: 'stock', label: 'Stock', placeholder: '50', col: 1 },
                                            { key: 'category', label: 'Category', placeholder: 'electronics', col: 1 },
                                            { key: 'brand', label: 'Brand', placeholder: 'Apple', col: 1 },
                                            { key: 'images', label: 'Image URL', placeholder: 'https://...', col: 2 },
                                            { key: 'description', label: 'Description', placeholder: 'Product description...', col: 2, isTextarea: true },
                                        ].map(field => (_jsxs("div", { style: { gridColumn: `span ${field.col}` }, children: [_jsx("label", { style: { display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }, children: field.label }), field.isTextarea ? (_jsx("textarea", { className: "input-field", placeholder: field.placeholder, value: form[field.key], onChange: e => setForm(Object.assign(Object.assign({}, form), { [field.key]: e.target.value })), required: true, rows: 3, style: { resize: 'vertical', fontFamily: 'DM Sans' } })) : (_jsx("input", { className: "input-field", placeholder: field.placeholder, value: form[field.key], onChange: e => setForm(Object.assign(Object.assign({}, form), { [field.key]: e.target.value })), required: true, type: ['price', 'stock'].includes(field.key) ? 'number' : 'text' }))] }, field.key))) }), _jsx("button", { type: "submit", disabled: saving, className: "btn-primary", style: { marginTop: 28, padding: '14px 40px', fontSize: 16, borderRadius: 12 }, children: saving ? 'Adding...' : '+ Add Product' })] })] }))] })] }));
}
