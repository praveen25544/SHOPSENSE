import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  gstAmount: number;
  grandTotal: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: String, price: Number, quantity: Number, image: String
  }],
  totalAmount: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  status: { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'pending' },
  shippingAddress: {
    fullName: String, phone: String, address: String,
    city: String, state: String, pincode: String
  },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
