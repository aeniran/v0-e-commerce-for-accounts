"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface Category {
  id: string
  name: string
  icon: string
}

interface SellFormProps {
  categories: Category[]
}

export function SellForm({ categories }: SellFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    followers_count: "",
    engagement_rate: "",
    account_age_months: "",
    verification_status: false,
    images: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase.from("products").insert({
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category_id: formData.category_id,
        seller_id: user.id,
        followers_count: formData.followers_count ? Number.parseInt(formData.followers_count) : null,
        engagement_rate: formData.engagement_rate ? Number.parseFloat(formData.engagement_rate) : null,
        account_age_months: formData.account_age_months ? Number.parseInt(formData.account_age_months) : null,
        verification_status: formData.verification_status,
        images: formData.images.length > 0 ? formData.images : null,
        status: "active",
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your listing has been created successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating listing:", error)
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">List Your Account</h1>
            <p className="text-muted-foreground">
              Create a listing for your social media account. Provide accurate details to attract buyers.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="title">Account Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Premium Instagram Account with 50K Followers"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Platform *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange("category_id", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="99.99"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your account, its niche, engagement rate, and any special features..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="followers">Followers Count</Label>
                    <Input
                      id="followers"
                      type="number"
                      min="0"
                      placeholder="50000"
                      value={formData.followers_count}
                      onChange={(e) => handleInputChange("followers_count", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="engagement">Engagement Rate (%)</Label>
                    <Input
                      id="engagement"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="3.5"
                      value={formData.engagement_rate}
                      onChange={(e) => handleInputChange("engagement_rate", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="age">Account Age (months)</Label>
                    <Input
                      id="age"
                      type="number"
                      min="0"
                      placeholder="24"
                      value={formData.account_age_months}
                      onChange={(e) => handleInputChange("account_age_months", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={formData.verification_status}
                    onCheckedChange={(checked) => handleInputChange("verification_status", checked as boolean)}
                  />
                  <Label htmlFor="verified" className="text-sm">
                    This account is verified by the platform
                  </Label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Provide accurate information to build trust with buyers</li>
                    <li>• Account transfer will be facilitated after payment confirmation</li>
                    <li>• Our team will verify account details before listing approval</li>
                    <li>• You'll receive payment after successful account transfer</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creating Listing..." : "Create Listing"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
