import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { RegisterInput, LoginInput } from '../validators/authValidator';

// Generate tokens
const generateAccessToken = (id: string, role: string): string =>
  jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '15m'
  });

const generateRefreshToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: '7d'
  });

// @route POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as RegisterInput;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }

    const user = await User.create({ name, email, password });
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @route POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await User.findOne({ email });
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @route POST /api/auth/refresh
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401).json({ success: false, message: 'No refresh token' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      res.status(401).json({ success: false, message: 'Invalid refresh token' });
      return;
    }

    const newAccessToken = generateAccessToken(user.id, user.role);
    res.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Refresh token expired' });
  }
};

// @route POST /api/auth/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};