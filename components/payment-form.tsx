"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { CreditCard, Lock, Shield } from "lucide-react"

interface PaymentFormProps {
  onPaymentSubmit: (paymentData: PaymentData) => void
  isProcessing: boolean
  totalAmount: number
}

interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvc: string
  cardholderName: string
  billingAddress: {
    address: string
    city: string
    zipCode: string
    country: string
  }
}

export function PaymentForm({ onPaymentSubmit, isProcessing, totalAmount }: PaymentFormProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardholderName: "",
    billingAddress: {
      address: "",
      city: "",
      zipCode: "",
      country: "US",
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "")
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`
    }
    return v
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.cardNumber = "Please enter a valid card number"
    }

    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    }

    if (!paymentData.cvc || paymentData.cvc.length < 3) {
      newErrors.cvc = "Please enter a valid CVC"
    }

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = "Please enter the cardholder name"
    }

    if (!paymentData.billingAddress.address.trim()) {
      newErrors.address = "Please enter your billing address"
    }

    if (!paymentData.billingAddress.city.trim()) {
      newErrors.city = "Please enter your city"
    }

    if (!paymentData.billingAddress.zipCode.trim()) {
      newErrors.zipCode = "Please enter your ZIP code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onPaymentSubmit(paymentData)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "cardNumber") {
      value = formatCardNumber(value)
    } else if (field === "expiryDate") {
      value = formatExpiryDate(value)
    } else if (field === "cvc") {
      value = value.replace(/\D/g, "").slice(0, 4)
    }

    if (field.startsWith("billingAddress.")) {
      const addressField = field.split(".")[1]
      setPaymentData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value,
        },
      }))
    } else {
      setPaymentData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              maxLength={19}
              className={errors.cardNumber ? "border-red-500" : ""}
            />
            {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                maxLength={5}
                className={errors.expiryDate ? "border-red-500" : ""}
              />
              {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={paymentData.cvc}
                onChange={(e) => handleInputChange("cvc", e.target.value)}
                maxLength={4}
                className={errors.cvc ? "border-red-500" : ""}
              />
              {errors.cvc && <p className="text-sm text-red-500">{errors.cvc}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={paymentData.cardholderName}
              onChange={(e) => handleInputChange("cardholderName", e.target.value)}
              className={errors.cardholderName ? "border-red-500" : ""}
            />
            {errors.cardholderName && <p className="text-sm text-red-500">{errors.cardholderName}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St"
              value={paymentData.billingAddress.address}
              onChange={(e) => handleInputChange("billingAddress.address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                value={paymentData.billingAddress.city}
                onChange={(e) => handleInputChange("billingAddress.city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="10001"
                value={paymentData.billingAddress.zipCode}
                onChange={(e) => handleInputChange("billingAddress.zipCode", e.target.value)}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={paymentData.billingAddress.country}
              onValueChange={(value) => handleInputChange("billingAddress.country", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <h4 className="font-semibold text-blue-900">Secure Payment</h4>
        </div>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Your payment information is encrypted and secure</p>
          <p>• Funds are held in escrow until account transfer is complete</p>
          <p>• 7-day buyer protection period for all purchases</p>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
        <Lock className="w-4 h-4 mr-2" />
        {isProcessing ? "Processing Payment..." : `Pay ${formatPrice(totalAmount)}`}
      </Button>
    </form>
  )
}
