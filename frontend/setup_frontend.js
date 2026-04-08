const fs = require('fs');
const path = require('path');

const files = {
  'lib/axios.ts': `import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = \`Bearer \${data.accessToken}\`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;`,

  'store/authSlice.ts': `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User { id: string; name: string; email: string; role: string; }
interface AuthState { user: User | null; accessToken: string | null; isAuthenticated: boolean; }

const initialState: AuthState = { user: null, accessToken: null, isAuthenticated: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; accessToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;`,

  'store/cartSlice.ts': `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem { productId: string; name: string; price: number; image: string; quantity: number; }
interface CartState { items: CartItem[]; total: number; }

const initialState: CartState = { items: [], total: 0 };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) { existing.quantity += action.payload.quantity; }
      else { state.items.push(action.payload); }
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.productId !== action.payload);
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find(i => i.productId === action.payload.productId);
      if (item) item.quantity = action.payload.quantity;
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    clearCart(state) { state.items = []; state.total = 0; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;`,

  'store/index.ts': `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: { auth: authReducer, cart: cartReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,

  'store/hooks.ts': `import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);`,

  'app/layout.tsx': `'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '../store';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}`,

  '.env.local': `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
};

// Create directories
['lib', 'store'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Write files
Object.entries(files).forEach(([filePath, content]) => {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Created: ' + filePath);
});

console.log('\n🎉 All files created successfully!');
