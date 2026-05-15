"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Generate tokens
const generateAccessToken = (id, role) => jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m'
});
const generateRefreshToken = (id) => jsonwebtoken_1.default.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
});
// @route POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email already registered' });
            return;
        }
        const user = await User_1.default.create({ name, email, password });
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);
        // Save refresh token to DB
        user.refreshToken = refreshToken;
        await user.save();
        // Send refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(201).json({
            success: true,
            accessToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.register = register;
// @route POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            success: true,
            accessToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.login = login;
// @route POST /api/auth/refresh
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            res.status(401).json({ success: false, message: 'No refresh token' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User_1.default.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            res.status(401).json({ success: false, message: 'Invalid refresh token' });
            return;
        }
        const newAccessToken = generateAccessToken(user.id, user.role);
        res.json({ success: true, accessToken: newAccessToken });
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Refresh token expired' });
    }
};
exports.refreshToken = refreshToken;
// @route POST /api/auth/logout
const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const user = await User_1.default.findOne({ refreshToken: token });
            if (user) {
                user.refreshToken = undefined;
                await user.save();
            }
        }
        res.clearCookie('refreshToken');
        res.json({ success: true, message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.logout = logout;
