import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

interface OrderSuccessPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (title, categories (name))
      )
    `)
    .eq("id", id)
    .eq("buyer_id", data.user.id)
    .single()

  if (!order) {
    redirect("/dashboard")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            SocialMarket
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono">#{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold">{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{order.order_items.length}</span>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Purchased Accounts:</h4>
                <div className="space-y-2">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="text-sm">
                      {item.products.title} ({item.products.categories.name})
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• Account details will be sent to your email within 24 hours</p>
              <p>• Our team will verify the transfer and ensure account security</p>
              <p>• You'll receive login credentials and transfer instructions</p>
              <p>• Contact support if you have any questions</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/dashboard">View Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
