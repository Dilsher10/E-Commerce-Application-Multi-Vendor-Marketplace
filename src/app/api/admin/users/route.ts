import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const users = await User.find().select('-password');

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = getUserFromRequest(req);
    if (!admin || typeof admin === 'string' || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId, approved, action, name, email, role } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await dbConnect();
    let updatedUser;

    if (typeof approved === 'boolean') {
      updatedUser = await User.findOneAndUpdate(
        { _id: userId, role: 'vendor' },
        { $set: { 'vendorDetails.isApproved': approved } },
        { new: true }
      ).select('-password');
    } else if (action === 'edit') {
      if (!name || !email || !['user', 'vendor', 'admin'].includes(role)) {
        return NextResponse.json({ error: 'Valid name, email, and role are required' }, { status: 400 });
      }
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { name: String(name).trim(), email: String(email).trim().toLowerCase(), role } },
        { new: true, runValidators: true }
      ).select('-password');
    } else if (action === 'toggleBan') {
      const existingUser = await User.findById(userId);
      if (!existingUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      existingUser.accountStatus = existingUser.accountStatus === 'banned' ? 'active' : 'banned';
      await existingUser.save();
      updatedUser = await User.findById(userId).select('-password');
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getUserFromRequest(req);
    if (!admin || typeof admin === 'string' || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, email, password, role } = await req.json();
    if (!name || !email || typeof password !== 'string' || password.length < 8 || !['user', 'vendor', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Valid name, email, password, and role are required' }, { status: 400 });
    }

    await dbConnect();
    const normalizedEmail = String(email).trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(String(password), 10),
      role,
      ...(role === 'vendor' ? { vendorDetails: { storeName: String(name).trim(), isApproved: false } } : {}),
    });

    const createdUser = await User.findById(user._id).select('-password');
    return NextResponse.json({ user: createdUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = getUserFromRequest(req);
    if (!admin || typeof admin === 'string' || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    if (String(admin.id) === userId) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    await dbConnect();
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
