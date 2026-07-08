import { NextRequest, NextResponse } from 'next/server';
import type { UploadApiResponse } from 'cloudinary';
import mongoose from 'mongoose';
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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.findOne({ _id: id, isActive: true })
      .populate('vendor', 'name vendorDetails.storeName')
      .lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

async function uploadProductImage(imageFile: File) {
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

  return uploadResponse.secure_url;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!isVendorSession(user)) {
      return NextResponse.json({ error: 'Unauthorized. Vendors only.' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
    }

    await dbConnect();
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const category = formData.get('category') as string;
    const stock = Number(formData.get('stock'));
    const isActive = formData.get('isActive') === 'on';
    const imageFile = formData.get('image') as File | null;

    if (!title || !description || !category || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ error: 'Stock must be a whole number of 0 or more' }, { status: 400 });
    }

    const update: {
      title: string;
      description: string;
      price: number;
      category: string;
      stock: number;
      isActive: boolean;
      images?: string[];
    } = {
      title,
      description,
      price,
      category,
      stock,
      isActive,
    };

    if (imageFile && imageFile.size > 0) {
      update.images = [await uploadProductImage(imageFile)];
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, vendor: user.id },
      update,
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully', product });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!isVendorSession(user)) {
      return NextResponse.json({ error: 'Unauthorized. Vendors only.' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
    }

    await dbConnect();
    const result = await Product.deleteOne({ _id: id, vendor: user.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
