import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  name: string;
  role: string;
  rating: number;
  text: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Individual Donor', 'Corporate Donor', 'NGO Representative', 'Volunteer']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for sorting by creation date
ReviewSchema.index({ createdAt: -1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
