"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
const User_1 = __importDefault(require("../models/User"));
const TEST_DB = process.env.MONGODB_URI || '';
beforeAll(async () => {
    await mongoose_1.default.connect(TEST_DB);
});
afterAll(async () => {
    await User_1.default.deleteMany({ email: /testuser.*@shopsense/ });
    await mongoose_1.default.disconnect();
});
describe('Auth API', () => {
    const user = { name: 'Test User', email: 'testuser1@shopsense.com', password: 'test123456' };
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(user);
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.accessToken).toBeDefined();
            expect(res.body.user.email).toBe(user.email);
            expect(res.body.user.role).toBe('user');
        });
        it('should not register with duplicate email', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(user);
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
        it('should not register with invalid email', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({ ...user, email: 'notanemail' });
            expect(res.status).toBe(400);
        });
        it('should not register with short password', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({ ...user, email: 'other@test.com', password: '123' });
            expect(res.status).toBe(400);
        });
    });
    describe('POST /api/auth/login', () => {
        it('should login with correct credentials', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email: user.email, password: user.password });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.accessToken).toBeDefined();
        });
        it('should not login with wrong password', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email: user.email, password: 'wrongpassword' });
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
        it('should not login with non-existent email', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email: 'nobody@test.com', password: 'test123' });
            expect(res.status).toBe(401);
        });
    });
});
