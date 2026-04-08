const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ ' + filePath);
}

// ─── Fix aiRoutes.ts — make recommendations work without login too ─────────────
write('src/routes/aiRoutes.ts', `import { Router } from 'express';
import { getRecommendations, aiSearch } from '../controllers/aiController';

const router = Router();

// No auth required — guest users can also get recommendations
router.post('/recommendations', getRecommendations);
router.post('/search', aiSearch);

export default router;
`);

// Fix aiController to not require user
write('src/controllers/aiController.ts', `import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import Product from '../models/Product';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cartItems = [], budget = 50000, userName = 'Guest' } = req.body;

    const allProducts = await Product.find({ isActive: true }).limit(50);

    if (allProducts.length === 0) {
      res.json({ success: true, recommendations: [] });
      return;
    }

    const productList = allProducts
      .map(p => \`- \${p.name} (Price: Rs.\${p.price}, Category: \${p.category}, Rating: \${p.ratings.average})\`)
      .join('\\n');

    const prompt = \`You are a smart e-commerce AI for ShopSense India.

User: \${userName}
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
            p.name.toLowerCase().includes(pick.name.toLowerCase().substring(0, 8))
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
    // Fallback without Groq
    try {
      const products = await Product.find({ isActive: true })
        .sort({ 'ratings.average': -1 })
        .limit(6);
      const recommendations = products.map(p => ({
        ...p.toObject(),
        aiReason: 'Highly rated by our customers',
        aiBadge: 'Top Rated'
      }));
      res.json({ success: true, recommendations, model: 'fallback' });
    } catch {
      res.status(500).json({ success: false, message: 'AI service unavailable' });
    }
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

console.log('\n✅ Backend fixed! No login required for cart/recommendations.');
console.log('Run: npm run dev');
