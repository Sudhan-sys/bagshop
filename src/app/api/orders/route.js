/**
 * Order Creation API Route
 * 
 * POST /api/orders
 * 
 * This is the ONLY way orders should be created.
 * Client-side code calls this API, which uses server-side functions.
 * This ensures orders can only be created through validated channels.
 */

import { NextResponse } from 'next/server';
import { createOrder, generateOrderId } from '@/lib/orders';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['customerName', 'customerEmail', 'shippingAddress', 'items'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Calculate total from items (server-side validation)
    const calculatedTotal = body.items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || Number(item.qty) || 1;
      return sum + (price * quantity);
    }, 0);

    // Add shipping cost
    const shipping = calculatedTotal >= 1999 ? 0 : 99;
    const totalAmount = calculatedTotal + shipping;

    // Generate order ID server-side
    const orderId = generateOrderId();

    // Create the order
    const result = await createOrder({
      orderId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone || '',
      shippingAddress: body.shippingAddress,
      totalAmount,
      paymentMethod: body.paymentMethod || 'cod',
      items: body.items,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      totalAmount,
      message: result.message,
    });

  } catch (error) {
    console.error('[API/Orders] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
