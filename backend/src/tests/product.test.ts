import request from 'supertest';
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
        .set('Authorization', `Bearer ${adminToken}`)
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
      const res = await request(app).get(`/api/products/${productId}`);
      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(productId);
    });

    it('should return 404 for invalid id', async () => {
      const res = await request(app).get('/api/products/000000000000000000000000');
      expect(res.status).toBe(404);
    });
  });
});
