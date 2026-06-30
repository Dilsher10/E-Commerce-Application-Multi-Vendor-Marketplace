import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password, role, storeName, description } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userPayload: any = {
      name,
      email,
      password: hashedPassword,
      role: role === 'vendor' ? 'vendor' : 'user',
    };

    if (role === 'vendor' && storeName) {
      userPayload.vendorDetails = {
        storeName,
        description: description || '',
        isApproved: false, // Admin approval required
      };
    }

    const newUser = await User.create(userPayload);

    const token = signToken({ id: newUser._id, role: newUser.role });

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
