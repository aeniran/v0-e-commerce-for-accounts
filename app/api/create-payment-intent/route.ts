import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// This is a mock implementation - in production, you would use Stripe's API
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, currency = "usd", orderId } = await request.json()

    if (!amount || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock payment intent creation (replace with actual Stripe integration)
    const mockPaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: "requires_payment_method",
    }

    // Store payment intent in database
    const { error: paymentError } = await supabase.from("payments").insert({
      order_id: orderId,
      stripe_payment_intent_id: mockPaymentIntent.id,
      amount,
      currency,
      status: "pending",
    })

    if (paymentError) {
      console.error("Error storing payment:", paymentError)
      return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
    }

    // Update order with payment intent ID
    await supabase
      .from("orders")
      .update({
        payment_intent_id: mockPaymentIntent.id,
        payment_status: "pending",
      })
      .eq("id", orderId)

    return NextResponse.json({
      clientSecret: mockPaymentIntent.client_secret,
      paymentIntentId: mockPaymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
