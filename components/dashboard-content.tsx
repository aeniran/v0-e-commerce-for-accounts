"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { Plus, Package, ShoppingBag, Settings, LogOut } from "lucide-react"

interface Profile {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  is_seller: boolean
  seller_rating: number
  total_sales: number
}

interface Product {
  id: string
  title: string
  price: number
  status: string
  created_at: string
  categories: {
    name: string
    icon: string
  }
}

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  order_items: Array<{
    products: {
      title: string
      categories: {
        name: string
      }
    }
  }>
}

interface DashboardContentProps {
  user: User
  profile: Profile | null
  products: Product[]
  orders: Order[]
}

export function DashboardContent({ user, profile, products, orders }: DashboardContentProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "sold":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              SocialMarket
            </Link>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="font-medium">{profile?.full_name || profile?.username || "User"}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.full_name || profile?.username || "User"}!
          </h1>
          <p className="text-muted-foreground">Manage your account, listings, and orders from your dashboard.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.filter((p) => p.status === "active").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>

          {profile?.is_seller && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Seller Rating</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">⭐</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.seller_rating.toFixed(1)}</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {profile?.is_seller && <TabsTrigger value="listings">My Listings</TabsTrigger>}
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{order.order_items[0]?.products.title || "Order"}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(order.total_amount)}</div>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No orders yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild className="w-full">
                    <Link href="/">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Browse Marketplace
                    </Link>
                  </Button>
                  {profile?.is_seller && (
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/sell">
                        <Plus className="w-4 h-4 mr-2" />
                        List New Account
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/dashboard?tab=settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {profile?.is_seller && (
            <TabsContent value="listings" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Listings</h2>
                <Button asChild>
                  <Link href="/sell">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Listing
                  </Link>
                </Button>
              </div>

              {products.length > 0 ? (
                <div className="grid gap-4">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{product.categories.icon}</div>
                            <div>
                              <h3 className="font-semibold">{product.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {product.categories.name} • Listed {new Date(product.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{formatPrice(product.price)}</div>
                            <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No listings yet</h3>
                    <p className="text-muted-foreground mb-4">Start selling by creating your first listing</p>
                    <Button asChild>
                      <Link href="/sell">Create Listing</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">Order History</h2>

            {orders.length > 0 ? (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()} • {order.order_items.length} item(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatPrice(order.total_amount)}</div>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">Browse the marketplace to make your first purchase</p>
                  <Button asChild>
                    <Link href="/">Browse Marketplace</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Account settings functionality will be implemented in the next phase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
