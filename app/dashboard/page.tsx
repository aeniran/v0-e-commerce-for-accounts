import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get user's products if they're a seller
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories (name, icon)
    `)
    .eq("seller_id", data.user.id)
    .order("created_at", { ascending: false })

  // Get user's orders
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (title, categories (name))
      )
    `)
    .eq("buyer_id", data.user.id)
    .order("created_at", { ascending: false })

  return <DashboardContent user={data.user} profile={profile} products={products || []} orders={orders || []} />
}
