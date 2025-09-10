'use client'

import { Provider } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BookingSummaryProps {
  provider: Provider | null
  selectedTime: string | null
  onProceed: () => void
}

export function BookingSummary({
  provider,
  selectedTime,
  onProceed,
}: BookingSummaryProps) {
  if (!provider || !selectedTime) return null

  const date = new Date(selectedTime)
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
      <div className="container max-w-7xl mx-auto py-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="font-medium">Selected Appointment</h4>
                <p className="text-sm text-muted-foreground">
                  {provider.name} — {formattedDate} at {formattedTime}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {provider.price.duration} min
                </Badge>
                <Badge variant="secondary">
                  AED {provider.price.amountAED}
                </Badge>
              </div>
            </div>
            
            <Button onClick={onProceed}>
              Proceed to Checkout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 