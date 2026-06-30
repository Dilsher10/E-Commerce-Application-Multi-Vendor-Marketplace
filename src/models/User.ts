import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'vendor' | 'admin';
  image?: string;
  vendorDetails?: {
    storeName: string;
    description: string;
    isApproved: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    image: { type: String },
    vendorDetails: {
      storeName: { type: String },
      description: { type: String },
      isApproved: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
