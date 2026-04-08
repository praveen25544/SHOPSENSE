const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ ' + filePath);
}

// ─── src/controllers/aiController.ts ─────────────────────────────────────────
write('src/controllers/aiController.ts', `import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { cartItems = [], budget = 50000 } = req.body;

    const allProducts = await Product.find({ isActive: true }).limit(50);

    if (allProducts.length === 0) {
      res.json({ success: true, recommendations: [] });
      return;
    }

    const productList = allProducts
      .map(p => \`- \${p.name} (Price: Rs.\${p.price}, Category: \${p.category}, Rating: \${p.ratings.average})\`)
      .join('\\n');

    const prompt = \`You are a smart e-commerce AI for ShopSense India.

User: \${user?.name || 'Customer'}
Budget: Rs.\${budget}
Cart items: \${cartItems.length > 0 ? cartItems.join(', ') : 'empty'}

Available products:
\${productList}

Recommend exactly 6 products within budget. Return ONLY valid JSON array, no other text:
[{"name":"exact product name","reason":"one sentence why","badge":"Best Match|Top Rated|Great Value|Trending|Budget Pick|Premium"}]\`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    let recommendations: unknown[] = [];

    try {
      const match = content.match(/\\[.*\\]/s);
      if (match) {
        const picks = JSON.parse(match[0]) as Array<{name: string; reason: string; badge: string}>;
        recommendations = picks.map(pick => {
          const product = allProducts.find(p =>
            p.name.toLowerCase().includes(pick.name.toLowerCase().substring(0, 8).toLowerCase())
          );
          return product ? { ...product.toObject(), aiReason: pick.reason, aiBadge: pick.badge } : null;
        }).filter(Boolean);
      }
    } catch {
      recommendations = allProducts
        .sort((a, b) => b.ratings.average - a.ratings.average)
        .slice(0, 6)
        .map(p => ({ ...p.toObject(), aiReason: 'Highly rated by customers', aiBadge: 'Top Rated' }));
    }

    res.json({ success: true, recommendations, model: 'llama3-8b-8192' });
  } catch (error) {
    console.error('Groq error:', error);
    res.status(500).json({ success: false, message: 'AI service unavailable' });
  }
};

export const aiSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) { res.status(400).json({ success: false, message: 'Query required' }); return; }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: \`Extract search terms from: "\${query}". Return ONLY JSON: {"keywords":["word1","word2"],"category":null,"maxPrice":null}\` }],
      model: 'llama3-8b-8192',
      temperature: 0.2,
      max_tokens: 150,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    let parsed: {keywords?: string[]; category?: string | null; maxPrice?: number | null} = { keywords: [query] };
    try {
      const match = content.match(/\\{.*\\}/s);
      if (match) parsed = JSON.parse(match[0]);
    } catch { /* use default */ }

    const dbQuery: Record<string, unknown> = { isActive: true };
    if (parsed.category) dbQuery.category = { $regex: parsed.category, $options: 'i' };
    if (parsed.maxPrice) dbQuery.price = { $lte: parsed.maxPrice };
    if (parsed.keywords?.length) {
      dbQuery['$or'] = parsed.keywords.map((kw: string) => ({
        '$or': [
          { name: { '$regex': kw, '$options': 'i' } },
          { description: { '$regex': kw, '$options': 'i' } },
          { category: { '$regex': kw, '$options': 'i' } }
        ]
      }));
    }

    const products = await Product.find(dbQuery).limit(20);
    res.json({ success: true, data: products, parsed });
  } catch {
    res.status(500).json({ success: false, message: 'AI search failed' });
  }
};
`);

// ─── src/routes/aiRoutes.ts ───────────────────────────────────────────────────
write('src/routes/aiRoutes.ts', `import { Router } from 'express';
import { getRecommendations, aiSearch } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/recommendations', protect, getRecommendations);
router.post('/search', aiSearch);

export default router;
`);

// ─── Update app.ts ────────────────────────────────────────────────────────────
write('src/app.ts', `import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import aiRoutes from './routes/aiRoutes';
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

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'ShopSense API 🚀' }));
app.use(errorHandler);

export default app;
`);

console.log('\n✅ Backend AI routes ready!');
console.log('Now run: npm run dev');
