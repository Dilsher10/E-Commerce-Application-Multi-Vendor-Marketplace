import { NextRequest, NextResponse } from 'next/server';
import type { UploadApiResponse } from 'cloudinary';
import type { SortOrder } from 'mongoose';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

type VendorSession = {
  id: string;
  role: 'vendor';
};

function isVendorSession(user: unknown): user is VendorSession {
  if (typeof user !== 'object' || user === null) return false;
  const session = user as Record<string, unknown>;
  return session.role === 'vendor' && typeof session.id === 'string';
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal Server Error';
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category')?.trim();
    const vendor = searchParams.get('vendor')?.trim();
    const search = searchParams.get('search')?.trim();
    const minPriceParam = searchParams.get('minPrice')?.trim();
    const maxPriceParam = searchParams.get('maxPrice')?.trim();
    const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
    const hasMinPrice = minPrice !== undefined && Number.isFinite(minPrice);
    const hasMaxPrice = maxPrice !== undefined && Number.isFinite(maxPrice);
    const sort = searchParams.get('sort')?.trim();

    const query: {
      isActive: boolean;
      category?: string;
      vendor?: string;
      price?: { $gte?: number; $lte?: number };
      $or?: Array<{ title?: RegExp; description?: RegExp; category?: RegExp }>;
    } = { isActive: true };
    if (category) query.category = category;
    if (vendor) query.vendor = vendor;
    if (hasMinPrice || hasMaxPrice) {
      query.price = {};
      if (hasMinPrice) query.price.$gte = minPrice;
      if (hasMaxPrice) query.price.$lte = maxPrice;
    }
    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    const sortOption: Record<string, SortOrder> =
      sort === 'price-low'
        ? { price: 1 }
        : sort === 'price-high'
          ? { price: -1 }
          : sort === 'newest'
            ? { createdAt: -1 }
            : { createdAt: -1 };

    const [products, categories] = await Promise.all([
      Product.find(query).sort(sortOption).populate('vendor', 'name vendorDetails.storeName'),
      Product.distinct('category', { isActive: true }),
    ]);

    return NextResponse.json({ products, categories: categories.filter(Boolean).sort() });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!isVendorSession(user)) {
      return NextResponse.json({ error: 'Unauthorized. Vendors only.' }, { status: 401 });
    }

    await dbConnect();
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const category = formData.get('category') as string;
    const stock = Number(formData.get('stock'));
    const imageFile = formData.get('image') as File | null;

    if (!title || !description || !category || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ error: 'Stock must be a whole number of 0 or more' }, { status: 400 });
    }

    let imageUrl = '';
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResponse = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'lumina_products' },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error('Image upload failed'));
          }
        ).end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    const product = await Product.create({
      vendor: user.id,
      title,
      description,
      price,
      category,
      stock,
      images: imageUrl ? [imageUrl] : [],
    });

    return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
