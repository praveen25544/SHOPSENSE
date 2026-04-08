const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ ' + filePath);
}

// ─── 1. Product Detail Page ───────────────────────────────────────────────────
write('app/products/[id]/page.tsx', `'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useAppDispatch } from '../../../store/hooks';
import { addToCart } from '../../../store/cartSlice';
import api from '../../../lib/axios';

interface Product {
  _id: string; name: string; price: number; category: string;
  brand: string; images: string[]; ratings: { average: number; count: number };
  stock: number; description: string; tags: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(\`/products/\${id}\`);
        setProduct(data.data);
      } catch { router.push('/products'); }
      finally { setLoading(false); }
    };
    if (id) fetch();
  }, [id, router]);

  const handleAdd = () => {
    if (!product) return;
    dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, image: product.images[0] || '', quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        {[1,2].map(i => <div key={i} style={{ height: 400, background: 'var(--bg-card)', borderRadius: 20, animation: 'shimmer 1.5s infinite' }} />)}
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 36, fontSize: 13, color: 'var(--text-muted)' }}>
          <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
          <span>›</span>
          <a href="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Products</a>
          <span>›</span>
          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{product.category}</span>
          <span>›</span>
          <span style={{ color: 'var(--text-primary)' }}>{product.name.substring(0, 30)}...</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)', height: 400, marginBottom: 16, position: 'relative' }}>
              {product.images[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = 'https://dummyjson.com/image/400x300/008080/ffffff?text=Product'; }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 72 }}>🛍️</div>
              )}
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '4px 12px', fontSize: 12, color: 'var(--text-secondary)', border: '1px solid var(--border)', textTransform: 'capitalize' }}>
                {product.category}
              </div>
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} onClick={() => setSelectedImage(i)} style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: \`2px solid \${selectedImage === i ? 'var(--accent)' : 'var(--border)'}\`, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{product.brand}</div>
            <h1 style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(product.ratings.average) ? '#ffd93d' : 'var(--text-muted)', fontSize: 16 }}>★</span>)}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 40, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: 13, color: '#4ade80', marginLeft: 14 }}>{product.stock > 0 ? \`✓ In Stock (\${product.stock} units)\` : '✗ Out of Stock'}</span>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 15, marginBottom: 28 }}>{product.description}</p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {product.tags.map(tag => (
                  <span key={tag} style={{ padding: '4px 12px', borderRadius: 100, background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{tag}</span>
                ))}
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: 44, height: 44, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, minWidth: 40, textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: 44, height: 44, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock === 0} className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: 16, borderRadius: 12, background: added ? '#4ade80' : undefined, color: added ? '#0a0a0f' : undefined, transition: 'all 0.3s' }}>
                {added ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
              </button>
            </div>

            {/* Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['🔐', 'Secure Payment'], ['🔄', '30-day Returns'], ['⚡', 'Fast Delivery'], ['✓', 'Genuine Product']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

// ─── 2. Order Model ───────────────────────────────────────────────────────────
write('src/models/Order.ts', `import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  gstAmount: number;
  grandTotal: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: String, price: Number, quantity: Number, image: String
  }],
  totalAmount: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  status: { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'pending' },
  shippingAddress: {
    fullName: String, phone: String, address: String,
    city: String, state: String, pincode: String
  },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
`);

// ─── 3. Order Controller ──────────────────────────────────────────────────────
write('src/controllers/orderController.ts', `import { Response } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, paymentMethod = 'COD' } = req.body;
    if (!items?.length) { res.status(400).json({ success: false, message: 'No items in order' }); return; }

    const totalAmount = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
    const gstAmount = Math.round(totalAmount * 0.18);
    const grandTotal = totalAmount + gstAmount;

    const order = await Order.create({
      user: req.user!._id, items, totalAmount, gstAmount, grandTotal,
      shippingAddress, paymentMethod, status: 'confirmed', paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid'
    });

    res.status(201).json({ success: true, data: order, message: 'Order placed successfully! 🎉' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!._id });
    if (!order) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    res.json({ success: true, data: order });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!._id });
    if (!order) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    if (order.status === 'delivered') { res.status(400).json({ success: false, message: 'Cannot cancel delivered order' }); return; }
    order.status = 'cancelled';
    await order.save();
    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin
export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
    res.json({ success: true, data: order });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
`);

// ─── 4. Order Routes ──────────────────────────────────────────────────────────
write('src/routes/orderRoutes.ts', `import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.use(protect); // All order routes require login

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

