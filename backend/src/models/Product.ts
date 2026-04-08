import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
  isActive: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, lowercase: true, trim: true },
    brand: { type: String, required: true, trim: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },
    tags: [{ type: String, lowercase: true }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Compound indexes for fast queries — this is what gives us the 
// performance metrics on the resume
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ isActive: 1, category: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);