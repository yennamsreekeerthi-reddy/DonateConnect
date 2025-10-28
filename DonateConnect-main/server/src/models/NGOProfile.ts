import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INGOProfile extends Document {
  user: Types.ObjectId; // reference to User with role NGO
  organizationName: string;
  registrationNumber?: string;
  yearEstablished?: string;
  website?: string;
  contactPhone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  focusAreas?: string[];
  description?: string;
  documents: string[]; // file paths
  verified: boolean;
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  verificationNotes?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}

const NGOProfileSchema = new Schema<INGOProfile>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  organizationName: { type: String, required: true },
  registrationNumber: { type: String },
  yearEstablished: { type: String },
  website: { type: String },
  contactPhone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  focusAreas: [{ type: String }],
  description: { type: String },
  documents: [{ type: String }],
  verified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  verificationNotes: { type: String },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number], index: '2dsphere' },
  },
}, { timestamps: true });

export default mongoose.model<INGOProfile>('NGOProfile', NGOProfileSchema);
