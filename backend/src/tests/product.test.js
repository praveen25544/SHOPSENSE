"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const TEST_DB = process.env.MONGODB_URI || '';
let adminToken = '';
let productId = '';
beforeAll(async () => {
    await mongoose_1.default.connect(TEST_DB);
    // Create admin user for tests
    await User_1.default.deleteMany({ email: 'admin_test@shopsense.com' });
    const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
        name: 'Admin Test', email: 'admin_test@shopsense.com', password: 'admin123456'
    });
    // Manually set role to admin
    await User_1.default.findByIdAndUpdate(res.body.user.id, { role: 'admin' });
    const loginRes = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email: 'admin_test@shopsense.com', password: 'admin123456' });
    adminToken = loginRes.body.accessToken;
});
afterAll(async () => {
    await Product_1.default.deleteMany({ name: 'Test Product ShopSense' });
    await User_1.default.deleteMany({ email: 'admin_test@shopsense.com' });
    await mongoose_1.default.disconnect();
});
describe('Products API', () => {
    describe('GET /api/products', () => {
        it('should return products list', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/api/products');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.pagination).toBeDefined();
        });
        it('should support category filter', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/api/products?category=beauty');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
        it('should support sorting', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/api/products?sort=price');
            expect(res.status).toBe(200);
        });
        it('should support pagination', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/api/products?page=1&limit=5');
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeLessThanOrEqual(5);
        });
    });
    describe('GET /api/products/categories', () => {
        it('should return categories', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/api/products/categories');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
    describe('POST /api/products (admin)', () => {
        it('should create product with admin token', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Test Product ShopSense', description: 'A test product for unit testing purposes', price: 999, category: 'test', brand: 'TestBrand', stock: 10 });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            productId = res.body.data._id;
        });
        it('should not create product without auth', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/products').send({ name: 'Hack', description: 'test', price: 1, category: 'x', brand: 'x', stock: 1 });
            expect(res.status).toBe(401);
        });
    });
    describe('GET /api/products/:id', () => {
        it('should return single product', async () => {
            if (!productId)
                return;
            const res = await (0, supertest_1.default)(app_1.default).get(`/api/products/${productId}`);
            expect(res.status).toBe(200);
            expect(res.body.data._id).toBe(productId);
        });
        it('should return 404 for invalid id', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/api/products/000000000000000000000000');
            expect(res.status).toBe(404);
        });
    });
});
