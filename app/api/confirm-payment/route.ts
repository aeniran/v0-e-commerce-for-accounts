import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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

    const { paymentIntentId, orderId } = await request.json()

    if (!paymentIntentId || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock payment confirmation (replace with actual Stripe webhook handling)
    const mockPaymentSuccess = Math.random() > 0.1 // 90% success rate for demo

    if (mockPaymentSuccess) {
      // Update payment status
      await supabase.from("payments").update({ status: "succeeded" }).eq("stripe_payment_intent_id", paymentIntentId)

      // Update order status
      await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          status: "processing",
        })
        .eq("id", orderId)

      // Get order details for escrow
      const { data: order } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (seller_id)
          )
        `)
        .eq("id", orderId)
        .single()

      if (order && order.order_items.length > 0) {
        // Create escrow transaction for each seller
        const sellerIds = [...new Set(order.order_items.map((item: any) => item.products.seller_id))]

        for (const sellerId of sellerIds) {
          const sellerAmount = order.order_items
            .filter((item: any) => item.products.seller_id === sellerId)
            .reduce((sum: number, item: any) => sum + item.price, 0)

          await supabase.from("escrow_transactions").insert({
            order_id: orderId,
            buyer_id: user.id,
            seller_id: sellerId,
            amount: sellerAmount,
            status: "held",
            held_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          })
        }
      }

      return NextResponse.json({ success: true, status: "succeeded" })
    } else {
      // Payment failed
      await supabase.from("payments").update({ status: "failed" }).eq("stripe_payment_intent_id", paymentIntentId)

      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          status: "cancelled",
        })
        .eq("id", orderId)

      return NextResponse.json({ success: false, status: "failed", error: "Payment failed" })
    }
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
