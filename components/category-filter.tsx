"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Filter } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Category {
  id: string
  name: string
  icon: string
}

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  const handleCategorySelect = (categoryName: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (categoryName) {
      params.set("category", categoryName.toLowerCase())
    } else {
      params.delete("category")
    }
    router.push(`/?${params.toString()}`)
  }

  const selectedCategory = categories.find((cat) => cat.name.toLowerCase() === currentCategory)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          {selectedCategory ? (
            <>
              <span>{selectedCategory.icon}</span>
              {selectedCategory.name}
            </>
          ) : (
            "All Categories"
          )}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleCategorySelect(null)}>All Categories</DropdownMenuItem>
        {categories.map((category) => (
          <DropdownMenuItem key={category.id} onClick={() => handleCategorySelect(category.name)} className="gap-2">
            <span>{category.icon}</span>
            {category.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
