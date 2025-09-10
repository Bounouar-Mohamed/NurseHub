"use client"

import PublicRoute from "@/components/auth/public-route"
import LoginPage from "@/components/auth/login-form"

export default function Page() {
  return (
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  )
} 