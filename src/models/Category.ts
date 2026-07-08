import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const existingCategoryModel = mongoose.models.Category as Model<ICategory> | undefined;

if (existingCategoryModel) {
  existingCategoryModel.schema.add(CategorySchema.obj);
}

export const Category: Model<ICategory> =
  existingCategoryModel || mongoose.model<ICategory>('Category', CategorySchema);
