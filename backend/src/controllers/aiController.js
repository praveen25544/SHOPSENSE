"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiSearch = exports.getRecommendations = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const Product_1 = __importDefault(require("../models/Product"));
const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
const getRecommendations = async (req, res) => {
    try {
        const { cartItems = [], budget = 50000, userName = 'Guest' } = req.body;
        const allProducts = await Product_1.default.find({ isActive: true }).limit(50);
        if (allProducts.length === 0) {
            res.json({ success: true, recommendations: [] });
            return;
        }
        const productList = allProducts
            .map(p => `- ${p.name} (Price: Rs.${p.price}, Category: ${p.category}, Rating: ${p.ratings.average})`)
            .join('\n');
        const prompt = `You are a smart e-commerce AI for ShopSense India.

User: ${userName}
Budget: Rs.${budget}
Cart items: ${cartItems.length > 0 ? cartItems.join(', ') : 'empty'}

Available products:
${productList}

Recommend exactly 6 products within budget. Return ONLY valid JSON array, no other text:
[{"name":"exact product name","reason":"one sentence why","badge":"Best Match|Top Rated|Great Value|Trending|Budget Pick|Premium"}]`;
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192',
            temperature: 0.7,
            max_tokens: 800,
        });
        const content = completion.choices[0]?.message?.content || '[]';
        let recommendations = [];
        try {
            const match = content.match(/\[.*\]/s);
            if (match) {
                const picks = JSON.parse(match[0]);
                recommendations = picks.map(pick => {
                    const product = allProducts.find(p => p.name.toLowerCase().includes(pick.name.toLowerCase().substring(0, 8)));
                    return product ? { ...product.toObject(), aiReason: pick.reason, aiBadge: pick.badge } : null;
                }).filter(Boolean);
            }
        }
        catch {
            recommendations = allProducts
                .sort((a, b) => b.ratings.average - a.ratings.average)
                .slice(0, 6)
                .map(p => ({ ...p.toObject(), aiReason: 'Highly rated by customers', aiBadge: 'Top Rated' }));
        }
        res.json({ success: true, recommendations, model: 'llama3-8b-8192' });
    }
    catch (error) {
        console.error('Groq error:', error);
        // Fallback without Groq
        try {
            const products = await Product_1.default.find({ isActive: true })
                .sort({ 'ratings.average': -1 })
                .limit(6);
            const recommendations = products.map(p => ({
                ...p.toObject(),
                aiReason: 'Highly rated by our customers',
                aiBadge: 'Top Rated'
            }));
            res.json({ success: true, recommendations, model: 'fallback' });
        }
        catch {
            res.status(500).json({ success: false, message: 'AI service unavailable' });
        }
    }
};
exports.getRecommendations = getRecommendations;
const aiSearch = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            res.status(400).json({ success: false, message: 'Query required' });
            return;
        }
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: `Extract search terms from: "${query}". Return ONLY JSON: {"keywords":["word1","word2"],"category":null,"maxPrice":null}` }],
            model: 'llama3-8b-8192',
            temperature: 0.2,
            max_tokens: 150,
        });
        const content = completion.choices[0]?.message?.content || '{}';
        let parsed = { keywords: [query] };
        try {
            const match = content.match(/\{.*\}/s);
            if (match)
                parsed = JSON.parse(match[0]);
        }
        catch { /* use default */ }
        const dbQuery = { isActive: true };
        if (parsed.category)
            dbQuery.category = { $regex: parsed.category, $options: 'i' };
        if (parsed.maxPrice)
            dbQuery.price = { $lte: parsed.maxPrice };
        if (parsed.keywords?.length) {
            dbQuery['$or'] = parsed.keywords.map((kw) => ({
                '$or': [
                    { name: { '$regex': kw, '$options': 'i' } },
                    { description: { '$regex': kw, '$options': 'i' } },
                    { category: { '$regex': kw, '$options': 'i' } }
                ]
            }));
        }
        const products = await Product_1.default.find(dbQuery).limit(20);
        res.json({ success: true, data: products, parsed });
    }
    catch {
        res.status(500).json({ success: false, message: 'AI search failed' });
    }
};
exports.aiSearch = aiSearch;
