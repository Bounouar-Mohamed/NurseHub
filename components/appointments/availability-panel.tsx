'use client'

import { useState } from "react"
import { Provider } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvailabilityPanelProps {
  providers: Provider[]
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  onTimeSelect: (provider: Provider, time: string) => void
}

export function AvailabilityPanel({
  providers,
  selectedDate,
  onDateSelect,
  onTimeSelect,
}: AvailabilityPanelProps) {
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null)

  const toggleProvider = (providerId: string) => {
    setExpandedProvider(expandedProvider === providerId ? null : providerId)
  }

  return (
    <Card className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Select Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            className="rounded-md border"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Available Specialists</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {providers.map((provider) => (
              <Card
                key={provider.id}
                className={cn(
                  "p-4 transition-all",
                  expandedProvider === provider.id && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <img src={provider.avatar} alt={provider.name} />
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{provider.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {provider.specialty}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">
                            {provider.rating}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleProvider(provider.id)}
                        >
                          {expandedProvider === provider.id ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {provider.modes.map((mode) => (
                        <Badge key={mode} variant="secondary" className="capitalize">
                          {mode}
                        </Badge>
                      ))}
                    </div>

                    {expandedProvider === provider.id && (
                      <div className="mt-4 space-y-3">
                        <div className="text-sm text-muted-foreground">
                          {provider.price.duration} min — AED {provider.price.amountAED}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {provider.nextAvailable.map((time) => {
                            const date = new Date(time)
                            return (
                              <Button
                                key={time}
                                variant="outline"
                                size="sm"
                                onClick={() => onTimeSelect(provider, time)}
                              >
                                {date.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
} 