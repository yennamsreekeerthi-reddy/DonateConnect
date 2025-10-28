import mongoose, { Schema, Document } from 'mongoose';

export type Role = 'DONOR' | 'NGO' | 'ADMIN';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['DONOR', 'NGO', 'ADMIN'], default: 'DONOR' },
}, { timestamps: { createdAt: true, updatedAt: true } });

export default mongoose.model<IUser>('User', UserSchema);
