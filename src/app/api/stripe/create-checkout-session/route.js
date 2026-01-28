import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createOrder, generateOrderId } from '@/lib/orders';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customerEmail, customerName, shippingAddress, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in checkout' }, { status: 400 });
    }

    // 1. Create a "Pending" Order in our DB first
    const orderId = generateOrderId();
    
    // Create line items for Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          description: item.variant ? `Variant: ${item.variant}` : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects paisa
      },
      quantity: item.quantity,
    }));

    // Add shipping if applicable (simple logic: matches frontend)
    // Note: We trust the totalAmount passed for logic consistent with frontend, 
    // but ideally re-calculate.
    // Here we just add a "Shipping" line item if total > item sum
    const itemTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingCost = totalAmount - itemTotal;
    
    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Shipping Charges',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create order in DB (Pending Payment)
    const orderResult = await createOrder({
      orderId,
      customerName,
      customerEmail,
      customerPhone: body.customerPhone || '',
      shippingAddress,
      totalAmount,
      paymentMethod: 'stripe',
      items,
      status: 'pending_payment' // Ensure this status is handled in your orders lib
    });

    if (!orderResult.success) {
      console.error('Order creation failed:', orderResult.error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // 2. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-success?id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
      customer_email: customerEmail,
      client_reference_id: orderId,
      metadata: {
        orderId: orderId,
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });

  } catch (err) {
    console.error('[Stripe] Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
