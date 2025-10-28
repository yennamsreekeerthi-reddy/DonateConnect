import mongoose, { Schema, Document, Types } from 'mongoose';

export type DonationType = 'BOOKS' | 'CLOTHES' | 'FOOD' | 'MONEY' | 'OTHER';
export type DonationStatus = 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED' | 'COMPLETED' | 'REJECTED';

export interface IDonation extends Document {
  donor?: Types.ObjectId; // User (optional for guest donations)
  ngo?: Types.ObjectId; // NGOProfile or User with NGO role
  type: DonationType;
  amount?: number; // For MONEY donations
  quantity?: number;
  description?: string; // Renamed from notes
  pickupRequired?: boolean; // New field
  pickupOption?: 'HOME_PICKUP' | 'DROP_OFF';
  pickupAddress?: string; // Renamed from address
  address?: string; // Keep for backward compatibility
  pickupDate?: Date;
  contactPhone?: string;
  status: DonationStatus;
  paymentMethod?: string; // UPI, CARD, NETBANKING, WALLET
  paymentAmount?: number;
  transactionId?: string;
  paymentDetails?: any;
  paidAt?: Date;
  createdAt: Date;
}

const DonationSchema = new Schema<IDonation>({
  donor: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // Allow guest donations
  ngo: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User with NGO role
  type: { type: String, enum: ['BOOKS', 'CLOTHES', 'FOOD', 'MONEY', 'OTHER'], required: true },
  amount: { type: Number }, // For MONEY donations
  quantity: { type: Number },
  description: { type: String }, // Renamed from notes
  pickupRequired: { type: Boolean, default: false }, // New field
  pickupOption: { type: String, enum: ['HOME_PICKUP', 'DROP_OFF'] },
  pickupAddress: { type: String }, // Renamed from address
  address: { type: String }, // Keep for backward compatibility
  pickupDate: { type: Date },
  contactPhone: { type: String },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'PICKED_UP', 'DELIVERED', 'COMPLETED', 'REJECTED'], default: 'PENDING' },
  paymentMethod: { type: String }, // UPI, CARD, NETBANKING, WALLET
  paymentAmount: { type: Number },
  transactionId: { type: String },
  paymentDetails: { type: Schema.Types.Mixed },
  paidAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<IDonation>('Donation', DonationSchema);
