"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface EscrowTransaction {
  id: string
  amount: number
  status: string
  held_until: string
  created_at: string
}

interface EscrowStatusProps {
  transactions: EscrowTransaction[]
  userType: "buyer" | "seller"
}

export function EscrowStatus({ transactions, userType }: EscrowStatusProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "held":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "released":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "refunded":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Shield className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "held":
        return "bg-yellow-500"
      case "released":
        return "bg-green-500"
      case "refunded":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (transactions.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Escrow Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(transaction.status)}
              <div>
                <div className="font-medium">{formatPrice(transaction.amount)}</div>
                <div className="text-sm text-muted-foreground">
                  {transaction.status === "held" && userType === "buyer" && (
                    <>Protected until {formatDate(transaction.held_until)}</>
                  )}
                  {transaction.status === "held" && userType === "seller" && (
                    <>Funds held until {formatDate(transaction.held_until)}</>
                  )}
                  {transaction.status === "released" && <>Released on {formatDate(transaction.created_at)}</>}
                  {transaction.status === "refunded" && <>Refunded on {formatDate(transaction.created_at)}</>}
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-blue-800">
            {userType === "buyer" ? (
              <>
                <p className="font-medium mb-1">Buyer Protection:</p>
                <p>
                  Your payment is held securely until you confirm receipt of the account. You have 7 days to report any
                  issues.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium mb-1">Seller Protection:</p>
                <p>
                  Funds will be released to you automatically after the protection period, or when the buyer confirms
                  receipt.
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
