"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  product_id: string
  user_id: string
  created_at: string
  products: {
    id: string
    title: string
    price: number
    images?: string[]
    categories: {
      name: string
      icon: string
    }
    profiles: {
      username: string
    }
  }
}

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  addToCart: (productId: string) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  totalAmount: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const fetchCartItems = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setItems([])
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          products (
            id,
            title,
            price,
            images,
            categories (name, icon),
            profiles (username)
          )
        `)
        .eq("user_id", user.id)

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error("Error fetching cart items:", error)
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if item already in cart
      const existingItem = items.find((item) => item.product_id === productId)
      if (existingItem) {
        toast({
          title: "Already in cart",
          description: "This item is already in your cart",
        })
        return
      }

      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
      })

      if (error) throw error

      await fetchCartItems()
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) throw error

      setItems(items.filter((item) => item.id !== itemId))
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      })
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (error) throw error
      setItems([])
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + item.products.price, 0)
  const itemCount = items.length

  useEffect(() => {
    fetchCartItems()
  }, [])

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
