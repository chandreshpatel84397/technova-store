import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  brand: string;
  reviews: number;
  features: string[];
  tags: string[];
  badge: string;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  thumbnail: { type: String, required: true },
  images: [{ type: String }],
  brand: { type: String, required: true },
  reviews: { type: Number, default: 0 },
  features: [{ type: String }],
  tags: [{ type: String }],
  badge: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
