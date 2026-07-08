import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal Server Error';
}

function isAdmin(req: NextRequest) {
  const user = getUserFromRequest(req);
  return Boolean(user && typeof user !== 'string' && user.role === 'admin');
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 }).lean();

    return NextResponse.json({ categories });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, description } = await req.json();
    const categoryName = String(name || '').trim();
    const slug = slugify(categoryName);

    if (!categoryName || !slug) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    await dbConnect();
    const category = await Category.create({
      name: categoryName,
      slug,
      description: String(description || '').trim(),
      isActive: true,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    const status = message.includes('duplicate key') ? 409 : 500;
    return NextResponse.json({ error: status === 409 ? 'Category already exists' : message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, name, description, isActive } = await req.json();
    const categoryName = String(name || '').trim();
    const slug = slugify(categoryName);

    if (!id || !categoryName || !slug) {
      return NextResponse.json({ error: 'Category id and name are required' }, { status: 400 });
    }

    await dbConnect();
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: categoryName,
        slug,
        description: String(description || '').trim(),
        isActive: Boolean(isActive),
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    const status = message.includes('duplicate key') ? 409 : 500;
    return NextResponse.json({ error: status === 409 ? 'Category already exists' : message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Category id is required' }, { status: 400 });
    }

    await dbConnect();
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      return NextResponse.json(
        { error: 'This category is used by products. Deactivate it instead of deleting it.' },
        { status: 409 }
      );
    }

    await Category.deleteOne({ _id: id });

    return NextResponse.json({ message: 'Category deleted' });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
