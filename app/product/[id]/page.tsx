import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductDetails } from "@/components/product-details"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      categories (name, icon),
      profiles (username, full_name, seller_rating, avatar_url)
    `)
    .eq("id", id)
    .eq("status", "active")
    .single()

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}
