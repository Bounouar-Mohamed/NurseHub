'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format, isSameDay, parseISO, addDays, isAfter, isBefore } from "date-fns"
import {
  CalendarIcon,
  SearchIcon,
  CheckIcon,
  ArrowRightIcon,
  VideoIcon,
  HomeIcon,
  ClockIcon,
  MapPinIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  UserIcon,
  FileTextIcon,
  StarIcon,
  FilterIcon
} from "lucide-react"

import ProtectedRoute from "@/components/auth/protected-route"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { createClient } from "@/lib/supabase/client-pages"
import type { Provider, BookingIntent } from '@/lib/types'
import { cn } from "@/lib/utils"

// Types
interface BookingData {
  provider: Provider | null
  date: Date | null
  time: string | null
  mode: "online" | "in-person" | null
  patientInfo: {
    name: string
    phone: string
    email: string
  }
  address: {
    building: string
    apartment: string
    street: string
    area: string
    directions: string
  }
  reason: string
  notes: string
}

// Custom hooks
function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProviders() {
      try {
        const supabase = createClient()
        const { data, error: dbError } = await supabase
          .from('doctor_list')
          .select('*')

        if (dbError) {
          setError('Failed to load healthcare professionals')
          return
        }

        if (!data?.length) {
          setError('No healthcare professionals available')
          return
        }

        const formatted = data.map(doctor => ({
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty,
          rating: doctor.rating || 0,
          modes: doctor.modes || ['online'],
          nextAvailable: doctor.next_available || [],
          price: {
            duration: doctor.duration || 30,
            amountAED: doctor.amount_aed || 0
          },
          tags: doctor.next_available?.length ? ['Available'] : ['No Availability'],
          avatar: doctor.avatar_url || '/images/placeholder-user.jpg',
          categories: doctor.categories || [doctor.specialty?.toLowerCase().replace(/\s+/g, '-') || 'general']
        }))

        setProviders(formatted)
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [])

  return { providers, loading, error }
}

function useBookingFlow() {
  const [bookingData, setBookingData] = useState<BookingData>({
    provider: null,
    date: null,
    time: null,
    mode: null,
    patientInfo: { name: '', phone: '', email: '' },
    address: { building: '', apartment: '', street: '', area: '', directions: '' },
    reason: '',
    notes: ''
  })

  const [currentStep, setCurrentStep] = useState<'browse' | 'details' | 'confirm'>('browse')
  const [filters, setFilters] = useState({ search: '', category: '', mode: '' })

  const updateBookingData = useCallback((updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }))
  }, [])

  const isStepValid = useCallback((step: typeof currentStep) => {
    switch (step) {
      case 'browse':
        return !!(bookingData.provider && bookingData.date && bookingData.time)
      case 'details':
        return !!(bookingData.mode && bookingData.reason &&
          bookingData.patientInfo.name && bookingData.patientInfo.phone && bookingData.patientInfo.email &&
          (bookingData.mode === 'online' ||
            (bookingData.address.building && bookingData.address.apartment &&
              bookingData.address.street && bookingData.address.area)))
      default:
        return true
    }
  }, [bookingData])

  return {
    bookingData,
    currentStep,
    filters,
    updateBookingData,
    setCurrentStep,
    setFilters,
    isStepValid
  }
}

