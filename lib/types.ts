export interface Provider {
  id: string
  name: string
  specialty: string
  rating: number
  modes: Array<"online" | "in-person">
  nextAvailable: string[] // ISO date-time slots
  price: { 
    duration: number
    amountAED: number 
  }
  tags: string[]
  avatar: string
  categories: string[] // Catégories de services que le provider peut fournir
}

export interface BookingIntent {
  query: string
  category: string
  mode: "online" | "in-person"
  urgency: "routine" | "same-day" | "asap"
  dateRange: { 
    from: string
    to: string 
  }
}

export type Category = {
  id: string
  name: string
  description: string
}

export const CATEGORIES: Category[] = [
  { id: "general", name: "General Medicine", description: "Regular checkups and general health concerns" },
  { id: "pediatrics", name: "Pediatrics", description: "Child healthcare and development" },
  { id: "dental", name: "Dental Care", description: "Dental and oral health services" },
  { id: "mental-health", name: "Mental Health", description: "Psychological and emotional wellbeing" },
  { id: "home-nursing", name: "Home Nursing", description: "Professional care in your home" },
  { id: "chronic-care", name: "Chronic Care", description: "Long-term condition management" }
] 