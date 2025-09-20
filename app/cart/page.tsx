import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CartContent } from "@/components/cart-content"

export default async function CartPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return <CartContent />
}