// Main component
export default function BookAppointmentPage() {
  const { providers, loading, error } = useProviders()
  const {
    bookingData,
    currentStep,
    filters,
    updateBookingData,
    setCurrentStep,
    setFilters,
    isStepValid
  } = useBookingFlow()
  const router = useRouter()

  const steps = [
    { id: "browse", label: "Browse" },
    { id: "details", label: "Details" },
    { id: "confirm", label: "Confirm" },
  ]

  const percent = currentStep === "browse" ? 33 : currentStep === "details" ? 66 : 100
  const activeIndex = steps.findIndex(s => s.id === currentStep)

  // Filtered providers
  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      const matchesSearch = !filters.search ||
        provider.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(filters.search.toLowerCase())

      const matchesCategory = !filters.category ||
        provider.categories.includes(filters.category)

      const matchesMode = !filters.mode ||
        provider.modes.includes(filters.mode as "online" | "in-person")

      return matchesSearch && matchesCategory && matchesMode
    })
  }, [providers, filters])

  // Available dates for selected provider
  const availableDates = useMemo(() => {
    if (!bookingData.provider) return []

    return bookingData.provider.nextAvailable
      .filter(time => isAfter(parseISO(time), new Date()))
      .map(time => format(parseISO(time), 'yyyy-MM-dd'))
      .filter((date, index, self) => self.indexOf(date) === index) // Remove duplicates
      .sort()
  }, [bookingData.provider])

  // Available times for selected provider and date
  const availableTimes = useMemo(() => {
    if (!bookingData.provider || !bookingData.date) return []

    return bookingData.provider.nextAvailable
      .filter(time => {
        const timeDate = parseISO(time)
        return isSameDay(timeDate, bookingData.date!) && isAfter(timeDate, new Date())
      })
      .sort((a, b) => parseISO(a).getTime() - parseISO(b).getTime())
  }, [bookingData.provider, bookingData.date])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading healthcare professionals...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mt-16 sm:mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Book an Appointment</h1>
                <p className="text-muted-foreground mt-2">
                  {currentStep === 'browse' && 'Find and select your healthcare professional'}
                  {currentStep === 'details' && 'Complete your booking details'}
                  {currentStep === 'confirm' && 'Review and confirm your appointment'}
                </p>
              </div>
              {currentStep !== 'browse' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentStep === 'details') {
                      setCurrentStep('browse')
                    } else if (currentStep === 'confirm') {
                      setCurrentStep('details')
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to {currentStep === 'details' ? 'Browse' : 'Details'}
                </Button>
              )}
            </div>

            {/* Progress */}
            <div className="space-y-4">
              {/* Step indicators */}
              <div className="flex justify-between items-center">
                {steps.map((step, idx) => {
                  const isDone = idx < activeIndex
                  const isActive = idx === activeIndex

                  return (
                    <div key={step.id} className="flex flex-col items-center space-y-1">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300",
                          isDone || isActive
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-400"
                        )}
                      >
                        {isDone
                          ? <CheckIcon className="w-4 h-4" />
                          : <span className="font-medium">{idx + 1}</span>
                        }
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium transition-colors duration-300",
                          isDone || isActive
                            ? "text-black"
                            : "text-gray-400"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full overflow-hidden bg-gray-300">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          {currentStep === 'browse' && (
            <BrowseStep
              providers={filteredProviders}
              bookingData={bookingData}
              filters={filters}
              onUpdateBooking={updateBookingData}
              onSetFilters={setFilters}
              onNextStep={() => setCurrentStep('details')}
              isStepValid={isStepValid('browse')}
              availableTimes={availableTimes}
              availableDates={availableDates}
            />
          )}

          {currentStep === 'details' && (
            <DetailsStep
              bookingData={bookingData}
              onUpdateBooking={updateBookingData}
              onNextStep={() => setCurrentStep('confirm')}
              isStepValid={isStepValid('details')}
            />
          )}

          {currentStep === 'confirm' && (
            <ConfirmStep
              bookingData={bookingData}
              onConfirm={() => router.push('/appointments')}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

// Browse Step Component
interface BrowseStepProps {
  providers: Provider[]
  bookingData: BookingData
  filters: { search: string; category: string; mode: string }
  onUpdateBooking: (updates: Partial<BookingData>) => void
  onSetFilters: (filters: { search: string; category: string; mode: string }) => void
  onNextStep: () => void
  isStepValid: boolean
  availableTimes: string[]
  availableDates: string[]
}

function BrowseStep({
  providers,
  bookingData,
  filters,
  onUpdateBooking,
  onSetFilters,
  onNextStep,
  isStepValid,
  availableTimes,
  availableDates
}: BrowseStepProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for a healthcare professional..."
                  className="pl-9"
                  value={filters.search}
                  onChange={(e) => onSetFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            {/* <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              Filters
            </Button> */}
          </div>
        </Card>

        {/* All Professionals Horizontal Scroll */}
        <Card className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">All Healthcare Professionals</h3>
            <p className="text-sm text-muted-foreground">Scroll to browse all available professionals</p>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
              {providers.map((provider) => (
                <div key={provider.id} className="w-72 flex-shrink-0">
                  <Card
                    className={cn(
                      "p-5 transition-all cursor-pointer group",
                      bookingData.provider?.id === provider.id
                        ? ""
                        : "hover:border-primary/50 hover:shadow-md"
                    )}
                    onClick={() => onUpdateBooking({ provider, time: null })}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14">
                          <img src={provider.avatar} alt={provider.name} />
                        </Avatar>
                        <div className="absolute -top-1 -right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base truncate">{provider.name}</h4>
                            <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{provider.rating}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-5">
                          {provider.modes.map((mode) => (
                            <Badge key={mode} variant="secondary" className="text-xs">
                              {mode === "online" ? "👩‍💻 Online" : "🏥 In-Person"}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-end">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition-all",
                            bookingData.provider?.id === provider.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                          )}>
                            {bookingData.provider?.id === provider.id ? "Selected" : "Select"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Selected Professional and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <Card className="p-4 h-fit">
            <div className="space-y-4">

              <div>
                <h4 className="font-medium mb-2">Select Appointment Date</h4>
                <p className="text-sm text-muted-foreground">
                  Choose a date to see available time slots
                </p>
              </div>

              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={bookingData.date || undefined}
                  onSelect={(date) => onUpdateBooking({ date, time: null })}
                  className="rounded-md border"
                  disabled={(date) => {
                    // If no provider is selected, disable past dates only
                    if (!bookingData.provider) {
                      return isBefore(date, new Date()) && !isSameDay(date, new Date())
                    }

                    // If provider is selected, only allow dates where they are available
                    const dateStr = format(date, 'yyyy-MM-dd')
                    const isInPast = isBefore(date, new Date()) && !isSameDay(date, new Date())
                    const isAvailable = availableDates.includes(dateStr)

                    return isInPast || !isAvailable
                  }}
                  fromDate={new Date()}
                  toDate={addDays(new Date(), 30)}
                />
              </div>

              {bookingData.provider && (
                <div className="pt-4 border-t">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Consultation Fee</span>
                      <span className="font-medium">AED {bookingData.provider.price.amountAED}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration</span>
                      <span>{bookingData.provider.price.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Dates</span>
                      <span>{availableDates.length} dates</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Slots</span>
                      <span>{availableTimes.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Selected Professional Profile */}
        <div className="lg:col-span-2 flex flex-col justify-between h-full">
          {bookingData.provider ? (
            <Card className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <img src={bookingData.provider.avatar} alt={bookingData.provider.name} />
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{bookingData.provider.name}</h3>
                      <p className="text-muted-foreground">{bookingData.provider.specialty}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{bookingData.provider.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          AED {bookingData.provider.price.amountAED}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {bookingData.provider.modes.map((mode) => (
                        <Badge key={mode} variant="secondary" className="text-xs">
                          {mode === "online" ? "👩‍💻 Online" : "🏥 In-Person"}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">About</h4>
                      <p className="text-sm text-muted-foreground">
                        Experienced healthcare professional specializing in {bookingData.provider.specialty.toLowerCase()}.
                        Available for both online consultations and home visits.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">Consultation</Badge>
                        <Badge variant="outline" className="text-xs">Follow-up</Badge>
                        <Badge variant="outline" className="text-xs">Emergency Care</Badge>
                        <Badge variant="outline" className="text-xs">Preventive Care</Badge>
                      </div>
                    </div>

                    {bookingData.date && availableTimes.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Available Time Slots</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {availableTimes.map((time) => (
                            <button
                              key={time}
                              onClick={() => onUpdateBooking({ time })}
                              className={cn(
                                "px-3 py-2 text-sm rounded border transition-all",
                                bookingData.time === time
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              {format(parseISO(time), 'HH:mm')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium mb-2">Select a Professional</h4>
              <p className="text-sm text-muted-foreground">
                Choose a healthcare professional from the list above to view their profile and available time slots.
              </p>
            </Card>
          )}
          {/* Navigation */}
          <div className="flex justify-between">
            <div></div>
            <Button
              onClick={() => {
                onNextStep()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={!isStepValid}
              className="px-8"
            >
              Continue to Details
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

      </div>

    </div>
  )
}

// Provider Card Component
interface ProviderCardProps {
  provider: Provider
  isSelected: boolean
  selectedDate: Date | null
  selectedTime: string | null
  availableTimes: string[]
  onSelect: (provider: Provider) => void
  onTimeSelect: (time: string) => void
}

function ProviderCard({
  provider,
  isSelected,
  selectedDate,
  selectedTime,
  availableTimes,
  onSelect,
  onTimeSelect
}: ProviderCardProps) {
  return (
    <Card className={cn(
      "p-4 transition-all cursor-pointer",
      isSelected ? "ring-2 ring-primary" : "hover:border-primary/50"
    )}>
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <img src={provider.avatar} alt={provider.name} />
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold truncate">{provider.name}</h4>
              <p className="text-sm text-muted-foreground">{provider.specialty}</p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <StarIcon className="h-4 w-4 text-yellow-500" />
              <span>{provider.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {provider.modes.map((mode) => (
              <Badge key={mode} variant="secondary" className="text-xs">
                {mode === "online" ? "👩‍💻 Online" : "🏥 In-Person"}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium ml-1">AED {provider.price.amountAED}</span>
            </div>
            <Button
              size="sm"
              onClick={() => onSelect(provider)}
              variant={isSelected ? "secondary" : "outline"}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </div>

      {/* Time slots */}
      {isSelected && selectedDate && availableTimes.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h5 className="text-sm font-medium mb-2">Available Time Slots</h5>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                className={cn(
                  "px-3 py-2 text-xs rounded border transition-all",
                  selectedTime === time
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                {format(parseISO(time), 'HH:mm')}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

// Details Step Component
interface DetailsStepProps {
  bookingData: BookingData
  onUpdateBooking: (updates: Partial<BookingData>) => void
  onNextStep: () => void
  isStepValid: boolean
}

function DetailsStep({
  bookingData,
  onUpdateBooking,
  onNextStep,
  isStepValid
}: DetailsStepProps) {
  if (!bookingData.provider) return null

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="p-6 bg-black/10 border-primary/20">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <img src={bookingData.provider.avatar} alt={bookingData.provider.name} />
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{bookingData.provider.name}</h3>
            <p className="text-muted-foreground">{bookingData.provider.specialty}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{bookingData.date && format(bookingData.date, 'dd MMMM yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>{bookingData.time && format(parseISO(bookingData.time), 'HH:mm')}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <UserIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Input
                value={bookingData.patientInfo.name}
                onChange={(e) => onUpdateBooking({
                  patientInfo: { ...bookingData.patientInfo, name: e.target.value }
                })}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <Input
                value={bookingData.patientInfo.phone}
                onChange={(e) => onUpdateBooking({
                  patientInfo: { ...bookingData.patientInfo, phone: e.target.value }
                })}
                placeholder="+971 XX XXX XXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                value={bookingData.patientInfo.email}
                onChange={(e) => onUpdateBooking({
                  patientInfo: { ...bookingData.patientInfo, email: e.target.value }
                })}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
        </Card>

        {/* Consultation Type */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <VideoIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Consultation Type</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => onUpdateBooking({ mode: "online" })}
              className={cn(
                "p-4 border rounded-lg text-left transition-all",
                bookingData.mode === "online"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-3">
                <VideoIcon className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-medium">Video Consultation</h4>
                  <p className="text-sm text-muted-foreground">Online appointment</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateBooking({ mode: "in-person" })}
              className={cn(
                "p-4 border rounded-lg text-left transition-all",
                bookingData.mode === "in-person"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-3">
                <HomeIcon className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-medium">Home Visit</h4>
                  <p className="text-sm text-muted-foreground">Professional comes to you</p>
                </div>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* Address (if home visit) */}
      {bookingData.mode === "in-person" && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPinIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Visit Address</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Building/Number *</label>
              <Input
                value={bookingData.address.building}
                onChange={(e) => onUpdateBooking({
                  address: { ...bookingData.address, building: e.target.value }
                })}
                placeholder="Building name or number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Apartment/Villa *</label>
              <Input
                value={bookingData.address.apartment}
                onChange={(e) => onUpdateBooking({
                  address: { ...bookingData.address, apartment: e.target.value }
                })}
                placeholder="Apartment number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Street *</label>
              <Input
                value={bookingData.address.street}
                onChange={(e) => onUpdateBooking({
                  address: { ...bookingData.address, street: e.target.value }
                })}
                placeholder="Street name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Area/District *</label>
              <Input
                value={bookingData.address.area}
                onChange={(e) => onUpdateBooking({
                  address: { ...bookingData.address, area: e.target.value }
                })}
                placeholder="Area or district"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Additional Instructions</label>
              <Input
                value={bookingData.address.directions}
                onChange={(e) => onUpdateBooking({
                  address: { ...bookingData.address, directions: e.target.value }
                })}
                placeholder="Instructions to find the address (optional)"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Consultation Details */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileTextIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Consultation Details</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Reason for Visit *</label>
            <select
              value={bookingData.reason}
              onChange={(e) => onUpdateBooking({ reason: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-black/10"
              required
            >
              <option value="">Select a reason</option>
              <option value="first">First Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="urgent">Urgent Care</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes for the Professional</label>
            <textarea
              value={bookingData.notes}
              onChange={(e) => onUpdateBooking({ notes: e.target.value })}
              placeholder="Describe your symptoms, medical history, or questions..."
              className="w-full px-3 py-2 border rounded-md h-24 resize-none bg-black/10"
            />
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            onNextStep()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          disabled={!isStepValid}
        >
          Continue to Confirm
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Confirm Step Component
interface ConfirmStepProps {
  bookingData: BookingData
  onConfirm: () => void
}

function ConfirmStep({ bookingData, onConfirm }: ConfirmStepProps) {
  if (!bookingData.provider) return null

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="p-6 bg-black/10 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Booking Summary</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <img src={bookingData.provider.avatar} alt={bookingData.provider.name} />
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium">{bookingData.provider.name}</h4>
              <p className="text-muted-foreground">{bookingData.provider.specialty}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{bookingData.date && format(bookingData.date, 'EEEE, MMMM d • h:mm a')}</span>
                </div>
                <div className="flex items-center gap-1">
                  {bookingData.mode === 'online' ? (
                    <><VideoIcon className="w-4 h-4" /> Video Consultation</>
                  ) : (
                    <><HomeIcon className="w-4 h-4" /> Home Visit</>
                  )}
                </div>
              </div>
            </div>

          </div>

          {bookingData.mode === 'in-person' && (
            <div className="border-t pt-4">
              <div className="flex items-start gap-2 text-sm">
                <MapPinIcon className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
                <div className="text-muted-foreground">
                  <p>{bookingData.address.building}</p>
                  <p>Apartment {bookingData.address.apartment}</p>
                  <p>{bookingData.address.street}</p>
                  <p>{bookingData.address.area}, Dubai</p>
                  {bookingData.address.directions && (
                    <p className="mt-1 text-xs">{bookingData.address.directions}</p>
                  )}
                </div>
              </div>
            </div>
          )}




        </div>
      </Card>

      {/* Payment Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Consultation</span>
            <span>AED {bookingData.provider.price.amountAED}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration</span>
            <span>{bookingData.provider.price.duration} minutes</span>
          </div>
          {bookingData.mode === "in-person" && (
            <div className="flex justify-between">
              <span>Travel Fee</span>
              <span>Included</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>AED {bookingData.provider.price.amountAED}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={onConfirm} className="px-8">
          <CreditCardIcon className="h-4 w-4 mr-2" />
          Proceed to Payment
        </Button>
      </div>
    </div>
  )
} 