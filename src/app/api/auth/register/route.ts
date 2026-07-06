import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const {
      name,
      email,
      password,
      role,
      storeName,
      description,
      phone,
      businessType,
      category,
      address,
      city,
      state,
      postalCode,
      country,
    } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    if (role === 'vendor') {
      const requiredVendorFields = {
        storeName,
        phone,
        businessType,
        category,
        address,
        city,
        state,
        postalCode,
        country,
      };
      const missingField = Object.entries(requiredVendorFields).find(([, value]) => !String(value || '').trim());
      if (missingField) {
        return NextResponse.json(
          { error: `${missingField[0]} is required` },
          { status: 400 }
        );
      }
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
        storeName: String(storeName).trim(),
        description: String(description || '').trim(),
        phone: String(phone).trim(),
        businessType: String(businessType).trim(),
        category: String(category).trim(),
        address: String(address).trim(),
        city: String(city).trim(),
        state: String(state).trim(),
        postalCode: String(postalCode).trim(),
        country: String(country).trim(),
        isApproved: false, // Admin approval required
      };
    }

    const newUser = await User.create(userPayload);

    const token = newUser.role === 'vendor'
      ? null
      : signToken({ id: newUser._id, role: newUser.role });

    const response = NextResponse.json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }, { status: 201 });

    if (token) {
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    } else {
      response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
    }

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
