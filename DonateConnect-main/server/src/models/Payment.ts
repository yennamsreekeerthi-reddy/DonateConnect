import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  donor: Types.ObjectId; // User
  ngo?: Types.ObjectId; // NGOProfile
  amount: number; // in smallest currency unit (paise)
  currency: string; // INR
  method: 'UPI' | 'CARD' | 'NETBANKING';
  provider: 'RAZORPAY' | 'PAYTM' | 'OTHER';
  providerOrderId?: string;
  providerPaymentId?: string;
  status: 'CREATED' | 'PAID' | 'FAILED';
  metadata?: any;
}

const PaymentSchema = new Schema<IPayment>({
  donor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ngo: { type: Schema.Types.ObjectId, ref: 'NGOProfile' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  method: { type: String, enum: ['UPI', 'CARD', 'NETBANKING'], required: true },
  provider: { type: String, enum: ['RAZORPAY', 'PAYTM', 'OTHER'], default: 'RAZORPAY' },
  providerOrderId: { type: String },
  providerPaymentId: { type: String },
  status: { type: String, enum: ['CREATED', 'PAID', 'FAILED'], default: 'CREATED' },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
