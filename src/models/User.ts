import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'vendor' | 'admin';
  accountStatus: 'active' | 'banned';
  image?: string;
  vendorDetails?: {
    storeName: string;
    description: string;
    phone: string;
    businessType: string;
    category: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
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
    accountStatus: { type: String, enum: ['active', 'banned'], default: 'active' },
    image: { type: String },
    vendorDetails: {
      storeName: { type: String },
      description: { type: String },
      phone: { type: String },
      businessType: { type: String },
      category: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
      isApproved: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const existingUserModel = mongoose.models.User as Model<IUser> | undefined;

// Keep the cached development model in sync when fields are added during HMR.
if (existingUserModel) {
  existingUserModel.schema.add(UserSchema.obj);
}

export const User: Model<IUser> =
  existingUserModel || mongoose.model<IUser>('User', UserSchema);
