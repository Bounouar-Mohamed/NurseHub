"use client"

import PublicRoute from "@/components/auth/public-route"
import RegisterForm from "@/components/auth/register-form"

export default function Page() {
  return (
    <PublicRoute>
      <RegisterForm />
    </PublicRoute>
  )
} 