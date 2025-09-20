import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

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

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="text-6xl">{product.categories.icon}</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {product.categories.name}
            </Badge>
          </div>
          {product.verification_status && (
            <div className="absolute top-2 right-2">
              <Badge variant="default" className="text-xs bg-green-500">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          {product.followers_count && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {formatNumber(product.followers_count)}
            </div>
          )}
          {product.engagement_rate && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {product.engagement_rate}%
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.profiles.seller_rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">@{product.profiles.username}</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">{formatPrice(product.price)}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/product/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
