import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { SearchBar } from "@/components/search-bar"
import { CartButton } from "@/components/cart-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage() {
  const supabase = createServerSupabaseClient()

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch categories for filter
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch featured products
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories (name, icon),
      profiles (username, seller_rating)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(12)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                SocialMarket
              </Link>
              <SearchBar />
            </div>
            <div className="flex items-center gap-4">
              <CartButton />
              <Link href="/sell">
                <Button variant="outline">Start Selling</Button>
              </Link>
              {user ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button>Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Buy & Sell Premium
            <span className="text-primary"> Social Media Accounts</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Discover verified accounts across all major platforms. From gaming accounts to content channels, find your
            perfect digital asset.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="#products">Browse Accounts</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sell">List Your Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Categories */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.name.toLowerCase()}`}
                className="flex flex-col items-center p-6 bg-card rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-sm text-center">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Accounts</h2>
            <CategoryFilter categories={categories || []} />
          </div>
          <ProductGrid products={products || []} />
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Safe & Secure Trading</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We ensure every transaction is protected with our verification system and secure payment processing.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold mb-2">Verified Accounts</h3>
              <p className="text-sm text-muted-foreground">All accounts are verified before listing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">Protected transactions with escrow service</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold mb-2">Rated Sellers</h3>
              <p className="text-sm text-muted-foreground">Community-driven seller reputation system</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">SocialMarket</h3>
              <p className="text-sm text-muted-foreground">
                The trusted marketplace for premium social media accounts and digital assets.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platforms</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/category/freefire">FreeFire</Link>
                </li>
                <li>
                  <Link href="/category/tiktok">TikTok</Link>
                </li>
                <li>
                  <Link href="/category/instagram">Instagram</Link>
                </li>
                <li>
                  <Link href="/category/youtube">YouTube</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/safety">Safety Tips</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SocialMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
