import dbConnect from '@/lib/db';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import VendorNewProductForm from '@/components/VendorNewProductForm';

async function getCategories() {
  await dbConnect();
  const [storedCategories, productCategories] = await Promise.all([
    Category.find({ isActive: true }).select('name').sort({ name: 1 }).lean(),
    Product.distinct('category', { isActive: true }),
  ]);

  return Array.from(new Set([
    ...storedCategories.flatMap((category) => category.name ? [category.name] : []),
    ...productCategories.filter((category): category is string => Boolean(category)),
  ])).sort();
}

export default async function NewVendorProductPage() {
  const categories = await getCategories();

  return <VendorNewProductForm categories={categories} />;
}
