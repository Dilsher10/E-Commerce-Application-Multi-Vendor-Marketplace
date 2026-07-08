import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';

export async function GET() {
  await dbConnect();

  const [storedCategories, productCategories] = await Promise.all([
    Category.find({ isActive: true }).select('name slug description').sort({ name: 1 }).lean(),
    Product.distinct('category', { isActive: true }),
  ]);

  const existingNames = new Set(storedCategories.map((category) => category.name));
  const fallbackCategories = productCategories
    .filter((category): category is string => Boolean(category) && !existingNames.has(category))
    .sort()
    .map((category) => ({ name: category, slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'), description: '' }));

  return NextResponse.json({ categories: [...storedCategories, ...fallbackCategories] });
}
