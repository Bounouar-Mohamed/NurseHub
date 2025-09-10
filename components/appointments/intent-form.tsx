'use client'

import { useState } from "react"
import { BookingIntent, CATEGORIES } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface IntentFormProps {
  onIntentSubmit: (intent: BookingIntent) => void
}

export function IntentForm({ onIntentSubmit }: IntentFormProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [mode, setMode] = useState<"online" | "in-person">("online")
  const [urgency, setUrgency] = useState<"routine" | "same-day" | "asap">("routine")

  const [suggestions] = useState([
    "follow-up",
    "mental health",
    "nurse visit",
    "newborn check",
    "chronic condition",
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    onIntentSubmit({
      query,
      category,
      mode,
      urgency,
      dateRange: {
        from: today.toISOString(),
        to: thirtyDaysFromNow.toISOString(),
      },
    })
  }

  return (
    <div className="h-full flex flex-col">

      <div className="p-6 flex-1 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Query Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">What brings you here?</label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe symptoms or goals briefly..."
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium">
              Select Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="" disabled>Choose category</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Preferred Care Type</label>
            <div className="flex gap-2">
              {(["online", "in-person"] as const).map((m) => (
                <Button
                  key={m}
                  type="button"
                  variant={mode === m ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setMode(m)}
                >
                  {m === "online" ? "Online" : "In-person"}
                </Button>
              ))}
            </div>
          </div>

          {/* Urgency Select */}
          <div className="space-y-2">
            <label htmlFor="urgency" className="block text-sm font-medium">
              Urgency
            </label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as "routine" | "same-day" | "asap")}
              className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="routine">Routine</option>
              <option value="same-day">Same-day</option>
              <option value="asap">ASAP</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Find Specialists
          </Button>
        </form>
      </div>
    </div>
  )
} 