import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckoutContent } from "@/components/checkout-content"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return <CheckoutContent />
}
