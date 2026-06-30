import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // If Admin, see all orders
    // If Vendor, see orders containing their products
    // If User, see their own orders
    
    let query = {};
    if (user.role === 'user') {
      query = { user: user.id };
    } else if (user.role === 'vendor') {
      query = { 'items.vendor': user.id };
    }

    const orders = await Order.find(query)
      .populate('items.product', 'title images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
