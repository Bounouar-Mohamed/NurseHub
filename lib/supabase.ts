import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  first_name: string
  last_name: string
  role: 'patient' | 'doctor' | 'admin'
  phone_number?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

export type Doctor = {
  id: string
  specialization: string
  license_number: string
  bio?: string
  consultation_fee: number
  created_at: string
  updated_at: string
}

export type DoctorAvailability = {
  id: string
  doctor_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
  updated_at: string
}

export type Appointment = {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  start_time: string
  end_time: string
  consultation_type: 'physical' | 'teleconsultation'
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  created_at: string
  updated_at: string
} 