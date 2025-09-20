"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import Link from "next/link"

export function CartButton() {
  const { itemCount } = useCart()

  return (
    <Button variant="outline" size="sm" asChild className="relative bg-transparent">
      <Link href="/cart">
        <ShoppingCart className="w-4 h-4" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
