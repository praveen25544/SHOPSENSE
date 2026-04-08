import request from 'supertest';
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
