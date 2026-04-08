import express, { Application } from 'express';
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
