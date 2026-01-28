import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateOrderStatus } from '@/lib/orders';

export async function POST(request) {
  try {
    const { session_id, order_id } = await request.json();

    if (!session_id || !order_id) {
      return NextResponse.json({ error: 'Missing session or order ID' }, { status: 400 });
    }

    // Retrieve session from Stripe to verify status
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      // Update order to paid
      await updateOrderStatus(order_id, 'paid', {
        stripe_session_id: session_id,
        payment_intent: session.payment_intent,
      });

      return NextResponse.json({ success: true, message: 'Payment verified' });
    } else {
      return NextResponse.json({ success: false, message: 'Payment not completed' });
    }

  } catch (err) {
    console.error('[Stripe] Verify Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