// Admin only
router.get('/', restrictTo('admin'), getAllOrders);
router.patch('/:id/status', restrictTo('admin'), updateOrderStatus);

export default router;
`);

// ─── 5. Update app.ts ─────────────────────────────────────────────────────────
write('src/app.ts', `import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import aiRoutes from './routes/aiRoutes';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middleware/errorHandler';

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'ShopSense API 🚀', version: '1.0.0' }));
app.use(errorHandler);

export default app;
`);

// ─── 6. Jest config ───────────────────────────────────────────────────────────
write('jest.config.js', `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts'],
  coverageThreshold: { global: { lines: 70 } },
  setupFilesAfterFramework: [],
};
`);

// ─── 7. Auth tests ────────────────────────────────────────────────────────────
write('src/tests/auth.test.ts', `import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/User';

const TEST_DB = process.env.MONGODB_URI || '';

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  await User.deleteMany({ email: /testuser.*@shopsense/ });
  await mongoose.disconnect();
});

describe('Auth API', () => {
  const user = { name: 'Test User', email: 'testuser1@shopsense.com', password: 'test123456' };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/auth/register').send(user);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.user.role).toBe('user');
    });

    it('should not register with duplicate email', async () => {
      const res = await request(app).post('/api/auth/register').send(user);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should not register with invalid email', async () => {
      const res = await request(app).post('/api/auth/register').send({ ...user, email: 'notanemail' });
      expect(res.status).toBe(400);
    });

    it('should not register with short password', async () => {
      const res = await request(app).post('/api/auth/register').send({ ...user, email: 'other@test.com', password: '123' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
    });

    it('should not login with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'nobody@test.com', password: 'test123' });
      expect(res.status).toBe(401);
    });
  });
});
`);

// ─── 8. Product tests ─────────────────────────────────────────────────────────
write('src/tests/product.test.ts', `import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Product from '../models/Product';
import User from '../models/User';

const TEST_DB = process.env.MONGODB_URI || '';
let adminToken = '';
let productId = '';

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
  // Create admin user for tests
  await User.deleteMany({ email: 'admin_test@shopsense.com' });
  const res = await request(app).post('/api/auth/register').send({
    name: 'Admin Test', email: 'admin_test@shopsense.com', password: 'admin123456'
  });
  // Manually set role to admin
  await User.findByIdAndUpdate(res.body.user.id, { role: 'admin' });
  const loginRes = await request(app).post('/api/auth/login').send({ email: 'admin_test@shopsense.com', password: 'admin123456' });
  adminToken = loginRes.body.accessToken;
});

afterAll(async () => {
  await Product.deleteMany({ name: 'Test Product ShopSense' });
  await User.deleteMany({ email: 'admin_test@shopsense.com' });
  await mongoose.disconnect();
});

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return products list', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    it('should support category filter', async () => {
      const res = await request(app).get('/api/products?category=beauty');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should support sorting', async () => {
      const res = await request(app).get('/api/products?sort=price');
      expect(res.status).toBe(200);
    });

    it('should support pagination', async () => {
      const res = await request(app).get('/api/products?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /api/products/categories', () => {
    it('should return categories', async () => {
      const res = await request(app).get('/api/products/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/products (admin)', () => {
    it('should create product with admin token', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', \`Bearer \${adminToken}\`)
        .send({ name: 'Test Product ShopSense', description: 'A test product for unit testing purposes', price: 999, category: 'test', brand: 'TestBrand', stock: 10 });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      productId = res.body.data._id;
    });

    it('should not create product without auth', async () => {
      const res = await request(app).post('/api/products').send({ name: 'Hack', description: 'test', price: 1, category: 'x', brand: 'x', stock: 1 });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return single product', async () => {
      if (!productId) return;
      const res = await request(app).get(\`/api/products/\${productId}\`);
      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(productId);
    });

    it('should return 404 for invalid id', async () => {
      const res = await request(app).get('/api/products/000000000000000000000000');
      expect(res.status).toBe(404);
    });
  });
});
`);

console.log('\n🎉 All files created!');
console.log('\nBackend files:');
console.log('  src/models/Order.ts');
console.log('  src/controllers/orderController.ts');
console.log('  src/routes/orderRoutes.ts');
console.log('  src/app.ts (updated)');
console.log('  src/tests/auth.test.ts');
console.log('  src/tests/product.test.ts');
console.log('\nFrontend files:');
console.log('  app/products/[id]/page.tsx');
