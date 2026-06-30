import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total and prepare Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);

    // Get origin for success/cancel URLs
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      customer_email: user.email, // If we had email in JWT payload. We didn't, but let's assume we do or omit.
      metadata: {
        userId: user.id,
      },
    });

    // Create a pending order in DB
    await Order.create({
      user: user.id,
      items: items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        vendor: item.vendor,
      })),
      totalAmount,
      stripeSessionId: session.id,
      status: 'pending',
      shippingAddress: {
        line1: 'Pending',
        city: 'Pending',
        state: 'Pending',
        postal_code: 'Pending',
        country: 'Pending',
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
