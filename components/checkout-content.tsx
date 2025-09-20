"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { PaymentForm } from "@/components/payment-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvc: string
  cardholderName: string
  billingAddress: {
    address: string
    city: string
    zipCode: string
    country: string
  }
}

export function CheckoutContent() {
  const { items, totalAmount, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<"payment" | "processing" | "success">("payment")
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    if (items.length === 0) return

    setIsProcessing(true)
    setCurrentStep("processing")

    try {
      // Create order first
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            price: item.products.price,
          })),
          total_amount: totalAmount,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const { orderId } = await orderResponse.json()

      // Create payment intent
      const paymentIntentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          orderId,
        }),
      })

      if (!paymentIntentResponse.ok) {
        throw new Error("Failed to create payment intent")
      }

      const { paymentIntentId } = await paymentIntentResponse.json()

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Confirm payment
      const confirmResponse = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          orderId,
          paymentData,
        }),
      })

      const confirmResult = await confirmResponse.json()

      if (confirmResult.success) {
        await clearCart()
        toast({
          title: "Payment successful!",
          description: "Your order has been placed successfully.",
        })
        router.push(`/order-success/${orderId}`)
      } else {
        throw new Error(confirmResult.error || "Payment failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
      setCurrentStep("payment")
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "processing") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
            <p className="text-muted-foreground">Please wait while we process your payment securely...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              SocialMarket
            </Link>
            <Link href="/cart">
              <Button variant="outline">Back to Cart</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div>
              <PaymentForm
                onPaymentSubmit={handlePaymentSubmit}
                isProcessing={isProcessing}
                totalAmount={totalAmount}
              />
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                        {item.products.images && item.products.images.length > 0 ? (
                          <img
                            src={item.products.images[0] || "/placeholder.svg"}
                            alt={item.products.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-lg">{item.products.categories.icon}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.products.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {item.products.categories.name}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium">{formatPrice(item.products.price)}</div>
                    </div>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Escrow Protection</span>
                      <span className="text-green-600">Included</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-xs text-muted-foreground space-y-2">
                <p>By placing this order, you agree to our Terms of Service and Privacy Policy.</p>
                <p>Account details will be delivered via email within 24 hours after payment confirmation.</p>
                <p>Your payment is protected by our escrow service and 7-day buyer protection guarantee.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
