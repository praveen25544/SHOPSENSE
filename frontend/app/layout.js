'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '../store';
export default function RootLayout({ children }) {
    return (_jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("title", { children: "ShopSense \u2014 AI Shopping" }), _jsx("meta", { name: "description", content: "AI-powered e-commerce with personalised recommendations" })] }), _jsx("body", { children: _jsx(Provider, { store: store, children: children }) })] }));
}
