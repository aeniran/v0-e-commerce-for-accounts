"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, TrendingUp, Shield, ShoppingCart, Heart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  title: string
  description: string
  price: number
  followers_count?: number
  engagement_rate?: number
  account_age_months?: number
  verification_status: boolean
  images?: string[]
  platform_specific_data?: any
  categories: {
    name: string
    icon: string
  }
  profiles: {
    username: string
    full_name?: string
    seller_rating: number
    avatar_url?: string
  }
}

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()
  const router = useRouter()

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

  const handleBuyNow = async () => {
    await addToCart(product.id)
    router.push("/cart")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  <span className="text-8xl">{product.categories.icon}</span>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  {product.categories.icon} {product.categories.name}
                </Badge>
                {product.verification_status && (
                  <Badge variant="default" className="bg-green-500">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <div className="text-4xl font-bold text-primary mb-4">{formatPrice(product.price)}</div>
            </div>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {product.followers_count && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{formatNumber(product.followers_count)}</div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                    </div>
                  )}
                  {product.engagement_rate && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{product.engagement_rate}%</div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                    </div>
                  )}
                  {product.account_age_months && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-muted-foreground">📅</div>
                      <div>
                        <div className="font-semibold">{product.account_age_months} months</div>
                        <div className="text-xs text-muted-foreground">Account Age</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={product.profiles.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{product.profiles.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{product.profiles.full_name || `@${product.profiles.username}`}</div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{product.profiles.seller_rating.toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">seller rating</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleBuyNow}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => addToCart(product.id)}>
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
