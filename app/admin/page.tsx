import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", data.user.id).single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  // Fetch admin dashboard data
  const [{ data: products }, { data: orders }, { data: users }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select(`
        *,
        categories (name, icon),
        profiles (username, full_name)
      `)
      .order("created_at", { ascending: false }),

    supabase
      .from("orders")
      .select(`
        *,
        profiles!orders_buyer_id_fkey (username, full_name),
        order_items (
          *,
          products (title, categories (name))
        )
      `)
      .order("created_at", { ascending: false }),

    supabase.from("profiles").select("*").order("created_at", { ascending: false }),

    supabase.from("categories").select("*").order("name"),
  ])

  return (
    <AdminDashboard products={products || []} orders={orders || []} users={users || []} categories={categories || []} />
  )
}
