"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
      <Input
        type="text"
        placeholder="Search accounts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="min-w-[300px]"
      />
      <Button type="submit" size="icon">
        <Search className="w-4 h-4" />
      </Button>
    </form>
  )
}
