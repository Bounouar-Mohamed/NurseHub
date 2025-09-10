'use client'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { format } from "date-fns"
import { 
  MapPin, 
  Camera, 
  Edit2, 
  MessageCircle, 
  Heart, 
  Bell, 
  Calendar as CalendarIcon,
  Clock,
  Phone,
  Mail,
  Award,
  BookOpen,
  Globe,
  Home,
  Briefcase,
  Languages,
  Shield,
  Activity,
  Users
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from '@/lib/supabase/client'
import { countries } from '@/lib/countries' // Ajouter ce fichier avec la liste des pays

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional(),
  phoneNumber: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  location: z.string().optional(),
  hometown: z.string().optional(),
  occupation: z.string().optional(),
  education: z.string().optional(),
  languages: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  relationship: z.enum(["single", "in_relationship", "married", "complicated"]).optional(),
  about: z.string().optional(),
  medicalSpecialty: z.string().optional(), // Pour les docteurs
  consultationHours: z.string().optional(), // Pour les docteurs
  insuranceAccepted: z.array(z.string()).default([]), // Pour les docteurs
  photos: z.array(z.string()).default([]),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: user?.email || "",
      interests: ["Cardiology", "Pediatrics", "Family Medicine", "Wellness", "Nutrition"],
      languages: ["English", "French"],
      photos: [
        "/images/placeholder.jpg",
        "/images/placeholder-2.jpg",
        "/images/placeholder-3.jpg",
        "/images/placeholder-4.jpg",
      ],
    },
  })

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile')
      }

      form.reset({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: user?.email || "",
        phoneNumber: data.phone_number || "",
        gender: data.gender || "prefer_not_to_say",
        dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
        location: data.location || "",
        hometown: data.hometown || "",
        occupation: data.occupation || "",
        education: data.education || "",
        languages: data.languages || ["English", "French"],
        interests: data.interests || ["Cardiology", "Pediatrics", "Family Medicine", "Wellness", "Nutrition"],
        relationship: data.relationship || "single",
        about: data.about || "",
        medicalSpecialty: data.medical_specialty || "",
        consultationHours: data.consultation_hours || "",
        insuranceAccepted: data.insurance_accepted || ["Insurance A", "Insurance B"],
        photos: data.photos || [
          "/images/placeholder.jpg",
          "/images/placeholder-2.jpg",
          "/images/placeholder-3.jpg",
          "/images/placeholder-4.jpg",
        ],
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch profile')
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user, form])

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update profile')
      }

      toast.success('Profile updated successfully')
      // setIsEditing(false) // This line is removed as per the new_code
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return
    setIsLoading(true)
    try {
      // Ici, vous pouvez implémenter l'envoi du message
      // Par exemple, via une API ou Supabase
      toast.success('Message sent successfully')
      setMessage("")
      setIsMessageDialogOpen(false)
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldEdit = async (field: string, value: any) => {
    setIsLoading(true)
    try {
      const updatedData = { [field]: value }
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error('Failed to update field')
      }

      form.setValue(field as any, value)
      toast.success('Updated successfully')
    } catch (error) {
      toast.error('Failed to update field')
    } finally {
      setIsLoading(false)
      setEditingField(null)
    }
  }

  const EditableField = ({ 
    label, 
    value, 
    field, 
    icon: Icon,
    type = "text",
    isPhone = false
  }: { 
    label: string
    value: string
    field: string
    icon: any
    type?: string
    isPhone?: boolean
  }) => {
    const [tempValue, setTempValue] = useState(value)
    const [selectedCountry, setSelectedCountry] = useState('FR')

    return (
      <div className="group rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-4">
          <Icon className="h-4 w-4 text-pink-500 shrink-0" />
          <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
            <span className="truncate select-none text-muted-foreground w-[140px] shrink-0">
              {label}
            </span>
            {editingField === field ? (
              <Input
                type={isPhone ? 'tel' : type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => {
                  if (tempValue !== value) handleFieldEdit(field, tempValue)
                  setEditingField(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur()
                  } else if (e.key === 'Escape') {
                    setTempValue(value)
                    setEditingField(null)
                  }
                }}
                className="w-full bg-transparent border-0 focus:ring-0 text-right"
                autoFocus
              />
            ) : (
              <button
                className="text-right w-full truncate hover:text-foreground transition-colors"
                onClick={() => setEditingField(field)}
              >
                {value || '-'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploadingAvatar(true)
    const supabase = createClient()

    try {
      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast.success('Profile photo updated')
      // Recharger les données du profil
      await fetchProfile()
    } catch (error) {
      toast.error('Error updating profile photo')
      console.error(error)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploadingCover(true)
    const supabase = createClient()

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-cover-${Math.random()}.${fileExt}`
      const filePath = `covers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cover_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast.success('Cover photo updated')
      await fetchProfile()
    } catch (error) {
      toast.error('Error updating cover photo')
      console.error(error)
    } finally {
      setUploadingCover(false)
    }
  }

  const { firstName, lastName, location, about, interests, photos } = form.getValues()
  const isDoctor = user?.user_metadata?.role === 'doctor'

  return (
    <div className="min-h-screen bg-gradient-to-b from-transparent to-[#78FCD6]/10 backdrop-blur-xl">
      <div className="container max-w-7xl mx-auto py-20 px-4">
        {/* Top Section - Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-pink-100/20">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.user_metadata?.avatar_url || '/placeholder-user.jpg'} />
                    <AvatarFallback>
                      {firstName?.[0]}{lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-700 p-1.5 rounded-full hover:bg-white shadow cursor-pointer"
                    htmlFor="avatar-upload"
                  >
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    />
                    {uploadingAvatar ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-700 border-t-transparent" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </label>
                </div>
                <h1 className="mt-4 text-2xl font-semibold">
                  {firstName} {lastName}
                  {isDoctor && (
                    <Badge variant="secondary" className="ml-2 bg-blue-50 text-blue-700">
                      Doctor
                    </Badge>
                  )}
                </h1>
                {location && (
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setIsMessageDialogOpen(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    // onClick={() => setIsEditing(true)} // This line is removed as per the new_code
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Quick Info */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Appointments Widget */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-pink-100/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-pink-500" />
                  Upcoming Appointments
                </h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <div className="space-y-3">
                {/* Example appointments - replace with real data */}
                <div className="flex items-center justify-between p-3 bg-pink-50/50 rounded-lg">
                  <div>
                    <p className="font-medium">Dr. Smith</p>
                    <p className="text-sm text-muted-foreground">General Checkup</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Tomorrow</p>
                    <p className="text-sm text-muted-foreground">09:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History Widget */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-pink-100/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-pink-500" />
                  Health Overview
                </h3>
                <Button variant="outline" size="sm">Details</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-pink-50/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="text-xl font-semibold text-pink-600">A+</p>
                </div>
                <div className="p-3 bg-pink-50/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-xl font-semibold text-pink-600">68 kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Personal Information */}
          <div className="bg-white/20 shadow-xl backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-sm border border-pink-100/20">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-pink-500" />
              Personal Information
            </h3>
            <dl className="space-y-1">
              <EditableField
                label="Phone"
                value={form.getValues().phoneNumber || ''}
                field="phoneNumber"
                icon={Phone}
                type="tel"
                isPhone={true}
              />
              <EditableField
                label="Location"
                value={form.getValues().location || ''}
                field="location"
                icon={MapPin}
              />
              <EditableField
                label="Hometown"
                value={form.getValues().hometown || ''}
                field="hometown"
                icon={Home}
              />
              <EditableField
                label="Occupation"
                value={form.getValues().occupation || ''}
                field="occupation"
                icon={Briefcase}
              />
              <EditableField
                label="Education"
                value={form.getValues().education || ''}
                field="education"
                icon={BookOpen}
              />
            </dl>
          </div>

          {/* Professional Information (For Doctors) */}
          {isDoctor && (
            <div className="mt-6 bg-white/20 shadow-xl backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-sm border border-pink-100/20">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-pink-500" />
                Professional Information
              </h3>
              <dl className="space-y-4">
                <EditableField
                  label="Medical Specialty"
                  value={form.getValues().medicalSpecialty || ''}
                  field="medicalSpecialty"
                  icon={Award}
                />
                <EditableField
                  label="Consultation Hours"
                  value={form.getValues().consultationHours || ''}
                  field="consultationHours"
                  icon={Clock}
                />
              </dl>
            </div>
          )}

          {/* Languages and Interests */}
          <div className="mt-6 bg-white/20 shadow-xl backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-sm border border-pink-100/20">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Languages className="h-5 w-5 text-pink-500" />
              Languages & Interests
            </h3>
            <dl className="space-y-1">
              <div className="group hover:bg-white/5 transition-colors rounded-lg py-2">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground w-[140px] shrink-0">
                    <Languages className="h-4 w-4 text-pink-500 shrink-0" />
                    <span className="truncate">Languages</span>
                  </dt>
                  <dd className="flex-1 flex items-center justify-end gap-2">
                    {editingField === 'languages' ? (
                      <div className="flex items-center gap-2 w-full">
                        <Input
                          value={form.getValues().languages?.join(", ")}
                          onChange={(e) => {
                            const newLanguages = e.target.value.split(",").map(s => s.trim())
                            handleFieldEdit('languages', newLanguages)
                          }}
                          className="bg-transparent border-0 focus:ring-0 px-0"
                          placeholder="Separate with commas"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <>
                        <span className="text-right">{form.getValues().languages?.join(", ") || '-'}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setEditingField('languages')}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </dd>
                </div>
              </div>

              <div className="group hover:bg-white/5 transition-colors rounded-lg py-2">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground w-[140px] shrink-0">
                    <Award className="h-4 w-4 text-pink-500 shrink-0" />
                    <span className="truncate">Interests</span>
                  </dt>
                  <dd className="flex-1 flex items-center justify-end gap-2">
                    {editingField === 'interests' ? (
                      <div className="flex items-center gap-2 w-full">
                        <Input
                          value={form.getValues().interests?.join(", ")}
                          onChange={(e) => {
                            const newInterests = e.target.value.split(",").map(s => s.trim())
                            handleFieldEdit('interests', newInterests)
                          }}
                          className="bg-transparent border-0 focus:ring-0 px-0"
                          placeholder="Separate with commas"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {form.getValues().interests?.map((interest, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setEditingField('interests')}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        {/* Bottom Section - Additional Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Specializations/Interests */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-pink-100/20">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-pink-500" />
              {isDoctor ? 'Specializations' : 'Interests'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests?.map((interest, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Insurance Information (Doctors Only) */}
          {isDoctor && (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-pink-100/20">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-pink-500" />
                Insurance Accepted
              </h3>
              <div className="flex flex-wrap gap-2">
                {form.getValues().insuranceAccepted?.map((insurance, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  >
                    {insurance}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Dialog */}
        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message to {firstName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsMessageDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Form Modal/Section */}
        {/* This section is removed as per the new_code */}
      </div>
    </div>
  )
} 