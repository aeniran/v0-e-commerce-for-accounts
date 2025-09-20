import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SellForm } from "@/components/sell-form"

export default async function SellPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile to check if they're a seller
  const { data: profile } = await supabase.from("profiles").select("is_seller").eq("id", data.user.id).single()

  if (!profile?.is_seller) {
    redirect("/dashboard?message=seller_required")
  }

  // Fetch categories for the form
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return <SellForm categories={categories || []} />
}
