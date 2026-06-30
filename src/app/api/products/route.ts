import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const vendor = searchParams.get('vendor');

    let query: any = { isActive: true };
    if (category) query.category = category;
    if (vendor) query.vendor = vendor;

    const products = await Product.find(query).populate('vendor', 'name vendorDetails.storeName');
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized. Vendors only.' }, { status: 401 });
    }

    await dbConnect();
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const stock = parseInt(formData.get('stock') as string);
    const imageFile = formData.get('image') as File | null;

    if (!title || !description || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl = '';
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'lumina_products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
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
      stock: stock || 0,
      images: imageUrl ? [imageUrl] : [],
    });

    return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
