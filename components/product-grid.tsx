import { ProductCard } from "./product-card"

interface Product {
  id: string
  title: string
  description: string
  price: number
  followers_count?: number
  engagement_rate?: number
  verification_status: boolean
  images?: string[]
  categories: {
    name: string
    icon: string
  }
  profiles: {
    username: string
    seller_rating: number
  }
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
