import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

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

    const { userId, approved } = await req.json();
    if (!userId || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'User ID and approval status are required' }, { status: 400 });
    }

    await dbConnect();
    const vendor = await User.findOneAndUpdate(
      { _id: userId, role: 'vendor' },
      { $set: { 'vendorDetails.isApproved': approved } },
      { new: true }
    ).select('-password');

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({ user: vendor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
