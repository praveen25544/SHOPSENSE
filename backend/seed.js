const mongoose = require('mongoose');
const https = require('https');
require('dotenv').config();

// Simple Product Schema inline
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  brand: String,
  images: [String],
  stock: Number,
  ratings: { average: Number, count: Number },
  tags: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Fetch from DummyJSON
    console.log('📦 Fetching products from DummyJSON...');
    const data = await fetchJSON('https://dummyjson.com/products?limit=50&skip=0');
    const products = data.products;

    const mapped = products.map(p => ({
      name: p.title,
      description: p.description,
      price: Math.round(p.price * 83), // Convert USD to INR
      category: p.category.toLowerCase().replace(/-/g, ' '),
      brand: p.brand || 'ShopSense',
      images: p.images || [p.thumbnail],
      stock: p.stock || Math.floor(Math.random() * 100) + 10,
      ratings: {
        average: p.rating || 4.0,
        count: Math.floor(Math.random() * 500) + 50
      },
      tags: p.tags || [p.category],
      isActive: true
    }));

    await Product.insertMany(mapped);
    console.log(`✅ Seeded ${mapped.length} products!`);

    // Show categories
    const cats = [...new Set(mapped.map(p => p.category))];
    console.log('📂 Categories:', cats.join(', '));

    await mongoose.disconnect();
    console.log('\n🎉 Database seeded successfully!');
    console.log('🚀 Start your backend: npm run dev');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seed();
